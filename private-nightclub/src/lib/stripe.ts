import Stripe from "stripe";

/**
 * Server-side Stripe client. Returns null when no key is configured so the
 * checkout route degrades gracefully (the site still works without payments).
 * Set STRIPE_SECRET_KEY in .env.local + Vercel to enable.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

/** VIP table reservation deposit, in cents. Default $100. Override with env. */
export const DEPOSIT_CENTS = Number(process.env.STRIPE_DEPOSIT_CENTS ?? "10000");
