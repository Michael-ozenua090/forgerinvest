import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  CurrencyType, 
  PlanDurationMonths, 
  PLAN_CONFIG, 
  DEFAULT_RATES, 
  convertCryptoToFiat, 
  convertFiatToCrypto,
  formatCrypto 
} from './format';
import { createClient } from './supabase/client';

export type { CurrencyType, PlanDurationMonths };

export interface LinkedWallet {
  id: string;
  currency: CurrencyType;
  label: string; // e.g. "Personal Ledger", "MetaMask", "Phantom"
  address: string; // e.g. "0x71C...", "bc1q...", or "7xKX..."
  isDefault?: boolean;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  baseBalanceUSD: number; // Unified single balance stored in USD
  avatar?: string; // Base64 data URL
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  kycData?: {
    id?: string;
    firstName: string;
    lastName: string;
    dob: string;
    nationality: string;
    documentType: string;
    documentNumber: string;
    address: string;
    city: string;
    country: string;
    frontFile?: string; // Base64
    backFile?: string;  // Base64
    selfieFile?: string;// Base64
    submittedAt: string;
    rejectionReason?: string;
  };
  linkedWallets: LinkedWallet[];
  notifications?: Notification[];
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  kycStatus: "pending" | "verified" | "unverified" | "rejected";
}

export interface SavingsPlan {
  id: string;
  capital: number; // stored in base USD
  currency: CurrencyType;
  durationMonths: PlanDurationMonths;
  interestRatePercent: number; // 6, 15, 27, 66, 162
  projectedProfit: number; // in USD
  totalPayout: number; // in USD
  startDate: string;
  maturityDate: string;
  isMatured: boolean;
  status: 'ACTIVE' | 'MATURED' | 'WITHDRAWN';
}

export interface Transaction {
  id: string;
  date: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'PLAN_STAKE' | 'PLAN_PAYOUT';
  description: string;
  amount: number;
  currency: CurrencyType;
  status: 'COMPLETED' | 'PENDING' | 'REJECTED';
  txHash?: string;
  destinationAddress?: string;
  proofImage?: string; // Base64 data URL of uploaded screenshot
  rejectionReason?: string;
  userId?: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

export interface AppState {
  user: User;
  users: UserAccount[];
  currentUser: UserAccount;
  isKycCompleted: boolean;
  activeCurrency: CurrencyType;
  liveRates: Record<CurrencyType, number>;
  baseBalanceUSD: number; // Unified single balance
  cryptoBalances: Record<CurrencyType, number>; // Live converted representation of baseBalanceUSD
  savingsPlans: SavingsPlan[];
  transactions: Transaction[];
  notifications: Notification[];
  toastMessage: string | null;
  isDepositModalOpen: boolean;
  isSyncing: boolean;

  getBalance: (currency: CurrencyType) => number;
  fetchRates: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  setDepositModalOpen: (isOpen: boolean) => void;
  setCurrency: (currency: CurrencyType) => void;
  createPlan: (
    amount: number,
    currency: CurrencyType,
    duration: PlanDurationMonths
  ) => Promise<boolean>;
  withdrawPlan: (planId: string) => Promise<{ success: boolean; requiresKyc?: boolean; error?: string }>;
  depositFunds: (currency: CurrencyType, amount: number) => void;
  submitDepositProof: (
    currency: CurrencyType,
    amount: number,
    txHash: string,
    proofImage: string
  ) => Promise<void>;
  approveDeposit: (txId: string) => void;
  rejectDeposit: (txId: string, reason?: string) => void;
  updateUserBalance: (currency: CurrencyType, newBalance: number) => void;
  withdrawFunds: (
    currency: CurrencyType,
    amount: number,
    destinationAddress?: string
  ) => Promise<{ success: boolean; requiresKyc?: boolean; error?: string }>;
  completeKYC: (data?: any) => void;
  setToast: (msg: string | null) => void;
  markNotificationsAsRead: () => void;

  // Profile Avatar Action
  updateUserAvatar: (avatarBase64: string | null) => void;

  // Admin Broadcast / Push Notification Action
  adminPushNotification: (recipientId: 'ALL' | string, message: string) => void;

  // Destination Wallet Linking Actions
  addLinkedWallet: (currency: CurrencyType, label: string, address: string) => Promise<LinkedWallet>;
  removeLinkedWallet: (walletId: string) => Promise<void>;

  // Admin User Management Actions
  adminUpdateUser: (userId: string, data: Partial<UserAccount>) => void;
  adminDeleteUser: (userId: string) => void;
  adminResetPassword: (userId: string) => string;
  adminToggleSuspension: (userId: string) => void;
  adminUpdateUserBalance: (userId: string, currency: CurrencyType, amount: number) => void;

