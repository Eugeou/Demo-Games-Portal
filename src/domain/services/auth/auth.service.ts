/**
 * Auth service
 */

import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import type {
  IAuthService,
  RequestOtpPayload,
  RequestOtpResult,
  VerifyOtpPayload,
} from "./auth.interface";
import type { UserInfo } from "@/domain/types";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";

export class AuthService implements IAuthService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getAuthService(url);
  }

  async requestOtp(payload: RequestOtpPayload): Promise<RequestOtpResult> {
    return this.http.post(`${this.API_VERSION}/otp/request`, payload);
  }

  async verifyOtp(payload: VerifyOtpPayload): Promise<UserInfo> {
    return this.http.post(`${this.API_VERSION}/otp/verify`, payload);
  }

  async logout(): Promise<string> {
    return this.http.post(`${this.API_VERSION}/logout`);
  }

  async getUserInfo(): Promise<UserInfo> {
    return this.http.get(`${this.API_VERSION}/me`);
  }
}
