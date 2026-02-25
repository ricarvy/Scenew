import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useI18n } from "./I18nContext";
import { TypewriterText } from "./TypewriterText";
import { GlowOrb } from "./WarmGlow";

gsap.registerPlugin(ScrollTrigger);

export function ShowcaseGallery() {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const showcaseItems = [
    {
      id: 1,
      title: t("show1Title"),
      scene: t("show1Scene"),
      image:
        "https://images.unsplash.com/photo-1612217175157-e5d846b139d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc3RyZWV0JTIwZmFzaGlvbiUyMHVyYmFufGVufDF8fHx8MTc3MTk4Nzc5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      title: t("show2Title"),
      scene: t("show2Scene"),
      image:
        "https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcyMDEzMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      title: t("show3Title"),
      scene: t("show3Scene"),
      image:
        "https://images.unsplash.com/photo-1767909599777-f73144edcfc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwaGlraW5nJTIwbW91bnRhaW4lMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzcyMDM5NzA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 4,
      title: t("show4Title"),
      scene: t("show4Scene"),
      image:
        "https://images.unsplash.com/photo-1770848891765-c583a19acd30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHZhY2F0aW9uJTIwdHJvcGljYWwlMjBzdW5zZXR8ZW58MXx8fHwxNzcyMDM5NzA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".gallery-title", {
        scrollTrigger: {
          trigger: ".gallery-title",
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
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          y: 100,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.12,
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
    >
      {/* Ambient warm glows */}
      <GlowOrb
        className="top-0 left-1/2 -translate-x-1/2"
        color="rgba(212, 165, 116, 0.06)"
        size="800px"
        blur="120px"
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-20 gallery-title">
          <p
            className="tracking-[0.25em] text-muted-foreground mb-4"
            style={{ fontSize: "0.7rem" }}
          >
            {t("showTag")}
          </p>
          <TypewriterText
            key={`show-${lang}`}
            text={t("showTitle")}
            as="h2"
            typeSpeed={50}
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          />
          <p
            className="text-muted-foreground mt-4 max-w-lg mx-auto"
            style={{ fontSize: "0.95rem", lineHeight: 1.7 }}
          >
            {t("showSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showcaseItems.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3]"
              style={{
                boxShadow:
                  "0 4px 24px rgba(139,94,60,0.06), 0 1px 4px rgba(139,94,60,0.04)",
              }}
            >
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Warm gradient overlay */}
              <div
                className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(to top, rgba(44,31,20,0.7) 0%, rgba(44,31,20,0.15) 40%, transparent 100%)",
                }}
              />
              {/* Warm border glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 0 0 1px rgba(212,165,116,0.2), 0 8px 40px rgba(139,94,60,0.12)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p
                  className="mb-1"
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    color: "rgba(228,196,150,0.85)",
                  }}
                >
                  {item.title}
                </p>
                <p
                  className="text-white"
                  style={{ fontSize: "1rem", lineHeight: 1.6 }}
                >
                  {item.scene}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
