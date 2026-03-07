import { useI18n } from "./I18nContext";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router";
import { GlowOrb } from "./WarmGlow";

export function TermsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDF9F4] pt-24 pb-12 relative overflow-hidden">
      {/* Background Glows */}
      <GlowOrb className="top-0 right-0" color="rgba(160, 113, 74, 0.1)" size="600px" blur="100px" />
      <GlowOrb className="bottom-0 left-0" color="rgba(232, 195, 186, 0.15)" size="500px" blur="120px" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-[#5C3D24] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("tryBackHome")}
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-[#A0714A]" />
            <h1 className="text-3xl font-serif text-[#5C3D24]">{t("termsTitle")}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{t("termsLastUpdated")}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#E8C3BA]/20 shadow-sm space-y-8 text-[#5C3D24]/90 leading-relaxed">
          <p className="text-lg font-light border-b border-[#E8C3BA]/20 pb-6">
            {t("termsIntro")}
          </p>

          <section>
            <h2 className="text-xl font-medium text-[#5C3D24] mb-3">{t("termsSection1")}</h2>
            <p className="text-sm opacity-80">{t("termsSection1Content")}</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#5C3D24] mb-3">{t("termsSection2")}</h2>
            <p className="text-sm opacity-80">{t("termsSection2Content")}</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#5C3D24] mb-3">{t("termsSection3")}</h2>
            <p className="text-sm opacity-80">{t("termsSection3Content")}</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#5C3D24] mb-3">{t("termsSection4")}</h2>
            <p className="text-sm opacity-80">{t("termsSection4Content")}</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#5C3D24] mb-3">{t("termsSection5")}</h2>
            <p className="text-sm opacity-80">{t("termsSection5Content")}</p>
          </section>

          <div className="pt-8 mt-8 border-t border-[#E8C3BA]/20 text-center">
            <p className="font-medium text-[#A0714A]">{t("termsContact")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
