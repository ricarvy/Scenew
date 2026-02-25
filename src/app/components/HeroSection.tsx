import { useEffect, useRef } from "react";
import Typed from "typed.js";
import { ArrowDown } from "lucide-react";
import { useI18n } from "./I18nContext";
import { GlowOrb } from "./WarmGlow";
import { useNavigate } from "react-router";

export function HeroSection() {
  const titleRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const titleTypedRef = useRef<Typed | null>(null);
  const subtitleTypedRef = useRef<Typed | null>(null);
  const { t, lang } = useI18n();
  const navigate = useNavigate();

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

        <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center items-center relative">
          <button
            onClick={() => navigate("/try")}
            className="px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 text-primary-foreground relative overflow-hidden group"
            style={{
              fontSize: "0.95rem",
              letterSpacing: "0.05em",
              background:
                "linear-gradient(135deg, #A0714A 0%, #8B5E3C 50%, #7A5030 100%)",
              boxShadow:
                "0 8px 32px rgba(139,94,60,0.25), 0 2px 8px rgba(139,94,60,0.15)",
            }}
          >
            <span className="relative z-10">{t("heroStart")}</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, #B0815A 0%, #9B6E4C 50%, #8B5E3C 100%)",
              }}
            />
          </button>
          <button
            className="px-8 py-3.5 border border-primary/20 rounded-full text-foreground transition-all duration-300 hover:border-primary/40 backdrop-blur-sm"
            style={{
              fontSize: "0.95rem",
              letterSpacing: "0.05em",
              background: "rgba(196,149,106,0.04)",
            }}
          >
            {t("heroLearn")}
          </button>
        </div>
      </div>

      <button
        onClick={scrollToNext}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-5 h-5" />
      </button>
    </section>
  );
}