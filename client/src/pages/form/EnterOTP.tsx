import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { verifyOTP, reset } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import SovereignBackground from "../../components/Visuals/SovereignBackground";
import TextScramble from "../../components/Visuals/TextScramble";
import Magnetic from "../../components/Visuals/Magnetic";

const EnterOTP: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/signup");
      toast.error("Please sign up first");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess && message.includes("verified")) {
      toast.success(message);
      dispatch(reset());
      navigate("/login");
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }
    dispatch(verifyOTP({ email, otp: otpString }));
  };

  return (
    <div className="min-h-screen bg-[#010101] flex items-center justify-center p-6 relative overflow-hidden selection:bg-cyan-500 selection:text-black font-sans">
       {/* High Impact background */}
       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <SovereignBackground />
       </div>

       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="max-w-md w-full relative z-10"
       >
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 md:p-12 rounded-[2.5rem] shadow-4xl overflow-hidden relative group">
            {/* Inner Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-400/20 transition-all duration-700"></div>

            <div className="text-center mb-10">
                <Link to="/signup">
                   <Magnetic>
                      <button className="inline-flex items-center text-gray-500 hover:text-white transition text-[10px] font-black uppercase tracking-[0.4em] gap-3 mb-10">
                         <FaArrowLeft className="text-cyan-400" /> <TextScramble text="Back to Portal" />
                      </button>
                   </Magnetic>
                </Link>
                
                <div className="mx-auto h-20 w-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-cyan-400 mb-8 shadow-3xl">
                    <FaShieldAlt size={28} />
                </div>
                
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
                   <TextScramble text="Handshake" />
                </h2>
                <p className="text-gray-500 font-medium italic text-sm">
                   Decrypt the 6-digit key sent to <br />
                   <span className="text-white font-black not-italic underline decoration-white/10">{email}</span>
                </p>
            </div>

            <form className="space-y-10" onSubmit={handleSubmit}>
              <div className="flex justify-between gap-3 md:gap-4">
                {otp.map((data, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      className="w-full h-16 md:h-20 bg-white/5 border border-white/5 rounded-2xl text-center text-2xl font-black text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:bg-white/[0.08] transition-all shadow-xl"
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                    />
                ))}
              </div>

              <Magnetic>
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full bg-white text-black py-5 rounded-[2rem] font-black uppercase tracking-[0.6em] text-xs hover:bg-cyan-400 transition shadow-[0_20px_50px_rgba(0,0,0,0.5)] disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-4"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-[3px] border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                     <>Initialize <TextScramble text="Verification" delay={0.1} /></>
                  )}
                </button>
              </Magnetic>
            </form>

            <div className="mt-12 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">
                    No Signal? <button className="text-cyan-400 hover:text-white transition" onClick={() => toast.info("Check encrypted spam bins.")}>Re-Broadcast Code</button>
                </p>
            </div>
          </div>

          <div className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.8em] text-gray-800">
             iVoice Protocol // System ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
       </motion.div>
    </div>
  );
};

export default EnterOTP;
