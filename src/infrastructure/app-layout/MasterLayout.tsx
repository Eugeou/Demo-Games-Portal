import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ClientStorageService from "@/domain/services/client-storage";
import { useGamesQuery, useGamesQueries } from "@/domain/services/games";
import PortalHeader from "./NavigationMenu";
import CategorySidebar from "./CategorySidebar";
import LoginDrawer from "./LoginDrawer";
import LibraryDrawer from "./LibraryDrawer";
import SiteFooter from "./SiteFooter";
import AgeWarning from "./AgeWarning";

const SIDEBAR_KEY = "portal-sidebar-hidden";
const DESKTOP_QUERY = "(min-width: 768px)";
const RAIL_WIDTH = 72;
const MENU_WIDTH = 248;
const HOVER_LEAVE_MS = 120;
const menuEase = [0.22, 1, 0.36, 1] as const;

type Props = {
  children?: ReactNode;
};

function readHidden() {
  return ClientStorageService.getItem<boolean>(SIDEBAR_KEY) === true;
}

const MasterLayout = ({ children }: Props) => {
  const [desktopHidden, setDesktopHidden] = useState(readHidden);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(DESKTOP_QUERY).matches
  );
  const leaveTimer = useRef<number | null>(null);
  const gamesQuery = useGamesQuery(useGamesQueries.listGames);
  const desktopVisible = isDesktop && !desktopHidden;

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const sync = () => {
      setIsDesktop(media.matches);
      if (!media.matches) {
        setHovered(false);
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) {
        window.clearTimeout(leaveTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const state = location.state as {
      openLogin?: boolean;
      openLibrary?: boolean;
    } | null;
    if (!state?.openLogin && !state?.openLibrary) {
      return;
    }
    if (state.openLogin) {
      setAuthOpen(true);
    }
    if (state.openLibrary) {
      setLibraryOpen(true);
    }
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!mobileOpen || isDesktop) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isDesktop, mobileOpen]);

  const toggleMenu = () => {
    if (isDesktop) {
      const next = !desktopHidden;
      setDesktopHidden(next);
      setHovered(false);
      ClientStorageService.setItem(SIDEBAR_KEY, next);
      return;
    }
    setMobileOpen((open) => !open);
  };

  const handleEnter = () => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setHovered(true);
  };

  const handleLeave = () => {
    leaveTimer.current = window.setTimeout(() => {
      setHovered(false);
    }, HOVER_LEAVE_MS);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <PortalHeader
        games={gamesQuery.data ?? []}
        menuHidden={isDesktop ? desktopHidden : !mobileOpen}
        onToggleMenu={toggleMenu}
        onAuthClick={() => setAuthOpen(true)}
        onLibraryClick={() => setLibraryOpen(true)}
      />
      <LoginDrawer open={authOpen} onClose={() => setAuthOpen(false)} />
      <LibraryDrawer open={libraryOpen} onClose={() => setLibraryOpen(false)} />
      <div className="flex min-h-[calc(100dvh-var(--portal-header-height,4rem))]">
        <AnimatePresence initial={false}>
          {desktopVisible ? (
            <motion.div
              key="desktop-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: RAIL_WIDTH, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: menuEase }}
              className="relative shrink-0"
            >
              <motion.aside
                initial={{ x: -24, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  width: hovered ? MENU_WIDTH : RAIL_WIDTH,
                }}
                exit={{ x: -28, opacity: 0 }}
                transition={{ duration: 0.26, ease: menuEase }}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                className={`sticky top-16 z-[90] h-[calc(100dvh-4rem)] min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain border-r border-line bg-canvas [-webkit-overflow-scrolling:touch] ${
                  hovered ? "absolute left-0 top-0 shadow-card" : ""
                }`}
              >
                <CategorySidebar expanded={hovered} />
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {!isDesktop && mobileOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Close menu"
                className="fixed inset-0 z-[80] bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -MENU_WIDTH, opacity: 0.6 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -MENU_WIDTH, opacity: 0 }}
                transition={{ duration: 0.28, ease: menuEase }}
                className="fixed bottom-0 left-0 z-[90] min-h-0 overflow-y-auto overscroll-y-contain bg-surface shadow-card [-webkit-overflow-scrolling:touch]"
                style={{
                  width: MENU_WIDTH,
                  top: "var(--portal-header-height, 8rem)",
                }}
              >
                <CategorySidebar
                  expanded
                  onNavigate={() => setMobileOpen(false)}
                />
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="min-w-0 flex-1 px-3 pb-10 pt-4 md:px-5">
            {children}
          </main>
          <SiteFooter />
        </div>
      </div>
      <AgeWarning />
    </div>
  );
};

export default MasterLayout;
