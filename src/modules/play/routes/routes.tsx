import { routePaths } from "@/routes/route-path";
import lazyWithPreload from "@/infrastructure/plugins/lazy-preload";

const PlayPage = lazyWithPreload(() => import("../pages/PlayPage"));

export default [{ path: routePaths.play, element: <PlayPage /> }];
