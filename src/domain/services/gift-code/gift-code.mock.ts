import { GIFT_CODE_STORAGE_KEY } from "@/domain/constants";
import ClientStorageService from "@/domain/services/client-storage";
import {
  USER_STORAGE_KEY,
  type GiftCodeHistoryItem,
  type GiftCodeRedeemResult,
  type UserInfo,
} from "@/domain/types";
import type { IGiftCodeService } from "./gift-code.interface";

const delay = (ms = 240) => new Promise((resolve) => setTimeout(resolve, ms));

type CatalogItem = {
  code: string;
  coinAmount: number;
  expired?: boolean;
};

type UserStore = {
  redeemed: GiftCodeHistoryItem[];
};

type Store = Record<string, UserStore>;

const CATALOG: CatalogItem[] = [
  { code: "WELCOME50", coinAmount: 50 },
  { code: "DND100", coinAmount: 100 },
  { code: "PORTAL20", coinAmount: 20 },
  { code: "EXPIRED", coinAmount: 10, expired: true },
];

function normalize(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

function readStore(): Store {
  return ClientStorageService.getItem<Store>(GIFT_CODE_STORAGE_KEY) ?? {};
}

function writeStore(store: Store) {
  ClientStorageService.setItem(GIFT_CODE_STORAGE_KEY, store);
}

function readUser(userId: string): UserStore {
  return readStore()[userId] ?? { redeemed: [] };
}

function writeUser(userId: string, next: UserStore) {
  writeStore({ ...readStore(), [userId]: next });
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

export const createGiftCodeMock = (): IGiftCodeService => ({
  listHistory: async (userId) => {
    await delay(140);
    if (!userId) {
      return [];
    }
    return [...readUser(userId).redeemed].sort(
      (a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime()
    );
  },
  redeem: async (userId, rawCode) => {
    await delay();
    if (!userId) {
      throw new Error("LOGIN_REQUIRED");
    }
    const code = normalize(rawCode);
    if (!code) {
      throw new Error("INVALID_CODE");
    }
    const catalog = CATALOG.find((item) => item.code === code);
    if (!catalog) {
      throw new Error("INVALID_CODE");
    }
    if (catalog.expired) {
      throw new Error("EXPIRED_CODE");
    }
    const current = readUser(userId);
    if (current.redeemed.some((item) => item.code === code)) {
      throw new Error("ALREADY_REDEEMED");
    }
    const entry: GiftCodeHistoryItem = {
      id: `${userId}-${code}-${Date.now()}`,
      code,
      coinAmount: catalog.coinAmount,
      redeemedAt: new Date().toISOString(),
    };
    writeUser(userId, { redeemed: [entry, ...current.redeemed] });
    const result: GiftCodeRedeemResult = {
      code,
      coinAmount: catalog.coinAmount,
      coinBalance: creditUser(catalog.coinAmount),
    };
    return result;
  },
});
