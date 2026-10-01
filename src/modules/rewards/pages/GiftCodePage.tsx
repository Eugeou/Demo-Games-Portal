import { useMain } from "@/domain/context/main/use-main";
import {
  useGiftCodeMutation,
  useGiftCodeMutations,
  useGiftCodeQueries,
  useGiftCodeQuery,
} from "@/domain/services/gift-code";
import { isSignedIn } from "@/domain/types";
import { routePaths } from "@/routes/route-path";
import { CoinIcon } from "@/shared-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

function formatDateTime(value: string, language: string) {
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function GiftCodePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, setUserInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const historyQuery = useGiftCodeQuery(useGiftCodeQueries.listHistory, {
    userId: userInfo.id,
  });
  const redeem = useGiftCodeMutation(useGiftCodeMutations.redeem);
  const history = signedIn ? historyQuery.data ?? [] : [];

  const openLogin = () => {
    navigate(location.pathname, { state: { openLogin: true } });
  };

  const onSubmit = async () => {
    if (!signedIn) {
      openLogin();
      return;
    }
    const nextCode = code.trim();
    if (!nextCode || redeem.isPending) {
      return;
    }
    setError("");
    setSuccess("");
    try {
      const result = await redeem.mutateAsync({
        userId: userInfo.id,
        code: nextCode,
      });
      setUserInfo({ ...userInfo, coinBalance: result.coinBalance });
      setSuccess(t("common.giftCodeWin", { amount: result.coinAmount }));
      setCode("");
    } catch (cause) {
      const reason = cause instanceof Error ? cause.message : "";
      if (reason === "LOGIN_REQUIRED") {
        openLogin();
        return;
      }
      if (reason === "ALREADY_REDEEMED") {
        setError(t("common.giftCodeUsed"));
        return;
      }
      if (reason === "EXPIRED_CODE") {
        setError(t("common.giftCodeExpired"));
        return;
      }
      if (reason === "INVALID_CODE") {
        setError(t("common.giftCodeInvalid"));
        return;
      }
      setError(t("common.giftCodeError"));
    }
  };

  return (
    <section className="space-y-8 pb-8">
      <div>
        <Link
          to={routePaths.rewards}
          className="text-sm font-semibold text-brand"
        >
          {t("common.rewardsTitle")}
        </Link>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
          {t("common.giftCodeTitle")}
        </h1>
        <p className="mt-1 text-sm font-semibold text-muted">
          {t("common.giftCodeSubtitle")}
        </p>
      </div>

      <div className="rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit();
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-semibold">
              {t("common.giftCodeLabel")}
            </span>
            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder={t("common.giftCodePlaceholder")}
              className="w-full rounded-xl md:rounded-2xl bg-lift px-4 py-3 text-sm font-semibold uppercase tracking-wide outline-none ring-1 ring-line focus:ring-2 focus:ring-brand"
            />
          </label>
          {error ? (
            <p className="text-sm font-semibold text-red-400">{error}</p>
          ) : success ? (
            <p className="flex items-center gap-2 text-sm font-extrabold text-brand">
              <CoinIcon className="h-5 w-5" />
              {success}
            </p>
          ) : (
            <p className="text-sm font-semibold text-muted">
              {signedIn
                ? t("common.giftCodeHint")
                : t("common.giftCodeNeedLogin")}
            </p>
          )}
          <button
            type="submit"
            disabled={signedIn && (redeem.isPending || !code.trim())}
            className="w-full rounded-full bg-brand py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {!signedIn
              ? t("common.loginTitle")
              : redeem.isPending
              ? t("common.giftCodeRedeeming")
              : t("common.giftCodeAction")}
          </button>
        </form>
      </div>

      <div className="rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line">
        <h2 className="text-xl font-extrabold">
          {t("common.giftCodeHistoryTitle")}
        </h2>
        {!signedIn ? (
          <p className="mt-4 text-sm font-semibold text-muted">
            {t("common.giftCodeNeedLogin")}
          </p>
        ) : historyQuery.isLoading ? (
          <p className="mt-4 text-sm font-semibold text-muted">
            {t("common.giftCodeLoading")}
          </p>
        ) : history.length === 0 ? (
          <p className="mt-4 text-sm font-semibold text-muted">
            {t("common.giftCodeHistoryEmpty")}
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
                    {t("common.giftCodeLabel")}
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
                      {formatDateTime(item.redeemedAt, i18n.language)}
                    </td>
                    <td className="border-b border-line px-3 py-3 font-extrabold tracking-wide">
                      {item.code}
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
