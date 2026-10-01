import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import type { ITelecomPackagesService } from "./telecom-packages.interface";
import type { TelecomPackage } from "@/domain/types";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";

export class TelecomPackagesService implements ITelecomPackagesService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getService("gateway-telecom-packages", url);
  }

  listPackages() {
    return this.http.get<TelecomPackage[]>(`${this.API_VERSION}/telecom-packages`);
  }
}
