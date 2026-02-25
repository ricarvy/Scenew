import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Upload, Link, Sparkles, Image } from "lucide-react";
import { useI18n } from "./I18nContext";
import { TypewriterText } from "./TypewriterText";
import { GlowOrb } from "./WarmGlow";

gsap.registerPlugin(ScrollTrigger);

export function HowItWorks() {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const numbersRef = useRef<HTMLSpanElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      icon: Upload,
      number: "01",
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      icon: Link,
      number: "02",
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      icon: Sparkles,
      number: "03",
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
    {
      icon: Image,
      number: "04",
      title: t("step4Title"),
      desc: t("step4Desc"),
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".how-title", {
        scrollTrigger: {
          trigger: ".how-title",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 40%",
              end: "bottom 70%",
              scrub: 0.8,
            },
          }
        );
      }

      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        const isLeft = i % 2 === 0;
        const contentEl = step.querySelector(".step-content");
        const descEl = step.querySelector(".step-desc");

        if (contentEl) {
          gsap.from(contentEl, {
            scrollTrigger: {
              trigger: step,
              start: "top 80%",
              end: "top 55%",
              scrub: 0.5,
            },
            x: isLeft ? 80 : -80,
            opacity: 0,
            ease: "power2.out",
          });
        }

        if (descEl) {
          gsap.from(descEl, {
            scrollTrigger: {
              trigger: step,
              start: "top 75%",
              end: "top 50%",
              scrub: 0.5,
            },
            y: 30,
            opacity: 0,
            ease: "power2.out",
          });
        }
      });

      dotsRef.current.forEach((dot) => {
        if (!dot) return;
        gsap.from(dot, {
          scrollTrigger: {
            trigger: dot,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
          scale: 0,
          rotation: -180,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(2)",
        });

        gsap.to(dot, {
          scrollTrigger: {
            trigger: dot,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
          keyframes: [
            { boxShadow: "0 0 0 0px rgba(139,94,60,0.4)", duration: 0 },
            { boxShadow: "0 0 0 20px rgba(139,94,60,0)", duration: 0.8 },
          ],
          ease: "power2.out",
        });
      });

      numbersRef.current.forEach((numEl, i) => {
        if (!numEl) return;
        const target = i + 1;
        gsap.from(numEl, {
          scrollTrigger: {
            trigger: numEl,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
          textContent: 0,
          duration: 1.2,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: function () {
            const val = Math.round(
              gsap.getProperty(numEl, "textContent") as number
            );
            numEl.textContent = String(val).padStart(2, "0");
          },
          onComplete: function () {
            numEl.textContent = String(target).padStart(2, "0");
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative z-10 py-32 px-6 overflow-hidden"
    >
      {/* Warm ambient glows */}
      <GlowOrb
        className="-right-40 top-20"
        color="rgba(212, 165, 116, 0.10)"
        size="500px"
        blur="100px"
      />
      <GlowOrb
        className="-left-32 bottom-40"
        color="rgba(196, 149, 106, 0.08)"
        size="450px"
        blur="90px"
      />

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-24 how-title">
          <p
            className="tracking-[0.25em] text-muted-foreground mb-4"
            style={{ fontSize: "0.7rem" }}
          >
            {t("howTag")}
          </p>
          <TypewriterText
            key={`how-${lang}`}
            text={t("howTitle")}
            as="h2"
            typeSpeed={60}
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          />
        </div>

        <div className="relative">
          {/* Timeline track */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/30 -translate-x-1/2" />
          {/* Timeline progress - warm gradient */}
          <div
            ref={progressRef}
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 origin-top"
            style={{
              background:
                "linear-gradient(to bottom, rgba(196,149,106,0.5), rgba(212,165,116,0.3), rgba(196,149,106,0.08))",
            }}
          />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={`${step.number}-${lang}`}
                  ref={(el) => {
                    if (el) stepsRef.current[i] = el;
                  }}
                  className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`flex-1 ${
                      isLeft ? "md:text-right" : "md:text-left"
                    } text-center`}
                  >
                    <div className="step-content">
                      <span
                        ref={(el) => {
                          if (el) numbersRef.current[i] = el;
                        }}
                        className="mb-2 block"
                        style={{
                          fontSize: "3.5rem",
                          fontWeight: 200,
                          lineHeight: 1,
                          background:
                            "linear-gradient(135deg, rgba(196,149,106,0.25), rgba(212,165,116,0.12))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {step.number}
                      </span>
                      <h3 className="mb-3" style={{ fontSize: "1.25rem" }}>
                        {step.title}
                      </h3>
                    </div>
                    <p
                      className="step-desc text-muted-foreground max-w-sm mx-auto"
                      style={{ fontSize: "0.9rem", lineHeight: 1.7 }}
                    >
                      {step.desc}
                    </p>
                  </div>

                  {/* Center dot with warm glow */}
                  <div className="relative shrink-0">
                    {/* Glow ring behind dot */}
                    <div
                      className="absolute inset-0 -m-3 rounded-full pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(196,149,106,0.15) 0%, transparent 70%)",
                        filter: "blur(8px)",
                      }}
                      aria-hidden="true"
                    />
                    <div
                      ref={(el) => {
                        if (el) dotsRef.current[i] = el;
                      }}
                      className="hidden md:flex w-14 h-14 rounded-full items-center justify-center z-10 text-primary-foreground relative"
                      style={{
                        background:
                          "linear-gradient(135deg, #A0714A 0%, #8B5E3C 60%, #7A5030 100%)",
                        boxShadow:
                          "0 4px 20px rgba(139,94,60,0.3), 0 0 40px rgba(196,149,106,0.1)",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div
                      className="md:hidden w-14 h-14 rounded-full flex items-center justify-center text-primary-foreground relative"
                      style={{
                        background:
                          "linear-gradient(135deg, #A0714A 0%, #8B5E3C 60%, #7A5030 100%)",
                        boxShadow:
                          "0 4px 20px rgba(139,94,60,0.3), 0 0 40px rgba(196,149,106,0.1)",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
