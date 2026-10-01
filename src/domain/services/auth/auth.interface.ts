/**
 * Auth interface — phone OTP register / login
 */

import { env } from "@/infrastructure/env/env";
import type { UserInfo } from "@/domain/types";
import { createAuthMock } from "./auth.mock";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import {
  useServiceMutation,
  useServiceQuery,
  type MutationResult,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { AuthService } from "./auth.service";

export interface RequestOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
  requestId: string;
}

export interface RequestOtpResult {
  requestId: string;
}

export interface IAuthService {
  requestOtp(payload: RequestOtpPayload): Promise<RequestOtpResult>;
  verifyOtp(payload: VerifyOtpPayload): Promise<UserInfo>;
  logout(): Promise<string>;
  getUserInfo(): Promise<UserInfo>;
}

const authService = new AuthService(env.api.auth);
const authServiceMock = createAuthMock();

export function getApi(isMock: boolean = true): IAuthService {
  if (!isMock) {
    return authService;
  }
  return authServiceMock;
}

export function useAuthQuery<T, P = undefined>(
  queryFunc: (service: IAuthService, params?: P) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}

export function useAuthMutation<TResponse, TRequest>(
  mutationFunc: (
    service: IAuthService
  ) => UseMutationResult<TResponse, Error, TRequest>
): MutationResult<TResponse, TRequest> {
  return useServiceMutation(mutationFunc, getApi);
}
