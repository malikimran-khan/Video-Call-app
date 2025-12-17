import React, { useState, type FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaLinkedin, FaGithub, FaArrowLeft } from "react-icons/fa";
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
    if (isSuccess || user) {
      navigate("/chat-app"); // Redirect to chat directly
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col md:flex-row">
       {/* Left Side - Image/Brand */}
       <div className="hidden md:flex flex-col justify-between w-1/2 bg-gray-50 p-12 border-r border-gray-100">
          <div className="text-2xl font-bold tracking-tighter">iVoice.</div>
          <div className="mb-20">
             <h2 className="text-5xl font-bold mb-6 text-black tracking-tight">Welcome back.</h2>
             <p className="text-xl text-gray-500 max-w-md">Log in to continue your conversations and stay connected with your team.</p>
          </div>
          <div className="text-sm text-gray-400">© iVoice Inc.</div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
          <div className="w-full max-w-md">
             <Link to="/" className="inline-flex items-center text-gray-500 hover:text-black mb-8 transition text-sm font-medium">
               <FaArrowLeft className="mr-2" /> Back to Home
             </Link>
             
             <div className="mb-10">
                <h2 className="text-3xl font-bold mb-2">Log In</h2>
                <p className="text-gray-500">Enter your credentials to access your account.</p>
             </div>

             {isError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                 {message}
              </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                   <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
                        placeholder="name@company.com"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                   <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                         {showPassword ? <FaEyeSlash/> : <FaEye/>}
                      </button>
                   </div>
                </div>

                <div className="flex justify-end">
                   <a href="#" className="text-sm font-medium text-gray-600 hover:text-black">Forgot password?</a>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isLoading}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 transition shadow-lg disabled:opacity-70"
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </motion.button>
             </form>

             <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                   <span className="px-2 bg-white text-gray-400">Or continue with</span>
                </div>
             </div>

             <div className="mt-8 flex gap-4">
                {[
                   { icon: FaGoogle, color: "text-red-500", label: "Google" },
                   { icon: FaLinkedin, color: "text-blue-600", label: "LinkedIn" },
                   { icon: FaGithub, color: "text-gray-800", label: "GitHub" }
                ].map((social, idx) => (
                   <button key={idx} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                      <social.icon className={social.color} size={20} />
                   </button>
                ))}
             </div>

             <p className="mt-10 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/signup" className="font-bold text-black hover:underline">Sign up</Link>
             </p>
          </div>
       </div>
    </div>
  );
};

export default Login;
