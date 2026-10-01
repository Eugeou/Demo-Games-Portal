import { createContext, useMemo, useReducer } from "react";
import {
  initialState,
  mainReducer,
  type MainProviderTypes,
} from "./main-provider-types";
import ClientStorageService from "@/domain/services/client-storage";
import { emptyUser, isSignedIn, USER_STORAGE_KEY, type UserInfo } from "@/domain/types";
import { MainDefault } from "./main-init";

function readStoredUser(): UserInfo {
  const stored = ClientStorageService.getItem<UserInfo>(USER_STORAGE_KEY);
  if (stored && isSignedIn(stored)) {
    return stored;
  }
  return emptyUser;
}

export const MainContext = createContext<MainProviderTypes>(MainDefault);

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(mainReducer, {
    ...initialState,
    userInfo: readStoredUser(),
  });

  const setUserInfo = (userInfo: UserInfo) => {
    dispatch({ type: "SET_USER_INFO", payload: userInfo });
    if (isSignedIn(userInfo)) {
      ClientStorageService.setItem(USER_STORAGE_KEY, userInfo);
      return;
    }
    ClientStorageService.removeItem(USER_STORAGE_KEY);
  };

  const setIsLoading = (isLoading: boolean) => {
    dispatch({ type: "SET_IS_LOADING", payload: isLoading });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      setUserInfo,
      setIsLoading,
    }),
    [state]
  );

  return (
    <MainContext.Provider value={contextValue}>{children}</MainContext.Provider>
  );
};
