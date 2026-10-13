"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const redirectUrl = typeof window !== "undefined" 
        ? `${window.location.origin}/reset-password`
        : "/reset-password";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="clean-card p-8 sm:p-10 w-full max-w-lg mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-forge-gray-50 border border-forge-gray-200 mb-4 text-forge-orange">
          <KeyRound size={24} />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-forge-gray-900">
          Reset your password
        </h1>
        <p className="mt-2 text-sm font-medium text-forge-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-market-down/10 border border-market-down/20 text-market-down text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {isSuccess ? (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-market-up/10 border border-market-up/20 text-market-up space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>Check your inbox!</span>
            </div>
            <p className="text-xs font-medium text-forge-gray-700 leading-relaxed pl-6">
              We've sent password reset instructions to <strong className="text-forge-gray-900">{email}</strong>. Please follow the link in the email to set a new password.
            </p>
          </div>

          <Link
            href="/login"
            className="w-full py-3.5 bg-forge-gray-100 hover:bg-forge-gray-200 text-forge-gray-800 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft size={16} />
            <span>Return to Sign In</span>
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="email">
              Email Address
            </label>
            <input 
              autoComplete="email" 
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

          <button 
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
            type="submit"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-forge-gray-100 text-center text-sm font-medium text-forge-gray-600">
        Remember your password?{" "}
        <Link href="/login" className="text-forge-orange hover:text-forge-orange-hover font-bold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
