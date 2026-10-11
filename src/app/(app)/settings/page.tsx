"use client";

import { useStore } from "@/lib/store";
import { CheckCircle2, Shield, User as UserIcon, Lock, Bell, Key } from "lucide-react";

export default function SettingsPage() {
  const { user, isKycCompleted } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-1">
          Settings & Security
        </h1>
        <p className="font-medium text-forge-gray-600">
          Manage your account profile, security credentials, and platform preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile */}
        <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forge-gray-50 flex items-center justify-center text-forge-gray-600">
              <UserIcon size={20} />
            </div>
            <h2 className="font-bold text-forge-gray-900">User Profile</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-forge-gray-400 uppercase tracking-wider">Account Holder</p>
              <p className="font-semibold text-forge-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-forge-gray-400 uppercase tracking-wider">Email Address</p>
              <p className="font-semibold text-forge-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-forge-gray-400 uppercase tracking-wider">Account ID</p>
              <p className="font-semibold text-forge-gray-900">FG-849204</p>
            </div>
          </div>
        </div>

        {/* Security & Verification Status */}
        <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forge-gray-50 flex items-center justify-center text-forge-gray-600">
              <Shield size={20} />
            </div>
            <h2 className="font-bold text-forge-gray-900">Account Standing</h2>
          </div>
          
          <div className="pt-1">
            {isKycCompleted ? (
              <div className="flex items-center gap-3 p-4 bg-market-up/10 text-market-up rounded-xl border border-market-up/20">
                <CheckCircle2 size={24} className="shrink-0" />
                <div>
                  <p className="font-bold text-sm">Identity Verified</p>
                  <p className="text-xs font-medium opacity-90">Account is fully authorized for capital and profit disbursements.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-forge-gray-50 rounded-xl border border-forge-gray-200 space-y-1">
                <p className="font-bold text-sm text-forge-gray-900">Standard Growth Account</p>
                <p className="text-xs font-medium text-forge-gray-500 leading-relaxed">
                  Active for capital commitments and yield compounding. Regulatory identity verification will be prompted automatically upon fund withdrawal.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-forge-gray-100 flex items-center justify-between text-xs text-forge-gray-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock size={14} className="text-market-up" /> 2-Factor Auth (Authenticator)
            </span>
            <span className="font-bold text-market-up">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
