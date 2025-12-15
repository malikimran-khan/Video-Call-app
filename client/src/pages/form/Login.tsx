import React, { useState, type FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaGoogle, FaLinkedin, FaGithub } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../../features/auth/authSlice";
import type { AppDispatch, RootState } from "../../app/store";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // You might want to show a toast here instead of just relies on rendering {message}
    }

    if (isSuccess || user) {
      navigate("/dashboard");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-blue-400 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden"
      >
        {/* Left Side - Avatar */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-400">
          <div className="text-center">
            <FaUser size={100} className="text-white mx-auto mb-4" />
            <p className="text-white font-semibold text-lg">Welcome Back</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Login
          </h2>

          {isError && (
            <p className="text-red-500 text-sm mb-4 text-center">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 ring-purple-500">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full outline-none text-gray-700"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 ring-purple-500">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full outline-none text-gray-700"
              />
              <span
                className="ml-2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-purple-600 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              disabled={isLoading}
              className="bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-purple-700 transition"
            >
              {isLoading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Link to Signup */}
          <p className="text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-600 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>

          {/* Social Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 mb-3">Or login with</p>
            <div className="flex justify-center gap-4">
              <a
                href="http://localhost:5000/auth/google"
                className="border border-gray-300 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
              >
                <FaGoogle className="text-red-500" /> Google
              </a>
              <a
                href="http://localhost:5000/auth/linkedin"
                className="border border-gray-300 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
              >
                <FaLinkedin className="text-blue-600" /> LinkedIn
              </a>
              <a
                href="http://localhost:5000/auth/github"
                className="border border-gray-300 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
              >
                <FaGithub className="text-gray-800" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
