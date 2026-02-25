import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "./I18nContext";
import { TryItSection } from "./TryItSection";
import { GradientDivider } from "./WarmGlow";

export function TryItPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-24">
      {/* Back to home button */}
      <div className="max-w-5xl mx-auto px-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {t("tryBackHome")}
        </button>
      </div>

      <TryItSection />
      <GradientDivider />
    </main>
  );
}
