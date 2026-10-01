import { useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_BANNER_INTERVAL_MS } from "@/domain/constants";
import { useBannersQueries, useBannersQuery } from "@/domain/services/banners";
import type { HeroBanner } from "@/domain/types";
import { useTranslation } from "react-i18next";

function isExternalLink(url: string) {
  return /^https?:\/\//i.test(url);
}

function BannerMedia({ banner }: { banner: HeroBanner }) {
  if (banner.mediaType === "video") {
    return (
      <video
        src={banner.mediaUrl}
        poster={banner.posterUrl}
        autoPlay
        muted
        loop
        playsInline
        draggable={false}
        className="pointer-events-none h-full w-full object-cover"
      />
    );
  }
  return (
    <img
      src={banner.mediaUrl}
      alt={banner.title}
      draggable={false}
      className="pointer-events-none h-full w-full object-cover"
    />
  );
}

function BannerLink({
  banner,
  children,
  onClick,
}: {
  banner: HeroBanner;
  children: ReactNode;
  onClick: (event: MouseEvent) => void;
}) {
  const className = "block h-full w-full";
  if (isExternalLink(banner.linkUrl)) {
    return (
      <a
        href={banner.linkUrl}
        target="_blank"
        rel="noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={banner.linkUrl} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export default function HeroBannerSlider() {
  const { t } = useTranslation();
  const bannersQuery = useBannersQuery(useBannersQueries.listBanners);
  const banners: HeroBanner[] = bannersQuery.data ?? [];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const slideWidth = () => scrollerRef.current?.clientWidth ?? 0;

  const scrollToIndex = (next: number, behavior: ScrollBehavior = "smooth") => {
    const scroller = scrollerRef.current;
    if (!scroller || banners.length === 0) {
      return;
    }
    const wrapped = ((next % banners.length) + banners.length) % banners.length;
    scroller.scrollTo({ left: wrapped * scroller.clientWidth, behavior });
    setIndex(wrapped);
  };

  useEffect(() => {
    if (banners.length < 2) {
      return;
    }
    const timer = window.setInterval(() => {
      if (paused.current || dragging.current) {
        return;
      }
      setIndex((current) => {
        const next = (current + 1) % banners.length;
        const scroller = scrollerRef.current;
        scroller?.scrollTo({
          left: next * (scroller.clientWidth || 0),
          behavior: "smooth",
        });
        return next;
      });
    }, HERO_BANNER_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  const syncIndexFromScroll = () => {
    const scroller = scrollerRef.current;
    const width = slideWidth();
    if (!scroller || width === 0) {
      return;
    }
    setIndex(Math.round(scroller.scrollLeft / width));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    paused.current = true;
    dragging.current = false;
    startX.current = event.clientX;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.buttons === 0 && event.pointerType === "mouse") {
      return;
    }
    if (Math.abs(event.clientX - startX.current) > 8) {
      dragging.current = true;
    }
  };

  const onPointerUp = () => {
    window.setTimeout(() => {
      dragging.current = false;
      paused.current = false;
    }, 80);
  };

  const preventClickAfterDrag = (event: MouseEvent) => {
    if (dragging.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  if (bannersQuery.isLoading || banners.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-lift shadow-card"
      onMouseEnter={() => {
        paused.current = true;
        setHovered(true);
      }}
      onMouseLeave={() => {
        paused.current = false;
        setHovered(false);
      }}
    >
      <div
        ref={scrollerRef}
        onScroll={syncIndexFromScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="scrollbar-none relative flex aspect-[16/7] min-h-[160px] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden touch-pan-x md:aspect-[21/8]"
      >
        {banners.map((item) => (
          <div key={item.id} className="h-full min-w-full shrink-0 snap-center">
            <BannerLink banner={item} onClick={preventClickAfterDrag}>
              <BannerMedia banner={item} />
            </BannerLink>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {hovered && banners.length > 1 ? (
          <>
            <motion.button
              type="button"
              key="prev"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              aria-label={t("common.scrollPrev")}
              onClick={() => scrollToIndex(index - 1)}
              className="absolute left-2 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-card backdrop-blur-sm transition hover:bg-black"
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
              onClick={() => scrollToIndex(index + 1)}
              className="absolute right-2 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-card backdrop-blur-sm transition hover:bg-black"
            >
              <ChevronRight size={22} />
            </motion.button>
          </>
        ) : null}
      </AnimatePresence>

      {banners.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-40 flex justify-center gap-1.5">
          {banners.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={t("common.heroBannerGoTo", { index: itemIndex + 1 })}
              onClick={() => scrollToIndex(itemIndex)}
              className={`pointer-events-auto h-1.5 rounded-full transition ${
                itemIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
