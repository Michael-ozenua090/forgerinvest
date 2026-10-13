"use client";

import { useState, useRef } from "react";
import { 
  X, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  Clock,
  ShieldCheck,
  Check
} from "lucide-react";
import { useStore } from "@/lib/store";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface CryptoDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CryptoCurrency = 'BTC' | 'ETH' | 'SOL';

const NETWORKS: Record<CryptoCurrency, { 
  name: string; 
  tag: string; 
  icon: string; 
  address: string; 
  qrCode: string;
}> = {
  BTC: {
    name: "Bitcoin",
    tag: "BTC Native SegWit",
    icon: "/currencies/btc.svg",
    address: "bc1qgzdlns0jax6y6x9dwflcs3j8wgne0w0kxussdq",
    qrCode: "/wallets/btc-qr.png",
  },
  ETH: {
    name: "Ethereum",
    tag: "Ethereum Mainnet (ERC-20)",
    icon: "/currencies/eth.svg",
    address: "0x208ce7fA3Fd4Ce24C21AbC69ef14b87B61A6197F",
    qrCode: "/wallets/eth-qr.png",
  },
  SOL: {
    name: "Solana",
    tag: "Solana (SPL)",
    icon: "/currencies/sol.svg",
    address: "FmBbgLgjVz95XUsD1SBWg7oZQBbYtZXnbBYfFbbNSG9B",
    qrCode: "/wallets/sol-qr.png",
  }
};

