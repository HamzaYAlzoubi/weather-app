import { fetchWeather, getCitySuggestions } from "./api.js";
import { debounce } from "./utils.js";
import { addToHistory } from "./storage.js";
import * as UI from "./ui.js";

function init() {
  UI.initElements();
  UI.initTheme(); // Initialize Theme

  // Show Welcome Screen initially with History Handler
  UI.showWelcomeState(handleHistoryClick);
  UI.focusSearchInput();

  setupEventListeners();
}

function handleHistoryClick(city) {
  UI.setSearchValue(city);
  UI.toggleClearButton(true);
  handleSearch(new Event("submit"));
}

function setupEventListeners() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-btn");
  const themeToggle = document.getElementById("theme-toggle"); // Theme Toggle

  // 1. Handle Search Submit
  if (form) form.addEventListener("submit", handleSearch);

  // 2. Handle Input Typing
  if (input) {
    input.addEventListener("input", (e) => {
      const hasText = e.target.value.trim().length > 0;
      UI.toggleClearButton(hasText);
      if (!hasText) UI.hideSuggestions();
    });

    // Handle Suggestions
    const handleInput = debounce(async (e) => {
      const query = e.target.value.trim();
      if (query.length < 2) return;

      const suggestions = await getCitySuggestions(query);
      UI.showSuggestions(suggestions, (selectedCity) => {
        UI.setSearchValue(selectedCity);
        handleSearch(new Event("submit"));
      });
    }, 300);

    input.addEventListener("input", (e) => handleInput(e));
  }

  // 3. Handle Clear Button
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      UI.clearInput();
      UI.toggleClearButton(false);
      UI.hideSuggestions();
      UI.showWelcomeState(handleHistoryClick);
    });
  }

  // 4. Handle Theme Toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      UI.toggleTheme();
    });
  }

  // 5. Close suggestions when clicking outside
  document.addEventListener("click", (e) => {
    const suggestionsBox = document.getElementById("suggestions-box");
    const searchWrapper = document.querySelector(".search-input-wrapper");

    if (suggestionsBox && searchWrapper && !searchWrapper.contains(e.target)) {
      UI.hideSuggestions();
    }
  });
}

async function handleSearch(e) {
  if (e) e.preventDefault();
  const city = UI.getSearchValue();

  if (!city) return;

  UI.hideSuggestions();

  const result = await fetchWeather(city);

  if (result.success) {
    addToHistory(city);
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
