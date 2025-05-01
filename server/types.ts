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

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  isCluster: boolean;
  data: any[]; // you can later type this better
  type: 'marker' | 'polyline' | 'polygon' | 'geojson';
  renderPopup?: (item: any) => React.ReactNode;
  renderMarker?: (item: any, index: number) => React.ReactNode;
}


interface BvgStation {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  products: {
    suburban: boolean;
    subway: boolean;
    tram: boolean;
    bus: boolean;
    ferry: boolean;
    express: boolean;
    regional: boolean;
  };
}


export interface BvgTransportationLayerProps {
  item: BvgStation;
  index: number;
}