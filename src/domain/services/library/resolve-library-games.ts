import type { Game } from "@/domain/types";

export function resolveLibraryGames(ids: string[], games: Game[]) {
  const map = new Map(games.map((game) => [game.id, game]));
  return ids
    .map((id) => map.get(id) ?? games.find((game) => game.slug === id))
    .filter((game): game is Game => Boolean(game));
}
