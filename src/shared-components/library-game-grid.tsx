import type { Game } from "@/domain/types";
import { playPath } from "@/routes/route-path";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type LibraryGameGridProps = {
  games: Game[];
  empty: ReactNode;
  onRemove?: (game: Game) => void;
  onItemClick?: () => void;
  className?: string;
};

export default function LibraryGameGrid({
  games,
  empty,
  onRemove,
  onItemClick,
  className = "grid-cols-2",
}: LibraryGameGridProps) {
  const { t } = useTranslation();

  if (games.length === 0) {
    return <>{empty}</>;
  }

  return (
    <div className={`grid gap-3 ${className}`}>
      {games.map((game) => (
        <div key={game.id} className="relative">
          <Link
            to={playPath(game.slug)}
            onClick={onItemClick}
            className="block overflow-hidden rounded-xl md:rounded-2xl bg-lift"
          >
            <img
              src={game.thumbnailUrl}
              alt={game.name}
              className="aspect-video w-full object-cover"
            />
            <p className="truncate px-2 py-1.5 text-xs font-semibold text-ink">
              {game.name}
            </p>
          </Link>
          {onRemove ? (
            <button
              type="button"
              onClick={() => onRemove(game)}
              aria-label={t("common.removeFromLibrary")}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white"
            >
              <X size={12} />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
