import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import type { IProfileService } from "./profile.interface";
import type {
  PlayHistory,
  PlayerProfile,
  SubscriptionPlan,
  Transaction,
  UpdateProfilePayload,
} from "@/domain/types";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";

export class ProfileService implements IProfileService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getService("gateway-profile", url);
  }

  async getProfile(userId: string): Promise<PlayerProfile> {
    return this.http.get(`${this.API_VERSION}/profile`, { userId });
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<PlayerProfile> {
    return this.http.patch(`${this.API_VERSION}/profile`, payload);
  }

  async getCurrentPlan(): Promise<SubscriptionPlan> {
    return this.http.get(`${this.API_VERSION}/profile/plan`);
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.http.get(`${this.API_VERSION}/profile/transactions`);
  }

  async getPlayHistory(): Promise<PlayHistory[]> {
    return this.http.get(`${this.API_VERSION}/profile/play-history`);
  }
}
