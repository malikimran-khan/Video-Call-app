import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaRocket, FaShieldAlt, FaHeart, FaArrowRight } from "react-icons/fa";
import SovereignBackground from "../../components/Visuals/SovereignBackground";
import TextScramble from "../../components/Visuals/TextScramble";
import Magnetic from "../../components/Visuals/Magnetic";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="relative pt-40 pb-48">
        {/* 3D Sovereign Background */}
        <div className="absolute inset-0 z-0 opacity-30">
            <SovereignBackground />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-6 relative z-10"
        >
          <div className="text-center mb-60">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-4 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-cyan-400 mb-12 shadow-[0_0_40px_rgba(34,211,238,0.1)]"
            >
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
               <TextScramble text="THE IVOICE MANIFESTO v1.0" />
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl lg:text-[13rem] font-black tracking-tighter text-white mb-16 leading-[0.8] italic uppercase underline decoration-white/5">
              Connection <br/> Without <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white not-italic">
                <TextScramble text="Compromise." delay={0.5} />
              </span>
            </h1>
            
            <p className="text-xl md:text-4xl text-gray-500 max-w-5xl mx-auto font-medium leading-[1.2]">
              We believe communication should be a human right, not a data-mining opportunity. iVoice was born from a radical vision of a decentralized, serverless przyszłość.
            </p>
          </div>

          {/* Interactive Feature Reveal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-60">
             <motion.div 
               whileHover={{ y: -10 }}
               className="p-12 md:p-20 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/5 hover:border-white/10 transition-all group shadow-2xl"
             >
                <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center text-black mb-12 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                   <FaRocket className="text-2xl" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-8 underline decoration-white/5">The Mission</h2>
                <p className="text-gray-500 text-lg md:text-2xl font-medium leading-relaxed mb-12">
                   To dismantle the centralized communication monopolies. We engineering protocols that scale with the people, ensuring high-fidelity voice and video are accessible on every corner of the digital map.
                </p>
                <div className="w-12 h-1 bg-cyan-400 group-hover:w-full transition-all duration-1000"></div>
             </motion.div>

             <motion.div 
               whileHover={{ y: -10 }}
               className="p-12 md:p-20 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/5 hover:border-white/10 transition-all group shadow-2xl"
             >
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white mb-12 shadow-2xl group-hover:-rotate-12 transition-transform duration-500">
                   <FaShieldAlt className="text-2xl" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-8 underline decoration-white/5">The Ethics</h2>
                <p className="text-gray-500 text-lg md:text-2xl font-medium leading-relaxed mb-12">
                   Your privacy is not a setting; it's the architecture. We build with zero-knowledge principles, meaning we couldn't see your data even if we wanted to. No logs. No backdoors.
                </p>
                <div className="w-12 h-1 bg-purple-500 group-hover:w-full transition-all duration-1000"></div>
             </motion.div>
          </div>

          {/* High-Impact Story Section */}
          <div className="relative rounded-[6rem] md:rounded-[10rem] overflow-hidden group shadow-4xl">
             <div className="absolute inset-0 bg-white text-black p-16 md:p-32 flex flex-col items-center text-center justify-center shadow-inner">
                <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:rotate-45 transition-transform duration-[2000ms]">
                   <FaHeart className="w-[40rem] h-[40rem]" />
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="relative z-10 max-w-5xl"
                >
                   <h2 className="text-5xl md:text-[10rem] font-black tracking-tighter mb-12 leading-[0.85] italic uppercase underline decoration-black/5">The Evolution.</h2>
                   <p className="text-xl md:text-3xl text-gray-600 font-bold leading-tight mb-20 px-4 md:px-12 uppercase tracking-tighter">
                      Founded in 2024 as a cryptographic experiment, iVoice has rapidly evolved into the preferred platform for the select few.
                   </p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 items-start border-t border-black/10 pt-20">
                      <div className="space-y-4">
                         <p className="text-6xl md:text-8xl font-black tracking-tighter italic border-b-8 border-black inline-block px-4">2024</p>
                         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Handshake Initialized</p>
                      </div>
                      <div className="space-y-4">
                         <p className="text-6xl md:text-8xl font-black tracking-tighter italic border-b-8 border-black inline-block px-4">2025</p>
                         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Swarm Deployment</p>
                      </div>
                      <div className="space-y-4">
                         <p className="text-6xl md:text-8xl font-black tracking-tighter italic border-b-8 border-black inline-block px-4">2026</p>
                         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Global Dominance</p>
                      </div>
                   </div>
                </motion.div>
             </div>
             {/* Spacing for absolute relative trick */}
             <div className="h-[900px] md:h-[1100px]"></div>
          </div>

          {/* Call to action within About */}
          <div className="mt-60 text-center mb-20">
             <h3 className="text-4xl md:text-6xl font-black italic uppercase mb-12 text-white/90">Join the Resistance.</h3>
             <Link to="/signup" className="inline-block">
                <Magnetic>
                   <motion.button 
                      whileHover={{ scale: 1.05, y: -10, boxShadow: "0 40px 80px rgba(255,255,255,0.1)" }}
                      className="bg-white text-black px-16 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[10px] md:text-[12px] hover:bg-cyan-400 transition-all flex items-center gap-4"
                   >
                      Initialize Portal <FaArrowRight />
                   </motion.button>
                </Magnetic>
             </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
