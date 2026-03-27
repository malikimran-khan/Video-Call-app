import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaQuestionCircle, FaBook, FaLifeRing, FaArrowRight } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SovereignBackground from "../../components/Visuals/SovereignBackground";
import TextScramble from "../../components/Visuals/TextScramble";
import Magnetic from "../../components/Visuals/Magnetic";

const Support: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="relative pt-40 pb-48">
        {/* 3D Sovereign Background */}
        <div className="absolute inset-0 z-0 opacity-20">
            <SovereignBackground />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-4 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-cyan-400 mb-12 shadow-[0_0_40px_rgba(34,211,238,0.1)]"
            >
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
               <TextScramble text="Technical Operations v3.1" />
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl lg:text-[12rem] font-black tracking-tighter text-white mb-14 leading-[0.85] italic uppercase underline decoration-white/5">
              Elite <br/> Protocol <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 not-italic">
                <TextScramble text="Support." delay={0.5} />
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-500 max-w-2xl mx-auto font-medium leading-[1.3]">
              From detailed technical documentation to real-time node assistance—we ensure your iVoice terminal remains operational.
            </p>
          </motion.div>

          {/* Support Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-60 relative z-10">
            {[
              { icon: FaQuestionCircle, title: "Operations Manual", desc: "Detailed technical guides for maximizing your call quality and security protocols.", color: "text-cyan-400" },
              { icon: FaBook, title: "Protocol Specs", desc: "Access the full iVoice API and peer-to-peer signaling documentation for custom integrations.", color: "text-purple-400" },
              { icon: FaLifeRing, title: "Node Assistance", desc: "Direct communication with our global network operations community for mission-critical help.", color: "text-emerald-400" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-3xl p-12 md:p-16 rounded-[4rem] border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all group cursor-pointer flex flex-col justify-between h-[450px] shadow-2xl relative overflow-hidden"
              >
                <div>
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-10 shadow-3xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                    <item.icon className={`${item.color} text-2xl`} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-6 italic tracking-tight uppercase group-hover:text-cyan-400 transition-colors underline decoration-white/5">{item.title}</h3>
                  <p className="text-gray-500 text-base md:text-xl font-medium leading-relaxed mb-10">{item.desc}</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 group-hover:text-white transition-all">
                   <Magnetic>
                      <span className="flex items-center gap-3">
                         Open Repository <FaArrowRight className="group-hover:translate-x-3 transition-transform" />
                      </span>
                   </Magnetic>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="bg-white text-black rounded-[5rem] md:rounded-[8rem] p-12 md:p-32 overflow-hidden relative group shadow-4xl mb-20 backdrop-blur-3xl">
             <div className="absolute -bottom-20 -right-20 p-20 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <FaEnvelope className="w-[30rem] h-[30rem]" />
             </div>
             
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-12">
                  <h2 className="text-5xl md:text-[10rem] font-black tracking-tighter leading-[0.85] italic uppercase underline decoration-black/5">Seeking <br /> <span className="text-gray-400">Input?</span></h2>
                  <p className="text-xl md:text-3xl text-gray-600 font-bold leading-tight max-w-md uppercase tracking-tighter">
                    "Our specialized support unit typically responds within 24 hours."
                  </p>
                  <div className="flex gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all border-t border-black/5 pt-12">
                     <div className="text-center">
                        <p className="text-4xl md:text-6xl font-black mb-2 italic">98%</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Satisfaction</p>
                     </div>
                     <div className="text-center border-l border-black/10 pl-12 md:pl-20">
                        <p className="text-4xl md:text-6xl font-black mb-2 italic">&lt;2hr</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Avg Response</p>
                     </div>
                  </div>
                </div>

                <form className="space-y-8 bg-gray-50/80 p-12 md:p-16 rounded-[4rem] border border-black/10 backdrop-blur-3xl shadow-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-4 font-black uppercase tracking-[0.4em] text-[10px]">
                         <label className="text-gray-400">User Identity</label>
                         <input type="text" placeholder="Designation" className="w-full bg-white border border-black/10 rounded-2xl px-8 py-6 outline-none focus:ring-4 focus:ring-cyan-400/10 transition-all text-sm font-bold placeholder:text-gray-300" />
                      </div>
                      <div className="space-y-4 font-black uppercase tracking-[0.4em] text-[10px]">
                         <label className="text-gray-400">Channel Path</label>
                         <input type="email" placeholder="Email Address" className="w-full bg-white border border-black/10 rounded-2xl px-8 py-6 outline-none focus:ring-4 focus:ring-cyan-400/10 transition-all text-sm font-bold placeholder:text-gray-300" />
                      </div>
                  </div>
                  <div className="space-y-4 font-black uppercase tracking-[0.4em] text-[10px]">
                     <label className="text-gray-400">Transmission Content</label>
                     <textarea placeholder="Describe the protocol error..." rows={5} className="w-full bg-white border border-black/10 rounded-[2.5rem] px-8 py-8 outline-none focus:ring-4 focus:ring-cyan-400/10 transition-all text-sm font-bold resize-none placeholder:text-gray-300"></textarea>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-black text-white py-10 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[12px] hover:bg-cyan-400 hover:text-black transition-all shadow-4xl"
                  >
                      Dispatch Packet
                  </motion.button>
                </form>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
