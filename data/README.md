# Data

Raw datasets for the layers planned in [ADR 0003](../docs/adr/0003-berlin-data-sources.md),
downloaded on **2026-11-15**. All GeoJSON is WGS84 (EPSG:4326).

## Layout

```
data/
├── README.md       # this file (tracked)
├── sources.json    # manifest: source URL, license, record count, size and checksum per file (tracked)
├── raw/            # the downloaded files (gitignored: third-party data, ~470 MB)
└── map/            # offline basemap, berlin.pmtiles (gitignored, see "Offline basemap" below)
```

The files in `raw/` aren't ours to redistribute and are too large for git, so they're **not committed**.
`sources.json` records where each one came from so it can be downloaded again:

- `method: "wfs" | "http" | "api"`: re-downloadable from `url` (for `api`, convert as described in `notes`).
  Every entry currently has a `url`; all were checked to resolve on 2026-11-15.
- `method: "manual"`: reserved for files downloaded by hand from `page` without a recorded file URL. No entry uses it today; avoid adding new ones.
- Some URLs are versioned and go stale when a new edition comes out: Statistik BB's hashed
  `download.statistik-berlin-brandenburg.de` links and the date-stamped BNetzA register. For those,
  `page` is where the current link is published.
- `licenseVerified: false`: license not yet confirmed on the publisher's page. Check before shipping the layer.
- `bytes` / `sha256`: what was downloaded on `fetchedAt`, to detect when a source has changed.

The tables below list the folders inside `raw/`.

Licenses for Geoportal and daten.berlin.de entries come from the catalog metadata. The others
(BVG/VBB, Nextbike, Unfallatlas, BNetzA, bike counters, Statistik BB, wahlen-berlin.de) haven't
been checked against the publisher's page yet. Confirm each one before shipping its layer with attribution.

Field names are mostly German, as published. Per ADR 0003, normalize them to English in the backend routes.

Geoportal WFS URLs follow this pattern (add `&count=N&startIndex=M&sortBy=<id field>` to page large layers):

```
https://gdi.berlin.de/services/wfs/<service>?service=WFS&version=2.0.0&request=GetFeature&typeNames=<service>:<layer>&outputFormat=application/json&srsName=EPSG:4326
```

Daten.berlin.de's CKAN API is behind a bot challenge. The same catalog is available
without one at `https://datenregister.berlin.de/api/3/action/package_search?q=...`.

> ⚠️ Statistik Berlin-Brandenburg's old `/opendata/*.csv` links (used by many daten.berlin.de
> entries) all return 404 now. Their current files live on `download.statistik-berlin-brandenburg.de`
> and are linked from the series pages (e.g. `statistik-berlin-brandenburg.de/a-i-16-hj`).

## boundaries/

| File | Records | Source | License |
| --- | --- | --- | --- |
| `districts.geojson` | 12 districts (name in `namgem`) | Geoportal WFS `alkis_bezirke:bezirksgrenzen` | dl-de-zero-2.0 |
| `lor_planning_areas_2021.geojson` | 542 planning areas (PLR) | Geoportal WFS `lor_2021:a_lor_plr_2021` | cc-by-de/3.0 |
| `lor_district_regions_2021.geojson` | 143 district regions (BZR) | Geoportal WFS `lor_2021:b_lor_bzr_2021` | cc-by-de/3.0 |
| `lor_forecast_areas_2021.geojson` | 58 forecast areas (PGR) | Geoportal WFS `lor_2021:c_lor_pgr_2021` | cc-by-de/3.0 |

## mobility/

