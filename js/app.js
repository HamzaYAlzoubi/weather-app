import { fetchWeather } from "./api.js";
import * as UI from "./ui.js";

function init() {
  UI.initElements();

  // Set default city or focus
  UI.focusSearchInput();

  // Event Listeners
  const form = document.getElementById("search-form");
  form.addEventListener("submit", handleSearch);
}

async function handleSearch(e) {
  e.preventDefault();
  const city = UI.getSearchValue();

  if (!city) return;

  // Show loading state (simple text for now, or keep old UI)
  // For this design, maybe just keep current view until load?
  // Let's assume fast loading.

  const result = await fetchWeather(city);

  if (result.success) {
    UI.showWeather(result.data);
  } else {
    UI.showError(result.message);
  }
}

// Start App
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
