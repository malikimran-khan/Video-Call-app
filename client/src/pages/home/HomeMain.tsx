import React from "react";
import { motion } from "framer-motion";
import { FaVideo, FaPhone, FaComments, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomeMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center">
      
      {/* Navbar / Header */}
      <nav className="w-full max-w-7xl px-6 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tighter">iVoice.</h1>
        <div className="flex gap-4">
           <Link to="/login" className="font-medium hover:text-gray-600 transition">Login</Link>
           <Link to="/signup" className="font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center pt-24 px-6 max-w-4xl"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4 block">Connect Simpler.</span>
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight text-black">
          Talk. Chat. <br/> Connect.
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          A minimalist platform for meaningful connections. Crystal clear audio, high-definition video, and instant messaging. No distractions.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white text-lg font-semibold py-4 px-10 rounded-full shadow-lg hover:bg-gray-900 transition flex items-center gap-2"
            >
              Get Started <FaArrowRight size={16}/>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="flex flex-wrap justify-center gap-8 mt-32 px-6 mb-20"
      >
        {[
          { icon: FaComments, title: "Instant Chat", desc: "Real-time messaging with a clean, focused interface." },
          { icon: FaPhone, title: "Voice Calls", desc: "Low-latency voice connection for seamless conversations." },
          { icon: FaVideo, title: "Video Calls", desc: "HD video calling to bring you closer to your network." },
        ].map((feature, idx) => (
           <motion.div 
             key={idx}
             whileHover={{ y: -5 }} 
             className="bg-gray-50 border border-gray-200 rounded-2xl p-8 w-80 text-left hover:shadow-xl transition-all duration-300"
           >
            <feature.icon size={32} className="text-black mb-6" />
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Footer */}
      <footer className="w-full py-8 text-center text-gray-400 text-sm border-t border-gray-100 mt-auto">
        &copy; {new Date().getFullYear()} iVoice Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default HomeMain;
