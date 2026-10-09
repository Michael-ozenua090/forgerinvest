"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Building2, 
  Rocket, 
  Zap, 
  TrendingUp,
  ShieldCheck,
  Filter,
  Star,
  Globe
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { convertFiatToCrypto, formatCrypto } from "@/lib/format";

const tabs = ["All Companies", "Top Gainers", "Most Liquid", "Recent Trades"];

const getSectorIcon = (sector: string) => {
  if (sector.includes("Aerospace") || sector.includes("Defense")) return Rocket;
  if (sector.includes("Intelligence") || sector.includes("AI")) return Zap;
  if (sector.includes("Fintech")) return Globe;
  return Building2;
};

const parseChange = (changeStr: string) => parseFloat(changeStr.replace('%', '').replace('+', ''));

export default function MarketplacePage() {
  const { watchlist, toggleWatchlist, stocks, activeCurrency } = useStore();
  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState("All Sectors");
  const [activeTab, setActiveTab] = useState("All Companies");

  const sectors = ["All Sectors", ...Array.from(new Set(stocks.map(s => s.sector)))];

  // Fuzzy filter logic
  const filteredData = stocks.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesSector = activeSector === "All Sectors" || item.sector === activeSector;
    return matchesSearch && matchesSector;
  }).sort((a, b) => {
    if (activeTab === "Top Gainers") return parseChange(b.change) - parseChange(a.change);
    // If Most Liquid, mock sorting by price for now
    if (activeTab === "Most Liquid") return b.price - a.price;
    return 0;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Sub-nav */}
      <div className="flex items-center gap-6 border-b border-forge-gray-200 mb-2">
        <Link href={ROUTES.app.stocks.directory} className="pb-3 border-b-2 border-forge-orange text-forge-orange font-bold text-sm">Search</Link>
        <Link href={ROUTES.app.stocks.watchlist} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">Watchlist</Link>
        <Link href={ROUTES.app.stocks.portfolio} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">My Stocks</Link>
        <Link href={ROUTES.app.stocks.transactions} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">Trade History</Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-1">
            Marketplace
          </h1>
          <p className="font-medium text-forge-gray-600">
            Discover and trade 200+ pre-IPO companies.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-forge-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full bg-white border border-forge-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            placeholder="Search companies or tickers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Filters & Tabs ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* Sector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-forge-gray-100 rounded-md text-xs font-bold text-forge-gray-500 mr-2 shrink-0">
            <Filter size={14} /> Sectors
          </div>
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeSector === sector
                  ? "bg-forge-gray-900 border-forge-gray-900 text-white shadow-md"
                  : "bg-white border-forge-gray-200 text-forge-gray-600 hover:border-forge-orange/50 hover:text-forge-orange"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Sorting Tabs */}
        <div className="flex border-b border-forge-gray-200 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-forge-orange text-forge-orange"
                  : "border-transparent text-forge-gray-500 hover:text-forge-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────── */}
      {filteredData.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-forge-gray-200 rounded-2xl">
          <p className="text-forge-gray-500 font-medium">No companies found matching "{search}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => {
            const numChange = parseChange(item.change);
            const isUp = numChange >= 0;
            const Icon = getSectorIcon(item.sector);
            let liquidityColor = "bg-forge-gray-100 text-forge-gray-600";
            if (item.round.includes("Tender") || item.round.includes("Secondary")) liquidityColor = "bg-market-up/10 text-market-up";
            else liquidityColor = "bg-forge-orange/10 text-forge-orange";

            return (
              <Link href={`/stocks/${item.symbol}`} key={item.symbol}>
                <div className="clean-card-hover p-6 h-full flex flex-col cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-forge-gray-50 border border-forge-gray-200 flex items-center justify-center text-forge-gray-600">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-forge-gray-900">{item.name}</h3>
                        <p className="text-xs font-bold text-forge-gray-400 uppercase tracking-wider">{item.symbol}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${liquidityColor}`}>
                        {item.round}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWatchlist(item.symbol);
                        }}
                        className="p-1 text-forge-gray-400 hover:text-forge-orange transition-colors"
                      >
                        <Star size={18} className={watchlist.includes(item.symbol) ? "fill-forge-orange text-forge-orange" : ""} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-xs font-medium text-forge-gray-500 mb-1">Forge Price™</p>
                        <div className="flex items-end gap-2">
                          <span className="tabular-nums font-bold text-xl text-forge-gray-900">{formatCrypto(convertFiatToCrypto(item.price, activeCurrency), activeCurrency)}</span>
                          <span className={`tabular-nums text-xs font-bold flex items-center mb-1 ${isUp ? 'text-market-up' : 'text-market-down'}`}>
                            {isUp ? <TrendingUp size={12} className="mr-0.5" /> : null}
                            {isUp ? "+" : ""}{numChange}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-forge-gray-100">
                      <span className="text-xs font-bold text-forge-gray-600 uppercase tracking-wider">{item.sector}</span>
                      <span className="text-xs font-bold text-forge-gray-900 tabular-nums">Val: {item.valuation}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
