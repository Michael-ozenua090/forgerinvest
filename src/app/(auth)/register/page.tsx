"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form validations
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://forgerinvest.com/login',
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }

      // Update local store profile for immediate personalized UI
      useStore.setState((state) => ({
        user: {
          ...state.user,
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
        },
        currentUser: {
          ...state.currentUser,
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
        },
      }));

      // Check if email confirmation is required
      if (data.user && !data.session) {
        setSuccessMessage("Account created! Please check your email to confirm your registration.");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="clean-card p-8 sm:p-10 w-full max-w-lg mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-2xl text-forge-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm font-medium text-forge-gray-600">
          Join Forge Capital to start compounding high-growth fixed yields.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-market-down/10 border border-market-down/20 text-market-down text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-market-up/10 border border-market-up/20 text-market-up text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="firstName">
              First Name
            </label>
            <input 
              id="firstName" 
              name="firstName"
              type="text" 
              required 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Alex"
              className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input 
              id="lastName" 
              name="lastName"
              type="text" 
              required 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Vance"
              className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="email">
            Email Address
          </label>
          <input 
            id="email" 
            name="email"
            type="email" 
            autoComplete="email"
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex.vance@example.com"
            className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input 
              id="password" 
              name="password"
              type={showPassword ? "text" : "password"}
              minLength={8}
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all pr-12" 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"} 
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-forge-gray-400 hover:text-forge-gray-600 transition-colors" 
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <input 
              id="confirmPassword" 
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              minLength={8}
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all pr-12" 
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} 
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-forge-gray-400 hover:text-forge-gray-600 transition-colors" 
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-3.5 mt-2 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-forge-gray-100 text-center text-sm font-medium text-forge-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-forge-orange hover:text-forge-orange-hover font-bold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
