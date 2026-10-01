import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/routes/route-path";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(routePaths.home, { replace: true, state: { openLogin: true } });
  }, [navigate]);

  return null;
}
