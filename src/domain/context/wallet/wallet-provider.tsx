import { createContext, useMemo, useReducer } from "react";
import {
  initialWalletState,
  walletReducer,
  type WalletProviderTypes,
} from "./wallet-provider-types";
import { WalletDefault } from "./wallet-provider-init";

export const WalletContext = createContext<WalletProviderTypes>(WalletDefault);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(walletReducer, initialWalletState);

  const setCoinBalance = (coinBalance: number) => {
    dispatch({ type: "SET_COIN_BALANCE", payload: coinBalance });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      setCoinBalance,
    }),
    [state]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
