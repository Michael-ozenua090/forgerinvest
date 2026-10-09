/**
 * Centralized Route Registry for the Forge Platform
 */

export const ROUTES = {
  marketing: {
    home: "/",
    marketplace: "/stocks",
    funds: "/funds",
    about: "/about",
    contact: "/contact",
    helpCenter: "/help-center",
    legal: {
      terms: "/terms",
      privacy: "/privacy",
    }
  },
  auth: {
    login: "/login",
    register: "/register",
    verifyEmail: "/verify-email",
    kyc: "/kyc",
  },
  app: {
    dashboard: "/dashboard",
    stocks: {
      directory: "/stocks",
      detail: (symbol: string) => `/stocks/${symbol}`,
      watchlist: "/stocks/watchlist",
      portfolio: "/stocks/portfolio",
      transactions: "/stocks/transactions",
    },
    funds: {
      directory: "/funds",
      detail: (id: string) => `/funds/${id}`,
    },
    wallet: {
      home: "/wallet",
      withdraw: "/wallet/withdraw",
      transactions: "/wallet/transactions",
    },
    portfolio: {
      home: "/portfolio",
      analytics: "/portfolio/analytics",
    },
    settings: "/settings",
    support: "/support",
  }
} as const;
