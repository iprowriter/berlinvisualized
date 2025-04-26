import {useState } from "react";
import ReactLeafletMap from "../ReactLeaflet.tsx/ReactLeafletMap";
import "./searchmap.css";
import { Search, X } from "lucide-react";
import useUIState from "../../store/useUIStore";





const SearchMap: React.FC = () => {
  const [formData, setFormData] = useState({searchQuery: "",});
  // const [rentData, setRentData] = useState([]);
  const [latlon, setLatlon] = useState<LatLon[]>([]);
  const [boundingBox, setBoundingBox] = useState<number[]>([]);
  const {notifications,setNotification, setIsLoading} = useUIState();


  // useEffect(() => {
  //   fetch("http://localhost:5000/api/rent")
  //     .then((res) => {
  //       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setRentData(data);
  //       console.log("server queried successfully", data);
  //     })
  //     .catch((error) => console.error("Error fetching data all:", error));
  // }, []);
  


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
            setLatlon([{"latitude": data?.lat, "longitude": data?.lon, "display_name": data?.display_name}])
            setBoundingBox(data?.boundingbox)
            const newNotification = [...notifications, {id: notifications.length++, message: `Search for ${formData.searchQuery} was successful`, timestamp: new Date()} ]
            setNotification(newNotification)
            setIsLoading(false)
            console.log("data latlon", latlon)
            console.log("data boundingBox", boundingBox)
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
        <div className="mapContainer">
          <ReactLeafletMap coordsArray={latlon} PopComponent={MapPopComponent} boundingBox={boundingBox} zoomToLocation  onMapClick={handleMapClick} />
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

interface LatLon {
  latitude: number;
  longitude: number;
  display_name: string;
}