import { env } from "@/infrastructure/env/env";
import type { HeroBanner } from "@/domain/types";
import { createBannersMock } from "./banners.mock";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  useServiceQuery,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { BannersService } from "./banners.service";

export interface IBannersService {
  listBanners(): Promise<HeroBanner[]>;
}

const bannersService = new BannersService(env.api.proxy);
const bannersServiceMock = createBannersMock();

export function getApi(isMock: boolean = true): IBannersService {
  if (!isMock) {
    return bannersService;
  }
  return bannersServiceMock;
}

export function useBannersQuery<T, P = undefined>(
  queryFunc: (service: IBannersService, params?: P) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}
