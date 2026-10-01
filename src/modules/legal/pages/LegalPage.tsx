import { useTranslation } from "react-i18next";
import { useLegalQueries, useLegalQuery } from "@/domain/services/legal";
import { pickLegalLocale, type LegalSlug } from "@/domain/types";
import { Loading, MarkdownContent } from "@/shared-components";

type LegalPageProps = {
  slug: LegalSlug;
};

function formatDate(value: string, language: string) {
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function LegalPage({ slug }: LegalPageProps) {
  const { t, i18n } = useTranslation();
  const pageQuery = useLegalQuery(useLegalQueries.getPage, { slug });
  const page = pageQuery.data;
  const copy = page ? pickLegalLocale(page, i18n.language) : null;

  if (pageQuery.isLoading) {
    return <Loading />;
  }

  if (!page || !copy) {
    return (
      <section className="rounded-3xl bg-surface p-6 ring-1 ring-line">
        <h1 className="text-2xl font-extrabold">{t("common.legalNotFound")}</h1>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-5 pb-8">
      <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">{copy.title}</h1>
      <p className="text-sm text-muted">
        {t("common.legalUpdated", { date: formatDate(page.updatedAt, i18n.language) })}
      </p>
      <MarkdownContent content={copy.content} />
    </article>
  );
}
