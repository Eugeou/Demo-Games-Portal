export interface UserInfo {
  id: string;
  phone: string;
  displayName: string;
  planId: string;
  coinBalance: number;
  sessionToken: string;
  isNew: boolean;
  avatarUrl?: string;
}

export const emptyUser: UserInfo = {
  id: "",
  phone: "",
  displayName: "",
  planId: "free",
  coinBalance: 0,
  sessionToken: "",
  isNew: false,
};

export const USER_STORAGE_KEY = "portal-user";

export function isSignedIn(user: UserInfo) {
  return Boolean(user.id && user.sessionToken);
}
