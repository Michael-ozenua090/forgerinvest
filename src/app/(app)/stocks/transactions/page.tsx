"use client";

import Link from "next/link";
import { 
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { formatCrypto } from "@/lib/format";

export default function TransactionsPage() {
  const { transactions } = useStore();
  
  // Filter only stock trades
  const stockTxs = transactions.filter(tx => tx.type === "BUY" || tx.type === "SELL");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Sub-nav */}
      <div className="flex items-center gap-6 border-b border-forge-gray-200 mb-2">
        <Link href={ROUTES.app.stocks.directory} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">Search</Link>
        <Link href={ROUTES.app.stocks.watchlist} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">Watchlist</Link>
        <Link href={ROUTES.app.stocks.portfolio} className="pb-3 border-b-2 border-transparent text-forge-gray-500 hover:text-forge-gray-900 font-bold text-sm">My Stocks</Link>
        <Link href={ROUTES.app.stocks.transactions} className="pb-3 border-b-2 border-forge-orange text-forge-orange font-bold text-sm">Trade History</Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-1">
            Trade History
          </h1>
          <p className="font-medium text-forge-gray-600">
            View your past stock executions.
          </p>
        </div>
      </div>

      {/* ── List ──────────────────────────────────────────────────────── */}
      <div className="clean-card p-0 overflow-hidden">
        {stockTxs.length === 0 ? (
          <div className="p-12 text-center text-forge-gray-500 font-medium">No trading history found.</div>
        ) : (
          <div className="divide-y divide-forge-gray-100">
            {stockTxs.map(tx => (
              <div key={tx.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-forge-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${
                    tx.type === 'SELL' ? 'bg-market-up/10 text-market-up' : 'bg-forge-orange-wash text-forge-orange'
                  }`}>
                    {tx.type === 'SELL' ? <ArrowUpRight size={20} strokeWidth={2.5} /> : <ArrowDownRight size={20} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <p className="text-base font-bold text-forge-gray-900">{tx.description}</p>
                    <p className="text-xs font-bold text-forge-gray-400 uppercase tracking-wider flex items-center gap-1 mt-1">
                      <Clock size={12} /> {new Date(tx.date).toLocaleString()} • Ref: {tx.id.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right pl-16 sm:pl-0">
                  <p className="tabular-nums font-display font-bold text-lg text-forge-gray-900">
                    {formatCrypto(Math.abs(tx.amount), tx.currency)}
                  </p>
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-forge-gray-100 text-forge-gray-600 mt-1">
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
