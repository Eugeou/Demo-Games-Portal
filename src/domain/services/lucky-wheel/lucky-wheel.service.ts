import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import type { ILuckyWheelService } from "./lucky-wheel.interface";
import type {
  LuckyWheelConfig,
  LuckyWheelResult,
  LuckyWheelStatus,
} from "@/domain/types";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";

export class LuckyWheelService implements ILuckyWheelService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getService("gateway-lucky-wheel", url);
  }

  getConfig() {
    return this.http.get<LuckyWheelConfig>(`${this.API_VERSION}/lucky-wheel/config`);
  }

  getStatus(userId: string) {
    return this.http.get<LuckyWheelStatus>(`${this.API_VERSION}/lucky-wheel/status`, {
      userId,
    });
  }

  spin(userId: string) {
    return this.http.post<{ userId: string }, LuckyWheelResult>(
      `${this.API_VERSION}/lucky-wheel/spin`,
      { userId }
    );
  }
}
