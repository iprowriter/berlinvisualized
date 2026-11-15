import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents, Rectangle } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { GeoJsonObject } from "geojson";
import type { Coordinates } from "../../types";
import { fixDefaultMarkerIcons } from "./mapUtils";
import MapUpdater from "./MapUpdater";

fixDefaultMarkerIcons();

export interface ReactLeafletMapProps<T extends Coordinates> {
  position?: [number, number]; // Defaults to Berlin center
  zoom?: number;
  coordsArray?: T[];
  /** [south, north, west, east], as returned by Nominatim */
  boundingBox?: number[];
  url?: string;
  PopComponent?: React.ComponentType<T>;
  geoJsonData?: GeoJsonObject;
  onMapClick?: (latlng: L.LatLng) => void;
  zoomToLocation?: boolean;
}

/** A simple clustered marker map: one marker per item in `coordsArray`, with `PopComponent` as its popup. */
function ReactLeafletMap<T extends Coordinates>({
  coordsArray = [],
  PopComponent,
  position = [52.52, 13.405],
  zoom = 11,
  geoJsonData,
  boundingBox,
  zoomToLocation,
  onMapClick,
  url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
}: ReactLeafletMapProps<T>) {
  return (
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={url}
      />
      {zoomToLocation && coordsArray.length > 0 && (
        <MapUpdater coords={[coordsArray[0].latitude, coordsArray[0].longitude]} zoom={17} />
      )}
      {onMapClick && <ClickHandler onClick={onMapClick} />}
      {geoJsonData && <GeoJSON data={geoJsonData} />}
      {boundingBox?.length === 4 && (
        <Rectangle
          bounds={[
            [boundingBox[0], boundingBox[2]], // Southwest
            [boundingBox[1], boundingBox[3]], // Northeast
          ]}
          color="blue"
          weight={2}
        />
      )}
      <MarkerClusterGroup>
        {coordsArray.map((item, index) => (
          <Marker key={index} position={[item.latitude, item.longitude]}>
            {PopComponent && (
              <Popup>
                <PopComponent {...item} />
              </Popup>
            )}
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default ReactLeafletMap;

const ClickHandler = ({ onClick }: { onClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({ click: (e) => onClick(e.latlng) });
  return null;
};
