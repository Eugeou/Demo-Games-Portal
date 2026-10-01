import { routePaths } from "@/routes/route-path";
import lazyWithPreload from "@/infrastructure/plugins/lazy-preload";

const HomePage = lazyWithPreload(() => import("../pages/HomePage"));

export default [{ path: routePaths.home, element: <HomePage /> }];
