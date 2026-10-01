import type { UserInfo } from "@/domain/types";
import { PLANS } from "@/domain/constants";

export const AuthMockData = {
  data_getter: () => {
    return {
      userInfo: {
        id: "user-001",
        phone: "0901234567",
        displayName: "Người chơi",
        planId: PLANS.FREE,
        coinBalance: 120,
        sessionToken: "mock-session",
        isNew: false,
      } satisfies UserInfo,
    };
  },
  data_setter: (userInfo: UserInfo | null) => {
    return {
      userInfo,
    };
  },
};
