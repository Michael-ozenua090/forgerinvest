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

export type { CurrencyType, PlanDurationMonths };

export interface LinkedWallet {
  id: string;
  currency: CurrencyType;
  label: string; // e.g. "Personal Ledger", "Metamask", "Chase Checking"
  address: string; // e.g. "0x71C...", "bc1q...", or IBAN/Routing
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

  getBalance: (currency: CurrencyType) => number;
  fetchRates: () => Promise<void>;
  setDepositModalOpen: (isOpen: boolean) => void;
  setCurrency: (currency: CurrencyType) => void;
  createPlan: (
    amount: number,
    currency: CurrencyType,
    duration: PlanDurationMonths
  ) => boolean;
  withdrawPlan: (planId: string) => { success: boolean; requiresKyc?: boolean; error?: string };
  depositFunds: (currency: CurrencyType, amount: number) => void;
  submitDepositProof: (
    currency: CurrencyType,
    amount: number,
    txHash: string,
    proofImage: string
  ) => void;
  approveDeposit: (txId: string) => void;
  rejectDeposit: (txId: string, reason?: string) => void;
  updateUserBalance: (currency: CurrencyType, newBalance: number) => void;
  withdrawFunds: (
    currency: CurrencyType,
    amount: number,
    destinationAddress?: string
  ) => { success: boolean; requiresKyc?: boolean; error?: string };
  completeKYC: (data?: any) => void;
  setToast: (msg: string | null) => void;
  markNotificationsAsRead: () => void;

  // Profile Avatar Action
  updateUserAvatar: (avatarBase64: string | null) => void;

  // Admin Broadcast / Push Notification Action
  adminPushNotification: (recipientId: 'ALL' | string, message: string) => void;

  // Destination Wallet Linking Actions
  addLinkedWallet: (currency: CurrencyType, label: string, address: string) => LinkedWallet;
  removeLinkedWallet: (walletId: string) => void;

  // Admin User Management Actions
  adminUpdateUser: (userId: string, data: Partial<UserAccount>) => void;
  adminDeleteUser: (userId: string) => void;
  adminResetPassword: (userId: string) => string;
  adminToggleSuspension: (userId: string) => void;
  adminUpdateUserBalance: (userId: string, currency: CurrencyType, amount: number) => void;

  // Admin KYC Approval Actions
  adminApproveKyc: (userId: string) => void;
  adminRejectKyc: (userId: string, reason: string) => void;
}

const computeBalances = (baseUSD: number, rates: Record<CurrencyType, number>): Record<CurrencyType, number> => ({
  USD: baseUSD,
  GBP: convertFiatToCrypto(baseUSD, 'GBP', rates),
  BTC: convertFiatToCrypto(baseUSD, 'BTC', rates),
  ETH: convertFiatToCrypto(baseUSD, 'ETH', rates),
  SOL: convertFiatToCrypto(baseUSD, 'SOL', rates),
});

