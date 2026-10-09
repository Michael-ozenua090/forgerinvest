"use client";

import Link from "next/link";
import { 
  Building2, 
  Rocket, 
  Zap, 
  TrendingUp,
  Star,
  Globe
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";

const getSectorIcon = (sector: string) => {
  if (sector.includes("Aerospace") || sector.includes("Defense")) return Rocket;
  if (sector.includes("Intelligence") || sector.includes("AI")) return Zap;
  if (sector.includes("Fintech")) return Globe;
  return Building2;
};

const parseChange = (changeStr: string) => parseFloat(changeStr.replace('%', '').replace('+', ''));

export default function WatchlistPage() {
  const { watchlist, toggleWatchlist, stocks } = useStore();
  
  const watchlistStocks = stocks.filter(s => watchlist.includes(s.symbol));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Sub-nav */}
      <div className="flex items-center gap-6 border-b border-forge-gray-200 mb-2">
        <Link href={ROUTES.app.stocks.directory} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">Search</Link>
        <Link href={ROUTES.app.stocks.watchlist} className="pb-3 border-b-2 border-forge-orange text-forge-orange font-bold text-sm">Watchlist</Link>
        <Link href={ROUTES.app.stocks.portfolio} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">My Stocks</Link>
        <Link href={ROUTES.app.stocks.transactions} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">Trade History</Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-1">
            Watchlist
          </h1>
          <p className="font-medium text-forge-gray-600">
            Track your favorite private companies.
          </p>
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────── */}
      {watchlistStocks.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-forge-gray-200 rounded-2xl">
          <p className="text-forge-gray-500 font-medium">Your watchlist is empty. Go star some companies in the Marketplace.</p>
          <Link href={ROUTES.app.stocks.directory} className="mt-4 inline-block px-6 py-2 bg-forge-orange text-white rounded-lg font-bold hover:bg-forge-orange-hover">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlistStocks.map((item) => {
            const numChange = parseChange(item.change);
            const isUp = numChange >= 0;
            const Icon = getSectorIcon(item.sector);
            let liquidityColor = "bg-forge-gray-100 text-forge-gray-600";
            if (item.round.includes("Tender") || item.round.includes("Secondary")) liquidityColor = "bg-market-up/10 text-market-up";
            else liquidityColor = "bg-forge-orange/10 text-forge-orange";

            return (
              <Link href={`/stocks/${item.symbol}`} key={item.symbol}>
                <div className="clean-card-hover p-6 h-full flex flex-col cursor-pointer border border-forge-orange/30 shadow-[0_4px_20px_rgba(255,90,0,0.05)] bg-white">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-forge-orange-wash border border-forge-orange/20 flex items-center justify-center text-forge-orange">
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
                          <span className="tabular-nums font-bold text-xl text-forge-gray-900">${item.price.toFixed(2)}</span>
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
