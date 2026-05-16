// Region-tiered shipping. Customer picks region in the cart drawer BEFORE
// checkout — this means the Stripe Checkout Session is created with exactly
// one shipping rate already attached, and the address collection is
// restricted to that region's countries. No ambiguity about which rate
// applies, no risk of someone in the US picking the "South Africa" tier.

export type ShippingRegion = {
  id: string;
  name: string;
  amount: number; // USD cents
  countries: string[]; // ISO 3166-1 alpha-2
  estimateDays: { min: number; max: number };
};

export const SHIPPING_REGIONS: ShippingRegion[] = [
  {
    id: "za",
    name: "South Africa",
    amount: 500, // $5
    countries: ["ZA"],
    estimateDays: { min: 3, max: 7 },
  },
  {
    id: "africa",
    name: "Rest of Africa",
    amount: 2000, // $20
    countries: [
      "BW", "NA", "ZW", "MZ", "LS", "SZ", "KE", "TZ", "UG", "NG",
      "GH", "ET", "RW", "ZM", "MW", "AO", "MA", "EG", "TN", "DZ",
      "SN", "CI", "CM", "MU",
    ],
    estimateDays: { min: 7, max: 14 },
  },
  {
    id: "na-eu",
    name: "USA, Canada, UK & EU",
    amount: 2500, // $25
    countries: [
      "US", "CA", "GB", "IE", "DE", "FR", "NL", "BE", "ES", "IT",
      "PT", "SE", "NO", "DK", "FI", "AT", "CH", "PL", "CZ", "GR",
      "HU", "LU", "RO", "BG", "HR", "SI", "SK", "EE", "LV", "LT",
    ],
    estimateDays: { min: 7, max: 14 },
  },
  {
    id: "row",
    name: "Rest of World",
    amount: 3500, // $35
    countries: [
      "AU", "NZ", "JP", "SG", "AE", "SA", "BR", "AR", "CL", "CO",
      "MX", "IN", "ID", "MY", "PH", "TH", "VN", "KR", "TR", "IL",
      "JM", "TT", "BB", "BS", "HK", "TW",
    ],
    estimateDays: { min: 10, max: 21 },
  },
];

export function findRegion(id: string): ShippingRegion | undefined {
  return SHIPPING_REGIONS.find((r) => r.id === id);
}
