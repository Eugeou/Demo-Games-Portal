import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CONTACT_EMAIL } from "@/domain/constants";
import { BrandLogo } from "@/shared-components";
import { routePaths } from "@/routes/route-path";

export default function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const links = [
    { to: routePaths.news, label: t("common.footerNews") },
    { to: routePaths.registration, label: t("common.footerRegistration") },
    { to: routePaths.terms, label: t("common.footerTerms") },
    { to: routePaths.privacy, label: t("common.footerPrivacy") },
    { to: routePaths.personalData, label: t("common.footerPersonalData") },
    { to: routePaths.about, label: t("common.footerAbout") },
  ];

  return (
    <footer className="mt-auto border-t border-line bg-surface px-3 py-8 md:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Link to={routePaths.home} className="w-fit" aria-label="DND">
          <BrandLogo className="h-7" />
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-muted transition hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-muted transition hover:text-brand"
          >
            {t("common.footerContact")}
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-xs text-muted text-center">
        {t("common.footerRights", { year })}
      </p>
    </footer>
  );
}
