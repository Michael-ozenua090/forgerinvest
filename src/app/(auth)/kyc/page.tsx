"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  Camera, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Building,
  User,
  FileCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";

export default function KYCPage() {
  const router = useRouter();
  const { user, completeKYC, setToast } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "",
    // Document Information
    documentType: "passport",
    documentNumber: "",
    expiryDate: "",
    phone: "",
    // Address Information
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // Uploaded Files State
  const [files, setFiles] = useState<{
    front: File | null;
    back: File | null;
    selfie: File | null;
  }>({
    front: null,
    back: null,
    selfie: null,
  });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill user data if available
  useEffect(() => {
    if (user?.name) {
      const parts = user.name.split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || parts[0] || "",
        lastName: prev.lastName || parts.slice(1).join(" ") || "",
        nationality: prev.nationality || "United States",
        country: prev.country || "United States",
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (type: "front" | "back" | "selfie", file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      completeKYC();
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setToast("KYC verification documents submitted successfully.");
    }, 1200);
  };

  const isVerified = user.kycStatus === "verified" || submittedSuccess;
  const statusLabel = isVerified ? "Verified" : "Not Submitted";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* ── Top Hero Banner (Styled with Forge brand aesthetic) ── */}
      <div className="bg-forge-gray-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-forge-gray-800">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full -translate-y-24 translate-x-24 bg-forge-orange blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-12 -translate-x-12 bg-forge-orange blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-forge-gray-300 uppercase tracking-wider mb-3 backdrop-blur-sm">
              <ShieldCheck size={14} className="text-forge-orange" />
              SEC Compliance & Identity Verification
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
              KYC Verification
            </h1>
            <p className="text-forge-gray-300 text-sm mt-1 max-w-xl">
              Complete your identity verification to access all institutional features, trading privileges, and private company shares.
            </p>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 border border-white/15 shadow-xl sm:w-64 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-forge-gray-300 mb-1 uppercase tracking-wider">
                  Verification Status
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isVerified ? "bg-market-up animate-pulse" : "bg-forge-orange"}`} />
                  <p className="text-lg font-bold text-white tracking-wide">
                    {statusLabel}
                  </p>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isVerified ? "bg-market-up/20 text-market-up" : "bg-forge-orange/20 text-forge-orange"}`}>
                <ShieldCheck size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success Confirmation Screen (if already submitted / verified) ── */}
      {submittedSuccess && (
        <div className="clean-card p-8 rounded-2xl border-market-up/30 bg-market-up/5 space-y-4 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-market-up/15 text-market-up flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-forge-gray-900">
            KYC Verification Submitted!
          </h2>
          <p className="text-sm font-medium text-forge-gray-600 max-w-md mx-auto">
            Your identification documents have been securely processed and your account status is verified. You now have full access to trade secondary shares on Forge.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              href={ROUTES.app.dashboard}
              className="px-6 py-3 bg-forge-orange hover:bg-forge-orange-hover text-white font-bold rounded-lg transition-colors shadow-sm inline-flex items-center gap-2 text-sm"
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </Link>
            <button 
              onClick={() => setSubmittedSuccess(false)}
              className="px-5 py-3 text-sm font-semibold text-forge-gray-600 hover:text-forge-gray-900 transition-colors"
            >
              Update Information
            </button>
          </div>
        </div>
      )}

      {/* ── Main Form Card ── */}
      {!submittedSuccess && (
        <div className="clean-card p-6 sm:p-10 rounded-2xl shadow-sm border border-forge-gray-200">
          <div className="mb-8 pb-6 border-b border-forge-gray-100">
            <h2 className="font-display font-extrabold text-xl text-forge-gray-900 mb-1">
              Identity Verification
            </h2>
            <p className="text-sm font-medium text-forge-gray-500">
              Please provide your identification documents for verification
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* ── 1. Personal & Document Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-forge-gray-100">
                  <User size={18} className="text-forge-orange" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-forge-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="firstName">
                    First Name
                  </label>
                  <input 
                    id="firstName" 
                    required 
                    type="text" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="e.g. Misha"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="lastName">
                    Last Name
                  </label>
                  <input 
                    id="lastName" 
                    required 
                    type="text" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Stark"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="dob">
                    Date of Birth
                  </label>
                  <input 
                    id="dob" 
                    required 
                    type="date" 
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="nationality">
                    Nationality
                  </label>
                  <input 
                    id="nationality" 
                    required 
                    type="text" 
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="e.g. United States"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>
              </div>

              {/* Document Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-forge-gray-100">
                  <FileCheck size={18} className="text-forge-orange" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-forge-gray-900">
                    Document Information
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="documentType">
                    Document Type
                  </label>
                  <select 
                    id="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white transition-colors"
                  >
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="documentNumber">
                    Document Number
                  </label>
                  <input 
                    id="documentNumber" 
                    required 
                    type="text" 
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. A12345678"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="expiryDate">
                    Document Expiry Date (Optional)
                  </label>
                  <input 
                    id="expiryDate" 
                    type="date" 
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="phone">
                    Phone Number
                  </label>
                  <input 
                    id="phone" 
                    required 
                    type="tel" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>
              </div>
            </div>

            {/* ── 2. Address Information ── */}
            <div className="space-y-4 pt-4 border-t border-forge-gray-100">
              <div className="flex items-center gap-2 pb-1 border-b border-forge-gray-100">
                <Building size={18} className="text-forge-orange" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-forge-gray-900">
                  Address Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="address1">
                    Address Line 1
                  </label>
                  <input 
                    id="address1" 
                    required 
                    type="text" 
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder="Street address or P.O. Box"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="address2">
                    Address Line 2 (Optional)
                  </label>
                  <input 
                    id="address2" 
                    type="text" 
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder="Apt, suite, unit, building, floor"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="city">
                    City
                  </label>
                  <input 
                    id="city" 
                    required 
                    type="text" 
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. San Francisco"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="state">
                    State/Province (Optional)
                  </label>
                  <input 
                    id="state" 
                    type="text" 
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. CA"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="postalCode">
                    Postal Code (Optional)
                  </label>
                  <input 
                    id="postalCode" 
                    type="text" 
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 94104"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5" htmlFor="country">
                    Country
                  </label>
                  <input 
                    id="country" 
                    required 
                    type="text" 
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g. United States"
                    className="w-full px-3.5 py-2.5 border border-forge-gray-200 rounded-lg focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange text-sm text-forge-gray-900 bg-white placeholder:text-forge-gray-400 transition-colors" 
                  />
                </div>
              </div>
            </div>

            {/* ── 3. Document Upload ── */}
            <div className="space-y-4 pt-4 border-t border-forge-gray-100">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-forge-gray-900">
                  Document Upload
                </h3>
                <p className="text-xs font-medium text-forge-gray-500 mt-0.5">
                  Photos or PDFs, up to 8MB each.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Document Front */}
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                    Document Front
                  </span>
                  
                  <input 
                    ref={frontInputRef}
                    type="file" 
                    accept="image/*,application/pdf" 
                    className="hidden" 
                    onChange={(e) => handleFileChange("front", e.target.files?.[0] || null)}
                  />

                  <div 
                    onClick={() => frontInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border-2 transition-all p-4 text-center flex flex-col items-center justify-center min-h-[120px] ${
                      files.front 
                        ? "border-market-up/60 bg-market-up/5" 
                        : "border-dashed border-forge-gray-200 bg-forge-gray-50 hover:border-forge-orange hover:bg-forge-orange-wash"
                    }`}
                  >
                    {files.front ? (
                      <>
                        <FileText size={24} className="text-market-up mb-1.5" />
                        <p className="text-xs font-bold text-forge-gray-900 truncate max-w-[180px]">{files.front.name}</p>
                        <p className="text-[11px] font-semibold text-market-up mt-1">Ready for verification</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={24} className="text-forge-gray-400 mb-1.5" />
                        <span className="text-xs font-bold text-forge-gray-700">Choose a file</span>
                        <span className="text-[10px] text-forge-gray-500 mt-0.5">Click to browse</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-forge-gray-500">
                    Upload the front of your ID document
                  </p>
                </div>

                {/* Document Back */}
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                    Document Back
                  </span>

                  <input 
                    ref={backInputRef}
                    type="file" 
                    accept="image/*,application/pdf" 
                    className="hidden" 
                    onChange={(e) => handleFileChange("back", e.target.files?.[0] || null)}
                  />

                  <div 
                    onClick={() => backInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border-2 transition-all p-4 text-center flex flex-col items-center justify-center min-h-[120px] ${
                      files.back 
                        ? "border-market-up/60 bg-market-up/5" 
                        : "border-dashed border-forge-gray-200 bg-forge-gray-50 hover:border-forge-orange hover:bg-forge-orange-wash"
                    }`}
                  >
                    {files.back ? (
                      <>
                        <FileText size={24} className="text-market-up mb-1.5" />
                        <p className="text-xs font-bold text-forge-gray-900 truncate max-w-[180px]">{files.back.name}</p>
                        <p className="text-[11px] font-semibold text-market-up mt-1">Ready for verification</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={24} className="text-forge-gray-400 mb-1.5" />
                        <span className="text-xs font-bold text-forge-gray-700">Choose a file</span>
                        <span className="text-[10px] text-forge-gray-500 mt-0.5">Click to browse</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-forge-gray-500">
                    Leave empty for a passport
                  </p>
                </div>

                {/* Selfie */}
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                    Selfie
                  </span>

                  <input 
                    ref={selfieInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileChange("selfie", e.target.files?.[0] || null)}
                  />

                  <div 
                    onClick={() => selfieInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border-2 transition-all p-4 text-center flex flex-col items-center justify-center min-h-[120px] ${
                      files.selfie 
                        ? "border-market-up/60 bg-market-up/5" 
                        : "border-dashed border-forge-gray-200 bg-forge-gray-50 hover:border-forge-orange hover:bg-forge-orange-wash"
                    }`}
                  >
                    {files.selfie ? (
                      <>
                        <Camera size={24} className="text-market-up mb-1.5" />
                        <p className="text-xs font-bold text-forge-gray-900 truncate max-w-[180px]">{files.selfie.name}</p>
                        <p className="text-[11px] font-semibold text-market-up mt-1">Ready for verification</p>
                      </>
                    ) : (
                      <>
                        <Camera size={24} className="text-forge-gray-400 mb-1.5" />
                        <span className="text-xs font-bold text-forge-gray-700">Choose a file</span>
                        <span className="text-[10px] text-forge-gray-500 mt-0.5">Click to browse</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-forge-gray-500">
                    Upload a clear photo of yourself
                  </p>
                </div>

              </div>
            </div>

            {/* ── 4. Submit Button ── */}
            <div className="pt-6">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-forge-orange text-white font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] flex items-center justify-center gap-2 text-base disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting Verification...
                  </>
                ) : (
                  <>
                    Submit KYC Verification
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
