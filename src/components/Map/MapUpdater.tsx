import { useEffect } from "react";
import { useMap } from "react-leaflet";

/** Re-centers the map whenever the given coordinates change (used to zoom to a search result). */
const MapUpdater: React.FC<{ coords: [number, number]; zoom?: number }> = ({ coords, zoom = 14 }) => {
  const map = useMap();
  const [lat, lon] = coords;

  useEffect(() => {
    map.setView([lat, lon], zoom);
  }, [map, lat, lon, zoom]);

  return null;
};

export default MapUpdater;
