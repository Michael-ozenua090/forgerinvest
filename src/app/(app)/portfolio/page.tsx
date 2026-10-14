"use client";

import { useState } from "react";
import { 
  Briefcase, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpFromLine, 
  PlusCircle, 
  Calendar,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCrypto, formatFiat, convertFiatToCrypto } from "@/lib/format";
import { KycGateModal } from "@/components/KycGateModal";
import { ROUTES } from "@/lib/routes";
import { useHydration } from "@/lib/useHydration";

export default function PortfolioPage() {
  const isHydrated = useHydration();
  const { 
    savingsPlans, 
    activeCurrency, 
    liveRates, 
    isKycCompleted, 
    withdrawPlan,
    setToast 
  } = useStore();

  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "MATURED" | "WITHDRAWN">("ALL");
  const [showKycGate, setShowKycGate] = useState(false);

  // Compute portfolio stats in base USD
  const totalActiveCapitalUsd = savingsPlans
    .filter((p) => p.status === "ACTIVE")
    .reduce((sum, p) => sum + p.capital, 0);

  const totalProjectedProfitsUsd = savingsPlans
    .filter((p) => p.status === "ACTIVE" || p.status === "MATURED")
    .reduce((sum, p) => sum + p.projectedProfit, 0);

  const totalMaturedReadyUsd = savingsPlans
    .filter((p) => p.status === "MATURED")
    .reduce((sum, p) => sum + p.totalPayout, 0);

  const filteredPlans = savingsPlans.filter((p) => {
    if (filter === "ALL") return true;
    return p.status === filter;
  });

  const handleWithdrawMatured = async (planId: string) => {
    if (!isKycCompleted) {
      setShowKycGate(true);
      return;
    }

    const res = await withdrawPlan(planId);
    if (res.requiresKyc) {
      setShowKycGate(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-16">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forge-gray-200 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-forge-gray-900 tracking-tight">
            Investment Plans Portfolio
          </h1>
          <p className="font-medium text-forge-gray-600 mt-1">
            Track your active savings contracts, accrued yields, and matured capital distributions.
          </p>
        </div>

        <Link
          href={ROUTES.app.plans}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-3 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] text-sm"
        >
          <PlusCircle size={18} />
          Start New Plan
        </Link>
      </div>

      {/* ── Summary Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">
            Active Capital Locked
          </span>
          <div className="font-display font-extrabold text-3xl text-forge-gray-900 tabular-nums" suppressHydrationWarning>
            {isHydrated ? (
              formatCrypto(convertFiatToCrypto(totalActiveCapitalUsd, activeCurrency, liveRates), activeCurrency)
            ) : (
              <span className="inline-block w-28 h-8 bg-forge-gray-200 animate-pulse rounded-lg" />
            )}
          </div>
          <p className="text-xs font-medium text-forge-gray-500" suppressHydrationWarning>
            ≈ {formatFiat(totalActiveCapitalUsd)} USD active in plans
          </p>
        </div>

        <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">
            Total Accrued Profits
          </span>
          <div className="font-display font-extrabold text-3xl text-market-up tabular-nums" suppressHydrationWarning>
            {isHydrated ? (
              `+${formatCrypto(convertFiatToCrypto(totalProjectedProfitsUsd, activeCurrency, liveRates), activeCurrency)}`
            ) : (
              <span className="inline-block w-28 h-8 bg-forge-gray-200 animate-pulse rounded-lg" />
            )}
          </div>
          <p className="text-xs font-medium text-forge-gray-500" suppressHydrationWarning>
            ≈ +{formatFiat(totalProjectedProfitsUsd)} USD contracted profit
          </p>
        </div>

        <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">
            Matured (Ready to Claim)
          </span>
          <div className="font-display font-extrabold text-3xl text-forge-orange tabular-nums" suppressHydrationWarning>
            {isHydrated ? (
              formatCrypto(convertFiatToCrypto(totalMaturedReadyUsd, activeCurrency, liveRates), activeCurrency)
            ) : (
              <span className="inline-block w-28 h-8 bg-forge-gray-200 animate-pulse rounded-lg" />
            )}
          </div>
          <p className="text-xs font-medium text-forge-gray-500" suppressHydrationWarning>
            {isHydrated ? savingsPlans.filter((p) => p.status === "MATURED").length : 0} plan(s) available for payout
          </p>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 border-b border-forge-gray-200 pb-3">
        {(["ALL", "ACTIVE", "MATURED", "WITHDRAWN"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors ${
              filter === tab
                ? "bg-forge-gray-900 text-white shadow-sm"
                : "text-forge-gray-600 hover:bg-forge-gray-100"
            }`}
          >
            {tab === "ALL" ? "All Plans" : tab}
          </button>
        ))}
      </div>

      {/* ── Plans List ── */}
      {!isHydrated ? (
        <div className="clean-card bg-white p-12 rounded-2xl border border-forge-gray-200 animate-pulse text-center text-forge-gray-400 font-medium text-sm">
          Loading investment portfolio...
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="clean-card bg-white p-12 rounded-2xl border border-forge-gray-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-forge-gray-100 text-forge-gray-400 flex items-center justify-center mx-auto">
            <Briefcase size={28} />
          </div>
          <h3 className="font-display font-bold text-xl text-forge-gray-900">
            No Plans Found
          </h3>
          <p className="text-sm text-forge-gray-500 max-w-md mx-auto">
            You don't have any investment plans matching this filter. Start locking capital today to generate fixed compounded yields.
          </p>
          <Link
            href={ROUTES.app.plans}
            className="inline-flex items-center gap-2 px-6 py-3 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors text-sm shadow-sm"
          >
            Explore Investment Plans
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPlans.map((plan) => {
            const capitalInCurrency = convertFiatToCrypto(plan.capital, plan.currency, liveRates);
            const profitInCurrency = convertFiatToCrypto(plan.projectedProfit, plan.currency, liveRates);
            const payoutInCurrency = convertFiatToCrypto(plan.totalPayout, plan.currency, liveRates);

            return (
              <div
                key={plan.id}
                className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-forge-orange/40 transition-colors"
              >
                {/* Plan Info */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-extrabold text-lg text-forge-gray-900">
                      {plan.durationMonths}-Month Fixed Investment Plan
                    </span>
                    
                    {/* Status Badge */}
                    {plan.status === "ACTIVE" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Accruing (+{plan.interestRatePercent}%)
                      </span>
                    )}
                    {plan.status === "MATURED" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-market-up/10 text-market-up border border-market-up/20 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Matured - Ready for Withdrawal
                      </span>
                    )}
                    {plan.status === "WITHDRAWN" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-forge-gray-100 text-forge-gray-500 border border-forge-gray-200">
                        Disbursed
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-forge-gray-500">
                    <span className="flex items-center gap-1" suppressHydrationWarning>
                      <Calendar size={13} className="text-forge-gray-400" />
                      Started: {new Date(plan.startDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1" suppressHydrationWarning>
                      <Clock size={13} className="text-forge-gray-400" />
                      Maturity: {new Date(plan.maturityDate).toLocaleDateString()}
                    </span>
                    <span>Currency: <strong className="text-forge-gray-900">{plan.currency}</strong></span>
                  </div>
                </div>

                {/* Capital & Payout Stats */}
                <div className="flex flex-wrap items-center gap-8 lg:text-right">
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-forge-gray-400">
                      Capital Locked
                    </span>
                    <span className="font-display font-bold text-base text-forge-gray-900 tabular-nums">
                      {formatCrypto(capitalInCurrency, plan.currency)}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-forge-gray-400">
                      Contract Yield
                    </span>
                    <span className="font-display font-bold text-base text-market-up tabular-nums">
                      +{formatCrypto(profitInCurrency, plan.currency)} (+{plan.interestRatePercent}%)
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-forge-gray-400">
                      Total Payout
                    </span>
                    <span className="font-display font-extrabold text-lg text-forge-orange tabular-nums">
                      {formatCrypto(payoutInCurrency, plan.currency)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="min-w-[140px] flex justify-end">
                    {plan.status === "MATURED" ? (
                      <button
                        onClick={() => handleWithdrawMatured(plan.id)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-sm text-xs flex items-center justify-center gap-1.5"
                      >
                        <ArrowUpFromLine size={14} />
                        Withdraw Funds
                      </button>
                    ) : plan.status === "ACTIVE" ? (
                      <span className="text-xs font-semibold text-forge-gray-400 bg-forge-gray-50 px-3 py-2 rounded-lg border border-forge-gray-100">
                        Locked Until Maturity
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-market-up bg-market-up/5 px-3 py-2 rounded-lg">
                        Paid to Wallet
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ── Intentional KYC Gate Modal ── */}
      <KycGateModal
        isOpen={showKycGate}
        onClose={() => setShowKycGate(false)}
        title="Identity Verification Required"
        description="Before withdrawing your matured capital and interest profits, regulatory compliance requires you to complete KYC verification."
      />

    </div>
  );
}
