import { useNewsQueries, useNewsQuery } from "@/domain/services/news";
import { newsDetailPath, routePaths } from "@/routes/route-path";
import { Loading, MarkdownContent } from "@/shared-components";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

function formatDate(value: string, language: string) {
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function NewsDetailPage() {
  const { t, i18n } = useTranslation();
  const { newsId } = useParams();
  const detailQuery = useNewsQuery(useNewsQueries.getNews, {
    id: newsId ?? "",
  });
  const listQuery = useNewsQuery(useNewsQueries.listNews);
  const item = detailQuery.data;
  const latest = (listQuery.data ?? [])
    .filter((entry) => entry.id !== item?.id)
    .slice(0, 5);

  if (detailQuery.isLoading) {
    return <Loading />;
  }

  if (!item) {
    return (
      <section className="rounded-3xl bg-surface p-6 ring-1 ring-line">
        <h1 className="text-2xl font-extrabold">{t("common.newsNotFound")}</h1>
        <Link
          to={routePaths.news}
          className="mt-3 inline-block text-sm font-semibold text-brand"
        >
          {t("common.newsTitle")}
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <article className="space-y-5">
        <Link to={routePaths.news} className="text-sm font-semibold text-brand">
          {t("common.newsTitle")}
        </Link>
        <img
          src={item.bannerUrl}
          alt=""
          className="aspect-[21/9] w-full rounded-3xl object-cover shadow-card"
        />
        <p className="text-xs font-semibold text-muted">
          {formatDate(item.publishedAt, i18n.language)}
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {item.title}
        </h1>
        <p className="text-base text-muted">{item.description}</p>
        <MarkdownContent content={item.content} />
      </article>

      <aside className="space-y-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted">
          {t("common.latestNews")}
        </h2>
        <div className="space-y-3">
          {latest.map((entry) => (
            <Link
              key={entry.id}
              to={newsDetailPath(entry.slug)}
              className="flex gap-3 rounded-xl md:rounded-2xl bg-surface p-2 ring-1 ring-line transition hover:ring-brand"
            >
              <img
                src={entry.thumbnailUrl}
                alt=""
                className="h-16 w-24 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-bold">{entry.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {entry.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
