import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <section className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">{t("common.registerTitle")}</h1>
      <p className="text-sm opacity-80">{t("common.registerSubtitle")}</p>
    </section>
  );
}