| File | Records | Source | License |
| --- | --- | --- | --- |
| `bvg_stations.geojson` | 26,679 stations (all of VBB, not only Berlin) | `v6.bvg.transport.rest/stops`, converted | ISC (API) / VBB data |
| `nextbike_stations_snapshot.geojson` | 1,080 stations with bike counts at download time | Nextbike GBFS `nextbike_bn`: `station_information` joined with `station_status` | Nextbike open data |
| `traffic_accidents_2025_berlin.csv` | 13,280 accidents with injuries (`ULAND=11`; lon/lat in `XGCSWGS84`/`YGCSWGS84`, comma decimals) | Unfallatlas: `opengeodata.nrw.de/.../Unfallorte2025_EPSG25832_CSV.zip`, filtered to Berlin | dl-de-by-2.0 |
| `traffic_accidents_schema.ini` | Column types for the above | `csv/schema.ini` from the same zip | |
| `ev_charging_stations_bnetza_berlin_2026-11-12.csv` | 5,104 charging sites in Berlin | Bundesnetzagentur Ladesäulenregister (`data.bundesnetzagentur.de`, date-stamped CSV), filtered to Berlin | CC BY 4.0 |
| `ev_charging_stations.xlsx` | Berlin's own (older) charging list | berlin.de (`emobility__ladesaeulen_.xlsx`, via daten.berlin.de) | cc-by-sa |
| `bike_counters_hourly.xlsx` | Hourly counts per bike counter | berlin.de (SenUMVK Fahrradzählstellen) | dl-de-zero-2.0 |

## environment/

| File | Records | Source | License |
| --- | --- | --- | --- |
| `street_trees.geojson` | 434,765 street trees (species, planting year, height…) | Geoportal WFS `baumbestand:strassenbaeume`. Redundant ID fields dropped, coordinates rounded to 6 decimals | dl-de-zero-2.0 |
| `air_quality_stations_luftdaten.geojson` | 15 active BLUME stations | `luftdaten.berlin.de/api/stations` | dl-de-zero-2.0 |
| `air_quality_stations_active.geojson` | 15 active stations (Umweltatlas metadata) | Geoportal WFS `ua_luftguetemessnetz:a_mc_aktuell` | dl-de-zero-2.0 |
| `air_quality_passive_samplers_active.geojson`, `air_quality_rubis_samplers_active.geojson` | 9 + 21 passive samplers | Geoportal WFS `ua_luftguetemessnetz` | dl-de-zero-2.0 |
| `bathing_spots.geojson` | 39 bathing spots | Geoportal WFS `badegewaesser:aa_badestellen` | cc-by/4.0 |
| `bathing_water_quality_latest.csv` | 39 spots, latest LAGeSo readings (`;`-separated) | `data.lageso.de/baden/0_letzte/letzte.csv` | cc-by |

Not downloaded: **noise** (strategic noise map 2022 has 3.8M polygons). Use it as a WMS overlay
(`https://gdi.berlin.de/services/wms/ua_stratlaerm_2022`) instead.

## living/

| File | Records | Source | License |
| --- | --- | --- | --- |
| `rent_index_table_2026.pdf` | Official Mietspiegel 2026 €/m² table | `mietspiegel.berlin.de/wp-content/uploads/2026/05/` | |
| `rent_index_mietspiegel_2026.pdf`, `rent_index_documentation_2026.pdf`, `rent_index_residential_location_map_2026.pdf` | Full Mietspiegel, method documentation, location map | `mietspiegel.berlin.de/wp-content/uploads/2026/{05,07}/` | |
| `rent_index_residential_location_2026.geojson` | 400,505 addresses with location class (`wol`: einfach/mittel/gut) | Geoportal WFS `wohnlagenadr2026` | dl-de-zero-2.0 |
| `land_values_2025.geojson` | 1,619 land value zones (Bodenrichtwerte 01.01.2025) | Geoportal WFS `brw2025:brw_2025_vector` | dl-de-zero-2.0 |
| `schools.geojson` | 929 schools | Geoportal WFS `schulen:schulen` | dl-de-zero-2.0 |
| `daycare_centers_2025-11.xlsx` | Kita list Nov 2025 (addresses, no coordinates) | berlin.de `kitaliste-nov-2025.xlsx` (daten.berlin.de "Kitas in Berlin") | cc-by |
| `parks.geojson` | 2,563 green spaces | Geoportal WFS `gruenanlagen:gruenanlagen` | dl-de-zero-2.0 |
| `playgrounds.geojson` | 1,886 playgrounds | Geoportal WFS `gruenanlagen:spielplaetze` | dl-de-zero-2.0 |
| `public_toilets.geojson` / `public_toilets.xlsx` | 525 toilets | Geoportal WFS `toiletten:toiletten` / berlin.de | dl-de-zero-2.0 / cc-by |

## society/

