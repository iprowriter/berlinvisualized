import { Marker, Popup } from 'react-leaflet';
import { BusIcon, SBahnIcon, TramIcon } from './BvgIcons';
import { BvgTransportationLayerProps } from '../../../server/types';

  
  // Define different icons based on transport type
 // const busIcon = new L.Icon({ iconUrl: 'icons/notification.png', iconSize: [25, 25] });
 
  
  const BvgTransportationLayer: React.FC<BvgTransportationLayerProps> = ({ item, index }) => {

    if (!item?.location) {
        console.warn(`Missing location for BVG item at index ${index}`, item);
        return null;
      }


    const { latitude, longitude } = item.location;
    const { suburban, tram, bus } = item.products;
  
    // Determine which icon to use based on available transport types
    let icon;
    if (suburban) {
      icon = SBahnIcon;
    } else if (tram) {
      icon =  TramIcon;
    } else if (bus) {
      icon = BusIcon ;
    } else {
      icon = BusIcon ;
    }
  
    return (
      <Marker key={index} position={[latitude, longitude]} icon={icon}>
        <Popup>
          <div>
            <strong>{item.name}</strong>
            <br />
            Available Transport: {suburban ? "Train" : ""} {tram ? "Tram" : ""} {bus ? "Bus" : ""}
          </div>
        </Popup>
      </Marker>
    );
  };
  
  export default BvgTransportationLayer;




  








  


  