# 0003. Berlin data sources and rollout order

- **Status:** Accepted
- **Date:** 2026-11-15

## Context

We want to visualize as much Berlin data as possible. We need to know which sources
are reliable and free, and in what order to add them, so that early work builds
reusable map patterns (lines, heatmaps, live markers, choropleths) instead of
one-off code.

## Decision

### Primary sources

| Source | What it offers | Access |
| --- | --- | --- |
| [daten.berlin.de](https://daten.berlin.de) | Berlin's official open data portal: thousands of datasets in CSV, JSON and GeoJSON | Free, no key |
| [Geoportal Berlin](https://gdi.berlin.de) | Official geodata over WFS. Request `outputFormat=application/json&srsName=EPSG:4326` to get GeoJSON in lat/lon (the default is EPSG:25833) | Free, no key |
| [Amt für Statistik Berlin-Brandenburg](https://www.statistik-berlin-brandenburg.de) | Population and social statistics by district and LOR | Free downloads |
| [OpenStreetMap Overpass API](https://overpass-api.de) | Any point of interest (cafés, drinking fountains, bike shops…) | Free, fair use |

Verified working: district boundaries from
`https://gdi.berlin.de/services/wfs/alkis_bezirke?service=WFS&version=2.0.0&request=GetFeature&typeNames=alkis_bezirke:bezirksgrenzen&outputFormat=application/json&srsName=EPSG:4326`
(12 features, name in `namgem`). The landing page uses this.

### Dataset backlog by theme

Status: ✅ live · 🟡 next · ⬜ later

**Mobility**

| Dataset | Source | Visualization | Status |
| --- | --- | --- | --- |
| Reachable BVG stations | `v6.bvg.transport.rest` | Markers by transport type | ✅ |
| Road works and closures | VIZ Berlin (`api.viz.berlin.de`) | Markers + affected-section lines | ✅ |
| Bike-sharing availability | Nextbike public GBFS feed | Live markers with bike counts | 🟡 |
| Bike counters | daten.berlin.de ("Fahrradzählstellen") | Markers with sparklines | ⬜ |
| Traffic accidents | Unfallatlas (unfallatlas.statistikportal.de) | Heatmap, filter by bike/car/pedestrian | ⬜ |
| EV charging stations | Bundesnetzagentur charging-station register | Clustered markers | ⬜ |
| Planes overhead | OpenSky Network API | Live moving markers | ⬜ |
| Live departures / disruptions | `v6.bvg.transport.rest` | Station board, landing-page ticker | ⬜ |

**Environment**

| Dataset | Source | Visualization | Status |
| --- | --- | --- | --- |
| Current weather | OpenWeather (or Bright Sky / DWD, free and keyless) | Landing-page live strip | ✅ |
| Air quality (NO₂, PM10) | BLUME network (luftdaten.berlin.de), UBA API | Colored station markers | 🟡 |
| Street trees | Geoportal ("Baumbestand") | Heatmap, filter by species and age | 🟡 |
| Noise | Geoportal (strategic noise maps) | Overlay | ⬜ |
| Bathing water quality | LAGeSo bathing spots (daten.berlin.de) | Lake markers with status | ⬜ |
| Solar roof potential | Energieatlas / Solaratlas Berlin | Choropleth | ⬜ |

**Living**

| Dataset | Source | Visualization | Status |
| --- | --- | --- | --- |
| Rent by district | Hardcoded sample (`src/components/utils/berlinRent.ts`, 10 of 12 districts) | Choropleth + markers | ✅ (sample) |
| Official rent index | Mietspiegel / Wohnlagenkarte (Geoportal) | Replaces the sample data | ⬜ |
| Land values | Bodenrichtwerte (BORIS Berlin / Geoportal) | Choropleth | ⬜ |
| Schools and daycare centers | Schulverzeichnis, Kitaverzeichnis (daten.berlin.de) | Markers, "what's near me" | ⬜ |
| Parks and playgrounds | Geoportal (Grünanlagen, Spielplätze) | Polygons | ⬜ |
| Public toilets | daten.berlin.de | Markers | ⬜ |

**Society**

| Dataset | Source | Visualization | Status |
| --- | --- | --- | --- |
| Population, age, migration | Statistik BB, by LOR | Choropleth, district comparison | 🟡 |
| Election results | wahlen-berlin.de (per polling district) | Choropleth by party | ⬜ |
| Crime by area | Polizei Berlin "Kriminalitätsatlas" (daten.berlin.de) | Choropleth by offense type | ⬜ |
| Events and Christmas markets | daten.berlin.de / berlin.de | Seasonal markers | ⬜ |

**History**

| Dataset | Source | Visualization | Status |
| --- | --- | --- | --- |
| Berlin Wall route | Geoportal ("Mauerverlauf") | Line overlay | 🟡 |
| Stolpersteine | stolpersteine-berlin.de, Wikidata | Markers with biographies | ⬜ |
| Listed monuments | Denkmalkarte Berlin | Markers | ⬜ |

### Rollout order

The 🟡 datasets come first. Each one is free, needs no key, and introduces a different map pattern:

1. **Berlin Wall route**: line overlay
2. **Street trees**: heatmap over a large dataset (needs server-side caching, see [ADR 0002](0002-config-driven-data-layers.md))
3. **Air quality**: hourly-refreshing markers with status colors
4. **Bike sharing**: live polling layer
5. **District population**: choropleth metric on the landing page

After these five, almost every backlog item reuses an existing pattern.

## Consequences

- Each dataset added should record its source name, URL and license in its layer config, and show attribution on the map.
- Some sources publish German-only field names. Normalize to English on the backend.
- Sources can change URLs or schemas without notice. Route tests (`server/tests/`) mock upstream calls, so add a small manual smoke check per source to the README when adding it.
- The rent data is a hardcoded sample covering 10 of 12 districts (Pankow and Reinickendorf are missing). The landing page shows those two as "No data" until the official rent index replaces the sample.
