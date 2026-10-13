"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users,
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  AlertCircle, 
  Search, 
  Copy, 
  Check, 
  Eye, 
  X, 
  Sliders, 
  FileText, 
  ChevronRight, 
  ExternalLink,
  Lock,
  Trash2,
  Edit2,
  KeyRound,
  ShieldAlert,
  UserCheck,
  UserX,
  Filter,
  DollarSign,
  Building2,
  Plus,
  Bell,
  Send,
  Sparkles,
  Loader2
} from "lucide-react";
import { useStore, UserAccount, Transaction, LinkedWallet } from "@/lib/store";
import { 
  CurrencyType, 
  convertCryptoToFiat, 
  convertFiatToCrypto,
  formatCrypto, 
  formatFiat 
} from "@/lib/format";
import { ROUTES } from "@/lib/routes";
import { useHydration } from "@/lib/useHydration";

const ALL_CURRENCIES: CurrencyType[] = ['USD', 'GBP', 'BTC', 'ETH', 'SOL'];

type AdminTab = 'USERS' | 'KYC' | 'DEPOSITS' | 'LEDGER' | 'NOTIFICATIONS';

export default function AdminPage() {
  const router = useRouter();
  const isHydrated = useHydration();
  const [isAdminAuthLoading, setIsAdminAuthLoading] = useState(true);
  const [isDbLoading, setIsDbLoading] = useState(false);

  const { 
    users,
    currentUser,
    savingsPlans, 
    transactions, 
    notifications,
    liveRates,
    approveDeposit, 
    rejectDeposit, 
    adminUpdateUser,
    adminDeleteUser,
    adminResetPassword,
    adminToggleSuspension,
    adminUpdateUserBalance,
    adminApproveKyc,
    adminRejectKyc,
    adminPushNotification,
    setToast,
    setUsers,
    setTransactions,
  } = useStore();

  // Admin Gateway Session Guard
  useEffect(() => {
    let isMounted = true;
    const verifyAdminSession = async () => {
      try {
        const res = await fetch("/api/admin/auth");
        if (!res.ok) {
          router.replace(ROUTES.adminLogin);
          return;
        }
        if (isMounted) {
          setIsAdminAuthLoading(false);
        }
      } catch {
        router.replace(ROUTES.adminLogin);
      }
    };

    verifyAdminSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Supabase Data Binding for Admin Hub via Service Role Gateway (/api/admin/data)
  const loadAdminDataFromSupabase = useCallback(async () => {
    setIsDbLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const data = await res.json();

        // Map profiles & linked wallets & savings plans
        if (Array.isArray(data.users)) {
          const mappedUsers: UserAccount[] = data.users.map((p: any) => ({
            id: p.id,
            name: p.name || p.full_name || "Member",
            email: p.email || "",
            role: p.role || "user",
            status: p.status || "active",
            createdAt: p.created_at || new Date().toISOString(),
            baseBalanceUSD: Number(p.base_balance_usd ?? p.balance_usd ?? 0),
            avatar: p.avatar_url || p.avatar || undefined,
            kycStatus: p.kyc_status || "unverified",
            linkedWallets: Array.isArray(p.linked_wallets)
              ? p.linked_wallets.map((w: any) => ({
                  id: w.id,
                  currency: w.currency,
                  label: w.label,
                  address: w.address,
                  isDefault: w.is_default ?? w.isDefault,
                  createdAt: w.created_at || new Date().toISOString(),
                }))
              : [],
            kycData:
              p.kyc_data ||
              (Array.isArray(data.kycSubmissions)
                ? data.kycSubmissions.find((k: any) => k.user_id === p.id)
                : undefined),
            notifications: [],
          }));
          setUsers(mappedUsers);
        }

        // Map transactions
        if (Array.isArray(data.transactions)) {
          const mappedTxs: Transaction[] = data.transactions.map((t: any) => ({
            id: t.id,
            date: t.date || t.created_at || new Date().toISOString(),
            type: t.type,
            description: t.description || "",
            amount: Number(t.amount || 0),
            currency: t.currency || "USD",
            status: t.status,
            txHash: t.tx_hash || t.txHash,
            destinationAddress: t.destination_address || t.destinationAddress,
            proofImage: t.proof_image || t.proofImage,
            rejectionReason: t.rejection_reason || t.rejectionReason,
            userId: t.user_id || t.userId,
          }));
          setTransactions(mappedTxs);
        }
      }
    } catch (err) {
      console.error("Error loading admin data from API:", err);
    } finally {
      setIsDbLoading(false);
    }
  }, [setUsers, setTransactions]);

  useEffect(() => {
    if (!isAdminAuthLoading) {
      loadAdminDataFromSupabase();
    }
  }, [isAdminAuthLoading, loadAdminDataFromSupabase]);

  const handleAdminSignOut = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (err) {
      console.error("Admin sign out error:", err);
    }
    router.replace(ROUTES.adminLogin);
  };

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('USERS');

  // Copy Feedback State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────
  // TAB 1: USER MANAGEMENT STATE
  // ─────────────────────────────────────────────────────────────
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'active' | 'suspended'>('ALL');
  
  // Modals for User Management
  const [editUser, setEditUser] = useState<UserAccount | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");

  // Single Unified Balance Adjustment Modal State
  const [balancesUser, setBalancesUser] = useState<UserAccount | null>(null);
  const [balanceCurrency, setBalanceCurrency] = useState<CurrencyType>('USD');
  const [balanceAmount, setBalanceAmount] = useState<string>('');

  const [tempPasswordResult, setTempPasswordResult] = useState<{ user: UserAccount; tempPass: string } | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserAccount | null>(null);
  const [auditUser, setAuditUser] = useState<UserAccount | null>(null);

  // ─────────────────────────────────────────────────────────────
  // TAB 2: KYC APPROVAL QUEUE STATE
  // ─────────────────────────────────────────────────────────────
  const [kycFilter, setKycFilter] = useState<'PENDING' | 'ALL' | 'VERIFIED' | 'REJECTED'>('PENDING');
  const [inspectKycUser, setInspectKycUser] = useState<UserAccount | null>(null);
  const [inspectDocTab, setInspectDocTab] = useState<'front' | 'back' | 'selfie'>('front');
  const [rejectKycUser, setRejectKycUser] = useState<UserAccount | null>(null);
  const [kycRejectionReason, setKycRejectionReason] = useState("");

  // ─────────────────────────────────────────────────────────────
  // TAB 3: DEPOSIT PROOFS QUEUE STATE
  // ─────────────────────────────────────────────────────────────
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string; txHash?: string } | null>(null);
  const [rejectDepositTx, setRejectDepositTx] = useState<Transaction | null>(null);
  const [depositRejectReason, setDepositRejectReason] = useState<string>("");

  // ─────────────────────────────────────────────────────────────
  // TAB 4: AUDIT LEDGER STATE
  // ─────────────────────────────────────────────────────────────
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<'ALL' | 'DEPOSIT' | 'WITHDRAW' | 'PLAN_STAKE' | 'PLAN_PAYOUT'>('ALL');
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'REJECTED'>('ALL');
  const [ledgerSearch, setLedgerSearch] = useState("");

  // ─────────────────────────────────────────────────────────────
  // TAB 5: BROADCAST & PUSH NOTIFICATIONS STATE
  // ─────────────────────────────────────────────────────────────
  const [pushRecipient, setPushRecipient] = useState<string>('ALL');
  const [pushMessage, setPushMessage] = useState<string>('');
  const [pushSentSuccess, setPushSentSuccess] = useState<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────────────────────
  const pendingDeposits = transactions.filter(
    (tx) => tx.type === 'DEPOSIT' && tx.status === 'PENDING'
  );

  const pendingKycUsers = users.filter((u) => u.kycStatus === 'pending');

  const pendingDepositsUsd = pendingDeposits.reduce((acc, tx) => {
    return acc + convertCryptoToFiat(tx.amount, tx.currency, liveRates);
  }, 0);

  // Single unified balance sum across all users
  const totalSystemValueUsd = users.reduce((acc, u) => acc + (u.baseBalanceUSD || 0), 0);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase());
    const matchesStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered KYC Users
  const filteredKycUsers = users.filter((u) => {
    if (kycFilter === 'PENDING') return u.kycStatus === 'pending';
    if (kycFilter === 'VERIFIED') return u.kycStatus === 'verified';
    if (kycFilter === 'REJECTED') return u.kycStatus === 'rejected';
    return true;
  });

  // Filtered Ledger Transactions
  const filteredLedger = transactions.filter((tx) => {
    const matchesType = ledgerTypeFilter === 'ALL' || tx.type === ledgerTypeFilter;
    const matchesStatus = ledgerStatusFilter === 'ALL' || tx.status === ledgerStatusFilter;
    const matchesSearch = 
      tx.id.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      tx.description.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (tx.txHash && tx.txHash.toLowerCase().includes(ledgerSearch.toLowerCase())) ||
      (tx.destinationAddress && tx.destinationAddress.toLowerCase().includes(ledgerSearch.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  // Helper Copy Function
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // User Actions Handlers
  const handleOpenEditUser = (user: UserAccount) => {
    setEditUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    const trimmedName = editUserName.trim();
    const trimmedEmail = editUserEmail.trim();

    adminUpdateUser(editUser.id, {
      name: trimmedName,
      email: trimmedEmail,
    });

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_user",
          userId: editUser.id,
          name: trimmedName,
          email: trimmedEmail,
        }),
      });
    } catch (err) {
      console.error("Failed to sync profile update to Admin Gateway:", err);
    }

    setEditUser(null);
  };

  const handleOpenBalances = (user: UserAccount) => {
    setBalancesUser(user);
    setBalanceCurrency('USD');
    setBalanceAmount((user.baseBalanceUSD || 0).toString());
  };

  const handleSaveBalances = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!balancesUser) return;
    const num = parseFloat(balanceAmount);
    if (isNaN(num) || num < 0) return;

    adminUpdateUserBalance(balancesUser.id, balanceCurrency, num);

    try {
      const newBaseUSD = convertCryptoToFiat(num, balanceCurrency, liveRates);
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_balance",
          userId: balancesUser.id,
          newBalanceUSD: newBaseUSD,
        }),
      });
    } catch (err) {
      console.error("Failed to sync balance update to Admin Gateway:", err);
    }

    setBalancesUser(null);
  };

  const handleToggleSuspension = async (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    const nextStatus = targetUser?.status === 'suspended' ? 'active' : 'suspended';

    adminToggleSuspension(userId);

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_suspend",
          userId,
          status: nextStatus,
        }),
      });
    } catch (err) {
      console.error("Failed to sync suspension to Admin Gateway:", err);
    }
  };

  const handleTriggerResetPassword = (user: UserAccount) => {
    const tempPass = adminResetPassword(user.id);
    setTempPasswordResult({ user, tempPass });
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    const userId = deleteConfirmUser.id;
    adminDeleteUser(userId);

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_user",
          userId,
        }),
      });
    } catch (err) {
      console.error("Failed to sync deletion to Admin Gateway:", err);
    }

    setDeleteConfirmUser(null);
  };

  // KYC Actions Handlers
  const handleApproveKyc = async (userId: string) => {
    adminApproveKyc(userId);

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve_kyc",
          userId,
        }),
      });
    } catch (err) {
      console.error("Failed to sync KYC approval to Admin Gateway:", err);
    }

    if (inspectKycUser?.id === userId) {
      setInspectKycUser(null);
    }
  };

  const handleConfirmRejectKyc = async () => {
    if (!rejectKycUser) return;
    const reason = kycRejectionReason.trim() || "Verification requirements not met.";
    const userId = rejectKycUser.id;

    adminRejectKyc(userId, reason);

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject_kyc",
          userId,
          reason,
        }),
      });
    } catch (err) {
      console.error("Failed to sync KYC rejection to Admin Gateway:", err);
    }

    setRejectKycUser(null);
    setKycRejectionReason("");
    if (inspectKycUser?.id === userId) {
      setInspectKycUser(null);
    }
  };

  // Deposit Actions Handlers
  const handleApproveDeposit = async (txId: string) => {
    approveDeposit(txId);

    try {
      const targetTx = transactions.find((t) => t.id === txId);
      const depositAmountUsd = targetTx ? convertCryptoToFiat(targetTx.amount, targetTx.currency, liveRates) : 0;
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve_deposit",
          txId,
          userId: targetTx?.userId,
          amountUsd: depositAmountUsd,
        }),
      });
    } catch (err) {
      console.error("Failed to sync deposit approval to Admin Gateway:", err);
    }
  };

  const handleConfirmRejectDeposit = async () => {
    if (!rejectDepositTx) return;
    const txId = rejectDepositTx.id;
    const reason = depositRejectReason.trim() || undefined;

    rejectDeposit(txId, reason);

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject_deposit",
          txId,
          reason,
        }),
      });
    } catch (err) {
      console.error("Failed to sync deposit rejection to Admin Gateway:", err);
    }

    setRejectDepositTx(null);
    setDepositRejectReason("");
  };

  // Push Notification Handler
  const handleSendPushNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushMessage.trim()) return;
    const msg = pushMessage.trim();
    const recipient = pushRecipient;

    adminPushNotification(recipient, msg);
    setPushMessage("");
    setPushSentSuccess(true);
    setTimeout(() => setPushSentSuccess(false), 4000);

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "broadcast_notification",
          recipientId: recipient,
          message: msg,
        }),
      });
    } catch (err) {
      console.error("Failed to broadcast notification via Admin Gateway:", err);
    }
  };

  if (isAdminAuthLoading) {
    return (
      <div className="min-h-screen bg-forge-gray-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-forge-orange" />
          <p className="text-xs font-bold font-mono tracking-widest uppercase text-gray-400">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forge-gray-50 text-forge-gray-900 pb-20">
      
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-forge-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={ROUTES.app.dashboard} className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-forge-gray-900">
                FORGE<span className="text-forge-orange">.</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-forge-gray-900 text-white font-mono text-[11px] font-bold uppercase tracking-wider">
                Admin Command Suite
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href={ROUTES.app.dashboard}
              className="text-xs font-bold text-forge-gray-600 hover:text-forge-gray-900 px-3 py-1.5 rounded-lg border border-forge-gray-200 hover:bg-forge-gray-50 transition-colors flex items-center gap-1.5"
            >
              Client Portal <ExternalLink size={12} />
            </Link>
            <button
              type="button"
              onClick={handleAdminSignOut}
              className="text-xs font-bold text-red-600 hover:text-white px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-600 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Lock size={12} />
              <span>Sign Out Admin</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-forge-gray-200 text-xs font-medium text-forge-gray-500">
              <span className="w-2 h-2 rounded-full bg-market-up animate-pulse" />
              <span>Full Admin Access</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Page Title & Intro */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-forge-orange-wash text-forge-orange rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-forge-orange/20">
              <ShieldCheck size={14} /> Full Platform Administration
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-forge-gray-900 tracking-tight">
              Administrative Command Center
            </h1>
            <p className="font-medium text-forge-gray-600 mt-1 text-sm sm:text-base">
              Comprehensive control over registered users, compliance KYC approvals, deposit proof receipts, unified balances, and announcements.
            </p>
          </div>

          <div className="text-right text-xs text-forge-gray-500 font-medium bg-white px-4 py-2.5 rounded-xl border border-forge-gray-200 shadow-sm self-start sm:self-auto">
            <span>Admin Gateway: </span>
            <strong className="text-forge-gray-900">Super Administrator</strong>
            <span className="text-forge-gray-400"> (ROOT-KEY)</span>
          </div>
        </div>

        {/* ── Platform Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {/* Card 1: Total Users */}
          <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">
                Registered Users
              </span>
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Users size={16} />
              </span>
            </div>
            <div className="font-display font-extrabold text-3xl text-forge-gray-900" suppressHydrationWarning>
              {isHydrated ? users.length : 1}
            </div>
            <p className="text-xs font-medium text-forge-gray-500 mt-1" suppressHydrationWarning>
              {isHydrated ? users.filter(u => u.status === 'active').length : 1} active • {isHydrated ? users.filter(u => u.status === 'suspended').length : 0} suspended
            </p>
          </div>

          {/* Card 2: Pending KYC */}
          <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">
                KYC Review Queue
              </span>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${pendingKycUsers.length > 0 ? "bg-amber-500/15 text-amber-600" : "bg-forge-gray-100 text-forge-gray-400"}`}>
                <UserCheck size={16} />
              </span>
            </div>
            <div className="font-display font-extrabold text-3xl text-forge-gray-900" suppressHydrationWarning>
              {isHydrated ? pendingKycUsers.length : 0}
            </div>
            <p className="text-xs font-medium text-forge-gray-500 mt-1" suppressHydrationWarning>
              {(isHydrated ? pendingKycUsers.length : 0) > 0 ? "Identity proofs pending review" : "All identity proofs verified"}
            </p>
          </div>

          {/* Card 3: Pending Deposits */}
          <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">
                Pending Deposits
              </span>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${pendingDeposits.length > 0 ? "bg-amber-500/15 text-amber-600" : "bg-forge-gray-100 text-forge-gray-400"}`}>
                <Clock size={16} />
              </span>
            </div>
            <div className="font-display font-extrabold text-3xl text-forge-gray-900" suppressHydrationWarning>
              {isHydrated ? pendingDeposits.length : 0}
            </div>
            <p className="text-xs font-medium text-forge-gray-500 mt-1" suppressHydrationWarning>
              {formatFiat(isHydrated ? pendingDepositsUsd : 0)} USD awaiting treasury crediting
            </p>
          </div>

          {/* Card 4: Platform Balance */}
          <div className="clean-card bg-white p-6 rounded-2xl border border-forge-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">
                Platform Vault Total
              </span>
              <span className="w-8 h-8 rounded-lg bg-forge-orange-wash text-forge-orange flex items-center justify-center">
                <Wallet size={16} />
              </span>
            </div>
            <div className="font-display font-extrabold text-3xl text-forge-gray-900" suppressHydrationWarning>
              {formatFiat(isHydrated ? totalSystemValueUsd : 0)}
            </div>
            <p className="text-xs font-medium text-forge-gray-500 mt-1">
              Unified single balance across all client vaults
            </p>
          </div>
        </div>

        {/* ── Main Navigation Tabs ── */}
        <div className="border-b border-forge-gray-200 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'USERS' as AdminTab, label: 'User Management Hub', icon: Users, badge: users.length },
            { id: 'KYC' as AdminTab, label: 'KYC Approval Queue', icon: UserCheck, badge: pendingKycUsers.length, badgeAlert: pendingKycUsers.length > 0 },
            { id: 'DEPOSITS' as AdminTab, label: 'Deposit Proofs Queue', icon: ArrowDownToLine, badge: pendingDeposits.length, badgeAlert: pendingDeposits.length > 0 },
            { id: 'LEDGER' as AdminTab, label: 'Transactions & Audit Ledger', icon: FileText },
            { id: 'NOTIFICATIONS' as AdminTab, label: 'Push Notifications & Alerts', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-5 font-bold text-sm flex items-center gap-2.5 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-forge-orange text-forge-orange"
                    : "border-transparent text-forge-gray-600 hover:text-forge-gray-900 hover:border-forge-gray-300"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    tab.badgeAlert
                      ? "bg-amber-500 text-white"
                      : isActive ? "bg-forge-orange text-white" : "bg-forge-gray-200 text-forge-gray-700"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 1: USER MANAGEMENT HUB                                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'USERS' && (
          <section className="clean-card bg-white rounded-2xl border border-forge-gray-200 shadow-sm overflow-hidden space-y-4">
            
            {/* Header & Controls */}
            <div className="p-6 border-b border-forge-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-forge-gray-900">
                  Registered User Accounts
                </h2>
                <p className="text-xs font-medium text-forge-gray-500 mt-0.5">
                  Inspect user records, adjust unified balances, reset passwords, suspend, or view transaction audit logs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[240px]">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forge-gray-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name, email, ID..."
                    className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white"
                  />
                  {userSearch && (
                    <button 
                      type="button" 
                      onClick={() => setUserSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-forge-gray-400 hover:text-forge-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="flex items-center bg-forge-gray-50 p-1 rounded-xl border border-forge-gray-200 text-xs font-bold">
                  {(['ALL', 'active', 'suspended'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setUserStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                        userStatusFilter === s
                          ? "bg-white text-forge-gray-900 shadow-sm"
                          : "text-forge-gray-500 hover:text-forge-gray-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Quick Broadcast Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('NOTIFICATIONS')}
                  className="px-3 py-1.5 bg-forge-orange text-white text-xs font-bold rounded-xl hover:bg-forge-orange-hover transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Bell size={13} />
                  <span>Broadcast Alert</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-forge-gray-500">
                <Users size={36} className="mx-auto text-forge-gray-300 mb-2" />
                <p className="font-bold text-forge-gray-700">
                  {users.length === 0 ? "No registered user accounts found in database." : "No users match your criteria"}
                </p>
                <p className="text-xs text-forge-gray-400 mt-1">
                  {users.length === 0 ? "Users will appear here once they register on the platform." : "Try clearing filters or search queries."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-forge-gray-50/60 border-b border-forge-gray-200 text-xs font-bold uppercase tracking-wider text-forge-gray-500">
                      <th className="py-4 px-6">User Account</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">KYC Status</th>
                      <th className="py-4 px-6">Unified Balance</th>
                      <th className="py-4 px-6">Linked Wallets</th>
                      <th className="py-4 px-6 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forge-gray-100 font-medium">
                    {filteredUsers.map((user) => {
                      const userTotalUsd = user.baseBalanceUSD || 0;

                      return (
                        <tr key={user.id} className="hover:bg-forge-gray-50/50 transition-colors">
                          {/* Name, Avatar & ID */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {user.avatar ? (
                                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-forge-gray-200 shadow-sm">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-forge-gray-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                                  {user.name.split(" ").map(n => n[0]).join("")}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-sm text-forge-gray-900">{user.name}</p>
                                  {user.id === currentUser.id && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-forge-orange text-white rounded">
                                      You
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-forge-gray-500">{user.email}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[11px] text-forge-gray-400">{user.id}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(user.id, user.id)}
                                    className="text-forge-gray-300 hover:text-forge-gray-600"
                                    title="Copy User ID"
                                  >
                                    {copiedId === user.id ? <Check size={11} className="text-market-up" /> : <Copy size={11} />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Account Status */}
                          <td className="py-4 px-6">
                            {user.status === 'active' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-market-up/10 text-market-up text-[11px] font-bold uppercase tracking-wider rounded-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-market-up" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-market-down/10 text-market-down text-[11px] font-bold uppercase tracking-wider rounded-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-market-down" /> Suspended
                              </span>
                            )}
                          </td>

                          {/* KYC Status */}
                          <td className="py-4 px-6">
                            {user.kycStatus === 'verified' && (
                              <span className="inline-flex items-center gap-1 text-market-up text-xs font-bold bg-market-up/10 px-2.5 py-1 rounded-md">
                                <CheckCircle2 size={13} /> Verified
                              </span>
                            )}
                            {user.kycStatus === 'pending' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('KYC');
                                  setInspectKycUser(user);
                                }}
                                className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 px-2.5 py-1 rounded-md transition-colors"
                              >
                                <Clock size={13} /> Pending Review →
                              </button>
                            )}
                            {user.kycStatus === 'rejected' && (
                              <span className="inline-flex items-center gap-1 text-market-down text-xs font-bold bg-market-down/10 px-2.5 py-1 rounded-md">
                                <XCircle size={13} /> Rejected
                              </span>
                            )}
                            {user.kycStatus === 'unverified' && (
                              <span className="inline-flex items-center gap-1 text-forge-gray-400 text-xs font-medium bg-forge-gray-100 px-2.5 py-1 rounded-md">
                                Unverified
                              </span>
                            )}
                          </td>

                          {/* Unified Single Balance */}
                          <td className="py-4 px-6">
                            <span className="font-display font-bold text-sm text-forge-gray-900 tabular-nums">
                              {formatFiat(userTotalUsd)} USD
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-forge-gray-500 mt-0.5">
                              <span>{convertFiatToCrypto(userTotalUsd, 'BTC', liveRates).toFixed(5)} BTC</span>
                              <span>•</span>
                              <span>{convertFiatToCrypto(userTotalUsd, 'ETH', liveRates).toFixed(4)} ETH</span>
                            </div>
                          </td>

                          {/* Linked Wallets */}
                          <td className="py-4 px-6">
                            <span className="text-xs font-bold text-forge-gray-700">
                              {user.linkedWallets?.length || 0} Accounts
                            </span>
                            {user.linkedWallets && user.linkedWallets.length > 0 && (
                              <p className="text-[11px] text-forge-gray-400 truncate max-w-[140px]">
                                {user.linkedWallets[0].label}
                              </p>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Manage Balances */}
                              <button
                                type="button"
                                onClick={() => handleOpenBalances(user)}
                                className="p-2 text-forge-gray-600 hover:text-forge-orange hover:bg-forge-orange-wash rounded-lg transition-colors"
                                title="Adjust Balance"
                              >
                                <Sliders size={16} />
                              </button>

                              {/* Edit Profile */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditUser(user)}
                                className="p-2 text-forge-gray-600 hover:text-forge-gray-900 hover:bg-forge-gray-100 rounded-lg transition-colors"
                                title="Edit User Profile"
                              >
                                <Edit2 size={16} />
                              </button>

                              {/* Send Push Notification to this User */}
                              <button
                                type="button"
                                onClick={() => {
                                  setPushRecipient(user.id);
                                  setActiveTab('NOTIFICATIONS');
                                }}
                                className="p-2 text-forge-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Send Push Notification"
                              >
                                <Bell size={16} />
                              </button>

                              {/* Reset Password */}
                              <button
                                type="button"
                                onClick={() => handleTriggerResetPassword(user)}
                                className="p-2 text-forge-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Generate Temp Password"
                              >
                                <KeyRound size={16} />
                              </button>

                              {/* Suspend / Unsuspend */}
                              <button
                                type="button"
                                onClick={() => handleToggleSuspension(user.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  user.status === 'active' 
                                    ? "text-forge-gray-600 hover:text-amber-600 hover:bg-amber-50" 
                                    : "text-market-up hover:bg-market-up/10"
                                }`}
                                title={user.status === 'active' ? "Suspend User" : "Unsuspend User"}
                              >
                                {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                              </button>

                              {/* View Drawer / Audit */}
                              <button
                                type="button"
                                onClick={() => setAuditUser(user)}
                                className="px-2.5 py-1.5 bg-forge-gray-100 hover:bg-forge-gray-200 text-forge-gray-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                title="Inspect Ledger & Plans"
                              >
                                <Eye size={13} /> Audit
                              </button>

                              {/* Delete User */}
                              <button
                                type="button"
                                disabled={user.id === currentUser.id}
                                onClick={() => setDeleteConfirmUser(user)}
                                className="p-2 text-forge-gray-400 hover:text-market-down hover:bg-market-down/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title={user.id === currentUser.id ? "Cannot delete active session user" : "Delete User"}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 2: KYC APPROVAL QUEUE                                       */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'KYC' && (
          <section className="clean-card bg-white rounded-2xl border border-forge-gray-200 shadow-sm overflow-hidden space-y-4">
            
            {/* Header & Controls */}
            <div className="p-6 border-b border-forge-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-xl text-forge-gray-900">
                    KYC Compliance & Identity Verification
                  </h2>
                  {pendingKycUsers.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">
                      {pendingKycUsers.length} Review Required
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-forge-gray-500 mt-0.5">
                  Verify submitted government identification documents. Approving KYC unlocks external fund cashouts for the user.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center bg-forge-gray-50 p-1 rounded-xl border border-forge-gray-200 text-xs font-bold">
                {(['PENDING', 'ALL', 'VERIFIED', 'REJECTED'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setKycFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      kycFilter === filter
                        ? "bg-white text-forge-gray-900 shadow-sm"
                        : "text-forge-gray-500 hover:text-forge-gray-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* KYC Applications List */}
            {filteredKycUsers.length === 0 ? (
              <div className="p-12 text-center text-forge-gray-500 flex flex-col items-center">
                <CheckCircle2 size={36} className="text-forge-gray-300 mb-2" />
                <p className="font-bold text-forge-gray-700">No submissions found</p>
                <p className="text-xs text-forge-gray-400 mt-1">No user applications match the selected filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-forge-gray-50/60 border-b border-forge-gray-200 text-xs font-bold uppercase tracking-wider text-forge-gray-500">
                      <th className="py-4 px-6">Applicant</th>
                      <th className="py-4 px-6">Legal Name & DOB</th>
                      <th className="py-4 px-6">Document Type & Number</th>
                      <th className="py-4 px-6">Residence / Country</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forge-gray-100 font-medium">
                    {filteredKycUsers.map((user) => {
                      const data = user.kycData;
                      return (
                        <tr key={user.id} className="hover:bg-forge-gray-50/50 transition-colors">
                          {/* Applicant */}
                          <td className="py-4 px-6">
                            <p className="font-bold text-sm text-forge-gray-900">{user.name}</p>
                            <p className="text-xs text-forge-gray-500">{user.email}</p>
                            <span className="font-mono text-[11px] text-forge-gray-400">{user.id}</span>
                          </td>

                          {/* Legal details */}
                          <td className="py-4 px-6">
                            {data ? (
                              <div>
                                <p className="font-bold text-sm text-forge-gray-900">
                                  {data.firstName} {data.lastName}
                                </p>
                                <p className="text-xs text-forge-gray-500">DOB: {data.dob}</p>
                                <p className="text-[11px] text-forge-gray-400">{data.nationality}</p>
                              </div>
                            ) : (
                              <span className="text-xs text-forge-gray-400">No Data Submitted</span>
                            )}
                          </td>

                          {/* Document */}
                          <td className="py-4 px-6">
                            {data ? (
                              <div>
                                <span className="inline-block px-2 py-0.5 rounded bg-forge-gray-100 text-forge-gray-700 text-xs font-bold uppercase">
                                  {data.documentType}
                                </span>
                                <p className="font-mono text-xs text-forge-gray-800 mt-1">
                                  {data.documentNumber}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-forge-gray-400">—</span>
                            )}
                          </td>

                          {/* Address */}
                          <td className="py-4 px-6">
                            {data ? (
                              <div className="max-w-[200px]">
                                <p className="text-xs font-medium text-forge-gray-900 truncate" title={data.address}>
                                  {data.address}
                                </p>
                                <p className="text-[11px] text-forge-gray-500">
                                  {data.city}, {data.country}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-forge-gray-400">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6 text-center">
                            {user.kycStatus === 'verified' && (
                              <span className="inline-flex items-center gap-1 text-market-up text-xs font-bold bg-market-up/10 px-2.5 py-1 rounded-md">
                                <CheckCircle2 size={13} /> Verified
                              </span>
                            )}
                            {user.kycStatus === 'pending' && (
                              <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-500/15 px-2.5 py-1 rounded-md">
                                <Clock size={13} /> Pending
                              </span>
                            )}
                            {user.kycStatus === 'rejected' && (
                              <div>
                                <span className="inline-flex items-center gap-1 text-market-down text-xs font-bold bg-market-down/10 px-2.5 py-1 rounded-md">
                                  <XCircle size={13} /> Rejected
                                </span>
                                {data?.rejectionReason && (
                                  <p className="text-[10px] text-market-down mt-1 max-w-[140px] truncate" title={data.rejectionReason}>
                                    {data.rejectionReason}
                                  </p>
                                )}
                              </div>
                            )}
                            {user.kycStatus === 'unverified' && (
                              <span className="text-xs text-forge-gray-400">Unsubmitted</span>
                            )}
                          </td>

                          {/* Verification Actions */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              {/* Inspect Documents Button */}
                              {data && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInspectKycUser(user);
                                    setInspectDocTab('front');
                                  }}
                                  className="px-3.5 py-1.5 bg-forge-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                                >
                                  <Eye size={13} /> Inspect ID
                                </button>
                              )}

                              {user.kycStatus === 'pending' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveKyc(user.id)}
                                    className="px-3 py-1.5 bg-market-up hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                                  >
                                    <CheckCircle2 size={13} /> Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setRejectKycUser(user)}
                                    className="px-3 py-1.5 bg-white border border-market-down text-market-down hover:bg-market-down hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                                  >
                                    <XCircle size={13} /> Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 3: DEPOSIT PROOFS QUEUE                                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'DEPOSITS' && (
          <section className="clean-card bg-white rounded-2xl border border-forge-gray-200 shadow-sm overflow-hidden space-y-4">
            
            <div className="p-6 border-b border-forge-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-xl text-forge-gray-900">
                    Pending Deposits Proof Queue
                  </h2>
                  {pendingDeposits.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">
                      {pendingDeposits.length} Action Needed
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-forge-gray-500 mt-0.5">
                  Proof of payment screenshots submitted by users. Inspect transaction proof and approve to automatically credit balances.
                </p>
              </div>
            </div>

            {pendingDeposits.length === 0 ? (
              <div className="p-12 text-center text-forge-gray-500 flex flex-col items-center">
                <CheckCircle2 size={36} className="text-forge-gray-300 mb-2" />
                <p className="font-bold text-forge-gray-700">All Deposits Processed</p>
                <p className="text-xs text-forge-gray-400 mt-1">
                  There are currently no proof-of-payment receipts awaiting treasury review.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-forge-gray-50/60 border-b border-forge-gray-200 text-xs font-bold uppercase tracking-wider text-forge-gray-500">
                      <th className="py-4 px-6">Timestamp</th>
                      <th className="py-4 px-6">Client / Account</th>
                      <th className="py-4 px-6">Asset & Amount</th>
                      <th className="py-4 px-6">Tx Reference / Hash</th>
                      <th className="py-4 px-6 text-center">Receipt Proof</th>
                      <th className="py-4 px-6 text-right">Verification Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forge-gray-100 font-medium">
                    {pendingDeposits.map((tx) => {
                      const usdEquiv = convertCryptoToFiat(tx.amount, tx.currency, liveRates);
                      const depositUser = users.find(u => u.id === tx.userId) || currentUser;

                      return (
                        <tr key={tx.id} className="hover:bg-forge-gray-50/50 transition-colors">
                          {/* Timestamp */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <p className="text-sm font-bold text-forge-gray-900">
                              {new Date(tx.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs font-bold text-forge-gray-400">
                              {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </td>

                          {/* User */}
                          <td className="py-4 px-6">
                            <p className="font-bold text-forge-gray-900">{depositUser.name}</p>
                            <p className="text-xs font-mono text-forge-gray-500">{depositUser.id}</p>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-6">
                            <span className="font-display font-extrabold text-base text-forge-gray-900 tabular-nums">
                              {tx.amount} {tx.currency}
                            </span>
                            <p className="text-xs text-forge-gray-500">≈ {formatFiat(usdEquiv)} USD</p>
                          </td>

                          {/* Tx Hash */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 max-w-[180px]">
                              <span className="font-mono text-xs text-forge-gray-700 truncate" title={tx.txHash}>
                                {tx.txHash || "—"}
                              </span>
                              {tx.txHash && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(tx.txHash || "", tx.id)}
                                  className="text-forge-gray-400 hover:text-forge-gray-700 shrink-0"
                                  title="Copy TXID"
                                >
                                  {copiedId === tx.id ? <Check size={14} className="text-market-up" /> : <Copy size={14} />}
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Proof Screenshot */}
                          <td className="py-4 px-6 text-center">
                            {tx.proofImage ? (
                              <button
                                type="button"
                                onClick={() => setPreviewImage({
                                  src: tx.proofImage!,
                                  title: `${tx.amount} ${tx.currency} Deposit Receipt`,
                                  txHash: tx.txHash
                                })}
                                className="group relative inline-block rounded-lg overflow-hidden border border-forge-gray-200 hover:border-forge-orange shadow-sm transition-all"
                              >
                                <div className="w-12 h-12 relative bg-forge-gray-100 flex items-center justify-center">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={tx.proofImage}
                                    alt="Proof thumbnail"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye size={16} className="text-white" />
                                  </div>
                                </div>
                              </button>
                            ) : (
                              <span className="text-xs text-forge-gray-400">No Image</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleApproveDeposit(tx.id)}
                                className="px-3.5 py-1.5 bg-market-up hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                              >
                                <CheckCircle2 size={14} />
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectDepositTx(tx)}
                                className="px-3.5 py-1.5 bg-white border border-market-down text-market-down hover:bg-market-down hover:text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 4: TRANSACTIONS & AUDIT LEDGER                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'LEDGER' && (
          <section className="clean-card bg-white rounded-2xl border border-forge-gray-200 shadow-sm overflow-hidden space-y-4">
            
            <div className="p-6 border-b border-forge-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-forge-gray-900">
                  Platform Audit Ledger
                </h2>
                <p className="text-xs font-medium text-forge-gray-500 mt-0.5">
                  Complete immutable audit record of all deposits, withdrawals, stakes, and payouts.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-gray-400" />
                  <input
                    type="text"
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    placeholder="Search ledger..."
                    className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={ledgerTypeFilter}
                  onChange={(e) => setLedgerTypeFilter(e.target.value as any)}
                  className="bg-forge-gray-50 border border-forge-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-forge-gray-700 focus:outline-none focus:ring-2 focus:ring-forge-orange"
                >
                  <option value="ALL">All Operations</option>
                  <option value="DEPOSIT">Deposits</option>
                  <option value="WITHDRAW">Withdrawals</option>
                  <option value="PLAN_STAKE">Plan Stakes</option>
                  <option value="PLAN_PAYOUT">Plan Payouts</option>
                </select>

                {/* Status Filter */}
                <select
                  value={ledgerStatusFilter}
                  onChange={(e) => setLedgerStatusFilter(e.target.value as any)}
                  className="bg-forge-gray-50 border border-forge-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-forge-gray-700 focus:outline-none focus:ring-2 focus:ring-forge-orange"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {filteredLedger.length === 0 ? (
              <div className="p-12 text-center text-forge-gray-500">
                <FileText size={36} className="mx-auto text-forge-gray-300 mb-2" />
                <p className="font-bold text-forge-gray-700">No records found</p>
                <p className="text-xs text-forge-gray-400 mt-1">
                  No platform operations match the selected criteria.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-forge-gray-50/60 border-b border-forge-gray-200 text-xs font-bold uppercase tracking-wider text-forge-gray-500">
                      <th className="py-4 px-6">Timestamp</th>
                      <th className="py-4 px-6">Type</th>
                      <th className="py-4 px-6">Description</th>
                      <th className="py-4 px-6">Target / Hash</th>
                      <th className="py-4 px-6 text-right">Amount</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6">Audit Info</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forge-gray-100 font-medium">
                    {filteredLedger.map((tx) => (
                      <tr key={tx.id} className="hover:bg-forge-gray-50/50 transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <p className="text-sm font-bold text-forge-gray-900">
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs font-bold text-forge-gray-400">
                            {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>

                        <td className="py-4 px-6">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forge-gray-100 text-forge-gray-700">
                            {tx.type}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-forge-gray-900">{tx.description}</p>
                          <p className="text-xs font-mono text-forge-gray-400">ID: {tx.id}</p>
                        </td>

                        <td className="py-4 px-6">
                          {tx.destinationAddress ? (
                            <div>
                              <span className="text-[10px] font-bold text-forge-gray-500 uppercase">Destination</span>
                              <p className="font-mono text-xs text-forge-gray-700 truncate max-w-[150px]" title={tx.destinationAddress}>
                                {tx.destinationAddress}
                              </p>
                            </div>
                          ) : tx.txHash ? (
                            <div>
                              <span className="text-[10px] font-bold text-forge-gray-500 uppercase">TXID</span>
                              <p className="font-mono text-xs text-forge-gray-700 truncate max-w-[150px]" title={tx.txHash}>
                                {tx.txHash}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-forge-gray-400">Internal</span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right tabular-nums whitespace-nowrap">
                          <span className={`font-bold ${tx.amount > 0 ? "text-market-up" : "text-forge-gray-900"}`}>
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} {tx.currency}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center">
                          {tx.status === 'COMPLETED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-market-up/10 text-market-up text-[10px] font-bold uppercase tracking-wider rounded-md">
                              <CheckCircle2 size={12} /> Approved
                            </span>
                          ) : tx.status === 'PENDING' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                              <Clock size={12} /> Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-market-down/10 text-market-down text-[10px] font-bold uppercase tracking-wider rounded-md">
                              <XCircle size={12} /> Rejected
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-xs text-forge-gray-600">
                          {tx.rejectionReason ? (
                            <span className="text-market-down font-medium">
                              Reason: {tx.rejectionReason}
                            </span>
                          ) : tx.proofImage ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImage({
                                src: tx.proofImage!,
                                title: `${tx.amount} ${tx.currency} Receipt`,
                                txHash: tx.txHash
                              })}
                              className="text-forge-orange hover:text-forge-orange-hover font-bold flex items-center gap-1"
                            >
                              <Eye size={12} /> View Receipt
                            </button>
                          ) : (
                            <span className="text-forge-gray-400">Standard Execution</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 5: PUSH NOTIFICATIONS & BROADCASTS                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'NOTIFICATIONS' && (
          <section className="clean-card bg-white rounded-2xl border border-forge-gray-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forge-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-forge-orange-wash text-forge-orange flex items-center justify-center">
                    <Bell size={18} />
                  </div>
                  <h2 className="font-display font-bold text-xl text-forge-gray-900">
                    Push Notifications & Announcements Dispatcher
                  </h2>
                </div>
                <p className="text-xs font-medium text-forge-gray-500 mt-1">
                  Transmit immediate high-priority alerts directly to user notification centers and active device sessions.
                </p>
              </div>

              {pushSentSuccess && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-market-up/10 text-market-up text-xs font-bold border border-market-up/20 animate-in fade-in">
                  <CheckCircle2 size={15} />
                  <span>Notification broadcasted successfully!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendPushNotification} className="space-y-6 max-w-3xl">
              {/* Recipient Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-2">
                  Target Audience / Recipient
                </label>
                <select
                  value={pushRecipient}
                  onChange={(e) => setPushRecipient(e.target.value)}
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white"
                >
                  <option value="ALL">📢 All Registered Users (Broadcast Announcement)</option>
                  <optgroup label="Individual Client Accounts">
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        👤 {u.name} — {u.email} ({u.id})
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-[11px] text-forge-gray-400 mt-1">
                  Broadcasts trigger instant in-app alerts and light up the notification bell across all active member sessions.
                </p>
              </div>

              {/* Quick Template Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-2">
                  Quick Message Templates
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Platform maintenance scheduled for tonight at 23:00 UTC. System services will remain uninterrupted.",
                    "Your withdrawal window has opened. Funds and interest yields are ready for release.",
                    "New High-Yield Fixed Growth Plan launched: Lock capital for 12 months with +162% guaranteed return.",
                    "Your identity documents have been processed. Identity verification has been approved.",
                    "Compliance reminder: Please link your designated payout address before requesting disbursements.",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPushMessage(preset)}
                      className="px-3 py-1.5 bg-forge-gray-100 hover:bg-forge-gray-200 text-forge-gray-700 rounded-lg text-xs font-medium transition-colors text-left"
                    >
                      {preset.slice(0, 48)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-2">
                  Announcement / Notification Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={pushMessage}
                  onChange={(e) => setPushMessage(e.target.value)}
                  placeholder="Type notification or platform announcement..."
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl p-4 text-sm font-medium text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white placeholder:text-forge-gray-400"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!pushMessage.trim()}
                  className="px-6 py-3.5 bg-forge-orange hover:bg-forge-orange-hover text-white text-sm font-bold rounded-xl transition-colors shadow-[0_4px_14px_rgba(255,90,0,0.25)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Bell size={16} />
                  <span>Send Notification</span>
                </button>
                <span className="text-xs text-forge-gray-500 font-medium">
                  {pushRecipient === 'ALL' ? `Broadcasting to all ${users.length} members` : `Targeting 1 recipient`}
                </span>
              </div>
            </form>

            {/* Notification Center Preview */}
            <div className="pt-6 border-t border-forge-gray-100 max-w-3xl">
              <h3 className="font-display font-bold text-sm text-forge-gray-900 mb-3">
                Live Notification Center Feed (Recent)
              </h3>
              {notifications.length === 0 ? (
                <p className="text-xs text-forge-gray-400 italic">No notifications dispatched yet.</p>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className="p-3.5 bg-forge-gray-50 rounded-xl border border-forge-gray-200 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-forge-orange mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-forge-gray-900">{n.message}</p>
                        <p className="text-[10px] text-forge-gray-400 mt-0.5">{new Date(n.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT USER PROFILE                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setEditUser(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-forge-gray-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-forge-gray-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-xl text-forge-gray-900">Edit User Profile</h3>
                <p className="text-xs text-forge-gray-500">ID: {editUser.id}</p>
              </div>
              <button type="button" onClick={() => setEditUser(null)} className="p-1 text-forge-gray-400 hover:text-forge-gray-600 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-forge-gray-100">
                <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2.5 text-xs font-bold text-forge-gray-600 hover:text-forge-gray-900">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-forge-orange text-white text-xs font-bold rounded-xl hover:bg-forge-orange-hover transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: MANAGE UNIFIED USER BALANCE                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {balancesUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setBalancesUser(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-forge-gray-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-forge-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forge-orange-wash text-forge-orange flex items-center justify-center">
                  <Sliders size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-forge-gray-900">Manage Unified Balance</h3>
                  <p className="text-xs text-forge-gray-500">User: <strong className="text-forge-gray-900">{balancesUser.name}</strong> ({balancesUser.id})</p>
                </div>
              </div>
              <button type="button" onClick={() => setBalancesUser(null)} className="p-1 text-forge-gray-400 hover:text-forge-gray-600 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Current Unified Balance Breakdown */}
            <div className="p-4 bg-forge-gray-50 rounded-xl border border-forge-gray-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-forge-gray-500">Current Base Balance:</span>
                <span className="font-display font-extrabold text-xl text-forge-gray-900 tabular-nums">
                  {formatFiat(balancesUser.baseBalanceUSD || 0)} USD
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-forge-gray-200 text-[11px] font-mono text-forge-gray-600">
                <span>≈ {convertFiatToCrypto(balancesUser.baseBalanceUSD || 0, 'BTC', liveRates).toFixed(5)} BTC</span>
                <span>•</span>
                <span>≈ {convertFiatToCrypto(balancesUser.baseBalanceUSD || 0, 'ETH', liveRates).toFixed(4)} ETH</span>
                <span>•</span>
                <span>≈ {convertFiatToCrypto(balancesUser.baseBalanceUSD || 0, 'SOL', liveRates).toFixed(2)} SOL</span>
                <span>•</span>
                <span>≈ £{convertFiatToCrypto(balancesUser.baseBalanceUSD || 0, 'GBP', liveRates).toFixed(2)} GBP</span>
              </div>
            </div>

            <form onSubmit={handleSaveBalances} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                  Select Currency for Entry
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ALL_CURRENCIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setBalanceCurrency(c);
                        setBalanceAmount(convertFiatToCrypto(balancesUser.baseBalanceUSD || 0, c, liveRates).toString());
                      }}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        balanceCurrency === c
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
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-forge-gray-700">
                    New Exact Balance Amount ({balanceCurrency})
                  </label>
                  <span className="text-xs text-forge-gray-500 font-medium">
                    Converts to: <strong className="text-forge-gray-900 tabular-nums">
                      {formatFiat(convertCryptoToFiat(parseFloat(balanceAmount) || 0, balanceCurrency, liveRates))} USD
                    </strong>
                  </span>
                </div>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl px-4 py-3 text-base font-display font-bold text-forge-gray-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-forge-orange focus:bg-white"
                />
              </div>

              {/* Quick Presets */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-forge-gray-400 uppercase tracking-wider block mb-2">Quick Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "+1,000 USD", curr: 'USD' as CurrencyType, val: (balancesUser.baseBalanceUSD || 0) + 1000 },
                    { label: "+10,000 USD", curr: 'USD' as CurrencyType, val: (balancesUser.baseBalanceUSD || 0) + 10000 },
                    { label: "+0.5 BTC", curr: 'BTC' as CurrencyType, val: convertFiatToCrypto(balancesUser.baseBalanceUSD || 0, 'BTC', liveRates) + 0.5 },
                    { label: "+2.5 ETH", curr: 'ETH' as CurrencyType, val: convertFiatToCrypto(balancesUser.baseBalanceUSD || 0, 'ETH', liveRates) + 2.5 },
                    { label: "+25 SOL", curr: 'SOL' as CurrencyType, val: convertFiatToCrypto(balancesUser.baseBalanceUSD || 0, 'SOL', liveRates) + 25 },
                    { label: "Set to 0", curr: 'USD' as CurrencyType, val: 0 },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setBalanceCurrency(p.curr);
                        setBalanceAmount(p.val.toString());
                      }}
                      className="px-2.5 py-1 bg-forge-gray-100 hover:bg-forge-gray-200 text-forge-gray-700 text-xs font-bold rounded-md transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-forge-gray-100">
                <button type="button" onClick={() => setBalancesUser(null)} className="px-4 py-2.5 text-xs font-bold text-forge-gray-600 hover:text-forge-gray-900">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-forge-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors shadow-sm">
                  Save & Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: TEMPORARY PASSWORD RESULT                                */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {tempPasswordResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setTempPasswordResult(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-forge-gray-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 z-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto">
              <KeyRound size={28} />
            </div>

            <h3 className="font-display font-bold text-2xl text-forge-gray-900">Temporary Password Created</h3>
            <p className="text-xs text-forge-gray-600">
              A temporary password was generated for <strong className="text-forge-gray-900">{tempPasswordResult.user.name}</strong>. Provide this code to the user to regain account access.
            </p>

            <div className="p-4 bg-forge-gray-50 rounded-xl border border-forge-gray-200 font-mono font-bold text-lg text-forge-gray-900 flex items-center justify-between gap-3">
              <span className="truncate">{tempPasswordResult.tempPass}</span>
              <button
                type="button"
                onClick={() => handleCopy(tempPasswordResult.tempPass, 'temp-pass')}
                className="px-3 py-1.5 bg-forge-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedId === 'temp-pass' ? <Check size={14} className="text-market-up" /> : <Copy size={14} />}
                <span>{copiedId === 'temp-pass' ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setTempPasswordResult(null)}
                className="w-full py-3 bg-forge-gray-100 hover:bg-forge-gray-200 text-forge-gray-800 text-xs font-bold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: DELETE USER CONFIRMATION                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setDeleteConfirmUser(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-forge-gray-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 z-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-market-down/10 text-market-down flex items-center justify-center mx-auto">
              <Trash2 size={28} />
            </div>

            <h3 className="font-display font-bold text-2xl text-forge-gray-900">Delete User Account?</h3>
            <p className="text-xs text-forge-gray-600 leading-relaxed">
              Are you sure you want to permanently remove <strong className="text-forge-gray-900">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-5 py-2.5 text-xs font-bold text-forge-gray-600 hover:text-forge-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-5 py-2.5 bg-market-down hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: USER AUDIT DRAWER / ACTIVITY                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {auditUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setAuditUser(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-forge-gray-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-forge-gray-100 pb-4">
              <div className="flex items-center gap-3">
                {auditUser.avatar ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-forge-gray-200 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={auditUser.avatar} 
                      alt={auditUser.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-forge-gray-900 text-white font-bold text-base flex items-center justify-center">
                    {auditUser.name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}
                <div>
                  <h3 className="font-display font-bold text-xl text-forge-gray-900">{auditUser.name}</h3>
                  <p className="text-xs text-forge-gray-500">{auditUser.email} • ID: {auditUser.id}</p>
                </div>
              </div>
              <button type="button" onClick={() => setAuditUser(null)} className="p-1.5 text-forge-gray-400 hover:text-forge-gray-600 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Profile & Balances Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-forge-gray-50 rounded-xl border border-forge-gray-200">
                <span className="text-[10px] font-bold uppercase text-forge-gray-500">Status</span>
                <p className="font-bold text-sm text-forge-gray-900 capitalize mt-0.5">{auditUser.status}</p>
              </div>
              <div className="p-3 bg-forge-gray-50 rounded-xl border border-forge-gray-200">
                <span className="text-[10px] font-bold uppercase text-forge-gray-500">KYC Status</span>
                <p className="font-bold text-sm text-forge-gray-900 capitalize mt-0.5">{auditUser.kycStatus}</p>
              </div>
              <div className="p-3 bg-forge-gray-50 rounded-xl border border-forge-gray-200 col-span-2">
                <span className="text-[10px] font-bold uppercase text-forge-gray-500">Unified Balance</span>
                <p className="font-display font-extrabold text-base text-forge-gray-900 mt-0.5">
                  {formatFiat(auditUser.baseBalanceUSD || 0)} USD
                </p>
                <p className="text-[10px] font-mono text-forge-gray-500">
                  ≈ {convertFiatToCrypto(auditUser.baseBalanceUSD || 0, 'BTC', liveRates).toFixed(5)} BTC • {convertFiatToCrypto(auditUser.baseBalanceUSD || 0, 'ETH', liveRates).toFixed(4)} ETH
                </p>
              </div>
            </div>

            {/* Linked Wallets */}
            <div>
              <h4 className="font-display font-bold text-sm text-forge-gray-900 mb-2">
                Linked Destination Accounts ({auditUser.linkedWallets?.length || 0})
              </h4>
              {(!auditUser.linkedWallets || auditUser.linkedWallets.length === 0) ? (
                <p className="text-xs text-forge-gray-400 italic">No linked accounts.</p>
              ) : (
                <div className="space-y-2">
                  {auditUser.linkedWallets.map((w) => (
                    <div key={w.id} className="p-3 bg-forge-gray-50 rounded-xl border border-forge-gray-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-forge-gray-900">{w.label}</span>
                        <span className="ml-2 px-1.5 py-0.5 bg-forge-orange-wash text-forge-orange rounded text-[10px] font-bold">{w.currency}</span>
                        <p className="font-mono text-forge-gray-500 text-[11px] truncate max-w-sm mt-0.5">{w.address}</p>
                      </div>
                      {w.isDefault && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-forge-gray-200 text-forge-gray-700 rounded">Primary</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Transactions */}
            <div>
              <h4 className="font-display font-bold text-sm text-forge-gray-900 mb-2">
                Transaction History
              </h4>
              {transactions.filter(t => t.userId === auditUser.id).length === 0 ? (
                <p className="text-xs text-forge-gray-400 italic">No transactions recorded for this user yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {transactions.filter(t => t.userId === auditUser.id).map((t) => (
                    <div key={t.id} className="p-3 bg-forge-gray-50 rounded-xl border border-forge-gray-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-forge-gray-900">{t.description}</p>
                        <p className="text-[11px] text-forge-gray-400">{new Date(t.date).toLocaleDateString()} • {t.status}</p>
                      </div>
                      <span className={`font-bold tabular-nums ${t.amount > 0 ? "text-market-up" : "text-forge-gray-900"}`}>
                        {t.amount > 0 ? `+${t.amount}` : t.amount} {t.currency}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setAuditUser(null)}
                className="px-5 py-2.5 bg-forge-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: INSPECT KYC DOCUMENTS                                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {inspectKycUser && inspectKycUser.kycData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setInspectKycUser(null)} />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-forge-gray-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-forge-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forge-orange-wash text-forge-orange flex items-center justify-center">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-forge-gray-900">
                    Document Inspection: {inspectKycUser.kycData.firstName} {inspectKycUser.kycData.lastName}
                  </h3>
                  <p className="text-xs text-forge-gray-500">
                    Applicant ID: {inspectKycUser.id} • {inspectKycUser.email}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setInspectKycUser(null)} className="p-1.5 text-forge-gray-400 hover:text-forge-gray-700 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Document viewer + Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
              
              {/* Document Display (Left 8 cols) */}
              <div className="md:col-span-8 p-6 bg-forge-gray-100 flex flex-col justify-between border-r border-forge-gray-200">
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-4 bg-white p-1 rounded-xl border border-forge-gray-200 shadow-sm self-start text-xs font-bold">
                  {(['front', 'back', 'selfie'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setInspectDocTab(tab)}
                      className={`px-4 py-1.5 rounded-lg capitalize transition-colors ${
                        inspectDocTab === tab
                          ? "bg-forge-orange text-white"
                          : "text-forge-gray-600 hover:text-forge-gray-900"
                      }`}
                    >
                      {tab === 'front' ? 'ID Front' : tab === 'back' ? 'ID Back' : 'Selfie Verification'}
                    </button>
                  ))}
                </div>

                {/* Document View Canvas */}
                <div className="flex-1 flex items-center justify-center p-4 bg-white rounded-2xl border border-forge-gray-200 shadow-inner min-h-[300px]">
                  {inspectDocTab === 'front' && inspectKycUser.kycData.frontFile ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={inspectKycUser.kycData.frontFile} 
                      alt="Front Document" 
                      className="max-h-[360px] w-auto object-contain rounded-xl shadow-md"
                    />
                  ) : inspectDocTab === 'back' && inspectKycUser.kycData.backFile ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={inspectKycUser.kycData.backFile} 
                      alt="Back Document" 
                      className="max-h-[360px] w-auto object-contain rounded-xl shadow-md"
                    />
                  ) : inspectDocTab === 'selfie' && inspectKycUser.kycData.selfieFile ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={inspectKycUser.kycData.selfieFile} 
                      alt="Selfie Biometric" 
                      className="max-h-[360px] w-auto object-contain rounded-xl shadow-md"
                    />
                  ) : (
                    <div className="text-center p-8 text-forge-gray-400">
                      <FileText size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-bold uppercase">No document file available for {inspectDocTab}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Applicant Data Panel (Right 4 cols) */}
              <div className="md:col-span-4 p-6 space-y-4 bg-white text-xs">
                <h4 className="font-display font-bold text-sm text-forge-gray-900 border-b border-forge-gray-100 pb-2">
                  Applicant Information
                </h4>

                <div>
                  <span className="text-[10px] font-bold text-forge-gray-400 uppercase">Legal Full Name</span>
                  <p className="font-bold text-forge-gray-900 text-sm">{inspectKycUser.kycData.firstName} {inspectKycUser.kycData.lastName}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-forge-gray-400 uppercase">Date of Birth</span>
                  <p className="font-semibold text-forge-gray-800">{inspectKycUser.kycData.dob}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-forge-gray-400 uppercase">Nationality</span>
                  <p className="font-semibold text-forge-gray-800">{inspectKycUser.kycData.nationality}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-forge-gray-400 uppercase">Document Type & ID</span>
                  <p className="font-semibold text-forge-gray-800 uppercase">{inspectKycUser.kycData.documentType}</p>
                  <p className="font-mono text-forge-gray-600 mt-0.5">{inspectKycUser.kycData.documentNumber}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-forge-gray-400 uppercase">Registered Address</span>
                  <p className="font-semibold text-forge-gray-800">{inspectKycUser.kycData.address}</p>
                  <p className="text-forge-gray-500">{inspectKycUser.kycData.city}, {inspectKycUser.kycData.country}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-forge-gray-400 uppercase">Submitted At</span>
                  <p className="text-forge-gray-500">{new Date(inspectKycUser.kycData.submittedAt).toLocaleString()}</p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-forge-gray-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleApproveKyc(inspectKycUser.id)}
                    className="w-full py-3 bg-market-up hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={16} /> Approve Verification
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectKycUser(inspectKycUser)}
                    className="w-full py-2.5 bg-white border border-market-down text-market-down hover:bg-market-down hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={16} /> Reject Submission
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: REJECT KYC SUBMISSION                                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {rejectKycUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setRejectKycUser(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-forge-gray-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-market-down/10 text-market-down flex items-center justify-center shrink-0">
                <XCircle size={22} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-forge-gray-900">
                  Reject KYC Submission
                </h3>
                <p className="text-xs text-forge-gray-500">Applicant: {rejectKycUser.name}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                Rejection Reason (Sent to User)
              </label>
              <textarea
                value={kycRejectionReason}
                onChange={(e) => setKycRejectionReason(e.target.value)}
                placeholder="e.g. Unreadable document image, expired passport, or name mismatch..."
                rows={3}
                className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl p-3 text-xs text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-market-down"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "Blurry image, please re-upload clear photo",
                "Document has expired",
                "Name does not match registered account",
                "Selfie facial mismatch",
              ].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setKycRejectionReason(r)}
                  className="px-2 py-1 bg-forge-gray-100 hover:bg-forge-gray-200 text-forge-gray-600 rounded text-[11px] font-medium"
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectKycUser(null)}
                className="px-4 py-2 text-xs font-bold text-forge-gray-600 hover:text-forge-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectKyc}
                className="px-5 py-2.5 bg-market-down hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: FULL SIZE PROOF RECEIPT IMAGE                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-forge-gray-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="font-display font-bold text-lg text-forge-gray-900">
                  {previewImage.title}
                </h3>
                {previewImage.txHash && (
                  <p className="text-xs font-mono text-forge-gray-500">
                    TXID: {previewImage.txHash}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setPreviewImage(null)}
                className="text-forge-gray-400 hover:text-forge-gray-700 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-forge-gray-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={previewImage.src}
                alt="Full size screenshot proof"
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-lg border border-forge-gray-300"
              />
            </div>

            <div className="p-4 border-t border-forge-gray-100 bg-white flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-5 py-2 bg-forge-gray-900 text-white font-bold text-sm rounded-lg hover:bg-black"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: REJECT DEPOSIT PROOF                                     */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {rejectDepositTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 border border-forge-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-market-down/10 text-market-down flex items-center justify-center shrink-0">
                <XCircle size={22} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-forge-gray-900">
                  Reject Deposit Submission
                </h3>
                <p className="text-xs text-forge-gray-500">
                  Deposit of {rejectDepositTx.amount} {rejectDepositTx.currency}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forge-gray-700 mb-1.5">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={depositRejectReason}
                onChange={(e) => setDepositRejectReason(e.target.value)}
                placeholder="e.g. Unconfirmed transaction, wrong amount sent, or unreadable receipt image..."
                rows={3}
                className="w-full bg-forge-gray-50 border border-forge-gray-200 rounded-xl p-3 text-xs text-forge-gray-900 focus:outline-none focus:ring-2 focus:ring-market-down"
              />
            </div>

            {/* Quick Reason Presets */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "Unconfirmed blockchain transaction",
                "Receipt amount does not match",
                "Unreadable / blurry receipt",
                "Duplicate submission",
              ].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setDepositRejectReason(r)}
                  className="px-2 py-1 bg-forge-gray-100 hover:bg-forge-gray-200 text-forge-gray-600 rounded text-[11px] font-medium"
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectDepositTx(null);
                  setDepositRejectReason("");
                }}
                className="px-4 py-2.5 text-xs font-bold text-forge-gray-600 hover:text-forge-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectDeposit}
                className="px-5 py-2.5 bg-market-down hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
