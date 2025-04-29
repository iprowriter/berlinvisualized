import { MapContainer, TileLayer, Marker, Popup, GeoJSON,   useMapEvents, Rectangle, useMap} from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { MapLayer } from '../../../server/types';



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
    layers: MapLayer[],
  };


//   interface MapLayer {
//     id: string;
//     name: string;
//     visible: boolean;
//     data: any[]; // you can later type this better
//     type?: 'marker' | 'polyline' | 'polygon' | 'geojson';
//     renderPopup?: (item: any) => React.ReactNode;
//   }


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



  const ReactLealfetMapTest: React.FC<ReactLeafletMapProps> = ({
    position = [52.52, 13.405],
    zoom = 11,
    geoJsonData,
    boundingBox,
    zoomToLocation,
    onMapClick,
    url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    layers = []
  }) => {
    const firstPoint = layers.find(layer => layer.visible && layer.type === 'marker' && layer.data.length > 0)?.data[0];

    return (
      <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }} >
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
            if (!layer.visible) return null;

            if (layer.type === "marker") {
                return layer.isCluster ? (
                <MarkerClusterGroup key={layer.id}>
                    {layer.data.map((item, index) => (
                    <Marker key={`${layer.id}-${index}`} position={[item.latitude, item.longitude]}>
                        {layer.renderPopup && <Popup>{layer.renderPopup(item)}</Popup>}
                    </Marker>
                    ))}
                </MarkerClusterGroup>
                ) : (
                <>
                    {layer.data.map((item, index) => (
                    <Marker key={`${layer.id}-${index}`} position={[item.latitude, item.longitude]}>
                        {layer.renderPopup && <Popup>{layer.renderPopup(item)}</Popup>}
                    </Marker>
                    ))}
                </>
                );
            }
            return null;
            })}


      </MapContainer>
    );
  };
  

  export default ReactLealfetMapTest;

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

 


