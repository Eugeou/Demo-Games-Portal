export const PLANS = {
  FREE: "free",
  BASIC: "basic",
  PREMIUM: "premium",
} as const;

export type PlanId = (typeof PLANS)[keyof typeof PLANS];
