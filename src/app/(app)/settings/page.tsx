"use client";

import { useStore } from "@/lib/store";
import { CheckCircle2, AlertTriangle, Shield, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function SettingsPage() {
  const { user } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-1">
          Settings
        </h1>
        <p className="font-medium text-forge-gray-600">
          Manage your profile, security preferences, and account verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="clean-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forge-gray-50 flex items-center justify-center text-forge-gray-500">
              <UserIcon size={20} />
            </div>
            <h2 className="font-bold text-forge-gray-900">User Profile</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-bold text-forge-gray-500 uppercase tracking-wider">Name</p>
              <p className="font-medium text-forge-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-forge-gray-500 uppercase tracking-wider">Email</p>
              <p className="font-medium text-forge-gray-900">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="clean-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forge-gray-50 flex items-center justify-center text-forge-gray-500">
              <Shield size={20} />
            </div>
            <h2 className="font-bold text-forge-gray-900">KYC Status</h2>
          </div>
          
          <div className="pt-2">
            {user.kycStatus === "verified" ? (
              <div className="flex items-center gap-3 p-4 bg-market-up/10 text-market-up rounded-xl border border-market-up/20">
                <CheckCircle2 size={24} />
                <div>
                  <p className="font-bold">Accredited Investor</p>
                  <p className="text-sm font-medium opacity-90">Your identity and status are verified.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 p-4 bg-forge-orange-wash text-forge-orange rounded-xl border border-forge-orange/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={24} />
                  <div>
                    <p className="font-bold">Verification Pending</p>
                    <p className="text-sm font-medium opacity-90">Complete KYC to trade.</p>
                  </div>
                </div>
                <Link href={ROUTES.auth.kyc} className="bg-forge-orange text-white text-center py-2 rounded-lg font-bold hover:bg-forge-orange-hover transition-colors">
                  Verify Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
