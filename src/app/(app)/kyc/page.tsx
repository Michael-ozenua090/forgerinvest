"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  FileCheck, 
  Clock, 
  AlertCircle,
  ShieldAlert
} from "lucide-react";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

const fileToDataUrl = (file: File | null): Promise<string | null> => {
  if (!file) return Promise.resolve(null);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

export default function KYCPage() {
  const { user, currentUser, completeKYC, setToast } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dbKycStatus, setDbKycStatus] = useState<string | null>(null);

  // Form Fields matching exact IDs from TESA kyc.html
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    nationality: "",
    document_type: "passport",
    document_number: "",
    document_expiry_date: "",
    phone_number: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state_province: "",
    postal_code: "",
    country: "",
  });

  // File uploads matching Document Front, Document Back, and Selfie
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // Auto pre-populate user name from store and load real status from Supabase
  useEffect(() => {
    const activeUser = currentUser || user;
    if (activeUser?.name) {
      const parts = activeUser.name.split(" ");
      setFormData((prev) => ({
        ...prev,
        first_name: prev.first_name || parts[0] || "",
        last_name: prev.last_name || parts.slice(1).join(" ") || "",
        nationality: prev.nationality || "United States",
        country: prev.country || "United States",
      }));
    }

    async function loadUserKycFromSupabase() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('kyc_status, name')
            .eq('id', authUser.id)
            .maybeSingle();

          if (profile?.kyc_status) {
            setDbKycStatus(profile.kyc_status);
          }
          if (profile?.name) {
            const parts = profile.name.split(" ");
            setFormData((prev) => ({
              ...prev,
              first_name: prev.first_name || parts[0] || "",
              last_name: prev.last_name || parts.slice(1).join(" ") || "",
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load KYC status from Supabase:", err);
      }
    }

    loadUserKycFromSupabase();
  }, [currentUser, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (!authUser || authError) {
        setToast("Please log in to submit identity verification.");
        setIsSubmitting(false);
        return;
      }

      // 1. Convert uploaded ID documents & selfie to data URLs
      const [frontUrl, backUrl, selfieUrl] = await Promise.all([
        fileToDataUrl(frontFile),
        fileToDataUrl(backFile),
        fileToDataUrl(selfieFile),
      ]);

      // 2. Insert into kyc_submissions table
      const { error: insertError } = await supabase
        .from('kyc_submissions')
        .insert({
          user_id: authUser.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth || null,
          nationality: formData.nationality,
          document_type: formData.document_type,
          document_number: formData.document_number,
          document_expiry_date: formData.document_expiry_date || null,
          phone_number: formData.phone_number,
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          city: formData.city,
          state_province: formData.state_province,
          postal_code: formData.postal_code,
          country: formData.country,
          front_file_url: frontUrl,
          back_file_url: backUrl,
          selfie_file_url: selfieUrl,
          status: 'pending',
        });

      if (insertError) {
        console.error("KYC insert error:", insertError);
        setToast(`Submission failed: ${insertError.message}`);
        setIsSubmitting(false);
        return;
      }

      // 3. Update profile kyc_status to 'pending'
      await supabase
        .from('profiles')
        .update({ 
          kyc_status: 'pending',
          kyc_data: formData
        })
        .eq('id', authUser.id);

      // 4. Update local state
      completeKYC(formData);
      setDbKycStatus('pending');
      setSubmitted(true);
      setToast("KYC verification documents submitted for admin review.");
    } catch (err: any) {
      console.error("KYC unexpected error:", err);
      setToast(err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentKycStatus = submitted 
    ? 'pending' 
    : (dbKycStatus || currentUser?.kycStatus || user?.kycStatus || 'unverified');

  const statusTitleDisplay = 
    currentKycStatus === 'verified'
      ? "Verified"
      : currentKycStatus === 'pending'
      ? "Pending Review"
      : currentKycStatus === 'rejected'
      ? "Rejected"
      : "Not Submitted";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* ── Top Hero Card (Identical structure to TESA kyc.html theme-hero) ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white mb-6 bg-forge-gray-900 border border-forge-gray-800 shadow-md">
        <div aria-hidden="true" className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-24 translate-x-24"
            style={{ backgroundColor: "rgb(255,255,255)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-12 -translate-x-12"
            style={{ backgroundColor: "rgb(255,255,255)" }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0 lg:flex-1 min-w-0">
              <h1 className="text-xl font-light text-white sm:text-2xl">
                KYC Verification
              </h1>
              <p className="text-forge-gray-300 text-sm mt-1">
                Complete your identity verification to access all features
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:ml-6 lg:justify-end">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-xl lg:w-72">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-forge-gray-300 mb-1">
                      Verification Status
                    </p>
                    <p className="text-lg font-light text-white">
                      {statusTitleDisplay}
                    </p>
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center">
                    {currentKycStatus === 'verified' ? (
                      <ShieldCheck className="text-market-up" size={26} />
                    ) : currentKycStatus === 'pending' ? (
                      <Clock className="text-amber-400" size={24} />
                    ) : currentKycStatus === 'rejected' ? (
                      <ShieldAlert className="text-market-down" size={24} />
                    ) : (
                      <ShieldCheck className="text-white/60" size={24} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Badge Banner ── */}
      {currentKycStatus === 'pending' && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-500 flex items-center gap-3 animate-in fade-in duration-300 shadow-sm">
          <Clock size={22} className="shrink-0 text-amber-400" />
          <div>
            <p className="font-bold text-sm text-amber-400">
              Pending Review — Your documents are currently under review by compliance.
            </p>
            <p className="text-xs text-amber-300/80 mt-0.5">
              Submissions are typically reviewed within 24 hours. You will receive an automated notification once approved.
            </p>
          </div>
        </div>
      )}

      {currentKycStatus === 'verified' && (
        <div className="rounded-xl border border-market-up/30 bg-market-up/10 p-4 text-market-up flex items-center gap-3 animate-in fade-in duration-300 shadow-sm">
          <CheckCircle2 size={22} className="shrink-0 text-market-up" />
          <div>
            <p className="font-bold text-sm">
              Verified — Full withdrawal access authorized.
            </p>
            <p className="text-xs opacity-90 mt-0.5">
              Your identity has been confirmed by our compliance team. Capital withdrawals and profits distributions are fully unlocked.
            </p>
          </div>
        </div>
      )}

      {currentKycStatus === 'rejected' && (
        <div className="rounded-xl border border-market-down/30 bg-market-down/10 p-4 text-market-down flex items-center gap-3 animate-in fade-in duration-300 shadow-sm">
          <AlertCircle size={22} className="shrink-0 text-market-down" />
          <div>
            <p className="font-bold text-sm">
              Rejected — Please re-submit your documents.
            </p>
            <p className="text-xs opacity-90 mt-0.5">
              Your previous submission could not be verified. Please ensure your photo ID is clear, fully visible, and not expired, then submit again.
            </p>
          </div>
        </div>
      )}

      {/* ── Main Form Card (Identical layout to TESA kyc.html) ── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-forge-gray-100">
        <div className="mb-6">
          <h2 className="text-lg font-light text-black mb-1">
            Identity Verification
          </h2>
          <p className="text-sm text-forge-gray-500">
            Please provide your identification documents for verification
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1 & Section 2: Personal & Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-black">
                Personal Information
              </h3>
              
              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="first_name"
                >
                  First Name
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="first_name"
                  required
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="last_name"
                >
                  Last Name
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="last_name"
                  required
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="date_of_birth"
                >
                  Date of Birth
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="date_of_birth"
                  required
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="nationality"
                >
                  Nationality
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="nationality"
                  required
                  type="text"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Document Information */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-black">
                Document Information
              </h3>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="document_type"
                >
                  Document Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="document_type"
                  value={formData.document_type}
                  onChange={handleChange}
                >
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="drivers_license">Driver's License</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="document_number"
                >
                  Document Number
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="document_number"
                  required
                  type="text"
                  value={formData.document_number}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="document_expiry_date"
                >
                  Document Expiry Date (Optional)
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="document_expiry_date"
                  type="date"
                  value={formData.document_expiry_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="phone_number"
                >
                  Phone Number
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="phone_number"
                  required
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

          {/* Section 3: Address Information */}
          <div className="mt-6 space-y-4">
            <h3 className="text-md font-medium text-black">
              Address Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="address_line_1"
                >
                  Address Line 1
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="address_line_1"
                  required
                  type="text"
                  value={formData.address_line_1}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="address_line_2"
                >
                  Address Line 2 (Optional)
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="address_line_2"
                  type="text"
                  value={formData.address_line_2}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="city"
                >
                  City
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="city"
                  required
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="state_province"
                >
                  State/Province (Optional)
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="state_province"
                  type="text"
                  value={formData.state_province}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="postal_code"
                >
                  Postal Code (Optional)
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="postal_code"
                  type="text"
                  value={formData.postal_code}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-forge-gray-700 mb-1"
                  htmlFor="country"
                >
                  Country
                </label>
                <input
                  className="w-full px-3 py-2 border border-forge-gray-300 rounded-lg focus:ring-2 focus:ring-forge-orange focus:border-transparent transition-colors duration-200 text-sm text-forge-gray-900 bg-white"
                  id="country"
                  required
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Document Upload */}
          <div className="mt-6 space-y-4">
            <h3 className="text-md font-medium text-black">
              Document Upload
            </h3>
            <p className="text-xs text-forge-gray-500">
              Photos or PDFs, up to 8MB each.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Document Front */}
              <div>
                <span className="block text-sm text-forge-gray-700 mb-1.5">
                  Document Front
                </span>
                <button
                  className="w-full rounded-lg border border-dashed border-forge-gray-300 bg-forge-gray-50 px-3 py-4 text-sm text-forge-gray-600 hover:border-forge-orange hover:text-black disabled:opacity-60 transition-colors flex items-center justify-center gap-2 truncate"
                  type="button"
                  onClick={() => frontInputRef.current?.click()}
                >
                  {frontFile ? (
                    <>
                      <FileCheck size={16} className="text-market-up shrink-0" />
                      <span className="truncate">{frontFile.name}</span>
                    </>
                  ) : (
                    "Choose a file"
                  )}
                </button>
                <input
                  ref={frontInputRef}
                  accept="image/*,application/pdf"
                  className="hidden"
                  type="file"
                  onChange={(e) => setFrontFile(e.target.files?.[0] || null)}
                />
                <p className="mt-1 text-xs text-forge-gray-500">
                  Upload the front of your ID document
                </p>
              </div>

              {/* Document Back */}
              <div>
                <span className="block text-sm text-forge-gray-700 mb-1.5">
                  Document Back
                </span>
                <button
                  className="w-full rounded-lg border border-dashed border-forge-gray-300 bg-forge-gray-50 px-3 py-4 text-sm text-forge-gray-600 hover:border-forge-orange hover:text-black disabled:opacity-60 transition-colors flex items-center justify-center gap-2 truncate"
                  type="button"
                  onClick={() => backInputRef.current?.click()}
                >
                  {backFile ? (
                    <>
                      <FileCheck size={16} className="text-market-up shrink-0" />
                      <span className="truncate">{backFile.name}</span>
                    </>
                  ) : (
                    "Choose a file"
                  )}
                </button>
                <input
                  ref={backInputRef}
                  accept="image/*,application/pdf"
                  className="hidden"
                  type="file"
                  onChange={(e) => setBackFile(e.target.files?.[0] || null)}
                />
                <p className="mt-1 text-xs text-forge-gray-500">
                  Leave empty for a passport
                </p>
              </div>

              {/* Selfie */}
              <div>
                <span className="block text-sm text-forge-gray-700 mb-1.5">
                  Selfie
                </span>
                <button
                  className="w-full rounded-lg border border-dashed border-forge-gray-300 bg-forge-gray-50 px-3 py-4 text-sm text-forge-gray-600 hover:border-forge-orange hover:text-black disabled:opacity-60 transition-colors flex items-center justify-center gap-2 truncate"
                  type="button"
                  onClick={() => selfieInputRef.current?.click()}
                >
                  {selfieFile ? (
                    <>
                      <FileCheck size={16} className="text-market-up shrink-0" />
                      <span className="truncate">{selfieFile.name}</span>
                    </>
                  ) : (
                    "Choose a file"
                  )}
                </button>
                <input
                  ref={selfieInputRef}
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                />
                <p className="mt-1 text-xs text-forge-gray-500">
                  Upload a clear photo of yourself
                </p>
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              className="w-full px-6 py-3 bg-forge-orange text-white font-medium rounded-lg hover:bg-forge-orange-hover transition-colors duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
              type="submit"
              disabled={isSubmitting || currentKycStatus === 'verified' || currentKycStatus === 'pending'}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting KYC Verification...
                </>
              ) : currentKycStatus === 'verified' ? (
                "Identity Verified"
              ) : currentKycStatus === 'pending' ? (
                "Verification In Review"
              ) : currentKycStatus === 'rejected' ? (
                "Re-Submit KYC Verification"
              ) : (
                "Submit KYC Verification"
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
