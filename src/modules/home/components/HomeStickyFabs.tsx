import DailyClaimFab from "./DailyClaimFab";
import ZaloFab from "./ZaloFab";

type HomeStickyFabsProps = {
  onOpenDailyClaim: () => void;
};

export default function HomeStickyFabs({ onOpenDailyClaim }: HomeStickyFabsProps) {
  return (
    <div className="fixed bottom-6 right-4 z-[80] flex flex-col items-center gap-6 md:bottom-8 md:right-6">
      <DailyClaimFab onClick={onOpenDailyClaim} />
      <ZaloFab />
    </div>
  );
}
