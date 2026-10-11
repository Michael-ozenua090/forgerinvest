"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, ArrowUpFromLine, Wallet, ShieldAlert } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCrypto } from "@/lib/format";
import { KycGateModal } from "@/components/KycGateModal";

export default function WithdrawPage() {
  const router = useRouter();
  const { cryptoBalances, activeCurrency, withdrawFunds, isKycCompleted } = useStore();
  const availableCrypto = cryptoBalances[activeCurrency] ?? 0;
  
  const [step, setStep] = useState<1 | 2>(1);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showKycGate, setShowKycGate] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 2FA Auto-focus logic
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleContinue = () => {
    // Intentional KYC friction gate: Check verification before allowing withdrawal
    if (!isKycCompleted) {
      setShowKycGate(true);
      return;
    }
    setStep(2);
  };

  const handleWithdraw = () => {
    const result = withdrawFunds(activeCurrency, parseFloat(withdrawAmount));
    if (result.requiresKyc) {
      setShowKycGate(true);
      return;
    }
    if (result.success) {
      router.push("/wallet/transactions");
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <div className="mb-8">
        <Link href="/wallet" className="inline-flex items-center gap-2 text-sm font-bold text-forge-gray-500 hover:text-forge-gray-900 transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Wallet
        </Link>
        <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 flex items-center gap-3">
          <ArrowUpFromLine size={28} className="text-forge-orange" />
          Withdraw Capital & Profits
        </h1>
        <p className="font-medium text-forge-gray-600 mt-1">
          Transfer your liquid capital or matured growth payouts to your connected external wallet.
        </p>
      </div>

      <div className="clean-card bg-white overflow-hidden shadow-sm">
        {step === 1 ? (
          <div className="p-8 space-y-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2">Amount to Withdraw</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-forge-gray-500 font-bold text-lg">{activeCurrency}</div>
                <input 
                  type="number" 
                  step="0.00001"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl pl-20 pr-6 py-6 text-4xl font-display font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white transition-all"
                />
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs font-bold text-forge-gray-500 tabular-nums">Available: {formatCrypto(availableCrypto, activeCurrency)}</p>
                <button 
                  onClick={() => setWithdrawAmount(availableCrypto.toString())}
                  className="text-xs font-bold text-forge-orange hover:text-forge-orange-hover uppercase tracking-wider"
                >
                  Withdraw All
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2">Destination Account</label>
              <div className="p-5 border border-forge-gray-200 bg-forge-gray-50/50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-forge-gray-200 rounded-lg flex items-center justify-center text-forge-gray-600 shadow-sm">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-forge-gray-900">Connected Wallet</p>
                    <p className="text-xs font-bold text-forge-gray-500 uppercase tracking-wider mt-0.5">0x71C8...9A64</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-market-up bg-market-up/10 px-2.5 py-1 rounded-full">Primary</span>
              </div>
            </div>

            <button 
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > availableCrypto}
              onClick={handleContinue}
              className="w-full py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(255,90,0,0.25)]"
            >
              Continue to Verification
            </button>
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-forge-gray-50 border border-forge-gray-100 text-forge-gray-900 mb-6 shadow-sm">
              <Lock size={32} />
            </div>
            <h3 className="font-display font-bold text-2xl text-forge-gray-900 mb-2">Security Verification</h3>
            <p className="text-base font-medium text-forge-gray-600 mb-8 max-w-md mx-auto">
              Enter the 6-digit code from your authenticator app to authorize the withdrawal of <strong className="text-forge-gray-900">{formatCrypto(parseFloat(withdrawAmount) || 0, activeCurrency)}</strong>.
            </p>

            <div className="flex justify-center gap-3 mb-10">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center font-display font-bold text-2xl text-forge-gray-900 border-2 border-forge-gray-200 rounded-xl focus:border-forge-orange focus:ring-0 focus:outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={handleWithdraw}
                disabled={otp.some(d => d === "")}
                className="w-full py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify & Submit Transfer
              </button>
              <button 
                onClick={() => setStep(1)} 
                className="text-sm font-bold text-forge-gray-500 hover:text-forge-gray-900 transition-colors py-2"
              >
                Back to Amount
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Intentional KYC Friction Gate Modal */}
      <KycGateModal 
        isOpen={showKycGate} 
        onClose={() => setShowKycGate(false)} 
      />

    </div>
  );
}
