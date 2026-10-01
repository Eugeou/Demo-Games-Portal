import { env } from "@/infrastructure/env/env";
import type {
  LuckyWheelConfig,
  LuckyWheelResult,
  LuckyWheelStatus,
} from "@/domain/types";
import { createLuckyWheelMock } from "./lucky-wheel.mock";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import {
  useServiceMutation,
  useServiceQuery,
  type MutationResult,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { LuckyWheelService } from "./lucky-wheel.service";

export interface ILuckyWheelService {
  getConfig(): Promise<LuckyWheelConfig>;
  getStatus(userId: string): Promise<LuckyWheelStatus>;
  spin(userId: string): Promise<LuckyWheelResult>;
}

const luckyWheelService = new LuckyWheelService(env.api.proxy);
const luckyWheelServiceMock = createLuckyWheelMock();

export function getApi(isMock: boolean = true): ILuckyWheelService {
  if (!isMock) {
    return luckyWheelService;
  }
  return luckyWheelServiceMock;
}

export function useLuckyWheelQuery<T, P = undefined>(
  queryFunc: (
    service: ILuckyWheelService,
    params?: P
  ) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}

export function useLuckyWheelMutation<TResponse, TRequest>(
  mutationFunc: (
    service: ILuckyWheelService
  ) => UseMutationResult<TResponse, Error, TRequest>
): MutationResult<TResponse, TRequest> {
  return useServiceMutation(mutationFunc, getApi);
}
