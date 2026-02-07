// Weather API handler
import { isOnline, getErrorMessage } from "./utils.js";

const API_BASE_URL = "/api/weather";
const GEO_API_URL = "/api/geocode";
const TIMEOUT = 10000;

export async function fetchWeather(city) {
  if (!isOnline()) {
    return { success: false, message: "No internet connection" };
  }

  if (!city || city.trim().length < 2) {
    return { success: false, message: "Please enter a valid city name" };
  }

  const url = `${API_BASE_URL}?city=${encodeURIComponent(city.trim())}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || getErrorMessage(response.status.toString()),
      };
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      return { success: false, message: "Request timed out. Try again." };
    }
    return { success: false, message: getErrorMessage(error) };
  }
}

// 🌍 Geocoding API for Suggestions (via Serverless Function)
export async function getCitySuggestions(query) {
  if (!query || query.length < 2) return [];

  const url = `${GEO_API_URL}?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    return [];
  }
}

export function getWeatherIconUrl(iconCode, size = "4x") {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}
