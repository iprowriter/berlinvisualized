import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nominatimRouter from "./routes/nominatimRouter.js";




dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());


// Sample Data
const berlinRent = [
  { id: 1, district: "Mitte", latitude: 52.5200, longitude: 13.4050, median_rent: 15.2, average_rent: 18.3 },
  { id: 2, district: "Kreuzberg", latitude: 52.5080, longitude: 13.3777, median_rent: 14.5, average_rent: 17.1 }
];

// Routes
app.get("/api", (req, res) => {
  res.json({info: 'Berlin Visualized by Martin'});
});

app.get("/api/rent", (req, res) => {
    res.json(berlinRent);
  });
  

app.use("/api/nominatim", nominatimRouter);


// Start Server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});