import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import type { IDailyClaimService } from "./daily-claim.interface";
import type {
  DailyCheckinConfig,
  DailyCheckinHistoryItem,
  DailyCheckinResult,
  DailyCheckinStatus,
} from "@/domain/types";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";

export class DailyClaimService implements IDailyClaimService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getService("gateway-daily-claim", url);
  }

  getConfig() {
    return this.http.get<DailyCheckinConfig>(`${this.API_VERSION}/daily-claim/config`);
  }

  getStatus(userId: string) {
    return this.http.get<DailyCheckinStatus>(`${this.API_VERSION}/daily-claim/status`, {
      userId,
    });
  }

  listHistory(userId: string) {
    return this.http.get<DailyCheckinHistoryItem[]>(
      `${this.API_VERSION}/daily-claim/history`,
      { userId }
    );
  }

  claim(userId: string) {
    return this.http.post<{ userId: string }, DailyCheckinResult>(
      `${this.API_VERSION}/daily-claim/claim`,
      { userId }
    );
  }
}
