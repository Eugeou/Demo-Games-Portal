import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { GENRE_ACCENT, type GameGenre } from "@/domain/constants";
import type { Game } from "@/domain/types";
import GameCard from "./game-card";

type GameSectionProps = {
  title: string;
  href?: string;
  games: Game[];
  size?: "sm" | "md" | "lg";
  genre?: GameGenre;
};

function genreGradient(hex: string) {
  return {
    backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${hex} 22%, transparent) 0%, color-mix(in srgb, ${hex} 8%, transparent) 46%, transparent 100%)`,
  };
}

export default function GameSection({
  title,
  href,
  games,
  size = "md",
  genre,
}: GameSectionProps) {
  if (games.length === 0) {
    return null;
  }

  const accent = genre ? GENRE_ACCENT[genre] : undefined;

  return (
    <section
      className={`space-y-3 overflow-visible ${
        accent ? "rounded-3xl px-4 py-5" : "py-1"
      }`}
      style={accent ? genreGradient(accent) : undefined}
    >
      <div className="flex items-center justify-between">
        {href ? (
          <Link
            to={href}
            className="flex items-center gap-1 text-lg font-bold text-ink hover:text-brand"
          >
            {title}
            <ChevronRight size={18} />
          </Link>
        ) : (
          <h2 className="text-lg font-bold">{title}</h2>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 overflow-visible py-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} size={size} />
        ))}
      </div>
    </section>
  );
}