export function CryptoDepositModal({ isOpen, onClose }: CryptoDepositModalProps) {
  const { activeCurrency, submitDepositProof } = useStore();
  const initialCrypto: CryptoCurrency = (['BTC', 'ETH', 'SOL'] as const).includes(activeCurrency as CryptoCurrency) 
    ? (activeCurrency as CryptoCurrency) 
    : 'BTC';

  const [tab, setTab] = useState<CryptoCurrency>(initialCrypto);
  const [step, setStep] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);

  // Step 2 Form States
  const [amount, setAmount] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentNetwork = NETWORKS[tab] || NETWORKS.BTC;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentNetwork.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProofImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !proofImage) return;

    const generatedHash = txHash.trim() || `TX-${Date.now().toString(36).toUpperCase()}`;

    submitDepositProof(
      tab,
      numAmount,
      generatedHash,
      proofImage
    );

    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await supabase
          .from("transactions")
          .insert({
            user_id: authUser.id,
            type: "DEPOSIT",
            amount: numAmount,
            currency: tab,
            status: "PENDING",
            tx_hash: generatedHash,
            proof_image: proofImage,
            description: `Deposit ${tab}`,
            date: new Date().toISOString(),
          });
      }
    } catch (err) {
      console.error("Failed to sync pending deposit to Supabase:", err);
    }

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setStep(1);
    setAmount("");
    setTxHash("");
    setProofImage(null);
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-forge-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            {step === 2 && !isSubmitted && (
              <button 
                type="button"
                onClick={() => setStep(1)} 
                className="p-1.5 -ml-1.5 text-forge-gray-400 hover:text-forge-gray-800 rounded-lg hover:bg-forge-gray-100 transition-colors"
                title="Back to Address & QR"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h2 className="font-display font-bold text-xl text-forge-gray-900">
                {isSubmitted ? "Deposit Submitted" : step === 1 ? "Deposit Crypto" : "Submit Payment Proof"}
              </h2>
              <p className="text-xs text-forge-gray-500 font-medium">
                {isSubmitted 
                  ? "Treasury verification pending" 
                  : step === 1 
                  ? "Step 1 of 2: Transfer funds to address" 
                  : "Step 2 of 2: Upload receipt & transaction info"}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-forge-gray-400 hover:text-forge-gray-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            /* ── Success Screen ── */
            <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-market-up/10 text-market-up flex items-center justify-center border border-market-up/20">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-forge-gray-900">
                  Proof of Payment Submitted!
                </h3>
                <p className="text-sm font-medium text-forge-gray-600 leading-relaxed px-4">
                  Your deposit of <strong className="text-forge-gray-900">{amount} {tab}</strong> is currently under review by our treasury team. Your balance will update automatically once verified.
                </p>
              </div>

              <div className="bg-forge-gray-50 rounded-xl p-4 border border-forge-gray-200 text-left text-xs space-y-2 font-medium">
                <div className="flex justify-between">
                  <span className="text-forge-gray-500">Asset:</span>
                  <span className="font-bold text-forge-gray-900">{tab} ({currentNetwork.name})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forge-gray-500">Amount:</span>
                  <span className="font-bold text-forge-gray-900">{amount} {tab}</span>
                </div>
                {txHash && (
                  <div className="flex justify-between">
                    <span className="text-forge-gray-500">Ref / TxID:</span>
                    <span className="font-mono text-forge-gray-900 break-all">{txHash}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-forge-gray-200">
                  <span className="text-forge-gray-500">Review Status:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                    <Clock size={12} /> Pending Approval
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3.5 bg-forge-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
              >
                Done
              </button>
            </div>
          ) : step === 1 ? (
            /* ── Step 1: Address & QR ── */
            <div className="space-y-6">
              {/* Coin Selector Tabs */}
              <div className="flex bg-forge-gray-50 rounded-lg p-1">
                {(['BTC', 'ETH', 'SOL'] as CryptoCurrency[]).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTab(c)}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${tab === c ? 'bg-white shadow-sm text-forge-gray-900' : 'text-forge-gray-500 hover:text-forge-gray-700'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-forge-gray-100 text-forge-gray-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  Network: {currentNetwork.tag}
                </span>
                
                {/* QR Code */}
                <div className="w-52 h-52 mx-auto bg-white border border-forge-gray-200 rounded-2xl p-3.5 flex items-center justify-center relative shadow-sm">
                  <Image 
                    src={currentNetwork.qrCode} 
                    alt={`${currentNetwork.name} QR Code`} 
                    width={200} 
                    height={200} 
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2">Deposit Address</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-forge-gray-50 border border-forge-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-forge-gray-900 break-all select-all">
                    {currentNetwork.address}
                  </div>
                  <button 
                    type="button"
                    onClick={handleCopy}
                    className="w-12 h-12 shrink-0 bg-forge-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-black transition-colors"
                    title="Copy Address"
                  >
                    {copied ? <CheckCircle2 size={20} className="text-market-up" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-start gap-3 p-4 bg-forge-orange-wash/50 rounded-xl">
                <AlertCircle size={20} className="text-forge-orange shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-forge-gray-900">
                  Send only <span className="font-bold">{tab}</span> to this address. 1 network confirmation required.
                </p>
              </div>

              {/* Transition to Step 2 CTA */}
              <div className="pt-2">
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] flex items-center justify-center gap-2"
                >
                  <span>I Have Transferred / Submit Proof of Payment</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── Step 2: Proof of Payment Form ── */
            <form onSubmit={handleSubmitProof} className="space-y-5">
              {/* Destination Summary Pill */}
              <div className="p-3.5 bg-forge-gray-50 border border-forge-gray-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-forge-gray-500 font-medium">Selected Asset:</span>
                  <p className="font-bold text-forge-gray-900 text-sm">{tab} ({currentNetwork.name})</p>
                </div>
                <div className="text-right max-w-[200px]">
                  <span className="text-forge-gray-500 font-medium">Target Address:</span>
                  <p className="font-mono text-forge-gray-700 truncate">{currentNetwork.address}</p>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                  Amount Transferred ({tab}) <span className="text-market-down">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0.000001"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white border border-forge-gray-200 rounded-xl px-4 py-3 font-display font-bold text-lg text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange"
                  />
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center font-bold text-xs uppercase tracking-wider text-forge-gray-400">
                    {tab}
                  </span>
                </div>
              </div>

              {/* Transaction Hash / Ref Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                  Transaction Hash / Reference (TXID)
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="e.g. 0x8f... or blockchain tx ID"
                  className="w-full bg-white border border-forge-gray-200 rounded-xl px-4 py-3 font-mono text-xs text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange"
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                  Payment Screenshot / Receipt <span className="text-market-down">*</span>
                </label>

                {proofImage ? (
                  <div className="relative rounded-xl border-2 border-dashed border-forge-gray-200 p-2 bg-forge-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-forge-gray-200 bg-white shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={proofImage} 
                          alt="Payment Proof" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-forge-gray-900 flex items-center gap-1">
                          <Check size={14} className="text-market-up" /> Screenshot Attached
                        </p>
                        <p className="text-[11px] text-forge-gray-500">Ready for review</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 text-forge-gray-400 hover:text-market-down rounded-lg hover:bg-white transition-colors"
                      title="Remove image"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-forge-gray-300 hover:border-forge-orange rounded-xl p-6 text-center cursor-pointer transition-colors bg-forge-gray-50/50 hover:bg-forge-orange-wash/20"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-10 h-10 mx-auto rounded-full bg-forge-orange-wash text-forge-orange flex items-center justify-center mb-2">
                      <Upload size={18} />
                    </div>
                    <p className="text-xs font-bold text-forge-gray-900">
                      Click to upload payment screenshot
                    </p>
                    <p className="text-[11px] text-forge-gray-500 mt-0.5">
                      PNG, JPG, or WEBP receipts accepted
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!amount || parseFloat(amount) <= 0 || !proofImage}
                  className="w-full py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18} />
                  <span>Submit Proof for Approval</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
