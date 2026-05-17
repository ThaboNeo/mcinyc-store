// Currency configuration for multi-region support
// South Africa is the primary market (ZAR), with USD for international

export type CurrencyCode = "ZAR" | "USD";

export type Currency = {
  code: CurrencyCode;
  name: string;
  symbol: string;
  stripeCode: string; // lowercase for Stripe
  decimals: number;
};

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  ZAR: {
    code: "ZAR",
    name: "South African Rand",
    symbol: "R",
    stripeCode: "zar",
    decimals: 2,
  },
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    stripeCode: "usd",
    decimals: 2,
  },
};

// Live exchange rate (ideally fetch from an API, but for MVP we'll use approximate)
// In production, use Open Exchange Rates or similar
export const EXCHANGE_RATES: Record<CurrencyCode, Record<CurrencyCode, number>> = {
  ZAR: { ZAR: 1, USD: 0.053 }, // 1 ZAR ≈ $0.053 USD
  USD: { USD: 1, ZAR: 18.87 }, // 1 USD ≈ R18.87 ZAR
};

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;
  const rate = EXCHANGE_RATES[from]?.[to];
  if (!rate) throw new Error(`No exchange rate for ${from} to ${to}`);
  return Math.round(amount * rate * 100) / 100; // Round to 2 decimals
}

export function formatPrice(amount: number, currency: CurrencyCode): string {
  const curr = CURRENCIES[currency];
  return `${curr.symbol}${amount.toLocaleString("en-ZA", {
    minimumFractionDigits: curr.decimals,
    maximumFractionDigits: curr.decimals,
  })}`;
}
