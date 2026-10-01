import { routePaths } from "@/routes/route-path";
import lazyWithPreload from "@/infrastructure/plugins/lazy-preload";

const LegalPage = lazyWithPreload(() => import("../pages/LegalPage"));

export default [
  { path: routePaths.terms, element: <LegalPage slug="terms" /> },
  { path: routePaths.privacy, element: <LegalPage slug="privacy" /> },
  { path: routePaths.about, element: <LegalPage slug="about" /> },
  { path: routePaths.registration, element: <LegalPage slug="registration" /> },
  { path: routePaths.personalData, element: <LegalPage slug="personal-data" /> },
];
