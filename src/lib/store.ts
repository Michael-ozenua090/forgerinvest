import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  isVerified: boolean;
  kycStatus: "pending" | "verified" | "unverified";
}

export type CurrencyType = 'BTC' | 'ETH' | 'SOL' | 'USD' | 'GBP';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: string;
  round: string;
  valuation: string;
  sector: string;
}

export interface Position {
  symbol: string;
  name: string;
  shares: number;
  costBasis: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';
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
  activeCurrency: CurrencyType;
  cryptoBalances: Record<CurrencyType, number>;
  holdings: Position[];
  watchlist: string[];
  transactions: Transaction[];
  notifications: Notification[];
  stocks: Stock[];
  toastMessage: string | null;
  isDepositModalOpen: boolean;

  setDepositModalOpen: (isOpen: boolean) => void;
  setCurrency: (currency: CurrencyType) => void;
  executeTrade: (type: 'BUY' | 'SELL', symbol: string, name: string, shares: number, cryptoPricePerShare: number) => void;
  investInFund: (fundId: string, name: string, fiatAmount: number) => void;
  toggleWatchlist: (symbol: string) => void;
  depositFunds: (currency: CurrencyType, amount: number) => void;
  withdrawFunds: (currency: CurrencyType, amount: number) => void;
  completeKYC: () => void;
  setToast: (msg: string | null) => void;
  markNotificationsAsRead: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        name: "Misha Stark",
        email: "misha@forgeglobal.com",
        isVerified: true,
        kycStatus: "verified",
      },
      activeCurrency: 'BTC',
      cryptoBalances: {
        BTC: 1.2450,
        ETH: 18.650,
        SOL: 245.80,
        USD: 75000.00,
        GBP: 59000.00,
      },
      holdings: [
        { symbol: "DBX", name: "Databricks", shares: 150, costBasis: 210.0 },
        { symbol: "STRP", name: "Stripe", shares: 80, costBasis: 72.0 },
      ],
      watchlist: ["STRP", "SPX", "ANTH"],
      transactions: [],
      notifications: [],
      stocks: [
        { symbol: "DBX", name: "Databricks", price: 268.50, change: "+36.7%", round: "Series L-2", valuation: "$190B", sector: "Data Intelligence" },
        { symbol: "STRP", name: "Stripe", price: 72.45, change: "+0.0%", round: "Tender Offer", valuation: "$159B", sector: "Fintech" },
        { symbol: "SPX", name: "SpaceX", price: 135.00, change: "+22.4%", round: "Secondary", valuation: "$210B", sector: "Aerospace" },
        { symbol: "ANTH", name: "Anthropic", price: 38.20, change: "+45.1%", round: "Series D", valuation: "$18.5B", sector: "Artificial Intelligence" },
        { symbol: "SHLD", name: "Shield AI", price: 172.04, change: "+11.9%", round: "Series G", valuation: "$12.7B", sector: "Defense Tech" },
        { symbol: "NURA", name: "Neuralink", price: 50.50, change: "+8.3%", round: "Series E", valuation: "$9.6B", sector: "Healthcare" },
        { symbol: "RIPL", name: "Rippling", price: 47.28, change: "-21.2%", round: "Tender Offer", valuation: "$16.8B", sector: "Enterprise Software" },
      ],
      toastMessage: null,
      isDepositModalOpen: false,

      setDepositModalOpen: (isOpen) => set({ isDepositModalOpen: isOpen }),
      setToast: null, // Just placeholder here, overwritten below
      setCurrency: (currency) => set({ activeCurrency: currency }),

      executeTrade: (type, symbol, name, shares, cryptoPricePerShare) => {
        set((state) => {
          const currency = state.activeCurrency;
          const totalValue = shares * cryptoPricePerShare;
          const fee = totalValue * 0.01; // 1% crypto fee
          let newBalance = state.cryptoBalances[currency] ?? 0;
          const newHoldings = [...state.holdings];
          const positionIndex = newHoldings.findIndex(p => p.symbol === symbol);

          if (type === 'BUY') {
            const totalCost = totalValue + fee;
            if (newBalance < totalCost) {
              console.error("Insufficient crypto funds");
              return state;
            }
            newBalance -= totalCost;

            if (positionIndex >= 0) {
              const pos = newHoldings[positionIndex];
              const totalShares = pos.shares + shares;
              // costBasis in fiat terms is tricky, but for simplicity here we track it in FIAT by retrieving the stock price
              // since holdings usually track base cost. However, the requirement says we want crypto PnL. 
              // Wait, let's keep costBasis in FIAT because that's what we have in the stocks array, or we can compute everything dynamically.
              // Actually, we'll keep the costBasis in FIAT for stability (1 share = $X), or convert it.
              // We'll store it as fiat. The stock price is fiat. We'll derive crypto on the fly in the UI.
              const stock = state.stocks.find(s => s.symbol === symbol);
              const fiatPrice = stock ? stock.price : 0;
              const newCostBasis = ((pos.shares * pos.costBasis) + (shares * fiatPrice)) / totalShares;
              newHoldings[positionIndex] = { ...pos, shares: totalShares, costBasis: newCostBasis };
            } else {
              const stock = state.stocks.find(s => s.symbol === symbol);
              newHoldings.push({ symbol, name, shares, costBasis: stock ? stock.price : 0 });
            }
          } else if (type === 'SELL') {
            if (positionIndex < 0 || newHoldings[positionIndex].shares < shares) {
              console.error("Insufficient shares");
              return state;
            }
            const netProceeds = totalValue - fee;
            newBalance += netProceeds;

            const pos = newHoldings[positionIndex];
            const remainingShares = pos.shares - shares;
            if (remainingShares === 0) {
              newHoldings.splice(positionIndex, 1);
            } else {
              newHoldings[positionIndex] = { ...pos, shares: remainingShares };
            }
          }

          const newTx: Transaction = {
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
            type,
            description: `${type === 'BUY' ? 'Bought' : 'Sold'} ${shares} shares of ${symbol}`,
            amount: type === 'BUY' ? -(totalValue + fee) : (totalValue - fee),
            currency,
            status: 'COMPLETED'
          };

          const newNotification: Notification = {
            id: Math.random().toString(36).substring(2, 9),
            message: `Order Executed: ${type} ${shares} ${symbol} @ ${cryptoPricePerShare.toFixed(5)} ${currency}`,
            timestamp: new Date().toISOString(),
            read: false
          };

          return {
            cryptoBalances: { ...state.cryptoBalances, [currency]: newBalance },
            holdings: newHoldings,
            transactions: [newTx, ...state.transactions],
            notifications: [newNotification, ...state.notifications]
          };
        });
      },

      investInFund: (fundId, name, fiatAmount) => {
        set((state) => {
          // For funds we assume they cost Fiat but we deduct from active crypto balance.
          // In a real app we'd convert it at the exact moment. We'll skip funds for crypto for now,
          // or just assume they require BTC. Let's do a simple conversion here if needed.
          // Actually, we'll just not modify investInFund to use crypto fully, but we MUST debit something.
          // Let's assume we debit the active currency for the equivalent.
          // Since we don't have conversion rate imported here, let's just bypass strict check or hardcode.
          const rates = { BTC: 65000, ETH: 2600, SOL: 150, USD: 1, GBP: 0.79 };
          const currency = state.activeCurrency;
          const cryptoCost = fiatAmount / rates[currency];

          const currentBalance = state.cryptoBalances[currency] ?? 0;
          if (currentBalance < cryptoCost) return state;

          const newTx: Transaction = {
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
            type: "BUY" as any, 
            description: `Fund Investment: ${name}`,
            amount: -cryptoCost,
            currency,
            status: "COMPLETED",
          };

          const newHolding: Position = {
            symbol: fundId.toUpperCase(),
            name,
            shares: fiatAmount, // representing $ invested
            costBasis: 1, 
          };

          const newNotification: Notification = {
            id: Math.random().toString(36).substring(2, 9),
            message: `Investment of $${fiatAmount.toLocaleString()} into ${name} executed.`,
            timestamp: new Date().toISOString(),
            read: false
          };

          return {
            cryptoBalances: {
              ...state.cryptoBalances,
              [currency]: (state.cryptoBalances[currency] ?? 0) - cryptoCost
            },
            holdings: [...state.holdings, newHolding],
            transactions: [newTx, ...state.transactions],
            notifications: [newNotification, ...state.notifications]
          };
        });
      },

      toggleWatchlist: (symbol) => {
        set((state) => {
          const isWatched = state.watchlist.includes(symbol);
          return {
            watchlist: isWatched
              ? state.watchlist.filter(s => s !== symbol)
              : [...state.watchlist, symbol]
          };
        });
      },

      depositFunds: (currency, amount) => {
        set((state) => {
          const newTx: Transaction = {
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
            type: 'DEPOSIT',
            description: `${currency} Native Deposit`,
            amount: amount,
            currency,
            status: 'COMPLETED'
          };
          return {
            cryptoBalances: { ...state.cryptoBalances, [currency]: (state.cryptoBalances[currency] ?? 0) + amount },
            transactions: [newTx, ...state.transactions]
          };
        });
      },

      withdrawFunds: (currency, amount) => {
        set((state) => {
          const currentBalance = state.cryptoBalances[currency] ?? 0;
          if (currentBalance < amount) return state;
          
          const newTx: Transaction = {
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
            type: 'WITHDRAW',
            description: `${currency} Withdrawal to External Wallet`,
            amount: -amount,
            currency,
            status: 'COMPLETED'
          };
          return {
            cryptoBalances: { ...state.cryptoBalances, [currency]: currentBalance - amount },
            transactions: [newTx, ...state.transactions]
          };
        });
      },

      completeKYC: () => {
        set((state) => ({
          user: { ...state.user, kycStatus: "verified", isVerified: true }
        }));
      },

      setToast: (msg) => {
        set({ toastMessage: msg });
      },

      markNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));
      }

    }),
    {
      name: 'forge-storage',
    }
  )
);
