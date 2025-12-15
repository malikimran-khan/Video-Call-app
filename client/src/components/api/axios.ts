import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export default api;
