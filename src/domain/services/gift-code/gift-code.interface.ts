import { env } from "@/infrastructure/env/env";
import type { GiftCodeHistoryItem, GiftCodeRedeemResult } from "@/domain/types";
import { createGiftCodeMock } from "./gift-code.mock";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import {
  useServiceMutation,
  useServiceQuery,
  type MutationResult,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { GiftCodeService } from "./gift-code.service";

export interface IGiftCodeService {
  listHistory(userId: string): Promise<GiftCodeHistoryItem[]>;
  redeem(userId: string, code: string): Promise<GiftCodeRedeemResult>;
}

const giftCodeService = new GiftCodeService(env.api.proxy);
const giftCodeServiceMock = createGiftCodeMock();

export function getApi(isMock: boolean = true): IGiftCodeService {
  if (!isMock) {
    return giftCodeService;
  }
  return giftCodeServiceMock;
}

export function useGiftCodeQuery<T, P = undefined>(
  queryFunc: (service: IGiftCodeService, params?: P) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}

export function useGiftCodeMutation<TResponse, TRequest>(
  mutationFunc: (
    service: IGiftCodeService
  ) => UseMutationResult<TResponse, Error, TRequest>
): MutationResult<TResponse, TRequest> {
  return useServiceMutation(mutationFunc, getApi);
}
