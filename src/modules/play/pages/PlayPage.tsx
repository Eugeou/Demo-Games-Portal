import { useMain } from "@/domain/context/main/use-main";
import { useGamesQueries, useGamesQuery } from "@/domain/services/games";
import {
  useLibraryMutation,
  useLibraryMutations,
  useLibraryQueries,
  useLibraryQuery,
} from "@/domain/services/library";
import { isSignedIn } from "@/domain/types";
import { routePaths } from "@/routes/route-path";
import { GameCard, GameSection, Loading } from "@/shared-components";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Bookmark,
  ChevronRight,
  Play,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import GameAbout from "../components/GameAbout";

export default function PlayPage() {
  const { t } = useTranslation();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const [playing, setPlaying] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const gameQuery = useGamesQuery(useGamesQueries.getGame, {
    id: gameId ?? "",
  });
  const listQuery = useGamesQuery(useGamesQueries.listGames);
  const savedQuery = useLibraryQuery(useLibraryQueries.listSaved, {
    userId: userInfo.id,
  });
  const likedQuery = useLibraryQuery(useLibraryQueries.listLiked, {
    userId: userInfo.id,
  });
  const toggleSaved = useLibraryMutation(useLibraryMutations.toggleSaved);
  const toggleLiked = useLibraryMutation(useLibraryMutations.toggleLiked);
  const addRecent = useLibraryMutation(useLibraryMutations.addRecent);
  const game = gameQuery.data;
  const saved = Boolean(game && savedQuery.data?.includes(game.id));
  const liked = Boolean(game && likedQuery.data?.includes(game.id));

  const related = useMemo(
    () =>
      (listQuery.data ?? [])
        .filter((item) => item.genre === game?.genre && item.id !== game?.id)
        .slice(0, 8),
    [game, listQuery.data]
  );

  useEffect(() => {
    setPlaying(false);
    setShowBack(false);
  }, [gameId]);

  useEffect(() => {
    if (!game?.id) {
      return;
    }
    void addRecent.mutateAsync(game.id);
    // Record once per game page, not when the mutation object identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.id]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowBack(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(player);
    return () => observer.disconnect();
  }, [game?.id]);

  if (gameQuery.isLoading) {
    return <Loading />;
  }

  if (!game) {
    return (
      <section className="rounded-xl md:rounded-2xl bg-surface p-6 ring-1 ring-line">
        <h1 className="text-xl font-bold">{t("common.gameNotFound")}</h1>
        <Link to={routePaths.home} className="mt-3 inline-block text-brand">
          {t("common.navHome")}
        </Link>
      </section>
    );
  }

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: game.name, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  const scrollToGame = () => {
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const requireLogin = () => {
    navigate(location.pathname, { state: { openLogin: true } });
  };

  const onSave = () => {
    if (!game) {
      return;
    }
    if (!signedIn) {
      requireLogin();
      return;
    }
    void toggleSaved.mutateAsync({ userId: userInfo.id, gameId: game.id });
  };

  const onLike = () => {
    if (!game) {
      return;
    }
    if (!signedIn) {
      requireLogin();
      return;
    }
    void toggleLiked.mutateAsync({ userId: userInfo.id, gameId: game.id });
  };

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link to={routePaths.catalog} className="hover:text-ink">
          {t("common.gamesLabel")}
        </Link>
        <ChevronRight size={14} />
        <Link
          to={`${routePaths.catalog}?genre=${game.genre}`}
          className="hover:text-ink"
        >
          {t(`common.genre.${game.genre}`)}
        </Link>
        <ChevronRight size={14} />
        <span className="text-ink">{game.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-6">
          <motion.div
            ref={playerRef}
            layout
            className="overflow-hidden rounded-3xl bg-black shadow-card"
          >
            <div className="relative aspect-video">
              <img
                src={game.thumbnailUrl}
                alt={game.name}
                className={`h-full w-full object-cover transition ${
                  playing ? "opacity-40" : "opacity-100"
                }`}
              />
              {!playing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPlaying(true)}
                    className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-card"
                  >
                    <Play size={16} fill="currentColor" />
                    {t("common.playNow")}
                  </motion.button>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-white">
                  <p className="text-lg font-bold">{game.name}</p>
                  <p className="max-w-md px-4 text-sm text-white/80">
                    {t("common.embedPlaceholder")}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {game.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onSave}
                aria-pressed={saved}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition ${
                  saved
                    ? "bg-brand text-white ring-brand"
                    : "bg-lift text-ink ring-line hover:bg-line"
                }`}
              >
                <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                {saved ? t("common.unsaveGame") : t("common.saveGame")}
              </button>
              <button
                type="button"
                onClick={onLike}
                aria-pressed={liked}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition ${
                  liked
                    ? "bg-brand text-white ring-brand"
                    : "bg-lift text-ink ring-line hover:bg-line"
                }`}
              >
                <ThumbsUp size={14} fill={liked ? "currentColor" : "none"} />
                {liked ? t("common.unlikeGame") : t("common.likeGame")}
              </button>
              <button
                type="button"
                onClick={() => {
                  void share();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-lift px-3.5 py-2 text-sm font-semibold ring-1 ring-line transition hover:bg-line"
              >
                <Share2 size={14} />
                {t("common.share")}
              </button>
            </div>
          </div>

          <GameAbout game={game} />

          <div className="lg:hidden">
            <GameSection title={t("common.relatedGames")} games={related} />
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            {related.map((item) => (
              <GameCard key={item.id} game={item} size="sm" />
            ))}
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {showBack ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={scrollToGame}
            className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black shadow-card"
          >
            <ArrowUp size={16} />
            {t("common.backToGame")}
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
