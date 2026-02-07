// UI Controller for Space Theme

export function initElements() {
  window.ui = {
    searchForm: document.getElementById("search-form"),
    searchInput: document.getElementById("search-input"),
    container: document.getElementById("weather-container"),
  };
}

export function showWeather(data) {
  const { container } = window.ui;

  // Format local time if needed, or just show city/country
  const locationText = data.country
    ? `${data.city}, ${data.country}`
    : data.city;

  container.innerHTML = `
    <div class="weather-card animate-fade-in-up">
      
      <!-- 1. City Name -->
      <h1 class="city-name">${locationText}</h1>
      
      <!-- 2. Temperature (Huge) -->
      <div class="current-temp-wrapper">
        <span class="current-temp">${data.temperature}</span><span class="temp-unit">°</span>
      </div>
      
      <!-- 3. Description -->
      <p class="weather-desc">${data.description}</p>
      
      <!-- 4. Big Icon -->
      <img src="${data.iconUrl}" alt="${data.description}" class="weather-main-icon animate-float">
      
      <!-- 5. Details Section (Bottom Glass Card) -->
      <div class="details-panel">
        <div class="detail-item">
          <span class="detail-label">Wind</span>
          <span class="detail-value">${Math.round(data.windSpeed)} km/h</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">${data.humidity}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Visibility</span>
          <span class="detail-value">${(data.visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>
      
    </div>
  `;
}

export function showError(msg) {
  const { container } = window.ui;
  container.innerHTML = `<div class="error-msg" style="text-align:center; margin-top:3rem; color: #ff6b6b;">${msg}</div>`;
}

export function getSearchValue() {
  return window.ui.searchInput.value.trim();
}

export function focusSearchInput() {
  window.ui.searchInput.focus();
}
