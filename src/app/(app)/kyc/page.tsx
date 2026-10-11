"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck, CheckCircle2, Loader2, FileCheck } from "lucide-react";
import { useStore } from "@/lib/store";

export default function KYCPage() {
  const { user, completeKYC, setToast } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  // Auto pre-populate user name if available in store
  useEffect(() => {
    if (user?.name) {
      const parts = user.name.split(" ");
      setFormData((prev) => ({
        ...prev,
        first_name: prev.first_name || parts[0] || "",
        last_name: prev.last_name || parts.slice(1).join(" ") || "",
        nationality: prev.nationality || "United States",
        country: prev.country || "United States",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      completeKYC();
      setIsSubmitting(false);
      setSubmitted(true);
      setToast("KYC verification documents submitted successfully.");
    }, 1000);
  };

  const isVerified = user.kycStatus === "verified" || submitted;
  const statusDisplay = isVerified ? "Verified" : "Not Submitted";

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
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-xl lg:w-64">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-forge-gray-300 mb-1">
                      Verification Status
                    </p>
                    <p className="text-lg font-light text-white">
                      {statusDisplay}
                    </p>
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <ShieldCheck
                      className={isVerified ? "text-market-up" : "text-white"}
                      size={24}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Submission Confirmation Banner ── */}
      {submitted && (
        <div className="rounded-xl border border-market-up/30 bg-market-up/10 p-4 text-market-up flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 size={24} className="shrink-0" />
          <div>
            <p className="font-bold text-sm">KYC Verification Submitted Successfully</p>
            <p className="text-xs opacity-90">Your account is verified. You now have full clearance to withdraw matured capital and interest payouts.</p>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting KYC Verification...
                </>
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
