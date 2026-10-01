import { env } from "@/infrastructure/env/env";
import type {
  PlayHistory,
  PlayerProfile,
  SubscriptionPlan,
  Transaction,
  UpdateProfilePayload,
} from "@/domain/types";
import { createProfileMock } from "./profile.mock";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import {
  useServiceMutation,
  useServiceQuery,
  type MutationResult,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { ProfileService } from "./profile.service";

export interface IProfileService {
  getProfile(userId: string): Promise<PlayerProfile>;
  updateProfile(payload: UpdateProfilePayload): Promise<PlayerProfile>;
  getCurrentPlan(): Promise<SubscriptionPlan>;
  getTransactions(): Promise<Transaction[]>;
  getPlayHistory(): Promise<PlayHistory[]>;
}

const profileService = new ProfileService(env.api.proxy);
const profileServiceMock = createProfileMock();

export function getApi(isMock: boolean = true): IProfileService {
  if (!isMock) {
    return profileService;
  }
  return profileServiceMock;
}

export function useProfileQuery<T, P = undefined>(
  queryFunc: (service: IProfileService, params?: P) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}

export function useProfileMutation<TResponse, TRequest>(
  mutationFunc: (
    service: IProfileService
  ) => UseMutationResult<TResponse, Error, TRequest>
): MutationResult<TResponse, TRequest> {
  return useServiceMutation(mutationFunc, getApi);
}
