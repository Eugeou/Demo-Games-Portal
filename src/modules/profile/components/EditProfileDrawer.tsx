import {
  DEFAULT_AVATAR,
  PROFILE_COUNTRIES,
  coverStyle,
  resolveAvatar,
} from "@/domain/constants";
import type { PlayerProfile, ProfileGender } from "@/domain/types";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type EditProfileDrawerProps = {
  open: boolean;
  profile: PlayerProfile;
  saving?: boolean;
  onClose: () => void;
  onChangeCover: () => void;
  onSave: (next: PlayerProfile) => void;
};

const drawerEase = [0.22, 1, 0.36, 1] as const;
const genders: ProfileGender[] = ["unspecified", "male", "female", "other"];

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function EditProfileDrawer({
  open,
  profile,
  saving,
  onClose,
  onChangeCover,
  onSave,
}: EditProfileDrawerProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    if (open) {
      setDraft(profile);
    }
  }, [open, profile]);

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
            aria-label={t("common.editProfile")}
          />
          <motion.aside
            role="dialog"
            aria-modal
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.24, ease: drawerEase }}
            className="fixed inset-y-0 right-0 z-[140] m-0 flex w-full max-w-[400px] flex-col bg-surface shadow-card"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-extrabold">
                {t("common.editProfile")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-lift"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <div className="relative pb-8">
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
                  <div
                    className="h-28 bg-cover bg-center"
                    style={coverStyle(draft.coverUrl)}
                  />
                  <button
                    type="button"
                    onClick={onChangeCover}
                    className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white"
                    aria-label={t("common.changeCover")}
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <label className="absolute left-5 top-20 cursor-pointer">
                  <img
                    src={resolveAvatar(draft.avatarUrl)}
                    alt=""
                    className="h-16 w-16 rounded-xl md:rounded-2xl bg-lift object-cover ring-4 ring-surface"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
                    <Camera size={12} />
                  </span>
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
                      setDraft((current) => ({ ...current, avatarUrl: url }));
                    }}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold">
                    {t("common.usernameLabel")}
                  </span>
                  <input
                    value={draft.username}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        username: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl md:rounded-2xl bg-lift px-4 py-3 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-brand"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold">
                    {t("common.countryLabel")}
                  </span>
                  <select
                    value={draft.country}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        country: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl md:rounded-2xl bg-lift px-4 py-3 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-brand"
                  >
                    {PROFILE_COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {t(`common.country.${country}`)}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="text-xs text-muted">
                  {t("common.personalInfoHint")}
                </p>
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold">
                    {t("common.birthdayLabel")}
                  </span>
                  <input
                    type="date"
                    value={draft.birthday}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        birthday: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl md:rounded-2xl bg-lift px-4 py-3 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-brand"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold">
                    {t("common.genderLabel")}
                  </span>
                  <select
                    value={draft.gender}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        gender: event.target.value as ProfileGender,
                      }))
                    }
                    className="w-full rounded-xl md:rounded-2xl bg-lift px-4 py-3 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-brand"
                  >
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {t(`common.gender.${gender}`)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="border-t border-line p-4">
              <button
                type="button"
                disabled={saving || !draft.username.trim()}
                onClick={() =>
                  onSave({
                    ...draft,
                    username: draft.username.trim() || profile.username,
                    avatarUrl: draft.avatarUrl || DEFAULT_AVATAR,
                  })
                }
                className="w-full rounded-full bg-brand px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {saving ? t("common.savingProfile") : t("common.saveProfile")}
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
