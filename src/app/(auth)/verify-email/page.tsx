"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1); // Prevent multiple chars
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input or verify
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (value !== "" && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        handleVerify();
      }
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      router.push("/kyc");
    }, 800);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="clean-card p-8 sm:p-10 w-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forge-orange-wash text-forge-orange mb-6">
        <Mail size={32} strokeWidth={2} />
      </div>
      
      <h1 className="font-display font-extrabold text-2xl text-forge-gray-900 mb-2">
        Check your email
      </h1>
      <p className="text-sm font-medium text-forge-gray-600 mb-8 max-w-sm mx-auto">
        We sent a 6-digit verification code to your email. Enter it below to confirm your identity.
      </p>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-center gap-2 sm:gap-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center font-display font-bold text-2xl text-forge-gray-900 border-2 border-forge-gray-200 rounded-xl focus:border-forge-orange focus:ring-0 focus:outline-none transition-all"
            />
          ))}
        </div>

        <button 
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full flex items-center justify-center gap-2 py-4 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] disabled:opacity-70"
        >
          {isVerifying ? (
            <>
              <Loader2 className="animate-spin" size={18} strokeWidth={2.5} /> Verifying...
            </>
          ) : (
            <>
              Verify Email <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-sm font-medium text-forge-gray-600">
        Didn't receive the code?{" "}
        {timeLeft > 0 ? (
          <span className="text-forge-gray-400">Resend in 00:{timeLeft.toString().padStart(2, "0")}</span>
        ) : (
          <button 
            onClick={() => setTimeLeft(59)} 
            className="text-forge-orange hover:text-forge-orange-hover font-bold"
          >
            Resend now
          </button>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-forge-gray-100">
        <Link href="/dashboard" className="text-xs font-bold text-forge-gray-400 hover:text-forge-gray-600 transition-colors">
          Skip for now
        </Link>
      </div>
    </div>
  );
}
