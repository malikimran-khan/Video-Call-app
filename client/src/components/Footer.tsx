import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTwitter, FaGithub, FaDiscord, FaYoutube, FaArrowUp } from "react-icons/fa";

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const footerLinks = [
    {
      title: "Protocol",
      links: [
        { name: "Core Features", path: "/features" },
        { name: "Security Specs", path: "/safety" },
        { name: "Mission Brief", path: "/about" },
        { name: "Developer API", path: "#" },
      ]
    },
    {
      title: "Governance",
      links: [
        { name: "Privacy Policy", path: "/about" },
        { name: "Terms of Service", path: "/support" },
        { name: "Contact Node", path: "/support" },
        { name: "Status Page", path: "#" },
      ]
    }
  ];

  return (
    <footer className="bg-black text-white pt-40 pb-16 border-t border-white/5 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24 mb-32">
          <div className="lg:col-span-1 space-y-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <span className="font-black text-black text-xl italic mt-0.5 ml-0.5">i</span>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">Voice<span className="text-cyan-400">.</span></span>
            </Link>
            <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-xs italic">
              The elite communication layer for the modern world. Built on privacy, powered by peer-to-peer technology.
            </p>
            <div className="flex gap-4">
              {[FaTwitter, FaGithub, FaDiscord, FaYoutube].map((Icon, i) => (
                 <motion.a 
                    key={i} 
                    href="#" 
                    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)", color: "#22d3ee" }}
                    className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-500 transition-all"
                 >
                    <Icon size={20} />
                 </motion.a>
              ))}
            </div>
          </div>

          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white mb-10">{section.title}</h4>
              <ul className="space-y-5 text-sm md:text-base font-bold text-gray-500">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link to={link.path} className="hover:text-cyan-400 transition-colors inline-block group flex items-center gap-3 uppercase italic tracking-tighter">
                      <span className="w-0 h-px bg-cyan-400 transition-all group-hover:w-4"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 border border-white/10 p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-6 relative z-10">Network Pulse</h4>
             
             <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="relative">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute inset-0 opacity-50"></div>
                   <div className="w-3 h-3 bg-emerald-500 rounded-full relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                </div>
                <span className="text-2xl font-black tracking-tighter italic uppercase">Nodes Active</span>
             </div>
             
             <div className="space-y-4 relative z-10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                   <span>Global Load</span>
                   <span className="text-white">12%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "12%" }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-cyan-400"
                   ></motion.div>
                </div>
                <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-tighter">
                   Health: <span className="text-emerald-400">Optimal (99.98%)</span>
                </p>
             </div>
          </motion.div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 text-center md:text-left">
            © 2026 iVoice Protocol. <br className="md:hidden" /> <span className="text-white/20">All Rights Reserved.</span>
          </p>
          <div className="flex items-center gap-12">
             <button 
               onClick={scrollToTop}
               className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white transition-colors"
             >
               Return to Zenith <FaArrowUp className="group-hover:-translate-y-2 transition-transform duration-500 text-cyan-400" />
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
