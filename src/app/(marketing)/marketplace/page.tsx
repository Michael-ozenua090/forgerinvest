import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { PLAN_CONFIG, PlanDurationMonths } from '@/lib/format';
import { ROUTES } from '@/lib/routes';

export default function MarketplacePage() {
  const plans = Object.values(PLAN_CONFIG) as (typeof PLAN_CONFIG)[PlanDurationMonths][];

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-forge-orange-wash text-forge-orange rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-forge-orange/20">
          <Sparkles size={14} /> Fixed-Term Investment Plans
        </div>
        <h1 className="text-4xl font-extrabold text-forge-gray-900 tracking-tight font-display">
          Capital Accumulation Plans
        </h1>
        <p className="text-base text-forge-gray-600 mt-2">
          Contracted guaranteed compounding yields. Commit capital in USD, GBP, BTC, ETH, or SOL with automated maturity disbursements.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.months} 
            className="clean-card bg-white rounded-2xl p-6 border border-forge-gray-200 shadow-sm hover:shadow-md hover:border-forge-orange transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-500 flex items-center gap-1.5">
                  <Clock size={14} className="text-forge-orange" /> {plan.label} Horizon
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-market-up/10 text-market-up border border-market-up/20">
                  Guaranteed
                </span>
              </div>

              <div className="my-3">
                <div className="font-display font-extrabold text-4xl text-forge-orange tabular-nums">
                  +{plan.ratePercent}%
                </div>
                <p className="text-xs font-semibold text-forge-gray-500 mt-1">Contracted Fixed Return</p>
              </div>

              <div className="space-y-2 py-4 border-t border-forge-gray-100 text-xs text-forge-gray-600">
                <div className="flex justify-between">
                  <span>Minimum Capital:</span>
                  <strong className="text-forge-gray-900">$50.00 USD</strong>
                </div>
                <div className="flex justify-between">
                  <span>Payout Schedule:</span>
                  <strong className="text-forge-gray-900">At Duration Completion</strong>
                </div>
                <div className="flex justify-between">
                  <span>Supported Assets:</span>
                  <strong className="text-forge-gray-900">USD, GBP, BTC, ETH, SOL</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-forge-gray-100">
              <Link 
                href={ROUTES.auth.register} 
                className="w-full py-3 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
              >
                Select {plan.label} Plan
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}

        {/* Custom Tier Card */}
        <div className="clean-card bg-forge-gray-900 text-white rounded-2xl p-6 border border-forge-gray-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <TrendingUp size={14} className="text-forge-orange" /> Institutional
            </div>
            <h3 className="font-display font-extrabold text-2xl text-white mb-2">
              Custom Growth Allocation
            </h3>
            <p className="text-xs text-forge-gray-300 leading-relaxed mb-4">
              For capital commitments above $10,000 USD, custom multi-month compounding schedules with personalized liquidity terms are available.
            </p>
          </div>

          <Link 
            href={ROUTES.marketing.contact} 
            className="w-full py-3 bg-white text-forge-gray-900 font-bold rounded-xl hover:bg-forge-gray-100 transition-colors text-sm text-center"
          >
            Contact Private Client Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
