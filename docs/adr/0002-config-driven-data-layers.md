# 0002. Config-driven data layers behind a caching backend

- **Status:** Accepted
- **Date:** 2026-11-15

## Context

The goal is to visualize as many Berlin datasets as possible (see [ADR 0003](0003-berlin-data-sources.md)).
Today each dataset is wired by hand: a backend route, a fetch helper, an entry in
`useReactLeafletMapStore`, a marker component, and extra code in `SearchMap` to load it.
At 3 datasets that's fine; at 30 it won't scale.

Datasets also differ a lot in how often they change:

| Freshness | Examples | Sensible cache |
| --- | --- | --- |
| Static | District boundaries, Berlin Wall route, monuments | 24 h or longer |
| Slow | Street trees, schools, rent index, population | 24 h |
| Hourly | Air quality, weather | 10–60 min |
| Live | Bike sharing, BVG departures, flights | 30–60 s |

Several sources also have rate limits (OpenWeather free tier, Nominatim's usage policy)
or need an API key that must stay on the server.

## Decision

1. **Every dataset is a layer described by one config object** in a frontend layer
   registry, extending today's `MapLayer` type:

   ```ts
   interface LayerConfig {
     id: string;                 // "street_trees"
     name: string;               // "Street trees"
     theme: ThemeId;             // "mobility" | "environment" | "living" | "society" | "history"
     kind: "marker" | "heatmap" | "line" | "polygon" | "choropleth";
     endpoint: string;           // "/api/layers/street-trees"
     scope: "citywide" | "nearby"; // nearby = needs lat/lon from a search
     refreshMs?: number;         // live layers poll; static layers don't
     render?: ...;               // custom marker/popup, as today
     source: { name: string; url: string; license: string };
   }
   ```

   The map, the layer toggle panel, and the landing page's theme cards all read from
   this registry. Adding a dataset means adding a config object and a backend route,
   with no edits to `SearchMap` or the toggle panel.

2. **The frontend never calls third-party APIs directly.** Every dataset goes through
   an Express route under `/api/...`. The route:
   - keeps API keys on the server,
   - normalizes the response to GeoJSON (or a small typed JSON shape) in WGS84 (EPSG:4326),
   - caches in memory with a per-route TTL taken from the freshness table above.

3. **Themes are fixed:** Mobility, Environment, Living, Society, History. A dataset
   belongs to exactly one theme.

4. **District-level data is joined by district name** (the `namgem` property of the
   Geoportal district boundaries, e.g. `"Friedrichshain-Kreuzberg"`). Data that comes
   per LOR (planning area) gets aggregated to districts on the backend for the landing
   page, and can be shown at LOR level on detail views later.

## Consequences

- Adding a dataset becomes mostly mechanical: one route, one config object, one test.
- The landing page can show live counts per theme for free, because it reads the same registry.
- An in-memory cache is lost on restart and isn't shared between instances. That's fine
  for a single-server hobby deployment. If the app is ever scaled out, swap it for Redis
  or a file cache behind the same helper.
- Normalizing on the backend means the server needs reprojection for sources that only
  serve EPSG:25833. Geoportal WFS can reproject itself (`srsName=EPSG:4326`), so ask for that first.
- Migrating the three existing layers (location, BVG, road works) into the registry is
  the first task when this is implemented.
