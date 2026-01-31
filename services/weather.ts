
import { WeatherData } from "../types";

export const fetchWeatherAndCalculateRisk = async (lat: number, lon: number, language: string): Promise<WeatherData | null> => {
  if (!navigator.onLine) {
    console.warn("Weather fetch skipped: Browser is offline.");
    return null;
  }

  try {
    // Adding a timeout to the fetch to prevent long-hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.current) {
      throw new Error("Invalid response format from Weather API");
    }

    const temp = data.current.temperature_2m;
    const humidity = data.current.relative_humidity_2m;
    const code = data.current.weather_code;

    // Basic logic for disease risk: High humidity + Moderate temperature = High fungal risk
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    let riskMessage = "Weather conditions are stable. Low risk of disease outbreaks.";

    if (humidity > 85 && temp > 20 && temp < 30) {
      riskLevel = 'High';
      riskMessage = "High Humidity and Warmth: Extreme risk of Fungal infections (like Blast or Rust). Monitor leaves closely.";
    } else if (humidity > 70 || (temp > 25 && temp < 35)) {
      riskLevel = 'Medium';
      riskMessage = "Increased humidity detected. Moderate risk of pest activity. Ensure proper ventilation.";
    }

    if (code >= 51) { // Rain
       riskMessage += " Rainy conditions may lead to water-logging and soil-borne diseases.";
    }

    return {
      temp,
      humidity,
      condition: getWeatherCondition(code),
      riskLevel,
      riskMessage
    };
  } catch (error) {
    // Silently handle fetch failures (network issues, API downtime, ad-blockers)
    // to ensure the app still functions in offline or restricted modes.
    console.warn("Weather advisory unavailable:", error instanceof Error ? error.message : "Network error");
    return null;
  }
};

const getWeatherCondition = (code: number): string => {
  if (code === 0) return "Clear Sky";
  if (code <= 3) return "Partly Cloudy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 95) return "Thunderstorm";
  return "Cloudy";
};