  // Admin KYC Approval Actions
  adminApproveKyc: (userId: string) => void;
  adminRejectKyc: (userId: string, reason: string) => void;

  // Supabase Hydration & Auth State Actions
  setCurrentUser: (userData: Partial<UserAccount>) => void;
  setUsers: (users: UserAccount[]) => void;
  setSavingsPlans: (plans: SavingsPlan[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  setLinkedWallets: (wallets: LinkedWallet[]) => void;
  resetSession: () => void;
}

export const computeBalances = (baseUSD: number, rates: Record<CurrencyType, number>): Record<CurrencyType, number> => ({
  USD: baseUSD,
  GBP: convertFiatToCrypto(baseUSD, 'GBP', rates),
  BTC: convertFiatToCrypto(baseUSD, 'BTC', rates),
  ETH: convertFiatToCrypto(baseUSD, 'ETH', rates),
  SOL: convertFiatToCrypto(baseUSD, 'SOL', rates),
});

const EMPTY_USER_ACCOUNT: UserAccount = {
  id: "",
  name: "",
  email: "",
  role: "user",
  status: "active",
  createdAt: new Date().toISOString(),
  baseBalanceUSD: 0,
  avatar: undefined,
  kycStatus: "unverified",
  linkedWallets: [],
  notifications: [],
};

const EMPTY_USER: User = {
  name: "",
  email: "",
  avatar: undefined,
  isVerified: false,
  kycStatus: "unverified",
};

const INITIAL_USERS: UserAccount[] = [];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: INITIAL_USERS,
      currentUser: EMPTY_USER_ACCOUNT,
      user: EMPTY_USER,
      isKycCompleted: false,
      activeCurrency: 'USD',
      liveRates: DEFAULT_RATES,
      baseBalanceUSD: 0,
      cryptoBalances: computeBalances(0, DEFAULT_RATES),
      savingsPlans: [],
      transactions: [],
      notifications: [],
      toastMessage: null,
      isDepositModalOpen: false,
      isSyncing: false,

      getBalance: (currency) => {
        const state = get();
        return convertFiatToCrypto(state.baseBalanceUSD, currency, state.liveRates);
      },

      fetchRates: async () => {
        try {
          const res = await fetch('/api/rates');
          if (res.ok) {
            const data = await res.json();
            if (data.rates) {
              set((state) => ({
                liveRates: data.rates,
                cryptoBalances: computeBalances(state.baseBalanceUSD, data.rates),
              }));
            }
          }
        } catch {
          // Graceful fallback to cached rates
        }
      },

      syncWithBackend: async () => {
        set({ isSyncing: true });
        try {
          const res = await fetch('/api/user/sync');
          if (res.ok) {
            const data = await res.json();
            // If future backend supplies updated canonical state, update store seamlessly
            if (data && data.canonicalUser) {
              set((state) => ({
                baseBalanceUSD: data.canonicalUser.baseBalanceUSD ?? state.baseBalanceUSD,
                cryptoBalances: data.canonicalUser.baseBalanceUSD !== undefined 
                  ? computeBalances(data.canonicalUser.baseBalanceUSD, state.liveRates) 
                  : state.cryptoBalances,
                savingsPlans: data.canonicalUser.savingsPlans ?? state.savingsPlans,
                transactions: data.canonicalUser.transactions ?? state.transactions,
                notifications: data.canonicalUser.notifications ?? state.notifications,
              }));
            }
          }
        } catch {
          // Graceful offline fallback - keeps client-persisted storage intact
        } finally {
          set({ isSyncing: false });
        }
      },

      setDepositModalOpen: (isOpen) => set({ isDepositModalOpen: isOpen }),

      setCurrency: (currency) => {
        set({ activeCurrency: currency });
      },

      createPlan: async (amount, currency, duration) => {
        const state = get();
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          set({ toastMessage: "Please sign in to activate a growth plan." });
          return false;
        }

        const capitalUsd = convertCryptoToFiat(amount, currency, state.liveRates);
        if (capitalUsd < 50) {
          set({ toastMessage: "Minimum capital requirement is $50.00 USD." });
          return false;
        }

        if (state.baseBalanceUSD < capitalUsd) {
          set({ toastMessage: "Insufficient balance." });
          return false;
        }

        const config = PLAN_CONFIG[duration] || PLAN_CONFIG[1];
        const profitUsd = capitalUsd * (config.ratePercent / 100);
        const payoutUsd = capitalUsd + profitUsd;
        const newBalanceUsd = state.baseBalanceUSD - capitalUsd;

        const now = new Date();
        const maturity = new Date();
        maturity.setMonth(maturity.getMonth() + duration);

        // 1. Deduct balance in Supabase profiles table
        const { error: balanceErr } = await supabase
          .from('profiles')
          .update({ base_balance_usd: newBalanceUsd, updated_at: now.toISOString() })
          .eq('id', user.id);

        if (balanceErr) {
          set({ toastMessage: `Failed to update balance: ${balanceErr.message}` });
          return false;
        }

        // 2. Insert plan into Supabase savings_plans table
        const { data: insertedPlan, error: planErr } = await supabase
          .from('savings_plans')
          .insert({
            user_id: user.id,
            capital_usd: capitalUsd,
            currency,
            duration_months: duration,
            interest_rate_percent: config.ratePercent,
            projected_profit_usd: profitUsd,
            total_payout_usd: payoutUsd,
            start_date: now.toISOString(),
            maturity_date: maturity.toISOString(),
            status: 'ACTIVE',
          })
          .select()
          .single();

        if (planErr || !insertedPlan) {
          set({ toastMessage: `Failed to save plan: ${planErr?.message}` });
          return false;
        }

        // 3. Insert transaction into Supabase transactions table
        const desc = `${config.label} Fixed Growth Plan ($${capitalUsd.toFixed(2)} USD @ +${config.ratePercent}%)`;
        const { data: insertedTx } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: 'PLAN_STAKE',
            description: desc,
            amount: -amount,
            currency,
            status: 'COMPLETED',
          })
          .select()
          .single();

