import { DAILY_CLAIM_STORAGE_KEY } from "@/domain/constants";
import ClientStorageService from "@/domain/services/client-storage";
import {
  USER_STORAGE_KEY,
  type DailyCheckinConfig,
  type DailyCheckinHistoryItem,
  type DailyCheckinResult,
  type DailyCheckinReward,
  type DailyCheckinStatus,
  type UserInfo,
} from "@/domain/types";
import type { IDailyClaimService } from "./daily-claim.interface";

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

type StoredCheckin = {
  lastClaimDate: string;
  lastClaimDay: number;
  claimedDays: number[];
  history: DailyCheckinHistoryItem[];
};

type StatusStore = Record<string, StoredCheckin>;

const CONFIG: DailyCheckinConfig = {
  cycleDays: 7,
  rewards: [
    { day: 1, coinAmount: 10 },
    { day: 2, coinAmount: 15 },
    { day: 3, coinAmount: 20 },
    { day: 4, coinAmount: 25 },
    { day: 5, coinAmount: 30 },
    { day: 6, coinAmount: 40 },
    { day: 7, coinAmount: 70 },
  ],
};

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}

function yesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toLocaleDateString("en-CA");
}

function nextResetAt() {
  const next = new Date();
  next.setHours(24, 0, 0, 0);
  return next.toISOString();
}

function emptyStatus(): DailyCheckinStatus {
  return {
    currentDay: 1,
    claimedToday: false,
    claimedDays: [],
    resetAt: nextResetAt(),
  };
}

function readStore(): StatusStore {
  return ClientStorageService.getItem<StatusStore>(DAILY_CLAIM_STORAGE_KEY) ?? {};
}

function writeStore(store: StatusStore) {
  ClientStorageService.setItem(DAILY_CLAIM_STORAGE_KEY, store);
}

function readHistory(userId: string): DailyCheckinHistoryItem[] {
  if (!userId) {
    return [];
  }
  const stored = readStore()[userId];
  if (!stored) {
    return [];
  }
  if (stored.history?.length) {
    return [...stored.history].sort(
      (a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime()
    );
  }
  if (stored.lastClaimDate) {
    return [
      {
        id: `${userId}-${stored.lastClaimDate}`,
        day: stored.lastClaimDay,
        coinAmount: rewardFor(stored.lastClaimDay).coinAmount,
        claimedAt: `${stored.lastClaimDate}T08:00:00.000Z`,
      },
    ];
  }
  return [];
}

function readStatus(userId: string): DailyCheckinStatus {
  if (!userId) {
    return emptyStatus();
  }
  const stored = readStore()[userId];
  if (!stored) {
    return emptyStatus();
  }
  const today = todayKey();
  if (stored.lastClaimDate === today) {
    return {
      currentDay: stored.lastClaimDay,
      claimedToday: true,
      claimedDays: stored.claimedDays,
      resetAt: nextResetAt(),
    };
  }
  if (stored.lastClaimDate === yesterdayKey()) {
    if (stored.lastClaimDay >= CONFIG.cycleDays) {
      return emptyStatus();
    }
    return {
      currentDay: stored.lastClaimDay + 1,
      claimedToday: false,
      claimedDays: stored.claimedDays,
      resetAt: nextResetAt(),
    };
  }
  return emptyStatus();
}

function rewardFor(day: number): DailyCheckinReward {
  return (
    CONFIG.rewards.find((reward) => reward.day === day) ?? CONFIG.rewards[0]
  );
}

function creditUser(coinAmount: number): number {
  const user = ClientStorageService.getItem<UserInfo>(USER_STORAGE_KEY);
  if (!user?.id) {
    return 0;
  }
  const coinBalance = (user.coinBalance ?? 0) + coinAmount;
  ClientStorageService.setItem(USER_STORAGE_KEY, { ...user, coinBalance });
  return coinBalance;
}

export const createDailyClaimMock = (): IDailyClaimService => ({
  getConfig: async () => {
    await delay(140);
    return CONFIG;
  },
  getStatus: async (userId) => {
    await delay(140);
    return readStatus(userId);
  },
  listHistory: async (userId) => {
    await delay(160);
    return readHistory(userId);
  },
  claim: async (userId) => {
    await delay(280);
    if (!userId) {
      throw new Error("LOGIN_REQUIRED");
    }
    const status = readStatus(userId);
    if (status.claimedToday) {
      throw new Error("ALREADY_CLAIMED");
    }
    const reward = rewardFor(status.currentDay);
    const claimedDays = [...new Set([...status.claimedDays, reward.day])].sort(
      (a, b) => a - b
    );
    const store = readStore();
    const historyItem: DailyCheckinHistoryItem = {
      id: `${userId}-${todayKey()}-${reward.day}`,
      day: reward.day,
      coinAmount: reward.coinAmount,
      claimedAt: new Date().toISOString(),
    };
    const history = [historyItem, ...readHistory(userId)];
    writeStore({
      ...store,
      [userId]: {
        lastClaimDate: todayKey(),
        lastClaimDay: reward.day,
        claimedDays,
        history,
      },
    });
    const result: DailyCheckinResult = {
      day: reward.day,
      coinAmount: reward.coinAmount,
      coinBalance: creditUser(reward.coinAmount),
      currentDay: reward.day,
      claimedToday: true,
      claimedDays,
    };
    return result;
  },
});
