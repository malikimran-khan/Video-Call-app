import React, { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaPhotoVideo,
  FaGoogle,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, reset } from "../../features/auth/authSlice";
import type { AppDispatch, RootState } from "../../app/store";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // toast.error(message);
      console.error(message);
    }

    if (isSuccess || user) {
      navigate("/dashboard");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
        }
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(register(formData));
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-blue-400 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden"
      >
        {/* Left side - Avatar Display */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-400">
          <div className="text-center">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="avatar"
                className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-white"
              />
            ) : (
              <FaUser size={100} className="text-white mx-auto mb-4" />
            )}
            <p className="text-white font-semibold text-lg">Your Chat Avatar</p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
          
          {isError && (
             <p className="text-red-500 text-sm mb-4 text-center">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 ring-purple-500">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full outline-none text-gray-700"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 ring-purple-500">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full outline-none text-gray-700"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 ring-purple-500">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full outline-none text-gray-700"
              />
            </div>

            {/* Forget Password */}
            <div className="text-right">
              <a href="#" className="text-purple-600 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Avatar Options */}
            <div className="flex gap-4">
              {/* Take Photo */}
              <label className="flex-1 flex items-center gap-2 justify-center border-2 border-dashed border-gray-300 rounded-xl px-3 py-2 cursor-pointer hover:border-purple-500 transition">
                <FaCamera className="text-gray-400" />
                <span className="text-gray-500 text-sm">Take Photo</span>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  capture="user"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>

              {/* Select from Gallery */}
              <label className="flex-1 flex items-center gap-2 justify-center border-2 border-dashed border-gray-300 rounded-xl px-3 py-2 cursor-pointer hover:border-purple-500 transition">
                <FaPhotoVideo className="text-gray-400" />
                <span className="text-gray-500 text-sm">Select from Gallery</span>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-purple-700 transition"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Create Account"}
            </motion.button>
          </form>

          {/* Social Login Options */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 mb-3">Or sign up with</p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-100 transition"
              >
                <FaGoogle className="text-red-500" />
                Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-100 transition"
              >
                <FaLinkedin className="text-blue-600" />
                LinkedIn
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-100 transition"
              >
                <FaGithub className="text-gray-800" />
                GitHub
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
