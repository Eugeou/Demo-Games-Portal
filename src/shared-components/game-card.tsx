import type { Game } from "@/domain/types";
import { playPath } from "@/routes/route-path";
import { AnimatePresence, motion } from "framer-motion";
import { ThumbsUp, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type GameCardProps = {
  game: Game;
  size?: "sm" | "md" | "lg" | "hero";
};

const sizeClass = {
  sm: "aspect-[16/10] w-full",
  md: "aspect-[16/10] w-full",
  lg: "aspect-[16/10] w-full min-h-[180px] md:min-h-[220px]",
  hero: "h-full min-h-0 w-full",
};

function formatCount(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function GameCard({ game, size = "md" }: GameCardProps) {
  const { t, i18n } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const year = new Date(game.releasedAt).getFullYear();

  return (
    <Link
      to={playPath(game.slug)}
      className={`relative block h-full min-h-0 ${hovered ? "z-40" : "z-0"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`relative ${sizeClass[size]}`}>
        <motion.article
          animate={{
            scale: hovered ? 1.14 : 1,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={`absolute inset-0 overflow-hidden rounded-xl md:rounded-2xl bg-surface ring-1 ring-line ${
            hovered
              ? "shadow-[0_10px_40px_rgb(0_149_255_/_0.32)]"
              : "shadow-card"
          }`}
          style={{ transformOrigin: "center center" }}
        >
          <img
            src={game.thumbnailUrl}
            alt={game.name}
            className="h-full w-full object-cover"
          />
          <AnimatePresence>
            {hovered ? (
              <motion.img
                key={game.introUrl}
                src={game.introUrl}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
          </AnimatePresence>
          <div
            className={`absolute inset-0 ${
              hovered
                ? "bg-gradient-to-t from-black/35 via-transparent to-transparent"
                : "bg-gradient-to-t from-black/80 via-black/15 to-transparent"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background:
                "radial-gradient(ellipse 92% 78% at 50% 112%, rgb(0 149 255 / 0.58) 0%, rgb(0 149 255 / 0.2) 42%, transparent 70%)",
              boxShadow: "inset 0 -28px 46px rgb(0 149 255 / 0.28)",
            }}
          />
          {game.playersLabel ? (
            <span className="absolute right-2 top-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {game.playersLabel}
            </span>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 p-3 text-white">
            <h3 className="truncate text-sm font-extrabold tracking-wide md:text-base">
              {game.name}
            </h3>
            <AnimatePresence>
              {hovered ? (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-white/85 md:text-xs"
                >
                  <span>{t(`common.genre.${game.genre}`)}</span>
                  <span>{year}</span>
                  <span className="inline-flex items-center gap-1">
                    <Users size={12} />
                    {formatCount(game.playerCount, i18n.language)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp size={12} />
                    {formatCount(game.likeCount, i18n.language)}
                  </span>
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.article>
      </div>
    </Link>
  );
}
