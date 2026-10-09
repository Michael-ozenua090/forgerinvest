"use client";

import Link from "next/link";
import { 
  Send,
  LifeBuoy,
  Clock
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function SupportPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="clean-card p-8 bg-forge-gray-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm font-bold uppercase tracking-wider text-forge-orange mb-2">Support</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
            How can we help?
          </h1>
          <p className="font-medium text-forge-gray-400 max-w-lg">
            Get in touch with our team for assistance with your account, wallet, or investments.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-forge-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Contact Form ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 clean-card p-6 sm:p-8">
          <form 
            className="space-y-6" 
            onSubmit={(e) => {
              e.preventDefault();
              alert("Support request submitted!");
            }}
          >
            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-forge-gray-900 mb-2">
                Subject
              </label>
              <input 
                id="subject"
                type="text"
                required
                className="w-full bg-white border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                placeholder="What is your request about?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-forge-gray-900 mb-2">
                How can we help?
              </label>
              <textarea 
                id="message"
                required
                rows={7}
                maxLength={5000}
                className="w-full bg-white border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] resize-y"
                placeholder="Describe your issue in detail..."
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="inline-flex items-center gap-2 bg-forge-orange text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)]"
            >
              <Send size={16} />
              Send Message
            </button>
          </form>
        </div>

        {/* ── Sidebar ────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          
          <div className="clean-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-forge-orange-wash flex items-center justify-center text-forge-orange">
                <LifeBuoy size={20} />
              </div>
              <h2 className="font-display font-bold text-lg text-forge-gray-900">Quick Help</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link href={ROUTES.marketing.helpCenter} className="text-sm font-bold text-forge-gray-600 hover:text-forge-orange transition-colors">
                  Browse the Help Center
                </Link>
              </li>
              <li>
                <Link href={ROUTES.auth.kyc} className="text-sm font-bold text-forge-gray-600 hover:text-forge-orange transition-colors">
                  Verify your identity (KYC)
                </Link>
              </li>
              <li>
                <Link href={ROUTES.app.wallet.home} className="text-sm font-bold text-forge-gray-600 hover:text-forge-orange transition-colors">
                  Fund your wallet
                </Link>
              </li>
              <li>
                <Link href={ROUTES.app.settings} className="text-sm font-bold text-forge-gray-600 hover:text-forge-orange transition-colors">
                  Update your account
                </Link>
              </li>
            </ul>
          </div>

          <div className="clean-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-forge-gray-50 border border-forge-gray-200 flex items-center justify-center text-forge-gray-500">
                <Clock size={20} />
              </div>
              <h2 className="font-display font-bold text-lg text-forge-gray-900">Response Times</h2>
            </div>
            <p className="text-sm font-medium text-forge-gray-600">
              Most messages are answered within <span className="font-bold text-forge-gray-900">one business day</span>. For urgent inquiries, please ensure your subject line reflects the priority.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
