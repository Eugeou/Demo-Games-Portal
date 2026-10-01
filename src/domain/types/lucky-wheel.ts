export interface LuckyWheelPrize {
  id: string;
  label: string;
  coinAmount: number;
  backgroundColor: string;
  textColor: string;
}

export interface LuckyWheelConfig {
  dailySpins: number;
  prizes: LuckyWheelPrize[];
}

export interface LuckyWheelStatus {
  remainingSpins: number;
  resetAt: string;
}

export interface LuckyWheelResult {
  prizeId: string;
  label: string;
  coinAmount: number;
  remainingSpins: number;
  coinBalance: number;
}
