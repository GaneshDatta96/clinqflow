export const PLAN_LIMITS = {
  incomplete: { seats: 0, aiMonthly: 0 },
  trial: { seats: 5, aiMonthly: 500 },
  starter: { seats: 10, aiMonthly: 2000 },
  growth: { seats: 25, aiMonthly: 10000 },
  enterprise: { seats: 100, aiMonthly: 50000 },
} as const;

export function isActiveSubscriptionStatus(status: string) {
  return status === "active";
}
