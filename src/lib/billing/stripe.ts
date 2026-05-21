import Stripe from "stripe";
import { env } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!env.stripeSecretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey);
  }

  return stripeClient;
}

export const PLAN_LIMITS = {
  trial: { seats: 5, aiMonthly: 500 },
  starter: { seats: 10, aiMonthly: 2000 },
  growth: { seats: 25, aiMonthly: 10000 },
  enterprise: { seats: 100, aiMonthly: 50000 },
} as const;
