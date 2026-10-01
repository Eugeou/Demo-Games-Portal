import { env } from "@/infrastructure/env/env";
import type {
  DailyCheckinConfig,
  DailyCheckinHistoryItem,
  DailyCheckinResult,
  DailyCheckinStatus,
} from "@/domain/types";
import { createDailyClaimMock } from "./daily-claim.mock";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import {
  useServiceMutation,
  useServiceQuery,
  type MutationResult,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { DailyClaimService } from "./daily-claim.service";

export interface IDailyClaimService {
  getConfig(): Promise<DailyCheckinConfig>;
  getStatus(userId: string): Promise<DailyCheckinStatus>;
  listHistory(userId: string): Promise<DailyCheckinHistoryItem[]>;
  claim(userId: string): Promise<DailyCheckinResult>;
}

const dailyClaimService = new DailyClaimService(env.api.proxy);
const dailyClaimServiceMock = createDailyClaimMock();

export function getApi(isMock: boolean = true): IDailyClaimService {
  if (!isMock) {
    return dailyClaimService;
  }
  return dailyClaimServiceMock;
}

export function useDailyClaimQuery<T, P = undefined>(
  queryFunc: (
    service: IDailyClaimService,
    params?: P
  ) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}

export function useDailyClaimMutation<TResponse, TRequest>(
  mutationFunc: (
    service: IDailyClaimService
  ) => UseMutationResult<TResponse, Error, TRequest>
): MutationResult<TResponse, TRequest> {
  return useServiceMutation(mutationFunc, getApi);
}
