import express, { Request, Response } from "express";
import axios from "axios";
import { errorMessage } from "../utils/errors.js";

const bvgRouter = express.Router();

const BASE_URL = "https://v6.bvg.transport.rest/stops/reachable-from";

// GET /api/bvg?lat=...&lon=...&address=...
bvgRouter.get("/", async (req: Request, res: Response) => {
  const { lat, lon, address } = req.query as { lat?: string; lon?: string; address?: string };

  if (!lat || !lon || !address) {
    res.status(400).json({ error: "Missing latitude, longitude, or address" });
    return;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: { latitude: lat, longitude: lon, address },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching BVG data:", errorMessage(error));
    res.status(500).json({ error: "Failed to fetch BVG transport data" });
  }
});

export default bvgRouter;
