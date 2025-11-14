import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT to all requests
API.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined" && stored !== "null") {
        const { token } = JSON.parse(stored);
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Token read error:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: auto logout on expired token
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default API;
