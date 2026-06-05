export const PLAN_LIMITS = {
  trial: { seats: 5, aiMonthly: 500 },
  starter: { seats: 10, aiMonthly: 2000 },
  growth: { seats: 25, aiMonthly: 10000 },
  enterprise: { seats: 100, aiMonthly: 50000 },
} as const;