        // 4. Insert notification into Supabase
        try {
          await supabase.from('notifications').insert({
            user_id: user.id,
            title: 'Growth Plan Activated',
            message: `Locked $${capitalUsd.toFixed(2)} USD for ${config.label} (+${config.ratePercent}% return).`,
            type: 'SUCCESS',
          });
        } catch {}

        // 5. Update local store state
        const newPlan: SavingsPlan = {
          id: insertedPlan.id,
          capital: Number(insertedPlan.capital_usd ?? insertedPlan.capital ?? capitalUsd),
          currency: (insertedPlan.currency || currency) as CurrencyType,
          durationMonths: (insertedPlan.duration_months || duration) as PlanDurationMonths,
          interestRatePercent: Number(insertedPlan.interest_rate_percent || config.ratePercent),
          projectedProfit: Number(insertedPlan.projected_profit_usd ?? insertedPlan.projected_profit ?? profitUsd),
          totalPayout: Number(insertedPlan.total_payout_usd ?? insertedPlan.total_payout ?? payoutUsd),
          startDate: insertedPlan.start_date || now.toISOString(),
          maturityDate: insertedPlan.maturity_date || maturity.toISOString(),
          isMatured: false,
          status: 'ACTIVE',
        };

        const updatedCurrent: UserAccount = {
          ...state.currentUser,
          baseBalanceUSD: newBalanceUsd,
        };
        const updatedUsers = state.users.map((u) =>
          u.id === state.currentUser.id ? updatedCurrent : u
        );

        set({
          baseBalanceUSD: newBalanceUsd,
          cryptoBalances: computeBalances(newBalanceUsd, state.liveRates),
          currentUser: updatedCurrent,
          users: updatedUsers,
          savingsPlans: [newPlan, ...state.savingsPlans],
          transactions: insertedTx ? [{
            id: insertedTx.id,
            date: insertedTx.created_at || now.toISOString(),
            type: 'PLAN_STAKE',
            description: insertedTx.description || desc,
            amount: Number(insertedTx.amount),
            currency: (insertedTx.currency || currency) as CurrencyType,
            status: 'COMPLETED',
          }, ...state.transactions] : state.transactions,
          toastMessage: `Successfully activated ${config.label} Growth Plan!`,
        });

