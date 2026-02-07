// Storage Management

const HISTORY_KEY = "weather_app_history";
const MAX_HISTORY = 3;

// --- History Management ---
export function getHistory() {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error("Error reading history", e);
    return [];
  }
}

export function addToHistory(city) {
  if (!city) return;

  try {
    let history = getHistory();

    // Remove duplicates (case insensitive) to avoid "London, London"
    history = history.filter(
      (item) => item.toLowerCase() !== city.toLowerCase(),
    );

    // Add new city to the beginning
    history.unshift(city);

    // Limit to MAX_HISTORY (3 items)
    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Error saving history", e);
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

// --- Last City (for auto-load if needed) ---
export function saveLastCity(city) {
  localStorage.setItem("weather_last_city", city);
}

export function getLastCity() {
  return localStorage.getItem("weather_last_city");
}
