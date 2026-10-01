import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import type { IGiftCodeService } from "./gift-code.interface";
import type { GiftCodeHistoryItem, GiftCodeRedeemResult } from "@/domain/types";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";

export class GiftCodeService implements IGiftCodeService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getService("gateway-gift-code", url);
  }

  listHistory(userId: string) {
    return this.http.get<GiftCodeHistoryItem[]>(`${this.API_VERSION}/gift-codes/history`, {
      userId,
    });
  }

  redeem(userId: string, code: string) {
    return this.http.post<{ userId: string; code: string }, GiftCodeRedeemResult>(
      `${this.API_VERSION}/gift-codes/redeem`,
      { userId, code }
    );
  }
}
