import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import type { AppDispatch, RootState } from "../../app/store";
import { logout, reset } from "../../features/auth/authSlice";
import SovereignBackground from "../../components/Visuals/SovereignBackground";
import TextScramble from "../../components/Visuals/TextScramble";
import Magnetic from "../../components/Visuals/Magnetic";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-black text-gray-500 font-sans p-6 text-center">
        <div className="absolute inset-0 z-0 opacity-20"><SovereignBackground /></div>
        <div className="relative z-10">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">No Session Detected</h2>
            <Link to="/login" className="text-cyan-400 font-black uppercase tracking-widest text-xs hover:text-white transition">Initialize Protocol</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010101] flex items-center justify-center p-6 relative overflow-hidden selection:bg-cyan-500 selection:text-black font-sans">
      {/* Global 3D Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <SovereignBackground />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-4xl text-center relative group overflow-hidden">
           {/* Red alert glow */}
           <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-red-500/20 transition-all duration-700"></div>

            <div className="mb-10 text-left">
                <Link to="/chat-app">
                   <Magnetic>
                      <button className="inline-flex items-center text-gray-500 hover:text-white transition text-[10px] font-black uppercase tracking-[0.4em] gap-3">
                         <FaArrowLeft className="text-cyan-400" /> <TextScramble text="Resume Comms" />
                      </button>
                   </Magnetic>
                </Link>
            </div>

            <div className="relative mb-8 inline-block">
                {/* Avatar */}
                {user.avatar ? (
                <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white/10 p-1 bg-black shadow-3xl grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                ) : (
                <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 flex items-center justify-center border-4 border-white/10 shadow-3xl">
                    <FaUser size={50} className="text-gray-700" />
                </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-cyan-400 rounded-2xl flex items-center justify-center text-black shadow-xl">
                   <FaShieldAlt size={16} />
                </div>
            </div>

            {/* User Info */}
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">
               <TextScramble text={user.username} />
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-12 italic">{user.email}</p>

            <p className="text-gray-400 text-sm font-medium italic mb-10 px-4">
               Terminate active cryptographic session and disconnect from the iVoice protocol?
            </p>

            {/* Logout Button */}
            <Magnetic>
                <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-4 bg-red-600 text-white font-black py-5 rounded-[2rem] hover:bg-red-700 transition shadow-4xl shadow-red-600/20 uppercase tracking-[0.4em] text-xs group"
                >
                <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
                Kill Session
                </button>
            </Magnetic>

            <Link to="/chat-app" className="block mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white transition">
               Maintain Uplink
            </Link>
        </div>

        <div className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.8em] text-gray-800">
             iVoice Protocol // Sig-Term Sequence 0x01
        </div>
      </motion.div>
    </div>
  );
};

export default Logout;
