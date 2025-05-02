import express from 'express';
import axios from 'axios';
import haversine from 'haversine-distance'; 


const berlinConstructionsRouter = express.Router();


// Route: 
berlinConstructionsRouter.get('/', async (req: any, res: any) => {
  const { lat, lon} = req.query;

  const BASE_URL = 'https://api.viz.berlin.de/daten/baustellen_sperrungen.json';

  console.log('Berlin construction request params:', lat, lon);

  if (!lat || !lon ) {
    return res.status(400).json({ error: 'Missing latitude and longitude' });
  }

 const searchCoord: [number, number] = [parseFloat(lon as string), parseFloat(lat as string)];


  try {
    const response = await axios.get(BASE_URL);
    const constructionJSON = response.data;

    const nearbyConstructions = constructionJSON?.features.filter((feature: any) => {
        const coords = extractBerlinConstructionData(feature.geometry);
        return coords.some(coord => isConstructionNearBy(coord, searchCoord));
    });
    console.log('Nearby constructions:', nearbyConstructions);
    res.json({ nearby: nearbyConstructions});

  } catch (error: any) {
    console.error('Error fetching construction data:', error.message);
    res.status(500).json({ error: 'Failed to fetch construction data' });
  }
});

export default berlinConstructionsRouter;


//DBG: Helper function to find Nearby constructions using Haversine.
const extractBerlinConstructionData = (geometry: any): [number, number][] => {
    if (!geometry) return [];
    if (geometry.type === 'Point') {
        return [geometry.coordinates];
      } else if (geometry.type === 'GeometryCollection') {
        const coords: [number, number][] = [];
        for (const g of geometry.geometries) {
          if (g.type === 'Point') coords.push(g.coordinates);
          else if (g.type === 'LineString') coords.push(...g.coordinates);
        }
        return coords;
      }
  return [];
};


const isConstructionNearBy = (coord1: [number, number], coord2: [number, number], maxDistanceMeters = 1000) => {
    const dist = haversine({ lat: coord1[1], lon: coord1[0] }, { lat: coord2[1], lon: coord2[0] });
   return dist <= maxDistanceMeters;
};