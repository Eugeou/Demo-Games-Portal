import { LUCKY_WHEEL_STORAGE_KEY } from "@/domain/constants";
import ClientStorageService from "@/domain/services/client-storage";
import { USER_STORAGE_KEY, type LuckyWheelConfig, type LuckyWheelPrize, type LuckyWheelResult, type LuckyWheelStatus, type UserInfo } from "@/domain/types";
import type { ILuckyWheelService } from "./lucky-wheel.interface";

const delay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));

type Slice = LuckyWheelPrize & { weight: number };

type StatusStore = Record<
  string,
  {
    date: string;
    remainingSpins: number;
    resetAt: string;
  }
>;

const SLICES: Slice[] = [
  {
    id: "coin-5",
    label: "5 coin",
    coinAmount: 5,
    backgroundColor: "#16324F",
    textColor: "#FFFFFF",
    weight: 24,
  },
  {
    id: "coin-10",
    label: "10 coin",
    coinAmount: 10,
    backgroundColor: "#0095FF",
    textColor: "#FFFFFF",
    weight: 22,
  },
  {
    id: "coin-20",
    label: "20 coin",
    coinAmount: 20,
    backgroundColor: "#FFB703",
    textColor: "#1A1A1A",
    weight: 18,
  },
  {
    id: "coin-50",
    label: "50 coin",
    coinAmount: 50,
    backgroundColor: "#FB8500",
    textColor: "#FFFFFF",
    weight: 14,
  },
  {
    id: "coin-100",
    label: "100 coin",
    coinAmount: 100,
    backgroundColor: "#06D6A0",
    textColor: "#073B4C",
    weight: 12,
  },
  {
    id: "coin-200",
    label: "200 coin",
    coinAmount: 200,
    backgroundColor: "#EF476F",
    textColor: "#FFFFFF",
    weight: 10,
  },
];

const CONFIG: LuckyWheelConfig = {
  dailySpins: 3,
  prizes: SLICES.map(({ weight: _weight, ...prize }) => prize),
};

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}

function nextResetAt() {
  const next = new Date();
  next.setHours(24, 0, 0, 0);
  return next.toISOString();
}

function readStore(): StatusStore {
  return ClientStorageService.getItem<StatusStore>(LUCKY_WHEEL_STORAGE_KEY) ?? {};
}

function writeStore(store: StatusStore) {
  ClientStorageService.setItem(LUCKY_WHEEL_STORAGE_KEY, store);
}

function readStatus(userId: string): LuckyWheelStatus {
  const store = readStore();
  const current = store[userId];
  const date = todayKey();
  if (!current || current.date !== date) {
    const next = {
      date,
      remainingSpins: CONFIG.dailySpins,
      resetAt: nextResetAt(),
    };
    writeStore({ ...store, [userId]: next });
    return { remainingSpins: next.remainingSpins, resetAt: next.resetAt };
  }
  return { remainingSpins: current.remainingSpins, resetAt: current.resetAt };
}

function writeRemaining(userId: string, remainingSpins: number) {
  const store = readStore();
  writeStore({
    ...store,
    [userId]: {
      date: todayKey(),
      remainingSpins,
      resetAt: store[userId]?.resetAt ?? nextResetAt(),
    },
  });
}

function pickPrize(): LuckyWheelPrize {
  const total = SLICES.reduce((sum, slice) => sum + slice.weight, 0);
  let roll = Math.random() * total;
  for (const slice of SLICES) {
    roll -= slice.weight;
    if (roll <= 0) {
      const { weight: _weight, ...prize } = slice;
      return prize;
    }
  }
  const { weight: _weight, ...prize } = SLICES[0];
  return prize;
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

export const createLuckyWheelMock = (): ILuckyWheelService => ({
  getConfig: async () => {
    await delay(160);
    return CONFIG;
  },
  getStatus: async (userId) => {
    await delay(160);
    if (!userId) {
      return { remainingSpins: 0, resetAt: nextResetAt() };
    }
    return readStatus(userId);
  },
  spin: async (userId) => {
    await delay(320);
    if (!userId) {
      throw new Error("LOGIN_REQUIRED");
    }
    const status = readStatus(userId);
    if (status.remainingSpins <= 0) {
      throw new Error("NO_SPINS_LEFT");
    }
    const prize = pickPrize();
    const remainingSpins = status.remainingSpins - 1;
    writeRemaining(userId, remainingSpins);
    const result: LuckyWheelResult = {
      prizeId: prize.id,
      label: prize.label,
      coinAmount: prize.coinAmount,
      remainingSpins,
      coinBalance: creditUser(prize.coinAmount),
    };
    return result;
  },
});
