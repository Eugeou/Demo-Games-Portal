import { routePaths } from "@/routes/route-path";
import lazyWithPreload from "@/infrastructure/plugins/lazy-preload";

const ProfilePage = lazyWithPreload(() => import("../pages/ProfilePage"));

export default [{ path: routePaths.profile, element: <ProfilePage /> }];
