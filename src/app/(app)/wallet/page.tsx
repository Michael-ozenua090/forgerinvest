"use client";

import { useState } from "react";
import { 
  Wallet, 
  ShieldCheck, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Building2, 
  Plus,
  Trash2,
  Copy,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { useStore } from "@/lib/store";
import { CurrencyType, formatCrypto } from "@/lib/format";
import Link from "next/link";

const CURRENCY_LIST: CurrencyType[] = ['USD', 'GBP', 'BTC', 'ETH', 'SOL'];

export default function WalletPage() {
  const { 
    getBalance, 
    activeCurrency, 
    setDepositModalOpen,
    currentUser,
    addLinkedWallet,
    removeLinkedWallet
  } = useStore();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState<CurrencyType>(activeCurrency);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const linkedWallets = currentUser?.linkedWallets || [];

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) {
      setFormError("Please provide an account label.");
      return;
    }
    if (!newAddress.trim() || newAddress.trim().length < 6) {
      setFormError("Please provide a valid destination address or account.");
      return;
    }

    addLinkedWallet(newCurrency, newLabel.trim(), newAddress.trim());
    setNewLabel("");
    setNewAddress("");
    setFormError(null);
    setIsLinkModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 relative">
      
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-display font-extrabold text-3xl text-forge-gray-900 mb-1">
          Crypto Wallet
        </h1>
        <p className="font-medium text-forge-gray-600">
          Manage your digital assets and designated payout destination accounts.
        </p>
      </div>

      {/* ── Main Balance Card ─────────────────────────────────────────── */}
      <div className="clean-card p-8 sm:p-10 bg-gradient-to-br from-forge-gray-900 to-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Wallet size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-market-up/20 border border-market-up/30 text-market-up rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <ShieldCheck size={14} />
            Cold Storage Secured
          </div>
          
          <p className="text-sm font-bold uppercase tracking-wider text-forge-gray-400 mb-2">Available Balance ({activeCurrency})</p>
          <p className="tabular-nums font-display font-extrabold text-5xl sm:text-6xl text-white mb-8">
            {formatCrypto(getBalance(activeCurrency), activeCurrency)}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setDepositModalOpen(true)}
              className="px-6 py-3 bg-forge-orange text-white font-bold rounded-lg hover:bg-forge-orange-hover transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.3)] flex items-center gap-2"
            >
              <ArrowDownToLine size={18} /> Deposit Funds
            </button>
            <Link 
              href="/wallet/withdraw"
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2"
            >
              <ArrowUpFromLine size={18} /> Withdraw
            </Link>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4">
            <Link 
              href="/wallet/transactions"
              className="text-sm font-bold text-forge-gray-400 hover:text-white transition-colors"
            >
              View Transaction Ledger →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Connected & Linked Wallets ─────────────────────────────────── */}
      <div className="clean-card overflow-hidden bg-white rounded-2xl border border-forge-gray-200 shadow-sm">
        <div className="p-6 border-b border-forge-gray-100 flex justify-between items-center">
          <div>
            <h2 className="font-display font-bold text-xl text-forge-gray-900">Linked Destination Accounts</h2>
            <p className="text-xs text-forge-gray-500 mt-0.5">External addresses verified for capital and profits withdrawals</p>
          </div>
          <button 
            onClick={() => {
              setNewCurrency(activeCurrency);
              setFormError(null);
              setIsLinkModalOpen(true);
            }}
            className="text-xs font-bold text-white bg-forge-gray-900 hover:bg-black px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> Link Account
          </button>
        </div>

        {linkedWallets.length === 0 ? (
          <div className="p-12 text-center text-forge-gray-500">
            <Wallet size={36} className="mx-auto text-forge-gray-300 mb-2" />
            <p className="font-bold text-forge-gray-700">No destination wallets linked yet</p>
            <p className="text-xs text-forge-gray-400 mt-1">Add your personal wallet or bank accounts to receive withdrawals.</p>
          </div>
        ) : (
          <div className="divide-y divide-forge-gray-100">
            {linkedWallets.map((wallet) => {
              const isFiat = wallet.currency === 'USD' || wallet.currency === 'GBP';
              return (
                <div key={wallet.id} className="p-5 flex items-center justify-between hover:bg-forge-gray-50/60 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-forge-gray-100 text-forge-gray-700 flex items-center justify-center shrink-0 border border-forge-gray-200">
                      {isFiat ? <Building2 size={22} /> : <Wallet size={22} />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-forge-gray-900 text-sm truncate">{wallet.label}</p>
                        <span className="px-2 py-0.5 bg-forge-orange-wash text-forge-orange text-[10px] font-bold rounded uppercase tracking-wider">
                          {wallet.currency}
                        </span>
                        {wallet.isDefault && (
                          <span className="px-1.5 py-0.5 bg-forge-gray-100 text-forge-gray-600 text-[10px] font-bold rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs font-mono text-forge-gray-500 truncate max-w-xs" title={wallet.address}>
                          {wallet.address}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopy(wallet.address, wallet.id)}
                          className="text-forge-gray-400 hover:text-forge-gray-700 shrink-0"
                          title="Copy address"
                        >
                          {copiedId === wallet.id ? <Check size={13} className="text-market-up" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pl-3">
                    <span className="px-2.5 py-1 bg-market-up/10 text-market-up text-[10px] font-bold uppercase tracking-wider rounded-md">
                      Verified
                    </span>
                    <button
                      type="button"
                      onClick={() => removeLinkedWallet(wallet.id)}
                      className="p-2 text-forge-gray-400 hover:text-market-down hover:bg-market-down/10 rounded-lg transition-colors"
                      title="Remove linked wallet"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Link Account Modal ─────────────────────────────────────────── */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setIsLinkModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-forge-gray-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-forge-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forge-orange-wash text-forge-orange flex items-center justify-center border border-forge-orange/20">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-forge-gray-900">Link Destination Account</h3>
                  <p className="text-xs text-forge-gray-500">Authorize an external address for cashouts</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1.5 text-forge-gray-400 hover:text-forge-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddWallet} className="space-y-4">
              {formError && (
                <div className="p-3 bg-market-down/10 border border-market-down/20 rounded-xl flex items-center gap-2 text-xs font-semibold text-market-down">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                  Asset / Currency
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {CURRENCY_LIST.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewCurrency(c)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        newCurrency === c
                          ? "bg-forge-orange text-white border-forge-orange shadow-sm"
                          : "bg-forge-gray-50 text-forge-gray-700 border-forge-gray-200 hover:bg-forge-gray-100"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                  Account / Wallet Label
                </label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Ledger Cold Vault, Metamask, Chase Checking"
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                  Destination Address or IBAN
                </label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. 0x... / bc1q... / GB29X..."
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl px-4 py-3 text-sm font-mono font-semibold text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-forge-gray-100">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-forge-gray-600 hover:text-forge-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-forge-orange text-white text-xs font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-sm"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
