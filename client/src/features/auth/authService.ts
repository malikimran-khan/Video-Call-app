import api from "../../components/api/axios";
import Cookies from "js-cookie";

// Register user
const register = async (userData: any) => {
  const response = await api.post("/auth/signup", userData);

  // backend should return { user: {...} }
  return response.data.user;
};

// Login user (cookie is set by backend automatically)
const login = async (userData: any) => {
  const response = await api.post("/auth/login", userData);

  const user = response.data.user;

  if (user) {
    // Save user in cookie for page reloads
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
  }
  console.log("user", user)
  return user;
};


// Logout user (backend clears cookie)
const logout = async () => {
  // Remove user from storage
  Cookies.remove("user");
  await api.post("/auth/logout");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
