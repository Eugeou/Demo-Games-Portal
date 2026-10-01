import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import type { INewsService } from "./news.interface";
import type { NewsItem } from "@/domain/types";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";

export class NewsService implements INewsService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getService("gateway-news", url);
  }

  listNews() {
    return this.http.get<NewsItem[]>(`${this.API_VERSION}/news`);
  }

  getNews(id: string) {
    return this.http.get<NewsItem>(`${this.API_VERSION}/news/${id}`);
  }
}
