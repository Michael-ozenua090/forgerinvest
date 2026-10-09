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
          Revolutionizing the way people invest and trade in premium pre-IPO equity through our innovative all-in-one platform.
        </p>
      </section>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 sm:px-10 max-w-4xl mx-auto space-y-20">
        
        {/* Mission */}
        <div>
          <h2 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-6">Our Mission</h2>
          <div className="prose prose-lg text-forge-gray-600 max-w-none space-y-6">
            <p>
              We're building the future of private market investing by combining cutting-edge technology with traditional investment principles. Our platform democratizes access to premium pre-IPO investment opportunities.
            </p>
            <p>
              From direct secondary share trading to curated investment funds and seamless liquidity management, we provide everything you need to grow your wealth in the private markets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
            <div className="clean-card p-6">
              <div className="w-10 h-10 rounded-xl bg-forge-orange-wash flex items-center justify-center text-forge-orange mb-4">
                <Landmark size={20} />
              </div>
              <h3 className="font-bold text-forge-gray-900 mb-2">Investments</h3>
              <p className="text-sm font-medium text-forge-gray-600">Automated, smart portfolio management for private funds.</p>
            </div>
            <div className="clean-card p-6">
              <div className="w-10 h-10 rounded-xl bg-forge-orange-wash flex items-center justify-center text-forge-orange mb-4">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-bold text-forge-gray-900 mb-2">Trading</h3>
              <p className="text-sm font-medium text-forge-gray-600">Real-time marketplace data & execution for pre-IPO shares.</p>
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
                <h3 className="font-bold text-lg text-forge-gray-900 mb-2">Security First</h3>
                <p className="text-forge-gray-600">Your assets and data are protected with enterprise-grade security measures and rigorous regulatory compliance.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 rounded-full bg-forge-gray-50 border border-forge-gray-200 flex items-center justify-center text-forge-gray-900">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-forge-gray-900 mb-2">Innovation</h3>
                <p className="text-forge-gray-600">We continuously push boundaries to deliver cutting-edge financial technology and seamless user experiences.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 rounded-full bg-forge-gray-50 border border-forge-gray-200 flex items-center justify-center text-forge-gray-900">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-forge-gray-900 mb-2">User-Centric</h3>
                <p className="text-forge-gray-600">Every feature, interface, and decision is made with our users' success and satisfaction strictly in mind.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div>
          <h2 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-6">Leadership Team</h2>
          <p className="text-lg text-forge-gray-600 mb-10">
            Meet the visionaries behind our platform, bringing together decades of experience in finance, technology, and private markets.
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
          Join thousands of users who are already building their wealth and accessing the private markets with Forge.
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
