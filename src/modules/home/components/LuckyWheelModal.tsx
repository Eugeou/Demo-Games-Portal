import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Wheel } from "react-custom-roulette";
import { useTranslation } from "react-i18next";
import { useMain } from "@/domain/context/main/use-main";
import {
  useLuckyWheelMutation,
  useLuckyWheelMutations,
  useLuckyWheelQueries,
  useLuckyWheelQuery,
} from "@/domain/services/lucky-wheel";
import { isSignedIn, type LuckyWheelResult } from "@/domain/types";
import { CoinIcon } from "@/shared-components";
import { createPrizeSliceImage } from "./prize-slice-image";

type LuckyWheelModalProps = {
  open: boolean;
  onClose: () => void;
};

type WheelSlice = {
  option: string;
  image: {
    uri: string;
    sizeMultiplier: number;
    offsetY: number;
    landscape: boolean;
  };
  style: {
    backgroundColor: string;
    textColor: string;
  };
};

export default function LuckyWheelModal({ open, onClose }: LuckyWheelModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, setUserInfo } = useMain();
  const signedIn = isSignedIn(userInfo);
  const configQuery = useLuckyWheelQuery(useLuckyWheelQueries.getConfig);
  const statusQuery = useLuckyWheelQuery(useLuckyWheelQueries.getStatus, {
    userId: userInfo.id,
  });
  const spin = useLuckyWheelMutation(useLuckyWheelMutations.spin);
  const prizes = configQuery.data?.prizes ?? [];
  const prizeKey = prizes.map((prize) => `${prize.id}:${prize.coinAmount}`).join(",");
  const remaining = signedIn ? (statusQuery.data?.remainingSpins ?? 0) : 0;
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState<LuckyWheelResult | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState("");
  const [wheelData, setWheelData] = useState<WheelSlice[]>([]);

  useEffect(() => {
    if (prizes.length === 0) {
      setWheelData([]);
      return;
    }
    let cancelled = false;
    void Promise.all(
      prizes.map(async (prize) => {
        const uri = await createPrizeSliceImage(prize.coinAmount);
        return {
          option: prize.label,
          image: {
            uri,
            sizeMultiplier: 1.05,
            offsetY: 12,
            landscape: true,
          },
          style: {
            backgroundColor: prize.backgroundColor,
            textColor: prize.textColor,
          },
        };
      })
    ).then((slices) => {
      if (!cancelled) {
        setWheelData(slices);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [prizeKey, prizes]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      return;
    }
    setMustSpin(false);
    setResult(null);
    setRevealed(false);
    setError("");
  }, [open]);

  const openLogin = () => {
    onClose();
    navigate(location.pathname, { state: { openLogin: true } });
  };

  const onSpin = async () => {
    if (!signedIn) {
      openLogin();
      return;
    }
    if (mustSpin || spin.isPending || remaining <= 0 || prizes.length === 0) {
      return;
    }
    setError("");
    setRevealed(false);
    try {
      const next = await spin.mutateAsync(userInfo.id);
      const index = prizes.findIndex((prize) => prize.id === next.prizeId);
      if (index < 0) {
        setError(t("common.wheelError"));
        return;
      }
      setUserInfo({ ...userInfo, coinBalance: next.coinBalance });
      setResult(next);
      setPrizeNumber(index);
      setMustSpin(true);
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "";
      if (code === "NO_SPINS_LEFT") {
        setError(t("common.wheelNoSpins"));
        return;
      }
      if (code === "LOGIN_REQUIRED") {
        openLogin();
        return;
      }
      setError(t("common.wheelError"));
    }
  };

  const busy = mustSpin || spin.isPending;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] m-0 flex items-center justify-center bg-black/70 p-4"
        >
          <button
            type="button"
            className="absolute inset-0 m-0 h-full w-full"
            aria-label={t("common.closeLuckyWheel")}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative z-[1] m-0 flex w-full max-w-[360px] flex-col items-center bg-transparent"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-1 right-0 flex h-10 w-10 items-center justify-center text-brand"
              aria-label={t("common.closeLuckyWheel")}
            >
              <X size={22} />
            </button>
            <h2 className="text-center text-2xl font-extrabold text-brand">
              {t("common.luckyWheelTitle")}
            </h2>
            <p className="mt-1 text-center text-sm font-semibold text-brand">
              {signedIn
                ? t("common.wheelSpinsLeft", { count: remaining })
                : t("common.wheelNeedLogin")}
            </p>

            <div className="mt-5 flex justify-center">
              {wheelData.length > 0 ? (
                <div className="lucky-wheel-frame">
                  <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={wheelData}
                    onStopSpinning={() => {
                      setMustSpin(false);
                      setRevealed(true);
                    }}
                    pointerProps={{
                      src:
                        "data:image/svg+xml;utf8," +
                        encodeURIComponent(
                          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                            <path d="M56 32 C56 18 42 6 28 14 C10 24 8 32 8 32 C8 32 10 40 28 50 C42 58 56 46 56 32 Z" fill="#0095FF"/>
                          </svg>`
                        ),
                      style: {
                        width: "24%",
                        transform: "rotate(-36deg)",
                        transformOrigin: "70% 24%",
                      },
                    }}
                    outerBorderColor="#0095FF"
                    outerBorderWidth={6}
                    innerRadius={14}
                    innerBorderColor="#0095FF"
                    innerBorderWidth={3}
                    radiusLineColor="#0095FF"
                    radiusLineWidth={1}
                    fontSize={14}
                    fontWeight={800}
                    textDistance={58}
                    spinDuration={0.7}
                    disableInitialAnimation
                  />
                </div>
              ) : (
                <div className="flex h-[280px] items-center text-sm font-semibold text-brand">
                  {t("common.wheelLoading")}
                </div>
              )}
            </div>

            {error ? (
              <p className="mt-4 text-center text-sm font-semibold text-red-400">{error}</p>
            ) : revealed && result ? (
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-base font-extrabold text-brand">
                <CoinIcon className="h-7 w-7" />
                {t("common.wheelWin", { prize: result.label })}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => {
                void onSpin();
              }}
              disabled={busy || (signedIn && remaining <= 0)}
              className="mt-5 w-full rounded-full bg-brand py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!signedIn
                ? t("common.loginTitle")
                : busy
                  ? t("common.wheelSpinning")
                  : remaining <= 0
                    ? t("common.wheelNoSpins")
                    : t("common.wheelSpin")}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
