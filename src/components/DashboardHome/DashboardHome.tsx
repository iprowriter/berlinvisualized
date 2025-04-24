import { useState } from "react";
import { User, Home, BellRing, Settings, Car, MapIcon, House } from "lucide-react";
import "./dashboardhome.css";
import ReactLeafletMap from "../ReactLeaflet.tsx/ReactLeafletMap";
import { berlinRent } from '../utils/berlinRent';

function DashboardHome() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <main className="main">
      <section className="topMenu">
        <div className="logoContainer">
          <div className="logo">
            <Home size={28} style={{ marginRight: "8px", verticalAlign: "middle" }} /> Berlin Visualized
          </div>
        </div>
        <div className="profileContainer">
          <div className="profileIcons">
            <BellRing size={28} />
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

          <div className="sidebarIcons">
            <Home size={28} style={{ marginRight: "10px" }} />
            {!sidebarCollapsed && <span>Overview</span>}
          </div>
          <div className="sidebarIcons">
            <MapIcon size={28} style={{ marginRight: "10px" }} />
            {!sidebarCollapsed && <span>Map</span>}
          </div>
          <div className="sidebarIcons">
            <Car size={28} style={{ marginRight: "10px" }} />
            {!sidebarCollapsed && <span>Transports</span>}
          </div>
          <div className="sidebarIcons">
            <House size={28} style={{ marginRight: "10px" }} />
            {!sidebarCollapsed && <span>Rents</span>}
          </div>
        </div>
        <div className="mainDashboard">
             <ReactLeafletMap coordsArray={berlinRent} PopComponent={MapPopComponent} />
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