| File | Records | Source | License |
| --- | --- | --- | --- |
| `population_lor_2026-06-30.xlsx` / `.pdf` | Population per LOR planning area, 30.06.2026 (report A I 16) | Statistik Berlin-Brandenburg, report page `a-i-16-hj` | CC BY 3.0 DE |
| `population_districts_2026-06-30.xlsx` / `.pdf` | Population by district, age, nationality, 30.06.2026 (report A I 5) | Statistik Berlin-Brandenburg, report page `a-i-5-hj` | CC BY 3.0 DE |
| `population_register_methodology.pdf` | Methodology of the population register statistics | Statistik Berlin-Brandenburg | |
| `social_monitoring_2023_indices_lor.geojson` | 542 planning areas with social status indices (MSS 2023) | Geoportal WFS `mss_2023:mss2023_indizes_542` | dl-de-zero-2.0 |
| `election_berlin_2026_results_by_polling_district.xlsx` | Abgeordnetenhaus + BVV 2026 results per polling district | wahlen-berlin.de `BE2026/Afspraes/AGH/downloads.html` | |
| `election_berlin_2026_report.pdf` | Official statistical report on the 2026 election | wahlen-berlin.de `BE2026/Afspraes/AGH/downloads.html` | |
| `crime_atlas_2016-2025.xlsx` | Crime counts per district/district region, 2016–2025 | Polizei Berlin Kriminalitätsatlas (`berlin.de/polizei/.../fallzahlen_hz-2016-2025.xlsx`) | cc-by-sa |
| `christmas_markets.geojson` | 47 Christmas markets | berlin.de Weihnachtsmärkte simple_search, GeoJSON export | cc-by |

## history/

| File | Records | Source | License |
| --- | --- | --- | --- |
| `berlin_wall_border_wall.geojson` | 118 lines: front wall | Geoportal WFS `berlinermauer:a_grenzmauer` | dl-de-zero-2.0 |
| `berlin_wall_hinterland_wall.geojson` | 123 lines: hinterland wall | `berlinermauer:b_hinterlandmauer` | dl-de-zero-2.0 |
| `berlin_wall_political_border.geojson` | 34 lines: political border | `berlinermauer:c_politischegrenze` | dl-de-zero-2.0 |
| `berlin_wall_border_strip.geojson` | 67 polygons: border strip | `berlinermauer:d_grenzstreifen` | dl-de-zero-2.0 |
| `listed_monuments.geojson` | 9,578 listed monuments | Geoportal WFS `denkmale:denkmale` | dl-de-zero-2.0 |
| `stolpersteine.csv` | 11,094 Stolpersteine with coordinates and biography links | `stolpersteine-berlin.de/de/stolpersteine-finden/download` | cc-by |

## snapshots/

Point-in-time copies of **live** sources, useful as test fixtures and for offline development.
The app itself should fetch these live through the backend (ADR 0002).

| File | Live endpoint |
| --- | --- |
| `bvg_stops_raw.json` | `https://v6.bvg.transport.rest/stops` |
| `nextbike_*.json` | `https://gbfs.nextbike.net/maps/gbfs/v2/nextbike_bn/de/<feed>.json` |
| `air_quality_index_latest.json` | `https://luftdaten.berlin.de/api/lqi` (coordinates in EPSG:25833) |
| `air_quality_stations_luftdaten.json` | `https://luftdaten.berlin.de/api/stations` |
| `air_quality_components.json` | `https://luftdaten.berlin.de/api/components` |

Hourly readings per station: `https://luftdaten.berlin.de/api/stations/<code>/data?period=1h&timespan=custom&start=<ISO>&end=<ISO>`.

## Offline basemap

`map/berlin.pmtiles` is an OpenStreetMap vector basemap of Berlin (plus a small margin), extracted
from the latest daily [Protomaps](https://docs.protomaps.com/basemaps/downloads) planet build. It lets the
map render without calling `tile.openstreetmap.org`, whose usage policy forbids bulk downloading tiles.

```bash
brew install pmtiles     # once
npm run map:download     # runs scripts/download-map.sh
```

The script only fetches the Berlin bounding box (`12.95,52.28,13.90,52.73`) through HTTP range requests.
Map data © OpenStreetMap contributors (ODbL): keep that attribution visible wherever the map is shown.
