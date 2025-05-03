import { Marker, Popup, Polyline} from 'react-leaflet';
import { BerlinConstructionsLayerProps } from '../../../server/types';
import L from 'leaflet';

  

 const warnIcon = new L.Icon({ iconUrl: 'icons/men-work-construction.png', iconSize: [20, 20] });
 const stopIcon = new L.Icon({ iconUrl: 'icons/stop-icon.png', iconSize: [20, 20] });
 
  
 const BerlinConstructionsLayer: React.FC<BerlinConstructionsLayerProps> = ({ item, index}) => {

    if (!item?.geometry) {
        console.warn(`Missing geometry for berlin constructions ${index}`, item);
        return null;
      }


      const {street, direction, icon, section, severity, validity, id,} = item.properties

      const geometry = item.geometry;
        let pointCoords: [number, number] | null = null; //point coordinates
        let lineCoords: [number, number][] = []; //linestring coordinates

        if (geometry.type === "Point") {
            pointCoords = geometry.coordinates;
        } else if (geometry.type === "GeometryCollection") {
            geometry.geometries.forEach((g) => {
                if (g.type === "Point") {
                  pointCoords = g.coordinates;
                } else if (g.type === "LineString") {
                  lineCoords = g.coordinates.map((c: [number, number]) => [c[1], c[0]]); // LatLng
                }
              });
        }

        if (!pointCoords) return null;


        return (
            <>
              {pointCoords && (
                <Marker
                  key={`marker-${index}`}
                  position={[pointCoords[1], pointCoords[0]]}
                  icon={icon === 'warnung' ? warnIcon : stopIcon}
                >
                  <Popup>
                    <div>
                      <strong>{street}</strong>
                      <br />
                      {direction}
                    </div>
                  </Popup>
                </Marker>
              )}
        
              {lineCoords.length > 0 && (
                <Polyline
                  key={`line-${index}`}
                  positions={lineCoords}
                  color="red"
                  weight={5}
                  opacity={0.7}
                  dashArray="9"
                />
              )}
            </>
          );
    };


export default BerlinConstructionsLayer;
  








  


  