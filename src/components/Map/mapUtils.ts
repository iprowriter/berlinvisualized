import L from "leaflet";
import type { Coordinates, LayerItem } from "../../types";

/**
 * Leaflet's default marker icon URLs break under bundlers.
 * Point them at the CDN copies instead. Safe to call more than once.
 */
export function fixDefaultMarkerIcons() {
  delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

/** True when a layer item has numeric top-level latitude/longitude (e.g. a search result). */
export const hasCoordinates = (item: LayerItem): item is LayerItem & Coordinates =>
  typeof (item as Partial<Coordinates>).latitude === "number" &&
  typeof (item as Partial<Coordinates>).longitude === "number";
