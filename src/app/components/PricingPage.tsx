import { useState } from "react";
import { useNavigate } from "react-router";
import { useI18n } from "./I18nContext";
import { Check, ArrowLeft, Sparkles, Zap } from "lucide-react";

export function PricingPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);

  const freeFeatures = [
    t("pricingFreeF1"),
    t("pricingFreeF2"),
    t("pricingFreeF3"),
    t("pricingFreeF4"),
  ];

  const proFeatures = [
    t("pricingProF1"),
    t("pricingProF2"),
    t("pricingProF3"),
    t("pricingProF4"),
    t("pricingProF5"),
    t("pricingProF6"),
  ];

  const proPrice = yearly
    ? t("pricingProPriceYearly")
    : t("pricingProPriceMonthly");
  const proPeriod = yearly
    ? t("pricingProPeriodYearly")
    : t("pricingProPeriodMonthly");

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden">
      {/* Back button */}
      <div className="max-w-5xl mx-auto mb-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          style={{ fontSize: "0.82rem" }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {t("tryBackHome")}
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 overflow-hidden">
        <span
          className="inline-block tracking-[0.2em] mb-4"
          style={{
            fontSize: "0.7rem",
            color: "#A0714A",
            background: "linear-gradient(135deg, rgba(160,113,74,0.08) 0%, rgba(196,149,106,0.06) 100%)",
            padding: "6px 16px",
            borderRadius: "100px",
            border: "1px solid rgba(160,113,74,0.1)",
          }}
        >
          {t("pricingTag")}
        </span>
        <h1
          className="mb-4 break-words"
          style={{
            background: "linear-gradient(135deg, #5C3D24 0%, #8B5E3C 50%, #A0714A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("pricingTitle")}
        </h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>
          {t("pricingSubtitle")}
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span
            className={`transition-colors ${!yearly ? "text-foreground" : "text-muted-foreground"}`}
            style={{ fontSize: "0.85rem" }}
          >
            {t("pricingMonthly")}
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className="relative w-12 h-6 rounded-full transition-colors duration-300"
            style={{
              background: yearly
                ? "linear-gradient(135deg, #A0714A, #8B5E3C)"
                : "rgba(196,149,106,0.2)",
            }}
            aria-label="Toggle billing period"
          >
            <div
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
              style={{
                transform: yearly ? "translateX(26px)" : "translateX(2px)",
              }}
            />
          </button>
          <span
            className={`transition-colors ${yearly ? "text-foreground" : "text-muted-foreground"}`}
            style={{ fontSize: "0.85rem" }}
          >
            {t("pricingYearly")}
          </span>
          {yearly && (
            <span
              className="inline-block px-2.5 py-0.5 rounded-full"
              style={{
                fontSize: "0.7rem",
                color: "#8B5E3C",
                background: "rgba(196,149,106,0.12)",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              {t("pricingSave")}
            </span>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Free Plan */}
        <div
          className="relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
          style={{
            background: "rgba(255,252,248,0.7)",
            border: "1px solid rgba(196,149,106,0.12)",
            boxShadow: "0 4px 24px rgba(139,94,60,0.04)",
          }}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(196,149,106,0.1) 0%, rgba(212,165,116,0.08) 100%)",
              }}
            >
              <Zap className="w-4 h-4" style={{ color: "#A0714A" }} />
            </div>
            <h3 style={{ color: "#5C3D24" }}>{t("pricingFreeTitle")}</h3>
          </div>
          <p className="text-muted-foreground mb-6" style={{ fontSize: "0.82rem" }}>
            {t("pricingFreeDesc")}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-8">
            <span
              className="tracking-tight"
              style={{
                fontSize: "2.8rem",
                color: "#5C3D24",
              }}
            >
              {t("pricingCurrency")} {t("pricingFreePrice")}
            </span>
            <span className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
              {t("pricingFreePeriod")}
            </span>
          </div>

          {/* CTA */}
          <button
            className="w-full py-3 rounded-xl transition-all duration-300 hover:shadow-md mb-8"
            style={{
              fontSize: "0.85rem",
              color: "#8B5E3C",
              background: "rgba(196,149,106,0.08)",
              border: "1px solid rgba(196,149,106,0.18)",
            }}
          >
            {t("pricingFreeCta")}
          </button>

          {/* Features */}
          <ul className="space-y-3.5">
            {freeFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(196,149,106,0.1)" }}
                >
                  <Check className="w-3 h-3" style={{ color: "#A0714A" }} />
                </div>
                <span className="text-muted-foreground" style={{ fontSize: "0.82rem" }}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Plan */}
        <div
          className="relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
          style={{
            background: "linear-gradient(170deg, rgba(255,252,248,0.95) 0%, rgba(250,244,235,0.95) 100%)",
            border: "1px solid rgba(160,113,74,0.18)",
            boxShadow: "0 8px 40px rgba(139,94,60,0.1), 0 2px 12px rgba(139,94,60,0.06)",
          }}
        >
          {/* Popular badge */}
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              color: "#fff",
              background: "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)",
              boxShadow: "0 4px 12px rgba(139,94,60,0.25)",
            }}
          >
            {t("pricingPopular")}
          </div>

          <div className="flex items-center gap-2.5 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)",
                boxShadow: "0 2px 8px rgba(139,94,60,0.2)",
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 style={{ color: "#5C3D24" }}>{t("pricingProTitle")}</h3>
          </div>
          <p className="text-muted-foreground mb-6" style={{ fontSize: "0.82rem" }}>
            {t("pricingProDesc")}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-8">
            <span
              className="tracking-tight"
              style={{
                fontSize: "2.8rem",
                background: "linear-gradient(135deg, #8B5E3C, #A0714A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("pricingCurrency")} {proPrice}
            </span>
            <span className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
              {proPeriod}
            </span>
          </div>

          {/* CTA */}
          <button
            className="w-full py-3 rounded-xl text-white transition-all duration-300 hover:shadow-lg hover:opacity-95 mb-8"
            style={{
              fontSize: "0.85rem",
              background: "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)",
              boxShadow: "0 4px 20px rgba(139,94,60,0.25)",
            }}
          >
            {t("pricingProCta")}
          </button>

          {/* Features */}
          <ul className="space-y-3.5">
            {proFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: "linear-gradient(135deg, rgba(160,113,74,0.15) 0%, rgba(196,149,106,0.1) 100%)",
                  }}
                >
                  <Check className="w-3 h-3" style={{ color: "#8B5E3C" }} />
                </div>
                <span className="text-muted-foreground" style={{ fontSize: "0.82rem" }}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}