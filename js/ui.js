// UI Controller for Space Theme

export function initElements() {
  window.ui = {
    searchForm: document.getElementById("search-form"),
    searchInput: document.getElementById("search-input"),
    clearBtn: document.getElementById("clear-btn"),
    searchIcon: document.querySelector(".search-icon"),
    container: document.getElementById("weather-container"),
  };
}

export function showWelcomeState() {
  const { container } = window.ui;
  const iconUrl = "assets/icons/favicon.svg";

  container.innerHTML = `
    <div class="welcome-state animate-fade-in-up">
      <img src="${iconUrl}" alt="Welcome" class="welcome-icon animate-float">
      <h2 class="welcome-title">Welcome to Weather App</h2>
      <p class="welcome-subtitle">Enter a city name above to discover the weather anywhere in the world.</p>
    </div>
  `;
}

export function toggleClearButton(isVisible) {
  const { clearBtn, searchIcon } = window.ui;
  if (!clearBtn) return;

  if (isVisible) {
    clearBtn.style.display = "flex";
    clearBtn.classList.add("animate-fade-in");

    // Hide search icon to avoid visual clutter
    if (searchIcon) searchIcon.style.opacity = "0";
  } else {
    clearBtn.style.display = "none";
    if (searchIcon) searchIcon.style.opacity = "1";
  }
}

export function clearInput() {
  const { searchInput } = window.ui;
  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
}

export function showWeather(data) {
  const { container } = window.ui;

  const locationText = data.country
    ? `${data.city}, ${data.country}`
    : data.city;

  // Using Math.round for cleaner numbers
  const temp = Math.round(data.temperature);
  const wind = Math.round(data.windSpeed);
  const visibility = (data.visibility / 1000).toFixed(1);

  container.innerHTML = `
    <div class="weather-card animate-fade-in-up">
      <h1 class="city-name">${locationText}</h1>
      
      <div class="current-temp-wrapper">
        <span class="current-temp">${temp}</span><span class="temp-unit">°</span>
      </div>
      
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
  return window.ui.searchInput.value.trim();
}

export function focusSearchInput() {
  window.ui.searchInput.focus();
}
