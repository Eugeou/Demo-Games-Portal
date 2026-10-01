import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import type { IWalletService } from "./wallet.interface";
import type { DailyClaimResult, WalletInfo } from "@/domain/types";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";

export class WalletService implements IWalletService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getService("gateway-billing", url);
  }

  async getBalance(): Promise<WalletInfo> {
    return this.http.get(`${this.API_VERSION}/wallet`);
  }

  async claimDaily(): Promise<DailyClaimResult> {
    return this.http.post(`${this.API_VERSION}/wallet/daily-claim`);
  }
}
