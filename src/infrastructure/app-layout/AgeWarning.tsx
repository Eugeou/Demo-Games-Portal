import { useTranslation } from "react-i18next";

export default function AgeWarning() {
  const { t } = useTranslation();

  return (
    <aside
      className="pointer-events-none fixed bottom-3 left-2 z-[70] md:bottom-6 md:left-20"
      aria-label={t("common.age18Label")}
    >
      <div className="flex max-w-[158px] overflow-hidden rounded-lg border border-brand bg-white text-brand shadow-card dark:border-white dark:bg-black dark:text-white md:max-w-[208px] md:rounded-xl md:border-2">
        <div className="flex min-w-[4.35rem] flex-col items-center justify-center border-r border-brand p-1 dark:border-white/80 md:min-w-[5.75rem] md:border-r-2 md:p-2">
          <div className="flex flex-col items-center justify-center rounded-[3px] bg-brand p-0.5 text-white dark:bg-white dark:text-brand md:rounded-lg md:p-1">
            <div className="mt-0.5 rounded-md bg-white px-1.5 py-0.5 text-brand dark:bg-brand dark:text-white md:mt-1 md:rounded-lg md:p-2">
              <span className="text-[1.05rem] font-black leading-none tracking-tight md:text-[1.48rem]">
                {t("common.age18")}
              </span>
            </div>
            <p className="mt-0.5 max-w-[4.1rem] text-center text-[8px] font-semibold leading-tight md:mt-1 md:max-w-[5.4rem] md:text-[10px]">
              {t("common.age18Hint")}
            </p>
          </div>
        </div>
        <p className="flex max-w-[5.75rem] items-center p-1 text-[8px] text-center font-bold leading-snug md:max-w-[7.75rem] md:p-2 md:text-[11px]">
          {t("common.ageHealthHint")}
        </p>
      </div>
    </aside>
  );
}
