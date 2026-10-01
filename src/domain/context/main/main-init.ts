import type { MainProviderTypes } from "./main-provider-types";
import { emptyUser } from "@/domain/types";

export const MainDefault: MainProviderTypes = {
  userInfo: emptyUser,
  isLoading: false,
  setIsLoading: () => {},
  setUserInfo: () => {},
};
