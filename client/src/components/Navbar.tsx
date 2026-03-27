import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "Safety", path: "/safety" },
    { name: "About", path: "/about" },
    { name: "Support", path: "/support" },
  ];

  if (["/login", "/signup", "/enter-otp"].includes(location.pathname)) return null;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        scrolled 
          ? "py-4 bg-black/80 backdrop-blur-3xl border-b border-white/10" 
          : "py-8 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group relative z-50">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <span className="font-black text-black text-xl italic mt-0.5 ml-0.5">i</span>
          </motion.div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Voice<span className="text-cyan-400 group-hover:animate-pulse">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-12">
          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:text-cyan-400 relative group/link ${
                  location.pathname === link.path ? "text-cyan-400" : "text-gray-500"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-500 group-hover/link:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
          </div>
          
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          
          <div className="flex items-center gap-10">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="relative group p-[2px] rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 animate-gradient-x"></div>
              <div className="relative px-8 py-3 bg-black rounded-[0.6rem] transition-all group-hover:bg-transparent">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white group-hover:text-black transition-colors">Join Portal</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white relative z-50 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} className="text-cyan-400" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[90] lg:hidden flex flex-col justify-center items-center px-10 text-center"
          >
            <div className="space-y-12">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block text-5xl font-black tracking-tighter text-white hover:text-cyan-400 uppercase italic"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-12 border-t border-white/10 space-y-8"
              >
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-6 bg-white text-black text-sm font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl"
                >
                  Access Portal
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-500 font-black uppercase tracking-[0.4em] text-xs"
                >
                  Return to Login
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
