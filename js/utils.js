// Utility functions

export function isOnline() {
  return navigator.onLine;
}

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to storage", e);
  }
}

export function getFromStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error("Error reading from storage", e);
    return null;
  }
}

export function getErrorMessage(error) {
  // Map common error codes/messages to user friendly text
  const msg = typeof error === "string" ? error : error.message;

  if (!msg) return "An unknown error occurred";

  const errorMap = {
    404: "City not found. Please check spelling.",
    401: "API Key error. Please contact support.",
    429: "Too many requests. Please try again later.",
    500: "Server error. Please try again later.",
    "Failed to fetch": "Network error. Check your connection.",
  };

  // Check for exact matches or substrings
  for (const [key, value] of Object.entries(errorMap)) {
    if (msg.includes(key)) return value;
  }

  return msg;
}

export function formatLocalTime(timestamp, timezoneOffset) {
  if (!timestamp || timezoneOffset === undefined) return "";
  // Convert to milliseconds and create date
  // Note: We use UTC methods to avoid browser timezone interference
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

// Debounce function to limit rate of execution
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
