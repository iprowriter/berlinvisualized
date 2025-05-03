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


interface Validity {
  from: string;
  to: string;
}

interface NetRef {
  id: string;
  fromNode: string;
}

interface NearbyProperties {
  id: string;
  tstore: string;
  objectState: string;
  subtype: string;
  severity: string;
  validity: Validity;
  direction: string;
  icon: string;
  is_future?: boolean;
  street: string;
  section: string;
  content: string;
  netrefs?: NetRef[];
}

interface PointGeometry {
  type: "Point";
  coordinates: [number, number];
}

interface LineStringGeometry {
  type: "LineString";
  coordinates: [number, number][];
}

interface GeometryCollection {
  type: "GeometryCollection";
  geometries: (PointGeometry | LineStringGeometry)[];
}

export interface NearbyFeature {
  type: "Feature";
  properties: NearbyProperties;
  geometry: PointGeometry | GeometryCollection;
}

// export interface  BerlinConstructionsLayerProps {
//   nearby: NearbyFeature[];
// }
export interface BerlinConstructionsLayerProps{
  item: NearbyFeature;
  index: number;
}