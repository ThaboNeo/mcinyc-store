/**
 * Single source of truth for products with multi-currency support.
 * Imported by the storefront (client) AND by /api/checkout (server).
 * The server NEVER trusts prices sent from the client — it looks them up here.
 *
 * Prices stored in ZAR (South African Rand) as primary currency.
 * USD prices are calculated server-side at checkout for international orders.
 */

export type Colorway = {
  label: string;
  shirt: string;
  text: string;
  sub: string;
};

export type Product = {
  id: string;
  name: string;
  priceZAR: number; // ZAR, whole rand
  tag: string;
  sizes: string[];
  description: string;
  details: string[];
  colorways: Colorway[];
};

const TERRACOTTA = "#C85B2A";
const GOLD = "#E8C547";
const CREAM = "#F0EAD6";
const DARK = "#0F0E0B";

export const PRODUCTS: Product[] = [
  {
    id: "ancestor-tee",
    name: "The Ancestor Tee",
    priceZAR: 890, // ~$48 USD
    tag: "HERITAGE DROP",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    description: "Heavyweight 100% organic cotton. Screen-printed with archival inks. Wear your roots, not theirs.",
    details: ["340gsm organic ring-spun cotton", "Unisex relaxed fit", "Pre-washed, pre-shrunk", "Screen-printed in the USA"],
    colorways: [
      { label: "Midnight", shirt: "#1A1614", text: GOLD, sub: TERRACOTTA },
      { label: "Terracotta", shirt: TERRACOTTA, text: CREAM, sub: DARK },
      { label: "Forest", shirt: "#2D5016", text: "#D4E8C2", sub: GOLD },
    ],
  },
  {
    id: "sovereignty-crew",
    name: "The Sovereignty Crewneck",
    priceZAR: 1630, // ~$88 USD
    tag: "CORE COLLECTION",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    description: "French terry crewneck. Relaxed fit. Sovereignty looks good on everyone.",
    details: ["380gsm French terry", "Ribbed cuffs & hem", "Embroidered back neck label", "Ethically made"],
    colorways: [
      { label: "Indigo", shirt: "#1A1A2E", text: "#AED9DA", sub: GOLD },
      { label: "Bone", shirt: CREAM, text: DARK, sub: TERRACOTTA },
      { label: "Midnight", shirt: "#1A1614", text: GOLD, sub: TERRACOTTA },
    ],
  },
  {
    id: "reclaim-jacket",
    name: "The Reclaim Jacket",
    priceZAR: 3050, // ~$165 USD
    tag: "STATEMENT WEAR",
    sizes: ["S", "M", "L", "XL", "2XL"],
    description: "Oversized utility silhouette with embroidered chest and back. Unapologetic.",
    details: ["100% organic twill", "YKK zippers", "Hand-embroidered chest patch", "Drop shoulder fit"],
    colorways: [
      { label: "Olive", shirt: "#4A5240", text: GOLD, sub: TERRACOTTA },
      { label: "Midnight", shirt: "#1A1614", text: GOLD, sub: TERRACOTTA },
      { label: "Rust", shirt: "#8B3A18", text: CREAM, sub: GOLD },
    ],
  },
  {
    id: "diaspora-hoodie",
    name: "Diaspora Hoodie",
    priceZAR: 1815, // ~$98 USD
    tag: "COLLECTOR'S PIECE",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    description: "For everywhere the wind has scattered us. Heavyweight pullover with hand-illustrated hem embroidery.",
    details: ["420gsm fleece", "Kangaroo pocket", "Adjustable drawstring", "Embroidered hem band"],
    colorways: [
      { label: "Forest", shirt: "#2D5016", text: "#D4E8C2", sub: GOLD },
      { label: "Midnight", shirt: "#1A1614", text: GOLD, sub: TERRACOTTA },
      { label: "Plum", shirt: "#4A1942", text: "#F2D4EC", sub: GOLD },
    ],
  },
  {
    id: "not-for-you-tote",
    name: "Not For You Tote",
    priceZAR: 650, // ~$35 USD
    tag: "CARRY IT",
    sizes: ["One Size"],
    description: "Heavy canvas. The bag that says exactly what you mean.",
    details: ["14oz natural canvas", "Reinforced handles", "Interior zip pocket", "Screen printed both sides"],
    colorways: [
      { label: "Natural", shirt: "#E8E0CC", text: DARK, sub: TERRACOTTA },
      { label: "Black", shirt: "#1A1614", text: CREAM, sub: GOLD },
      { label: "Terracotta", shirt: TERRACOTTA, text: CREAM, sub: DARK },
    ],
  },
  {
    id: "bucket-hat",
    name: "Diaspora Bucket Hat",
    priceZAR: 775, // ~$42 USD
    tag: "ACCESSORIES",
    sizes: ["S/M", "L/XL"],
    description: "Wherever the wind scattered us, we arrive with intention.",
    details: ["100% organic canvas", "Embroidered panel", "Packable brim", "Adjustable cord"],
    colorways: [
      { label: "Midnight", shirt: "#1A1614", text: GOLD, sub: TERRACOTTA },
      { label: "Forest", shirt: "#2D5016", text: "#D4E8C2", sub: GOLD },
      { label: "Bone", shirt: CREAM, text: DARK, sub: TERRACOTTA },
    ],
  },
];

/**
 * Find a product by ID
 */
export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/**
 * Get product price in a specific currency
 * @param product - Product object
 * @param currency - Target currency ("ZAR" or "USD")
 * @returns Price in whole units of the target currency
 */
export function getProductPrice(product: Product, currency: "ZAR" | "USD"): number {
  if (currency === "ZAR") {
    return product.priceZAR;
  }
  // Convert ZAR to USD
  const exchangeRate = parseFloat(process.env.NEXT_PUBLIC_ZAR_USD_RATE ?? "18.5");
  return Math.round(product.priceZAR / exchangeRate);
}
