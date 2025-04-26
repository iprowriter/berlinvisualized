import { useState } from "react";
import { User, Home, BellRing, Settings, Car, MapIcon, House } from "lucide-react";
import "./dashboardhome.css";
import ReactLeafletMap from "../ReactLeaflet.tsx/ReactLeafletMap";
import { berlinRent } from '../utils/berlinRent';
import SearchMap from "../SearchMap/SearchMap";
import useUIState from "../../store/useUIStore";
import LoadingSpinner from "../LoadingSpinners/LoadingSpinner";

function DashboardHome() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [selectedView, setSelectedView] = useState("map");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleMapClick = (latlng: L.LatLng) => {
    console.log("Clicked location:", latlng);
  };


  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };

  const { notifications, isLoading } = useUIState();


  return (
    <main className="main">
      <section className="topMenu">
        <div className="logoContainer">
          <div className="logo">
            <Home size={28} style={{ marginRight: "8px", verticalAlign: "middle" }} /> Berlin Visualized
          </div>
        </div>
        <div className="profileContainer">
          <div className="profileIcons" onClick={() => setShowNotifications(!showNotifications)}>
            <BellRing size={28} />
            {notifications.length > 0 && (<span className="notificationBadge">{notifications.length}</span> )}     
          </div>
          <div className="profileIcons">
            <Settings size={28} />
          </div>
          <div className="profileIcons">
            <User size={28} />
          </div>
        </div>
      </section>

      <section className={`dashboardArea ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar">
          <button className="toggleButton" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? "➕" : "➖"}
          </button>

          <div className={`sidebarIcons ${selectedView === 'overview' && "sidebarIconSelected"}`}>
            <Home size={28} style={{ marginRight: "10px" }}  onClick={() => handleViewChange("overview")}/>
            {!sidebarCollapsed && <span>Overview</span>}
          </div>
          <div className={`sidebarIcons ${selectedView === 'map' && "sidebarIconSelected "}`}>
            <MapIcon size={28} style={{ marginRight: "10px" }} onClick={() => handleViewChange("map")} />
            {!sidebarCollapsed && <span>Map</span>}
          </div>
          <div className={`sidebarIcons ${selectedView === 'transports' && "sidebarIconSelected "}`}>
            <Car size={28} style={{ marginRight: "10px" }} onClick={() => handleViewChange("transports")} />
            {!sidebarCollapsed && <span>Transports</span>}
          </div>
          <div className={`sidebarIcons ${selectedView === 'rents' && "sidebarIconSelected "}`}>
            <House size={28} style={{ marginRight: "10px" }} onClick={() => handleViewChange("rents")} />
            {!sidebarCollapsed && <span>Rents</span>}
          </div>
        </div>
        <div className="mainDashboard" onClick={() => setShowNotifications(false)}>
          {isLoading && <div className="loadingSpinnerContainer">
          <div className="loadingSpinnerDiv">
          <LoadingSpinner/>
          </div>
          </div>}
          {showNotifications && (
              <div className="notificationCard">
                {notifications?.slice().reverse().map((notif) => (
                  <div key={notif.id} className="notificationItem">
                    <p>{notif.message}</p>
                    <small>{new Date(notif.timestamp).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            )}
          {selectedView === "overview" && <h1>Overview Content</h1>}
          {selectedView === "map" && <SearchMap/>} 
          {selectedView === "transports" && <h1>Transport Information</h1>}
          {selectedView === "rents" &&  <ReactLeafletMap coordsArray={berlinRent} PopComponent={MapPopComponent}  onMapClick={handleMapClick } />}
        </div>
      </section>
    </main>
  );
}

export default DashboardHome;


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
