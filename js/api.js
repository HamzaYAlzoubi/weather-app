// Weather API handler

import { isOnline, getErrorMessage } from "./utils.js";

// ==========================================
// ⚠️ TEMPORARY DEVELOPMENT MODE (Live Server)
// ==========================================
// This section calls the API directly from the browser to bypass Vercel functions
// for UI development. DELETE or COMMENT OUT before production.

const API_KEY = "732bf3fc34e0ad28e944b8167fcaac84"; // Temp key for dev
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchWeather(city) {
  if (!isOnline()) return { success: false, message: "No internet connection" };

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    console.log("Fetching raw data from:", url);

    const response = await fetch(url);
    const data = await response.json();

    // 🔥 LOGGING FULL DATA FOR DESIGN ANALYSIS
    console.log("🚀 FULL API RESPONSE:", data);

    if (!response.ok) {
      return { success: false, message: data.message || "Error" };
    }

    // Return structured data compatible with our app
    return {
      success: true,
      data: {
        city: data.name,
        country: data.sys?.country,
        temperature: Math.round(data.main?.temp),
        feelsLike: Math.round(data.main?.feels_like),
        humidity: data.main?.humidity,
        description: data.weather?.[0]?.description,
        icon: data.weather?.[0]?.icon,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@4x.png`,
        windSpeed: data.wind?.speed,
        visibility: data.visibility,
        // Passing raw data too if needed later
        raw: data,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

// ==========================================
// ✅ PRODUCTION MODE (Vercel Serverless)
// ==========================================
// Uncomment this block and remove the above block when deploying.
/*
const API_BASE_URL = '/api/weather';
const TIMEOUT = 10000;

export async function fetchWeather(city) {
  if (!isOnline()) {
    return { success: false, message: 'No internet connection' };
  }
  
  if (!city || city.trim().length < 2) {
    return { success: false, message: 'Please enter a valid city name' };
  }
  
  const url = `${API_BASE_URL}?city=${encodeURIComponent(city.trim())}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return { success: false, message: data.message || getErrorMessage(response.status.toString()) };
    }
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return { success: false, message: 'Request timed out. Try again.' };
    }
    return { success: false, message: getErrorMessage(error) };
  }
}
*/

export function getWeatherIconUrl(iconCode, size = "4x") {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}
