import {useEffect, useState } from "react";
import ReactLeafletMap from "../ReactLeaflet.tsx/ReactLeafletMap";
import "./searchmap.css";
import { Search, X } from "lucide-react";
import useUIState from "../../store/useUIStore";
import useReactLeafletMapStore from "../../store/useReactLeafletMapStore";
import { getBerlinConstructions, getBVGData, getOpenWeather } from "../../apiCalls/ApiCall";
import OpenWeather from "../OpenWeather/OpenWeather";
import { LatLon, NearbyFeature } from "../../../server/types";
import ReactLealfetMapTest from "../ReactLeaflet.tsx/ReactLealfetMapTest";
import { formatString } from "../utils/helperFunctions";
import useFetchedDataStore from "../../store/useFetchedDataStore";





const SearchMap: React.FC = () => {
  const [formData, setFormData] = useState({searchQuery: "",});
  const [latlon, setLatlon] = useState<LatLon[]>([]);
  const [boundingBox, setBoundingBox] = useState<number[]>([]);
  const {notifications,setNotification, setIsLoading} = useUIState();
  const {mapLayers, updateLayerData} = useReactLeafletMapStore();
  const {setBvgData, setBerlinConstructionsData } = useFetchedDataStore();



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
            updateLayerData('location_layer', newLatlon )
           const newBvgData = await getBVGData(data?.lat, data?.lon, formatString(formData.searchQuery), setBvgData);
            console.log('SearchMap BVG: ', newBvgData )
            const stations = newBvgData?.reachable?.flatMap((r: { stations: any; }) => r.stations) || [];
            const berlinConstructons = await  getBerlinConstructions(data?.lat, data?.lon, setBerlinConstructionsData)
            const constructions = berlinConstructons?.nearby?.map((f: NearbyFeature) => f) || [];


            updateLayerData("transportation_layer", stations);
            updateLayerData("berlin_construction_layer", constructions);
          }

          if (!res.ok) {
            const newNotification = [...notifications, {id: notifications.length++, message: `Search for ${formData.searchQuery} was not successful`, timestamp: new Date()} ]
            setNotification(newNotification)
            setIsLoading(false)
          }
      };


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

