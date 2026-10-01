import { CONTACT_EMAIL, resolveAvatar } from "@/domain/constants";
import { useMain } from "@/domain/context/main/use-main";
import { useTheme } from "@/domain/context/theme/use-theme";
import {
  MOCK_OTP,
  useAuthMutation,
  useAuthMutations,
} from "@/domain/services/auth";
import {
  useProfileMutation,
  useProfileMutations,
  useProfileQueries,
  useProfileQuery,
} from "@/domain/services/profile";
import { emptyUser, isSignedIn, type PlayerProfile } from "@/domain/types";
import CoverPicker from "@/modules/profile/components/CoverPicker";
import EditProfileDrawer from "@/modules/profile/components/EditProfileDrawer";
import { routePaths } from "@/routes/route-path";
import { CoinIcon } from "@/shared-components";
import CodeSlots, {
  type CodeSlotsStatus,
} from "@/shared-components/code-slots";
import { AnimatePresence, motion } from "framer-motion";
import {
  ClipboardList,
  FileText,
  IdCard,
  Info,
  LogOut,
  Mail,
  Newspaper,
  Pencil,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type LoginDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const drawerEase = [0.22, 1, 0.36, 1] as const;

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export default function LoginDrawer({ open, onClose }: LoginDrawerProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { userInfo, setUserInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const requestOtp = useAuthMutation(useAuthMutations.requestOtp);
  const verifyOtp = useAuthMutation(useAuthMutations.verifyOtp);
  const logout = useAuthMutation(useAuthMutations.logout);
  const [phone, setPhone] = useState("");
  const [requestId, setRequestId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState<CodeSlotsStatus>("idle");
  const [editOpen, setEditOpen] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const dark = theme === "dark";
  const profileQuery = useProfileQuery(useProfileQueries.getProfile, {
    userId: userInfo.id,
  });
  const updateProfile = useProfileMutation(useProfileMutations.updateProfile);
  const profile = profileQuery.data;

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

  useEffect(() => {
    if (open) {
      return;
    }
    setRequestId("");
    setOtp("");
    setOtpStatus("idle");
    setEditOpen(false);
    setCoverOpen(false);
    setAgreed(true);
  }, [open]);

  const saveProfile = async (next: PlayerProfile) => {
    const saved = await updateProfile.mutateAsync({
      userId: userInfo.id,
      username: next.username,
      country: next.country,
      birthday: next.birthday,
      gender: next.gender,
      avatarUrl: next.avatarUrl,
      coverUrl: next.coverUrl,
    });
    setUserInfo({
      ...userInfo,
      displayName: saved.username,
      avatarUrl: resolveAvatar(saved.avatarUrl),
    });
    setEditOpen(false);
    setCoverOpen(false);
  };

  const sendOtp = async () => {
    const nextPhone = normalizePhone(phone);
    if (!agreed || nextPhone.length < 9) {
      return;
    }
    try {
      const result = await requestOtp.mutateAsync({ phone: nextPhone });
      setPhone(nextPhone);
      setRequestId(result.requestId);
      setOtp("");
      setOtpStatus("idle");
    } catch {
      return;
    }
  };

  const completeOtp = async (code: string) => {
    if (!agreed || otpStatus === "success") {
      return;
    }
    try {
      const user = await verifyOtp.mutateAsync({
        phone: normalizePhone(phone),
        otp: code,
        requestId,
      });
      setOtpStatus("success");
      setUserInfo(user);
      window.setTimeout(onClose, 700);
    } catch {
      setOtpStatus("error");
    }
  };

  const signOut = async () => {
    try {
      await logout.mutateAsync(undefined as never);
    } catch {
      // Mock logout still clears the local session.
    }
    setUserInfo(emptyUser);
    setPhone("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label={t("common.closeLogin")}
            className="fixed inset-0 z-[110] m-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal
            aria-labelledby="login-drawer-title"
            initial={{ x: 28, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 28, opacity: 0 }}
            transition={{ duration: 0.28, ease: drawerEase }}
            className="fixed inset-y-0 right-0 z-[120] m-0 flex w-full max-w-[400px] flex-col bg-surface shadow-card"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 id="login-drawer-title" className="text-lg font-extrabold">
                {signedIn ? t("common.profileTitle") : t("common.loginTitle")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("common.closeLogin")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-lift text-ink transition hover:bg-line"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              {signedIn ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-2 pt-2 text-center">
                    <img
                      src={resolveAvatar(userInfo.avatarUrl)}
                      alt=""
                      className="h-20 w-20 rounded-full bg-lift object-cover ring-2 ring-brand"
                    />
                    <p className="text-xl font-extrabold">
                      @{userInfo.displayName}
                    </p>
                    <p className="text-sm text-muted">{userInfo.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={routePaths.profile}
                      onClick={onClose}
                      className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-bold text-white"
                    >
                      <UserRound size={16} />
                      {t("common.viewProfile")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setEditOpen(true)}
                      disabled={!profile}
                      aria-label={t("common.editProfile")}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lift text-ink transition hover:bg-line disabled:opacity-50"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={signOut}
                      aria-label={t("common.logout")}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lift text-ink transition hover:bg-line"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <CoinIcon className="h-6 w-6" alt="" />
                    <span>
                      {t("common.coinBalance")}: {userInfo.coinBalance}
                    </span>
                  </p>
                  <AccountLinks onNavigate={onClose} />
                </div>
              ) : requestId ? (
                <div className="space-y-5">
                  <p className="text-sm leading-6 text-muted">
                    {t("common.otpSent", { phone })}
                  </p>
                  <div className="flex justify-center pt-2">
                    <CodeSlots
                      length={6}
                      value={otp}
                      status={otpStatus}
                      disabled={!agreed || verifyOtp.isPending}
                      autoFocus
                      accentColor="#0095FF"
                      inkColor={dark ? "#f4f6fa" : "#111318"}
                      slotColor={dark ? "#202026" : "#eceff5"}
                      digitColor="#ffffff"
                      ariaLabel={t("common.otpLabel")}
                      onChange={(code) => {
                        setOtp(code);
                        if (otpStatus === "error") {
                          setOtpStatus("idle");
                        }
                      }}
                      onComplete={completeOtp}
                    />
                  </div>
                  <p className="text-center text-xs text-muted">
                    {t("common.otpHint", { otp: MOCK_OTP })}
                  </p>
                  {otpStatus === "error" ? (
                    <p className="text-center text-sm text-red-500">
                      {t("common.otpError")}
                    </p>
                  ) : null}
                  <LoginAgreeCheckbox
                    agreed={agreed}
                    onChange={setAgreed}
                    onNavigate={onClose}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setRequestId("");
                      setOtp("");
                      setOtpStatus("idle");
                    }}
                    className="w-full text-sm font-semibold text-brand"
                  >
                    {t("common.changePhone")}
                  </button>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendOtp();
                  }}
                >
                  <p className="text-sm leading-6 text-muted">
                    {t("common.loginSubtitle")}
                  </p>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">
                      {t("common.phoneLabel")}
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder={t("common.phonePlaceholder")}
                      className="w-full rounded-xl md:rounded-2xl bg-lift px-4 py-3 text-sm outline-none ring-1 ring-line focus:ring-2 focus:ring-brand"
                    />
                  </label>
                  <LoginAgreeCheckbox
                    agreed={agreed}
                    onChange={setAgreed}
                    onNavigate={onClose}
                  />
                  <button
                    type="submit"
                    disabled={
                      !agreed ||
                      normalizePhone(phone).length < 9 ||
                      requestOtp.isPending
                    }
                    className="w-full rounded-full bg-brand px-4 py-3 text-sm font-bold text-white transition disabled:opacity-50"
                  >
                    {requestOtp.isPending
                      ? t("common.sendingOtp")
                      : t("common.sendOtp")}
                  </button>
                </form>
              )}
              {!signedIn ? (
                <div className="mt-8 border-t border-line pt-5">
                  <AccountLinks onNavigate={onClose} />
                </div>
              ) : null}
            </div>
          </motion.aside>
          {profile ? (
            <>
              <EditProfileDrawer
                open={editOpen}
                profile={profile}
                saving={updateProfile.isPending}
                onClose={() => setEditOpen(false)}
                onChangeCover={() => setCoverOpen(true)}
                onSave={(next) => {
                  void saveProfile(next);
                }}
              />
              <CoverPicker
                open={coverOpen}
                current={profile.coverUrl}
                onClose={() => setCoverOpen(false)}
                onSelect={(coverUrl) => {
                  void saveProfile({ ...profile, coverUrl });
                }}
              />
            </>
          ) : null}
        </>
      ) : null}
    </AnimatePresence>
  );
}

