import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useI18n } from "./I18nContext";
import { Check, ArrowLeft, Zap, Crown, Star, X, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface PaymentResult {
  type: "success" | "cancelled";
  pointsBefore: number;
  pointsAfter: number;
}

export function PricingPage() {
  const { t, lang, user, refreshUser, setLoginOpen } = useI18n();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    const payment = searchParams.get("payment");
    if (!payment) return;
    handledRef.current = true;

    const pointsBefore = Number(localStorage.getItem("scenew_points_before") || "0");
    localStorage.removeItem("scenew_points_before");

    if (payment === "success") {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      fetch(`${API_BASE}/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const pointsAfter = data?.points ?? pointsBefore;
          refreshUser();
          setPaymentResult({ type: "success", pointsBefore, pointsAfter });
          setSearchParams({}, { replace: true });
        })
        .catch(() => {
          refreshUser();
          setPaymentResult({ type: "success", pointsBefore, pointsAfter: pointsBefore });
          setSearchParams({}, { replace: true });
        });
    } else if (payment === "cancelled") {
      setPaymentResult({ type: "cancelled", pointsBefore, pointsAfter: pointsBefore });
      setSearchParams({}, { replace: true });
    }
  }, []);

  const plans = [
    {
      id: "starter",
      title: t("pricingPlan1Title"),
      price: t("pricingPlan1Price"),
      points: t("pricingPlan1Points"),
      desc: t("pricingPlan1Desc"),
      icon: Zap,
      popular: false,
    },
    {
      id: "growth",
      title: t("pricingPlan2Title"),
      price: t("pricingPlan2Price"),
      points: t("pricingPlan2Points"),
      desc: t("pricingPlan2Desc"),
      discount: t("pricingPlan2Discount"),
      icon: Star,
      popular: true,
    },
    {
      id: "pro",
      title: t("pricingPlan3Title"),
      price: t("pricingPlan3Price"),
      points: t("pricingPlan3Points"),
      desc: t("pricingPlan3Desc"),
      discount: t("pricingPlan3Discount"),
      icon: Crown,
      popular: false,
    },
  ];

  const commonFeatures = [
    t("pricingFeature1"),
    t("pricingFeature2"),
    t("pricingFeature3"),
  ];

  const handleBuy = async (planId: string) => {
    if (!user) {
      toast.info(t("pricingLoginRequired"));
      setLoginOpen(true);
      return;
    }

    localStorage.setItem("scenew_points_before", String(user.credits || 0));
    setLoadingPlan(planId);
    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${API_BASE}/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_id: planId, lang }),
      });

      if (res.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to create checkout session");
      }

      window.location.href = data.checkout_url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err.message || "Payment service error");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden">
      {/* Payment Result Modal */}
      {paymentResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setPaymentResult(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(170deg, #FFFCF8 0%, #FAF4EB 100%)",
              border: "1px solid rgba(196,149,106,0.15)",
              boxShadow: "0 20px 60px rgba(92,61,36,0.15)",
              animation: "modalIn 0.3s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPaymentResult(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {paymentResult.type === "success" ? (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(22,163,74,0.08) 100%)",
                  }}
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#5C3D24" }}>
                  {t("paymentSuccessTitle")}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {t("paymentSuccessDesc")}
                </p>

                <div
                  className="rounded-xl p-5 mb-6"
                  style={{
                    background: "rgba(196,149,106,0.06)",
                    border: "1px solid rgba(196,149,106,0.1)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{t("paymentBalanceBefore")}</span>
                    <span className="text-sm font-medium" style={{ color: "#8B5E3C" }}>
                      {paymentResult.pointsBefore} {t("profilePointsUnit")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{t("paymentPointsAdded")}</span>
                    <span className="text-sm font-medium text-green-600">
                      +{paymentResult.pointsAfter - paymentResult.pointsBefore} {t("profilePointsUnit")}
                    </span>
                  </div>
                  <div
                    className="h-px my-2"
                    style={{ background: "rgba(196,149,106,0.12)" }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "#5C3D24" }}>
                      {t("paymentBalanceAfter")}
                    </span>
                    <span className="text-lg font-bold" style={{ color: "#A0714A" }}>
                      {paymentResult.pointsAfter} {t("profilePointsUnit")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setPaymentResult(null)}
                  className="w-full py-3 rounded-xl text-white text-sm transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)",
                    boxShadow: "0 4px 16px rgba(139,94,60,0.25)",
                  }}
                >
                  {t("paymentSuccessOk")}
                </button>
              </>
            ) : (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                  }}
                >
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#5C3D24" }}>
                  {t("paymentCancelledTitle")}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {t("paymentCancelledDesc")}
                </p>
                <button
                  onClick={() => setPaymentResult(null)}
                  className="w-full py-3 rounded-xl text-sm transition-all hover:bg-muted/60"
                  style={{
                    color: "#8B5E3C",
                    background: "rgba(196,149,106,0.08)",
                    border: "1px solid rgba(196,149,106,0.18)",
                  }}
                >
                  {t("paymentCancelledOk")}
                </button>
              </>
            )}
          </div>
        </div>
      )}

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
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col ${
              plan.popular ? "md:-mt-4 md:mb-4" : ""
            }`}
            style={{
              background: plan.popular
                ? "linear-gradient(170deg, rgba(255,252,248,0.95) 0%, rgba(250,244,235,0.95) 100%)"
                : "rgba(255,252,248,0.7)",
              border: plan.popular
                ? "1px solid rgba(160,113,74,0.18)"
                : "1px solid rgba(196,149,106,0.12)",
              boxShadow: plan.popular
                ? "0 8px 40px rgba(139,94,60,0.1), 0 2px 12px rgba(139,94,60,0.06)"
                : "0 4px 24px rgba(139,94,60,0.04)",
            }}
          >
            {plan.popular && (
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
            )}

            <div className="flex items-center justify-center gap-2.5 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: plan.popular
                    ? "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)"
                    : "linear-gradient(135deg, rgba(196,149,106,0.1) 0%, rgba(212,165,116,0.08) 100%)",
                  boxShadow: plan.popular ? "0 2px 8px rgba(139,94,60,0.2)" : "none",
                }}
              >
                <plan.icon
                  className="w-4 h-4"
                  style={{ color: plan.popular ? "#fff" : "#A0714A" }}
                />
              </div>
              <h3 style={{ color: "#5C3D24" }}>{plan.title}</h3>
            </div>
            <p className="text-muted-foreground mb-6 text-center" style={{ fontSize: "0.82rem" }}>
              {plan.desc}
            </p>

            <div className="flex items-center justify-center gap-3 mb-2">
              <span
                className="tracking-tight font-semibold"
                style={{ fontSize: "2.4rem", color: "#5C3D24" }}
              >
                {t("pricingCurrency")} {plan.price}
              </span>
              {plan.discount && (
                <span
                  className="px-2 py-1 rounded-md text-xs font-medium"
                  style={{
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                    color: "#A0714A",
                    border: "1px solid rgba(160, 113, 74, 0.2)",
                  }}
                >
                  {plan.discount}
                </span>
              )}
            </div>

            <div className="mb-8 font-medium text-center" style={{ color: "#A0714A", fontSize: "1.1rem" }}>
              {plan.points}
            </div>

            <button
              onClick={() => handleBuy(plan.id)}
              disabled={loadingPlan !== null}
              className={`w-full py-3 rounded-xl transition-all duration-300 hover:shadow-lg mb-8 mt-auto disabled:opacity-60 ${
                plan.popular ? "hover:opacity-95" : "hover:shadow-md"
              }`}
              style={{
                fontSize: "0.85rem",
                color: plan.popular ? "#fff" : "#8B5E3C",
                background: plan.popular
                  ? "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)"
                  : "rgba(196,149,106,0.08)",
                border: plan.popular ? "none" : "1px solid rgba(196,149,106,0.18)",
                boxShadow: plan.popular ? "0 4px 20px rgba(139,94,60,0.25)" : "none",
              }}
            >
              {loadingPlan === plan.id ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  {t("pricingProcessing")}
                </span>
              ) : (
                t("pricingBuy")
              )}
            </button>

            <ul className="space-y-3.5">
              {commonFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: plan.popular
                        ? "linear-gradient(135deg, rgba(160,113,74,0.15) 0%, rgba(196,149,106,0.1) 100%)"
                        : "rgba(196,149,106,0.1)",
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
        ))}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
}
