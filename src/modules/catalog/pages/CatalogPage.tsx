import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GAME_GENRES, type GameGenre } from "@/domain/constants";
import { useGamesQuery, useGamesQueries } from "@/domain/services/games";
import { GameSection, Loading } from "@/shared-components";

function asGenre(value?: string): GameGenre | undefined {
  return GAME_GENRES.find((genre) => genre === value);
}

export default function CatalogPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const genre = params.get("genre") ?? undefined;
  const collection = params.get("collection") ?? undefined;
  const gamesQuery = useGamesQuery(useGamesQueries.listGames, genre ? { genre } : undefined);
  const games = gamesQuery.data ?? [];

  const visible = useMemo(() => {
    if (!collection) {
      return games;
    }
    return games.filter((game) => game.collections.includes(collection));
  }, [collection, games]);

  if (gamesQuery.isLoading) {
    return <Loading />;
  }

  const title = collection
    ? t(`common.collection.${collection}`)
    : genre
      ? t(`common.genre.${genre}`)
      : t("common.catalogTitle");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="mt-1 text-sm text-muted">{t("common.catalogSubtitle")}</p>
      </div>
      <GameSection
        title={t("common.allGames")}
        genre={asGenre(genre)}
        games={visible}
      />
    </div>
  );
}
