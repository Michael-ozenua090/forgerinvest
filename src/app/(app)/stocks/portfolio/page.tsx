"use client";

import Link from "next/link";
import { 
  Building2, 
  Rocket, 
  Zap, 
  TrendingUp,
  Globe,
  Briefcase
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { formatCrypto, convertFiatToCrypto } from "@/lib/format";

const getSectorIcon = (sector: string) => {
  if (sector.includes("Aerospace") || sector.includes("Defense")) return Rocket;
  if (sector.includes("Intelligence") || sector.includes("AI")) return Zap;
  if (sector.includes("Fintech")) return Globe;
  return Building2;
};

export default function PortfolioPage() {
  const { holdings, stocks, activeCurrency } = useStore();
  
  // Only show stocks, not funds (assuming funds don't have a matching symbol in the `stocks` array or use a different mechanism)
  // For safety, we match the holding symbol to the stocks array to get current price.
  const stockHoldings = holdings.map(h => {
    const stock = stocks.find(s => s.symbol === h.symbol);
    return {
      ...h,
      currentPriceFiat: stock?.price || h.costBasis,
      sector: stock?.sector || "Private Equity",
    };
  }).filter(h => h.currentPriceFiat !== h.costBasis || stocks.find(s => s.symbol === h.symbol));

  const totalValueFiat = stockHoldings.reduce((acc, h) => acc + (h.shares * h.currentPriceFiat), 0);
  const totalCostFiat = stockHoldings.reduce((acc, h) => acc + (h.shares * h.costBasis), 0);
  const totalValueCrypto = convertFiatToCrypto(totalValueFiat, activeCurrency);
  const totalCostCrypto = convertFiatToCrypto(totalCostFiat, activeCurrency);
  const totalUnrealizedCrypto = totalValueCrypto - totalCostCrypto;
  const isUp = totalUnrealizedCrypto >= 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Sub-nav */}
      <div className="flex items-center gap-6 border-b border-forge-gray-200 mb-2">
        <Link href={ROUTES.app.stocks.directory} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">Search</Link>
        <Link href={ROUTES.app.stocks.watchlist} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">Watchlist</Link>
        <Link href={ROUTES.app.stocks.portfolio} className="pb-3 border-b-2 border-forge-orange text-forge-orange font-bold text-sm">My Stocks</Link>
        <Link href={ROUTES.app.stocks.transactions} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">Trade History</Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-1">
            My Stocks
          </h1>
          <p className="font-medium text-forge-gray-600">
            Track your active pre-IPO equity positions.
          </p>
        </div>
      </div>

      {/* ── Summary Card ──────────────────────────────────────────────── */}
      <div className="clean-card p-8 bg-forge-gray-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-forge-gray-400 mb-2 flex items-center gap-2"><Briefcase size={16} /> Total Equity Value</p>
          <p className="tabular-nums font-display font-extrabold text-4xl sm:text-5xl text-white">
            {formatCrypto(totalValueCrypto, activeCurrency)}
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm font-bold uppercase tracking-wider text-forge-gray-400 mb-2">Unrealized PnL</p>
          <div className="flex items-end md:justify-end gap-2">
            <p className={`tabular-nums font-display font-extrabold text-2xl sm:text-3xl ${isUp ? 'text-market-up' : 'text-market-down'}`}>
              {isUp ? "+" : ""}{formatCrypto(totalUnrealizedCrypto, activeCurrency)}
            </p>
            <span className={`tabular-nums text-sm font-bold mb-1 ${isUp ? 'text-market-up' : 'text-market-down'}`}>
              ({isUp ? "+" : ""}{totalCostCrypto > 0 ? ((totalUnrealizedCrypto / totalCostCrypto) * 100).toFixed(1) : "0.0"}%)
            </span>
          </div>
        </div>
      </div>

      {/* ── List ──────────────────────────────────────────────────────── */}
      {stockHoldings.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-forge-gray-200 rounded-2xl">
          <p className="text-forge-gray-500 font-medium mb-4">You don't have any active stock positions.</p>
          <Link href={ROUTES.app.stocks.directory} className="inline-block px-6 py-2 bg-forge-orange text-white rounded-lg font-bold hover:bg-forge-orange-hover">
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="clean-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-forge-gray-50 border-b border-forge-gray-200 text-xs font-bold text-forge-gray-500 uppercase tracking-wider">
                  <th className="p-4">Asset</th>
                  <th className="p-4 text-right">Shares</th>
                  <th className="p-4 text-right">Cost Basis</th>
                  <th className="p-4 text-right">Current Price</th>
                  <th className="p-4 text-right">Unrealized PnL</th>
                  <th className="p-4 text-right">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forge-gray-100">
                {stockHoldings.map((pos) => {
                  const valFiat = pos.shares * pos.currentPriceFiat;
                  const costFiat = pos.shares * pos.costBasis;
                  const valCrypto = convertFiatToCrypto(valFiat, activeCurrency);
                  const costCrypto = convertFiatToCrypto(costFiat, activeCurrency);
                  const pnlCrypto = valCrypto - costCrypto;
                  const pnlPct = costCrypto > 0 ? (pnlCrypto / costCrypto) * 100 : 0;
                  const Icon = getSectorIcon(pos.sector);
                  
                  return (
                    <tr key={pos.symbol} className="hover:bg-forge-gray-50/50 transition-colors group">
                      <td className="p-4">
                        <Link href={`/stocks/${pos.symbol}`} className="flex items-center gap-3 w-max">
                          <div className="w-10 h-10 rounded-lg bg-forge-gray-100 flex items-center justify-center text-forge-gray-600 group-hover:bg-forge-orange-wash group-hover:text-forge-orange transition-colors">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-forge-gray-900 group-hover:text-forge-orange transition-colors">{pos.name}</p>
                            <p className="text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider">{pos.symbol}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 text-right font-medium text-forge-gray-900 tabular-nums">{pos.shares.toLocaleString()}</td>
                      <td className="p-4 text-right font-medium text-forge-gray-600 tabular-nums">{formatCrypto(convertFiatToCrypto(pos.costBasis, activeCurrency), activeCurrency)}</td>
                      <td className="p-4 text-right font-medium text-forge-gray-900 tabular-nums">{formatCrypto(convertFiatToCrypto(pos.currentPriceFiat, activeCurrency), activeCurrency)}</td>
                      <td className="p-4 text-right tabular-nums">
                        <p className={`font-bold ${pnlCrypto >= 0 ? 'text-market-up' : 'text-market-down'}`}>
                          {pnlCrypto >= 0 ? '+' : ''}{formatCrypto(pnlCrypto, activeCurrency)}
                        </p>
                        <p className={`text-xs font-bold ${pnlCrypto >= 0 ? 'text-market-up/80' : 'text-market-down/80'}`}>
                          {pnlCrypto >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                        </p>
                      </td>
                      <td className="p-4 text-right font-bold text-forge-gray-900 tabular-nums">{formatCrypto(valCrypto, activeCurrency)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
