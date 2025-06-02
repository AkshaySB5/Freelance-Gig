import axios from "axios";

// 1) Create the instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api/",
});

// 2) Attach the access token on every request if present
api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// 3) On receiving a 401 with an expired token, try to refresh & retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 once per request
    if (
      error.response?.status === 401 &&
      error.response.data.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          // Call the refresh endpoint
          const { data } = await api.post("token/refresh/", { refresh });
          // Store new tokens
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          // Update headers for this client & retry
          api.defaults.headers.Authorization = `Bearer ${data.access}`;
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed: clear storage & redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }

    // Otherwise, reject as before
    return Promise.reject(error);
  }
);

export default api;
