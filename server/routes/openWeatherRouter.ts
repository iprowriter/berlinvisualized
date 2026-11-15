import express, { Request, Response } from "express";
import axios from "axios";
import { errorMessage } from "../utils/errors.js";

const openWeatherRouter = express.Router();

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Cache responses for a minute: OpenWeather's free tier allows 60 calls per minute.
// Note: the cache is global, not per-coordinate.
const CACHE_DURATION = 60 * 1000;
let weatherCache: { data: unknown; timestamp: number } | null = null;

/** For tests. */
export const clearWeatherCache = () => {
  weatherCache = null;
};

// GET /api/open-weather?lat=...&lon=...
openWeatherRouter.get("/", async (req: Request, res: Response) => {
  const { lat, lon } = req.query as { lat?: string; lon?: string };

  if (!lat || !lon) {
    res.status(400).json({ error: "Missing latitude or longitude" });
    return;
  }

  const now = Date.now();
  if (weatherCache && now - weatherCache.timestamp < CACHE_DURATION) {
    res.json(weatherCache.data);
    return;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: { lat, lon, appid: process.env.OPENWEATHER_API_KEY, units: "metric" },
    });
    weatherCache = { data: response.data, timestamp: now };
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", errorMessage(error));
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

export default openWeatherRouter;
