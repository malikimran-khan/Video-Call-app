import React from "react";
import { motion } from "framer-motion";
import { FaVideo, FaPhone, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomeMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-r from-purple-600 via-blue-400 to-pink-500 text-white flex flex-col items-center">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center pt-32 px-6"
      >
        <h1 className="text-6xl font-bold mb-4">iVoice</h1>
        <p className="text-xl mb-10">Connect Anytime, Anywhere</p>

        <div className="flex gap-6 justify-center">
          
          {/* Sign Up Button */}
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg transition"
            >
              Sign Up
            </motion.button>
          </Link>

          {/* Login Button */}
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-full shadow-lg transition"
            >
              Login
            </motion.button>
          </Link>

        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="flex flex-wrap justify-center gap-10 mt-20 px-6"
      >
        <motion.div whileHover={{ y: -10 }} className="bg-white/20 backdrop-blur-md rounded-2xl p-8 w-64 text-center">
          <FaComments size={40} className="text-purple-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Chat</h3>
          <p className="text-gray-100 text-sm">Instant messaging with friends and family.</p>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="bg-white/20 backdrop-blur-md rounded-2xl p-8 w-64 text-center">
          <FaPhone size={40} className="text-pink-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Voice Call</h3>
          <p className="text-gray-100 text-sm">Crystal clear voice calls anytime.</p>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="bg-white/20 backdrop-blur-md rounded-2xl p-8 w-64 text-center">
          <FaVideo size={40} className="text-blue-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Video Call</h3>
          <p className="text-gray-100 text-sm">Face-to-face video calls with ease.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomeMain;
