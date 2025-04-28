import { MapContainer, TileLayer, Marker, Popup, GeoJSON,   useMapEvents, Rectangle, useMap} from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { ReactLeafletMapProps } from '../../../server/types';


//DBG: Fix marker icon issue in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});



  const ReactLeafletMap: React.FC<ReactLeafletMapProps> = ({
    coordsArray = [],
    PopComponent = () => null,
    position = [52.52, 13.405],
    zoom = 11,
    geoJsonData,
    boundingBox,
    zoomToLocation,
    onMapClick,
    url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  }) => {
    return (
      <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }} >
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
          <Marker
            key={index}
            position={[item.latitude, item.longitude] as [number, number]}
          >
            <Popup> <PopComponent {...item} /></Popup>
          </Marker>
        ))}
        </MarkerClusterGroup>
      </MapContainer>
    );
  };
  

  export default ReactLeafletMap;

  //DBG: I'm using this function to  zoom map to the location that was searched
  const MapUpdater: React.FC<{ coords: [number, number], zoom?: number }> = ({ coords, zoom = 14 }) => {
    const map = useMap();
  
    useEffect(() => {
      if (coords) {
        map.setView(coords, zoom);
      }
    }, [coords[0], coords[1]]); 
  
    return null;
  };

  const ClickHandler = ({ onClick }: { onClick: (latlng: L.LatLng) => void }) => {
           useMapEvents({click(e) {onClick(e.latlng);}});
         return null;
  };

 


