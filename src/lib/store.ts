import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  CurrencyType, 
  PlanDurationMonths, 
  PLAN_CONFIG, 
  DEFAULT_RATES, 
  convertCryptoToFiat,
  convertFiatToCrypto 
} from './format';

export type { CurrencyType, PlanDurationMonths };

export interface User {
  name: string;
  email: string;
  isVerified: boolean;
  kycStatus: "pending" | "verified" | "unverified";
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
  status: 'COMPLETED' | 'PENDING';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

export interface AppState {
  user: User;
  isKycCompleted: boolean;
  activeCurrency: CurrencyType;
  liveRates: Record<CurrencyType, number>;
  cryptoBalances: Record<CurrencyType, number>;
  savingsPlans: SavingsPlan[];
  transactions: Transaction[];
  notifications: Notification[];
  toastMessage: string | null;
  isDepositModalOpen: boolean;

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
  withdrawFunds: (
    currency: CurrencyType,
    amount: number
  ) => { success: boolean; requiresKyc?: boolean; error?: string };
  completeKYC: (data?: any) => void;
  setToast: (msg: string | null) => void;
  markNotificationsAsRead: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        name: "Misha Stark",
        email: "misha@forgecapital.com",
        isVerified: false,
        kycStatus: "unverified",
      },
      isKycCompleted: false, // Intentional KYC friction gate: starts false to trigger the withdrawal gate
      activeCurrency: 'USD',
      liveRates: DEFAULT_RATES,
      cryptoBalances: {
        BTC: 0.850,
        ETH: 8.500,
        SOL: 120.00,
        USD: 15000.00,
        GBP: 12000.00,
      },
      savingsPlans: [
        {
          id: "plan-sample-active",
          capital: 500,
          currency: "USD",
          durationMonths: 3,
          interestRatePercent: 27,
          projectedProfit: 135,
          totalPayout: 635,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          maturityDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          isMatured: false,
          status: 'ACTIVE',
        },
        {
          id: "plan-sample-matured",
          capital: 250,
          currency: "USD",
          durationMonths: 1,
          interestRatePercent: 6,
          projectedProfit: 15,
          totalPayout: 265,
          startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          maturityDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          isMatured: true,
          status: 'MATURED',
        },
      ],
      transactions: [
        {
          id: "tx-init-1",
          date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          type: "PLAN_STAKE",
          description: "1-Month Fixed Growth Plan ($250.00 USD @ +6%)",
          amount: -250,
          currency: "USD",
          status: "COMPLETED",
        },
        {
          id: "tx-init-2",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          type: "PLAN_STAKE",
          description: "3-Month Compounding Growth Plan ($500.00 USD @ +27%)",
          amount: -500,
          currency: "USD",
          status: "COMPLETED",
        },
      ],
      notifications: [
        {
          id: "notif-1",
          message: "Plan matured: Your 1-Month Plan ($250) has finished with +6% profit ($265.00 total payout ready).",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
      ],
      toastMessage: null,
      isDepositModalOpen: false,

      fetchRates: async () => {
        try {
          const res = await fetch("/api/rates");
          if (res.ok) {
            const data = await res.json();
            if (data?.rates) {
              set({ liveRates: data.rates });
            }
          }
        } catch {
          // Gracefully fallback to static rates
        }
      },

      setDepositModalOpen: (isOpen) => set({ isDepositModalOpen: isOpen }),
      setCurrency: (currency) => set({ activeCurrency: currency }),

      createPlan: (amount, currency, duration) => {
        const state = get();
        const currentBalance = state.cryptoBalances[currency] ?? 0;

        // Check wallet balance
        if (currentBalance < amount) {
          set({ toastMessage: "Insufficient balance in selected currency." });
          return false;
        }

        // Convert amount to USD base for uniform tracking
        const capitalUsd = convertCryptoToFiat(amount, currency, state.liveRates);
        if (capitalUsd < 50) {
          set({ toastMessage: "Minimum capital requirement is $50.00 USD." });
          return false;
        }

        const config = PLAN_CONFIG[duration] || PLAN_CONFIG[1];
        const profitUsd = capitalUsd * (config.ratePercent / 100);
        const payoutUsd = capitalUsd + profitUsd;

        const now = new Date();
        const maturity = new Date();
        maturity.setMonth(maturity.getMonth() + duration);

        const newPlan: SavingsPlan = {
          id: "plan-" + Math.random().toString(36).substring(2, 9),
          capital: capitalUsd,
          currency,
          durationMonths: duration,
          interestRatePercent: config.ratePercent,
          projectedProfit: profitUsd,
          totalPayout: payoutUsd,
          startDate: now.toISOString(),
          maturityDate: maturity.toISOString(),
          isMatured: false,
          status: 'ACTIVE',
        };

        const newTx: Transaction = {
          id: "tx-" + Math.random().toString(36).substring(2, 9),
          date: now.toISOString(),
          type: "PLAN_STAKE",
          description: `${config.label} Fixed Growth Plan (${amount.toFixed(2)} ${currency} @ +${config.ratePercent}%)`,
          amount: -amount,
          currency,
          status: "COMPLETED",
        };

        const newNotification: Notification = {
          id: "notif-" + Math.random().toString(36).substring(2, 9),
          message: `Active Plan Started: ${amount.toFixed(2)} ${currency} locked for ${config.label} (+${config.ratePercent}% return).`,
          timestamp: now.toISOString(),
          read: false,
        };

        set({
          cryptoBalances: {
            ...state.cryptoBalances,
            [currency]: currentBalance - amount,
          },
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

        const now = new Date();
        const newTx: Transaction = {
          id: "tx-" + Math.random().toString(36).substring(2, 9),
          date: now.toISOString(),
          type: "PLAN_PAYOUT",
          description: `Matured Payout: ${plan.durationMonths}-Month Plan (+${plan.interestRatePercent}% Profit Disbursed)`,
          amount: payoutCurrencyAmount,
          currency: plan.currency,
          status: "COMPLETED",
        };

        const updatedPlans = state.savingsPlans.map((p) =>
          p.id === planId ? { ...p, status: 'WITHDRAWN' as const } : p
        );

        set({
          cryptoBalances: {
            ...state.cryptoBalances,
            [plan.currency]: (state.cryptoBalances[plan.currency] ?? 0) + payoutCurrencyAmount,
          },
          savingsPlans: updatedPlans,
          transactions: [newTx, ...state.transactions],
          toastMessage: `Successfully claimed ${payoutCurrencyAmount.toFixed(2)} ${plan.currency} payout!`,
        });

        return { success: true };
      },

      depositFunds: (currency, amount) => {
        set((state) => {
          const newTx: Transaction = {
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
            type: 'DEPOSIT',
            description: `${currency} Capital Deposit`,
            amount: amount,
            currency,
            status: 'COMPLETED',
          };
          return {
            cryptoBalances: {
              ...state.cryptoBalances,
              [currency]: (state.cryptoBalances[currency] ?? 0) + amount,
            },
            transactions: [newTx, ...state.transactions],
          };
        });
      },

      withdrawFunds: (currency, amount) => {
        const state = get();

        // INTENTIONAL KYC WITHDRAWAL GATE
        if (!state.isKycCompleted) {
          return {
            success: false,
            requiresKyc: true,
            error: "Identity Verification Required: Before withdrawing your capital and interest profits, regulatory compliance requires you to complete KYC verification.",
          };
        }

        const currentBalance = state.cryptoBalances[currency] ?? 0;
        if (currentBalance < amount) {
          return { success: false, error: "Insufficient balance for withdrawal." };
        }

        const newTx: Transaction = {
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toISOString(),
          type: 'WITHDRAW',
          description: `${currency} Withdrawal to External Account`,
          amount: -amount,
          currency,
          status: 'COMPLETED',
        };

        set({
          cryptoBalances: {
            ...state.cryptoBalances,
            [currency]: currentBalance - amount,
          },
          transactions: [newTx, ...state.transactions],
          toastMessage: `Withdrawal of ${amount.toFixed(2)} ${currency} submitted!`,
        });

        return { success: true };
      },

      completeKYC: () => {
        set((state) => ({
          isKycCompleted: true,
          user: { ...state.user, kycStatus: "verified", isVerified: true },
          toastMessage: "Identity verified successfully. You may now withdraw funds.",
        }));
      },

      setToast: (msg) => {
        set({ toastMessage: msg });
      },

      markNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
    }),
    {
      name: 'forge-savings-storage',
    }
  )
);
