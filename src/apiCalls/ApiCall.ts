



//DBG: OpenWeather
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


//DBG: BVG API
export async function getBVGData(lat: number, lon: number, address:string, setBvgData: (data: any[]) => void) {
  try {
    const response = await fetch(`http://localhost:5000/api/bvg?lat=${lat}&lon=${lon}&address=${address}`);
    if (!response.ok) throw new Error("Failed to fetch BVG transportation data");
    const data = await response.json();
    setBvgData(data)
    console.log("BVG transportation data", data);
    return data;
  } catch (err) {
    console.error("BVG data error", err);
  }
}


//DBG: Berlin Road Constructions API
export async function getBerlinConstructions(lat: number, lon: number) {
  try {
    const response = await fetch(`http://localhost:5000/api/berlin-constructions?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error("Failed to fetch Berlin construction data");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("BVG data error", err);
  }
}