import { useTranslation } from "react-i18next";
import { ZALO_ICON, ZALO_URL } from "@/domain/constants";

export default function ZaloFab() {
  const { t } = useTranslation();

  return (
    <a
      href={ZALO_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={t("common.openZalo")}
      className="block transition-transform duration-200 hover:scale-110"
    >
      <img src={ZALO_ICON} alt="" className="h-14 w-14 md:h-20 md:w-20 object-contain" />
    </a>
  );
}
