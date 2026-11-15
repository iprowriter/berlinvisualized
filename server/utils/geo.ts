import haversine from "haversine-distance";

/** A GeoJSON position: [longitude, latitude]. */
export type LonLat = [number, number];

interface PointGeometry {
  type: "Point";
  coordinates: LonLat;
}
interface LineStringGeometry {
  type: "LineString";
  coordinates: LonLat[];
}
interface GeometryCollection {
  type: "GeometryCollection";
  geometries: (PointGeometry | LineStringGeometry)[];
}
export type ConstructionGeometry = PointGeometry | GeometryCollection | null | undefined;

export interface ConstructionFeature {
  type: "Feature";
  geometry: ConstructionGeometry;
  properties: Record<string, unknown>;
}

/** Flattens a construction site's geometry into a list of [lon, lat] positions. */
export const extractCoordinates = (geometry: ConstructionGeometry): LonLat[] => {
  if (!geometry) return [];
  if (geometry.type === "Point") return [geometry.coordinates];
  if (geometry.type === "GeometryCollection") {
    const coords: LonLat[] = [];
    for (const g of geometry.geometries) {
      if (g.type === "Point") coords.push(g.coordinates);
      else if (g.type === "LineString") coords.push(...g.coordinates);
    }
    return coords;
  }
  return [];
};

/** True when two [lon, lat] positions are within `maxDistanceMeters` of each other. */
export const isWithinDistance = (a: LonLat, b: LonLat, maxDistanceMeters = 1000): boolean =>
  haversine({ lat: a[1], lon: a[0] }, { lat: b[1], lon: b[0] }) <= maxDistanceMeters;

/** Keeps the features that have at least one position within `maxDistanceMeters` of `center`. */
export const filterNearby = <T extends ConstructionFeature>(
  features: T[],
  center: LonLat,
  maxDistanceMeters = 1000,
): T[] =>
  features.filter((feature) =>
    extractCoordinates(feature.geometry).some((coord) => isWithinDistance(coord, center, maxDistanceMeters)),
  );
