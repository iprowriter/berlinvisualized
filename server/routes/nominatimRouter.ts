import { Router, Request, Response } from "express";
import fetch from "node-fetch";

const nominatimRouter = Router();

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: [string, string, string, string];
}

// GET /api/nominatim?address=Brandenburg%20Gate%20Berlin
nominatimRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { address } = req.query;

    if (!address || typeof address !== "string") {
      res.status(400).json({ error: "Address parameter is required" });
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address,
    )}&format=json&addressdetails=1&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "BerlinVisualized/1.0 bynacontents@gmail.com",
      },
    });

    const data = (await response.json()) as NominatimResult[];

    if (!data.length) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    const { lat, lon, display_name, boundingbox } = data[0];
    res.json({ lat, lon, display_name, boundingbox });
  } catch (error) {
    console.error("Nominatim fetch error:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default nominatimRouter;
