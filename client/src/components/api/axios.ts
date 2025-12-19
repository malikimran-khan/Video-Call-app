import axios from "axios";

const api = axios.create({
  baseURL: "https://ivoice-bakend-git-main-imrans-projects-0771b560.vercel.app/api", // backend URL
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export default api;
