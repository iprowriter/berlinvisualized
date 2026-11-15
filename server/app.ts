import express from "express";
import cors from "cors";
import nominatimRouter from "./routes/nominatimRouter.js";
import openWeatherRouter from "./routes/openWeatherRouter.js";
import bvgRouter from "./routes/bvgRouter.js";
import berlinConstructionsRouter from "./routes/berlinConstructionsRouter.js";
import districtsRouter from "./routes/districtsRouter.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Sample data
const berlinRent = [
  { id: 1, district: "Mitte", latitude: 52.52, longitude: 13.405, median_rent: 15.2, average_rent: 18.3 },
  { id: 2, district: "Kreuzberg", latitude: 52.508, longitude: 13.3777, median_rent: 14.5, average_rent: 17.1 },
];

app.get("/api", (_req, res) => {
  res.json({ info: "Berlin Visualized by Martin" });
});

app.get("/api/rent", (_req, res) => {
  res.json(berlinRent);
});

app.use("/api/nominatim", nominatimRouter);
app.use("/api/open-weather", openWeatherRouter);
app.use("/api/bvg", bvgRouter);
app.use("/api/berlin-constructions", berlinConstructionsRouter);
app.use("/api/districts", districtsRouter);

export default app;
