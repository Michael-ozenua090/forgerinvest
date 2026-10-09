"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PieChart, TrendingUp, ShieldCheck, Rocket, Building2, Zap, Globe, AlertCircle, X, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { formatCrypto, convertFiatToCrypto } from "@/lib/format";

const FUNDS_DATA: Record<string, any> = {
  "accuidity": {
    name: "Forge Accuidity Index",
    description: "A passively managed basket tracking the top 60 most liquid private technology companies. Optimized for broad pre-IPO market exposure.",
    nav: 145.20,
    ytdReturn: "+18.4%",
    expenseRatio: "0.75%",
    minInvestment: 100000,
    holdings: [
      { name: "SpaceX", symbol: "SPX", icon: Rocket, weight: "8.5%" },
      { name: "Stripe", symbol: "STRP", icon: Building2, weight: "7.2%" },
      { name: "Databricks", symbol: "DBX", icon: Building2, weight: "6.8%" },
      { name: "Epic Games", symbol: "EPIC", icon: Globe, weight: "5.4%" },
      { name: "Revolut", symbol: "RVOL", icon: Globe, weight: "4.1%" },
    ]
  },
  "ai20": {
    name: "Next-Gen AI 20 Basket",
    description: "Actively managed portfolio concentrated on the 20 fastest-growing foundational AI and machine learning infrastructure startups.",
    nav: 210.85,
    ytdReturn: "+42.1%",
    expenseRatio: "1.25%",
    minInvestment: 250000,
    holdings: [
      { name: "OpenAI", symbol: "OPAI", icon: Zap, weight: "15.0%" },
      { name: "Databricks", symbol: "DBX", icon: Building2, weight: "12.5%" },
      { name: "Anthropic", symbol: "ANTH", icon: Zap, weight: "9.0%" },
      { name: "Scale AI", symbol: "SCAI", icon: Globe, weight: "8.2%" },
      { name: "CoreWeave", symbol: "CORE", icon: Building2, weight: "6.5%" },
    ]
  }
};

function SVGFundChart() {
  return (
    <div className="relative w-full h-[250px] mt-6 mb-2">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[1,2,3,4,5].map(i => <div key={i} className="w-full border-b border-forge-gray-100 h-0" />)}
      </div>
      <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 250">
        <defs>
          <linearGradient id="fundGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-forge-orange)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-forge-orange)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 0,220 L 200,180 L 400,190 L 600,130 L 800,80 L 1000,40 L 1000,250 L 0,250 Z" fill="url(#fundGradient)" />
        <path d="M 0,220 L 200,180 L 400,190 L 600,130 L 800,80 L 1000,40" fill="none" stroke="var(--color-forge-orange)" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="1000" cy="40" r="5" fill="var(--color-forge-white)" stroke="var(--color-forge-orange)" strokeWidth="3" />
      </svg>
    </div>
  );
}

