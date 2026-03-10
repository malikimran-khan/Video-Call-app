import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
  // baseURL: "https://ivoice-bakend.vercel.app/api", // backend URL
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export default api;
