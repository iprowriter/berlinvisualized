import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { berlinRent } from '../utils/berlinRent';


// Fix marker icon issue in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ReactLeafletMap({ position }: { position: [number, number] }) {
    const berlinCenter: [number, number] = [52.52, 13.405]; // Generic center

  return (
    <MapContainer center={berlinCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {berlinRent.map((district, index) => (
        <Marker
          key={index}
          position={[district.latitude, district.longitude] as [number, number]}
        >
          <Popup>
            <MapPopComponent median={district.median_rent} average={district.average_rent} district={district.district} url={district.url} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default ReactLeafletMap;

interface MapProps {
  position: [number, number];
  popupContent: string;
}


function MapPopComponent({median, average, district, url }: { median?:number, average?:number, district?:string, url?:string}){
    return (
        <div style={{display:"flex", flexDirection:"column", width: "400px", height: "400px"}}>
            <img src={url} alt={district} style={{width: "300px", height: "300px"}} />
            <strong>{district}</strong><br />
            <p style={{ height: "5px"}}>Median Rent: €{median}/m² </p>
            <p style={{ height: "5px"}}>Average Rent: €{average}/m²</p>

        </div>
    )
}