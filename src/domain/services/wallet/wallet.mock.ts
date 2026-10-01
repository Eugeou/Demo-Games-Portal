import { DAILY_CLAIM_COIN } from "@/domain/constants";
import type { WalletInfo } from "@/domain/types";
import type { IWalletService } from "./wallet.interface";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

let wallet: WalletInfo = {
  coinBalance: 120,
  lastDailyClaimAt: null,
  missedClaimDays: 0,
  canClaimDaily: true,
};

export const createWalletMock = (): IWalletService => ({
  getBalance: async () => {
    await delay();
    return wallet;
  },
  claimDaily: async () => {
    await delay();
    const claimed = DAILY_CLAIM_COIN * (wallet.missedClaimDays + 1);
    wallet = {
      coinBalance: wallet.coinBalance + claimed,
      lastDailyClaimAt: new Date().toISOString(),
      missedClaimDays: 0,
      canClaimDaily: false,
    };
    return {
      claimed,
      balance: wallet.coinBalance,
      claimedAt: wallet.lastDailyClaimAt!,
    };
  },
});
