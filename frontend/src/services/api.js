import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000/api",

  timeout: 60000,
});

// Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication failures
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      const currentPath =
        window.location.pathname;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Don't redirect repeatedly
      if (
        currentPath !== "/login" &&
        currentPath !== "/signup"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;