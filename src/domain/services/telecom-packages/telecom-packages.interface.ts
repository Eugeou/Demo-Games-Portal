import { env } from "@/infrastructure/env/env";
import type { TelecomPackage } from "@/domain/types";
import { createTelecomPackagesMock } from "./telecom-packages.mock";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  useServiceQuery,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { TelecomPackagesService } from "./telecom-packages.service";

export interface ITelecomPackagesService {
  listPackages(): Promise<TelecomPackage[]>;
}

const telecomPackagesService = new TelecomPackagesService(env.api.proxy);
const telecomPackagesServiceMock = createTelecomPackagesMock();

export function getApi(isMock: boolean = true): ITelecomPackagesService {
  if (!isMock) {
    return telecomPackagesService;
  }
  return telecomPackagesServiceMock;
}

export function useTelecomPackagesQuery<T, P = undefined>(
  queryFunc: (
    service: ITelecomPackagesService,
    params?: P
  ) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}
