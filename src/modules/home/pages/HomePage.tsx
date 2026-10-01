import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Brain,
//   Clock3,
//   Dices,
//   Flame,
//   Sparkles,
//   Users,
// } from "lucide-react";
import { GAME_GENRES } from "@/domain/constants";
import { useGamesQueries, useGamesQuery } from "@/domain/services/games";
import { playPath, routePaths } from "@/routes/route-path";
import { GameSection, Loading } from "@/shared-components";
import { useTranslation } from "react-i18next";
import DailyClaimModal from "../components/DailyClaimModal";
import FeaturedCarousel from "../components/FeaturedCarousel";
import HeroBannerSlider from "../components/HeroBannerSlider";
import HomeStickyFabs from "../components/HomeStickyFabs";

// const collectionIcons = {
//   brain: Brain,
//   adrenaline: Flame,
//   friends: Users,
//   quick: Clock3,
//   meme: Sparkles,
//   classic: Dices,
// };

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dailyClaimOpen, setDailyClaimOpen] = useState(false);
  const gamesQuery = useGamesQuery(useGamesQueries.listGames);
  const games = gamesQuery.data ?? [];

  const featured = useMemo(() => {
    const flagged = games.filter((game) => game.featured);
    const rest = games.filter((game) => !game.featured);
    return [...flagged, ...rest];
  }, [games]);
  const popular = useMemo(
    () => [...games].sort((a, b) => b.rating - a.rating).slice(0, 6),
    [games]
  );

  const stickyUi = (
    <>
      <HomeStickyFabs onOpenDailyClaim={() => setDailyClaimOpen(true)} />
      <DailyClaimModal
        open={dailyClaimOpen}
        onClose={() => setDailyClaimOpen(false)}
      />
    </>
  );

  if (gamesQuery.isLoading) {
    return (
      <>
        <Loading />
        {stickyUi}
      </>
    );
  }

  const openRandom = () => {
    if (games.length === 0) {
      return;
    }
    const game = games[Math.floor(Math.random() * games.length)];
    navigate(playPath(game.slug));
  };

  return (
    <>
      <div className="space-y-8">
        <HeroBannerSlider />
        {/* <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-3">
        {GAME_COLLECTIONS.map((collection, index) => {
          const Icon = collectionIcons[collection];
          return (
            <motion.button
              key={collection}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`${routePaths.catalog}?collection=${collection}`)}
              className="rounded-xl md:rounded-2xl bg-surface p-2.5 text-left shadow-card ring-1 ring-line transition hover:-translate-y-1 hover:ring-brand md:p-4"
            >
              <span className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-lift text-brand md:mb-3 md:h-10 md:w-10 md:rounded-xl">
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
              </span>
              <p className="line-clamp-2 text-[11px] font-semibold leading-snug md:text-sm">
                {t(`common.collection.${collection}`)}
              </p>
            </motion.button>
          );
        })}
      </div> */}

        <FeaturedCarousel title={t("common.picksForYou")} games={featured} />

        <GameSection title={t("common.featuredGames")} games={popular} />
        {GAME_GENRES.map((genre) => (
          <GameSection
            key={genre}
            genre={genre}
            title={t(`common.genre.${genre}`)}
            href={`${routePaths.catalog}?genre=${genre}`}
            games={games.filter((game) => game.genre === genre)}
          />
        ))}

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={openRandom}
            className="rounded-full bg-lift px-5 py-2.5 text-sm font-semibold ring-1 ring-line transition hover:bg-line"
          >
            {t("common.randomGame")}
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full bg-lift px-5 py-2.5 text-sm font-semibold ring-1 ring-line transition hover:bg-line"
          >
            {t("common.backToTop")}
          </button>
        </div>
      </div>
      {stickyUi}
    </>
  );
}
