"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  Wallet, 
  Settings, 
  LifeBuoy,
  Search,
  Bell,
  X,
  ChevronRight,
  Activity,
  CheckCircle2,
  Menu,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useStore } from "@/lib/store";
import { CurrencySelector } from "@/components/CurrencySelector";
import { CryptoDepositModal } from "@/components/CryptoDepositModal";

// Intentional Friction Architecture: KYC link is removed from navigation menus
const navLinks = [
  { name: "Dashboard", icon: LayoutDashboard, href: ROUTES.app.dashboard },
  { name: "Growth Plans", icon: TrendingUp, href: ROUTES.app.plans },
  { name: "Active Portfolio", icon: Briefcase, href: ROUTES.app.portfolio },
  { name: "Wallet / Funding", icon: Wallet, href: ROUTES.app.wallet.home },
  { name: "Settings", icon: Settings, href: ROUTES.app.settings },
  { name: "Support", icon: LifeBuoy, href: ROUTES.app.support },
];

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { 
    user, 
    currentUser,
    toastMessage, 
    setToast, 
    notifications, 
    markNotificationsAsRead, 
    isDepositModalOpen, 
    setDepositModalOpen,
    fetchRates 
  } = useStore();

  const unreadCount = notifications ? notifications.filter((n: any) => !n.read).length : 0;

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToast]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchResults = [
    { name: "1-Month Fixed Plan (+6%)", type: "Plan", href: "/plans?duration=1" },
    { name: "2-Month Accelerated Plan (+15%)", type: "Plan", href: "/plans?duration=2" },
    { name: "3-Month Compounding Plan (+27%)", type: "Plan", href: "/plans?duration=3" },
    { name: "6-Month Strategic Plan (+66%)", type: "Plan", href: "/plans?duration=6" },
    { name: "12-Month High-Yield Plan (+162%)", type: "Plan", href: "/plans?duration=12" },
    { name: "Active Growth Portfolio", type: "Portfolio", href: "/portfolio" },
    { name: "Deposit Capital", type: "Wallet", href: "/wallet" },
    { name: "Withdraw Funds", type: "Wallet", href: "/wallet/withdraw" },
  ].filter(s => s.name.toLowerCase().includes(cmdSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-forge-gray-50 flex">
      {/* ── Global Toast ──────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-forge-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-forge-gray-700">
            <CheckCircle2 size={18} className="text-market-up shrink-0" />
            <p className="text-sm font-bold">{toastMessage}</p>
            <button onClick={() => setToast(null)} className="ml-2 text-forge-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile Sidebar Backdrop ──────────────────────────────────── */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-forge-gray-200
        transition-transform duration-300 ease-in-out
        w-72 lg:w-72
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-forge-gray-200 shrink-0">
          <Link href={ROUTES.marketing.home} className="relative w-24 h-8 block">
            <Image src="/FRGE.png" alt="Forge Logo" fill className="object-contain object-left" priority />
          </Link>
          <button className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} className="text-forge-gray-600" />
          </button>
        </div>

        {/* User Profile Snippet */}
        <div className="p-6 border-b border-forge-gray-200 shrink-0">
          <Link href={ROUTES.app.settings} className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
            {(currentUser?.avatar || user.avatar) ? (
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-forge-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={currentUser?.avatar || user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-forge-gray-900 text-white flex items-center justify-center font-display font-bold text-sm shrink-0 uppercase">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-body font-bold text-sm text-forge-gray-900 truncate">{user.name}</p>
              <p className="font-body text-xs text-forge-gray-500">ID: FG-8492</p>
            </div>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-forge-orange-wash text-forge-orange border border-forge-orange/20">
            <span className="text-[10px] font-bold uppercase tracking-wider">Capital Growth Member</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? "bg-forge-orange-wash text-forge-orange border-r-2 border-forge-orange font-bold" 
                    : "text-forge-gray-600 hover:bg-forge-gray-100 hover:text-forge-gray-900"
                  }
                `}
              >
                <link.icon size={18} className={isActive ? "text-forge-orange" : "text-forge-gray-600"} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Admin Link - Only visible if user.role === 'admin' */}
        {currentUser?.role === 'admin' && (
          <div className="px-3 py-2 border-t border-forge-gray-100">
            <Link 
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-forge-gray-500 hover:text-forge-orange hover:bg-forge-orange-wash rounded-lg transition-colors"
            >
              <ShieldCheck size={16} />
              <span>Treasury Admin</span>
            </Link>
          </div>
        )}

        {/* Sign Out */}
        <div className="p-4 border-t border-forge-gray-200 shrink-0">
          <Link 
            href={ROUTES.auth.login}
            className="flex items-center justify-center w-full py-2 text-sm font-bold text-forge-gray-500 hover:text-forge-gray-900 transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-forge-gray-200 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} className="text-forge-gray-600" />
            </button>
            
            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-forge-gray-500 font-medium">Forge Capital</span>
              <ChevronRight size={14} className="text-forge-gray-400" />
              <span className="text-forge-gray-900 font-bold capitalize">
                {pathname?.split("/")[1] || "Dashboard"}
              </span>
            </div>

            {/* Platform Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-forge-gray-50 border border-forge-gray-200 ml-4">
              <Activity size={12} className="text-forge-orange" />
              <span className="text-xs font-bold text-forge-gray-900">Yield Engine Active</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CurrencySelector />

            {/* Search Trigger */}
            <button 
              onClick={() => setCmdOpen(true)}
              className="hidden sm:flex items-center gap-2 pl-3 pr-2 py-1.5 text-sm rounded-lg border border-forge-gray-200 text-forge-gray-400 hover:border-forge-orange hover:text-forge-gray-900 w-64 transition-all"
            >
              <Search size={16} />
              <span className="flex-1 text-left">Search growth plans...</span>
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-forge-gray-200 bg-forge-gray-50 px-1.5 font-mono text-[10px] font-medium text-forge-gray-500">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 text-forge-gray-600 hover:text-forge-gray-900 transition-colors relative"
                aria-label="View notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-forge-orange"></span>
                )}
              </button>
              
              {/* Notification Popover */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-forge-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-forge-gray-100 flex justify-between items-center bg-forge-gray-50/50">
                    <h3 className="font-display font-bold text-forge-gray-900">Notifications</h3>
                    <button 
                      onClick={() => markNotificationsAsRead()} 
                      className="text-xs font-bold text-forge-orange hover:text-forge-orange-hover"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications && notifications.length > 0 ? (
                      <div className="divide-y divide-forge-gray-100">
                        {notifications.map((n: any) => (
                          <div key={n.id} className={`p-4 text-sm ${!n.read ? "bg-forge-orange-wash/30" : "bg-white"}`}>
                            <p className={`font-medium ${!n.read ? "text-forge-gray-900" : "text-forge-gray-600"}`}>
                              {n.message}
                            </p>
                            <p className="text-[10px] font-bold text-forge-gray-400 mt-1 uppercase tracking-wider">
                              {new Date(n.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-forge-gray-500">
                        <Bell size={24} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-bold">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href={ROUTES.app.plans} className="hidden sm:block text-sm font-bold bg-forge-orange text-white px-4 py-2 rounded-lg hover:bg-forge-orange-hover transition-colors shadow-sm">
              Start Plan
            </Link>
          </div>
        </header>

        {/* ── Command Palette Modal ────────────────────────────────────── */}
        {cmdOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
            <div 
              className="fixed inset-0 bg-forge-gray-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setCmdOpen(false)}
            />
            <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
              <div className="flex items-center px-4 border-b border-forge-gray-100">
                <Search size={20} className="text-forge-gray-400 shrink-0" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search savings plans, portfolio, or wallet..." 
                  value={cmdSearch}
                  onChange={(e) => setCmdSearch(e.target.value)}
                  className="flex-1 h-14 bg-transparent border-0 focus:ring-0 text-forge-gray-900 placeholder:text-forge-gray-400 px-4 font-medium"
                />
                <button onClick={() => setCmdOpen(false)} className="text-xs font-bold px-2 py-1 bg-forge-gray-100 text-forge-gray-500 rounded hover:bg-forge-gray-200">
                  ESC
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={result.href}
                      onClick={() => {
                        router.push(result.href);
                        setCmdOpen(false);
                        setCmdSearch("");
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-forge-gray-50 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-forge-gray-100 text-forge-gray-500 flex items-center justify-center group-hover:bg-forge-orange group-hover:text-white transition-colors">
                          <TrendingUp size={14} />
                        </div>
                        <span className="font-bold text-forge-gray-900">{result.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider bg-forge-gray-100 px-2 py-1 rounded">
                        {result.type}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-forge-gray-500 font-medium">
                    No results found for "{cmdSearch}"
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* ── Global Deposit Modal ─────────────────────────────────────── */}
      <CryptoDepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setDepositModalOpen(false)} 
      />
    </div>
  );
}
