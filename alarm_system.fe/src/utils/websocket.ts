/**
 * Creates a WebSocket URL that works in both development and production environments
 * @returns {string} WebSocket URL with the appropriate protocol and host
 */
export const getWebSocketUrl = (): string => {
  // Determine if we're using secure protocol (https/wss)
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  
  // In development, use localhost:3000
  if (import.meta.env.DEV) {
    return 'ws://localhost:3000/ws';
  }
  
  // In production, use the same host as the current page
  return `${protocol}//${window.location.host}/ws`;
}; 