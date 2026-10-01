import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMain } from "@/domain/context/main/use-main";
import {
  useLuckyWheelQueries,
  useLuckyWheelQuery,
} from "@/domain/services/lucky-wheel";
import { isSignedIn } from "@/domain/types";

type LuckyWheelFabProps = {
  onClick: () => void;
};

function MiniWheel() {
  return (
    <span className="relative block h-14 w-14">
      <span
        className="block h-full w-full rounded-full"
        style={{
          background:
            "conic-gradient(#0095FF 0 60deg, #FFB703 60deg 120deg, #EF476F 120deg 180deg, #06D6A0 180deg 240deg, #FB8500 240deg 300deg, #16324F 300deg 360deg)",
          boxShadow: "0 0 0 3px #111827, inset 0 0 0 2px rgba(255,255,255,0.35)",
        }}
      />
      <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-[#111827]" />
      <span className="absolute left-1/2 top-[-3px] h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[8px] border-x-transparent border-t-white" />
    </span>
  );
}

export default function LuckyWheelFab({ onClick }: LuckyWheelFabProps) {
  const { t } = useTranslation();
  const { userInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const statusQuery = useLuckyWheelQuery(useLuckyWheelQueries.getStatus, {
    userId: userInfo.id,
  });
  const remaining = signedIn ? statusQuery.data?.remainingSpins : undefined;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={t("common.openLuckyWheel")}
      className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-surface shadow-card ring-2 ring-brand"
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
      <MiniWheel />
      {typeof remaining === "number" ? (
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-1 text-xs font-extrabold text-white">
          {remaining}
        </span>
      ) : null}
    </motion.button>
  );
}
