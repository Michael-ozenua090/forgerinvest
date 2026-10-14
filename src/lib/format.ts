export type CurrencyType = 'BTC' | 'ETH' | 'SOL' | 'USD' | 'GBP';

export type PlanDurationMonths = 1 | 2 | 3 | 6 | 12;

export const PLAN_CONFIG: Record<
  PlanDurationMonths,
  { months: PlanDurationMonths; label: string; ratePercent: number; multiplier: number }
> = {
  1: { months: 1, label: "1 Month", ratePercent: 100, multiplier: 2.0 },
  2: { months: 2, label: "2 Months", ratePercent: 200, multiplier: 3.0 },
  3: { months: 3, label: "3 Months", ratePercent: 300, multiplier: 4.0 },
  6: { months: 6, label: "6 Months", ratePercent: 600, multiplier: 7.0 },
  12: { months: 12, label: "12 Months", ratePercent: 1200, multiplier: 13.0 },
};

export const DEFAULT_RATES: Record<CurrencyType, number> = {
  BTC: 65000,
  ETH: 2600,
  SOL: 150,
  USD: 1,
  GBP: 0.79,
};

// Legacy alias mapping for components expecting CONVERSION_RATES
export const CONVERSION_RATES: Record<CurrencyType, number> = {
  BTC: 1 / 65000,
  ETH: 1 / 2600,
  SOL: 1 / 150,
  USD: 1,
  GBP: 0.79,
};

export const formatCrypto = (amount: number, currency: CurrencyType) => {
  const val = amount ?? 0;
  switch (currency) {
    case 'BTC':
      return `${val.toFixed(5)} BTC`;
    case 'ETH':
      return `${val.toFixed(4)} ETH`;
    case 'SOL':
      return `${val.toFixed(2)} SOL`;
    case 'USD':
      return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'GBP':
      return `£${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    default:
      return `${val.toFixed(4)} ${currency}`;
  }
};

export const formatFiat = (amount: number, prefix: string = "$") => {
  const val = amount ?? 0;
  return `${prefix}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const convertFiatToCrypto = (
  fiatAmountUsd: number,
  currency: CurrencyType,
  rates: Record<CurrencyType, number> = DEFAULT_RATES
) => {
  const val = fiatAmountUsd ?? 0;
  switch (currency) {
    case 'USD':
      return val;
    case 'GBP':
      return val * (rates.GBP || 0.79);
    case 'BTC':
      return val / (rates.BTC || 65000);
    case 'ETH':
      return val / (rates.ETH || 2600);
    case 'SOL':
      return val / (rates.SOL || 150);
    default:
      return val;
  }
};

export const convertCryptoToFiat = (
  cryptoAmount: number,
  currency: CurrencyType,
  rates: Record<CurrencyType, number> = DEFAULT_RATES
) => {
  const val = cryptoAmount ?? 0;
  switch (currency) {
    case 'USD':
      return val;
    case 'GBP':
      return val / (rates.GBP || 0.79);
    case 'BTC':
      return val * (rates.BTC || 65000);
    case 'ETH':
      return val * (rates.ETH || 2600);
    case 'SOL':
      return val * (rates.SOL || 150);
    default:
      return val;
  }
};

export const calculatePlanReturns = (
  capitalUsd: number,
  durationMonths: PlanDurationMonths
) => {
  const config = PLAN_CONFIG[durationMonths] || PLAN_CONFIG[1];
  const interestRatePercent = config.ratePercent;
  const projectedProfit = capitalUsd * (interestRatePercent / 100);
  const totalPayout = capitalUsd + projectedProfit;

  return {
    capitalUsd,
    durationMonths,
    interestRatePercent,
    projectedProfit,
    totalPayout,
  };
};
