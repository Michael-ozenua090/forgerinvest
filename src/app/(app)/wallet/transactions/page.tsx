"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpFromLine, ArrowDownToLine, RefreshCw, CheckCircle2, History } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCrypto } from "@/lib/format";

export default function TransactionsLedgerPage() {
  const { transactions } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT": return <ArrowDownToLine size={18} className="text-forge-orange" />;
      case "WITHDRAW": return <ArrowUpFromLine size={18} className="text-forge-gray-900" />;
      case "BUY":
      case "BUY_FUND": return <RefreshCw size={18} className="text-forge-gray-500" />;
      case "SELL": return <RefreshCw size={18} className="text-forge-gray-500" />;
      default: return <History size={18} className="text-forge-gray-500" />;
    }
  };

  const getFormat = (type: string, amount: number, currency: any) => {
    const formatted = formatCrypto(amount, currency);
    if (type === "DEPOSIT" || type === "SELL") {
      return <span className="text-market-up font-bold">+{formatted}</span>;
    }
    return <span className="text-forge-gray-900 font-bold">-{formatted}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/wallet" className="inline-flex items-center gap-2 text-sm font-bold text-forge-gray-500 hover:text-forge-gray-900 transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Wallet
          </Link>
          <h1 className="font-display font-extrabold text-3xl text-forge-gray-900">
            Transaction Ledger
          </h1>
        </div>
      </div>

      <div className="clean-card overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-forge-gray-500 flex flex-col items-center">
            <History size={48} className="text-forge-gray-200 mb-4" />
            <p className="font-bold">No transactions found.</p>
            <p className="text-sm mt-1">Your deposits, withdrawals, and trades will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-forge-gray-50/50 border-b border-forge-gray-100">
                <th className="py-4 px-6 text-xs font-bold text-forge-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-bold text-forge-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-bold text-forge-gray-500 uppercase tracking-wider">Asset / Ref</th>
                <th className="py-4 px-6 text-xs font-bold text-forge-gray-500 uppercase tracking-wider text-right">Amount</th>
                <th className="py-4 px-6 text-xs font-bold text-forge-gray-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-forge-gray-50/50 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <p className="text-sm font-bold text-forge-gray-900">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs font-bold text-forge-gray-400">
                      {new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white border border-forge-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                        {getIcon(tx.type)}
                      </div>
                      <span className="text-sm font-bold text-forge-gray-900 capitalize">
                        {tx.type.replace("_", " ").toLowerCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-forge-gray-900">{tx.asset || tx.currency}</span>
                  </td>
                  <td className="py-4 px-6 text-right tabular-nums text-sm">
                    {getFormat(tx.type, Math.abs(tx.amount), tx.currency)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-market-up/10 text-market-up text-[10px] font-bold uppercase tracking-wider rounded-md">
                      <CheckCircle2 size={12} /> {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
