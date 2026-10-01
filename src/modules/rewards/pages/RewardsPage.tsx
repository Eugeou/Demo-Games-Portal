import { useMain } from "@/domain/context/main/use-main";
import {
  useDailyClaimQueries,
  useDailyClaimQuery,
} from "@/domain/services/daily-claim";
import { isSignedIn } from "@/domain/types";
import { routePaths } from "@/routes/route-path";
import { CoinIcon, DailyClaimPanel } from "@/shared-components";
import { Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function formatDateTime(value: string, language: string) {
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function RewardsPage() {
  const { t, i18n } = useTranslation();
  const { userInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const historyQuery = useDailyClaimQuery(useDailyClaimQueries.listHistory, {
    userId: userInfo.id,
  });
  const history = signedIn ? historyQuery.data ?? [] : [];

  return (
    <section className="space-y-8 pb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {t("common.rewardsTitle")}
        </h1>
        <p className="mt-1 text-sm font-semibold text-muted">
          {t("common.rewardsSubtitle")}
        </p>
      </div>

      <Link
        to={routePaths.giftCode}
        className="flex items-center justify-between gap-3 rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line transition hover:ring-brand"
      >
        <div>
          <h2 className="text-xl font-extrabold">
            {t("common.giftCodeTitle")}
          </h2>
          <p className="mt-1 text-sm font-semibold text-muted">
            {t("common.giftCodeSubtitle")}
          </p>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-brand/10 text-brand">
          <Ticket size={22} />
        </span>
      </Link>

      <div className="rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line">
        <h2 className="text-xl font-extrabold">
          {t("common.dailyClaimTitle")}
        </h2>
        <div className="mt-1">
          <DailyClaimPanel layout="row" />
        </div>
      </div>

      <div className="rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line">
        <h2 className="text-xl font-extrabold">
          {t("common.claimHistoryTitle")}
        </h2>
        {!signedIn ? (
          <p className="mt-4 text-sm font-semibold text-muted">
            {t("common.dailyClaimNeedLogin")}
          </p>
        ) : historyQuery.isLoading ? (
          <p className="mt-4 text-sm font-semibold text-muted">
            {t("common.dailyClaimLoading")}
          </p>
        ) : history.length === 0 ? (
          <p className="mt-4 text-sm font-semibold text-muted">
            {t("common.claimHistoryEmpty")}
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-xs font-extrabold uppercase tracking-wide text-muted">
                  <th className="border-b border-line px-3 py-2">
                    {t("common.claimHistoryDate")}
                  </th>
                  <th className="border-b border-line px-3 py-2">
                    {t("common.claimHistoryDay")}
                  </th>
                  <th className="border-b border-line px-3 py-2">
                    {t("common.claimHistoryCoins")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="border-b border-line px-3 py-3 font-semibold">
                      {formatDateTime(item.claimedAt, i18n.language)}
                    </td>
                    <td className="border-b border-line px-3 py-3 font-semibold">
                      {t("common.dailyClaimDay", { day: item.day })}
                    </td>
                    <td className="border-b border-line px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 font-extrabold">
                        <CoinIcon className="h-5 w-5" />
                        {item.coinAmount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
