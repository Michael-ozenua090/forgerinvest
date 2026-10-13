"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, KeyRound, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminKeyName, setAdminKeyName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!adminKeyName.trim() || !adminPassword.trim()) {
      setErrorMessage("Please enter both your Admin Key Identifier and Security Password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminKeyName: adminKeyName.trim(),
          adminPassword: adminPassword.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Invalid admin credentials.");
        setIsSubmitting(false);
        return;
      }

      // Successful auth: redirect into the admin command center
      router.replace(ROUTES.admin);
    } catch {
      setErrorMessage("Network error during admin gateway authentication. Please retry.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-between relative selection:bg-forge-orange selection:text-white">
      {/* Background radial gradient highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,90,0,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-forge-orange/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href={ROUTES.marketing.home} className="flex items-center gap-3 group">
          <div className="relative w-28 h-8">
            <Image 
              src="/FRGE.png" 
              alt="Forge Logo" 
              fill 
              className="object-contain object-left invert brightness-200" 
              priority 
            />
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-forge-orange border border-forge-orange/20">
            Treasury Core
          </span>
        </Link>

        <Link
          href={ROUTES.marketing.home}
          className="text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          Client Portal <ArrowRight size={13} />
        </Link>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#0f1420]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forge-orange/30 via-forge-orange to-forge-orange/30" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-forge-orange mb-4 shadow-inner">
              <ShieldAlert size={28} />
            </div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-white">
              Admin Gateway
            </h1>
            <p className="text-xs font-medium text-gray-400 mt-2 max-w-xs mx-auto">
              Secure operational command center for treasury management, user compliance, and deposit verification.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin Key Identifier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Admin Key Identifier
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={adminKeyName}
                  onChange={(e) => setAdminKeyName(e.target.value)}
                  placeholder="e.g. forge_super_admin"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-forge-orange focus:ring-1 focus:ring-forge-orange transition-all font-mono"
                />
              </div>
            </div>

            {/* Security Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Security Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-forge-orange focus:ring-1 focus:ring-forge-orange transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 bg-forge-orange hover:bg-forge-orange-hover disabled:bg-forge-orange/50 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(255,90,0,0.3)] hover:shadow-[0_6px_25px_rgba(255,90,0,0.4)] transition-all flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Authorize & Access Gateway</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-gray-500">
              <Lock size={12} className="text-forge-orange" />
              <span>256-Bit Encrypted Gateway • Authorised Personnel Only</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-gray-600">
        <p>© 2026 Forge Capital Holdings Inc. All administrative actions are recorded and audited.</p>
      </footer>
    </div>
  );
}
