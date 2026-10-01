/**
 * Auth mock
 */

import { DEFAULT_AVATAR } from "@/domain/constants";
import type { IAuthService } from "./auth.interface";
import { AuthMockData } from "./mock-data/auth-mock.data";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const MOCK_OTP = "123456";

export const createAuthMock = (): IAuthService => ({
  requestOtp: async () => {
    await delay();
    return { requestId: "otp-mock-001" };
  },
  verifyOtp: async (payload) => {
    await delay();
    if (payload.otp !== MOCK_OTP) {
      throw new Error("INVALID_OTP");
    }
    const template = AuthMockData.data_getter().userInfo;
    return {
      ...template,
      id: `user-${payload.phone}`,
      phone: payload.phone,
      displayName: `Player${payload.phone.slice(-4)}`,
      avatarUrl: DEFAULT_AVATAR,
      sessionToken: `mock-session-${payload.phone}`,
      isNew: true,
    };
  },
  logout: async () => {
    await delay();
    return "Đăng xuất thành công";
  },
  getUserInfo: async () => {
    await delay();
    return AuthMockData.data_getter().userInfo;
  },
});
