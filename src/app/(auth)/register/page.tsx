"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCircle, Building, Briefcase } from "lucide-react";

type Persona = "individual" | "employee" | "institutional" | null;

export default function RegisterPage() {
  const router = useRouter();
  const [persona, setPersona] = useState<Persona>(null);

  const personas = [
    {
      id: "individual",
      title: "Individual Investor",
      desc: "Accredited individuals buying/selling secondary shares.",
      icon: UserCircle
    },
    {
      id: "employee",
      title: "Startup Shareholder",
      desc: "Employees or founders looking for liquidity.",
      icon: Briefcase
    },
    {
      id: "institutional",
      title: "Institutional Buyer",
      desc: "Funds, family offices, and wealth managers.",
      icon: Building
    }
  ];

  return (
    <div className="clean-card p-8 sm:p-10 w-full shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-2xl text-forge-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm font-medium text-forge-gray-600">
          {persona ? "Complete your profile details below." : "First, how will you be using Forge?"}
        </p>
      </div>

      {!persona ? (
        <div className="space-y-4">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id as Persona)}
              className="w-full flex items-start gap-4 p-4 rounded-xl border border-forge-gray-200 hover:border-forge-orange hover:bg-forge-orange-wash transition-all text-left"
            >
              <div className="mt-0.5 text-forge-orange">
                <p.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-forge-gray-900">{p.title}</h3>
                <p className="text-xs font-medium text-forge-gray-600 mt-1">{p.desc}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); router.push('/verify-email'); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="firstName">
                First Name
              </label>
              <input className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange" id="firstName" required type="text" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange" id="lastName" required type="text" />
            </div>
          </div>

          {persona === "institutional" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="firmName">
                Firm Name
              </label>
              <input className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange" id="firmName" required type="text" />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="email">
              Work Email
            </label>
            <input className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange" id="email" required type="email" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2" htmlFor="password">
              Password
            </label>
            <input className="w-full border border-forge-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange" id="password" minLength={8} required type="password" />
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={() => setPersona(null)}
              className="px-4 py-3.5 bg-forge-gray-100 text-forge-gray-600 font-bold rounded-lg hover:bg-forge-gray-200 transition-colors"
            >
              Back
            </button>
            <button type="submit" className="flex-1 text-center py-3.5 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)]">
              Create Account
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-forge-gray-100 text-center text-sm font-medium text-forge-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-forge-orange hover:text-forge-orange-hover font-bold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
