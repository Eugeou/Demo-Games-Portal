import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import type { ILegalService } from "./legal.interface";
import type { LegalDocument, LegalSlug } from "@/domain/types";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";

export class LegalService implements ILegalService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getService("gateway-legal", url);
  }

  getPage(slug: LegalSlug) {
    return this.http.get<LegalDocument>(`${this.API_VERSION}/legal/${slug}`);
  }
}
