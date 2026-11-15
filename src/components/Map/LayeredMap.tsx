import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents, Rectangle } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React from "react";
import type { GeoJsonObject } from "geojson";
import type { MapLayer } from "../../types";
import { fixDefaultMarkerIcons, hasCoordinates } from "./mapUtils";
import MapUpdater from "./MapUpdater";

fixDefaultMarkerIcons();

export interface LayeredMapProps {
  position?: [number, number]; // Defaults to Berlin center
  zoom?: number;
  /** [south, north, west, east], as returned by Nominatim */
  boundingBox?: number[];
  url?: string;
  geoJsonData?: GeoJsonObject;
  onMapClick?: (latlng: L.LatLng) => void;
  zoomToLocation?: boolean;
  layers: MapLayer[];
}

const LayeredMap: React.FC<LayeredMapProps> = ({
  position = [52.52, 13.405],
  zoom = 11,
  geoJsonData,
  boundingBox,
  zoomToLocation,
  onMapClick,
  url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  layers = [],
}) => {
  const firstPoint = layers
    .find((layer) => layer.visible && layer.type === "marker" && layer.data.length > 0)
    ?.data.find(hasCoordinates);

  return (
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={url}
      />
      {zoomToLocation && firstPoint && (
        <MapUpdater coords={[firstPoint.latitude, firstPoint.longitude]} zoom={17} />
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

      {layers.map((layer) => {
        if (!layer.visible || layer.type !== "marker") return null;

        const markers = layer.data.map((item, index) => {
          const key = `${layer.id}-${index}`;
          if (layer.renderMarker) {
            return <React.Fragment key={key}>{layer.renderMarker(item, index)}</React.Fragment>;
          }
          if (!hasCoordinates(item)) return null;
          return (
            <Marker key={key} position={[item.latitude, item.longitude]}>
              {layer.renderPopup && <Popup>{layer.renderPopup(item)}</Popup>}
            </Marker>
          );
        });

        return layer.isCluster ? (
          <MarkerClusterGroup key={layer.id}>{markers}</MarkerClusterGroup>
        ) : (
          <React.Fragment key={layer.id}>{markers}</React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default LayeredMap;

const ClickHandler = ({ onClick }: { onClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({ click: (e) => onClick(e.latlng) });
  return null;
};
