import { useMain } from "@/domain/context/main/use-main";
import {
  useDailyClaimMutation,
  useDailyClaimMutations,
  useDailyClaimQueries,
  useDailyClaimQuery,
} from "@/domain/services/daily-claim";
import {
  isSignedIn,
  type DailyCheckinResult,
  type DailyCheckinReward,
} from "@/domain/types";
import { Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CoinIcon from "./coin-icon";

type DailyClaimPanelProps = {
  layout?: "grid" | "row";
  onNeedLogin?: () => void;
};

function RewardAmounts({ reward }: { reward: DailyCheckinReward }) {
  return (
    <span className="mt-2 flex items-center justify-center gap-1.5 text-lg font-extrabold">
      <CoinIcon className="h-6 w-6" />
      {reward.coinAmount}
    </span>
  );
}

export default function DailyClaimPanel({
  layout = "grid",
  onNeedLogin,
}: DailyClaimPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, setUserInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const configQuery = useDailyClaimQuery(useDailyClaimQueries.getConfig);
  const statusQuery = useDailyClaimQuery(useDailyClaimQueries.getStatus, {
    userId: userInfo.id,
  });
  const claim = useDailyClaimMutation(useDailyClaimMutations.claim);
  const rewards = configQuery.data?.rewards ?? [];
  const currentDay = statusQuery.data?.currentDay ?? 1;
  const claimedToday = Boolean(signedIn && statusQuery.data?.claimedToday);
  const claimedDays = signedIn ? statusQuery.data?.claimedDays ?? [] : [];
  const [result, setResult] = useState<DailyCheckinResult | null>(null);
  const [error, setError] = useState("");

  const openLogin = () => {
    onNeedLogin?.();
    navigate(location.pathname, { state: { openLogin: true } });
  };

  const onClaim = async () => {
    if (!signedIn) {
      openLogin();
      return;
    }
    if (claim.isPending || claimedToday) {
      return;
    }
    setError("");
    try {
      const next = await claim.mutateAsync(userInfo.id);
      setUserInfo({ ...userInfo, coinBalance: next.coinBalance });
      setResult(next);
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "";
      if (code === "ALREADY_CLAIMED") {
        setError(t("common.dailyClaimDone"));
        return;
      }
      if (code === "LOGIN_REQUIRED") {
        openLogin();
        return;
      }
      setError(t("common.dailyClaimError"));
    }
  };

  const dayCard = (reward: DailyCheckinReward) => {
    const isToday = reward.day === currentDay;
    const claimed = claimedDays.includes(reward.day);
    return (
      <div
        key={reward.day}
        className={[
          "relative flex h-[92px] flex-col items-center justify-center rounded-xl md:rounded-2xl px-3 py-3 text-center",
          layout === "row" ? "min-w-[120px] flex-1" : "",
          isToday
            ? "bg-brand/10 ring-2 ring-brand"
            : "bg-lift ring-1 ring-line",
          claimed && !isToday ? "opacity-60" : "",
        ].join(" ")}
      >
        <p className="text-xs font-extrabold uppercase tracking-wide text-muted">
          {isToday
            ? t("common.dailyClaimToday")
            : t("common.dailyClaimDay", { day: reward.day })}
        </p>
        <RewardAmounts reward={reward} />
        {claimed ? (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
            <Check size={10} strokeWidth={3} />
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <div>
      <p className="text-sm font-semibold text-muted">
        {signedIn
          ? claimedToday
            ? t("common.dailyClaimDone")
            : t("common.dailyClaimSubtitle")
          : t("common.dailyClaimNeedLogin")}
      </p>

      {rewards.length === 0 ? (
        <p className="mt-8 text-center text-sm font-semibold text-muted">
          {t("common.dailyClaimLoading")}
        </p>
      ) : layout === "row" ? (
        <div className="mt-5 flex flex-wrap gap-2.5">
          {rewards.map(dayCard)}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {rewards
            .filter((reward) => reward.day < 7)
            .map((reward) => dayCard(reward))}
          {rewards.find((reward) => reward.day === 7) ? (
            <div className="col-span-3">
              {dayCard(rewards.find((reward) => reward.day === 7)!)}
            </div>
          ) : null}
        </div>
      )}

      {error ? (
        <p className="mt-4 text-center text-sm font-semibold text-red-400">
          {error}
        </p>
      ) : result ? (
        <p className="mt-4 flex items-center justify-center gap-2 text-sm font-extrabold text-brand">
          <CoinIcon className="h-6 w-6" />
          {t("common.dailyClaimWin", { amount: result.coinAmount })}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => {
          void onClaim();
        }}
        disabled={claim.isPending || (signedIn && claimedToday)}
        className="mt-5 w-full rounded-full bg-brand py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {!signedIn
          ? t("common.loginTitle")
          : claim.isPending
          ? t("common.dailyClaimClaiming")
          : claimedToday
          ? t("common.dailyClaimDone")
          : t("common.dailyClaimAction")}
      </button>
    </div>
  );
}
