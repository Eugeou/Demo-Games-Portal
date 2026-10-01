import {
  isAppLanguage,
  languageLabels,
  languages,
  persistLanguage,
  type AppLanguage,
} from "@/locales";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const current: AppLanguage = isAppLanguage(i18n.language)
    ? i18n.language
    : "vi";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const switchTo = (language: AppLanguage) => {
    setOpen(false);
    if (language === current) {
      return;
    }
    void i18n.changeLanguage(language);
    persistLanguage(language);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("common.switchLanguage")}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-1 rounded-full bg-lift px-3 text-xs font-bold uppercase text-ink transition hover:bg-line"
      >
        {current}
        <ChevronDown
          size={14}
          className={`text-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-10 mt-2 min-w-[10.5rem] overflow-hidden rounded-xl md:rounded-2xl bg-surface p-1 shadow-card ring-1 ring-line"
          >
            {languages.map((language) => {
              const active = language === current;
              return (
                <li key={language}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => switchTo(language)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-lift ${
                      active
                        ? "font-semibold text-ink"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <span>{languageLabels[language]}</span>
                    {active ? <Check size={14} className="text-brand" /> : null}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
