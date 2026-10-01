export interface WalletInfo {
  coinBalance: number;
  lastDailyClaimAt: string | null;
  missedClaimDays: number;
  canClaimDaily: boolean;
}

export interface DailyClaimResult {
  claimed: number;
  balance: number;
  claimedAt: string;
}
