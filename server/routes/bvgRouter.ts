import express from 'express';
import axios from 'axios';

const bvgRouter = express.Router();




// Route: GET /api/bvg?lat=...&lon=...&address=...
bvgRouter.get('/', async (req: any, res: any) => {
  const { lat, lon, address } = req.query;

  const BASE_URL = 'https://v6.bvg.transport.rest/stops/reachable-from';

  console.log('BVG request params:', lat, lon, address);

  if (!lat || !lon || !address) {
    return res.status(400).json({ error: 'Missing latitude, longitude, or address' });
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        address,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching BVG data:', error.message);
    res.status(500).json({ error: 'Failed to fetch BVG transport data' });
  }
});

export default bvgRouter;
