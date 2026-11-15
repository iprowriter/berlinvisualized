# 0004. Overview landing page

- **Status:** Accepted
- **Date:** 2026-11-15

## Context

The app opened straight into the search map, and the sidebar's **Overview** entry showed
a placeholder heading. As more datasets arrive ([ADR 0003](0003-berlin-data-sources.md)),
users need a starting point that shows what the app knows about Berlin at a glance and
routes them to the detailed views, without the landing page growing every time a layer is added.

## Decision

**Overview** becomes the default view and is laid out top to bottom as:

```
┌──────────────────────────────────────────────────────────────┐
│  HERO: title, one-line pitch, [🔍 Search an address…]        │
├──────────────────────────────────────────────────────────────┤
│  LIVE STRIP: ☀ weather · 🌫 air · 🚲 bikes · 🚇 disruptions   │
├───────────────────────────────────┬──────────────────────────┤
│  DISTRICT MAP: 12 districts       │  DISTRICT SNAPSHOT       │
│  colored by one metric            │  selected district's     │
│  [Rent] [Population] [Trees] …    │  numbers + ranking table │
├───────────────────────────────────┴──────────────────────────┤
│  EXPLORE BY THEME: Mobility · Environment · Living ·         │
│                    Society · History (cards)                 │
├──────────────────────────────────────────────────────────────┤
│  DATA STORY: one curated story linking to a detailed map     │
└──────────────────────────────────────────────────────────────┘
```

1. **Search first.** The hero search hands the query to the Map view, which runs it
   immediately. The existing search map stays the detailed view.
2. **Live strip.** One chip per live signal. Chips for datasets that don't exist yet
   render as muted "coming soon" chips, so the layout is final and the chips light up
   as datasets land.
3. **District choropleth, one metric at a time.** Berlin's 12 districts are few enough
   to read at a glance. A metric switcher sits above the map. Metrics without data yet
   are disabled with a "coming soon" hint.
   - Color: one-hue sequential blue ramp (5 classes, light → dark = low → high),
     matching the app's brand blue. Districts without data are a neutral gray and
     appear in the legend as "No data". Never a rainbow.
   - Basemap: a light, low-detail tile set (CARTO Positron) so fills stay readable.
   - Hovering a district shows a tooltip; clicking selects it.
4. **District snapshot.** The selected district's numbers, plus a ranked table of all
   districts for the active metric. The table doubles as the accessible,
   non-color view of the map.
5. **Theme cards.** One card per theme with its live layer count and a link into the
   relevant view. Themes with no layers yet show "coming soon". Once
   [ADR 0002](0002-config-driven-data-layers.md)'s layer registry exists, the counts
   come from it.
6. **Data story.** One curated card. The first story is rent across districts, the
   only district-level dataset available today.
7. **District boundaries** come from Geoportal Berlin via a new backend route,
   `GET /api/districts`, cached for 24 hours.

## Consequences

- The landing page's structure is final now, and later sessions only fill in data.
  Turning on a metric or a live chip should be a config change in
  `src/components/Overview/overviewConfig.ts`.
- Until the layer registry from ADR 0002 exists, theme cards and metrics are
  configured by hand in `overviewConfig.ts`. That file is the place to migrate later.
- "Coming soon" placeholders are visible to users. That's acceptable for a project
  under active development, and better than a layout that reshuffles as features arrive.
- The district map depends on Geoportal Berlin being reachable. The backend cache softens
  short outages. If the source is down on a cold start, the map shows an error message
  and the rest of the page still works.
