// Main App Entry Point

import { fetchWeather } from "./api.js";
import * as UI from "./ui.js";
import * as Storage from "./storage.js";
import { isValidCityName } from "./utils.js";

function initApp() {
  UI.initElements();
  UI.showEmptyState();
  loadLastCity();
  loadRecentSearches();
  setupEventListeners();
  UI.focusSearchInput();
}

function loadLastCity() {
  const lastCity = Storage.getLastCity();
  if (lastCity) {
    UI.setSearchValue(lastCity);
    handleSearch(lastCity);
  }
}

function loadRecentSearches() {
  const searches = Storage.getRecentSearches();
  UI.updateRecentSearches(searches, handleRecentSearchClick);
}

function setupEventListeners() {
  const form = UI.getSearchForm();
  if (form) form.addEventListener("submit", handleFormSubmit);

  window.addEventListener("online", () => {});
  window.addEventListener("offline", () =>
    UI.showError("No internet connection"),
  );

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      UI.focusSearchInput();
    }
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const city = UI.getSearchValue();

  if (!isValidCityName(city)) {
    UI.showError("Please enter a valid city name");
    return;
  }

  handleSearch(city);
}

async function handleSearch(city) {
  UI.setButtonLoading(true);
  UI.showLoading();

  try {
    const result = await fetchWeather(city);

    if (result.success && result.data) {
      UI.showWeather(result.data);
      Storage.setLastCity(city);
      Storage.addRecentSearch(city);
      loadRecentSearches();
    } else {
      UI.showError(result.message || "Something went wrong");
    }
  } catch (error) {
    UI.showError("Error fetching weather. Try again.");
  } finally {
    UI.setButtonLoading(false);
  }
}

function handleRecentSearchClick(city) {
  UI.setSearchValue(city);
  handleSearch(city);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
