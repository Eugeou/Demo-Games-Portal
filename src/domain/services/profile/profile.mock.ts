import {
  DEFAULT_AVATAR,
  DEFAULT_COVER,
  PLANS,
  PROFILE_STORAGE_KEY,
} from "@/domain/constants";
import ClientStorageService from "@/domain/services/client-storage";
import type { PlayerProfile, UpdateProfilePayload } from "@/domain/types";
import type { IProfileService } from "./profile.interface";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

type ProfileStore = Record<string, PlayerProfile>;

function readStore(): ProfileStore {
  return ClientStorageService.getItem<ProfileStore>(PROFILE_STORAGE_KEY) ?? {};
}

function writeStore(store: ProfileStore) {
  ClientStorageService.setItem(PROFILE_STORAGE_KEY, store);
}

function usernameFromUserId(userId: string) {
  const phone = userId.replace(/^user-/, "");
  return `Player${phone.slice(-4) || "0000"}`;
}

function phoneFromUserId(userId: string) {
  return userId.replace(/^user-/, "");
}

export function createDefaultProfile(userId: string): PlayerProfile {
  return {
    userId,
    username: usernameFromUserId(userId),
    phone: phoneFromUserId(userId),
    country: "VN",
    birthday: "",
    gender: "unspecified",
    avatarUrl: DEFAULT_AVATAR,
    coverUrl: DEFAULT_COVER,
    friendsCount: 0,
    daysOnline: 1,
    likedCount: 0,
    playStreak: 1,
    playStreakBest: 1,
  };
}

function ensureProfile(userId: string): PlayerProfile {
  const store = readStore();
  const existing = store[userId];
  if (existing) {
    return {
      ...createDefaultProfile(userId),
      ...existing,
      avatarUrl: existing.avatarUrl || DEFAULT_AVATAR,
      coverUrl: existing.coverUrl || DEFAULT_COVER,
    };
  }
  const created = createDefaultProfile(userId);
  writeStore({ ...store, [userId]: created });
  return created;
}

export const createProfileMock = (): IProfileService => ({
  getProfile: async (userId) => {
    await delay();
    return ensureProfile(userId);
  },
  updateProfile: async (payload: UpdateProfilePayload) => {
    await delay();
    const current = ensureProfile(payload.userId);
    const next: PlayerProfile = {
      ...current,
      ...payload,
      avatarUrl: payload.avatarUrl || current.avatarUrl || DEFAULT_AVATAR,
      coverUrl: payload.coverUrl || current.coverUrl || DEFAULT_COVER,
    };
    const store = readStore();
    writeStore({ ...store, [payload.userId]: next });
    return next;
  },
  getCurrentPlan: async () => {
    await delay();
    return { id: PLANS.FREE, name: "Miễn phí", isActive: true };
  },
  getTransactions: async () => {
    await delay();
    return [
      {
        id: "tx-001",
        type: "daily_claim",
        amount: 10,
        createdAt: "2026-10-05T08:00:00.000Z",
        description: "Nhận coin hằng ngày",
      },
    ];
  },
  getPlayHistory: async () => {
    await delay();
    return [
      {
        id: "play-001",
        gameId: "game-001",
        gameName: "Lucky Dice",
        playedAt: "2026-10-05T09:00:00.000Z",
        score: 120,
      },
    ];
  },
});
