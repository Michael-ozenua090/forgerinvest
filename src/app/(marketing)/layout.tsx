import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Sticky Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-forge-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={ROUTES.marketing.home} className="relative w-24 h-8 block">
              <Image
                src="/FRGE.png"
                alt="Forge Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href={ROUTES.marketing.marketplace} className="text-sm font-semibold text-forge-gray-600 hover:text-forge-orange transition-colors">Marketplace</Link>
              <Link href={ROUTES.marketing.marketplace} className="text-sm font-semibold text-forge-gray-600 hover:text-forge-orange transition-colors">Forge Price™</Link>
              <Link href={ROUTES.marketing.funds} className="text-sm font-semibold text-forge-gray-600 hover:text-forge-orange transition-colors">Private Indices</Link>
              <Link href={ROUTES.marketing.about} className="text-sm font-semibold text-forge-gray-600 hover:text-forge-orange transition-colors">About</Link>
              <Link href={ROUTES.marketing.home} className="text-sm font-semibold text-forge-gray-600 hover:text-forge-orange transition-colors">Insights</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-forge-gray-200 text-forge-gray-600 hover:border-forge-orange hover:text-forge-orange transition-colors">
              <Search size={14} />
              <span className="text-xs font-medium">Search tickers...</span>
            </button>
            <Link href={ROUTES.auth.login} className="text-sm font-semibold text-forge-gray-900 border border-forge-gray-200 px-4 py-2 rounded-lg hover:bg-forge-gray-50 transition-colors">
              Log In
            </Link>
            <Link href={ROUTES.auth.register} className="text-sm font-bold bg-forge-orange text-white px-5 py-2 rounded-lg hover:bg-forge-orange-hover transition-colors shadow-sm">
              Join Forge
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="flex-grow">{children}</main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-forge-gray-900 text-forge-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-forge-gray-600">
                <li><Link href={ROUTES.marketing.marketplace} className="hover:text-forge-orange">Marketplace</Link></li>
                <li><Link href={ROUTES.marketing.marketplace} className="hover:text-forge-orange">Forge Price™</Link></li>
                <li><Link href={ROUTES.marketing.funds} className="hover:text-forge-orange">Private Indices</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-forge-gray-600">
                <li><Link href={ROUTES.marketing.about} className="hover:text-forge-orange">About Us</Link></li>
                <li><Link href={ROUTES.marketing.about} className="hover:text-forge-orange">Careers</Link></li>
                <li><Link href={ROUTES.marketing.about} className="hover:text-forge-orange">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-forge-gray-600">
                <li><Link href={ROUTES.marketing.home} className="hover:text-forge-orange">Insights</Link></li>
                <li><Link href={ROUTES.marketing.helpCenter} className="hover:text-forge-orange">Help Center</Link></li>
                <li><Link href={ROUTES.marketing.contact} className="hover:text-forge-orange">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-forge-gray-600">
                <li><Link href={ROUTES.marketing.legal.terms} className="hover:text-forge-orange">Terms of Service</Link></li>
                <li><Link href={ROUTES.marketing.legal.privacy} className="hover:text-forge-orange">Privacy Policy</Link></li>
                <li><Link href={ROUTES.marketing.legal.terms} className="hover:text-forge-orange">Form CRS</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-forge-gray-800 pt-8 text-xs text-forge-gray-600 space-y-4">
            <p>
              Investing in private company securities is not suitable for all investors. It is highly speculative and involves a high degree of risk, including the possible loss of the entire investment.
            </p>
            <p>
              Forge Global, Inc. and its affiliates ("Forge") operate a leading platform for the private market. Securities-related services are offered through Forge Securities LLC, a registered broker-dealer and member FINRA/SIPC. 
            </p>
            <p>&copy; 2026 Forge Global, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
