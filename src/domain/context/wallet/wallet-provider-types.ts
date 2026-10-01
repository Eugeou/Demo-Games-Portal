export interface WalletProviderTypes {
  coinBalance: number;
  setCoinBalance: (coinBalance: number) => void;
}

type WalletState = {
  coinBalance: number;
};

type WalletAction = { type: "SET_COIN_BALANCE"; payload: number };

export const walletReducer = (
  state: WalletState,
  action: WalletAction
): WalletState => {
  switch (action.type) {
    case "SET_COIN_BALANCE":
      return { ...state, coinBalance: action.payload };
  }
};

export const initialWalletState: WalletState = {
  coinBalance: 0,
};
