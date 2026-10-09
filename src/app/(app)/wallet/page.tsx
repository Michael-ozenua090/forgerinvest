"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Wallet, 
  ShieldCheck, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Building2, 
  Landmark, 
  Lock,
  X
} from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { formatCrypto } from "@/lib/format";

export default function WalletPage() {
  const { cryptoBalances, activeCurrency, setDepositModalOpen } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 relative">
      
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-1">
          Crypto Wallet
        </h1>
        <p className="font-medium text-forge-gray-600">
          Manage your digital assets and blockchain connections.
        </p>
      </div>

      {/* ── Main Balance Card ─────────────────────────────────────────── */}
      <div className="clean-card p-8 sm:p-10 bg-gradient-to-br from-forge-gray-900 to-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Wallet size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-market-up/20 border border-market-up/30 text-market-up rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <ShieldCheck size={14} />
            Cold Storage Secured
          </div>
          
          <p className="text-sm font-bold uppercase tracking-wider text-forge-gray-400 mb-2">Available Balance ({activeCurrency})</p>
          <p className="tabular-nums font-display font-extrabold text-5xl sm:text-6xl text-white mb-8">
            {formatCrypto(cryptoBalances[activeCurrency], activeCurrency)}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setDepositModalOpen(true)}
              className="px-6 py-3 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.3)] flex items-center gap-2"
            >
              <ArrowDownToLine size={18} /> Deposit Funds
            </button>
            <Link 
              href="/wallet/withdraw"
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2"
            >
              <ArrowUpFromLine size={18} /> Withdraw
            </Link>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4">
            <Link 
              href="/wallet/transactions"
              className="text-sm font-bold text-forge-gray-400 hover:text-white transition-colors"
            >
              View Transaction Ledger →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Connected Wallets (Static UI) ─────────────────────────────── */}
      <div className="clean-card overflow-hidden">
        <div className="p-6 border-b border-forge-gray-100 flex justify-between items-center">
          <h2 className="font-display font-bold text-xl text-forge-gray-900">Connected Wallets</h2>
          <button className="text-sm font-bold text-forge-orange hover:text-forge-orange-hover">+ Link Wallet</button>
        </div>
        <div className="p-6 flex items-center justify-between hover:bg-forge-gray-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-forge-gray-100 text-forge-gray-600 flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <div>
              <p className="font-bold text-forge-gray-900">MetaMask</p>
              <p className="text-xs font-bold text-forge-gray-500 uppercase tracking-wider">0x71C8...9A64</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-market-up/10 text-market-up text-[10px] font-bold uppercase tracking-wider rounded-md">
            Verified
          </span>
        </div>
      </div>

    </div>
  );
}
