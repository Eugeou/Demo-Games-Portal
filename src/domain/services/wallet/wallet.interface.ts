import { env } from "@/infrastructure/env/env";
import type { DailyClaimResult, WalletInfo } from "@/domain/types";
import { createWalletMock } from "./wallet.mock";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import {
  useServiceMutation,
  useServiceQuery,
  type MutationResult,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { WalletService } from "./wallet.service";

export interface IWalletService {
  getBalance(): Promise<WalletInfo>;
  claimDaily(): Promise<DailyClaimResult>;
}

const walletService = new WalletService(env.api.billing);
const walletServiceMock = createWalletMock();

export function getApi(isMock: boolean = false): IWalletService {
  if (!isMock) {
    return walletService;
  }
  return walletServiceMock;
}

export function useWalletQuery<T, P = undefined>(
  queryFunc: (service: IWalletService, params?: P) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}

export function useWalletMutation<TResponse, TRequest>(
  mutationFunc: (
    service: IWalletService
  ) => UseMutationResult<TResponse, Error, TRequest>
): MutationResult<TResponse, TRequest> {
  return useServiceMutation(mutationFunc, getApi);
}
