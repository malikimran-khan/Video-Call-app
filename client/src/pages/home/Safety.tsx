import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaLock, FaUserShield, FaKey, FaHandshake, FaEyeSlash, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SovereignBackground from "../../components/Visuals/SovereignBackground";
import TextScramble from "../../components/Visuals/TextScramble";
import Magnetic from "../../components/Visuals/Magnetic";

const Safety: React.FC = () => {
  const safetyFeatures = [
    { icon: FaLock, title: "P2P Encryption", desc: "Direct peer-to-peer signaling ensures every call is encrypted from the source without middleman storage.", color: "text-cyan-400", border: "border-cyan-400/20" },
    { icon: FaUserShield, title: "Sovereign Identity", desc: "You own your cryptographic keys. We never sell or access your personal communication metadata.", color: "text-purple-400", border: "border-purple-400/20" },
    { icon: FaShieldAlt, title: "Hardened Core", desc: "Multi-layered firewall defense systems protecting the signaling protocol against DDOS and MITM attacks.", color: "text-emerald-400", border: "border-emerald-400/20" },
    { icon: FaKey, title: "Token Access", desc: "Secure token management and multi-factor authentication built into the very core of account creation.", color: "text-rose-400", border: "border-rose-400/20" },
    { icon: FaHandshake, title: "Engineered Trust", desc: "The protocol is designed such that trust is verified mathematically, not just by policy promises.", color: "text-amber-400", border: "border-amber-400/20" },
    { icon: FaEyeSlash, title: "Signalling Cloak", desc: "Proprietary techniques to mask signaling metadata, ensuring your connection details remain invisible.", color: "text-blue-400", border: "border-blue-400/20" },
  ];

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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[4rem] md:rounded-[8rem] p-12 md:p-32 text-center relative overflow-hidden mb-40 shadow-4xl"
          >
            <div className="relative z-10 max-w-5xl mx-auto">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-cyan-400 mb-12 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
              >
                  <FaShieldAlt className="animate-pulse" /> 
                  <TextScramble text="Certified Security Protocol v5.0" />
              </motion.div>
              
              <h1 className="text-6xl md:text-9xl lg:text-[13rem] font-black tracking-tighter mb-12 leading-[0.8] italic uppercase underline decoration-white/5">
                Atomic <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-gray-800 not-italic">
                    <TextScramble text="Sovereignty." delay={0.5} />
                </span>
              </h1>
              
              <p className="text-xl md:text-3xl text-gray-500 font-medium leading-[1.3] max-w-3xl mx-auto">
                In an era of mass surveillance, iVoice provides a fortress for your conversations. We utilize sub-atomic encryption standards trusted by elite entities.
              </p>
            </div>
          </motion.div>

          {/* Safety Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-60">
            {safetyFeatures.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -15 }}
                className={`p-10 md:p-14 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/5 hover:border-white/10 ${f.border} border-b-4 hover:border-b-white/20 transition-all group flex flex-col justify-between h-[450px] shadow-2xl relative overflow-hidden`}
              >
                <div>
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-10 shadow-3xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                    <f.icon className={`${f.color} text-2xl`} />
                  </div>
                  <h3 className="text-3xl font-black mb-6 tracking-tight italic uppercase group-hover:text-cyan-400 transition-colors underline decoration-white/5">{f.title}</h3>
                  <p className="text-gray-500 text-base md:text-xl font-medium leading-relaxed mb-10">{f.desc}</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 group-hover:text-white transition-all">
                   <Magnetic>
                      <span className="flex items-center gap-3">
                         Audit Documentation <FaArrowRight className="group-hover:translate-x-3 transition-transform" />
                      </span>
                   </Magnetic>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Global Security Section */}
          <div className="relative rounded-[6rem] md:rounded-[10rem] overflow-hidden group shadow-4xl mb-20">
             <div className="absolute inset-0 bg-white text-black p-12 md:p-32 flex flex-col lg:flex-row items-center gap-24 md:gap-32">
                <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-opacity">
                   <FaShieldAlt className="w-[40rem] h-[40rem]" />
                </div>
                
                <div className="flex-1 space-y-12 relative z-10 text-center lg:text-left">
                  <h2 className="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.85] italic uppercase underline decoration-black/5">Hardened <br/> <span className="text-gray-400">Security.</span></h2>
                  <p className="text-xl md:text-3xl text-gray-600 font-bold leading-tight italic border-l-[10px] border-black/10 pl-8 hidden md:block uppercase tracking-tighter">
                     "Privacy is the default, not an option."
                  </p>
                  <div className="flex items-center gap-8 justify-center lg:justify-start pt-8">
                      <div className="w-24 h-24 bg-gray-100 rounded-4xl border border-black/5 flex items-center justify-center font-black italic text-4xl shadow-xl">M.V</div>
                      <div className="text-left">
                          <p className="text-3xl font-black italic uppercase">Marcus Vane</p>
                          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.5em] mt-1">Chief Architect of Sovereignty</p>
                      </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 relative z-10 w-full">
                   {[
                     "Zero-Storage Metadata Protocol",
                     "Hardware-Accelerated Encryption",
                     "Biometric Token Verification",
                     "Quantum-Resistant Signaling"
                   ].map((item, i) => (
                     <motion.div 
                       key={i} 
                       whileHover={{ x: 15 }}
                       className="flex items-center gap-8 p-10 bg-gray-50/80 rounded-[3rem] border border-black/5 hover:bg-black hover:text-white transition-all cursor-default shadow-sm hover:shadow-2xl"
                     >
                        <FaCheckCircle className="text-2xl text-cyan-500 opacity-60" />
                        <span className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none">{item}</span>
                     </motion.div>
                   ))}
                   
                   <div className="pt-12 flex justify-center lg:justify-start gap-16 md:gap-24 opacity-30 border-t border-black/5 mt-10">
                      <div className="text-center">
                         <p className="text-5xl font-black mb-1 italic">AES-256</p>
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Standard</p>
                      </div>
                      <div className="text-center border-l border-black/10 pl-16 md:pl-24">
                         <p className="text-5xl font-black mb-1 italic">P2P</p>
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Handshake</p>
                      </div>
                   </div>
                </div>
             </div>
             {/* Spacing for absolute relative trick */}
             <div className="h-[1100px] lg:h-[900px]"></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Safety;