        return true;
      },

      withdrawPlan: async (planId) => {
        const state = get();
        const plan = state.savingsPlans.find((p) => p.id === planId);

        if (!plan) return { success: false, error: "Plan not found." };
        if (plan.status !== 'MATURED' && !plan.isMatured) {
          if (new Date() < new Date(plan.maturityDate)) {
            return { success: false, error: "Plan has not matured yet." };
          }
        }

        // INTENTIONAL KYC WITHDRAWAL GATE
        if (!state.isKycCompleted) {
          return {
            success: false,
            requiresKyc: true,
            error: "Identity verification required before withdrawing matured capital.",
          };
        }

        // Calculate payout in plan's currency
        const payoutCurrencyAmount = convertFiatToCrypto(
          plan.totalPayout,
          plan.currency,
          state.liveRates
        );

        const newBaseUSD = state.baseBalanceUSD + plan.totalPayout;
        const now = new Date().toISOString();

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 1. Update savings_plans status to 'WITHDRAWN' in Supabase
          await supabase
            .from('savings_plans')
            .update({ status: 'WITHDRAWN' })
            .eq('id', planId);

          // 2. Increment profile balance in Supabase
          await supabase
            .from('profiles')
            .update({ base_balance_usd: newBaseUSD, updated_at: now })
            .eq('id', user.id);

          // 3. Insert transaction log
          await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              type: 'PLAN_PAYOUT',
              description: `Matured Plan Payout: ${plan.interestRatePercent}% Yield on $${plan.capital.toFixed(2)} USD Principal`,
              amount: payoutCurrencyAmount,
              currency: plan.currency,
              status: 'COMPLETED',
            });

          // 4. Notification
          try {
            await supabase.from('notifications').insert({
              user_id: user.id,
              title: 'Matured Plan Disbursed',
              message: `Successfully claimed ${formatCrypto(payoutCurrencyAmount, plan.currency)} payout from your ${plan.durationMonths}-Month plan!`,
              type: 'SUCCESS',
            });
          } catch {}
        }

        const newTx: Transaction = {
          id: "tx-" + Math.random().toString(36).substring(2, 9),
          date: now,
          type: 'PLAN_PAYOUT',
          description: `Matured Plan Payout: ${plan.interestRatePercent}% Yield on $${plan.capital.toFixed(2)} USD Principal`,
          amount: payoutCurrencyAmount,
          currency: plan.currency,
          status: 'COMPLETED',
          userId: user?.id || state.currentUser.id,
        };

        const updatedPlans = state.savingsPlans.map((p) =>
          p.id === planId ? { ...p, status: 'WITHDRAWN' as const, isMatured: true } : p
        );

        const updatedCurrent: UserAccount = {
          ...state.currentUser,
          baseBalanceUSD: newBaseUSD,
        };
        const updatedUsers = state.users.map((u) =>
          u.id === state.currentUser.id ? updatedCurrent : u
        );

        set({
          baseBalanceUSD: newBaseUSD,
          cryptoBalances: computeBalances(newBaseUSD, state.liveRates),
          currentUser: updatedCurrent,
          users: updatedUsers,
          savingsPlans: updatedPlans,
          transactions: [newTx, ...state.transactions],
          toastMessage: `Successfully claimed ${formatCrypto(payoutCurrencyAmount, plan.currency)} payout!`,
        });

        return { success: true };
      },

      depositFunds: (currency, amount) => {
        const state = get();
        const depositValueUSD = convertCryptoToFiat(amount, currency, state.liveRates);
        const newBaseUSD = state.baseBalanceUSD + depositValueUSD;

        const newTx: Transaction = {
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toISOString(),
          type: 'DEPOSIT',
          description: `${currency} Capital Deposit`,
          amount: amount,
          currency,
          status: 'COMPLETED',
          userId: state.currentUser.id,
        };

        const updatedCurrent: UserAccount = {
          ...state.currentUser,
          baseBalanceUSD: newBaseUSD,
        };
        const updatedUsers = state.users.map((u) =>
          u.id === state.currentUser.id ? updatedCurrent : u
        );

        set({
          baseBalanceUSD: newBaseUSD,
          cryptoBalances: computeBalances(newBaseUSD, state.liveRates),
          currentUser: updatedCurrent,
          users: updatedUsers,
          transactions: [newTx, ...state.transactions],
        });
      },

      submitDepositProof: async (currency, amount, txHash, proofImage) => {
        const state = get();
        const now = new Date().toISOString();
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let insertedId = "tx-" + Math.random().toString(36).substring(2, 9);

        if (user) {
          const { data: insertedTx } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              type: 'DEPOSIT',
              description: `${currency} Capital Deposit (Proof Submitted)`,
              amount,
              currency,
              status: 'PENDING',
              tx_hash: txHash,
              proof_image: proofImage,
            })
            .select()
            .maybeSingle();

          if (insertedTx?.id) {
            insertedId = insertedTx.id;
          }

          try {
            await supabase.from('notifications').insert({
              user_id: user.id,
              title: 'Deposit Proof Submitted',
              message: `Deposit of ${amount} ${currency} submitted and pending admin verification.`,
              type: 'INFO',
            });
          } catch {}
        }

        const newTx: Transaction = {
          id: insertedId,
          date: now,
          type: 'DEPOSIT',
          description: `${currency} Capital Deposit (Proof Submitted)`,
          amount,
          currency,
          status: 'PENDING',
          txHash,
          proofImage,
          userId: user?.id || state.currentUser.id,
        };

        const newNotification: Notification = {
          id: "notif-" + Math.random().toString(36).substring(2, 9),
          message: `Deposit of ${amount} ${currency} submitted and pending admin verification.`,
          timestamp: now,
          read: false,
        };

        set({
          transactions: [newTx, ...state.transactions],
          notifications: [newNotification, ...state.notifications],
          toastMessage: "Proof of payment submitted! Pending administrative review.",
        });
      },

      approveDeposit: (txId) => {
        const state = get();
        const tx = state.transactions.find((t) => t.id === txId);
        if (!tx || tx.status !== 'PENDING') return;

        const updatedTxList = state.transactions.map((t) =>
          t.id === txId ? { ...t, status: 'COMPLETED' as const } : t
        );

        const newNotification: Notification = {
          id: "notif-" + Math.random().toString(36).substring(2, 9),
          message: `Deposit of ${tx.amount} ${tx.currency} was verified and credited to your balance!`,
          timestamp: new Date().toISOString(),
          read: false,
        };

        const depositValueUSD = convertCryptoToFiat(tx.amount, tx.currency, state.liveRates);
        const newBaseUSD = state.baseBalanceUSD + depositValueUSD;

        const isCurrent = !tx.userId || tx.userId === state.currentUser.id;
        const updatedUsers = state.users.map((u) => {
          if ((tx.userId && u.id === tx.userId) || (!tx.userId && u.id === state.currentUser.id)) {
            return {
              ...u,
              baseBalanceUSD: (u.baseBalanceUSD || 0) + depositValueUSD,
            };
          }
          return u;
        });

        const updatedCurrent: UserAccount = isCurrent
          ? { ...state.currentUser, baseBalanceUSD: newBaseUSD }
          : state.currentUser;

        set({
          baseBalanceUSD: isCurrent ? newBaseUSD : state.baseBalanceUSD,
          cryptoBalances: isCurrent ? computeBalances(newBaseUSD, state.liveRates) : state.cryptoBalances,
          currentUser: updatedCurrent,
          users: updatedUsers,
          transactions: updatedTxList,
          notifications: [newNotification, ...state.notifications],
          toastMessage: `Deposit #${txId.slice(0, 8)} approved and credited successfully!`,
        });
      },

      rejectDeposit: (txId, reason) => {
        const state = get();
        const tx = state.transactions.find((t) => t.id === txId);
        if (!tx || tx.status !== 'PENDING') return;

        const updatedTxList = state.transactions.map((t) =>
          t.id === txId ? { ...t, status: 'REJECTED' as const, rejectionReason: reason } : t
        );

        const newNotification: Notification = {
          id: "notif-" + Math.random().toString(36).substring(2, 9),
          message: `Deposit of ${tx.amount} ${tx.currency} was rejected.${reason ? ` Reason: ${reason}` : ''}`,
          timestamp: new Date().toISOString(),
          read: false,
        };

        set({
          transactions: updatedTxList,
          notifications: [newNotification, ...state.notifications],
          toastMessage: `Deposit #${txId.slice(0, 8)} rejected.`,
        });
      },

      updateUserBalance: (currency, newBalance) => {
        const state = get();
        const safeBal = Math.max(0, newBalance);
        const newBaseUSD = convertCryptoToFiat(safeBal, currency, state.liveRates);

        const updatedCurrent: UserAccount = {
          ...state.currentUser,
          baseBalanceUSD: newBaseUSD,
        };
        const updatedUsers = state.users.map((u) =>
          u.id === state.currentUser.id ? updatedCurrent : u
        );

        set({
          baseBalanceUSD: newBaseUSD,
          cryptoBalances: computeBalances(newBaseUSD, state.liveRates),
          currentUser: updatedCurrent,
          users: updatedUsers,
          toastMessage: `Balance updated to ${safeBal} ${currency} ($${newBaseUSD.toFixed(2)} USD).`,
        });
      },

      withdrawFunds: async (currency, amount, destinationAddress) => {
        const state = get();

        // INTENTIONAL KYC WITHDRAWAL GATE
        if (!state.isKycCompleted) {
          return {
            success: false,
            requiresKyc: true,
            error: "Identity Verification Required: Before withdrawing your capital and interest profits, regulatory compliance requires you to complete KYC verification.",
          };
        }

        const withdrawValueUSD = convertCryptoToFiat(amount, currency, state.liveRates);
        if (state.baseBalanceUSD < withdrawValueUSD) {
          return { success: false, error: "Insufficient balance for withdrawal." };
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const newBaseUSD = state.baseBalanceUSD - withdrawValueUSD;
        const now = new Date().toISOString();
        let insertedId = "tx-" + Math.random().toString(36).substring(2, 9);

        if (user) {
          // 1. Deduct balance in profiles table
          const { error: balErr } = await supabase
            .from('profiles')
            .update({ base_balance_usd: newBaseUSD, updated_at: now })
            .eq('id', user.id);

          if (balErr) {
            return { success: false, error: `Balance deduction failed: ${balErr.message}` };
          }

          // 2. Insert withdrawal transaction
          const { data: insertedTx } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              type: 'WITHDRAW',
              description: `${currency} Withdrawal to ${destinationAddress ? destinationAddress.slice(0, 10) + '...' : 'External Wallet'}`,
              amount: -amount,
              currency,
              status: 'PENDING',
              destination_address: destinationAddress,
            })
            .select()
            .maybeSingle();

          if (insertedTx?.id) {
            insertedId = insertedTx.id;
          }

          // 3. Notification
          try {
            await supabase.from('notifications').insert({
              user_id: user.id,
              title: 'Withdrawal Requested',
              message: `Requested withdrawal of ${formatCrypto(amount, currency)} to ${destinationAddress ? destinationAddress.slice(0, 10) + '...' : 'External Wallet'}`,
              type: 'INFO',
            });
          } catch {}
        }

        const newTx: Transaction = {
          id: insertedId,
          date: now,
          type: 'WITHDRAW',
          description: `${currency} Withdrawal to ${destinationAddress ? destinationAddress.slice(0, 10) + '...' : 'External Wallet'}`,
          amount: -amount,
          currency,
          status: 'PENDING',
          destinationAddress,
          userId: user?.id || state.currentUser.id,
        };

        const updatedCurrent: UserAccount = {
          ...state.currentUser,
          baseBalanceUSD: newBaseUSD,
        };
        const updatedUsers = state.users.map((u) =>
          u.id === state.currentUser.id ? updatedCurrent : u
        );

        set({
          baseBalanceUSD: newBaseUSD,
          cryptoBalances: computeBalances(newBaseUSD, state.liveRates),
          currentUser: updatedCurrent,
          users: updatedUsers,
          transactions: [newTx, ...state.transactions],
          toastMessage: `Withdrawal of ${formatCrypto(amount, currency)} submitted!`,
        });

        return { success: true };
      },

      completeKYC: (data) => {
        const state = get();
        const kycPayload = data ? {
          firstName: data.first_name || state.currentUser.name.split(' ')[0] || "Client",
          lastName: data.last_name || state.currentUser.name.split(' ')[1] || "User",
          dob: data.date_of_birth || "1990-01-01",
          nationality: data.nationality || "United States",
          documentType: data.document_type || "passport",
          documentNumber: data.document_number || "DOC-" + Math.floor(100000 + Math.random() * 900000),
          address: data.address_line_1 || "123 Main St",
          city: data.city || "New York",
          country: data.country || "United States",
          submittedAt: new Date().toISOString(),
        } : state.currentUser.kycData;

        const updatedCurrentUser: UserAccount = {
          ...state.currentUser,
          kycStatus: "pending",
          kycData: kycPayload,
        };

        const updatedUsers = state.users.map((u) =>
          u.id === state.currentUser.id ? updatedCurrentUser : u
        );

        const newNotif: Notification = {
          id: "notif-" + Math.random().toString(36).substring(2, 9),
          message: "KYC verification documents received. Pending compliance review.",
          timestamp: new Date().toISOString(),
          read: false,
        };

        set({
          currentUser: updatedCurrentUser,
          users: updatedUsers,
          user: {
            ...state.user,
            kycStatus: "pending",
          },
          notifications: [newNotif, ...state.notifications],
          toastMessage: "KYC documents submitted successfully. Verification in progress.",
        });
      },

      setToast: (msg) => set({ toastMessage: msg }),

      markNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      // Profile Avatar Action
      updateUserAvatar: (avatarBase64) => {
        const state = get();
        const updatedCurrent: UserAccount = {
          ...state.currentUser,
          avatar: avatarBase64 || undefined,
        };
        const updatedUsers = state.users.map((u) =>
          u.id === state.currentUser.id ? updatedCurrent : u
        );

        set({
          currentUser: updatedCurrent,
          users: updatedUsers,
          user: {
            ...state.user,
            avatar: avatarBase64 || undefined,
          },
          toastMessage: avatarBase64 ? "Profile picture updated successfully!" : "Profile picture removed.",
        });
      },

      // Admin Broadcast / Push Notification Action
      adminPushNotification: (recipientId, message) => {
        const state = get();
        const now = new Date().toISOString();
        const newNotif: Notification = {
          id: "notif-" + Math.random().toString(36).substring(2, 9),
          message,
          timestamp: now,
          read: false,
        };

        if (recipientId === 'ALL') {
          const updatedUsers = state.users.map((u) => ({
            ...u,
            notifications: [newNotif, ...(u.notifications || [])],
          }));

          set({
            users: updatedUsers,
            notifications: [newNotif, ...state.notifications],
            toastMessage: "Announcement broadcasted to all users successfully.",
          });
        } else {
          const updatedUsers = state.users.map((u) =>
            u.id === recipientId
              ? {
                  ...u,
                  notifications: [newNotif, ...(u.notifications || [])],
                }
              : u
          );

          const isCurrent = state.currentUser.id === recipientId;
          set({
            users: updatedUsers,
            notifications: isCurrent ? [newNotif, ...state.notifications] : state.notifications,
            toastMessage: `Push notification sent to user ${recipientId}.`,
          });
        }
      },

      // Destination Wallet Linking Actions
      addLinkedWallet: async (currency, label, address) => {
        const state = get();
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const isDefault = (state.currentUser.linkedWallets || []).filter((w) => w.currency === currency).length === 0;
        let newWalletId = "w-" + Math.random().toString(36).substring(2, 9);
        const now = new Date().toISOString();

        if (user) {
          try {
            const { data: dbWallet } = await supabase
              .from('linked_wallets')
              .insert({
                user_id: user.id,
                currency,
                label,
                address,
                is_default: isDefault,
              })
              .select()
              .maybeSingle();

            if (dbWallet?.id) {
              newWalletId = dbWallet.id;
            }
          } catch (err) {
            console.error("Failed to insert linked wallet to Supabase:", err);
          }
        }

        const newWallet: LinkedWallet = {
          id: newWalletId,
          currency,
          label,
          address,
          isDefault,
          createdAt: now,
        };

        const updatedWallets = [...(state.currentUser.linkedWallets || []), newWallet];
        const updatedCurrentUser: UserAccount = { ...state.currentUser, linkedWallets: updatedWallets };
        const updatedUsers = state.users.map((u) =>
          u.id === state.currentUser.id ? updatedCurrentUser : u
        );

        set({
          currentUser: updatedCurrentUser,
          users: updatedUsers,
          toastMessage: `Destination wallet "${newWallet.label}" linked successfully!`,
        });

        return newWallet;
      },

      removeLinkedWallet: async (walletId) => {
        const state = get();
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          try {
            await supabase
              .from('linked_wallets')
              .delete()
              .eq('id', walletId)
              .eq('user_id', user.id);
          } catch (err) {
            console.error("Failed to delete linked wallet from Supabase:", err);
          }
        }

        const updatedWallets = (state.currentUser.linkedWallets || []).filter((w) => w.id !== walletId);
        const updatedCurrentUser: UserAccount = { ...state.currentUser, linkedWallets: updatedWallets };
        const updatedUsers = state.users.map((u) =>
          u.id === state.currentUser.id ? updatedCurrentUser : u
        );

        set({
          currentUser: updatedCurrentUser,
          users: updatedUsers,
          toastMessage: "Wallet removed.",
        });
      },

      // Admin User Management Actions
      adminUpdateUser: (userId, data) => {
        const state = get();
        const updatedUsers = state.users.map((u) => {
          if (u.id === userId) {
            return { ...u, ...data };
          }
          return u;
        });

        const isCurrent = state.currentUser.id === userId;
        const updatedCurrent: UserAccount = isCurrent ? { ...state.currentUser, ...data } : state.currentUser;

        set({
          users: updatedUsers,
          currentUser: updatedCurrent,
          user: isCurrent
            ? {
                ...state.user,
                name: data.name ?? state.user.name,
                email: data.email ?? state.user.email,
              }
            : state.user,
          toastMessage: `User profile updated.`,
        });
      },

      adminDeleteUser: (userId) => {
        const state = get();
        if (state.currentUser.id === userId) {
          set({ toastMessage: "Cannot delete the active session user." });
          return;
        }
        set({
          users: state.users.filter((u) => u.id !== userId),
          toastMessage: `User ${userId} deleted.`,
        });
      },

      adminResetPassword: (userId) => {
        const tempPass = `Forge-Temp-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        set({
          toastMessage: `Temporary password generated for ${userId}: ${tempPass}`,
        });
        return tempPass;
      },

      adminToggleSuspension: (userId) => {
        const state = get();
        const target = state.users.find((u) => u.id === userId);
        if (!target) return;
        const newStatus: 'active' | 'suspended' = target.status === 'active' ? 'suspended' : 'active';
        const updatedUsers = state.users.map((u) =>
          u.id === userId ? { ...u, status: newStatus } : u
        );
        const isCurrent = state.currentUser.id === userId;

        set({
          users: updatedUsers,
          currentUser: isCurrent ? { ...state.currentUser, status: newStatus } : state.currentUser,
          toastMessage: `User account ${userId} status changed to ${newStatus}.`,
        });
      },

      adminUpdateUserBalance: (userId, currency, amount) => {
        const state = get();
        const safeBal = Math.max(0, amount);
        const newBaseUSD = convertCryptoToFiat(safeBal, currency, state.liveRates);

        const updatedUsers = state.users.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              baseBalanceUSD: newBaseUSD,
            };
          }
          return u;
        });

        const isCurrent = state.currentUser.id === userId;
        set({
          users: updatedUsers,
          currentUser: isCurrent
            ? {
                ...state.currentUser,
                baseBalanceUSD: newBaseUSD,
              }
            : state.currentUser,
          baseBalanceUSD: isCurrent ? newBaseUSD : state.baseBalanceUSD,
          cryptoBalances: isCurrent ? computeBalances(newBaseUSD, state.liveRates) : state.cryptoBalances,
          toastMessage: `Updated balance for ${userId} to ${amount} ${currency} ($${newBaseUSD.toFixed(2)} USD).`,
        });
      },

      // Admin KYC Approval Actions
      adminApproveKyc: (userId) => {
        const state = get();
        const updatedUsers = state.users.map((u) => {
          if (u.id === userId) {
            return { ...u, kycStatus: 'verified' as const };
          }
          return u;
        });

        const isCurrent = state.currentUser.id === userId;
        const newNotification: Notification = {
          id: "notif-" + Math.random().toString(36).substring(2, 9),
          message: "Your KYC verification has been approved. Fund withdrawals are now unlocked.",
          timestamp: new Date().toISOString(),
          read: false,
        };

        set({
          users: updatedUsers,
          currentUser: isCurrent ? { ...state.currentUser, kycStatus: 'verified' } : state.currentUser,
          user: isCurrent ? { ...state.user, kycStatus: 'verified', isVerified: true } : state.user,
          isKycCompleted: isCurrent ? true : state.isKycCompleted,
          notifications: [newNotification, ...state.notifications],
          toastMessage: `KYC for ${userId} approved successfully. Withdrawals unlocked.`,
        });
      },

      adminRejectKyc: (userId, reason) => {
        const state = get();
        const updatedUsers = state.users.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              kycStatus: 'rejected' as const,
              kycData: u.kycData ? { ...u.kycData, rejectionReason: reason } : undefined,
            };
          }
          return u;
        });

        const isCurrent = state.currentUser.id === userId;
        const newNotification: Notification = {
          id: "notif-" + Math.random().toString(36).substring(2, 9),
          message: `Your KYC verification was rejected. Reason: ${reason}`,
          timestamp: new Date().toISOString(),
          read: false,
        };

        set({
          users: updatedUsers,
          currentUser: isCurrent ? { ...state.currentUser, kycStatus: 'rejected' } : state.currentUser,
          user: isCurrent ? { ...state.user, kycStatus: 'rejected', isVerified: false } : state.user,
          isKycCompleted: isCurrent ? false : state.isKycCompleted,
          notifications: [newNotification, ...state.notifications],
          toastMessage: `KYC for ${userId} rejected.`,
        });
      },

      // Supabase State Hydration & Session Actions
      setCurrentUser: (userData) => {
        set((state) => {
          const updatedCurrent = { ...state.currentUser, ...userData };
          const fullName = updatedCurrent.name || state.user.name;
          const userEmail = updatedCurrent.email || state.user.email;
          const newBaseUSD = updatedCurrent.baseBalanceUSD !== undefined ? updatedCurrent.baseBalanceUSD : state.baseBalanceUSD;

          return {
            currentUser: updatedCurrent,
            user: {
              ...state.user,
              name: fullName,
              email: userEmail,
              avatar: updatedCurrent.avatar ?? state.user.avatar,
              kycStatus: updatedCurrent.kycStatus || state.user.kycStatus,
              isVerified: updatedCurrent.kycStatus === 'verified',
            },
            baseBalanceUSD: newBaseUSD,
            cryptoBalances: computeBalances(newBaseUSD, state.liveRates),
            isKycCompleted: updatedCurrent.kycStatus === 'verified',
          };
        });
      },

      setUsers: (usersList) => set({ users: usersList }),
      setSavingsPlans: (plans) => set({ savingsPlans: plans }),
      setTransactions: (txs) => set({ transactions: txs }),
      setNotifications: (notifs) => set({ notifications: notifs }),
      setLinkedWallets: (wallets) => {
        set((state) => {
          const updated = { ...state.currentUser, linkedWallets: wallets };
          return {
            currentUser: updated,
            users: state.users.map((u) => u.id === state.currentUser.id ? updated : u),
          };
        });
      },
      resetSession: () => {
        set({
          currentUser: EMPTY_USER_ACCOUNT,
          user: EMPTY_USER,
          baseBalanceUSD: 0,
          cryptoBalances: computeBalances(0, DEFAULT_RATES),
          savingsPlans: [],
          transactions: [],
          notifications: [],
          isKycCompleted: false,
        });
      },
    }),
    {
      name: 'forge-savings-storage-v5',
    }
  )
);
