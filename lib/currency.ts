// Multi-currency support. South Africa (ZAR) is the primary market,
// with international options supporting major currencies via Stripe.

export type Currency = "ZAR" | "USD" | "GBP" | "EUR";

export type CurrencyConfig = {
  code: Currency;
  symbol: string;
  name: string;
  stripeCode: string; // Lowercase for Stripe API
  decimalPlaces: number;
};

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  ZAR: {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    stripeCode: "zar",
    decimalPlaces: 2,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    stripeCode: "usd",
    decimalPlaces: 2,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    stripeCode: "gbp",
    decimalPlaces: 2,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    stripeCode: "eur",
    decimalPlaces: 2,
  },
};

/**
 * Stripe amounts are always in the smallest currency unit (cents/pence).
 * For ZAR, that's 1 rand = 100 cents (same as USD).
 * For GBP, that's 1 pound = 100 pence.
 * For EUR, that's 1 euro = 100 cents.
 */
export function toStripeAmount(displayValue: number, currency: Currency): number {
  const config = CURRENCIES[currency];
  return Math.round(displayValue * Math.pow(10, config.decimalPlaces));
}

export function fromStripeAmount(stripeAmount: number, currency: Currency): number {
  const config = CURRENCIES[currency];
  return stripeAmount / Math.pow(10, config.decimalPlaces);
}

export function formatCurrency(amount: number, currency: Currency): string {
  const config = CURRENCIES[currency];
  return `${config.symbol}${amount.toFixed(config.decimalPlaces)}`;
}
