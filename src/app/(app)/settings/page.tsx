"use client";

import { useRef } from "react";
import { useStore } from "@/lib/store";
import { 
  CheckCircle2, 
  Shield, 
  User as UserIcon, 
  Lock, 
  Camera, 
  Trash2, 
  Upload 
} from "lucide-react";
import { useHydration } from "@/lib/useHydration";

export default function SettingsPage() {
  const isHydrated = useHydration();
  const { user, currentUser, isKycCompleted, updateUserAvatar, setToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAvatar = isHydrated ? (currentUser?.avatar || user.avatar) : undefined;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToast("Please upload a valid image file (PNG, JPG, or WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast("Image size must be smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateUserAvatar(result);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so user can upload same photo again if desired
    e.target.value = "";
  };

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
        <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forge-gray-50 flex items-center justify-center text-forge-gray-600">
              <UserIcon size={20} />
            </div>
            <div>
              <h2 className="font-bold text-forge-gray-900">User Profile</h2>
              <p className="text-xs text-forge-gray-500">Personal identity and avatar</p>
            </div>
          </div>

          {/* Interactive Profile Avatar Uploader */}
          <div className="flex items-center gap-5 p-4 bg-forge-gray-50/70 rounded-2xl border border-forge-gray-200">
            {/* Avatar Circle */}
            <div className="w-20 h-20 rounded-full border-2 border-white shadow-md overflow-hidden relative shrink-0 bg-forge-gray-900 flex items-center justify-center">
              {currentAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentAvatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display font-extrabold text-2xl text-white uppercase" suppressHydrationWarning>
                  {isHydrated ? user.name.split(" ").map((n) => n[0]).join("") : "MS"}
                </span>
              )}
            </div>

            {/* Upload Buttons & Guidance */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-forge-orange hover:bg-forge-orange-hover text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Camera size={14} />
                  <span>{currentAvatar ? "Change Photo" : "Upload Photo"}</span>
                </button>
                {currentAvatar && (
                  <button
                    type="button"
                    onClick={() => updateUserAvatar(null)}
                    className="px-3 py-1.5 bg-white hover:bg-forge-gray-100 border border-forge-gray-200 text-forge-gray-600 hover:text-market-down text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-forge-gray-400">
                Recommended: Square image, max 5MB (PNG, JPG, WebP).
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <p className="text-xs font-bold text-forge-gray-400 uppercase tracking-wider">Account Holder</p>
              <p className="font-semibold text-forge-gray-900" suppressHydrationWarning>{isHydrated ? user.name : "Member"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-forge-gray-400 uppercase tracking-wider">Email Address</p>
              <p className="font-semibold text-forge-gray-900" suppressHydrationWarning>{isHydrated ? user.email : "user@forgecapital.com"}</p>
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
