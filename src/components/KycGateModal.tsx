"use client";

import { ShieldAlert, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

interface KycGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function KycGateModal({
  isOpen,
  onClose,
  title = "Identity Verification Required",
  description = "Before withdrawing your capital and interest profits, regulatory compliance requires you to complete KYC verification.",
}: KycGateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-forge-gray-200 p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-forge-gray-400 hover:text-forge-gray-600 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-forge-orange-wash text-forge-orange flex items-center justify-center mx-auto mb-5 border border-forge-orange/20 shadow-sm">
          <ShieldAlert size={32} />
        </div>

        <h3 className="font-display font-bold text-2xl text-forge-gray-900 mb-2">
          {title}
        </h3>

        <p className="text-sm font-medium text-forge-gray-600 leading-relaxed mb-6">
          {description}
        </p>

        <div className="space-y-3">
          <Link
            href={ROUTES.app.kyc}
            onClick={onClose}
            className="w-full py-3.5 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] flex items-center justify-center gap-2 text-sm"
          >
            Complete KYC Verification
            <ArrowRight size={16} />
          </Link>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-forge-gray-500 hover:text-forge-gray-800 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
