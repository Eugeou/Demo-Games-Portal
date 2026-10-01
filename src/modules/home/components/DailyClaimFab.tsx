import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { DAILY_CLAIM_ICON } from "@/domain/constants";
import { useMain } from "@/domain/context/main/use-main";
import {
  useDailyClaimQueries,
  useDailyClaimQuery,
} from "@/domain/services/daily-claim";
import { isSignedIn } from "@/domain/types";

type DailyClaimFabProps = {
  onClick: () => void;
};

export default function DailyClaimFab({ onClick }: DailyClaimFabProps) {
  const { t } = useTranslation();
  const { userInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const statusQuery = useDailyClaimQuery(useDailyClaimQueries.getStatus, {
    userId: userInfo.id,
  });
  const canClaim = signedIn && statusQuery.data && !statusQuery.data.claimedToday;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={t("common.openDailyClaim")}
      className="relative flex items-center justify-center rounded-full p-2"
      animate={{
        scale: [1, 1.3, 1],
        rotate: [0, -10, 10, -8, 8, 0],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <img src={DAILY_CLAIM_ICON} alt="" className="h-14 w-14 md:h-20 md:w-20 object-contain" />
      {canClaim ? (
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-brand ring-2 ring-canvas" />
      ) : null}
    </motion.button>
  );
}
