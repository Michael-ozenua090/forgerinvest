"use client";

import { useState } from "react";
import { X, Copy, CheckCircle2, QrCode, AlertCircle } from "lucide-react";
import { useStore, CurrencyType } from "@/lib/store";
import Image from "next/image";

interface CryptoDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NETWORKS: Record<CurrencyType, { name: string; tag: string; icon: string; address: string; testCredit: number }> = {
  BTC: {
    name: "Bitcoin",
    tag: "BTC Native SegWit",
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    testCredit: 0.25
  },
  ETH: {
    name: "Ethereum",
    tag: "Ethereum Mainnet (ERC-20)",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025",
    address: "0x71C83607fEF3D634e4C546aD340915f6A8209A64",
    testCredit: 2.5
  },
  SOL: {
    name: "Solana",
    tag: "Solana (SPL)",
    icon: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=025",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    testCredit: 25
  }
};

export function CryptoDepositModal({ isOpen, onClose }: CryptoDepositModalProps) {
  const { activeCurrency, depositFunds, setToast } = useStore();
  const initialCrypto: CurrencyType = (['BTC', 'ETH', 'SOL'] as CurrencyType[]).includes(activeCurrency) 
    ? activeCurrency 
    : 'BTC';
  const [tab, setTab] = useState<CurrencyType>(initialCrypto);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentNetwork = NETWORKS[tab] || NETWORKS.BTC;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentNetwork.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = () => {
    depositFunds(tab, currentNetwork.testCredit);
    setToast(`Successfully deposited ${currentNetwork.testCredit} ${tab}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-forge-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-forge-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-forge-gray-900">Deposit Crypto</h2>
          <button onClick={onClose} className="text-forge-gray-400 hover:text-forge-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Coin Selector Tabs */}
          <div className="flex bg-forge-gray-50 rounded-lg p-1 mb-6">
            {(['BTC', 'ETH', 'SOL'] as CurrencyType[]).map(c => (
              <button
                key={c}
                onClick={() => setTab(c)}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${tab === c ? 'bg-white shadow-sm text-forge-gray-900' : 'text-forge-gray-500 hover:text-forge-gray-700'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-forge-gray-100 text-forge-gray-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                Network: {currentNetwork.tag}
              </span>
              
              {/* QR Mockup */}
              <div className="w-48 h-48 mx-auto bg-white border border-forge-gray-200 rounded-2xl p-4 flex items-center justify-center relative shadow-sm">
                <QrCode size={160} strokeWidth={1} className="text-forge-gray-900" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full p-1.5 shadow-md border border-forge-gray-100">
                    <Image src={currentNetwork.icon} alt={tab} width={40} height={40} className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2">Deposit Address</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-forge-gray-50 border border-forge-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-forge-gray-900 break-all">
                  {currentNetwork.address}
                </div>
                <button 
                  onClick={handleCopy}
                  className="w-12 h-12 shrink-0 bg-forge-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-black transition-colors"
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

            {/* Simulate Button */}
            <div className="pt-4 border-t border-forge-gray-100">
              <button 
                onClick={handleSimulate}
                className="w-full py-4 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)]"
              >
                Test Credit (+{currentNetwork.testCredit} {tab})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
