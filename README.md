# Berlin Visualized

[![CI](https://github.com/iprowriter/berlinvisualized/actions/workflows/ci.yml/badge.svg)](https://github.com/iprowriter/berlinvisualized/actions/workflows/ci.yml)

**What is it like to be in this part of Berlin: right now, and over time?**

Berlin publishes a remarkable amount of open data: live transit, road works, air quality, rents, crime, green space, schools, social monitoring. It is scattered across dozens of portals, formats and spatial units, so in practice almost nobody uses it to answer everyday questions. Berlin Visualized brings it together on one map, so anyone can look at an address or a district and understand it at a glance.

It combines two kinds of information:

- **Right now:** what is happening around an address today: public transport, road works and closures, weather.
- **Over time:** what an area is like structurally: rents, safety, green space, schools and services, compared across districts.

**Who it is for:** people moving to or within Berlin, residents comparing neighbourhoods, and anyone curious about how the city works.

**Principles**

- **Official open data only.** Every number traces back to a published source, with its licence recorded in [`data/sources.json`](data/sources.json).
- **Areas, not people.** All data describes places at district or planning-area level. The app stores no personal data and describes what an area measures, not who lives there.
- **One map, many layers.** Each dataset is a layer you can switch on or off, added through configuration rather than new pages ([ADR 0002](docs/adr/0002-config-driven-data-layers.md)).

### What works today

- **Overview:** the 12 districts compared on a map, with a live strip of current conditions
- **Address search:** what's around any Berlin address
  - **Public transport:** BVG stations reachable from the address, with icons for S-Bahn, tram and bus
  - **Road works:** construction sites and closures within 1 km, with affected road sections drawn as lines
  - **Rents:** median and average rent per m² by district
  - **Weather:** current conditions in Berlin

### What's next

58 datasets from Berlin's open data portals are already catalogued and downloaded (see [`data/README.md`](data/README.md) and [ADR 0003](docs/adr/0003-berlin-data-sources.md)). The next step is a data pipeline that cleans them and loads them into PostgreSQL/PostGIS, so they can be served as map layers and district comparisons.

## Tech stack

| Part | Tools |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Leaflet / react-leaflet, Zustand, lucide-react |
| Backend | Node.js, Express 5, TypeScript (ts-node), axios |
| Tests | Vitest, Supertest, jsdom |

### Data sources

- [Nominatim / OpenStreetMap](https://nominatim.org/) for geocoding
- [BVG REST API (v6.bvg.transport.rest)](https://v6.bvg.transport.rest/) for reachable stations
- [VIZ Berlin](https://viz.berlin.de/) for construction sites and road closures
- [OpenWeather](https://openweathermap.org/api) for current weather (needs a free API key)
- [Geoportal Berlin](https://gdi.berlin.de) for district boundaries

The frontend never calls these services directly. It goes through the Express backend, which keeps the API key on the server and caches weather responses for 60 s to stay inside OpenWeather's free tier.

## Getting started

### Prerequisites

- Node.js 20+
- A free [OpenWeather API key](https://home.openweathermap.org/api_keys)

### Install

```bash
# Frontend
npm install

# Backend
cd server && npm install && cd ..
```

### Configure

Copy the example env files and fill in your key:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

| File | Variable | Purpose |
| --- | --- | --- |
| `server/.env` | `OPENWEATHER_API_KEY` | Your OpenWeather API key |
| `server/.env` | `PORT` | Backend port (default in the example: `5001`) |
| `.env` | `VITE_API_URL` | Backend URL the frontend calls (`http://localhost:5001`) |

If you change `PORT`, change `VITE_API_URL` to match.

> **macOS note:** don't use port 5000. The AirPlay Receiver already listens on it and answers every request with `403 Forbidden`. Also avoid 6000, which browsers block as an unsafe port.

### Run

```bash
npm run startDev   # starts backend and frontend together
```

Or run them separately with `npm run server` and `npm run dev`. The app is served at http://localhost:5173.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run startDev` | Run backend + frontend concurrently |
| `npm run dev` | Frontend dev server (Vite) |
| `npm run server` | Backend dev server |
| `npm run build` | Type-check and build the frontend |
| `npm run lint` | ESLint |
| `npm test` | Frontend unit tests |
| `npm run test:server` | Backend unit and route tests |
| `npm run test:all` | Both test suites |

Every push to `main` and every pull request runs lint, both test suites, the server type-check and the production build in [GitHub Actions](.github/workflows/ci.yml).

## API

All endpoints are served by the backend under `/api`.

| Endpoint | Query | Returns |
| --- | --- | --- |
| `GET /api/nominatim` | `address` | `{ lat, lon, display_name, boundingbox }` for the best match |
| `GET /api/bvg` | `lat`, `lon`, `address` | Stations reachable from the location |
| `GET /api/berlin-constructions` | `lat`, `lon` | `{ nearby: Feature[] }`: construction sites within 1 km |
| `GET /api/open-weather` | `lat`, `lon` | OpenWeather current weather (cached for 60 s) |
| `GET /api/districts` | none | The 12 district boundaries as GeoJSON (from Geoportal Berlin, cached 24 h) |
| `GET /api/rent` | none | Sample rent data |

Missing parameters return `400`. Upstream failures return `500` (`502` for `/api/districts`).

## Project structure

```
├── src/
│   ├── apiCalls/          # Typed fetch helpers for the backend
│   ├── components/
│   │   ├── Overview/      # Landing page: hero search, live strip, district choropleth, themes
│   │   ├── Map/           # LayeredMap (search map), ReactLeafletMap (rents), map helpers
│   │   ├── SearchMap/     # Address search + layer orchestration
│   │   ├── Bvg/           # Transport station markers
│   │   ├── BerlinConstruction/  # Construction markers and polylines
│   │   ├── ViewControls/  # Layer toggle panel
│   │   └── ...
│   ├── config/api.ts      # API base URL (from VITE_API_URL)
│   ├── store/             # Zustand stores (UI, map layers, fetched data)
│   └── types.ts           # Shared frontend types
├── data/
│   ├── README.md          # What each dataset is, source and license
│   ├── sources.json       # Manifest for re-downloading the raw data
│   └── raw/               # Downloaded third-party datasets (gitignored)
├── docs/adr/              # Architecture decision records (data sources, layers, landing page)
└── server/
    ├── app.ts             # Express app and routes (imported by tests)
    ├── server.ts          # Entry point: loads .env and starts listening
    ├── routes/            # One router per upstream API
    ├── utils/             # Geo helpers (distance filtering), error helpers
    └── tests/             # Vitest + Supertest
```

## Architecture decisions

Design decisions and the dataset roadmap live in [`docs/adr/`](docs/adr/README.md). Start with
[ADR 0003](docs/adr/0003-berlin-data-sources.md) for the list of datasets and their sources.

## License

[MIT](LICENSE) © 2025 Martin Oputa
