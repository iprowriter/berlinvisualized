export  interface ReactLeafletMapProps {
  position?: [number, number]; // Default to Berlin center if not provided
  zoom?: number;
  coordsArray?: any[]; // array of locations with lat/lon
  boundingBox?:any[];
  url?: string;
  PopComponent?: React.FC<any>;
  geoJsonData?: any;
  onMapClick?: (latlng: L.LatLng) => void;
  zoomToLocation?: boolean;
}


export interface LatLon {
    latitude: number;
    longitude: number;
    display_name: string;
  }