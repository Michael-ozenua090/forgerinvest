import Link from "next/link";
import { ArrowRight, Shield, Zap, Users, Landmark, TrendingUp } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto border-b border-forge-gray-100">
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-forge-gray-900 tracking-tight mb-6">
          About <span className="text-forge-orange">Forge</span>
        </h1>
        <p className="text-xl text-forge-gray-600 max-w-3xl leading-relaxed">
          Empowering individuals to turn small capital into significant wealth through disciplined, fixed-term savings and guaranteed compound yields.
        </p>
      </section>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 sm:px-10 max-w-4xl mx-auto space-y-20">
        
        {/* Mission */}
        <div>
          <h2 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-6">Our Mission</h2>
          <div className="prose prose-lg text-forge-gray-600 max-w-none space-y-6">
            <p>
              We are building the future of capital accumulation by combining algorithmic liquidity management with transparent, fixed-yield principles. Our platform democratizes access to institutional-grade growth plans with starting capital as accessible as $50.00 USD.
            </p>
            <p>
              From 1-month accelerated cycles to 12-month compounding horizons, we provide the infrastructure savers and investors need to protect principal and compound returns across fiat (USD, GBP) and major digital assets (BTC, ETH, SOL).
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
            <div className="clean-card p-6">
              <div className="w-10 h-10 rounded-xl bg-forge-orange-wash flex items-center justify-center text-forge-orange mb-4">
                <Landmark size={20} />
              </div>
              <h3 className="font-bold text-forge-gray-900 mb-2">Guaranteed Compounding</h3>
              <p className="text-sm font-medium text-forge-gray-600">Fixed contracted yields from +6% to +162% with automated maturity payouts.</p>
            </div>
            <div className="clean-card p-6">
              <div className="w-10 h-10 rounded-xl bg-forge-orange-wash flex items-center justify-center text-forge-orange mb-4">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-bold text-forge-gray-900 mb-2">Multi-Asset Growth</h3>
              <p className="text-sm font-medium text-forge-gray-600">Flexible funding and seamless execution across USD, GBP, BTC, ETH, and SOL.</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-6">Our Values</h2>
          <p className="text-lg text-forge-gray-600 mb-10">
            We're guided by principles that drive innovation, transparency, and user success in everything we do.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 rounded-full bg-forge-gray-50 border border-forge-gray-200 flex items-center justify-center text-forge-gray-900">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-forge-gray-900 mb-2">Capital Protection First</h3>
                <p className="text-forge-gray-600">Principal preservation is prioritized with automated lockups and zero hidden custody fees.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 rounded-full bg-forge-gray-50 border border-forge-gray-200 flex items-center justify-center text-forge-gray-900">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-forge-gray-900 mb-2">Disciplined Math</h3>
                <p className="text-forge-gray-600">Clear, predictable return matrices with no market volatility risk during your commitment term.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 rounded-full bg-forge-gray-50 border border-forge-gray-200 flex items-center justify-center text-forge-gray-900">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-forge-gray-900 mb-2">Accessible Growth</h3>
                <p className="text-forge-gray-600">Removing minimum barriers so anyone can start building wealth with as little as $50.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div>
          <h2 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-6">Leadership Team</h2>
          <p className="text-lg text-forge-gray-600 mb-10">
            Meet the visionaries behind our platform, bringing together decades of experience in finance, technology, and algorithmic wealth management.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="clean-card p-6 border-t-4 border-t-forge-orange">
              <h3 className="font-bold text-lg text-forge-gray-900">CEO & Founder</h3>
              <ul className="mt-4 space-y-2 text-sm text-forge-gray-600">
                <li>• Visionary leader with 15+ years in fintech</li>
                <li>• Former executive at leading investment platforms</li>
              </ul>
            </div>
            <div className="clean-card p-6 border-t-4 border-t-forge-gray-900">
              <h3 className="font-bold text-lg text-forge-gray-900">CTO</h3>
              <ul className="mt-4 space-y-2 text-sm text-forge-gray-600">
                <li>• Technology expert specializing in distributed systems</li>
                <li>• Built scalable systems for millions of users</li>
              </ul>
            </div>
            <div className="clean-card p-6 border-t-4 border-t-forge-gray-400">
              <h3 className="font-bold text-lg text-forge-gray-900">Head of Investments</h3>
              <ul className="mt-4 space-y-2 text-sm text-forge-gray-600">
                <li>• Portfolio management and strategy expert</li>
                <li>• 20+ years in institutional investment</li>
              </ul>
            </div>
          </div>
        </div>

      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-forge-gray-50 border-t border-forge-gray-200 py-24 px-6 sm:px-10 text-center">
        <h2 className="font-display font-extrabold text-4xl text-forge-gray-900 mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-forge-gray-600 max-w-2xl mx-auto mb-10">
          Join thousands of users who are already building their wealth and growing capital with Forge.
        </p>
        <Link 
          href={ROUTES.auth.register} 
          className="inline-flex items-center gap-2 bg-forge-orange text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)]"
        >
          Create an Account <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
