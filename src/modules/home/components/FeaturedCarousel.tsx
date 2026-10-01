import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Game } from "@/domain/types";
import { GameCard } from "@/shared-components";

type FeaturedCarouselProps = {
  title: string;
  games: Game[];
};

type FeaturedCluster = {
  hero: Game;
  tiles: Game[];
};

function toClusters(games: Game[]): FeaturedCluster[] {
  const clusters: FeaturedCluster[] = [];
  for (let index = 0; index < games.length; index += 5) {
    const slice = games.slice(index, index + 5);
    if (slice.length === 0) {
      break;
    }
    clusters.push({
      hero: slice[0],
      tiles: slice.slice(1),
    });
  }
  return clusters;
}

export default function FeaturedCarousel({ title, games }: FeaturedCarouselProps) {
  const { t } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const clusters = useMemo(() => toClusters(games), [games]);

  const scrollByCluster = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    const cluster = scroller?.firstElementChild as HTMLElement | undefined;
    if (!scroller || !cluster) {
      return;
    }
    const gap = 16;
    scroller.scrollBy({
      left: direction * (cluster.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  if (clusters.length === 0) {
    return null;
  }

  return (
    <section
      className="relative space-y-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <div
        ref={scrollerRef}
        className="scrollbar-none -mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 py-8"
      >
        {clusters.map((cluster) => (
          <div
            key={cluster.hero.id}
            className="grid w-[min(96vw,1120px)] shrink-0 snap-start grid-cols-4 gap-4 overflow-visible"
          >
            <div className="col-span-2 row-span-2 min-h-0 overflow-visible">
              <GameCard game={cluster.hero} size="hero" />
            </div>
            {cluster.tiles.map((game) => (
              <div key={game.id} className="overflow-visible">
                <GameCard game={game} size="sm" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {hovered && clusters.length > 1 ? (
          <>
            <motion.button
              type="button"
              key="prev"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              aria-label={t("common.scrollPrev")}
              onClick={() => scrollByCluster(-1)}
              className="absolute left-1 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-card backdrop-blur-sm transition hover:bg-black"
            >
              <ChevronLeft size={22} />
            </motion.button>
            <motion.button
              type="button"
              key="next"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              aria-label={t("common.scrollNext")}
              onClick={() => scrollByCluster(1)}
              className="absolute right-1 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-card backdrop-blur-sm transition hover:bg-black"
            >
              <ChevronRight size={22} />
            </motion.button>
          </>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
