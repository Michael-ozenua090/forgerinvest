import Link from "next/link";
import { 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Rocket, 
  Zap, 
  Globe, 
  ArrowRight
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCrypto, convertFiatToCrypto } from "@/lib/format";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const funds = [
  {
    id: "accuidity",
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
  {
    id: "ai20",
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
];

export default function FundsPage() {
  const { activeCurrency } = useStore();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-1">
            Institutional Funds
          </h1>
          <p className="font-medium text-forge-gray-600 max-w-2xl">
            Gain diversified exposure to the private market through Forge's managed index baskets and thematic funds.
          </p>
        </div>
      </div>

      {/* ── Fund Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {funds.map((fund) => (
          <Link href={`/funds/${fund.id}`} key={fund.id} className="clean-card-hover overflow-hidden flex flex-col group cursor-pointer">
            {/* Card Header */}
            <div className="p-6 sm:p-8 border-b border-forge-gray-100 bg-forge-gray-50/50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-forge-orange text-white flex items-center justify-center shadow-[0_4px_14px_rgba(255,90,0,0.25)] shrink-0">
                    <PieChart size={28} />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-2xl text-forge-gray-900">{fund.name}</h2>
                    <p className="text-xs font-bold text-forge-gray-500 uppercase tracking-wider mt-1">Diversified Basket</p>
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-forge-gray-600 leading-relaxed">
                {fund.description}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-forge-gray-100 border-b border-forge-gray-100">
              <div className="p-4 sm:p-6 text-center">
                <p className="text-xs font-bold text-forge-gray-500 uppercase tracking-wider mb-1">Current NAV</p>
                <p className="tabular-nums font-display font-bold text-xl text-forge-gray-900">{formatCrypto(convertFiatToCrypto(fund.nav, activeCurrency), activeCurrency)}</p>
              </div>
              <div className="p-4 sm:p-6 text-center bg-market-up/5">
                <p className="text-xs font-bold text-forge-gray-500 uppercase tracking-wider mb-1">YTD Return</p>
                <p className="tabular-nums font-display font-bold text-xl text-market-up flex items-center justify-center gap-1">
                  <TrendingUp size={16} /> {fund.ytdReturn}
                </p>
              </div>
              <div className="p-4 sm:p-6 text-center">
                <p className="text-xs font-bold text-forge-gray-500 uppercase tracking-wider mb-1">Expense Ratio</p>
                <p className="tabular-nums font-display font-bold text-xl text-forge-gray-900">{fund.expenseRatio}</p>
              </div>
              <div className="p-4 sm:p-6 text-center">
                <p className="text-xs font-bold text-forge-gray-500 uppercase tracking-wider mb-1">Min Ticket</p>
                <p className="tabular-nums font-display font-bold text-xl text-forge-gray-900">{formatCrypto(convertFiatToCrypto(fund.minInvestment, activeCurrency), activeCurrency)}</p>
              </div>
            </div>

            {/* Top 5 Holdings */}
            <div className="p-6 sm:p-8 flex-1">
              <h3 className="text-xs font-bold text-forge-gray-900 uppercase tracking-wider mb-4 border-b border-forge-gray-100 pb-2">
                Top 5 Underlying Holdings
              </h3>
              <ul className="space-y-4">
                {fund.holdings.map((holding, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-forge-gray-100 text-forge-gray-500 flex items-center justify-center shrink-0">
                        <holding.icon size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-forge-gray-900">{holding.name}</p>
                        <p className="text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider">{holding.symbol}</p>
                      </div>
                    </div>
                    <span className="tabular-nums font-bold text-sm text-forge-gray-900 bg-forge-gray-50 px-2 py-1 rounded">
                      {holding.weight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="p-6 sm:p-8 border-t border-forge-gray-100 bg-forge-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-bold text-forge-gray-500 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-market-up" /> Subject to KYC & Accreditation Review
                </p>
                <div className="w-full sm:w-auto px-6 py-3 bg-forge-orange text-white font-bold rounded-lg group-hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] flex items-center justify-center gap-2">
                  View Details <ArrowRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            </div>

          </Link>
        ))}
      </div>

    </div>
  );
}
