import Stripe from "stripe";

// Lazy singleton — defers initialization to the first request so that
// `next build` can import this module without a STRIPE_SECRET_KEY present.
let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set. Add it to .env.local");
  }
  // apiVersion pinned to installed stripe-node 22.1.1.
  // To update: node -e "const s=require('stripe'); console.log(s.API_VERSION)"
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });
  return _stripe;
}
