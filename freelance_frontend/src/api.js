// src/api.js
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("access");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default axios;
