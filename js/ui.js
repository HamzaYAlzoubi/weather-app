// UI Controller for Space Theme
import { formatLocalTime } from "./utils.js";
import { getHistory } from "./storage.js";

export function initElements() {
  window.ui = {
    searchForm: document.getElementById("search-form"),
    searchInput: document.getElementById("search-input"),
    clearBtn: document.getElementById("clear-btn"),
    searchIcon: document.querySelector(".search-icon"),
    themeToggle: document.getElementById("theme-toggle"), // New
    container: document.getElementById("weather-container"),
    suggestionsBox: null,
    loadingSpinner: document.getElementById("loading-spinner"), // New
  };

  // Create suggestions box dynamically
  const wrapper = document.querySelector(".search-input-wrapper");
  if (wrapper && !document.getElementById("suggestions-box")) {
    const box = document.createElement("div");
    box.id = "suggestions-box";
    box.className = "suggestions-box hidden";
    wrapper.appendChild(box);
    window.ui.suggestionsBox = box;
  } else if (wrapper) {
    window.ui.suggestionsBox = document.getElementById("suggestions-box");
  }
}

// --- Theme Logic ---
export function initTheme() {
  const savedTheme = localStorage.getItem("weather_app_theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}

export function toggleTheme() {
  const isLight = document.body.classList.toggle("light-mode");
  localStorage.setItem("weather_app_theme", isLight ? "light" : "dark");
}

// ... (Rest of functions: showWelcomeState, showSuggestions, etc.)

export function showWelcomeState(onHistoryClick) {
  const { container } = window.ui;
  const iconUrl = "assets/icons/favicon.svg";
  const history = getHistory();

  let historyHTML = "";
  if (history && history.length > 0) {
    historyHTML = `
      <div class="history-container animate-fade-in" style="margin-top: 2rem;">
        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 10px;">Recent Searches</p>
        <div class="history-chips" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          ${history
            .map(
              (city) => `
            <button class="history-chip" data-city="${city}">
              ${city}
            </button>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="welcome-state animate-fade-in-up">
      <img src="${iconUrl}" alt="Welcome" class="welcome-icon animate-float">
      <h2 class="welcome-title">Welcome to Weather App</h2>
      <p class="welcome-subtitle">Enter a city name above to discover the weather anywhere in the world.</p>
      ${historyHTML}
    </div>
  `;

  if (onHistoryClick) {
    const chips = container.querySelectorAll(".history-chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const city = chip.dataset.city;
        onHistoryClick(city);
      });
    });
  }
}

export function showSuggestions(suggestions, onSelectCallback) {
  const { suggestionsBox } = window.ui;
  if (!suggestionsBox) return;

  suggestionsBox.innerHTML = "";

  if (!suggestions || suggestions.length === 0) {
    suggestionsBox.classList.add("hidden");
    return;
  }

  suggestions.forEach((item) => {
    const div = document.createElement("div");
    div.className = "suggestion-item";

    // Construct label
    const parts = [item.name, item.state, item.country].filter(Boolean);
    div.textContent = parts.join(", ");

    div.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelectCallback(item.name);
      hideSuggestions();
    });

    suggestionsBox.appendChild(div);
  });

  suggestionsBox.classList.remove("hidden");
}

export function hideSuggestions() {
  const { suggestionsBox } = window.ui;
  if (suggestionsBox) {
    suggestionsBox.classList.add("hidden");
  }
}

export function toggleClearButton(isVisible) {
  const { clearBtn, searchIcon, loadingSpinner } = window.ui;
  if (!clearBtn) return;

  // If loading, do nothing (toggleLoading handles it)
  if (loadingSpinner && loadingSpinner.style.display === "block") return;

  if (isVisible) {
    clearBtn.style.display = "flex";
    clearBtn.classList.add("animate-fade-in");
    if (searchIcon) searchIcon.style.opacity = "0";
  } else {
    clearBtn.style.display = "none";
    if (searchIcon) searchIcon.style.opacity = "1";
  }
}

export function toggleLoading(isLoading) {
  const { clearBtn, searchIcon, loadingSpinner, searchInput } = window.ui;
  if (!loadingSpinner) return;

  if (isLoading) {
    loadingSpinner.style.display = "block";
    if (clearBtn) clearBtn.style.display = "none";
    if (searchIcon) searchIcon.style.opacity = "0";
  } else {
    loadingSpinner.style.display = "none";
    // Restore state based on input
    const hasText = searchInput && searchInput.value.trim().length > 0;
    toggleClearButton(hasText);
  }
}

export function clearInput() {
  const { searchInput } = window.ui;
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
    hideSuggestions();
  }
}

export function showWeather(data) {
  const { container } = window.ui;

  const locationText = data.country
    ? `${data.city}, ${data.country}`
    : data.city;
  const temp = Math.round(data.temperature);
  const wind = Math.round(data.windSpeed);
  const visibility = (data.visibility / 1000).toFixed(1);

  const localTime = formatLocalTime(
    Math.floor(Date.now() / 1000),
    data.timezone,
  );

  // Format sunrise/sunset times
  const sunrise = formatLocalTime(data.sunrise, data.timezone);
  const sunset = formatLocalTime(data.sunset, data.timezone);

  container.innerHTML = `
    <div class="weather-card animate-fade-in-up">
      <h1 class="city-name">${locationText}</h1>
      <p class="local-time">${localTime}</p>
      
      <div class="current-temp-wrapper">
        <span class="current-temp">${temp}</span><span class="temp-unit">°</span>
      </div>
      <p class="feels-like">Feels like ${data.feelsLike}°</p>
      
      <p class="weather-desc">${data.description}</p>
      
      <img src="${data.iconUrl}" alt="${data.description}" class="weather-main-icon animate-float">
      
      <div class="details-panel">
        <div class="detail-item">
          <span class="detail-label">Wind</span>
          <span class="detail-value">${wind} km/h</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">${data.humidity}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Visibility</span>
          <span class="detail-value">${visibility} km</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Pressure</span>
          <span class="detail-value">${data.pressure} hPa</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Sunrise</span>
          <span class="detail-value">${sunrise}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Sunset</span>
          <span class="detail-value">${sunset}</span>
        </div>
      </div>
    </div>
  `;
}

export function showError(msg) {
  const { container } = window.ui;
  container.innerHTML = `
    <div class="welcome-state animate-fade-in">
      <div style="font-size: 3rem; margin-bottom: 1rem;">😕</div>
      <p class="welcome-subtitle" style="color: #ff6b6b; margin-bottom: 0.5rem;">${msg}</p>
      <p class="welcome-subtitle" style="font-size: 0.9rem;">Please check the city name and try again.</p>
    </div>
  `;
}

export function getSearchValue() {
  return window.ui.searchInput ? window.ui.searchInput.value.trim() : "";
}

export function setSearchValue(val) {
  if (window.ui.searchInput) window.ui.searchInput.value = val;
}

export function focusSearchInput() {
  if (window.ui.searchInput) window.ui.searchInput.focus();
}
