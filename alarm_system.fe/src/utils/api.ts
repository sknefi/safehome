import axios from "axios";

// In development, use the environment variable
// In production, use relative URLs since frontend and backend are served from the same domain
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_GATEWAY || "http://localhost:3000";
  }
  // In production, use relative URLs
  return "";
};

// Create axios instance with base URL
export const api = axios.create({
  baseURL: getBaseUrl(),
});

// Add an interceptor to include the auth token when available
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Function to get WebSocket URL
export const getWebSocketUrl = () => {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";

  if (import.meta.env.DEV) {
    const gatewayUrl = import.meta.env.VITE_GATEWAY || "http://localhost:3000";
    const url = new URL(gatewayUrl);
    return `${wsProtocol}//${url.host}/ws`;
  }

  // In production, use relative path
  return `${wsProtocol}//${window.location.host}/ws`;
};
