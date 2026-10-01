import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Game } from "@/domain/types";
import { routePaths } from "@/routes/route-path";

type GameAboutProps = {
  game: Game;
};

function formatMonthYear(iso: string, language: string, monthYear: (month: number, year: number) => string) {
  const date = new Date(iso);
  if (language.startsWith("vi")) {
    return monthYear(date.getMonth() + 1, date.getFullYear());
  }
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}

export default function GameAbout({ game }: GameAboutProps) {
  const { t, i18n } = useTranslation();
  const released = formatMonthYear(game.releasedAt, i18n.language, (month, year) =>
    t("common.monthYear", { month, year })
  );
  const updated = formatMonthYear(game.updatedAt, i18n.language, (month, year) =>
    t("common.monthYear", { month, year })
  );
  const engine = game.engine ?? "HTML5";
  const platforms = (game.platforms ?? ["browser"]).map((platform) =>
    t(`common.platform.${platform}`, { defaultValue: platform })
  );
  const orientation = t(`common.orientation.${game.orientation ?? "landscape"}`);
  const howToPlay = t(`common.howToPlayBody.${game.genre}`, {
    defaultValue: game.description,
  });

  const rows = [
    { label: t("common.developer"), value: game.developer },
    {
      label: t("common.ratingLabel"),
      value: (
        <>
          {game.rating.toFixed(1).replace(".", ",")}
          <span className="ml-1 text-muted">{t("common.ratingHint")}</span>
        </>
      ),
    },
    { label: t("common.releasedLabel"), value: released },
    { label: t("common.updatedLabel"), value: updated },
    { label: t("common.engineLabel"), value: engine },
    { label: t("common.platformsLabel"), value: platforms.join(", ") },
    { label: t("common.orientationLabel"), value: orientation },
  ];

  return (
    <div className="space-y-8">
      <dl className="grid gap-3 text-sm sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:gap-x-6 sm:gap-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-muted">{row.label}</dt>
            <dd className="font-medium text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-2">
        <Link
          to={`${routePaths.catalog}?genre=${game.genre}`}
          className="rounded-full bg-lift px-3 py-1.5 text-xs font-semibold capitalize text-ink ring-1 ring-line transition hover:ring-brand"
        >
          {t(`common.genre.${game.genre}`)}
        </Link>
        {game.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-lift px-3 py-1.5 text-xs font-medium capitalize text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="max-w-3xl text-sm leading-7 text-ink/90">{game.description}</p>

      <section className="space-y-2">
        <h2 className="text-xl font-extrabold">{t("common.howToPlayTitle")}</h2>
        <p className="max-w-3xl text-sm leading-7 text-ink/90">{howToPlay}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-extrabold">{t("common.similarGames")}</h2>
        <p className="max-w-3xl text-sm leading-7 text-muted">
          {t("common.similarGamesIntro")}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-extrabold">{t("common.releasedLabel")}</h2>
        <p className="text-sm text-ink/90">{released}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-extrabold">{t("common.platformsLabel")}</h2>
        <p className="text-sm text-ink/90">{platforms.join(", ")}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-extrabold">{t("common.updatedLabel")}</h2>
        <p className="text-sm text-ink/90">{updated}</p>
      </section>
    </div>
  );
}
