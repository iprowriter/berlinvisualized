import express, { Request, Response } from "express";
import axios from "axios";
import { errorMessage } from "../utils/errors.js";

const districtsRouter = express.Router();

// Official district boundaries (ALKIS Bezirke) from Geoportal Berlin, reprojected to WGS84 by the WFS.
const WFS_URL = "https://gdi.berlin.de/services/wfs/alkis_bezirke";
const WFS_PARAMS = {
  service: "WFS",
  version: "2.0.0",
  request: "GetFeature",
  typeNames: "alkis_bezirke:bezirksgrenzen",
  outputFormat: "application/json",
  srsName: "EPSG:4326",
};

// Boundaries almost never change: cache for a day (ADR 0002).
const CACHE_DURATION = 24 * 60 * 60 * 1000;

type Position = number[];
type Coordinates = Position | Coordinates[];

interface WfsFeature {
  type: "Feature";
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: Coordinates };
  properties: { gem: string; namgem: string };
}

export interface DistrictFeature {
  type: "Feature";
  geometry: WfsFeature["geometry"];
  properties: { id: string; name: string };
}

export interface DistrictCollection {
  type: "FeatureCollection";
  features: DistrictFeature[];
}

let cache: { data: DistrictCollection; timestamp: number } | null = null;

/** For tests. */
export const clearDistrictsCache = () => {
  cache = null;
};

/** Rounds every coordinate to 5 decimals (~1 m), which roughly halves the payload. */
export const roundCoordinates = (coords: Coordinates, decimals = 5): Coordinates => {
  const factor = 10 ** decimals;
  return typeof coords[0] === "number"
    ? (coords as Position).map((n) => Math.round(n * factor) / factor)
    : (coords as Coordinates[]).map((c) => roundCoordinates(c, decimals));
};

/** Keeps only what the frontend needs: geometry, the district number and its name. */
export const toDistrictCollection = (features: WfsFeature[]): DistrictCollection => ({
  type: "FeatureCollection",
  features: features.map((f) => ({
    type: "Feature",
    geometry: { type: f.geometry.type, coordinates: roundCoordinates(f.geometry.coordinates) },
    properties: { id: f.properties.gem, name: f.properties.namgem },
  })),
});

// GET /api/districts
districtsRouter.get("/", async (_req: Request, res: Response) => {
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    res.json(cache.data);
    return;
  }

  try {
    const response = await axios.get<{ features?: WfsFeature[] }>(WFS_URL, { params: WFS_PARAMS, timeout: 20_000 });
    const data = toDistrictCollection(response.data?.features ?? []);
    cache = { data, timestamp: Date.now() };
    res.json(data);
  } catch (error) {
    console.error("Error fetching district boundaries:", errorMessage(error));
    if (cache) {
      // Serve stale boundaries rather than nothing.
      res.json(cache.data);
      return;
    }
    res.status(502).json({ error: "Failed to fetch district boundaries" });
  }
});

export default districtsRouter;
