import { routePaths } from "@/routes/route-path";
import lazyWithPreload from "@/infrastructure/plugins/lazy-preload";

const CatalogPage = lazyWithPreload(() => import("../pages/CatalogPage"));

export default [{ path: routePaths.catalog, element: <CatalogPage /> }];
