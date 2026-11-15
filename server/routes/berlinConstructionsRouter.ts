import express, { Request, Response } from "express";
import axios from "axios";
import { filterNearby, type ConstructionFeature, type LonLat } from "../utils/geo.js";
import { errorMessage } from "../utils/errors.js";

const berlinConstructionsRouter = express.Router();

const BASE_URL = "https://api.viz.berlin.de/daten/baustellen_sperrungen.json";

// GET /api/berlin-constructions?lat=...&lon=...
berlinConstructionsRouter.get("/", async (req: Request, res: Response) => {
  const { lat, lon } = req.query as { lat?: string; lon?: string };

  if (!lat || !lon) {
    res.status(400).json({ error: "Missing latitude and longitude" });
    return;
  }

  const searchCoord: LonLat = [parseFloat(lon), parseFloat(lat)];

  try {
    const response = await axios.get<{ features?: ConstructionFeature[] }>(BASE_URL);
    const nearby = filterNearby(response.data?.features ?? [], searchCoord);
    res.json({ nearby });
  } catch (error) {
    console.error("Error fetching construction data:", errorMessage(error));
    res.status(500).json({ error: "Failed to fetch construction data" });
  }
});

export default berlinConstructionsRouter;
