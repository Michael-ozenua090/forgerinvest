"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        const fullName = data.user.user_metadata?.first_name 
          ? `${data.user.user_metadata.first_name} ${data.user.user_metadata.last_name || ""}`.trim()
          : data.user.email?.split("@")[0] || "Member";

        useStore.setState((state) => ({
          user: {
            ...state.user,
            name: fullName,
            email: data.user.email || email,
          },
          currentUser: {
            ...state.currentUser,
            name: fullName,
            email: data.user.email || email,
          },
        }));
      }

      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="clean-card p-8 sm:p-10 w-full max-w-lg mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
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

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-market-down/10 border border-market-down/20 text-market-down text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="email">
            Email Address
          </label>
          <input 
            autoComplete="username" 
            autoFocus 
            className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all" 
            id="email" 
            name="email"
            required 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600" htmlFor="password">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-bold text-forge-orange hover:text-forge-orange-hover">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input 
              autoComplete="current-password" 
              className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all pr-12" 
              id="password" 
              name="password"
              required 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button 
              aria-label={showPassword ? "Hide password" : "Show password"} 
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-forge-gray-400 hover:text-forge-gray-600 transition-colors" 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          disabled={isSubmitting}
          className="w-full py-3.5 mt-2 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
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
