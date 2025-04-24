import { Router, Request, Response } from "express";
import fetch from "node-fetch";

const nominatimRouter = Router();

// Example request: /api/nominatim?address=Brandenburg%20Gate%20Berlin
nominatimRouter.get("/", async (req: any, res: any) => {
  try {
    const { address } = req.query;

    if (!address || typeof address !== "string") {
      return res.status(400).json({ error: "Address parameter is required" });
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&addressdetails=1&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "BerlinVisualized/1.0 bynacontents@gmail.com",
      },
    });

    const data:any = await response.json();

    if (!data.length) {
      return res.status(404).json({ error: "Location not found" });
    }

    const result = data[0];
    const location = {
      lat: result.lat,
      lon: result.lon,
      display_name: result.display_name,
      boundingbox: result.boundingbox,
    };

    console.log("Nominatim fetch successful:", location);

    res.json(location);
  } catch (error) {
    console.error("Nominatim fetch error:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default nominatimRouter;
