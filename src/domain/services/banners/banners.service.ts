import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";
import type { HeroBanner } from "@/domain/types";
import type { IBannersService } from "./banners.interface";

export class BannersService implements IBannersService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getService("gateway-banners", url);
  }

  listBanners() {
    return this.http.get<HeroBanner[]>(`${this.API_VERSION}/banners`);
  }
}
