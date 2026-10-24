// In production, when frontend and backend are served together on Render, API_BASE_URL is "" (relative).
// In separate dev server (Vite on :5173), fallback to "http://localhost:5000" if VITE_API_URL is not set.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : import.meta.env.DEV
    ? "http://localhost:5000"
    : "";

export default API_BASE_URL;
