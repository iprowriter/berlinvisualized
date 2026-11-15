import { useEffect, useState } from "react";
import { getOpenWeather } from "../../apiCalls/ApiCall";
import type { OpenWeatherResponse } from "../../types";
import "./openweather.css"; // Import the CSS file

const OpenWeather: React.FC = () => {
  const [weather, setWeather] = useState<OpenWeatherResponse | null>(null);

  useEffect(() => {
    // Berlin coordinates
    getOpenWeather(52.52, 13.405).then((data) => setWeather(data ?? null));
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
