import type { ReactNode } from "react";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";

/** Anything that can be placed on the map by latitude/longitude. */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** A geocoded search result (from /api/nominatim). */
export interface LatLon extends Coordinates {
  display_name: string;
}

/** Response of GET /api/nominatim. Nominatim returns coordinates as strings. */
export interface NominatimLocation {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: [string, string, string, string];
}

// ---------- BVG ----------

export interface BvgStation {
  id: string;
  name: string;
  location: Coordinates;
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

/** Response of GET /api/bvg (proxied from v6.bvg.transport.rest/stops/reachable-from). */
export interface BvgReachableResponse {
  reachable: { duration: number; stations: BvgStation[] }[];
}

export interface BvgTransportationLayerProps {
  item: BvgStation;
  index: number;
}

// ---------- Berlin road constructions ----------

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

export interface PointGeometry {
  type: "Point";
  coordinates: [number, number];
}

export interface LineStringGeometry {
  type: "LineString";
  coordinates: [number, number][];
}

export interface GeometryCollection {
  type: "GeometryCollection";
  geometries: (PointGeometry | LineStringGeometry)[];
}

export interface NearbyFeature {
  type: "Feature";
  properties: NearbyProperties;
  geometry: PointGeometry | GeometryCollection;
}

/** Response of GET /api/berlin-constructions. */
export interface BerlinConstructionsResponse {
  nearby: NearbyFeature[];
}

export interface BerlinConstructionsLayerProps {
  item: NearbyFeature;
  index: number;
}

// ---------- OpenWeather ----------

/** The subset of the OpenWeather "current weather" response the UI uses. */
export interface OpenWeatherResponse {
  name: string;
  weather: { main: string; description: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  sys: { sunrise: number; sunset: number };
}

// ---------- Map layers ----------

export type LayerItem = LatLon | BvgStation | NearbyFeature;

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  isCluster: boolean;
  data: LayerItem[];
  type: "marker" | "polyline" | "polygon" | "geojson";
  renderPopup?: (item: LayerItem) => ReactNode;
  renderMarker?: (item: LayerItem, index: number) => ReactNode;
}

export interface Notification {
  id: number;
  message: string;
  timestamp: Date;
}

// ---------- Districts ----------

/** Response of GET /api/districts: the 12 Berlin districts (Bezirke). */
export type DistrictCollection = FeatureCollection<Polygon | MultiPolygon, { id: string; name: string }>;

export type View = "overview" | "map" | "transports" | "rents";
