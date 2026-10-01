import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Clock3, ThumbsUp, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMain } from "@/domain/context/main/use-main";
import { useGamesQuery, useGamesQueries } from "@/domain/services/games";
import {
  resolveLibraryGames,
  useLibraryMutation,
  useLibraryMutations,
  useLibraryQueries,
  useLibraryQuery,
} from "@/domain/services/library";
import { isSignedIn, type Game } from "@/domain/types";
import { LibraryGameGrid } from "@/shared-components";

type LibraryTab = "saved" | "recent" | "liked";

type LibraryDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const TABS: LibraryTab[] = ["saved", "recent", "liked"];
const drawerEase = [0.22, 1, 0.36, 1] as const;

export default function LibraryDrawer({ open, onClose }: LibraryDrawerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const [tab, setTab] = useState<LibraryTab>("saved");
  const [direction, setDirection] = useState(0);
  const gamesQuery = useGamesQuery(useGamesQueries.listGames);
  const savedQuery = useLibraryQuery(useLibraryQueries.listSaved, {
    userId: userInfo.id,
  });
  const likedQuery = useLibraryQuery(useLibraryQueries.listLiked, {
    userId: userInfo.id,
  });
  const recentQuery = useLibraryQuery(useLibraryQueries.listRecent);
  const toggleSaved = useLibraryMutation(useLibraryMutations.toggleSaved);
  const toggleLiked = useLibraryMutation(useLibraryMutations.toggleLiked);
  const removeRecent = useLibraryMutation(useLibraryMutations.removeRecent);
  const games = gamesQuery.data ?? [];

  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const items = useMemo(() => {
    if (tab === "saved") {
      return resolveLibraryGames(savedQuery.data ?? [], games);
    }
    if (tab === "liked") {
      return resolveLibraryGames(likedQuery.data ?? [], games);
    }
    return resolveLibraryGames(recentQuery.data ?? [], games);
  }, [games, likedQuery.data, recentQuery.data, savedQuery.data, tab]);

  const selectTab = (next: LibraryTab) => {
    if (next === tab) {
      return;
    }
    setDirection(TABS.indexOf(next) > TABS.indexOf(tab) ? 1 : -1);
    setTab(next);
  };

  const needsLogin = (tab === "saved" || tab === "liked") && !signedIn;

  const openLogin = () => {
    onClose();
    navigate(location.pathname, { state: { openLogin: true } });
  };

  const removeItem = (game: Game) => {
    if (tab === "recent") {
      void removeRecent.mutateAsync(game.id);
      return;
    }
    if (!signedIn) {
      openLogin();
      return;
    }
    if (tab === "saved") {
      void toggleSaved.mutateAsync({ userId: userInfo.id, gameId: game.id });
      return;
    }
    void toggleLiked.mutateAsync({ userId: userInfo.id, gameId: game.id });
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[110] m-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label={t("common.closeLibrary")}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.24, ease: drawerEase }}
            className="fixed inset-y-0 right-0 z-[120] m-0 flex w-full max-w-[400px] flex-col bg-surface shadow-card"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-lg font-extrabold">{t("common.myGames")}</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-lift"
                aria-label={t("common.closeLibrary")}
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-1 border-b border-line px-3">
              {(
                [
                  ["saved", "librarySaved"],
                  ["recent", "libraryRecent"],
                  ["liked", "libraryLiked"],
                ] as const
              ).map(([id, key]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectTab(id)}
                  className={`relative flex-1 px-2 py-3 text-sm font-semibold transition-colors duration-200 ${
                    tab === id ? "text-ink" : "text-muted"
                  }`}
                >
                  {t(`common.${key}`)}
                  {tab === id ? (
                    <motion.span
                      layoutId="library-tab-underline"
                      className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-brand"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={tab}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -28 }}
                  transition={{ duration: 0.22, ease: drawerEase }}
                  className="h-full overflow-y-auto px-5 py-6"
                >
                  {needsLogin ? (
                    <div className="flex flex-col items-center gap-4 pt-10 text-center">
                      {tab === "saved" ? (
                        <Bookmark size={28} className="text-muted" />
                      ) : (
                        <ThumbsUp size={28} className="text-muted" />
                      )}
                      <p className="max-w-xs text-sm leading-6 text-muted">
                        {tab === "saved"
                          ? t("common.librarySavedHint")
                          : t("common.libraryLikedHint")}
                      </p>
                      <button
                        type="button"
                        onClick={openLogin}
                        className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white"
                      >
                        {t("common.loginTitle")}
                      </button>
                    </div>
                  ) : (
                    <LibraryGameGrid
                      games={items}
                      onRemove={removeItem}
                      onItemClick={onClose}
                      empty={
                        <div className="flex flex-col items-center gap-4 pt-10 text-center">
                          {tab === "saved" ? (
                            <Bookmark size={28} className="text-muted" />
                          ) : tab === "liked" ? (
                            <ThumbsUp size={28} className="text-muted" />
                          ) : (
                            <Clock3 size={28} className="text-muted" />
                          )}
                          <p className="max-w-xs text-sm leading-6 text-muted">
                            {tab === "saved"
                              ? t("common.librarySavedEmpty")
                              : tab === "liked"
                                ? t("common.libraryLikedEmpty")
                                : t("common.libraryRecentEmpty")}
                          </p>
                        </div>
                      }
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
