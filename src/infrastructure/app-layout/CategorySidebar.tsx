import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import {
  Car,
  Compass,
  Flame,
  Gamepad2,
  Home,
  Joystick,
  MousePointerClick,
  Puzzle,
  Sparkles,
  Swords,
  Ticket,
  Trophy,
  UserRound,
} from "lucide-react";
import { GAME_GENRES, type GameGenre } from "@/domain/constants";
import { routePaths } from "@/routes/route-path";

const primaryLinks = [
  { icon: Home, key: "navHome", href: routePaths.home },
  { icon: Compass, key: "navCatalog", href: routePaths.catalog },
  { icon: Sparkles, key: "navNews", href: routePaths.news },
  { icon: Trophy, key: "navRewards", href: routePaths.rewards },
  { icon: Ticket, key: "navGiftCode", href: routePaths.giftCode },
  { icon: UserRound, key: "navProfile", href: routePaths.profile },
];

const genreIcons: Record<GameGenre, typeof Gamepad2> = {
  arcade: Joystick,
  puzzle: Puzzle,
  action: Swords,
  io: Gamepad2,
  racing: Car,
  simulation: Gamepad2,
  strategy: Compass,
  sports: Flame,
  clicker: MousePointerClick,
  adventure: Sparkles,
};

const labelMotion = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
};

type CategorySidebarProps = {
  expanded: boolean;
  onNavigate?: () => void;
};

export default function CategorySidebar({
  expanded,
  onNavigate,
}: CategorySidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="flex flex-col gap-5 p-3 pb-10">
      <div className="space-y-1">
        {primaryLinks.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              title={t(`common.${item.key}`)}
              className={`flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors hover:bg-lift ${
                expanded ? "gap-3 px-3" : "justify-center px-0"
              } ${active ? "bg-lift text-ink" : "text-ink"}`}
            >
              <Icon size={18} className="shrink-0" />
              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.span
                    key={item.key}
                    {...labelMotion}
                    className="truncate"
                  >
                    {t(`common.${item.key}`)}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      <div>
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.p
              key="genres-title"
              {...labelMotion}
              className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted"
            >
              {t("common.genresTitle")}
            </motion.p>
          ) : null}
        </AnimatePresence>
        <div className="space-y-1">
          {GAME_GENRES.map((genre) => {
            const Icon = genreIcons[genre];
            const href = `${routePaths.catalog}?genre=${genre}`;
            const active = location.search === `?genre=${genre}`;
            return (
              <Link
                key={genre}
                to={href}
                onClick={onNavigate}
                title={t(`common.genre.${genre}`)}
                className={`flex items-center rounded-xl py-2 text-sm transition-colors hover:bg-lift ${
                  expanded ? "gap-3 px-3" : "justify-center px-0"
                } ${active ? "bg-lift text-ink" : "text-ink"}`}
              >
                <Icon size={16} className="shrink-0" />
                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.span key={genre} {...labelMotion} className="truncate">
                      {t(`common.genre.${genre}`)}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
