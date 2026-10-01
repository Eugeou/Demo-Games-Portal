import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import type { IGamesService } from "./games.interface";
import type { Game } from "@/domain/types";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";

export class GamesService implements IGamesService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getCommonService(url);
  }

  async listGames(genre?: string): Promise<Game[]> {
    return this.http.get(`${this.API_VERSION}/games`, genre ? { genre } : undefined);
  }

  async getGame(id: string): Promise<Game> {
    return this.http.get(`${this.API_VERSION}/games/${id}`);
  }
}
