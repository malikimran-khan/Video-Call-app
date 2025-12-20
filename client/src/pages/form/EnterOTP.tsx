import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { verifyOTP, reset } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";

const EnterOTP: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
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

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const prevSibling = (e.currentTarget.previousSibling as HTMLInputElement);
        if (prevSibling) {
          prevSibling.focus();
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-black rounded-full flex items-center justify-center text-white mb-4">
                <FaLock size={24} />
            </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Verify Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to <span className="font-semibold text-black">{email}</span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => {
              return (
                <input
                  key={index}
                  type="text"
                  name="otp"
                  maxLength={1}
                  className="w-12 h-14 border-2 rounded-xl text-center text-xl font-bold bg-gray-50 border-gray-200 focus:border-black focus:bg-white focus:outline-none transition-all"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                />
              );
            })}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>

        <div className="text-center">
            <p className="text-xs text-gray-400">
                Didn't receive the code? <button className="text-black font-semibold hover:underline" onClick={() => toast.info("Check your spam folder or try again later")}>Resend Code</button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default EnterOTP;
