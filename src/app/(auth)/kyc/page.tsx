"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, ShieldCheck, ArrowRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function KYCPage() {
  const router = useRouter();
  const { completeKYC, setToast } = useStore();
  const [qualifier, setQualifier] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const qualifiers = [
    { id: "income", title: "Income", desc: "Individual income > $200k (or $300k joint) in each of the last two years." },
    { id: "networth", title: "Net Worth", desc: "Net worth > $1M, excluding primary residence." },
    { id: "license", title: "Professional License", desc: "Active Series 7, 65, or 82 license." },
  ];

  return (
    <div className="clean-card p-8 sm:p-10 w-full max-w-2xl mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="mb-8 border-b border-forge-gray-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-forge-gray-100 text-forge-gray-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck size={14} />
          SEC Rule 501 Compliance
        </div>
        <h1 className="font-display font-extrabold text-2xl text-forge-gray-900 mb-2">
          Accreditation Verification
        </h1>
        <p className="text-sm font-medium text-forge-gray-600">
          To trade secondary shares on Forge, we are required by the SEC to verify your accredited investor status.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Step 1: Qualification Method */}
        <section>
          <h2 className="text-sm font-bold text-forge-gray-900 uppercase tracking-wider mb-4">1. How do you qualify?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {qualifiers.map((q) => (
              <button
                key={q.id}
                onClick={() => setQualifier(q.id)}
                className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all ${
                  qualifier === q.id 
                    ? "border-forge-orange bg-forge-orange-wash" 
                    : "border-forge-gray-200 hover:border-forge-orange/50 hover:bg-forge-gray-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-forge-gray-900">{q.title}</span>
                  {qualifier === q.id && <CheckCircle2 size={16} className="text-forge-orange" />}
                </div>
                <span className="text-xs font-medium text-forge-gray-600 leading-snug">{q.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Document Upload */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-sm font-bold text-forge-gray-900 uppercase tracking-wider">2. Upload Supporting Documents</h2>
            <span className="text-xs font-medium text-forge-gray-500">PDF, JPG, PNG (Max 10MB)</span>
          </div>

          <div className="relative group">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all ${
              file ? "border-market-up bg-market-up/5" : "border-forge-gray-300 bg-forge-gray-50 group-hover:border-forge-orange group-hover:bg-forge-orange-wash"
            }`}>
              {file ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-market-up/10 text-market-up flex items-center justify-center mb-3">
                    <FileText size={24} />
                  </div>
                  <p className="font-bold text-sm text-forge-gray-900">{file.name}</p>
                  <p className="text-xs font-medium text-market-up mt-1">Ready to submit</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white border border-forge-gray-200 text-forge-gray-400 flex items-center justify-center mb-3 group-hover:text-forge-orange group-hover:border-forge-orange transition-colors">
                    <UploadCloud size={24} />
                  </div>
                  <p className="font-bold text-sm text-forge-gray-900">Click or drag document to upload</p>
                  <p className="text-xs font-medium text-forge-gray-500 mt-1">W-2, K-1, Bank Statement, or Option Grant Notice</p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Action */}
        <div className="pt-4 flex justify-end">
          <button 
            onClick={() => {
              completeKYC();
              setToast("Accreditation verified. You are now eligible to trade pre-IPO shares.");
              router.push("/dashboard");
            }}
            disabled={!qualifier || !file}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold transition-all ${
              qualifier && file 
                ? "bg-forge-orange text-white hover:bg-forge-orange-hover shadow-[0_4px_14px_rgba(255,90,0,0.25)]" 
                : "bg-forge-gray-100 text-forge-gray-400 cursor-not-allowed"
            }`}
          >
            Submit for Review
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
