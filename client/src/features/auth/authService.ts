import api from "../../components/api/axios";

// Register user
const register = async (userData: any) => {
  const response = await api.post("/auth/signup", userData);
  return response.data; // Now contains { message, email }
};

// Verify OTP
const verifyOTP = async (otpData: { email: string; otp: string }) => {
  const response = await api.post("/auth/verify-otp", otpData);
  return response.data;
};

// Login user
const login = async (userData: any) => {
  const response = await api.post("/auth/login", userData);

  const { user, token } = response.data;

  if (user && token) {
    // Save user and token in sessionStorage for page reloads, isolated by tab
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("token", token);
  }
  console.log("user", user)
  return user;
};


// Logout user (backend clears cookie)
const logout = async () => {
  // Remove user and token from storage
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  await api.post("/auth/logout");
};

// Update profile
const updateProfile = async (userData: { username?: string; avatar?: string; bio?: string }) => {
  const response = await api.put("/auth/profile", userData);

  if (response.data.user) {
    sessionStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

// Delete account
const deleteAccount = async () => {
  const response = await api.delete("/auth/profile");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  verifyOTP,
  updateProfile,
  deleteAccount,
};

export default authService;
