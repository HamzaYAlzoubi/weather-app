// Utility functions

export function debounce(func, wait = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function sanitizeInput(text) {
  if (typeof text !== "string") return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML.trim();
}

export function formatTemperature(temp, unit = "C") {
  return `${Math.round(temp)}°${unit}`;
}

export function formatWindSpeed(speed) {
  return `${Math.round(speed)} m/s`;
}

export function formatVisibility(visibility) {
  if (visibility >= 1000) return `${(visibility / 1000).toFixed(1)} km`;
  return `${visibility} m`;
}

export function isValidCityName(city) {
  if (!city || typeof city !== "string") return false;
  const trimmed = city.trim();
  return trimmed.length >= 2 && !/^\d+$/.test(trimmed);
}

export function isOnline() {
  return navigator.onLine;
}

export function getErrorMessage(error) {
  const messages = {
    "Failed to fetch": "Unable to connect. Check your internet.",
    404: "City not found. Check the name.",
    401: "Authentication error.",
    429: "Too many requests. Try later.",
    500: "Server error. Try later.",
  };

  const errorStr = error?.message || String(error);
  for (const [key, msg] of Object.entries(messages)) {
    if (errorStr.includes(key)) return msg;
  }
  return "Something went wrong. Try again.";
}
