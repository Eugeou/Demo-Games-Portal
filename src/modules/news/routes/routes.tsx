import { routePaths } from "@/routes/route-path";
import lazyWithPreload from "@/infrastructure/plugins/lazy-preload";

const NewsPage = lazyWithPreload(() => import("../pages/NewsPage"));
const NewsDetailPage = lazyWithPreload(() => import("../pages/NewsDetailPage"));

export default [
  { path: routePaths.news, element: <NewsPage /> },
  { path: routePaths.newsDetail, element: <NewsDetailPage /> },
];
