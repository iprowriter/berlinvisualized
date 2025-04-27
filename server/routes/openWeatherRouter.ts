import express from 'express';
import axios from 'axios';

const openWeatherRouter = express.Router();


//DBG: Caching because of 60 call per minute offered by openWeather
let weatherCache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; 

// Route: GET /api/weather?lat=...&lon=...
openWeatherRouter.get('/', async (req:any, res:any) => {
  const { lat, lon } = req.query;

  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY; 
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  console.log("openweather request latlon", lat, lon)
  console.log("openweather apikey", OPENWEATHER_API_KEY)

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  const now = Date.now();
  
  //DBG: Return cached result if fresh
  if (weatherCache && now - weatherCache.timestamp < CACHE_DURATION) {
    return res.json(weatherCache.data);
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric', 
      },
    });

    weatherCache = {
      data: response.data,
      timestamp: now,
    };

    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});



export default openWeatherRouter;
