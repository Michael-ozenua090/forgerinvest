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
              <Link href={ROUTES.marketing.forgePrice} className="text-sm font-semibold text-forge-gray-600 hover:text-forge-orange transition-colors">Forge Price™</Link>
              <Link href={ROUTES.marketing.privateIndices} className="text-sm font-semibold text-forge-gray-600 hover:text-forge-orange transition-colors">Private Indices</Link>
              <Link href={ROUTES.marketing.about} className="text-sm font-semibold text-forge-gray-600 hover:text-forge-orange transition-colors">About</Link>
              <Link href={ROUTES.marketing.insights} className="text-sm font-semibold text-forge-gray-600 hover:text-forge-orange transition-colors">Insights</Link>
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
      <footer className="bg-forge-gray-900 text-forge-gray-200 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Platform */}
            <div>
              <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Platform</h3>
              <ul className="space-y-3 text-sm text-forge-gray-400">
                <li><Link href={ROUTES.marketing.marketplace} className="hover:text-forge-orange transition-colors">Marketplace</Link></li>
                <li><Link href={ROUTES.marketing.forgePrice} className="hover:text-forge-orange transition-colors">Forge Price™</Link></li>
                <li><Link href={ROUTES.marketing.privateIndices} className="hover:text-forge-orange transition-colors">Private Indices</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
              <ul className="space-y-3 text-sm text-forge-gray-400">
                <li><Link href={ROUTES.marketing.about} className="hover:text-forge-orange transition-colors">About Us</Link></li>
                <li><Link href={ROUTES.marketing.careers} className="hover:text-forge-orange transition-colors">Careers</Link></li>
                <li><Link href={ROUTES.marketing.press} className="hover:text-forge-orange transition-colors">Press</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Resources</h3>
              <ul className="space-y-3 text-sm text-forge-gray-400">
                <li><Link href={ROUTES.marketing.insights} className="hover:text-forge-orange transition-colors">Insights</Link></li>
                <li><Link href={ROUTES.marketing.helpCenter} className="hover:text-forge-orange transition-colors">Help Center</Link></li>
                <li><Link href={ROUTES.marketing.contact} className="hover:text-forge-orange transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3 text-sm text-forge-gray-400">
                <li><Link href={ROUTES.marketing.legal.terms} className="hover:text-forge-orange transition-colors">Terms of Service</Link></li>
                <li><Link href={ROUTES.marketing.legal.privacy} className="hover:text-forge-orange transition-colors">Privacy Policy</Link></li>
                <li><Link href={ROUTES.marketing.legal.formCrs} className="hover:text-forge-orange transition-colors">Form CRS</Link></li>
              </ul>
            </div>
          </div>

          {/* Regulatory Disclaimers */}
          <div className="border-t border-forge-gray-800 pt-8 text-xs text-forge-gray-500 space-y-3 leading-relaxed">
            <p>
              Securities offered through Forge Securities LLC, Member FINRA/SIPC. Private market securities are speculative, illiquid, and carry high risk of loss.
            </p>
            <p>&copy; {new Date().getFullYear()} Forge Global, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
