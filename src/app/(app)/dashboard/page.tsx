"use client";

import Link from "next/link";
import { 
  TrendingUp, 
  Wallet, 
  Briefcase, 
  Landmark, 
  Sparkles,
  ArrowRight, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  PlusCircle,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCrypto, formatFiat, convertFiatToCrypto } from "@/lib/format";
import { ROUTES } from "@/lib/routes";
import { useHydration } from "@/lib/useHydration";

export default function DashboardPage() {
  const isHydrated = useHydration();
  const { 
    user, 
    savingsPlans, 
    transactions, 
    getBalance, 
    activeCurrency, 
    liveRates, 
    setDepositModalOpen 
  } = useStore();
  
  const availableCrypto = getBalance(activeCurrency);

  // Active & matured plan stats
  const activePlans = savingsPlans.filter((p) => p.status === "ACTIVE");
  const maturedPlans = savingsPlans.filter((p) => p.status === "MATURED");

  const totalActiveCapitalUsd = activePlans.reduce((sum, p) => sum + p.capital, 0);
  const totalActiveCapitalCrypto = convertFiatToCrypto(totalActiveCapitalUsd, activeCurrency, liveRates);

  const totalAccruedProfitsUsd = savingsPlans
    .filter((p) => p.status === "ACTIVE" || p.status === "MATURED")
    .reduce((sum, p) => sum + p.projectedProfit, 0);
  const totalAccruedProfitsCrypto = convertFiatToCrypto(totalAccruedProfitsUsd, activeCurrency, liveRates);

  const totalPortfolioValueCrypto = availableCrypto + totalActiveCapitalCrypto + totalAccruedProfitsCrypto;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-12">
      
      {/* ── Welcome Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-forge-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-forge-orange-wash text-forge-orange rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-forge-orange/20">
            <Sparkles size={13} /> High-Growth Fixed Savings
          </div>
          <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 tracking-tight" suppressHydrationWarning>
            Welcome back, {isHydrated && user.name ? user.name.split(" ")[0] : "Member"}.
          </h1>
          <p className="font-medium text-forge-gray-600 mt-1">
            Here is your capital growth and accrued yields summary.
          </p>
        </div>
        <Link 
          href={ROUTES.app.plans} 
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-3 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] text-sm"
        >
          <PlusCircle size={18} /> Start Growth Plan
        </Link>
      </div>

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-forge-gray-50 flex items-center justify-center text-forge-gray-600">
              <Landmark size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">Total Portfolio Value</p>
          </div>
          <p className="tabular-nums font-display font-extrabold text-3xl text-forge-gray-900" suppressHydrationWarning>
            {isHydrated ? (
              formatCrypto(totalPortfolioValueCrypto, activeCurrency)
            ) : (
              <span className="inline-block w-36 h-8 bg-forge-gray-200 animate-pulse rounded-lg" />
            )}
          </p>
          <p className="text-xs font-medium text-forge-gray-500 mt-1">
            Liquid assets + active capital + yield
          </p>
        </div>

        {/* Accrued Profits */}
        <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm border-l-4 border-l-market-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-market-up/10 text-market-up flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">Contracted Profits</p>
          </div>
          <p className="tabular-nums font-display font-extrabold text-3xl text-market-up" suppressHydrationWarning>
            {isHydrated ? (
              `+${formatCrypto(totalAccruedProfitsCrypto, activeCurrency)}`
            ) : (
              <span className="inline-block w-28 h-8 bg-forge-gray-200 animate-pulse rounded-lg" />
            )}
          </p>
          <p className="text-xs font-medium text-forge-gray-500 mt-1">
            Guaranteed fixed interest returns
          </p>
        </div>

        {/* Locked Capital */}
        <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-forge-orange-wash text-forge-orange flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">Active Locked Capital</p>
          </div>
          <p className="tabular-nums font-display font-extrabold text-3xl text-forge-gray-900" suppressHydrationWarning>
            {isHydrated ? (
              formatCrypto(totalActiveCapitalCrypto, activeCurrency)
            ) : (
              <span className="inline-block w-32 h-8 bg-forge-gray-200 animate-pulse rounded-lg" />
            )}
          </p>
          <p className="text-xs font-medium text-forge-gray-500 mt-1" suppressHydrationWarning>
            {isHydrated ? activePlans.length : 0} active compounding plan{(isHydrated ? activePlans.length : 0) === 1 ? "" : "s"}
          </p>
        </div>

        {/* Available Cash / Liquid */}
        <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-forge-gray-50 flex items-center justify-center text-forge-gray-600">
              <Wallet size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">Available Liquid Wallet</p>
          </div>
          <p className="tabular-nums font-display font-extrabold text-3xl text-forge-gray-900" suppressHydrationWarning>
            {isHydrated ? (
              formatCrypto(availableCrypto, activeCurrency)
            ) : (
              <span className="inline-block w-28 h-8 bg-forge-gray-200 animate-pulse rounded-lg" />
            )}
          </p>
          <p className="text-xs font-medium text-forge-gray-500 mt-1">
            Ready to commit or withdraw
          </p>
        </div>
      </div>

      {/* ── Middle Section: Active Plans Spotlight & Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Active Plans Spotlight (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-forge-gray-900">
              Active Savings Plans
            </h2>
            <Link 
              href={ROUTES.app.portfolio} 
              className="text-xs font-bold text-forge-orange hover:text-forge-orange-hover flex items-center gap-1"
            >
              View all plans <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {!isHydrated ? (
              <div className="clean-card bg-white p-5 rounded-2xl border border-forge-gray-200 animate-pulse space-y-3">
                <div className="h-5 bg-forge-gray-200 rounded w-1/3" />
                <div className="h-4 bg-forge-gray-100 rounded w-1/2" />
              </div>
            ) : savingsPlans.length === 0 ? (
              <div className="clean-card bg-white p-8 rounded-2xl border border-forge-gray-200 text-center">
                <p className="text-sm text-forge-gray-500 font-medium mb-3">No active growth plans yet.</p>
                <Link 
                  href={ROUTES.app.plans}
                  className="px-4 py-2 bg-forge-orange text-white text-xs font-bold rounded-lg hover:bg-forge-orange-hover"
                >
                  Start First Plan
                </Link>
              </div>
            ) : (
              savingsPlans.slice(0, 3).map((plan) => (
                <div 
                  key={plan.id}
                  className="clean-card bg-white p-5 rounded-2xl border border-forge-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-forge-orange/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-forge-gray-900">
                        {plan.durationMonths}-Month Fixed Growth
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        plan.status === 'MATURED'
                          ? 'bg-market-up/10 text-market-up border border-market-up/20'
                          : plan.status === 'ACTIVE'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-forge-gray-100 text-forge-gray-500'
                      }`}>
                        {plan.status === 'MATURED' ? 'Matured - Ready' : plan.status === 'ACTIVE' ? `Accruing (+${plan.interestRatePercent}%)` : 'Disbursed'}
                      </span>
                    </div>
                    <p className="text-xs text-forge-gray-500" suppressHydrationWarning>
                      Matures: {new Date(plan.maturityDate).toLocaleDateString()} • Principal: {formatCrypto(convertFiatToCrypto(plan.capital, plan.currency, liveRates), plan.currency)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-forge-gray-400">
                        Total Payout
                      </span>
                      <span className="font-display font-extrabold text-base text-forge-orange tabular-nums" suppressHydrationWarning>
                        {formatCrypto(convertFiatToCrypto(plan.totalPayout, plan.currency, liveRates), plan.currency)}
                      </span>
                    </div>

                    <Link 
                      href={ROUTES.app.portfolio}
                      className="text-xs font-bold px-3.5 py-2 bg-forge-gray-100 hover:bg-forge-gray-200 text-forge-gray-800 rounded-lg transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="pt-4">
            <h3 className="font-display font-bold text-lg text-forge-gray-900 mb-3">
              Platform Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href={ROUTES.app.plans} 
                className="clean-card-hover bg-white p-5 rounded-2xl border border-forge-gray-200 flex items-start gap-4 text-left group"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-forge-orange text-white flex items-center justify-center shadow-[0_4px_14px_rgba(255,90,0,0.25)]">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-forge-gray-900 group-hover:text-forge-orange transition-colors">Start Growth Plan</h4>
                  <p className="text-xs font-medium text-forge-gray-600 mt-1">Lock capital from 1 to 12 months for up to +1200% returns.</p>
                </div>
              </Link>

              <button 
                onClick={() => setDepositModalOpen(true)} 
                className="clean-card-hover bg-white p-5 rounded-2xl border border-forge-gray-200 flex items-start gap-4 text-left group"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-forge-gray-100 text-forge-gray-700 flex items-center justify-center group-hover:bg-forge-orange group-hover:text-white transition-colors">
                  <Wallet size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-forge-gray-900 group-hover:text-forge-orange transition-colors">Deposit Capital</h4>
                  <p className="text-xs font-medium text-forge-gray-600 mt-1">Add USD, GBP, BTC, ETH, or SOL to your wallet balance.</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity Stream (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-forge-gray-900">
              Recent Activity
            </h2>
            <Link 
              href={ROUTES.app.wallet.transactions} 
              className="text-xs font-bold text-forge-gray-500 hover:text-forge-gray-800"
            >
              History
            </Link>
          </div>

          <div className="clean-card bg-white p-0 rounded-2xl border border-forge-gray-200 overflow-hidden shadow-sm">
            {!isHydrated ? (
              <div className="p-8 text-center text-forge-gray-400 text-sm font-medium animate-pulse">
                Loading activity...
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-forge-gray-500 text-sm font-medium">
                No recent activity.
              </div>
            ) : (
              <div className="divide-y divide-forge-gray-100">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="p-4 flex items-start gap-3 hover:bg-forge-gray-50/50 transition-colors">
                    <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${
                      tx.type === 'DEPOSIT' || tx.type === 'PLAN_PAYOUT'
                        ? 'bg-market-up/10 text-market-up'
                        : 'bg-forge-orange-wash text-forge-orange'
                    }`}>
                      {tx.type === 'DEPOSIT' || tx.type === 'PLAN_PAYOUT' ? (
                        <ArrowDownRight size={16} strokeWidth={2.5} />
                      ) : (
                        <ArrowUpRight size={16} strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-forge-gray-900 truncate">{tx.description}</p>
                      <p className="text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider flex items-center gap-1 mt-0.5" suppressHydrationWarning>
                        <Clock size={10} /> {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`tabular-nums text-xs font-bold ${
                        tx.amount > 0 ? 'text-market-up' : 'text-forge-gray-900'
                      }`} suppressHydrationWarning>
                        {tx.amount > 0 ? '+' : ''}{formatCrypto(Math.abs(tx.amount), tx.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
