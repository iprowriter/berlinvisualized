import {useEffect, useState } from "react";
import ReactLeafletMap from "../ReactLeaflet.tsx/ReactLeafletMap";
import "./searchmap.css";
import { Search, X } from "lucide-react";
import useUIState from "../../store/useUIStore";
import useReactLeafletMapStore from "../../store/useReactLeafletMapStore";
import { getBVGData, getOpenWeather } from "../../apiCalls/ApiCall";
import OpenWeather from "../OpenWeather/OpenWeather";
import { LatLon } from "../../../server/types";
import ReactLealfetMapTest from "../ReactLeaflet.tsx/ReactLealfetMapTest";
import { formatString } from "../utils/helperFunctions";
import useFetchedDataStore from "../../store/useFetchedDataStore";





const SearchMap: React.FC = () => {
  const [formData, setFormData] = useState({searchQuery: "",});
  const [latlon, setLatlon] = useState<LatLon[]>([]);
  const [boundingBox, setBoundingBox] = useState<number[]>([]);
  const {notifications,setNotification, setIsLoading} = useUIState();
  const {mapLayers, updateLayerData} = useReactLeafletMapStore();
  const {bvgData, setBvgData } = useFetchedDataStore();



  useEffect(() => {
    // Berlin coordinates
    getOpenWeather(52.52, 13.405);
  }, []);
  


    const handleMapClick = (latlng: L.LatLng) => {
        console.log("Clicked location:", latlng);
      };


    const handleChange = (e:any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        console.log("Form submitted", formData);
        setIsLoading(true)
    
    
        if (!formData.searchQuery) {
            console.log("No search query provided");
            const newNotification = [...notifications, {id: notifications.length++, message: `No search query provided`, timestamp: new Date()} ]
            setNotification(newNotification)
            setIsLoading(false)
            return;
          }

          const res = await fetch(`http://localhost:5000/api/nominatim?address=${formData.searchQuery}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (res.ok) {
            // alert('Message sent!');
            const data = await res.json();
            const newLatlon = [{ latitude: data?.lat, longitude: data?.lon, display_name: data?.display_name }];
            setLatlon(newLatlon )
            setBoundingBox(data?.boundingbox)
            const newNotification = [...notifications, {id: notifications.length++, message: `Search for ${formData.searchQuery} was successful`, timestamp: new Date()} ]
            setNotification(newNotification)
            setIsLoading(false)
            console.log("data latlon", latlon)
            console.log("data boundingBox", boundingBox)
            updateLayerData('location_layer', newLatlon )
           const newBvgData = await getBVGData(data?.lat, data?.lon, formatString(formData.searchQuery), setBvgData);
            console.log('SearchMap BVG: ', newBvgData )
            const extractedCoordinates = newBvgData.reachable.flatMap(reachable =>
              reachable.stations.map(station => ({
                latitude: station.location.latitude,
                longitude: station.location.longitude,
                name: station.name
              }))
            );
            updateLayerData("transportation_layer", extractedCoordinates);
          }

          if (!res.ok) {
            const newNotification = [...notifications, {id: notifications.length++, message: `Search for ${formData.searchQuery} was not successful`, timestamp: new Date()} ]
            setNotification(newNotification)
            setIsLoading(false)
          }
      };


      const test = [{
        latitude: '51.3270575',
        longitude: '12.3903429',
        display_name: '33, Philipp-Rosenthal-Straße, Zentrum-Südost, Mitte, Leipzig, Sachsen, 04103, Deutschland',
        boundingbox: [ '51.3268166', '51.3272969', '12.3901633', '12.3905227' ]
      }]

      const test2 = [{
        latitude:  '52.4289765',
        longitude: '13.5290776',
        display_name: '29, Rudower Chaussee, Adlershof, Treptow-Köpenick, Berlin, 12489, Deutschland',
         }]

      const test3 = [{
          latitude:  '52.43997210418351',
          longitude: '13.526832529751482',
          display_name: '29, Rudower Chaussee, Adlershof, Treptow-Köpenick, Berlin, 12489, Deutschland',
           }]

           const test4 = [{
            latitude:  '52.433536062126265',
            longitude: '13.483144714123222',
            display_name: '29, Rudower Chaussee, Adlershof, Treptow-Köpenick, Berlin, 12489, Deutschland',
             }]
  





       const layers = [{
           id: 'location-layer',
           name: 'location',
           visible: true,
           data: latlon,
           type: 'marker' as "marker",
         },
         {
          id: 'layer',
          name: 'leipzig',
          visible: true,
          data: test,
          type: 'marker' as "marker",
        },
        {
          id: 'layer2',
          name: 'leipzig',
          visible: true,
          data: test2,
          type: 'marker' as "marker",
        },

        {
          id: 'layer3',
          name: 'leipzig',
          visible: true,
          data: test3,
          type: 'marker' as "marker",
        },
        ]

        useEffect(() => {
          console.log("New mapLayers being sent to Map:", mapLayers);
        }, [mapLayers]);


    return (
        <main className="searchMapContainer">
        <div className="searchBar">
            <div className="searchBarDiv">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Search for an address"name="searchQuery" value={formData.searchQuery}
                onChange={handleChange}
                required />
            </form>
            <div>
            <Search size={28} style={{marginRight:'7px', textAlign: 'start', cursor: formData.searchQuery ? "pointer" : "not-allowed",
               opacity: formData.searchQuery ? 1 : 0.5}} onClick={handleSubmit}/>
            {formData.searchQuery && <X size={28} onClick={() => setFormData({ ...formData, searchQuery: "" })}/>}
            </div>
            </div>
        </div> 
        <div className="weatherBar">
           <OpenWeather/> 
        </div>
        <div className="mapContainer">
          {/* <ReactLeafletMap coordsArray={latlon} PopComponent={MapPopComponent} boundingBox={boundingBox} zoomToLocation  onMapClick={handleMapClick} /> */}

          <ReactLealfetMapTest  PopComponent={MapPopComponent} boundingBox={boundingBox} zoomToLocation onMapClick={handleMapClick} layers={mapLayers} />
        </div>
      </main>
    );
  };

export default SearchMap;



function MapPopComponent({latitude, longitude, display_name }: {latitude?:number, longitude?:number,  display_name?:string}){
    return (
        <div style={{display:"flex", flexDirection:"column", width: "400px", height: "200px"}}>
            <p style={{ width: "325px", height: "5px",}}>{display_name}</p><br />
            <p style={{ height: "5px"}}>Latitude:{latitude}</p>
            <p style={{ height: "5px"}}>Longitude:{longitude}</p>

        </div>
    )
}

