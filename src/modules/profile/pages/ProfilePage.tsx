import { coverStyle, resolveAvatar } from "@/domain/constants";
import { useMain } from "@/domain/context/main/use-main";
import { useGamesQueries, useGamesQuery } from "@/domain/services/games";
import {
  resolveLibraryGames,
  useLibraryMutation,
  useLibraryMutations,
  useLibraryQueries,
  useLibraryQuery,
} from "@/domain/services/library";
import {
  useProfileMutation,
  useProfileMutations,
  useProfileQueries,
  useProfileQuery,
} from "@/domain/services/profile";
import { isSignedIn, type Game, type PlayerProfile } from "@/domain/types";
import { JellyRadio, LibraryGameGrid, Loading } from "@/shared-components";
import {
  Bookmark,
  CalendarDays,
  Flame,
  Pencil,
  ThumbsUp,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CoverPicker from "../components/CoverPicker";
import EditProfileDrawer from "../components/EditProfileDrawer";
import TelecomPackageSection from "../components/TelecomPackageSection";

type ProfileTab = "you" | "board" | "saved" | "liked";

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, setUserInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const profileQuery = useProfileQuery(useProfileQueries.getProfile, {
    userId: userInfo.id,
  });
  const updateProfile = useProfileMutation(useProfileMutations.updateProfile);
  const gamesQuery = useGamesQuery(useGamesQueries.listGames);
  const savedQuery = useLibraryQuery(useLibraryQueries.listSaved, {
    userId: userInfo.id,
  });
  const likedQuery = useLibraryQuery(useLibraryQueries.listLiked, {
    userId: userInfo.id,
  });
  const toggleSaved = useLibraryMutation(useLibraryMutations.toggleSaved);
  const toggleLiked = useLibraryMutation(useLibraryMutations.toggleLiked);
  const [editOpen, setEditOpen] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [tab, setTab] = useState<ProfileTab>("you");
  const profile = profileQuery.data;
  const games = gamesQuery.data ?? [];
  const savedGames = useMemo(
    () => resolveLibraryGames(savedQuery.data ?? [], games),
    [games, savedQuery.data]
  );
  const likedGames = useMemo(
    () => resolveLibraryGames(likedQuery.data ?? [], games),
    [games, likedQuery.data]
  );
  const likedCount = likedGames.length;
  const savedCount = savedGames.length;

  useEffect(() => {
    if (!profile || !signedIn) {
      return;
    }
    const avatar = resolveAvatar(profile.avatarUrl);
    if (
      userInfo.displayName === profile.username &&
      userInfo.avatarUrl === avatar
    ) {
      return;
    }
    setUserInfo({
      ...userInfo,
      displayName: profile.username,
      avatarUrl: avatar,
    });
  }, [profile, setUserInfo, signedIn, userInfo]);

  const openLogin = () => {
    navigate(location.pathname, { state: { openLogin: true } });
  };

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

  if (!signedIn) {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl bg-surface p-6 ring-1 ring-line">
          <h1 className="text-2xl font-extrabold">
            {t("common.profileTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {t("common.profileNeedLogin")}
          </p>
          <button
            type="button"
            onClick={openLogin}
            className="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white"
          >
            {t("common.loginTitle")}
          </button>
        </section>
        <TelecomPackageSection />
      </div>
    );
  }

  if (profileQuery.isLoading || !profile) {
    return (
      <div className="space-y-6">
        <Loading />
        <TelecomPackageSection />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="relative -mx-3 overflow-hidden rounded-3xl md:-mx-5">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={coverStyle(profile.coverUrl)}
          />
          <button
            type="button"
            onClick={() => setCoverOpen(true)}
            className="absolute right-4 top-4 z-[1] flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white"
            aria-label={t("common.changeCover")}
          >
            <Pencil size={16} />
          </button>
          <div className="h-40 md:h-56" />
          <div className="relative flex flex-wrap items-end justify-between gap-4 px-4 py-5 md:px-5 bg-black/20">
            <div className="flex items-end gap-4">
              <img
                src={resolveAvatar(profile.avatarUrl)}
                alt={profile.username}
                className="h-24 w-24 md:h-32 md:w-32 rounded-xl md:rounded-2xl border-2 border-brand bg-lift object-cover ring-4 ring-white/25"
              />
              <div className="pb-1">
                <h1 className="text-2xl font-extrabold text-white drop-shadow">
                  {profile.username}
                </h1>
                <p className="text-sm text-white/80">
                  {t(`common.country.${profile.country}`)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                {t("common.friendsCount")} {profile.friendsCount}
              </span>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white"
              >
                {t("common.editProfile")}
              </button>
            </div>
          </div>
        </div>

        <div className="-mx-1 overflow-x-auto">
          <JellyRadio
            value={tab}
            onChange={(next) => setTab(next as ProfileTab)}
            size="md"
            radius={999}
            ariaLabel={t("common.profileTitle")}
            items={[
              { value: "you", label: t("common.youTab") },
              { value: "board", label: t("common.leaderboardTab") },
              { value: "saved", label: t("common.savedTab") },
              { value: "liked", label: t("common.likedTab") },
            ]}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-4 rounded-3xl bg-surface p-4 ring-1 ring-line">
            <h2 className="font-bold">{t("common.profileStats")}</h2>
            <p className="flex items-center gap-2 text-sm">
              <CalendarDays size={16} className="text-muted" />
              {profile.daysOnline} {t("common.daysOnline")}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Bookmark size={16} className="text-muted" />
              {savedCount} {t("common.savedCount")}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <ThumbsUp size={16} className="text-muted" />
              {likedCount} {t("common.likedCount")}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Flame size={16} className="text-brand" />
              {t("common.playStreak")} {profile.playStreak}{" "}
              {t("common.daysOnline")}
            </p>
            <p className="pl-6 text-xs text-muted">
              {t("common.bestStreak")}: {profile.playStreakBest}{" "}
              {t("common.daysOnline")}
            </p>
          </aside>

          <section
            className={`rounded-3xl bg-surface p-6 ring-1 ring-line ${
              tab === "board" ? "text-center" : ""
            }`}
          >
            {tab === "board" ? (
              <>
                <Trophy size={42} className="mx-auto text-brand" />
                <h2 className="mt-4 text-xl font-extrabold">
                  {t("common.leaderboardHint")}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {t("common.leaderboardLead")}
                </p>
                <button
                  type="button"
                  className="mt-5 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white"
                >
                  {t("common.startCompete")}
                </button>
              </>
            ) : tab === "saved" || tab === "liked" ? (
              <LibraryGameGrid
                games={tab === "saved" ? savedGames : likedGames}
                className="grid-cols-2 md:grid-cols-3"
                onRemove={(game: Game) => {
                  const payload = { userId: userInfo.id, gameId: game.id };
                  if (tab === "saved") {
                    void toggleSaved.mutateAsync(payload);
                    return;
                  }
                  void toggleLiked.mutateAsync(payload);
                }}
                empty={
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    {tab === "saved" ? (
                      <Bookmark size={28} className="text-muted" />
                    ) : (
                      <ThumbsUp size={28} className="text-muted" />
                    )}
                    <p className="max-w-sm text-sm leading-6 text-muted">
                      {tab === "saved"
                        ? t("common.librarySavedEmpty")
                        : t("common.libraryLikedEmpty")}
                    </p>
                  </div>
                }
              />
            ) : (
              <div>
                <h2 className="font-bold">{t("common.recentActivity")}</h2>
                <p className="mt-3 text-sm text-muted">
                  {t("common.noActivity")}
                </p>
              </div>
            )}
          </section>
        </div>
        <TelecomPackageSection />
      </div>
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
  );
}
