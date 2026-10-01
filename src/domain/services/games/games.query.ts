import { useQuery } from "@/infrastructure/plugins/tanstack";
import { type IGamesService } from "./games.interface";

const QUERY_SERVICE_ID = "games";

const listGames = (service: IGamesService, params?: { genre?: string }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "list", params?.genre ?? "all"],
    queryFn: () => service.listGames(params?.genre),
  });
};

const getGame = (service: IGamesService, params?: { id: string }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "detail", params?.id ?? ""],
    queryFn: () => {
      if (!params?.id) {
        return Promise.reject(new Error("game id is required"));
      }
      return service.getGame(params.id);
    },
    options: {
      enabled: Boolean(params?.id),
    },
  });
};

export const useGamesQueries = {
  listGames,
  getGame,
};
