"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Percent,
  Wallet,
  ArrowUpRight,
  HelpCircle,
  Coins
} from "lucide-react";
import { 
  CurrencyType, 
  PlanDurationMonths, 
  PLAN_CONFIG, 
  DEFAULT_RATES, 
  convertFiatToCrypto, 
  formatCrypto, 
  formatFiat 
} from "@/lib/format";
import { ROUTES } from "@/lib/routes";

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000];

const MATRIX_ROWS = [
  { start: 50, m1: 100, p1: 50, m2: 150, p2: 100, m3: 200, p3: 150, m6: 350, p6: 300, m12: 650, p12: 600 },
  { start: 100, m1: 200, p1: 100, m2: 300, p2: 200, m3: 400, p3: 300, m6: 700, p6: 600, m12: 1300, p12: 1200 },
  { start: 250, m1: 500, p1: 250, m2: 750, p2: 500, m3: 1000, p3: 750, m6: 1750, p6: 1500, m12: 3250, p12: 3000 },
  { start: 500, m1: 1000, p1: 500, m2: 1500, p2: 1000, m3: 2000, p3: 1500, m6: 3500, p6: 3000, m12: 6500, p12: 6000 },
  { start: 1000, m1: 2000, p1: 1000, m2: 3000, p2: 2000, m3: 4000, p3: 3000, m6: 7000, p6: 6000, m12: 13000, p12: 12000 },
];

