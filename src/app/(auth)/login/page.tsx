"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="clean-card p-8 sm:p-10 w-full shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-forge-gray-50 border border-forge-gray-200 mb-4 text-forge-orange">
          <Lock size={24} />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-forge-gray-900">
          Sign In
        </h1>
        <p className="mt-2 text-sm font-medium text-forge-gray-600">
          Access your institutional portfolio.
        </p>
      </div>

      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="email">
            Email Address
          </label>
          <input 
            autoComplete="username" 
            autoFocus 
            className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all" 
            id="email" 
            required 
            type="email" 
            placeholder="name@company.com"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600" htmlFor="password">
              Password
            </label>
            <Link href="#" className="text-xs font-bold text-forge-orange hover:text-forge-orange-hover">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input 
              autoComplete="current-password" 
              className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all pr-12" 
              id="password" 
              required 
              type="password" 
              placeholder="••••••••"
            />
            <button 
              aria-label="Show password" 
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-forge-gray-400 hover:text-forge-gray-600 transition-colors" 
              type="button"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        <button className="w-full py-3.5 mt-2 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)]" type="submit">
          Sign In
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-forge-gray-100 text-center text-sm font-medium text-forge-gray-600">
        Don't have an account?{" "}
        <Link href="/register" className="text-forge-orange hover:text-forge-orange-hover font-bold">
          Create account
        </Link>
      </div>
    </div>
  );
}
