import { fetchWeather } from "./api.js";
import * as UI from "./ui.js";

function init() {
  UI.initElements();

  // Show Welcome Screen initially
  UI.showWelcomeState();
  UI.focusSearchInput();

  setupEventListeners();
}

function setupEventListeners() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-btn");

  // 1. Handle Search Submit
  if (form) form.addEventListener("submit", handleSearch);

  // 2. Handle Input Typing (Show/Hide Clear Button)
  if (input) {
    input.addEventListener("input", (e) => {
      const hasText = e.target.value.trim().length > 0;
      UI.toggleClearButton(hasText);
    });
  }

  // 3. Handle Clear Button Click
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      UI.clearInput();
      UI.toggleClearButton(false);
      UI.showWelcomeState(); // Go back to welcome screen
    });
  }
}

async function handleSearch(e) {
  e.preventDefault();
  const city = UI.getSearchValue();

  if (!city) return;

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