export default function FundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fundId = params.id as string;
  const fund = FUNDS_DATA[fundId] || FUNDS_DATA["accuidity"];
  const { user, cryptoBalances, activeCurrency, investInFund, setToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [investAmount, setInvestAmount] = useState<string>("");

  const amountNum = parseFloat(investAmount) || 0;
  
  // NAV and minInvestment are internally fiat, we must convert them to the active crypto
  // wait, the crypto pricing applies everywhere, so fund NAV & Min should be converted to crypto
  const fundNavCrypto = convertFiatToCrypto(fund.nav, activeCurrency);
  const fundMinCrypto = convertFiatToCrypto(fund.minInvestment, activeCurrency);
  
  const meetsMin = amountNum >= fundMinCrypto;
  const availableCrypto = cryptoBalances[activeCurrency] || 0;
  const hasCash = amountNum <= availableCrypto;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-forge-orange text-white flex items-center justify-center shadow-[0_4px_14px_rgba(255,90,0,0.25)]">
            <PieChart size={32} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 flex items-center gap-3">
              {fund.name}
            </h1>
            <p className="text-sm font-bold text-forge-gray-500 uppercase tracking-wider mt-1">Diversified Index Basket</p>
          </div>
        </div>
        
        <div className="flex items-end gap-6 text-right">
          <div>
            <p className="text-xs font-bold text-forge-gray-500 uppercase tracking-wider mb-1">Current NAV</p>
            <div className="flex items-end gap-2">
              <p className="tabular-nums font-display font-bold text-xl text-forge-gray-900">{formatCrypto(fundNavCrypto, activeCurrency)}</p>
              <span className="text-xs font-bold text-market-up mb-0.5">{fund.ytdReturn} YTD</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Main Chart & Holdings ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="clean-card p-6 sm:p-8">
            <h2 className="font-display font-bold text-lg text-forge-gray-900">Performance History</h2>
            <SVGFundChart />
          </div>

          <div className="clean-card overflow-hidden">
            <div className="p-6 border-b border-forge-gray-100 flex justify-between items-center">
              <h2 className="font-display font-bold text-lg text-forge-gray-900">Underlying Holdings</h2>
            </div>
            <ul className="divide-y divide-forge-gray-100">
              {fund.holdings.map((holding: any, idx: number) => (
                <li key={idx} className="p-6 flex items-center justify-between hover:bg-forge-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-forge-gray-100 text-forge-gray-600 flex items-center justify-center">
                      <holding.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-forge-gray-900">{holding.name}</p>
                      <p className="text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider">{holding.symbol}</p>
                    </div>
                  </div>
                  <span className="tabular-nums font-bold text-sm text-forge-gray-900 bg-white border border-forge-gray-200 px-3 py-1 rounded-lg">
                    {holding.weight}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Subscription Panel ─────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="clean-card p-6 sticky top-24 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            <h3 className="font-display font-bold text-lg text-forge-gray-900 mb-2">Subscribe</h3>
            <p className="text-sm font-medium text-forge-gray-600 mb-6">{fund.description}</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between border-b border-forge-gray-100 pb-2 text-sm">
                <span className="text-forge-gray-500 font-bold uppercase tracking-wider text-xs mt-0.5">Min Ticket</span>
                <span className="font-bold text-forge-gray-900">{formatCrypto(fundMinCrypto, activeCurrency)}</span>
              </div>
              <div className="flex justify-between border-b border-forge-gray-100 pb-2 text-sm">
                <span className="text-forge-gray-500 font-bold uppercase tracking-wider text-xs mt-0.5">Expense Ratio</span>
                <span className="font-bold text-forge-gray-900">{fund.expenseRatio}</span>
              </div>
            </div>

            <button 
              onClick={() => { setIsModalOpen(true); setShowSuccess(false); }} 
              className="w-full py-3.5 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] flex items-center justify-center gap-2"
            >
              Invest Now
            </button>
            <p className="text-center text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={12} /> Requires KYC Verification
            </p>
          </div>
        </div>

      </div>

      {/* ── Subscription Modal ────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-forge-gray-100 flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-forge-gray-900">
                {showSuccess ? "Investment Confirmed" : `Invest in ${fund.name}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-forge-gray-400 hover:text-forge-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {showSuccess ? (
                <div className="text-center py-8 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-market-up/10 text-market-up rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-forge-gray-900 mb-2">Subscription Successful</h3>
                  <p className="text-sm text-forge-gray-600 mb-8">
                    Your investment of {formatCrypto(amountNum, activeCurrency)} has been processed and added to your portfolio.
                  </p>
                  <Link 
                    href={ROUTES.app.portfolio.home}
                    className="flex items-center justify-center w-full py-3.5 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)]"
                  >
                    View in Portfolio
                  </Link>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600">Investment Amount</label>
                      <span className="text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider">Avail: {formatCrypto(availableCrypto, activeCurrency)}</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forge-gray-500 font-bold text-lg">{activeCurrency}</div>
                      <input 
                        type="number" 
                        step="0.00001"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-lg pl-16 pr-4 py-4 text-xl font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Validation Warnings */}
                  {investAmount !== "" && !meetsMin && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-bold">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <p>Minimum investment is {formatCrypto(fundMinCrypto, activeCurrency)}.</p>
                    </div>
                  )}
                  {investAmount !== "" && meetsMin && !hasCash && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-bold">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <p>Insufficient funds. Please deposit more cash.</p>
                    </div>
                  )}

                  <button 
                    type="button"
                    onClick={() => {
                      investInFund(fundId, fund.name, amountNum);
                      setToast(`Successfully invested ${formatCrypto(amountNum, activeCurrency)} in ${fund.name}`);
                      setShowSuccess(true);
                      setInvestAmount("");
                    }}
                    disabled={!investAmount || !meetsMin || !hasCash}
                    className={`w-full py-4 rounded-lg font-bold transition-all flex justify-center items-center gap-2 ${
                      investAmount && meetsMin && hasCash
                        ? "bg-forge-orange text-white hover:bg-forge-orange-hover shadow-[0_4px_14px_rgba(255,90,0,0.25)]" 
                        : "bg-forge-gray-100 text-forge-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Confirm Subscription
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
