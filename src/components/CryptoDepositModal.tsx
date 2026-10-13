"use client";

import { useState } from "react";
import { X, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { useStore, CurrencyType } from "@/lib/store";
import Image from "next/image";

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
  testCredit: number; 
}> = {
  BTC: {
    name: "Bitcoin",
    tag: "BTC Native SegWit",
    icon: "/currencies/btc.svg",
    address: "bc1qgzdlns0jax6y6x9dwflcs3j8wgne0w0kxussdq",
    qrCode: "/wallets/btc-qr.png",
    testCredit: 0.25
  },
  ETH: {
    name: "Ethereum",
    tag: "Ethereum Mainnet (ERC-20)",
    icon: "/currencies/eth.svg",
    address: "0x208ce7fA3Fd4Ce24C21AbC69ef14b87B61A6197F",
    qrCode: "/wallets/eth-qr.png",
    testCredit: 2.5
  },
  SOL: {
    name: "Solana",
    tag: "Solana (SPL)",
    icon: "/currencies/sol.svg",
    address: "FmBbgLgjVz95XUsD1SBWg7oZQBbYtZXnbBYfFbbNSG9B",
    qrCode: "/wallets/sol-qr.png",
    testCredit: 25
  }
};

export function CryptoDepositModal({ isOpen, onClose }: CryptoDepositModalProps) {
  const { activeCurrency, depositFunds, setToast } = useStore();
  const initialCrypto: CryptoCurrency = (['BTC', 'ETH', 'SOL'] as const).includes(activeCurrency as CryptoCurrency) 
    ? (activeCurrency as CryptoCurrency) 
    : 'BTC';
  const [tab, setTab] = useState<CryptoCurrency>(initialCrypto);
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
        <div className="px-6 py-4 border-b border-forge-gray-100 flex items-center justify-between shrink-0">
          <h2 className="font-display font-bold text-xl text-forge-gray-900">Deposit Crypto</h2>
          <button onClick={onClose} className="text-forge-gray-400 hover:text-forge-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Coin Selector Tabs */}
          <div className="flex bg-forge-gray-50 rounded-lg p-1 mb-6">
            {(['BTC', 'ETH', 'SOL'] as CryptoCurrency[]).map(c => (
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
