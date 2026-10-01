export type ProfileGender = "unspecified" | "male" | "female" | "other";

export interface PlayerProfile {
  userId: string;
  username: string;
  phone: string;
  country: string;
  birthday: string;
  gender: ProfileGender;
  avatarUrl: string;
  coverUrl: string;
  friendsCount: number;
  daysOnline: number;
  likedCount: number;
  playStreak: number;
  playStreakBest: number;
}

export type UpdateProfilePayload = {
  userId: string;
  username?: string;
  country?: string;
  birthday?: string;
  gender?: ProfileGender;
  avatarUrl?: string;
  coverUrl?: string;
};

export type TransactionType = "topup" | "spend" | "daily_claim" | "lucky_wheel";

export interface SubscriptionPlan {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  createdAt: string;
  description: string;
}

export interface PlayHistory {
  id: string;
  gameId: string;
  gameName: string;
  playedAt: string;
  score?: number;
}
