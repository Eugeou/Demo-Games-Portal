import { env } from "@/infrastructure/env/env";
import type { Game } from "@/domain/types";
import { createGamesMock } from "./games.mock";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  useServiceQuery,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { GamesService } from "./games.service";

export interface IGamesService {
  listGames(genre?: string): Promise<Game[]>;
  getGame(id: string): Promise<Game>;
}

const gamesService = new GamesService(env.api.proxy);
const gamesServiceMock = createGamesMock();

export function getApi(isMock: boolean = true): IGamesService {
  if (!isMock) {
    return gamesService;
  }
  return gamesServiceMock;
}

export function useGamesQuery<T, P = undefined>(
  queryFunc: (service: IGamesService, params?: P) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}
