export interface GiftCodeRedeemResult {
  code: string;
  coinAmount: number;
  coinBalance: number;
}

export interface GiftCodeHistoryItem {
  id: string;
  code: string;
  coinAmount: number;
  redeemedAt: string;
}
