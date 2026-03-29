import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useI18n } from "./I18nContext";

export function AvatarEntryAuthGuard() {
  const { user, lang, setLoginOpen } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) return;

    setLoginOpen(true);
    toast.info(
      lang === "zh"
        ? "该页面需要先登录，已为你跳转首页"
        : "Please log in first. Redirected to home."
    );
    navigate("/", { replace: true, state: { from: location.pathname } });
  }, [user, lang, setLoginOpen, navigate, location.pathname]);

  if (!user) return null;
  return <Outlet />;
}
