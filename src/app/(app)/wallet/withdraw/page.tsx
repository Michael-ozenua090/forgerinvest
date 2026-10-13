"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Lock, 
  ArrowLeft, 
  ArrowUpFromLine, 
  Wallet, 
  ShieldAlert, 
  Plus, 
  Check, 
  X, 
  Building2, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useStore, LinkedWallet } from "@/lib/store";
import { formatCrypto } from "@/lib/format";
import { KycGateModal } from "@/components/KycGateModal";

export default function WithdrawPage() {
  const router = useRouter();
  const { 
    cryptoBalances, 
    activeCurrency, 
    withdrawFunds, 
    isKycCompleted,
    currentUser,
    addLinkedWallet
  } = useStore();

  const availableCrypto = cryptoBalances[activeCurrency] ?? 0;
  
  const [step, setStep] = useState<1 | 2>(1);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showKycGate, setShowKycGate] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Destination wallet selection state
  const matchingWallets = (currentUser?.linkedWallets || []).filter(
    (w) => w.currency === activeCurrency
  );

  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  // Sync selected wallet when activeCurrency or matchingWallets change
  useEffect(() => {
    if (matchingWallets.length > 0) {
      const exists = matchingWallets.some((w) => w.id === selectedWalletId);
      if (!exists) {
        const defaultWallet = matchingWallets.find((w) => w.isDefault) || matchingWallets[0];
        setSelectedWalletId(defaultWallet.id);
      }
    } else {
      setSelectedWalletId(null);
    }
  }, [activeCurrency, matchingWallets, selectedWalletId]);

  // Modal state for linking a new wallet
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [newWalletLabel, setNewWalletLabel] = useState("");
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const selectedWallet = matchingWallets.find((w) => w.id === selectedWalletId);

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
    if (!selectedWallet) {
      return;
    }
    setStep(2);
  };

  const handleWithdraw = () => {
    if (!selectedWallet) return;
    const result = withdrawFunds(
      activeCurrency, 
      parseFloat(withdrawAmount), 
      selectedWallet.address
    );
    if (result.requiresKyc) {
      setShowKycGate(true);
      return;
    }
    if (result.success) {
      router.push("/wallet/transactions");
    }
  };

  const handleSaveLinkedWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletLabel.trim()) {
      setLinkError("Please provide a recognizable label for this account.");
      return;
    }
    if (!newWalletAddress.trim() || newWalletAddress.trim().length < 6) {
      setLinkError("Please enter a valid destination address or account number.");
      return;
    }

    const created = addLinkedWallet(activeCurrency, newWalletLabel.trim(), newWalletAddress.trim());
    setSelectedWalletId(created.id);
    setNewWalletLabel("");
    setNewWalletAddress("");
    setLinkError(null);
    setIsLinkModalOpen(false);
  };

  const isFiat = activeCurrency === 'USD' || activeCurrency === 'GBP';

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* ── Top Header ────────────────────────────────────────── */}
      <div className="mb-8">
        <Link 
          href="/wallet" 
          className="inline-flex items-center gap-2 text-sm font-bold text-forge-gray-500 hover:text-forge-gray-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Wallet
        </Link>
        <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 flex items-center gap-3">
          <ArrowUpFromLine size={28} className="text-forge-orange" />
          Withdraw Capital & Profits
        </h1>
        <p className="font-medium text-forge-gray-600 mt-1">
          Transfer your liquid capital or matured growth payouts directly to your designated external wallet.
        </p>
      </div>

      <div className="clean-card bg-white overflow-hidden shadow-sm">
        {step === 1 ? (
          <div className="p-8 space-y-8">
            
            {/* Amount Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2">
                Amount to Withdraw
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-forge-gray-500 font-bold text-lg">
                  {activeCurrency}
                </div>
                <input 
                  type="number" 
                  step="0.00001"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl pl-20 pr-6 py-6 text-4xl font-display font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white transition-all text-forge-gray-900"
                />
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs font-bold text-forge-gray-500 tabular-nums">
                  Available Balance: <strong className="text-forge-gray-800">{formatCrypto(availableCrypto, activeCurrency)}</strong>
                </p>
                <button 
                  type="button"
                  onClick={() => setWithdrawAmount(availableCrypto.toString())}
                  className="text-xs font-bold text-forge-orange hover:text-forge-orange-hover uppercase tracking-wider"
                >
                  Withdraw All
                </button>
              </div>
            </div>

            {/* Destination Account Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600">
                  Designated Destination Account ({activeCurrency})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setLinkError(null);
                    setIsLinkModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-forge-orange hover:text-forge-orange-hover"
                >
                  <Plus size={14} /> Link New Account
                </button>
              </div>

              {matchingWallets.length === 0 ? (
                /* Empty state: No matching linked wallets */
                <div className="p-6 border-2 border-dashed border-forge-gray-200 bg-forge-gray-50/50 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-forge-gray-100 flex items-center justify-center text-forge-gray-400 mx-auto">
                    {isFiat ? <Building2 size={24} /> : <Wallet size={24} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-forge-gray-900">
                      No {activeCurrency} Destination Account Linked
                    </p>
                    <p className="text-xs text-forge-gray-500 mt-0.5 max-w-sm mx-auto">
                      Link your personal {isFiat ? "bank account (IBAN/Wire)" : `${activeCurrency} wallet address`} to receive your funds safely.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkError(null);
                      setIsLinkModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-forge-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors shadow-sm"
                  >
                    <Plus size={14} /> Link {activeCurrency} Destination Wallet
                  </button>
                </div>
              ) : (
                /* List of matching linked accounts */
                <div className="space-y-3">
                  {matchingWallets.map((wallet) => {
                    const isSelected = wallet.id === selectedWalletId;
                    return (
                      <div
                        key={wallet.id}
                        onClick={() => setSelectedWalletId(wallet.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-forge-orange bg-forge-orange-wash/40 ring-2 ring-forge-orange/20 shadow-sm"
                            : "border-forge-gray-200 bg-white hover:bg-forge-gray-50/60"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected 
                              ? "bg-forge-orange text-white" 
                              : "bg-forge-gray-100 text-forge-gray-600 border border-forge-gray-200"
                          }`}>
                            {isFiat ? <Building2 size={20} /> : <Wallet size={20} />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm text-forge-gray-900 truncate">
                                {wallet.label}
                              </p>
                              {wallet.isDefault && (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-forge-gray-100 text-forge-gray-600 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-mono text-forge-gray-500 truncate" title={wallet.address}>
                              {wallet.address}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 pl-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? "border-forge-orange bg-forge-orange text-white" 
                              : "border-forge-gray-300 bg-white"
                          }`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div>
              <button 
                type="button"
                disabled={
                  !selectedWalletId || 
                  !withdrawAmount || 
                  parseFloat(withdrawAmount) <= 0 || 
                  parseFloat(withdrawAmount) > availableCrypto
                }
                onClick={handleContinue}
                className="w-full py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(255,90,0,0.25)]"
              >
                Continue to Verification
              </button>

              {!selectedWalletId && matchingWallets.length === 0 && (
                <p className="text-xs text-center text-forge-gray-500 mt-2 font-medium">
                  Please link a destination address above to proceed with withdrawal.
                </p>
              )}
            </div>

          </div>
        ) : (
          /* Step 2: 2FA & Confirmation */
          <div className="p-8 sm:p-12 text-center animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-forge-gray-50 border border-forge-gray-100 text-forge-gray-900 mb-6 shadow-sm">
              <Lock size={32} />
            </div>
            
            <h3 className="font-display font-bold text-2xl text-forge-gray-900 mb-2">
              Security Authorization
            </h3>
            <p className="text-sm font-medium text-forge-gray-600 mb-6 max-w-md mx-auto">
              Please enter the 6-digit authentication token to confirm and release your payout transfer.
            </p>

            {/* Payout Summary Details Card */}
            {selectedWallet && (
              <div className="max-w-md mx-auto mb-8 p-4 bg-forge-gray-50 rounded-xl border border-forge-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-forge-gray-500 font-medium">Payout Amount:</span>
                  <span className="font-display font-bold text-base text-forge-gray-900 tabular-nums">
                    {formatCrypto(parseFloat(withdrawAmount) || 0, activeCurrency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-forge-gray-500 font-medium">Destination Account:</span>
                  <span className="font-bold text-forge-gray-900">{selectedWallet.label}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-forge-gray-200">
                  <span className="text-forge-gray-500 font-medium">Target Address:</span>
                  <span className="font-mono text-forge-gray-700 truncate max-w-[220px]" title={selectedWallet.address}>
                    {selectedWallet.address}
                  </span>
                </div>
              </div>
            )}

            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 mb-8">
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
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center font-display font-bold text-2xl text-forge-gray-900 border-2 border-forge-gray-200 rounded-xl focus:border-forge-orange focus:ring-0 focus:outline-none transition-all shadow-sm bg-white"
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <button 
                type="button"
                onClick={handleWithdraw}
                disabled={otp.some(d => d === "")}
                className="w-full py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify & Submit Transfer
              </button>
              <button 
                type="button"
                onClick={() => setStep(1)} 
                className="text-xs font-bold text-forge-gray-500 hover:text-forge-gray-900 transition-colors py-2"
              >
                ← Back to Amount & Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Link New Destination Account Modal ── */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0"
            onClick={() => setIsLinkModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-forge-gray-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 z-10 space-y-6">
            
            <div className="flex items-center justify-between border-b border-forge-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forge-orange-wash text-forge-orange flex items-center justify-center border border-forge-orange/20">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-forge-gray-900">
                    Link Destination Account
                  </h3>
                  <p className="text-xs text-forge-gray-500">
                    Target currency: <strong className="text-forge-gray-900">{activeCurrency}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1.5 text-forge-gray-400 hover:text-forge-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLinkedWallet} className="space-y-4">
              {linkError && (
                <div className="p-3 bg-market-down/10 border border-market-down/20 rounded-xl flex items-center gap-2 text-xs font-semibold text-market-down">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{linkError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                  Account / Wallet Label
                </label>
                <input
                  type="text"
                  required
                  value={newWalletLabel}
                  onChange={(e) => setNewWalletLabel(e.target.value)}
                  placeholder={isFiat ? "e.g. Personal Chase Checking" : `e.g. Ledger Cold Storage (${activeCurrency})`}
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white"
                />
                <p className="text-[11px] text-forge-gray-400 mt-1">
                  A personalized label to recognize this account for future payouts.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                  Destination Address / IBAN / Account
                </label>
                <input
                  type="text"
                  required
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  placeholder={isFiat ? "e.g. GB29X... or Routing & Account #" : `e.g. 0x... or bc1q...`}
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl px-4 py-3 text-sm font-mono font-semibold text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white"
                />
                <p className="text-[11px] text-forge-gray-400 mt-1">
                  Double check the address accurately. Payout transactions cannot be reversed once broadcast.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-forge-gray-100">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-forge-gray-600 hover:text-forge-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-forge-orange text-white text-xs font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-sm"
                >
                  Save & Use Destination
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── Intentional KYC Friction Gate Modal ── */}
      <KycGateModal 
        isOpen={showKycGate} 
        onClose={() => setShowKycGate(false)} 
      />

    </div>
  );
}
