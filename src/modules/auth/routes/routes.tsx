import { routePaths } from "@/routes/route-path";
import lazyWithPreload from "@/infrastructure/plugins/lazy-preload";

const LoginPage = lazyWithPreload(() => import("../pages/LoginPage"));
const RegisterPage = lazyWithPreload(() => import("../pages/RegisterPage"));

export default [
  { path: routePaths.login, element: <LoginPage /> },
  { path: routePaths.register, element: <RegisterPage /> },
];
