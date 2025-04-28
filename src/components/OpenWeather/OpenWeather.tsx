import { useEffect, useState } from "react";
import "./openweather.css"; // Import the CSS file

const OpenWeather: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/open-weather?lat=52.5200&lon=13.4050") // Berlin Coordinates
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error fetching weather data:", error));
  }, []);

  return (
    <div className="weatherCard">
      {weather ? (
        <>
          <h2>Berlin Weather</h2>
          <p className="temp">{weather.main.temp}°C</p>
          <p>Feels Like: {weather.main.feels_like}°C</p>
          <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

export default OpenWeather;
