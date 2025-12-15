import api from "../../components/api/axios";
import Cookies from "js-cookie";

// Register user
const register = async (userData: any) => {
    const response = await api.post("/auth/signup", userData);

    if (response.data) {
        Cookies.set("user", JSON.stringify(response.data), { expires: 7 }); // Expires in 7 days
    }

    return response.data;
};

// Login user
const login = async (userData: any) => {
    const response = await api.post("/auth/login", userData);

    if (response.data) {
        Cookies.set("user", JSON.stringify(response.data), { expires: 7 });
    }

    return response.data;
};

// Logout user
const logout = () => {
    Cookies.remove("user");
};

const authService = {
    register,
    logout,
    login,
};

export default authService;
