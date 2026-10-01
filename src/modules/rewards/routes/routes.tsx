import { routePaths } from "@/routes/route-path";
import lazyWithPreload from "@/infrastructure/plugins/lazy-preload";

const RewardsPage = lazyWithPreload(() => import("../pages/RewardsPage"));
const GiftCodePage = lazyWithPreload(() => import("../pages/GiftCodePage"));

export default [
  { path: routePaths.rewards, element: <RewardsPage /> },
  { path: routePaths.giftCode, element: <GiftCodePage /> },
];
