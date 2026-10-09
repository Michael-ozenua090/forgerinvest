"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Building2, AlertCircle, Info, TrendingUp, CheckCircle2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { convertFiatToCrypto, formatCrypto, convertCryptoToFiat } from "@/lib/format";


// ─── SVG Chart ────────────────────────────────────────────────────────────────

function SVGTerminalChart() {
  return (
    <div className="relative w-full h-[250px] mt-6 mb-2">
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[1,2,3,4,5].map(i => <div key={i} className="w-full border-b border-forge-gray-100 h-0" />)}
      </div>

      {/* Chart Line */}
      <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 250">
        <defs>
          <linearGradient id="termGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-forge-orange)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-forge-orange)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path 
          d="M 0,200 L 200,190 L 400,150 L 600,160 L 800,90 L 1000,50 L 1000,250 L 0,250 Z" 
          fill="url(#termGradient)" 
        />
        <path 
          d="M 0,200 L 200,190 L 400,150 L 600,160 L 800,90 L 1000,50" 
          fill="none" 
          stroke="var(--color-forge-orange)" 
          strokeWidth="3" 
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="1000" cy="50" r="5" fill="var(--color-forge-white)" stroke="var(--color-forge-orange)" strokeWidth="3" />
      </svg>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TradingTerminalPage() {
  const params = useParams();
  const symbol = (params.symbol as string).toUpperCase();
  const { user, executeTrade, setToast, stocks, activeCurrency } = useStore();
  const company = stocks.find(s => s.symbol === symbol) || { name: symbol, sector: "Technology", price: 100, change: "+0.0%", valuation: "N/A", round: "N/A" };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock Market Data (Crypto dynamically converted)
  const currentPriceCrypto = convertFiatToCrypto(company.price, activeCurrency);
  const minimumLotSizeFiat = 25000;
  const brokerageFeeRate = 0.01; // 1.0%

  // Order State
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"limit" | "ioi">("limit");
  const [shares, setShares] = useState<string>("");
  const [limitPrice, setLimitPrice] = useState<string>(currentPriceCrypto.toFixed(5)); // Default to some precision

  // Calculations
  const numShares = parseInt(shares) || 0;
  const priceTarget = orderType === "limit" ? parseFloat(limitPrice) || 0 : currentPriceCrypto;
  const totalValueCrypto = numShares * priceTarget;
  const totalValueFiat = convertCryptoToFiat(totalValueCrypto, activeCurrency);
  const meetsMinimum = totalValueFiat >= minimumLotSizeFiat;
  const fee = meetsMinimum ? totalValueCrypto * brokerageFeeRate : 0;
  const netTotal = side === "buy" ? totalValueCrypto + fee : totalValueCrypto - fee;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* ── Terminal Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-forge-gray-200 flex items-center justify-center text-forge-gray-900 shadow-sm">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 flex items-center gap-3">
              {company.name} <span className="px-2 py-0.5 bg-forge-gray-100 text-forge-gray-500 text-sm font-bold uppercase rounded-md">{symbol}</span>
            </h1>
            <p className="text-sm font-bold text-forge-gray-500 uppercase tracking-wider mt-1">{company.sector}</p>
          </div>
        </div>
        
        <div className="flex items-end gap-6 text-right">
          <div>
            <p className="text-xs font-bold text-forge-gray-500 uppercase tracking-wider mb-1">Implied Valuation</p>
            <p className="font-display font-bold text-xl text-forge-gray-900">{company.valuation}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-forge-gray-500 uppercase tracking-wider mb-1">Forge Price™</p>
            <div className="flex items-end gap-2">
              <p className="tabular-nums font-display font-bold text-xl text-forge-gray-900">{formatCrypto(currentPriceCrypto, activeCurrency)}</p>
              <span className={`text-xs font-bold mb-0.5 ${company.change.startsWith('+') ? 'text-market-up' : 'text-market-down'}`}>{company.change}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Main Chart & Intel ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="clean-card p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-forge-gray-900">Valuation History</h2>
              <div className="flex gap-2">
                {["1Y", "3Y", "MAX"].map(tf => (
                  <button key={tf} className="px-3 py-1 text-xs font-bold rounded bg-forge-gray-50 text-forge-gray-600 hover:bg-forge-gray-100 transition-colors">
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <SVGTerminalChart />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="clean-card p-6">
              <h3 className="font-bold text-forge-gray-900 mb-4 flex items-center gap-2"><Info size={16} /> Capitalization</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-forge-gray-100 pb-2"><span className="text-forge-gray-500 font-medium">Series H</span><span className="font-bold text-forge-gray-900">$38.0B Val</span></li>
                <li className="flex justify-between border-b border-forge-gray-100 pb-2"><span className="text-forge-gray-500 font-medium">Series G</span><span className="font-bold text-forge-gray-900">$28.0B Val</span></li>
                <li className="flex justify-between"><span className="text-forge-gray-500 font-medium">Common Shares</span><span className="font-bold text-forge-gray-900">18% Pool</span></li>
              </ul>
            </div>
            <div className="clean-card p-6">
              <h3 className="font-bold text-forge-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={16} /> Liquidity Profile</h3>
              <div className="p-4 rounded-xl bg-market-up/10 border border-market-up/20">
                <p className="font-bold text-market-up mb-1 flex items-center gap-2"><CheckCircle2 size={16} /> High Institutional Demand</p>
                <p className="text-xs font-medium text-market-up/80 leading-relaxed">
                  Strong buy-side IOI depth. Average ROFR clearance time is currently 14 days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action Panel ─────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="clean-card p-6 sticky top-24 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            <h3 className="font-display font-bold text-lg text-forge-gray-900 mb-4">Trade Shares</h3>
            <button onClick={() => { setSide('buy'); setIsModalOpen(true); setShowSuccess(false); }} className="w-full py-3 mb-3 bg-market-up text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(0,184,115,0.25)]">
              Buy Shares
            </button>
            <button onClick={() => { setSide('sell'); setIsModalOpen(true); setShowSuccess(false); }} className="w-full py-3 bg-white border border-forge-gray-200 text-forge-gray-900 font-bold rounded-lg hover:bg-forge-gray-50 transition-colors">
              Sell Shares
            </button>
            <p className="text-center text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider mt-4">
              Requires Minimum $25k Order
            </p>
          </div>
        </div>

      </div>

      {/* ── Trade Order Modal ────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-forge-gray-100 flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-forge-gray-900">
                {showSuccess ? "Order Confirmed" : `Place ${side === 'buy' ? 'Buy' : 'Sell'} Order`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-forge-gray-400 hover:text-forge-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {showSuccess ? (
                <div className="text-center py-8 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-market-up/10 text-market-up rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-forge-gray-900 mb-2">Order Successfully Submitted</h3>
                  <p className="text-sm text-forge-gray-600 mb-8">
                    Your indication of interest for {numShares} shares of {company.name} has been recorded and routed to our execution desk.
                  </p>
                  <div className="space-y-3">
                    <Link 
                      href={ROUTES.app.stocks.portfolio}
                      className="flex items-center justify-center w-full py-3.5 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)]"
                    >
                      View in Portfolio
                    </Link>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-3 bg-forge-gray-100 text-forge-gray-600 font-bold rounded-lg hover:bg-forge-gray-200 transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                  {/* Order Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600 mb-2">Order Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setOrderType("limit")} className={`py-2 text-sm font-bold rounded-lg border-2 transition-all ${orderType === 'limit' ? 'border-forge-orange text-forge-orange bg-forge-orange-wash' : 'border-forge-gray-200 text-forge-gray-600 hover:border-forge-gray-300'}`}>
                        Limit {side === 'buy' ? 'Bid' : 'Ask'}
                      </button>
                      <button type="button" onClick={() => setOrderType("ioi")} className={`py-2 text-sm font-bold rounded-lg border-2 transition-all ${orderType === 'ioi' ? 'border-forge-orange text-forge-orange bg-forge-orange-wash' : 'border-forge-gray-200 text-forge-gray-600 hover:border-forge-gray-300'}`}>
                        Market IOI
                      </button>
                    </div>
                  </div>

                  {/* Shares */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600">Shares</label>
                    </div>
                    <input 
                      type="number" 
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      placeholder="0"
                      className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-lg px-4 py-3 text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white transition-all"
                    />
                  </div>

                  {/* Limit Price */}
                  {orderType === "limit" && (
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-600">Price per share</label>
                        <span className="text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider">Forge: {formatCrypto(currentPriceCrypto, activeCurrency)}</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-forge-gray-500 font-bold">{activeCurrency}</div>
                        <input 
                          type="number" 
                          step="0.00001"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-lg pl-14 pr-4 py-3 text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Total & Validation */}
                  <div className="bg-forge-gray-50 p-4 rounded-xl border border-forge-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-forge-gray-600">Subtotal</span>
                      <span className="font-bold tabular-nums">{formatCrypto(totalValueCrypto, activeCurrency)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-forge-gray-200 pb-2">
                      <span className="font-medium text-forge-gray-600">Estimated Fee (1.0%)</span>
                      <span className="font-bold tabular-nums">{formatCrypto(fee, activeCurrency)}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="font-bold text-forge-gray-900">Estimated Total</span>
                      <span className="font-display font-bold text-lg tabular-nums text-forge-gray-900">{formatCrypto(netTotal, activeCurrency)}</span>
                    </div>
                  </div>

                  {/* Validation Warning */}
                  {shares !== "" && !meetsMinimum && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-bold">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <p>Order minimum not met. Standard private placements require a minimum of $25,000.</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button 
                    type="button"
                    onClick={() => {
                      executeTrade(side === "buy" ? "BUY" : "SELL", symbol, company.name, numShares, priceTarget);
                      setToast("Trade order submitted successfully");
                      setShowSuccess(true);
                      setShares("");
                    }}
                    disabled={shares === "" || !meetsMinimum}
                    className={`w-full py-4 rounded-lg font-bold transition-all flex justify-center items-center gap-2 ${
                      shares !== "" && meetsMinimum 
                        ? "bg-forge-orange text-white hover:bg-forge-orange-hover shadow-[0_4px_14px_rgba(255,90,0,0.25)]" 
                        : "bg-forge-gray-100 text-forge-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Submit {orderType === 'limit' ? 'Limit Order' : 'Indication (IOI)'}
                  </button>
                  <p className="text-center text-[10px] font-bold text-forge-gray-400 uppercase tracking-wider">
                    Not a binding contract
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
