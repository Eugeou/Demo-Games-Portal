import {
  useTelecomPackagesQueries,
  useTelecomPackagesQuery,
} from "@/domain/services/telecom-packages";
import { pickPackageTitle, type TelecomPackage } from "@/domain/types";
import { useTranslation } from "react-i18next";

function smsHref(pack: TelecomPackage) {
  return `sms:${pack.shortCode}?body=${encodeURIComponent(
    pack.registerKeyword
  )}`;
}

function formatFee(amount: number, language: string) {
  return new Intl.NumberFormat(language === "en" ? "en-US" : "vi-VN").format(
    amount
  );
}

export default function TelecomPackageSection() {
  const { t, i18n } = useTranslation();
  const packagesQuery = useTelecomPackagesQuery(
    useTelecomPackagesQueries.listPackages
  );
  const packages = packagesQuery.data ?? [];

  if (packagesQuery.isLoading || packages.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl bg-surface p-5 text-center shadow-card ring-1 ring-line md:p-8">
      <h2 className="text-lg font-extrabold">
        {t("common.packagePromoTitle")}
      </h2>
      <div className="mt-6 flex flex-wrap justify-center gap-6">
        {packages.map((pack) => (
          <article
            key={pack.id}
            className="min-w-[240px] flex-1 rounded-xl md:rounded-2xl bg-lift px-5 py-6 ring-1 ring-line md:max-w-[360px]"
          >
            <h3 className="text-xl font-extrabold">
              {pickPackageTitle(pack, i18n.language)}
            </h3>
            <p className="mt-4 text-sm font-semibold">
              {t("common.packageRegisterPrefix")}
            </p>
            <p className="mt-1 text-lg font-extrabold text-brand">
              {pack.registerKeyword} {t("common.packageSend")} {pack.shortCode}
            </p>
            <p className="mt-1 text-xs text-muted">
              {t(`common.packageCarrier.${pack.carrier}`)}
            </p>
            <a
              href={smsHref(pack)}
              className="mt-4 inline-flex rounded-full bg-brand px-8 py-2.5 text-sm font-extrabold text-white"
            >
              {t("common.packageRegisterAction")}
            </a>
            <p className="mt-4 text-sm font-semibold text-muted">
              {t("common.packageFee", {
                amount: formatFee(pack.dailyFee, i18n.language),
              })}
            </p>
            <p className="mt-5 text-sm font-semibold">
              {t("common.packageCancelPrefix")}
            </p>
            <p className="mt-1 text-base font-extrabold">
              {pack.cancelKeyword} {t("common.packageSend")} {pack.shortCode}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
