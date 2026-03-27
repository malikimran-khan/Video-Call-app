import React, { useState, type FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../../features/auth/authSlice";
import type { AppDispatch, RootState } from "../../app/store";
import SovereignBackground from "../../components/Visuals/SovereignBackground";
import TextScramble from "../../components/Visuals/TextScramble";
import Magnetic from "../../components/Visuals/Magnetic";

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
    if (message === "verify-otp") {
      navigate("/verify-otp", { state: { email } });
      dispatch(reset());
      return;
    }

    if (isSuccess || user) {
      navigate("/chat-app"); 
    }
    
    if (isError && message !== "verify-otp") {
      // Normal error handling continues
    }
  }, [user, isError, isSuccess, message, navigate, dispatch, email]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
       {/* Left Side - High Impact Brand */}
       <div className="hidden md:flex flex-col justify-between w-1/2 p-20 relative overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 z-0 opacity-40">
             <SovereignBackground />
          </div>
          
          <div className="relative z-10">
             <div className="text-3xl font-black tracking-tighter italic uppercase flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center text-black">
                   <FaShieldAlt size={16} />
                </div>
                iVoice.
             </div>
          </div>

          <div className="relative z-10 mb-20">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-8"
             >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Secure Handshake
             </motion.div>
             <h2 className="text-8xl font-black mb-8 tracking-tighter leading-[0.85] italic uppercase">
                Welcome <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600 not-italic underline decoration-white/5">Back.</span>
             </h2>
             <p className="text-2xl text-gray-500 max-w-md font-medium leading-tight">
                Log in to resume secure, decentralized communications on the iVoice protocol.
             </p>
          </div>

          <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">
             © 2026 iVoice Protocol // System Encryption Active
          </div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
          {/* Subtle noise/glow for mobile or background */}
          <div className="absolute inset-0 md:hidden opacity-20">
             <SovereignBackground />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md relative z-10"
          >
             <div className="mb-12">
                <Link to="/">
                    <Magnetic>
                        <span className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition text-xs font-black uppercase tracking-[0.3em] gap-3 mb-10 cursor-pointer">
                            <FaArrowLeft className="text-cyan-400" /> <TextScramble text="Back to Network" />
                        </span>
                    </Magnetic>
                </Link>
                
                <h1 className="text-5xl font-black mb-3 italic uppercase tracking-tighter underline decoration-white/5">Log In</h1>
                <p className="text-gray-500 font-medium text-lg italic">Enter credentials to initialize session.</p>
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

             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="group">
                   <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-4 group-focus-within:text-cyan-400 transition-colors">Access Identifier</label>
                   <div className="relative">
                      <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400 transition-colors" />
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-gray-700 font-bold tracking-tight shadow-xl"
                        placeholder="user@protocol.net"
                      />
                   </div>
                </div>

                <div className="group">
                   <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-4 group-focus-within:text-cyan-400 transition-colors">Security Key</label>
                   <div className="relative">
                      <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-400 transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-gray-700 font-bold tracking-tight shadow-xl"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                         {showPassword ? <FaEyeSlash size={18}/> : <FaEye size={18}/>}
                      </button>
                   </div>
                </div>

                <div className="flex justify-end pt-2">
                   <Link to="/forgot-password">
                      <Magnetic>
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white transition-colors cursor-pointer">Forget Key?</span>
                      </Magnetic>
                   </Link>
                </div>

                <Magnetic>
                   <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     disabled={isLoading}
                     className="w-full bg-white text-black font-black py-5 rounded-[2rem] hover:bg-cyan-400 transition shadow-[0_20px_40px_rgba(0,0,0,0.5)] disabled:opacity-70 flex items-center justify-center gap-4 text-sm uppercase tracking-[0.6em] relative overflow-hidden group"
                   >
                     {isLoading ? (
                       <div className="w-5 h-5 border-[3px] border-black/30 border-t-black rounded-full animate-spin" />
                     ) : (
                        <>
                           Initialize <TextScramble text="Session" delay={0.1} />
                        </>
                     )}
                   </motion.button>
                </Magnetic>
             </form>

             <div className="mt-16 text-center">
                <p className="text-gray-500 font-medium italic">
                   New to the resistance?{" "}
                   <Link to="/signup" className="text-white hover:text-cyan-400 transition font-black uppercase tracking-widest text-xs ml-2 border-b border-white/10 pb-0.5">
                      Join Portal
                   </Link>
                </p>
             </div>
          </motion.div>
       </div>
    </div>
  );
};

export default Login;
