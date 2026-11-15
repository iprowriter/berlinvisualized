# Berlin Visualized

An interactive map dashboard for Berlin. Search for an address and see what's around it:

- **Public transport**: BVG stations reachable from the address, with icons for S-Bahn, tram and bus
- **Road works**: construction sites and closures within 1 km, with affected road sections drawn as lines
- **Rents**: median and average rent per m² by district
- **Weather**: current conditions in Berlin

Each data set is a map layer you can toggle on or off.

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

The frontend never calls these services directly. It goes through the Express backend, which keeps the API key on the server and caches weather responses for 60 s to stay inside OpenWeather's free tier.

## Getting started

### Prerequisites

- Node.js 20+
- A free [OpenWeather API key](https://home.openweathermap.org/api_keys)

### Install

```bash
# Frontend (the --legacy-peer-deps flag is needed because react-leaflet-cluster
# still declares a React 18 peer dependency)
npm install --legacy-peer-deps

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

## API

All endpoints are served by the backend under `/api`.

| Endpoint | Query | Returns |
| --- | --- | --- |
| `GET /api/nominatim` | `address` | `{ lat, lon, display_name, boundingbox }` for the best match |
| `GET /api/bvg` | `lat`, `lon`, `address` | Stations reachable from the location |
| `GET /api/berlin-constructions` | `lat`, `lon` | `{ nearby: Feature[] }`: construction sites within 1 km |
| `GET /api/open-weather` | `lat`, `lon` | OpenWeather current weather (cached for 60 s) |
| `GET /api/rent` | none | Sample rent data |

Missing parameters return `400`. Upstream failures return `500`.

## Project structure

```
├── src/
│   ├── apiCalls/          # Typed fetch helpers for the backend
│   ├── components/
│   │   ├── Map/           # LayeredMap (search map), ReactLeafletMap (rents), map helpers
│   │   ├── SearchMap/     # Address search + layer orchestration
│   │   ├── Bvg/           # Transport station markers
│   │   ├── BerlinConstruction/  # Construction markers and polylines
│   │   ├── ViewControls/  # Layer toggle panel
│   │   └── ...
│   ├── config/api.ts      # API base URL (from VITE_API_URL)
│   ├── store/             # Zustand stores (UI, map layers, fetched data)
│   └── types.ts           # Shared frontend types
└── server/
    ├── app.ts             # Express app and routes (imported by tests)
    ├── server.ts          # Entry point: loads .env and starts listening
    ├── routes/            # One router per upstream API
    ├── utils/             # Geo helpers (distance filtering), error helpers
    └── tests/             # Vitest + Supertest
```

## License

[MIT](LICENSE) © 2025 Martin Oputa
