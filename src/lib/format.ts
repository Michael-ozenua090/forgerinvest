export type CurrencyType = 'BTC' | 'ETH' | 'SOL' | 'USD' | 'GBP';

export const CONVERSION_RATES: Record<CurrencyType, number> = {
  BTC: 65000,
  ETH: 2600,
  SOL: 150,
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
      return `$${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    case 'GBP':
      return `£${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    default:
      return `${val.toFixed(4)} ${currency}`;
  }
};

export const formatFiat = (amount: number) => {
  const val = amount ?? 0;
  return `$${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
};

export const convertFiatToCrypto = (fiatAmount: number, currency: CurrencyType) => {
  const val = fiatAmount ?? 0;
  const rate = CONVERSION_RATES[currency] || 1;
  return val / rate;
};

export const convertCryptoToFiat = (cryptoAmount: number, currency: CurrencyType) => {
  const val = cryptoAmount ?? 0;
  const rate = CONVERSION_RATES[currency] || 1;
  return val * rate;
};
