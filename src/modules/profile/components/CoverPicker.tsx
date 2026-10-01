import { PROFILE_COVER_PRESETS, coverStyle } from "@/domain/constants";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

type CoverPickerProps = {
  open: boolean;
  current: string;
  onClose: () => void;
  onSelect: (coverUrl: string) => void;
};

const drawerEase = [0.22, 1, 0.36, 1] as const;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function CoverPicker({
  open,
  current,
  onClose,
  onSelect,
}: CoverPickerProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[130] m-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label={t("common.changeCover")}
          />
          <motion.aside
            role="dialog"
            aria-modal
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.24, ease: drawerEase }}
            className="fixed inset-y-0 right-0 z-[140] m-0 flex w-full max-w-[380px] flex-col bg-surface shadow-card"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-extrabold">
                {t("common.changeCover")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-lift"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {PROFILE_COVER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onSelect(preset.url);
                    onClose();
                  }}
                  className={`h-24 w-full overflow-hidden rounded-xl md:rounded-2xl bg-cover bg-center ring-2 transition ${
                    current === preset.url
                      ? "ring-brand"
                      : "ring-transparent hover:ring-line"
                  }`}
                  style={coverStyle(preset.url)}
                />
              ))}
              <label className="flex h-12 cursor-pointer items-center justify-center rounded-xl md:rounded-2xl bg-lift text-sm font-semibold ring-1 ring-line">
                {t("common.uploadCover")}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    const url = await readFileAsDataUrl(file);
                    onSelect(url);
                    onClose();
                  }}
                />
              </label>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
