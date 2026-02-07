// UI Controller

import {
  formatTemperature,
  formatWindSpeed,
  formatVisibility,
} from "./utils.js";

const elements = {};

export function initElements() {
  elements.searchForm = document.getElementById("search-form");
  elements.searchInput = document.getElementById("search-input");
  elements.searchBtn = document.getElementById("search-btn");
  elements.weatherContainer = document.getElementById("weather-container");
  elements.recentSearches = document.getElementById("recent-searches");
  elements.recentList = document.getElementById("recent-list");
}

export function getSearchValue() {
  return elements.searchInput?.value?.trim() || "";
}

export function setSearchValue(value) {
  if (elements.searchInput) elements.searchInput.value = value;
}

export function setButtonLoading(isLoading) {
  if (!elements.searchBtn) return;
  elements.searchBtn.disabled = isLoading;
  elements.searchBtn.innerHTML = isLoading
    ? '<span class="spinner"></span>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><span>Search</span>';
}

export function showLoading() {
  if (!elements.weatherContainer) return;
  elements.weatherContainer.innerHTML = `
    <div class="loading-state animate-fade-in">
      <div class="skeleton skeleton-circle"></div>
      <div class="skeleton skeleton-text skeleton-text-lg"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text skeleton-text-sm"></div>
    </div>
  `;
}

export function showError(message) {
  if (!elements.weatherContainer) return;
  elements.weatherContainer.innerHTML = `
    <div class="error-state animate-shake">
      <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p class="error-message">${message}</p>
      <p class="error-hint">Check the city name and try again</p>
    </div>
  `;
}

export function showEmptyState() {
  if (!elements.weatherContainer) return;
  elements.weatherContainer.innerHTML = `
    <div class="empty-state animate-fade-in">
      <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
      <p class="empty-state-text">Search for a city to see weather</p>
    </div>
  `;
}

export function showWeather(data) {
  if (!elements.weatherContainer || !data) return;

  elements.weatherContainer.innerHTML = `
    <div class="weather-card glass-card animate-fade-in-up">
      <img src="${data.iconUrl}" alt="${data.description}" class="weather-icon weather-icon-animated" loading="lazy"/>
      
      <h2 class="weather-temperature animate-bounce-in">${formatTemperature(data.temperature)}</h2>
      <p class="weather-description">${data.description}</p>
      
      <p class="weather-location">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>${data.city}${data.country ? ", " + data.country : ""}</span>
      </p>
      
      <div class="weather-details">
        <div class="weather-detail-item">
          <svg class="weather-detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
          </svg>
          <span class="weather-detail-value">${formatTemperature(data.feelsLike)}</span>
          <span class="weather-detail-label">Feels Like</span>
        </div>
        
        <div class="weather-detail-item">
          <svg class="weather-detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v6M12 18v2"/><circle cx="12" cy="12" r="4"/>
          </svg>
          <span class="weather-detail-value">${data.humidity}%</span>
          <span class="weather-detail-label">Humidity</span>
        </div>
        
        <div class="weather-detail-item">
          <svg class="weather-detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
            <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
          </svg>
          <span class="weather-detail-value">${formatWindSpeed(data.windSpeed)}</span>
          <span class="weather-detail-label">Wind</span>
        </div>
        
        <div class="weather-detail-item">
          <svg class="weather-detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
          </svg>
          <span class="weather-detail-value">${formatVisibility(data.visibility)}</span>
          <span class="weather-detail-label">Visibility</span>
        </div>
      </div>
    </div>
  `;
}

export function updateRecentSearches(searches, onClickHandler) {
  if (!elements.recentSearches || !elements.recentList) return;

  if (!searches || searches.length === 0) {
    elements.recentSearches.classList.add("hidden");
    return;
  }

  elements.recentSearches.classList.remove("hidden");
  elements.recentList.innerHTML = searches
    .map(
      (city) =>
        `<button class="recent-search-tag" type="button" data-city="${city}">${city}</button>`,
    )
    .join("");

  elements.recentList.querySelectorAll(".recent-search-tag").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.city && onClickHandler) onClickHandler(btn.dataset.city);
    });
  });
}

export function focusSearchInput() {
  elements.searchInput?.focus();
}

export function getSearchForm() {
  return elements.searchForm;
}
