import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT to every request
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");   // ← correct source
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Optional debug:
      // console.log("Auth header:", config.headers.Authorization);
    } catch (err) {
      console.error("Token read error:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/login"; // uncomment if you want auto-redirect
    }
    return Promise.reject(err);
  }
);

export default API;
