"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Activity, 
  Gavel, 
  Repeat, 
  CheckCircle,
  Building2,
  LineChart,
  BadgeCent,
  Zap,
  Globe,
  Rocket
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const tickerData = [
  { symbol: "DBX", name: "Databricks", price: 268.50, changePct: +36.7 },
  { symbol: "STRP", name: "Stripe", price: 72.45, changePct: +0.0 },
  { symbol: "SHLD", name: "Shield AI", price: 172.04, changePct: +11.9 },
  { symbol: "SPX", name: "SpaceX", price: 112.30, changePct: +5.4 },
  { symbol: "EPIC", name: "Epic Games", price: 410.20, changePct: -2.1 },
  { symbol: "RVOL", name: "Revolut", price: 89.15, changePct: +14.2 },
  { symbol: "OPAI", name: "OpenAI", price: 310.00, changePct: +42.8 },
  { symbol: "DCMG", name: "DeepMind", price: 145.60, changePct: -1.2 },
];

const featuredEquities = [
  {
    name: "Databricks",
    symbol: "DBX",
    sector: "Enterprise Software",
    icon: Building2,
    price: 268.50,
    changePct: +36.7,
    valuation: "$43B",
    liquidity: "High"
  },
  {
    name: "Stripe",
    symbol: "STRP",
    sector: "Fintech",
    icon: BadgeCent,
    price: 72.45,
    changePct: 0.0,
    valuation: "$65B",
    liquidity: "High"
  },
  {
    name: "SpaceX",
    symbol: "SPX",
    sector: "Aerospace",
    icon: Rocket,
    price: 112.30,
    changePct: +5.4,
    valuation: "$150B",
    liquidity: "Moderate"
  },
  {
    name: "OpenAI",
    symbol: "OPAI",
    sector: "Artificial Intelligence",
    icon: Zap,
    price: 310.00,
    changePct: +42.8,
    valuation: "$86B",
    liquidity: "Private Placement"
  },
  {
    name: "Revolut",
    symbol: "RVOL",
    sector: "Fintech",
    icon: Globe,
    price: 89.15,
    changePct: +14.2,
    valuation: "$33B",
    liquidity: "Moderate"
  },
  {
    name: "Shield AI",
    symbol: "SHLD",
    sector: "Defense Tech",
    icon: ShieldCheck,
    price: 172.04,
    changePct: +11.9,
    valuation: "$2.8B",
    liquidity: "High"
  }
];

const timelineBuy = [
  { title: "Register & Verify", desc: "Create your Forge account and complete SEC accredited investor verification.", icon: ShieldCheck },
  { title: "Discover Signals", desc: "Access the Forge Price™ and deep market data for 200+ private unicorns.", icon: Activity },
  { title: "Submit Bid", desc: "Place a formal IOI (Indication of Interest) or a firm bid for the shares you want.", icon: Gavel },
  { title: "Execute Order", desc: "Our brokers match your bid with verified sellers and negotiate the block trade.", icon: Repeat },
  { title: "Settlement", desc: "Funds and shares are securely transferred through our legal and custodial partners.", icon: CheckCircle },
];

const timelineSell = [
  { title: "Register & Verify", desc: "Create your account and securely connect your equity portal.", icon: ShieldCheck },
  { title: "Pricing & Demand", desc: "View historical buy-side demand and current pricing signals for your equity.", icon: LineChart },
  { title: "Submit Ask", desc: "List your shares anonymously or set a firm asking price for our institutional network.", icon: Gavel },
  { title: "Execute Order", desc: "We match your ask with qualified institutional or high-net-worth buyers.", icon: Repeat },
  { title: "Settlement", desc: "Cash is transferred directly to your account upon ROFR clearance.", icon: CheckCircle },
];

// ─── Sub-Components ────────────────────────────────────────────────────────────

