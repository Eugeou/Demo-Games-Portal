import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DailyClaimPanel } from "@/shared-components";

type DailyClaimModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function DailyClaimModal({ open, onClose }: DailyClaimModalProps) {
  const { t } = useTranslation();

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] m-0 flex items-center justify-center bg-black/70 p-4"
        >
          <button
            type="button"
            className="absolute inset-0 m-0 h-full w-full"
            aria-label={t("common.closeDailyClaim")}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative z-[1] m-0 w-full max-w-[380px] rounded-3xl bg-surface p-5 shadow-card"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-muted"
              aria-label={t("common.closeDailyClaim")}
            >
              <X size={20} />
            </button>
            <h2 className="pr-8 text-xl font-extrabold">{t("common.dailyClaimTitle")}</h2>
            <div className="mt-1">
              <DailyClaimPanel layout="grid" onNeedLogin={onClose} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
