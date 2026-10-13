"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Calendar, 
  Lock, 
  Percent, 
  AlertCircle, 
  X, 
  ArrowDownToLine 
} from "lucide-react";
import { useStore } from "@/lib/store";
import { 
  PLAN_CONFIG, 
  PlanDurationMonths, 
  convertFiatToCrypto, 
  convertCryptoToFiat, 
  formatCrypto, 
  formatFiat 
} from "@/lib/format";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { useHydration } from "@/lib/useHydration";
import { createClient } from "@/lib/supabase/client";

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000];

export default function PlansPage() {
  const isHydrated = useHydration();
  const { 
    activeCurrency, 
    getBalance, 
    liveRates, 
    createPlan,
    setDepositModalOpen 
  } = useStore();

  const [selectedDuration, setSelectedDuration] = useState<PlanDurationMonths>(3);
  const [capitalUsd, setCapitalUsd] = useState<number>(500);
  const [customInput, setCustomInput] = useState<string>("500");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  // Convert capital to active currency amount
  const capitalInActiveCurrency = convertFiatToCrypto(capitalUsd, activeCurrency, liveRates);
  const availableInActiveCurrency = getBalance(activeCurrency);

  // Selected plan calculation
  const planInfo = PLAN_CONFIG[selectedDuration];
  const profitUsd = capitalUsd * (planInfo.ratePercent / 100);
  const payoutUsd = capitalUsd + profitUsd;

  const profitInActiveCurrency = convertFiatToCrypto(profitUsd, activeCurrency, liveRates);
  const payoutInActiveCurrency = convertFiatToCrypto(payoutUsd, activeCurrency, liveRates);

  const handleAmountChange = (amount: number) => {
    setCapitalUsd(amount);
    setCustomInput(amount.toString());
  };

  const handleCustomChange = (val: string) => {
    setCustomInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCapitalUsd(num);
    }
  };

  const handleStartPlan = async () => {
    if (capitalUsd < 50) return;
    if (capitalInActiveCurrency > availableInActiveCurrency) {
      setShowInsufficientModal(true);
      return;
    }
    const success = createPlan(capitalInActiveCurrency, activeCurrency, selectedDuration);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);

      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const config = PLAN_CONFIG[selectedDuration];
          const projectedProfitUsd = (capitalUsd * config.ratePercent) / 100;
          const totalPayoutUsd = capitalUsd + projectedProfitUsd;
          const now = new Date();
          const maturity = new Date(now);
          maturity.setMonth(maturity.getMonth() + config.months);

          await supabase
            .from("savings_plans")
            .insert({
              user_id: authUser.id,
              capital: capitalUsd,
              currency: activeCurrency,
              duration_months: config.months,
              interest_rate_percent: config.ratePercent,
              projected_profit: projectedProfitUsd,
              total_payout: totalPayoutUsd,
              start_date: now.toISOString(),
              maturity_date: maturity.toISOString(),
              is_matured: false,
              status: "ACTIVE",
            });

          const newBal = useStore.getState().baseBalanceUSD || 0;
          await supabase
            .from("profiles")
            .update({ base_balance_usd: newBal })
            .eq("id", authUser.id);
        }
      } catch (err) {
        console.error("Failed to sync created plan to Supabase:", err);
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto pb-16">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-forge-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-forge-orange-wash text-forge-orange rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-forge-orange/20">
            <Sparkles size={14} /> Guaranteed Growth & Compound Yield
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-forge-gray-900 tracking-tight">
            Fixed-Term Capital Growth Plans
          </h1>
          <p className="font-medium text-forge-gray-600 mt-2 max-w-2xl text-sm sm:text-base">
            Disciplined wealth accumulation. Lock your capital in USD, GBP, or digital assets (BTC, ETH, SOL) with transparent fixed returns and automated maturity disbursement.
          </p>
        </div>
        
        <Link 
          href={ROUTES.app.portfolio}
          className="self-start md:self-auto px-4 py-2.5 bg-forge-gray-100 hover:bg-forge-gray-200 text-forge-gray-800 rounded-lg text-sm font-bold transition-colors shrink-0"
        >
          View Active Portfolio →
        </Link>
      </div>

      {/* ── Interactive Plan Builder ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Select Duration & Capital (8 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Duration Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-forge-gray-600 flex items-center gap-1.5">
                <Clock size={14} className="text-forge-orange" /> 1. Select Commitment Duration
              </label>
              <span className="text-xs font-bold text-forge-orange">Higher term = Higher yield</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.values(PLAN_CONFIG) as (typeof PLAN_CONFIG)[PlanDurationMonths][]).map((plan) => {
                const isSelected = selectedDuration === plan.months;
                return (
                  <button
                    key={plan.months}
                    onClick={() => setSelectedDuration(plan.months)}
                    className={`p-4 rounded-xl text-left border-2 transition-all relative overflow-hidden ${
                      isSelected
                        ? "border-forge-orange bg-forge-orange-wash shadow-sm"
                        : "border-forge-gray-200 bg-white hover:border-forge-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-forge-gray-900 text-sm">{plan.label}</span>
                      {isSelected && (
                        <CheckCircle2 size={16} className="text-forge-orange shrink-0" />
                      )}
                    </div>
                    <div className="font-display font-extrabold text-2xl text-forge-orange mt-2">
                      +{plan.ratePercent}%
                    </div>
                    <p className="text-[11px] font-medium text-forge-gray-500 mt-1">Guaranteed Return</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Capital Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-forge-gray-600 flex items-center gap-1.5">
                <Percent size={14} className="text-forge-orange" /> 2. Choose Starting Capital
              </label>
              <span className="text-xs font-medium text-forge-gray-500">Min $50.00 USD</span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAmountChange(amt)}
                  className={`py-3 px-2 rounded-lg font-bold text-sm text-center border transition-all ${
                    capitalUsd === amt
                      ? "bg-forge-gray-900 text-white border-forge-gray-900 shadow-sm"
                      : "bg-white text-forge-gray-700 border-forge-gray-200 hover:border-forge-orange"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-bold text-forge-gray-500 text-lg">
                $
              </span>
              <input
                type="number"
                min="50"
                step="10"
                value={customInput}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder="Custom Amount (Min $50)"
                className="w-full bg-white border border-forge-gray-200 rounded-xl pl-9 pr-24 py-4 text-xl font-bold font-display text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-all"
              />
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-forge-gray-400 uppercase tracking-wider">
                USD Base
              </span>
            </div>

            {/* Equivalent in active currency */}
            <div className="mt-3 flex items-center justify-between text-xs font-medium text-forge-gray-500">
              <span>
                Equal to: <strong className="text-forge-gray-900 tabular-nums" suppressHydrationWarning>{isHydrated ? formatCrypto(capitalInActiveCurrency, activeCurrency) : "..."}</strong>
              </span>
              <span>
                Wallet Balance: <strong className="text-forge-gray-900 tabular-nums" suppressHydrationWarning>{isHydrated ? formatCrypto(availableInActiveCurrency, activeCurrency) : "..."}</strong>
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Projected Payout Summary Card (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="clean-card bg-white p-6 sm:p-8 rounded-2xl border border-forge-gray-200 shadow-lg sticky top-24 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">
                  Plan Summary
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-market-up/10 text-market-up border border-market-up/20">
                  Fixed Rate
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl text-forge-gray-900 mt-1">
                {planInfo.label} Growth Plan
              </h2>
            </div>

            <div className="space-y-4 py-4 border-y border-forge-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-forge-gray-600 font-medium">Principal Capital</span>
                <span className="font-bold text-forge-gray-900 tabular-nums" suppressHydrationWarning>
                  {isHydrated ? `${formatCrypto(capitalInActiveCurrency, activeCurrency)} (${formatFiat(capitalUsd)})` : "..."}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-forge-gray-600 font-medium">Guaranteed Yield</span>
                <span className="font-bold text-market-up tabular-nums">
                  +{planInfo.ratePercent}%
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-forge-gray-600 font-medium">Accrued Interest Profit</span>
                <span className="font-bold text-market-up tabular-nums" suppressHydrationWarning>
                  {isHydrated ? `+${formatCrypto(profitInActiveCurrency, activeCurrency)} (+${formatFiat(profitUsd)})` : "..."}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-forge-gray-600 font-medium">Commitment Period</span>
                <span className="font-bold text-forge-gray-900">
                  {planInfo.months} Month{planInfo.months > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Total Maturity Payout Highlight */}
            <div className="bg-forge-orange-wash rounded-xl p-4 border border-forge-orange/20">
              <span className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-1">
                Total Matured Payout
              </span>
              <div className="font-display font-extrabold text-3xl text-forge-orange tabular-nums" suppressHydrationWarning>
                {isHydrated ? formatCrypto(payoutInActiveCurrency, activeCurrency) : "..."}
              </div>
              <p className="text-xs font-medium text-forge-gray-600 mt-1" suppressHydrationWarning>
                ≈ {formatFiat(payoutUsd)} USD returned upon maturity
              </p>
            </div>

            {/* CTA Button */}
            {isSuccess ? (
              <div className="p-4 rounded-xl bg-market-up/10 text-market-up border border-market-up/20 text-center font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                Plan Successfully Activated!
              </div>
            ) : (
              <button
                onClick={handleStartPlan}
                disabled={capitalUsd < 50}
                className="w-full py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
              >
                <span>Start Savings Plan</span>
                <ArrowRight size={18} />
              </button>
            )}

            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-forge-gray-500">
              <Lock size={12} className="text-market-up" />
              Capital preservation locked until maturity
            </div>
          </div>
        </div>

      </div>

      {/* ── The Return Matrix Reference Table ── */}
      <div className="clean-card bg-white p-6 sm:p-8 rounded-2xl border border-forge-gray-200 shadow-sm mt-12">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-forge-orange">
            Compounding Matrix
          </span>
          <h3 className="font-display font-extrabold text-2xl text-forge-gray-900 mt-1">
            Standard Tier Return Reference
          </h3>
          <p className="text-sm font-medium text-forge-gray-600 mt-1">
            Compare growth projections across capital presets and commitment horizons.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-forge-gray-200 text-xs font-bold uppercase tracking-wider text-forge-gray-500 bg-forge-gray-50/50">
                <th className="py-4 px-4">Starting Capital</th>
                <th className="py-4 px-4">1 Month (+6%)</th>
                <th className="py-4 px-4">2 Months (+15%)</th>
                <th className="py-4 px-4">3 Months (+27%)</th>
                <th className="py-4 px-4">6 Months (+66%)</th>
                <th className="py-4 px-4">12 Months (+162%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-gray-100 font-medium">
              {[
                { start: 50, m1: 53.00, p1: 3, m2: 57.50, p2: 7.50, m3: 63.50, p3: 13.50, m6: 83.00, p6: 33, m12: 131.00, p12: 81 },
                { start: 100, m1: 106.00, p1: 6, m2: 115.00, p2: 15, m3: 127.00, p3: 27, m6: 166.00, p6: 66, m12: 262.00, p12: 162 },
                { start: 250, m1: 265.00, p1: 15, m2: 287.50, p2: 37.50, m3: 317.50, p3: 67.50, m6: 415.00, p6: 165, m12: 655.00, p12: 405 },
                { start: 500, m1: 530.00, p1: 30, m2: 575.00, p2: 75, m3: 635.00, p3: 135, m6: 830.00, p6: 330, m12: 1310.00, p12: 810 },
                { start: 1000, m1: 1060.00, p1: 60, m2: 1150.00, p2: 150, m3: 1270.00, p3: 270, m6: 1660.00, p6: 660, m12: 2620.00, p12: 1620 },
              ].map((row) => (
                <tr key={row.start} className="hover:bg-forge-gray-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-forge-gray-900 tabular-nums">
                    ${row.start.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 tabular-nums">
                    <span className="font-bold text-forge-gray-900">${row.m1.toFixed(2)}</span>{" "}
                    <span className="text-xs text-market-up font-bold">(+${row.p1})</span>
                  </td>
                  <td className="py-4 px-4 tabular-nums">
                    <span className="font-bold text-forge-gray-900">${row.m2.toFixed(2)}</span>{" "}
                    <span className="text-xs text-market-up font-bold">(+${row.p2})</span>
                  </td>
                  <td className="py-4 px-4 tabular-nums">
                    <span className="font-bold text-forge-gray-900">${row.m3.toFixed(2)}</span>{" "}
                    <span className="text-xs text-market-up font-bold">(+${row.p3})</span>
                  </td>
                  <td className="py-4 px-4 tabular-nums">
                    <span className="font-bold text-forge-gray-900">${row.m6.toFixed(2)}</span>{" "}
                    <span className="text-xs text-market-up font-bold">(+${row.p6})</span>
                  </td>
                  <td className="py-4 px-4 tabular-nums">
                    <span className="font-bold text-forge-gray-900">${row.m12.toFixed(2)}</span>{" "}
                    <span className="text-xs text-market-up font-bold">(+${row.p12})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Strategy & Capital Protection Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="clean-card bg-white p-6 sm:p-8 rounded-2xl border border-forge-gray-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-forge-orange-wash text-forge-orange flex items-center justify-center border border-forge-orange/20">
            <TrendingUp size={24} />
          </div>
          <h4 className="font-display font-bold text-xl text-forge-gray-900">
            Strategy Overview
          </h4>
          <p className="text-sm font-medium text-forge-gray-600 leading-relaxed">
            High probability capital allocation backed by algorithmic liquidity management and disciplined compounding. We focus exclusively on risk-adjusted capital appreciation to guarantee contracted yields upon maturity.
          </p>
        </div>

        <div className="clean-card bg-white p-6 sm:p-8 rounded-2xl border border-forge-gray-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-market-up/10 text-market-up flex items-center justify-center border border-market-up/20">
            <ShieldCheck size={24} />
          </div>
          <h4 className="font-display font-bold text-xl text-forge-gray-900">
            Capital Protection
          </h4>
          <p className="text-sm font-medium text-forge-gray-600 leading-relaxed">
            Capital preservation is our highest institutional priority. All commitments feature automated maturity locking, strict reserve backing, and zero hidden maintenance or custody deductions.
          </p>
        </div>
      </div>

      {/* ── Insufficient Funds Modal ── */}
      {showInsufficientModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-forge-gray-100">
            <div className="px-6 py-4 border-b border-forge-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-400">Account Balance Notice</span>
              <button 
                onClick={() => setShowInsufficientModal(false)}
                className="text-forge-gray-400 hover:text-forge-gray-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-forge-orange-wash text-forge-orange flex items-center justify-center border border-forge-orange/20">
                <AlertCircle size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-forge-gray-900">
                  Account Funding Required
                </h3>
                <p className="text-sm font-medium text-forge-gray-600 leading-relaxed px-2">
                  You need <strong className="text-forge-gray-900">{formatCrypto(capitalInActiveCurrency, activeCurrency)}</strong> ({formatFiat(capitalUsd)}) to activate this <strong className="text-forge-gray-900">{planInfo.label} Growth Plan</strong>, but your available balance is <strong className="text-forge-gray-900">{formatCrypto(availableInActiveCurrency, activeCurrency)}</strong>.
                </p>
              </div>

              <div className="bg-forge-gray-50 rounded-xl p-4 border border-forge-gray-200 text-left text-xs space-y-2 font-medium">
                <div className="flex justify-between">
                  <span className="text-forge-gray-500">Plan:</span>
                  <span className="font-bold text-forge-gray-900">{planInfo.label} (+{planInfo.ratePercent}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forge-gray-500">Required Capital:</span>
                  <span className="font-bold text-forge-gray-900">{formatCrypto(capitalInActiveCurrency, activeCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forge-gray-500">Available Balance:</span>
                  <span className="font-bold text-forge-gray-900">{formatCrypto(availableInActiveCurrency, activeCurrency)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-forge-gray-200">
                  <span className="text-forge-gray-500">Shortfall to Fund:</span>
                  <span className="font-bold text-forge-orange">
                    {formatCrypto(Math.max(0, capitalInActiveCurrency - availableInActiveCurrency), activeCurrency)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInsufficientModal(false);
                    setDepositModalOpen(true);
                  }}
                  className="w-full py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] flex items-center justify-center gap-2 text-base"
                >
                  <ArrowDownToLine size={18} />
                  <span>Deposit Funds Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInsufficientModal(false)}
                  className="w-full py-2.5 text-xs font-bold text-forge-gray-500 hover:text-forge-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
