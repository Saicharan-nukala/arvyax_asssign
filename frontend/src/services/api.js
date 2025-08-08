import axios from "axios";

const API = axios.create({
  baseURL: "https://arvyax-backend-jqxh.onrender.com/api", // ✅ Updated to deployed backend
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default API;
