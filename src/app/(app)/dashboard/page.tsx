"use client";

import Link from "next/link";
import { 
  TrendingUp, 
  Wallet, 
  Briefcase, 
  Landmark, 
  Search, 
  FileText, 
  ArrowRightLeft,
  ArrowRight,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCrypto, convertFiatToCrypto } from "@/lib/format";

export default function DashboardPage() {
  const { user, holdings, transactions, cryptoBalances, activeCurrency, stocks, setDepositModalOpen } = useStore();
  
  const totalHoldingsFiat = holdings.reduce((acc, h) => {
    const stock = stocks.find(s => s.symbol === h.symbol);
    return acc + (h.shares * (stock?.price || h.costBasis));
  }, 0);
  const totalHoldingsCrypto = convertFiatToCrypto(totalHoldingsFiat, activeCurrency);
  const availableCrypto = cryptoBalances[activeCurrency] ?? 0;
  const totalValueCrypto = availableCrypto + totalHoldingsCrypto;

  const totalCostFiat = holdings.reduce((acc, h) => acc + (h.shares * h.costBasis), 0);
  const totalCostCrypto = convertFiatToCrypto(totalCostFiat, activeCurrency);
  const unrealizedCrypto = totalHoldingsCrypto - totalCostCrypto;
  const unrealizedPct = totalCostCrypto > 0 ? (unrealizedCrypto / totalCostCrypto) * 100 : 0;
  const isUp = unrealizedCrypto >= 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-1">
            Welcome back, {user.name.split(" ")[0]}.
          </h1>
          <p className="font-medium text-forge-gray-600">
            Here is your executive portfolio summary.
          </p>
        </div>
        <Link href="/portfolio" className="text-sm font-bold text-forge-orange hover:text-forge-orange-hover flex items-center gap-1">
          View full portfolio <ArrowRight size={16} />
        </Link>
      </div>

      {/* ── Metric Summary Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="clean-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-forge-gray-50 flex items-center justify-center text-forge-gray-500">
              <Landmark size={20} />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-forge-gray-500">Total Value</p>
          </div>
          <p className="tabular-nums font-display font-extrabold text-3xl text-forge-gray-900">
            {formatCrypto(totalValueCrypto, activeCurrency)}
          </p>
        </div>

        {/* Unrealized PnL */}
        <div className={`clean-card p-6 border-l-4 ${isUp ? 'border-l-market-up' : 'border-l-market-down'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUp ? 'bg-market-up/10 text-market-up' : 'bg-market-down/10 text-market-down'}`}>
              <TrendingUp size={20} />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-forge-gray-500">Unrealized PnL</p>
          </div>
          <div className="flex items-end gap-2">
            <p className={`tabular-nums font-display font-extrabold text-3xl ${isUp ? 'text-market-up' : 'text-market-down'}`}>
              {isUp ? "+" : ""}{formatCrypto(unrealizedCrypto, activeCurrency)}
            </p>
            <span className={`tabular-nums text-sm font-bold mb-1 ${isUp ? 'text-market-up' : 'text-market-down'}`}>
              {isUp ? "+" : ""}{unrealizedPct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Available Cash */}
        <div className="clean-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-forge-gray-50 flex items-center justify-center text-forge-gray-500">
              <Wallet size={20} />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-forge-gray-500">Available Cash</p>
          </div>
          <p className="tabular-nums font-display font-extrabold text-3xl text-forge-gray-900">
            {formatCrypto(availableCrypto, activeCurrency)}
          </p>
        </div>

        {/* Active Positions */}
        <div className="clean-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-forge-orange-wash flex items-center justify-center text-forge-orange">
              <Briefcase size={20} />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-forge-gray-500">Active Positions</p>
          </div>
          <p className="tabular-nums font-display font-extrabold text-3xl text-forge-gray-900">
            {holdings.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Quick Action Shortcuts ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display font-bold text-xl text-forge-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <button onClick={() => setDepositModalOpen(true)} className="clean-card-hover p-5 flex items-start gap-4 text-left group">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-forge-orange text-white flex items-center justify-center shadow-[0_4px_14px_rgba(255,90,0,0.25)]">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-bold text-forge-gray-900 group-hover:text-forge-orange transition-colors">Deposit Crypto</h3>
                <p className="text-sm font-medium text-forge-gray-600 mt-1">Fund your wallet with BTC, ETH, or SOL.</p>
              </div>
            </button>

            <button className="clean-card-hover p-5 flex items-start gap-4 text-left group">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-forge-gray-50 border border-forge-gray-200 text-forge-gray-500 flex items-center justify-center group-hover:border-forge-orange group-hover:text-forge-orange transition-colors">
                <Search size={24} />
              </div>
              <div>
                <h3 className="font-bold text-forge-gray-900 group-hover:text-forge-orange transition-colors">Search Pre-IPO Tickers</h3>
                <p className="text-sm font-medium text-forge-gray-600 mt-1">Discover pricing and liquidity data.</p>
              </div>
            </button>

            <button className="clean-card-hover p-5 flex items-start gap-4 text-left group">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-forge-gray-50 border border-forge-gray-200 text-forge-gray-500 flex items-center justify-center group-hover:border-forge-orange group-hover:text-forge-orange transition-colors">
                <ArrowRightLeft size={24} />
              </div>
              <div>
                <h3 className="font-bold text-forge-gray-900 group-hover:text-forge-orange transition-colors">Submit Share Transfer</h3>
                <p className="text-sm font-medium text-forge-gray-600 mt-1">Initiate an inbound equity transfer.</p>
              </div>
            </button>

            <button className="clean-card-hover p-5 flex items-start gap-4 text-left group">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-forge-gray-50 border border-forge-gray-200 text-forge-gray-500 flex items-center justify-center group-hover:border-forge-orange group-hover:text-forge-orange transition-colors">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-forge-gray-900 group-hover:text-forge-orange transition-colors">Generate Tax Report</h3>
                <p className="text-sm font-medium text-forge-gray-600 mt-1">Download 1099s and transaction logs.</p>
              </div>
            </button>

          </div>
        </div>

        {/* ── Recent Activity ───────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-forge-gray-900">Recent Activity</h2>
          <div className="clean-card p-0 overflow-hidden">
            
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-forge-gray-500 font-medium">No recent activity.</div>
            ) : (
              transactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="p-4 border-b border-forge-gray-100 flex items-start gap-4 hover:bg-forge-gray-50 transition-colors cursor-pointer">
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                    tx.type === 'DEPOSIT' || tx.type === 'SELL' ? 'bg-market-up/10 text-market-up' :
                    tx.type === 'BUY' ? 'bg-forge-orange-wash text-forge-orange' : 'bg-forge-gray-100 text-forge-gray-500'
                  }`}>
                    {tx.type === 'DEPOSIT' ? <ArrowDownRight size={18} strokeWidth={2.5} /> :
                     tx.type === 'WITHDRAW' ? <ArrowUpRight size={18} strokeWidth={2.5} /> :
                     <ArrowRightLeft size={18} strokeWidth={2.5} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-forge-gray-900">{tx.description}</p>
                    <p className="text-xs font-medium text-forge-gray-500 mt-0.5">{tx.status}</p>
                  </div>
                  <div className="text-right">
                    <p className={`tabular-nums text-sm font-bold ${tx.amount > 0 ? 'text-market-up' : 'text-forge-gray-900'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCrypto(Math.abs(tx.amount), tx.currency)}
                    </p>
                    <p className="text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider flex items-center justify-end gap-1 mt-1">
                      <Clock size={10} /> {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