const INITIAL_USERS: UserAccount[] = [
  {
    id: "USR-849204",
    name: "Misha Stark",
    email: "misha@forgecapital.com",
    role: "user",
    status: "active",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    baseBalanceUSD: 0,
    avatar: undefined,
    kycStatus: "pending",
    kycData: {
      firstName: "Misha",
      lastName: "Stark",
      dob: "1992-06-14",
      nationality: "United States",
      documentType: "passport",
      documentNumber: "P98421094",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      country: "United States",
      frontFile: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='380' viewBox='0 0 600 380'><rect width='600' height='380' rx='20' fill='%231e293b'/><rect x='40' y='40' width='120' height='150' rx='10' fill='%23334155'/><circle cx='100' cy='100' r='35' fill='%2364748b'/><rect x='190' y='50' width='350' height='24' rx='4' fill='%23f97316'/><text x='190' y='68' fill='white' font-family='sans-serif' font-weight='bold' font-size='14'>PASSPORT IDENTIFICATION CARD</text><rect x='190' y='95' width='220' height='14' rx='3' fill='%23cbd5e1'/><rect x='190' y='120' width='180' height='14' rx='3' fill='%2394a3b8'/><rect x='190' y='145' width='280' height='14' rx='3' fill='%2364748b'/><rect x='40' y='230' width='520' height='110' rx='8' fill='%230f172a'/><text x='60' y='270' fill='%2338bdf8' font-family='monospace' font-size='16'>P&lt;USAMISHA&lt;&lt;STARK&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text><text x='60' y='305' fill='%2338bdf8' font-family='monospace' font-size='16'>984210940USA9206148M3001015&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</text></svg>",
      backFile: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='380' viewBox='0 0 600 380'><rect width='600' height='380' rx='20' fill='%230f172a'/><rect x='40' y='40' width='520' height='60' rx='6' fill='%231e293b'/><text x='60' y='75' fill='%2394a3b8' font-family='sans-serif' font-size='12'>UNITED STATES DEPARTMENT OF STATE • PASSPORT SECURITY BACK</text><rect x='40' y='130' width='300' height='12' rx='3' fill='%23334155'/><rect x='40' y='155' width='350' height='12' rx='3' fill='%23334155'/><rect x='40' y='180' width='250' height='12' rx='3' fill='%23334155'/><rect x='420' y='130' width='140' height='140' rx='10' fill='%231e293b' stroke='%23334155' stroke-width='2'/><text x='445' y='205' fill='%2364748b' font-family='sans-serif' font-size='12'>EMBOSSED SEAL</text></svg>",
      selfieFile: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' rx='20' fill='%231e293b'/><circle cx='200' cy='160' r='70' fill='%23f97316'/><circle cx='200' cy='150' r='55' fill='%23fdba74'/><path d='M110 350 C110 260 290 260 290 350 Z' fill='%233b82f6'/><text x='200' y='380' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='12'>BIOMETRIC FACIAL VERIFICATION</text></svg>",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    linkedWallets: [
      {
        id: "w-sample-eth",
        currency: "ETH",
        label: "Personal Ledger Nano",
        address: "0x208ce7fA3Fd4Ce24C21AbC69ef14b87B61A6197F",
        isDefault: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "w-sample-btc",
        currency: "BTC",
        label: "Cold Storage SegWit",
        address: "bc1qgzdlns0jax6y6x9dwflcs3j8wgne0w0kxussdq",
        isDefault: true,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "w-sample-sol",
        currency: "SOL",
        label: "Phantom Main Vault",
        address: "FmBbgLgjVz95XUsD1SBWg7oZQBbYtZXnbBYfFbbNSG9B",
        isDefault: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    notifications: [],
  },
  {
    id: "USR-102941",
    name: "Alex Vance",
    email: "alex@example.com",
    role: "user",
    status: "active",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    baseBalanceUSD: 0,
    avatar: undefined,
    kycStatus: "unverified",
    linkedWallets: [],
    notifications: [],
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: INITIAL_USERS,
      currentUser: INITIAL_USERS[0],
      user: {
        name: INITIAL_USERS[0].name,
        email: INITIAL_USERS[0].email,
        avatar: undefined,
        isVerified: false,
        kycStatus: "pending",
      },
      isKycCompleted: false, // Intentional KYC friction gate: starts false to trigger withdrawal gate
      activeCurrency: 'USD',
      liveRates: DEFAULT_RATES,
      baseBalanceUSD: 0,
      cryptoBalances: computeBalances(0, DEFAULT_RATES),
      savingsPlans: [],
      transactions: [],
      notifications: [],
      toastMessage: null,
      isDepositModalOpen: false,

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

      setDepositModalOpen: (isOpen) => set({ isDepositModalOpen: isOpen }),

      setCurrency: (currency) => {
        set({ activeCurrency: currency });
      },

      createPlan: (amount, currency, duration) => {
        const state = get();
        const config = PLAN_CONFIG[duration];
        if (!config) return false;

        // Convert the staked amount in chosen currency into base USD capital
        const capitalUsd = convertCryptoToFiat(amount, currency, state.liveRates);

        // Check against unified single balance (stored in base USD)
        if (state.baseBalanceUSD < capitalUsd) {
          return false;
        }

        const projectedProfitUsd = capitalUsd * (config.ratePercent / 100);
        const totalPayoutUsd = capitalUsd + projectedProfitUsd;

        const now = new Date();
        const maturity = new Date();
        maturity.setMonth(maturity.getMonth() + duration);

        const newPlan: SavingsPlan = {
          id: "plan-" + Math.random().toString(36).substring(2, 9),
          capital: capitalUsd,
          currency,
          durationMonths: duration,
          interestRatePercent: config.ratePercent,
          projectedProfit: projectedProfitUsd,
          totalPayout: totalPayoutUsd,
          startDate: now.toISOString(),
          maturityDate: maturity.toISOString(),
          isMatured: false,
          status: 'ACTIVE',
        };

        const newTx: Transaction = {
          id: "tx-" + Math.random().toString(36).substring(2, 9),
          date: now.toISOString(),
          type: "PLAN_STAKE",
          description: `${config.label} Fixed Growth Plan (${formatCrypto(amount, currency)} @ +${config.ratePercent}%)`,
          amount: -amount,
          currency,
          status: "COMPLETED",
          userId: state.currentUser.id,
        };

        const newNotification: Notification = {
          id: "notif-" + Math.random().toString(36).substring(2, 9),
          message: `Active Plan Started: ${formatCrypto(amount, currency)} locked for ${config.label} (+${config.ratePercent}% return).`,
          timestamp: now.toISOString(),
          read: false,
        };

        const newBaseUSD = state.baseBalanceUSD - capitalUsd;
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
          savingsPlans: [newPlan, ...state.savingsPlans],
          transactions: [newTx, ...state.transactions],
          notifications: [newNotification, ...state.notifications],
          toastMessage: `Successfully activated ${config.label} Growth Plan!`,
        });

        return true;
      },

      withdrawPlan: (planId) => {
        const state = get();
        const plan = state.savingsPlans.find((p) => p.id === planId);

        if (!plan) return { success: false, error: "Plan not found." };
        if (plan.status !== 'MATURED') {
          return { success: false, error: "Plan has not matured yet." };
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

        const newTx: Transaction = {
          id: "tx-" + Math.random().toString(36).substring(2, 9),
          date: new Date().toISOString(),
          type: 'PLAN_PAYOUT',
          description: `Matured Plan Payout: ${plan.interestRatePercent}% Yield on ${plan.capital.toFixed(2)} USD Principal`,
          amount: payoutCurrencyAmount,
          currency: plan.currency,
          status: 'COMPLETED',
          userId: state.currentUser.id,
        };

        const updatedPlans = state.savingsPlans.map((p) =>
          p.id === planId ? { ...p, status: 'WITHDRAWN' as const } : p
        );

        const newBaseUSD = state.baseBalanceUSD + plan.totalPayout;
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

      submitDepositProof: (currency, amount, txHash, proofImage) => {
        const state = get();
        const now = new Date().toISOString();
        const newTx: Transaction = {
          id: "tx-" + Math.random().toString(36).substring(2, 9),
          date: now,
          type: 'DEPOSIT',
          description: `${currency} Capital Deposit (Proof Submitted)`,
          amount,
          currency,
          status: 'PENDING',
          txHash,
          proofImage,
          userId: state.currentUser.id,
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

      withdrawFunds: (currency, amount, destinationAddress) => {
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

        const newTx: Transaction = {
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toISOString(),
          type: 'WITHDRAW',
          description: `${currency} Withdrawal to ${destinationAddress ? destinationAddress.slice(0, 10) + '...' : 'External Account'}`,
          amount: -amount,
          currency,
          status: 'COMPLETED',
          destinationAddress,
          userId: state.currentUser.id,
        };

        const newBaseUSD = state.baseBalanceUSD - withdrawValueUSD;
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
      addLinkedWallet: (currency, label, address) => {
        const state = get();
        const newWallet: LinkedWallet = {
          id: "w-" + Math.random().toString(36).substring(2, 9),
          currency,
          label,
          address,
          isDefault: (state.currentUser.linkedWallets || []).filter((w) => w.currency === currency).length === 0,
          createdAt: new Date().toISOString(),
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

      removeLinkedWallet: (walletId) => {
        const state = get();
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
    }),
    {
      name: 'forge-savings-storage-v4',
    }
  )
);
