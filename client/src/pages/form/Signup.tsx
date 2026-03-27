import React, { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaPhotoVideo, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, reset } from "../../features/auth/authSlice";
import type { AppDispatch, RootState } from "../../app/store";
import SovereignBackground from "../../components/Visuals/SovereignBackground";
import TextScramble from "../../components/Visuals/TextScramble";
import Magnetic from "../../components/Visuals/Magnetic";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      navigate("/verify-otp", { state: { email: formData.email } });
      dispatch(reset());
    }
  }, [isSuccess, formData.email, navigate, dispatch]);

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
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      {/* Left Side - Brand Visual */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-20 relative overflow-hidden border-r border-white/5 bg-black">
         <div className="absolute inset-0 z-0 opacity-40">
            <SovereignBackground />
         </div>

         <div className="relative z-10">
            <div className="text-3xl font-black tracking-tighter italic uppercase flex items-center gap-3">
               <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <FaShieldAlt size={16} />
               </div>
               iVoice.
            </div>
         </div>

         <div className="relative z-10 mb-20">
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 mb-8"
            >
               <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
               Protocol Initialization
            </motion.div>
            <h2 className="text-8xl font-black mb-8 tracking-tighter leading-[0.85] italic uppercase underline decoration-white/5">
               Join <br /> The <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white not-italic">Network.</span>
            </h2>
            <p className="text-2xl text-gray-400 max-w-md font-medium leading-[1.2] italic uppercase tracking-tighter">
               Establish your identity on the sovereign communication swarm.
            </p>
         </div>

         <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">
            © 2026 iVoice Protocol // Decentralized Authentication
         </div>
      </div>

       {/* Right Side - Form */}
       <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative overflow-y-auto custom-scrollbar">
          <div className="absolute inset-0 md:hidden opacity-20">
             <SovereignBackground />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md relative z-10 py-12"
          >
             <div className="mb-10">
                <Link to="/">
                   <Magnetic>
                      <span className="inline-flex items-center text-gray-400 hover:text-purple-400 transition text-xs font-black uppercase tracking-[0.3em] gap-3 mb-8 cursor-pointer">
                         <FaArrowLeft className="text-purple-400" /> <TextScramble text="Back to Network" />
                      </span>
                   </Magnetic>
                </Link>
                
                <h2 className="text-5xl font-black mb-2 italic uppercase tracking-tighter underline decoration-white/5">Establish Identity</h2>
                <p className="text-gray-500 font-medium italic">Enter your cryptographic details.</p>
             </div>

             {isError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm mb-10 backdrop-blur-3xl font-bold uppercase tracking-tighter"
              >
                  {message}
              </motion.div>
             )}

             <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Selection */}
                <div className="flex justify-center mb-8 relative group">
                  <div className="relative">
                    {formData.avatar ? (
                      <div className="relative">
                         <img src={formData.avatar} alt="avatar" className="w-28 h-28 rounded-[2rem] object-cover border-2 border-purple-500/30 p-1 bg-white/5" />
                         <button type="button" onClick={() => setFormData({...formData, avatar: ""})} className="absolute -top-2 -right-2 bg-black border border-white/10 rounded-full p-2 text-red-500 hover:bg-red-500 hover:text-white transition shadow-xl">✕</button>
                      </div>
                    ) : (
                       <div className="w-28 h-28 rounded-[2rem] bg-white/5 flex items-center justify-center text-gray-600 border border-dashed border-white/20 group-hover:border-purple-400 transition-colors">
                          <FaUser size={40} className="group-hover:text-purple-400 transition-colors" />
                       </div>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-3 group-focus-within:text-purple-400 transition-colors">Nom de Guerre</label>
                   <div className="relative">
                      <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
                      <input 
                        type="text" 
                        name="username"
                        required 
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-400/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-gray-700 font-bold tracking-tight"
                        placeholder="Anonymous Node"
                      />
                   </div>
                </div>

                <div className="group">
                   <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-3 group-focus-within:text-purple-400 transition-colors">Transmission Channel</label>
                   <div className="relative">
                      <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
                      <input 
                        type="email" 
                        name="email"
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-400/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-gray-700 font-bold tracking-tight"
                        placeholder="node@protocol.net"
                      />
                   </div>
                </div>

                <div className="group">
                   <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-3 group-focus-within:text-purple-400 transition-colors">Cryptographic Key</label>
                   <div className="relative">
                      <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
                      <input 
                        type="password"
                        name="password"
                        required 
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-400/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-gray-700 font-bold tracking-tight"
                        placeholder="••••••••"
                      />
                   </div>
                </div>

                {/* Avatar Upload Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center justify-center gap-3 py-4 border border-white/5 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-purple-400/50 transition-all text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">
                     <FaCamera /> Snapshot
                     <input type="file" name="avatar" accept="image/*" capture="user" onChange={handleChange} className="hidden" />
                  </label>
                  <label className="flex items-center justify-center gap-3 py-4 border border-white/5 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-purple-400/50 transition-all text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white">
                     <FaPhotoVideo /> Upload
                     <input type="file" name="avatar" accept="image/*" onChange={handleChange} className="hidden" />
                  </label>
                </div>

                <Magnetic>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="w-full bg-white text-black font-black py-5 rounded-[2.5rem] hover:bg-purple-500 transition shadow-2xl disabled:opacity-70 mt-6 flex items-center justify-center gap-4 text-sm uppercase tracking-[0.5em] group"
                  >
                    {isLoading ? (
                       <div className="w-5 h-5 border-[3px] border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                       <>
                          Initialize <TextScramble text="Node" delay={0.1} />
                       </>
                    )}
                  </motion.button>
                </Magnetic>
             </form>

             <p className="mt-12 text-center text-gray-500 font-medium italic">
                Already registered?{" "}
                <Link to="/login" className="text-white hover:text-purple-400 transition font-black uppercase tracking-widest text-xs ml-2 border-b border-white/10 pb-0.5">Initialize Session</Link>
             </p>
          </motion.div>
       </div>
    </div>
  );
};

export default Signup;