export default function MarketingHomePage() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>("USD");
  const [selectedDuration, setSelectedDuration] = useState<PlanDurationMonths>(3);
  const [capitalUsd, setCapitalUsd] = useState<number>(500);
  const [customInput, setCustomInput] = useState<string>("500");

  const planInfo = PLAN_CONFIG[selectedDuration];
  const profitUsd = capitalUsd * (planInfo.ratePercent / 100);
  const payoutUsd = capitalUsd + profitUsd;

  const capitalInCurr = convertFiatToCrypto(capitalUsd, selectedCurrency, DEFAULT_RATES);
  const profitInCurr = convertFiatToCrypto(profitUsd, selectedCurrency, DEFAULT_RATES);
  const payoutInCurr = convertFiatToCrypto(payoutUsd, selectedCurrency, DEFAULT_RATES);

  const handleAmountSelect = (amt: number) => {
    setCapitalUsd(amt);
    setCustomInput(amt.toString());
  };

  const handleCustomInput = (val: string) => {
    setCustomInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCapitalUsd(num);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-forge-gray-50">
      
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-white border-b border-forge-gray-200">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_right,rgba(255,90,0,0.12),transparent_50%)]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forge-orange-wash border border-forge-orange/20 text-forge-orange text-xs font-bold uppercase tracking-wider mb-8">
            <Sparkles size={14} /> Fixed-Term Growth & Guaranteed Compound Yield
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-forge-gray-900 tracking-tight leading-[1.08] max-w-4xl mx-auto uppercase">
            Turn Small Capital into <span className="text-forge-orange">Significant Wealth</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl font-medium text-forge-gray-600 max-w-2xl mx-auto leading-relaxed">
            Disciplined Capital Growth & Fixed Savings. Lock USD, GBP, BTC, ETH, or SOL and earn guaranteed returns from +100% to +1200%.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href={ROUTES.auth.register} 
              className="w-full sm:w-auto px-8 py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-all shadow-[0_4px_14px_rgba(255,90,0,0.25)] flex items-center justify-center gap-2 text-base group"
            >
              View Growth Plans
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a 
              href="#calculator" 
              className="w-full sm:w-auto px-8 py-4 bg-forge-gray-50 border border-forge-gray-200 text-forge-gray-900 font-bold rounded-xl hover:bg-forge-gray-100 transition-colors flex items-center justify-center gap-2 text-base"
            >
              Calculate Returns
            </a>
          </div>

          {/* Key Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-forge-gray-100 text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-forge-gray-400">Min. Commitment</p>
              <p className="font-display font-extrabold text-2xl text-forge-gray-900 mt-0.5">$50.00 USD</p>
              <p className="text-xs text-forge-gray-500 mt-0.5">Accessible to all earners</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-forge-gray-400">Yield Range</p>
              <p className="font-display font-extrabold text-2xl text-market-up mt-0.5">+100% to +1200%</p>
              <p className="text-xs text-forge-gray-500 mt-0.5">Fixed contracted rates</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-forge-gray-400">Term Horizons</p>
              <p className="font-display font-extrabold text-2xl text-forge-gray-900 mt-0.5">1 to 12 Mos</p>
              <p className="text-xs text-forge-gray-500 mt-0.5">Automated maturity lock</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-forge-gray-400">Asset Support</p>
              <p className="font-display font-extrabold text-2xl text-forge-gray-900 mt-0.5">Fiat & Crypto</p>
              <p className="text-xs text-forge-gray-500 mt-0.5">USD, GBP, BTC, ETH, SOL</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Interactive Growth Calculator Section ──────────────────────── */}
      <section id="calculator" className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-forge-orange">
            Interactive Calculator
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forge-gray-900 mt-2">
            Calculate Your Guaranteed Wealth Growth
          </h2>
          <p className="text-forge-gray-600 font-medium mt-3 text-sm sm:text-base">
            Select a capital tier, duration period, and preferred asset to simulate your compounding return.
          </p>

          {/* Currency Switcher */}
          <div className="mt-6 inline-flex p-1 bg-white border border-forge-gray-200 rounded-xl shadow-sm">
            {(["USD", "GBP", "BTC", "ETH", "SOL"] as CurrencyType[]).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCurrency(c)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCurrency === c
                    ? "bg-forge-orange text-white shadow-sm"
                    : "text-forge-gray-600 hover:text-forge-gray-900"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 clean-card bg-white p-6 sm:p-8 rounded-2xl border border-forge-gray-200 shadow-sm space-y-8">
            {/* 1. Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-500 mb-3">
                1. Select Growth Horizon
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.values(PLAN_CONFIG) as (typeof PLAN_CONFIG)[PlanDurationMonths][]).map((p) => {
                  const active = selectedDuration === p.months;
                  return (
                    <button
                      key={p.months}
                      onClick={() => setSelectedDuration(p.months)}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        active
                          ? "border-forge-orange bg-forge-orange-wash shadow-sm"
                          : "border-forge-gray-200 hover:border-forge-gray-300"
                      }`}
                    >
                      <span className="block font-bold text-sm text-forge-gray-900">{p.label}</span>
                      <span className="font-display font-extrabold text-2xl text-forge-orange mt-2 block">
                        +{p.ratePercent}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Capital Presets & Input */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">
                  2. Select Starting Capital (USD Base)
                </label>
                <span className="text-xs font-medium text-forge-gray-400">Min $50.00</span>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleAmountSelect(amt)}
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

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-bold text-forge-gray-500 text-lg">
                  $
                </span>
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={customInput}
                  onChange={(e) => handleCustomInput(e.target.value)}
                  placeholder="Custom Capital (Min $50)"
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl pl-9 pr-24 py-4 text-xl font-bold font-display text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white transition-all"
                />
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-forge-gray-400 uppercase tracking-wider">
                  USD
                </span>
              </div>
            </div>
          </div>

          {/* Result Card (5 Cols) */}
          <div className="lg:col-span-5 clean-card bg-white p-6 sm:p-8 rounded-2xl border border-forge-gray-200 shadow-lg space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forge-orange">
                Simulated Projection
              </span>
              <h3 className="font-display font-extrabold text-2xl text-forge-gray-900 mt-1">
                {planInfo.label} Growth Plan
              </h3>
            </div>

            <div className="space-y-4 py-4 border-y border-forge-gray-100 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-forge-gray-600 font-medium">Starting Principal</span>
                <span className="font-bold text-forge-gray-900 tabular-nums">
                  {formatCrypto(capitalInCurr, selectedCurrency)} ({formatFiat(capitalUsd)})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-forge-gray-600 font-medium">Contract Rate</span>
                <span className="font-bold text-market-up tabular-nums">
                  +{planInfo.ratePercent}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-forge-gray-600 font-medium">Accrued Net Profit</span>
                <span className="font-bold text-market-up tabular-nums">
                  +{formatCrypto(profitInCurr, selectedCurrency)} (+{formatFiat(profitUsd)})
                </span>
              </div>
            </div>

            <div className="bg-forge-orange-wash rounded-xl p-5 border border-forge-orange/20 text-center">
              <span className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-1">
                Total Maturity Payout
              </span>
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-forge-orange tabular-nums">
                {formatCrypto(payoutInCurr, selectedCurrency)}
              </div>
              <p className="text-xs font-medium text-forge-gray-600 mt-1">
                ≈ {formatFiat(payoutUsd)} returned in full upon duration completion
              </p>
            </div>

            <Link
              href={ROUTES.auth.register}
              className="w-full py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] flex items-center justify-center gap-2 text-base"
            >
              Start This Plan Now
              <ArrowRight size={18} />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-forge-gray-500">
              <Lock size={12} className="text-market-up" />
              Guaranteed capital & payout disbursement
            </div>
          </div>

        </div>

        {/* ── Flyer Return Matrix Reference Table ── */}
        <div className="clean-card bg-white p-6 sm:p-8 rounded-2xl border border-forge-gray-200 shadow-sm mt-12">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-forge-orange">
              Official Reference Table
            </span>
            <h3 className="font-display font-extrabold text-2xl text-forge-gray-900 mt-1">
              Standard Return Matrix
            </h3>
            <p className="text-sm font-medium text-forge-gray-600 mt-1">
              Guaranteed payouts and profit accrual across all preset capital tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-forge-gray-200 text-xs font-bold uppercase tracking-wider text-forge-gray-500 bg-forge-gray-50/50">
                  <th className="py-4 px-4">Starting Capital</th>
                  <th className="py-4 px-4">1 Month (+100%)</th>
                  <th className="py-4 px-4">2 Months (+200%)</th>
                  <th className="py-4 px-4">3 Months (+300%)</th>
                  <th className="py-4 px-4">6 Months (+600%)</th>
                  <th className="py-4 px-4">12 Months (+1200%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forge-gray-100 font-medium">
                {MATRIX_ROWS.map((row) => (
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

      </section>

      {/* ── Strategy Overview & Capital Protection Cards ───────────────── */}
      <section className="py-16 bg-white border-y border-forge-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Strategy Overview */}
            <div className="clean-card bg-forge-gray-50 p-8 rounded-2xl border border-forge-gray-200 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-forge-orange text-white flex items-center justify-center shadow-[0_4px_14px_rgba(255,90,0,0.25)]">
                <TrendingUp size={28} />
              </div>
              <h3 className="font-display font-bold text-2xl text-forge-gray-900">
                Strategy Overview
              </h3>
              <p className="text-sm font-medium text-forge-gray-600 leading-relaxed">
                High probability capital allocation, automated liquidity, strict compounding. We deploy disciplined quantitative frameworks designed to insulate principal while generating continuous, predictable yields.
              </p>
              <ul className="space-y-2 pt-2 text-xs font-semibold text-forge-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-market-up shrink-0" />
                  Algorithmic liquidity allocation across collateralized pools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-market-up shrink-0" />
                  Strict compounding math verified prior to contract activation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-market-up shrink-0" />
                  Predictable payout schedules with zero market volatility exposure
                </li>
              </ul>
            </div>

            {/* Card 2: Capital Protection */}
            <div className="clean-card bg-forge-gray-50 p-8 rounded-2xl border border-forge-gray-200 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-market-up text-white flex items-center justify-center shadow-sm">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-display font-bold text-2xl text-forge-gray-900">
                Capital Protection
              </h3>
              <p className="text-sm font-medium text-forge-gray-600 leading-relaxed">
                Capital preservation priority, automated maturity lock, zero hidden maintenance fees. Every dollar or cryptocurrency committed is held under non-speculative reserve backing.
              </p>
              <ul className="space-y-2 pt-2 text-xs font-semibold text-forge-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-market-up shrink-0" />
                  100% principal preservation priority enforced by system protocol
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-market-up shrink-0" />
                  Zero account maintenance, custody, or platform deduction fees
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-market-up shrink-0" />
                  Transparent disbursement with immediate withdrawal upon maturity
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-forge-orange">
            Simple 4-Step Process
          </span>
          <h2 className="font-display font-extrabold text-3xl text-forge-gray-900 mt-2">
            How Forge Capital Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Deposit Capital", desc: "Add USD, GBP, BTC, ETH, or SOL with as little as $50 starting funds.", icon: Wallet },
            { step: "02", title: "Select Growth Plan", desc: "Choose a duration from 1 to 12 months with fixed returns up to +1200%.", icon: Clock },
            { step: "03", title: "Accrue Interest", desc: "Your capital compounds automatically with guaranteed contractual yields.", icon: TrendingUp },
            { step: "04", title: "Withdraw Matured Funds", desc: "Disburse your principal plus interest directly to your external account.", icon: ArrowUpRight },
          ].map((item) => (
            <div key={item.step} className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 space-y-3">
              <span className="font-display font-extrabold text-3xl text-forge-orange/30">
                {item.step}
              </span>
              <h4 className="font-bold text-lg text-forge-gray-900">{item.title}</h4>
              <p className="text-xs font-medium text-forge-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom Call To Action ───────────────────────────────────────── */}
      <section className="py-20 bg-forge-gray-900 text-white border-t border-forge-gray-800 relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 bottom-0 w-96 h-96 bg-forge-orange/15 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight">
            Ready to Begin Your Wealth Accumulation Journey?
          </h2>
          <p className="text-forge-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            Open your Forge Capital account today with as little as $50.00 and lock in guaranteed compounding returns.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href={ROUTES.auth.register}
              className="px-10 py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] text-base inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
