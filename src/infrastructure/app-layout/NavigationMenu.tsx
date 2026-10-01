import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Menu, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BrandLogo, LanguageToggle, SearchBar, ThemeToggle } from "@/shared-components";
import { resolveAvatar } from "@/domain/constants";
import { useMain } from "@/domain/context/main/use-main";
import { isSignedIn } from "@/domain/types";
import { routePaths } from "@/routes/route-path";
import type { Game } from "@/domain/types";

type PortalHeaderProps = {
  games: Game[];
  menuHidden: boolean;
  onToggleMenu: () => void;
  onAuthClick: () => void;
  onLibraryClick: () => void;
};

export default function PortalHeader({
  games,
  menuHidden,
  onToggleMenu,
  onAuthClick,
  onLibraryClick,
}: PortalHeaderProps) {
  const { t } = useTranslation();
  const { userInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }
    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--portal-header-height",
        `${header.offsetHeight}px`
      );
    };
    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[100] border-b border-line bg-canvas/90 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 px-3 py-3 md:gap-3 md:px-5">
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label={menuHidden ? t("common.expandMenu") : t("common.collapseMenu")}
          aria-pressed={!menuHidden}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lift text-ink transition hover:bg-line"
        >
          <Menu size={20} />
        </button>
        <Link to={routePaths.home} className="flex h-6 min-w-0 shrink items-center md:h-8 md:shrink-0" aria-label="DND">
          <BrandLogo className="h-6 max-w-[7.5rem] md:h-8 md:max-w-none" />
        </Link>
        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar games={games} />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={onLibraryClick}
            aria-label={t("common.openLibrary")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-lift text-ink transition hover:bg-line"
          >
            <Bookmark size={16} />
          </button>
          <button
            type="button"
            onClick={onAuthClick}
            className="flex min-h-10 items-center gap-2 rounded-full bg-lift px-3 py-2 text-sm font-semibold text-ink transition hover:bg-line"
          >
            {signedIn ? (
              <img
                src={resolveAvatar(userInfo.avatarUrl)}
                alt=""
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <UserRound size={16} />
            )}
            <span className="hidden max-w-[7rem] truncate sm:inline">
              {signedIn ? userInfo.displayName : t("common.loginTitle")}
            </span>
          </button>
        </div>
      </div>
      <div className="px-3 pb-3 md:hidden">
        <SearchBar games={games} />
      </div>
    </header>
  );
}
