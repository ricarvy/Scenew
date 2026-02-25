import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, ShieldCheck, Globe, Palette, Users, Layers } from "lucide-react";
import { useI18n } from "./I18nContext";
import { TypewriterText } from "./TypewriterText";
import { GlowOrb } from "./WarmGlow";

gsap.registerPlugin(ScrollTrigger);

export function FeaturesSection() {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const features = [
    { icon: Zap, title: t("feat1Title"), desc: t("feat1Desc") },
    { icon: ShieldCheck, title: t("feat2Title"), desc: t("feat2Desc") },
    { icon: Globe, title: t("feat3Title"), desc: t("feat3Desc") },
    { icon: Palette, title: t("feat4Title"), desc: t("feat4Desc") },
    { icon: Users, title: t("feat5Title"), desc: t("feat5Desc") },
    { icon: Layers, title: t("feat6Title"), desc: t("feat6Desc") },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".features-title", {
        scrollTrigger: {
          trigger: ".features-title",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.08,
          ease: "power3.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-32 px-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(237,229,216,0.15) 0%, rgba(240,232,221,0.25) 50%, rgba(237,229,216,0.1) 100%)",
      }}
    >
      {/* Warm glows */}
      <GlowOrb
        className="-left-40 top-1/4"
        color="rgba(196, 149, 106, 0.08)"
        size="500px"
        blur="100px"
      />
      <GlowOrb
        className="-right-32 bottom-1/4"
        color="rgba(212, 165, 116, 0.06)"
        size="400px"
        blur="80px"
      />

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-20 features-title">
          <p
            className="tracking-[0.25em] text-muted-foreground mb-4"
            style={{ fontSize: "0.7rem" }}
          >
            {t("featTag")}
          </p>
          <TypewriterText
            key={`feat-${lang}`}
            text={t("featTitle")}
            as="h2"
            typeSpeed={50}
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={`${feature.title}-${i}`}
                ref={(el) => {
                  if (el) cardsRef.current[i] = el;
                }}
                className="p-8 rounded-2xl border border-primary/[0.06] transition-all duration-500 group cursor-default relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(253,249,244,0.9) 0%, rgba(250,246,240,0.95) 100%)",
                  boxShadow: "0 2px 12px rgba(139,94,60,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 40px rgba(139,94,60,0.1), 0 0 0 1px rgba(196,149,106,0.12)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 2px 12px rgba(139,94,60,0.04)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                {/* Subtle warm shine on hover */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-500 relative"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(196,149,106,0.08) 0%, rgba(212,165,116,0.04) 100%)",
                  }}
                >
                  <Icon className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                  {/* Icon warm glow on hover */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)",
                    }}
                    aria-hidden="true"
                  />
                  <Icon className="w-5 h-5 absolute text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                </div>

                <h3 className="mb-2" style={{ fontSize: "1.05rem" }}>
                  {feature.title}
                </h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.85rem", lineHeight: 1.7 }}
                >
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
