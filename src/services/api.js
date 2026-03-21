import axios from "axios";

// 👉 CHANGE THIS to your backend URL
const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;