export interface DailyCheckinReward {
  day: number;
  coinAmount: number;
}

export interface DailyCheckinConfig {
  cycleDays: number;
  rewards: DailyCheckinReward[];
}

export interface DailyCheckinStatus {
  currentDay: number;
  claimedToday: boolean;
  claimedDays: number[];
  resetAt: string;
}

export interface DailyCheckinResult {
  day: number;
  coinAmount: number;
  coinBalance: number;
  currentDay: number;
  claimedToday: boolean;
  claimedDays: number[];
}

export interface DailyCheckinHistoryItem {
  id: string;
  day: number;
  coinAmount: number;
  claimedAt: string;
}
