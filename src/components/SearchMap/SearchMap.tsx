import { useState } from "react";
import ReactLeafletMap from "../ReactLeaflet.tsx/ReactLeafletMap";
import { berlinRent } from "../utils/berlinRent";
import "./searchmap.css";
import { Search, X } from "lucide-react";




const SearchMap: React.FC = () => {
    const handleMapClick = (latlng: L.LatLng) => {
        console.log("Clicked location:", latlng);
      };


      const [formData, setFormData] = useState({searchQuery: "",});

      const handleChange = (e:any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e:any) => {
        e.preventDefault();
        console.log("Form submitted", formData);
    
    
        const res = await fetch('/contact/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({formData }),
        });
        
        if (res.ok) {
          alert('Message sent!');
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
            <Search size={28} style={{marginRight:'7px', textAlign: 'start'}} onClick={handleSubmit}/>
            {formData.searchQuery && <X size={28} onClick={() => setFormData({ ...formData, searchQuery: "" })}/>}
            </div>
            </div>
        </div> 
        <div className="mapContainer">
          <ReactLeafletMap coordsArray={berlinRent} PopComponent={MapPopComponent} onMapClick={handleMapClick} />
        </div>
      </main>
    );
  };

export default SearchMap;



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