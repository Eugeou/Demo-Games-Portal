import type { Game } from "@/domain/types";
import { playPath } from "@/routes/route-path";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type SearchBarProps = {
  games: Game[];
};

export default function SearchBar({ games }: SearchBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [];
    }
    return games
      .filter((game) => game.name.toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [games, query]);

  return (
    <div className="relative w-full max-w-xl">
      <label className="flex items-center gap-2 rounded-full bg-lift px-4 py-2.5 ring-1 ring-line focus-within:ring-2 focus-within:ring-brand">
        <Search size={18} className="shrink-0 text-muted" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
          placeholder={t("common.searchPlaceholder")}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
        />
      </label>
      <AnimatePresence>
        {open && query.trim() ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl md:rounded-2xl bg-surface p-2 shadow-card ring-1 ring-line"
          >
            {results.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted">
                {t("common.searchEmpty")}
              </p>
            ) : (
              results.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onMouseDown={() => {
                    navigate(playPath(game.slug));
                    setQuery("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-lift"
                >
                  <img
                    src={game.thumbnailUrl}
                    alt=""
                    className="h-10 w-14 rounded-lg object-cover"
                  />
                  <span className="text-sm font-semibold">{game.name}</span>
                </button>
              ))
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
