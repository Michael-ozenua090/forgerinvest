/**
 * Centralized Route Registry for the Forge High-Growth Savings Platform
 */

export const ROUTES = {
  admin: "/admin",
  marketing: {
    home: "/",
    marketplace: "/plans", // Redirects marketing directory to plans
    plans: "/plans",
    forgePrice: "/forge-price",
    privateIndices: "/private-indices",
    about: "/about",
    careers: "/careers",
    press: "/press",
    insights: "/insights",
    helpCenter: "/help-center",
    contact: "/contact",
    legal: {
      terms: "/terms",
      privacy: "/privacy",
      formCrs: "/form-crs",
    },
  },
  auth: {
    login: "/login",
    register: "/register",
    verifyEmail: "/verify-email",
    kyc: "/kyc",
  },
  app: {
    dashboard: "/dashboard",
    plans: "/plans",
    portfolio: "/portfolio",
    wallet: {
      home: "/wallet",
      withdraw: "/wallet/withdraw",
      transactions: "/wallet/transactions",
    },
    settings: "/settings",
    support: "/support",
    kyc: "/kyc",
  },
} as const;
