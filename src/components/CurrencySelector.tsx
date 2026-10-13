"use client";

import { useStore, CurrencyType } from "@/lib/store";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useHydration } from "@/lib/useHydration";

const CURRENCIES: { id: CurrencyType; name: string; icon: string }[] = [
  { id: "USD", name: "US Dollar", icon: "/currencies/usd.svg" },
  { id: "GBP", name: "British Pound", icon: "/currencies/gbp.svg" },
  { id: "BTC", name: "Bitcoin", icon: "/currencies/btc.svg" },
  { id: "ETH", name: "Ethereum", icon: "/currencies/eth.svg" },
  { id: "SOL", name: "Solana", icon: "/currencies/sol.svg" }
];

export function CurrencySelector() {
  const isHydrated = useHydration();
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

  const effectiveCurrency = isHydrated ? activeCurrency : 'USD';
  const active = CURRENCIES.find(c => c.id === effectiveCurrency) || CURRENCIES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forge-gray-50 border border-forge-gray-200 hover:bg-forge-gray-100 transition-colors"
      >
        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
          <Image src={active.icon} alt={active.name} width={20} height={20} className="w-full h-full object-contain" />
        </div>
        <span className="text-sm font-bold text-forge-gray-900" suppressHydrationWarning>{active.id}</span>
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