function PriceTicker() {
  // We duplicate the array to allow seamless infinite scrolling
  const scrollItems = [...tickerData, ...tickerData, ...tickerData];
  
  return (
    <div className="w-full bg-forge-gray-900 border-y border-forge-gray-800 py-3 overflow-hidden flex">
      <div className="flex animate-marquee whitespace-nowrap min-w-full items-center gap-12 px-6">
        {scrollItems.map((item, i) => {
          const isUp = item.changePct >= 0;
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="font-display font-bold text-sm text-white">{item.name}</span>
              <span className="tabular-nums font-medium text-sm text-forge-gray-400">${item.price.toFixed(2)}</span>
              <span className={`tabular-nums font-bold text-sm flex items-center gap-0.5 ${isUp ? 'text-market-up' : 'text-market-down'}`}>
                {isUp ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                {isUp ? "+" : ""}{item.changePct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EquityCard({ equity }: { equity: typeof featuredEquities[0] }) {
  const isUp = equity.changePct >= 0;
  
  let liquidityColor = "bg-forge-gray-100 text-forge-gray-600";
  if (equity.liquidity === "High") liquidityColor = "bg-market-up/10 text-market-up";
  if (equity.liquidity === "Moderate") liquidityColor = "bg-forge-orange/10 text-forge-orange";

  return (
    <Link href={`/stocks/${equity.symbol}`} className="clean-card-hover p-6 flex flex-col h-full block">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-forge-gray-50 border border-forge-gray-200 flex items-center justify-center text-forge-orange">
            <equity.icon size={24} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-forge-gray-900">{equity.name}</h3>
            <span className="text-xs font-semibold text-forge-gray-600 px-2 py-0.5 rounded-full bg-forge-gray-100 uppercase tracking-wider">
              {equity.sector}
            </span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${liquidityColor}`}>
          {equity.liquidity}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div>
          <p className="text-xs font-medium text-forge-gray-600 mb-1">Forge Price™</p>
          <div className="flex items-end gap-2">
            <span className="tabular-nums font-bold text-xl text-forge-gray-900">${equity.price.toFixed(2)}</span>
            <span className={`tabular-nums text-xs font-bold flex items-center mb-1 ${isUp ? 'text-market-up' : 'text-market-down'}`}>
              {isUp ? "+" : ""}{equity.changePct}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-forge-gray-600 mb-1">Last Valuation</p>
          <span className="tabular-nums font-bold text-xl text-forge-gray-900">{equity.valuation}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const timeline = activeTab === "buy" ? timelineBuy : timelineSell;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* ── 1. Hero Section ────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-forge-gray-900 leading-[1.1] mb-6 tracking-tight">
          Unicorn Liquidity <br className="hidden sm:block" />
          <span className="text-gradient-forge">Has Arrived.</span>
        </h1>
        
        <p className="font-body text-lg sm:text-xl text-forge-gray-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Trade private shares and access pre-IPO equity in Databricks, Stripe, SpaceX, and 200+ high-growth companies.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/stocks" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-body font-bold text-white bg-forge-orange hover:bg-forge-orange-hover shadow-[0_8px_24px_rgba(255,90,0,0.25)] transition-all transform hover:-translate-y-0.5">
            Explore Companies
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          
          <Link href="/stocks" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-body font-bold text-forge-gray-900 bg-white border-2 border-forge-gray-200 hover:border-forge-gray-900 hover:bg-forge-gray-50 transition-all">
            Sell Shares
          </Link>
        </div>
      </section>

      {/* ── 2. Live Market Ticker ──────────────────────────────────── */}
      <PriceTicker />

      {/* ── 3. Featured Equities Grid ──────────────────────────────── */}
      <section className="py-24 bg-forge-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-3">Featured Equities</h2>
              <p className="text-forge-gray-600 font-medium text-lg max-w-xl">
                Access deep liquidity in the world's most sought-after private companies.
              </p>
            </div>
            <Link href="/stocks" className="flex items-center gap-2 font-bold text-forge-orange hover:text-forge-orange-hover transition-colors">
              View full marketplace <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEquities.map((equity) => (
              <EquityCard key={equity.symbol} equity={equity} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. How It Works (Split Tab) ────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-forge-gray-900 mb-4">How Forge Works</h2>
            <p className="text-forge-gray-600 font-medium text-lg">
              A streamlined, institution-grade execution process from discovery to settlement.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-forge-gray-100 rounded-xl max-w-sm mx-auto mb-16">
            <button 
              onClick={() => setActiveTab("buy")}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'buy' ? 'bg-white text-forge-orange shadow-sm' : 'text-forge-gray-500 hover:text-forge-gray-900'}`}
            >
              Buy Shares
            </button>
            <button 
              onClick={() => setActiveTab("sell")}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'sell' ? 'bg-white text-forge-orange shadow-sm' : 'text-forge-gray-500 hover:text-forge-gray-900'}`}
            >
              Sell Shares
            </button>
          </div>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-forge-gray-200" />
            
            <div className="space-y-12">
              {timeline.map((step, idx) => (
                <div key={idx} className="relative flex gap-8 group">
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-white border-2 border-forge-gray-200 flex items-center justify-center text-forge-gray-400 group-hover:border-forge-orange group-hover:text-forge-orange group-hover:shadow-[0_0_20px_rgba(255,90,0,0.15)] transition-all shrink-0">
                    <step.icon size={24} />
                  </div>
                  <div className="pt-2">
                    <h4 className="font-display font-bold text-xl text-forge-gray-900 mb-2">
                      {idx + 1}. {step.title}
                    </h4>
                    <p className="text-forge-gray-600 leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
