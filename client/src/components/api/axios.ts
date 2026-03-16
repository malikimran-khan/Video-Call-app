import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
  // baseURL: "https://ivoice-bakend.vercel.app/api", // backend URL
  withCredentials: true, // 🔥 REQUIRED for cookies
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
