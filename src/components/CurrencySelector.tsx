"use client";

import { useStore, CurrencyType } from "@/lib/store";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const CURRENCIES: { id: CurrencyType; name: string; icon: string }[] = [
  { id: "USD", name: "US Dollar", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg" },
  { id: "GBP", name: "British Pound", icon: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_the_United_Kingdom.svg" },
  { id: "BTC", name: "Bitcoin", icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025" },
  { id: "ETH", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025" },
  { id: "SOL", name: "Solana", icon: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=025" }
];

export function CurrencySelector() {
  const { activeCurrency, setCurrency } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const active = CURRENCIES.find(c => c.id === activeCurrency) || CURRENCIES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forge-gray-50 border border-forge-gray-200 hover:bg-forge-gray-100 transition-colors"
      >
        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
          <Image src={active.icon} alt={active.name} width={20} height={20} className="w-full h-full object-contain" />
        </div>
        <span className="text-sm font-bold text-forge-gray-900">{active.id}</span>
        <ChevronDown size={14} className="text-forge-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-forge-gray-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {CURRENCIES.map(curr => (
            <button
              key={curr.id}
              onClick={() => { setCurrency(curr.id); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-forge-gray-50 transition-colors ${activeCurrency === curr.id ? 'bg-forge-orange-wash/50' : ''}`}
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-sm">
                <Image src={curr.icon} alt={curr.name} width={24} height={24} className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-forge-gray-900">{curr.name}</p>
                <p className="text-xs font-medium text-forge-gray-500">{curr.id}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
