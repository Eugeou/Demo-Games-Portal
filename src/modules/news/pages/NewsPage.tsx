import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNewsQueries, useNewsQuery } from "@/domain/services/news";
import { newsDetailPath } from "@/routes/route-path";
import { Loading } from "@/shared-components";

function formatDate(value: string, language: string) {
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function NewsPage() {
  const { t, i18n } = useTranslation();
  const newsQuery = useNewsQuery(useNewsQueries.listNews);
  const items = newsQuery.data ?? [];

  if (newsQuery.isLoading) {
    return <Loading />;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t("common.newsTitle")}</h1>
        <p className="mt-1 text-sm text-muted">{t("common.newsSubtitle")}</p>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{t("common.newsEmpty")}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={newsDetailPath(item.slug)}
              className="overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-brand"
            >
              <img
                src={item.thumbnailUrl}
                alt=""
                className="aspect-video w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <p className="text-xs font-semibold text-muted">
                  {formatDate(item.publishedAt, i18n.language)}
                </p>
                <h2 className="text-lg font-extrabold leading-snug">{item.title}</h2>
                <p className="line-clamp-3 text-sm text-muted">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
