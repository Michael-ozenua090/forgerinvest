"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { setToast } = useStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setToast("Password updated successfully! Please sign in with your new credentials.");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update password. Please try again.");
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
          Create new password
        </h1>
        <p className="mt-2 text-sm font-medium text-forge-gray-600">
          Please choose a strong password with at least 8 characters.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-market-down/10 border border-market-down/20 text-market-down text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {isSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-market-up/10 border border-market-up/20 text-market-up text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <p className="font-medium">Password updated successfully! Redirecting to sign in...</p>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="password">
            New Password
          </label>
          <div className="relative">
            <input 
              autoComplete="new-password" 
              autoFocus 
              className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all pr-12" 
              id="password" 
              name="password"
              minLength={8}
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

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <div className="relative">
            <input 
              autoComplete="new-password" 
              className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all pr-12" 
              id="confirmPassword" 
              name="confirmPassword"
              minLength={8}
              required 
              type={showConfirmPassword ? "text" : "password"} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button 
              aria-label={showConfirmPassword ? "Hide password" : "Show password"} 
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-forge-gray-400 hover:text-forge-gray-600 transition-colors" 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          disabled={isSubmitting || isSuccess}
          className="w-full py-3.5 mt-2 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-forge-gray-100 text-center text-sm font-medium text-forge-gray-600">
        Remember your password?{" "}
        <Link href="/login" className="text-forge-orange hover:text-forge-orange-hover font-bold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