function LoginAgreeCheckbox({
  agreed,
  onChange,
  onNavigate,
}: {
  agreed: boolean;
  onChange: (value: boolean) => void;
  onNavigate: () => void;
}) {
  return (
    <label className="flex items-start gap-2.5 text-sm leading-5 text-ink">
      <input
        type="checkbox"
        checked={agreed}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#0095FF]"
      />
      <span>
        <Trans
          i18nKey="common.loginAgree"
          components={{
            terms: (
              <Link
                to={routePaths.terms}
                onClick={onNavigate}
                className="font-semibold text-brand hover:underline"
              />
            ),
            privacy: (
              <Link
                to={routePaths.privacy}
                onClick={onNavigate}
                className="font-semibold text-brand hover:underline"
              />
            ),
          }}
        />
      </span>
    </label>
  );
}

function AccountLinks({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useTranslation();
  const links = [
    { to: routePaths.news, label: t("common.footerNews"), icon: Newspaper },
    {
      to: routePaths.registration,
      label: t("common.footerRegistration"),
      icon: ClipboardList,
    },
    { to: routePaths.terms, label: t("common.footerTerms"), icon: FileText },
    { to: routePaths.privacy, label: t("common.footerPrivacy"), icon: Shield },
    {
      to: routePaths.personalData,
      label: t("common.footerPersonalData"),
      icon: IdCard,
    },
    { to: routePaths.about, label: t("common.footerAbout"), icon: Info },
  ];

  return (
    <nav className="space-y-1 border-t border-line pt-4">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold text-ink transition hover:bg-lift"
          >
            <Icon size={16} className="text-muted" />
            {link.label}
          </Link>
        );
      })}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold text-ink transition hover:bg-lift"
      >
        <Mail size={16} className="text-muted" />
        <span className="min-w-0">
          <span className="block">{t("common.footerContact")}</span>
          <span className="block truncate text-xs font-normal text-muted">
            {CONTACT_EMAIL}
          </span>
        </span>
      </a>
    </nav>
  );
}
