import { env } from "@/infrastructure/env/env";
import type { LegalDocument, LegalSlug } from "@/domain/types";
import { createLegalMock } from "./legal.mock";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  useServiceQuery,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { LegalService } from "./legal.service";

export interface ILegalService {
  getPage(slug: LegalSlug): Promise<LegalDocument>;
}

const legalService = new LegalService(env.api.proxy);
const legalServiceMock = createLegalMock();

export function getApi(isMock: boolean = true): ILegalService {
  if (!isMock) {
    return legalService;
  }
  return legalServiceMock;
}

export function useLegalQuery<T, P = undefined>(
  queryFunc: (service: ILegalService, params?: P) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}
