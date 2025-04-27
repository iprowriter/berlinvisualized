

//DBG: API to call openWeather API from my backend
export async function getOpenWeather(lat: number, lon: number) {
    try {
      const response = await fetch(`http://localhost:5000/api/open-weather?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error("Failed to fetch weather");
      const data = await response.json();
      console.log("Open weather data", data);
      return data;
    } catch (err) {
      console.error("Open weather error", err);
    }
}