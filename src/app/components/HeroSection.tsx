import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import { ArrowDown, Users } from "lucide-react";
import { useI18n } from "./I18nContext";
import { GlowOrb } from "./WarmGlow";
import { useNavigate } from "react-router";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";
import { RedeemModal } from "./RedeemModal";

export function HeroSection() {
  const titleRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const titleTypedRef = useRef<Typed | null>(null);
  const subtitleTypedRef = useRef<Typed | null>(null);
  const { t, lang, user } = useI18n();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);

  useEffect(() => {
    titleTypedRef.current?.destroy();
    subtitleTypedRef.current?.destroy();
    if (titleRef.current) titleRef.current.textContent = "";
    if (subtitleRef.current) subtitleRef.current.textContent = "";

    if (!titleRef.current) return;

    titleTypedRef.current = new Typed(titleRef.current, {
      strings: [t("heroTitle")],
      typeSpeed: 80,
      showCursor: true,
      cursorChar: "|",
      onComplete: () => {
        if (subtitleRef.current) {
          subtitleTypedRef.current = new Typed(subtitleRef.current, {
            strings: [t("heroSubtitle")],
            typeSpeed: 20,
            showCursor: false,
          });
        }
      },
    });

    return () => {
      titleTypedRef.current?.destroy();
      subtitleTypedRef.current?.destroy();
    };
  }, [lang]);

  const scrollToNext = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center z-10 overflow-hidden">
      {/* Warm ambient glow orbs */}
      <GlowOrb
        className="-top-20 -right-40"
        color="rgba(212, 165, 116, 0.15)"
        size="700px"
        blur="140px"
      />
      <GlowOrb
        className="-bottom-32 -left-48"
        color="rgba(196, 149, 106, 0.12)"
        size="600px"
        blur="120px"
      />
      <GlowOrb
        className="top-1/3 left-1/2 -translate-x-1/2"
        color="rgba(228, 186, 140, 0.06)"
        size="900px"
        blur="160px"
      />

      <div className="max-w-4xl mx-auto relative">
        {/* Subtle warm halo behind title */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(212,165,116,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        <p
          className="tracking-[0.3em] text-muted-foreground mb-8 opacity-80 relative"
          style={{ fontSize: "0.75rem" }}
        >
          {t("heroTag")}
        </p>

        <h1
          className="mb-8 relative"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1.2,
          }}
        >
          <span ref={titleRef} />
        </h1>

        <p
          className="text-muted-foreground max-w-2xl mx-auto min-h-[4rem] relative"
          style={{ fontSize: "1.05rem", lineHeight: 1.8 }}
        >
          <span ref={subtitleRef} />
        </p>

        <div className="mt-14 flex flex-col items-center gap-5 relative">
          <button
            onClick={() => navigate("/try")}
            className="px-14 py-5 rounded-full transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] text-primary-foreground relative overflow-hidden group"
            style={{
              fontSize: "1.15rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              background:
                "linear-gradient(135deg, #A0714A 0%, #8B5E3C 50%, #7A5030 100%)",
              boxShadow:
                "0 12px 40px rgba(139,94,60,0.3), 0 4px 12px rgba(139,94,60,0.2)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2.5">
              <ArrowDown className="w-5 h-5 rotate-[-90deg]" />
              {t("heroStart")}
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, #B0815A 0%, #9B6E4C 50%, #8B5E3C 100%)",
              }}
            />
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ boxShadow: "0 0 30px rgba(160,113,74,0.4), 0 0 60px rgba(160,113,74,0.15)" }}
            />
          </button>

          <div className="flex flex-row gap-3 justify-center items-center">
            <button
              onClick={() => navigate("/community")}
              className="px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.04em",
                background: "rgba(237,229,216,0.5)",
                border: "1px solid rgba(196,149,106,0.25)",
                boxShadow: "0 4px 16px rgba(139,94,60,0.08)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(237,229,216,0.8)" }}
              />
              <span className="relative z-10 flex items-center gap-1.5 font-medium text-[#5C3D24]">
                <Users className="w-3.5 h-3.5" />
                {t("heroCommunity")}
              </span>
            </button>
            <button
              onClick={() => {
                if (user) {
                  setRedeemOpen(true);
                } else {
                  setLoginOpen(true);
                }
              }}
              className="group relative px-6 py-2.5 rounded-full text-foreground transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.04em",
                background: "rgba(255,240,245,0.4)",
                border: "1px solid rgba(232, 195, 186, 0.4)",
                boxShadow: "0 0 20px rgba(232, 195, 186, 0.3), inset 0 0 10px rgba(255,255,255,0.5)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E8C3BA]/40 to-transparent w-[200%] h-full animate-[shimmer_3s_infinite] -skew-x-12" />
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F472B6]/20 via-[#E8C3BA]/30 to-[#F472B6]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-1.5 font-medium text-[#5C3D24]">
                <span className="animate-pulse text-[#D4AF37]">✨</span>
                {t("heroRedeem")}
                <span className="animate-pulse text-[#D4AF37]" style={{ animationDelay: "0.5s" }}>✨</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToNext}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-5 h-5" />
      </button>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setTimeout(() => setRegisterOpen(true), 150);
        }}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={(email, password) => {
          setRegisterOpen(false);
          setTimeout(() => setLoginOpen(true), 150);
        }}
      />
      <RedeemModal
        isOpen={redeemOpen}
        onClose={() => setRedeemOpen(false)}
      />
    </section>
  );
}