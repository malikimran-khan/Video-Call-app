import React, { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaPhotoVideo, FaGoogle, FaLinkedin, FaGithub, FaArrowLeft } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
    if (isSuccess || user) {
      navigate("/chat-app");
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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col md:flex-row">
      {/* Left Side - Brand Info */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-black text-white p-12">
         <div className="text-2xl font-bold tracking-tighter">iVoice.</div>
         <div className="mb-20">
            <h2 className="text-5xl font-bold mb-6 tracking-tight">Join the network.</h2>
            <p className="text-xl text-gray-400 max-w-md">Create an account to start connecting with colleagues and friends in high definition.</p>
         </div>
         <div className="text-sm text-gray-500">© iVoice Inc.</div>
      </div>

       {/* Right Side - Form */}
       <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white overflow-y-auto">
          <div className="w-full max-w-md">
             <Link to="/" className="inline-flex items-center text-gray-500 hover:text-black mb-8 transition text-sm font-medium">
               <FaArrowLeft className="mr-2" /> Back to Home
             </Link>
             
             <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-gray-500">Enter your details to get started.</p>
             </div>

             {isError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                 {message}
              </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-5">
                {/* Avatar Selection */}
                <div className="flex justify-center mb-6">
                  {formData.avatar ? (
                    <div className="relative group">
                       <img src={formData.avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
                       <button type="button" onClick={() => setFormData({...formData, avatar: ""})} className="absolute top-0 right-0 bg-gray-200 rounded-full p-1 text-gray-600 hover:bg-red-500 hover:text-white transition text-xs">✕</button>
                    </div>
                  ) : (
                     <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                        <FaUser size={32} />
                     </div>
                  )}
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                   <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        name="username"
                        required 
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
                        placeholder="John Doe"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                   <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        name="email"
                        required 
                        value={formData.email}
                        onChange={handleChange}
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
                        type="password"
                        name="password"
                        required 
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
                        placeholder="••••••••"
                      />
                   </div>
                </div>

                {/* Avatar Upload Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition text-sm font-medium text-gray-600">
                     <FaCamera /> Take Photo
                     <input type="file" name="avatar" accept="image/*" capture="user" onChange={handleChange} className="hidden" />
                  </label>
                  <label className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition text-sm font-medium text-gray-600">
                     <FaPhotoVideo /> Upload
                     <input type="file" name="avatar" accept="image/*" onChange={handleChange} className="hidden" />
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isLoading}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 transition shadow-lg disabled:opacity-70 mt-4"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </motion.button>
             </form>

             <p className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-black hover:underline">Log in</Link>
             </p>
          </div>
       </div>
    </div>
  );
};

export default Signup;
