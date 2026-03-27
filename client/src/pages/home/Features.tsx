import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaVideo, FaPhone, FaComments, FaShieldAlt, FaGlobe, FaBolt, FaArrowRight, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SovereignBackground from "../../components/Visuals/SovereignBackground";
import TextScramble from "../../components/Visuals/TextScramble";
import Magnetic from "../../components/Visuals/Magnetic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Features: React.FC = () => {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".feature-card", {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".feature-grid",
        start: "top 80%",
      }
    });

    gsap.to(".parallax-bg", {
      y: -100,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, { scope: container });

  const allFeatures = [
    { icon: FaVideo, title: "4K Video Pipeline", desc: "Proprietary neural codecs that scale resolution in real-time based on node density and network health.", color: "text-cyan-400", border: "border-cyan-400/20" },
    { icon: FaPhone, title: "Spatial Audio", desc: "True 3D soundstage with zero-lag background isolation and cryptographic voice masking options.", color: "text-purple-400", border: "border-purple-400/20" },
    { icon: FaComments, title: "Swarm Messaging", desc: "Decentralized message propagation across the peer network with zero central metadata storage.", color: "text-emerald-400", border: "border-emerald-400/20" },
    { icon: FaShieldAlt, title: "AES-GCM 256", desc: "Hardened military-grade encryption for every byte of data, fragmented and distributed across nodes.", color: "text-rose-400", border: "border-rose-400/20" },
    { icon: FaGlobe, title: "Global Mesh", desc: "A living ecosystem of distributed nodes ensuring sub-50ms latency for all continental bridges.", color: "text-amber-400", border: "border-amber-400/20" },
    { icon: FaBolt, title: "Neural Handshake", desc: "Instantaneous peer discovery and session initialization optimized for mobile and low-power hardware.", color: "text-blue-400", border: "border-blue-400/20" },
  ];

  return (
    <div ref={container} className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      <Navbar />
      
      <main className="relative pt-40 pb-48 hero-section">
        {/* 3D Sovereign Background */}
        <div className="absolute inset-0 z-0 opacity-40 parallax-bg">
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
               <TextScramble text="Protocol Spec v2.5.8 Finalized" />
            </motion.div>

            <h1 className="text-6xl md:text-9xl lg:text-[12rem] font-black tracking-tighter text-white mb-14 leading-[0.85] italic uppercase underline decoration-white/5">
              Engineered <br/> <TextScramble text="Dominance." delay={0.5} />
            </h1>
            
            <p className="text-xl md:text-3xl text-gray-500 max-w-4xl mx-auto font-medium leading-[1.3]">
              Every function is a masterpiece of peer-to-peer logic, stripping away the central server to put the power of communication back in your control.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-60 feature-grid">
            {allFeatures.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -20 }}
                className={`feature-card p-10 md:p-16 bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/5 hover:border-white/10 ${f.border} border-b-4 hover:border-b-white/20 transition-all group h-full flex flex-col justify-between shadow-2xl`}
              >
                <div>
                  <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-10 shadow-3xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                    <f.icon className={`${f.color} text-3xl`} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tight italic uppercase group-hover:text-cyan-400 transition-colors underline decoration-white/5">{f.title}</h3>
                  <p className="text-gray-500 text-base md:text-xl font-medium leading-relaxed mb-12">{f.desc}</p>
                </div>
                <Link to="/support" className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 group-hover:text-white transition-all">
                   <Magnetic>
                      <span className="flex items-center gap-3">
                         Technical Whitepaper <FaArrowRight className="group-hover:translate-x-3 transition-transform" />
                      </span>
                   </Magnetic>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Hero Interaction Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-12 md:p-32 bg-white/5 rounded-[5rem] md:rounded-[8rem] border border-white/5 flex flex-col lg:flex-row items-center gap-24 relative overflow-hidden group shadow-4xl backdrop-blur-3xl"
          >
              <div className="absolute -bottom-20 -right-20 p-20 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                 <FaBolt className="w-[30rem] h-[30rem] text-cyan-400" />
              </div>
              
              <div className="flex-1 space-y-12 relative z-10">
                 <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic text-white uppercase group-hover:text-cyan-400 transition-colors">
                    Sovereign <br /> <span className="not-italic opacity-20">Network.</span>
                 </h2>
                 <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-lg">
                    We've eliminated the mid-point relay. Your data flows directly from node to node, encrypted at the source and decrypted at the destination.
                 </p>
                 <div className="flex gap-12 md:gap-20">
                    <div className="text-center">
                       <p className="text-5xl md:text-6xl font-black mb-2 italic">0.05s</p>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 uppercase">Avg Jitter</p>
                    </div>
                    <div className="text-center border-l border-white/10 pl-12 md:pl-20">
                       <p className="text-5xl md:text-6xl font-black mb-2 italic">4K60</p>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 uppercase">Native Pipeline</p>
                    </div>
                 </div>
              </div>

              <div className="flex-1 w-full relative z-10 group/img">
                 <div className="aspect-video bg-black rounded-[4rem] border border-white/10 p-4 md:p-8 flex items-center justify-center shadow-4xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 mix-blend-overlay"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                      alt="Hardened Interface" 
                      className="w-full h-full object-cover opacity-30 grayscale group-hover/img:grayscale-0 group-hover/img:scale-105 transition-all duration-1000"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute z-20 w-24 h-24 bg-cyan-400/10 border border-cyan-400/30 rounded-full backdrop-blur-3xl flex items-center justify-center"
                    >
                       <FaPlay className="text-cyan-400 text-3xl ml-2 shadow-[0_0_30px_rgba(34,211,238,0.5)]" />
                    </motion.div>
                 </div>
              </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
