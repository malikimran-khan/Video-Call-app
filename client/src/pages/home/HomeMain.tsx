import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  FaVideo, FaArrowRight, FaShieldAlt, FaPlay, 
  FaUsers, FaUserShield, FaEyeSlash, FaGlobeAmericas, 
  FaBolt, FaPlus 
} from "react-icons/fa";
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

const HomeMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        <EliteHero />
        <NetworkStats />
        <BentoFeatureGrid />
        <SecurityElite />
        <InterfacePreview />
        <GlobalEcosystem />
        <CoreFAQs />
        <EliteCTA />
      </main>

      <Footer />
    </div>
  );
};

/* --- Section 1: Elite Hero --- */
const EliteHero = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-6 overflow-hidden bg-black">
      {/* 3D Sovereign Background */}
      <SovereignBackground />

      <motion.div style={{ opacity, scale }} className="relative z-10 text-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 md:px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-8 md:mb-12 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <TextScramble text="Secure Network v5.2 Active" />
        </motion.div>

        <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tighter leading-[0.9] mb-10 md:mb-14 text-white italic relative">
          <TextScramble text="Decentralized." delay={0.5} /><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
            <TextScramble text="Encrypted." delay={1.2} />
          </span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-500 not-italic uppercase">
            <TextScramble text="Invisible." delay={1.8} />
          </span>
        </h1>

        <p className="text-lg md:text-2xl lg:text-3xl text-gray-500 max-w-4xl mx-auto font-medium leading-[1.3] mb-12 md:mb-20 px-6">
          iVoice leverages peer-to-peer signaling for absolute privacy. <br className="hidden md:block"/> No servers. No middleman. Just high-fidelity video.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
          <Link to="/signup" className="w-full sm:w-auto">
            <Magnetic>
              <motion.button 
                whileHover={{ scale: 1.05, y: -5, boxShadow: "0 20px 40px rgba(34,211,238,0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-white text-black text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center gap-4 group transition-all"
              >
                Access Portal <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Magnetic>
          </Link>
          <Link to="/features" className="w-full sm:w-auto">
            <Magnetic>
              <motion.button 
                whileHover={{ backgroundColor: "rgba(255,255,255,0.08)", y: -5 }}
                className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-[rgba(255,255,255,0.05)] border border-white/10 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center gap-4 transition-all"
              >
                The Protocol <FaPlay className="text-cyan-400 text-[8px]" />
              </motion.button>
            </Magnetic>
          </Link>
        </div>
      </motion.div>

      {/* Hero Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 md:gap-16 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000 hidden md:flex"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm font-black uppercase tracking-tighter italic">Low Latency</span>
          <span className="text-[10px] tracking-[0.4em] uppercase text-gray-500 font-bold mt-1">Direct P2P</span>
        </div>
        <div className="w-px h-8 bg-white/20"></div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-black uppercase tracking-tighter italic">E2E Encrypted</span>
          <span className="text-[10px] tracking-[0.4em] uppercase text-gray-500 font-bold mt-1">Zero Knowledge</span>
        </div>
        <div className="w-px h-8 bg-white/20"></div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-black uppercase tracking-tighter italic">100% Private</span>
          <span className="text-[10px] tracking-[0.4em] uppercase text-gray-500 font-bold mt-1">No Server Logs</span>
        </div>
      </motion.div>
    </section>
  );
};

/* --- Section 2: Network Stats --- */
const NetworkStats = () => {
  return (
    <section className="py-32 md:py-48 bg-black relative">
       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {[
            { label: "Active Nodes", val: "12,482", icon: FaGlobeAmericas, color: "text-cyan-400", sub: "Global distribution" },
            { label: "Call Quality", val: "4K UHD", icon: FaVideo, color: "text-purple-400", sub: "Lossless transmission" },
            { label: "Handshake", val: "< 12ms", icon: FaBolt, color: "text-emerald-400", sub: "Ultra-low latency" },
            { label: "Data Leak", val: "0.00%", icon: FaShieldAlt, color: "text-red-400", sub: "Guaranteed privacy" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 md:p-12 bg-white/5 rounded-[3rem] border border-white/5 hover:border-cyan-500/30 transition-all group relative overflow-hidden"
            >
               <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon size={120} />
               </div>
               <stat.icon className={`${stat.color} mb-8`} size={28} />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">{stat.label}</p>
               <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">{stat.val}</h3>
               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{stat.sub}</p>
            </motion.div>
          ))}
       </div>
    </section>
  );
};

/* --- Section 3: Bento Feature Grid --- */
const BentoFeatureGrid = () => {
  const container = useRef(null);
  
  useGSAP(() => {
    const cards = gsap.utils.toArray(".bento-card");
    cards.forEach((card: any) => {
      gsap.fromTo(card, 
        { y: 50 }, 
        { 
          y: -50, 
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
          }
        }
      );
    });
  }, { scope: container });

  const features = [
    { title: "Sovereign Link", desc: "Peer-to-peer signaling ensures your identity never touches a central server.", icon: FaUserShield, size: "lg", color: "from-cyan-500/20" },
    { title: "Ghost Protocol", desc: "Encrypted metadata masking.", icon: FaEyeSlash, size: "sm", color: "from-purple-500/20" },
    { title: "Atomic Video", desc: "4K lossless streaming via optimized codecs.", icon: FaVideo, size: "sm", color: "from-emerald-500/20" },
    { title: "Swarm Mesh", desc: "Decentralized relay network.", icon: FaUsers, size: "lg", color: "from-blue-500/20" },
  ];

  return (
    <section ref={container} className="py-40 md:py-60 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-32 space-y-4">
           <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic text-white/90">The Core Protocol.</h2>
           <p className="text-gray-500 max-w-xl mx-auto font-bold uppercase tracking-widest text-xs md:text-sm">Engineered for the elite few who demand absolute data sovereignty.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`bento-card md:col-span-${f.size === 'lg' ? '3' : '3'} lg:col-span-${f.size === 'lg' ? '4' : '2'} p-12 md:p-16 rounded-[4rem] bg-gradient-to-br ${f.color} to-transparent border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between h-[450px] md:h-[550px] group relative overflow-hidden shadow-2xl`}
            >
              <div className="relative z-10 w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-12 shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                <f.icon size={28} className="text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-black mb-6 italic tracking-tight uppercase">{f.title}</h3>
                <p className="text-gray-500 text-lg md:text-2xl font-medium leading-relaxed max-w-sm">{f.desc}</p>
              </div>
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:rotate-12 transition-transform">
                 <f.icon size={200} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --- Section 4: Security Elite --- */
const SecurityElite = () => {
  return (
    <section className="py-40 md:py-60 bg-black overflow-hidden relative">
       <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-24 md:gap-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-12"
          >
             <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-black uppercase tracking-[0.4em]">Zero Backdoor Policy</div>
             <h2 className="text-5xl md:text-9xl font-black italic tracking-tighter leading-[0.85] uppercase">Hardened <br /> from the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-800 border-b-8 border-white/5">Core.</span></h2>
             <p className="text-gray-500 text-xl md:text-3xl font-medium leading-relaxed">
               We utilize XSalsa20 and Poly1305 for high-speed authentication and encryption. Your data is fragmented across nodes, making interception mathematically impossible.
             </p>
             <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                   <p className="text-5xl font-black italic">AES-256</p>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Standard Grade</p>
                </div>
                <div className="space-y-2">
                   <p className="text-5xl font-black italic">Perfect</p>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Forward Secrecy</p>
                </div>
             </div>
          </motion.div>
          <div className="flex-1 relative">
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="w-[350px] h-[350px] md:w-[600px] md:h-[600px] border-2 border-dashed border-cyan-500/20 rounded-full flex items-center justify-center"
             >
                <div className="w-[80%] h-[80%] border border-purple-500/20 rounded-full flex items-center justify-center animate-pulse">
                   <FaShieldAlt className="text-7xl md:text-9xl text-white opacity-20" />
                </div>
             </motion.div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 bg-cyan-500/10 rounded-full blur-[80px]"></div>
          </div>
       </div>
    </section>
  );
};

/* --- Section 5: Interface Preview --- */
const InterfacePreview = () => {
    return (
      <section className="py-40 md:py-60 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white text-black p-12 md:p-32 rounded-[5rem] md:rounded-[8rem] relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-end justify-between gap-16 mb-24 md:mb-32">
              <div className="max-w-2xl">
                <h2 className="text-5xl md:text-9xl font-black italic tracking-tighter leading-[0.85] uppercase mb-10">Digital <br /> Sovereign <br /> <span className="underline decoration-black/10 transition-all group-hover:decoration-cyan-400">Hub.</span></h2>
                <p className="text-gray-600 text-lg md:text-2xl font-bold leading-tight uppercase tracking-tighter">Minimalism meets machine-grade utility. No distraction, only absolute connection precision.</p>
              </div>
              <Link to="/signup">
                <Magnetic>
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                    className="bg-black text-white px-12 py-8 rounded-[2.5rem] font-black uppercase text-[10px] md:text-[12px] tracking-[0.5em] flex items-center gap-4"
                  >
                    Enter Portal <FaArrowRight />
                  </motion.button>
                </Magnetic>
              </Link>
            </div>
            
            <div className="relative rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl border-[10px] md:border-[20px] border-black/5 bg-black h-[500px] md:h-[800px] flex items-center justify-center group/app">
               <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
               <div className="z-10 text-center flex flex-col items-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-3xl group-hover/app:rotate-12 transition-transform duration-700">
                     <FaPlay className="text-black text-3xl ml-2 ml-px" />
                  </div>
                  <p className="text-white/20 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] animate-pulse">Interface Transmission Pending...</p>
               </div>
               
               {/* UI Elements Mockup */}
               <div className="absolute top-12 left-12 right-12 flex justify-between">
                  <div className="flex gap-4">
                     <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest opacity-50">Node 0x51A Active</div>
               </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  /* --- Section 6: Global Ecosystem --- */
  const GlobalEcosystem = () => {
    return (
      <section className="py-40 md:py-60 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 md:gap-40 items-center">
          <div className="order-2 lg:order-1 relative h-[400px] md:h-[700px] flex items-center justify-center">
             <div className="absolute w-full h-full bg-cyan-500/5 rounded-full blur-[150px]"></div>
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
               className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-white/5 rounded-full"
             >
                {[...Array(8)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="absolute w-4 h-4 md:w-6 md:h-6 bg-white rounded-full border-4 border-black"
                    style={{ 
                      top: `${50 + 50 * Math.sin(i * Math.PI / 4)}%`, 
                      left: `${50 + 50 * Math.cos(i * Math.PI / 4)}%`,
                    }}
                  />
                ))}
             </motion.div>
             <div className="absolute text-center">
                <h3 className="text-7xl md:text-[10rem] font-black italic tracking-tighter opacity-10 uppercase">Mesh</h3>
             </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="order-1 lg:order-2 space-y-12"
          >
             <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase">Limitless <br /> Global <br /> <span className="text-cyan-400">Ecosystem.</span></h2>
             <p className="text-gray-500 text-xl md:text-3xl font-medium leading-relaxed max-w-lg">
               Our decentralized mesh network scales with every new node. No single point of failure. No censorship possible.
             </p>
             <div className="flex flex-wrap gap-6 md:gap-10">
                {['Direct Relay', 'Encrypted Tunneled', 'Private Grid'].map((tag, i) => (
                   <span key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400">
                     {tag}
                   </span>
                ))}
             </div>
          </motion.div>
        </div>
      </section>
    );
  };
  
  /* --- Section 7: FAQs --- */
  const CoreFAQs = () => {
    const [open, setOpen] = useState(0);
    const faqs = [
      { q: "Is it really serverless?", a: "Yes. iVoice uses peer-to-peer WebRTC technology. The signaling is done via secure handshake nodes that never store or witness your communication content." },
      { q: "How is the quality so high?", a: "By removing the central server bottleneck, we enable raw direct data transfer between users, utilizing 100% of your available bandwidth for 4K video." },
      { q: "Is my data stored?", a: "Zero. Nothing. Even your metadata is fragmented. We believe in absolute data ephemeralization." },
      { q: "Can anyone block iVoice?", a: "Our mesh protocol is designed to be indistinguishable from normal HTTPS traffic, making it nearly impossible to throttle or block." },
    ];
  
    return (
      <section className="py-40 md:py-60 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-24 md:mb-32 text-center underline decoration-cyan-500/20">Protocol Briefing.</h2>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <motion.div 
                key={i} 
                className="bg-white/5 border border-white/5 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden transition-colors hover:border-white/10"
              >
                <button 
                  onClick={() => setOpen(i)}
                  className="w-full text-left p-10 md:p-14 flex justify-between items-center group"
                >
                  <span className="text-xl md:text-3xl font-black uppercase italic tracking-tight group-hover:text-cyan-400 transition-colors">{f.q}</span>
                  <FaPlus className={`transition-transform duration-500 text-cyan-400 ${open === i ? 'rotate-45' : ''}`} size={20} />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-10 md:px-14 pb-14 text-lg md:text-2xl text-gray-500 font-medium leading-relaxed"
                    >
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  /* --- Section 8: Elite CTA --- */
  const EliteCTA = () => {
    return (
      <section className="py-40 md:py-80 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="space-y-16"
           >
              <h2 className="text-7xl md:text-[14rem] font-black italic tracking-tighter leading-[0.8] uppercase flex flex-col items-center">
                 <span>Ready to Go</span>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-white to-cyan-400">Dark?</span>
              </h2>
              <p className="text-xl md:text-4xl text-gray-400 max-w-2xl mx-auto font-bold uppercase tracking-tight italic">Your encryption keys are waiting. Join the sovereign communication layer.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                 <Link to="/signup">
                    <Magnetic>
                      <motion.button 
                        whileHover={{ scale: 1.05, y: -10 }}
                        className="px-16 md:px-20 py-8 md:py-10 bg-white text-black font-black uppercase tracking-[0.5em] text-[12px] md:text-[14px] rounded-[3rem] shadow-[0_40px_80px_rgba(255,255,255,0.15)] hover:bg-cyan-400 transition-all"
                      >
                         Initialize Identity
                      </motion.button>
                    </Magnetic>
                 </Link>
                 <Link to="/login" className="text-[12px] md:text-[14px] font-black uppercase tracking-[0.5em] text-gray-500 hover:text-white transition-colors">
                    Return to Login
                 </Link>
              </div>
           </motion.div>
        </div>
        
        {/* Decorative mask */}
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black to-transparent opacity-60"></div>
      </section>
    );
  };

export default HomeMain;
