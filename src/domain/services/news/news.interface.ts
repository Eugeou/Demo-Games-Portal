import { env } from "@/infrastructure/env/env";
import type { NewsItem } from "@/domain/types";
import { createNewsMock } from "./news.mock";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  useServiceQuery,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { NewsService } from "./news.service";

export interface INewsService {
  listNews(): Promise<NewsItem[]>;
  getNews(id: string): Promise<NewsItem>;
}

const newsService = new NewsService(env.api.proxy);
const newsServiceMock = createNewsMock();

export function getApi(isMock: boolean = true): INewsService {
  if (!isMock) {
    return newsService;
  }
  return newsServiceMock;
}

export function useNewsQuery<T, P = undefined>(
  queryFunc: (service: INewsService, params?: P) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}
