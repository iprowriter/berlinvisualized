import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { Coordinates, LayerItem } from "../../types";

/**
 * Leaflet's default marker icon URLs break under bundlers.
 * Point them at the copies bundled from the leaflet package, so markers work offline
 * and always match the installed Leaflet version. Safe to call more than once.
 */
export function fixDefaultMarkerIcons() {
  delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}

/** True when a layer item has numeric top-level latitude/longitude (e.g. a search result). */
export const hasCoordinates = (item: LayerItem): item is LayerItem & Coordinates =>
  typeof (item as Partial<Coordinates>).latitude === "number" &&
  typeof (item as Partial<Coordinates>).longitude === "number";
