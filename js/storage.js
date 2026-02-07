// LocalStorage manager

const STORAGE_KEYS = {
  RECENT_SEARCHES: "weather_recent",
  LAST_CITY: "weather_last",
};

const MAX_RECENT = 5;

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function getRecentSearches() {
  return getItem(STORAGE_KEYS.RECENT_SEARCHES, []);
}

export function addRecentSearch(city) {
  if (!city) return getRecentSearches();

  let searches = getRecentSearches();
  searches = searches.filter((s) => s.toLowerCase() !== city.toLowerCase());
  searches.unshift(city.trim());
  searches = searches.slice(0, MAX_RECENT);

  setItem(STORAGE_KEYS.RECENT_SEARCHES, searches);
  return searches;
}

export function setLastCity(city) {
  setItem(STORAGE_KEYS.LAST_CITY, city);
}

export function getLastCity() {
  return getItem(STORAGE_KEYS.LAST_CITY);
}
