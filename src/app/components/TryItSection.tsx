import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Upload,
  Link2,
  Pen,
  Loader2,
  Download,
  Share2,
  ImagePlus,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useI18n } from "./I18nContext";
import { TypewriterText } from "./TypewriterText";
import { GlowOrb } from "./WarmGlow";

gsap.registerPlugin(ScrollTrigger);

export function TryItSection() {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [photoName, setPhotoName] = useState("");
  const [productLink, setProductLink] = useState("");
  const [sceneDesc, setSceneDesc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".try-title", {
        scrollTrigger: {
          trigger: ".try-title",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".try-form", {
        scrollTrigger: {
          trigger: ".try-form",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".try-preview", {
        scrollTrigger: {
          trigger: ".try-preview",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.35,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [lang]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 2500);
  };

  const platforms = [
    "淘宝",
    "京东",
    "天猫",
    "小红书",
    "Amazon",
    "eBay",
    "Shopee",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-32 px-6 overflow-hidden"
    >
      {/* Warm ambient */}
      <GlowOrb
        className="-right-48 top-1/3"
        color="rgba(212, 165, 116, 0.10)"
        size="550px"
        blur="110px"
      />
      <GlowOrb
        className="-left-40 bottom-1/4"
        color="rgba(196, 149, 106, 0.07)"
        size="400px"
        blur="90px"
      />

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-20 try-title">
          <p
            className="tracking-[0.25em] text-muted-foreground mb-4"
            style={{ fontSize: "0.7rem" }}
          >
            {t("tryTag")}
          </p>
          <TypewriterText
            key={`try-${lang}`}
            text={t("tryTitle")}
            as="h2"
            typeSpeed={50}
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div
            className="try-form space-y-6 p-8 rounded-2xl relative"
            style={{
              background:
                "linear-gradient(145deg, rgba(253,249,244,0.6) 0%, rgba(250,246,240,0.4) 100%)",
              border: "1px solid rgba(196,149,106,0.08)",
              boxShadow: "0 4px 24px rgba(139,94,60,0.04)",
            }}
          >
            {/* Warm corner shine */}
            <div
              className="absolute -top-16 -right-16 w-32 h-32 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,165,116,0.1) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
              aria-hidden="true"
            />

            {/* Photo upload */}
            <div>
              <label
                className="block mb-2 text-muted-foreground"
                style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
                {t("tryPhotoLabel")}
              </label>
              <div
                className="border border-dashed border-primary/15 rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-all duration-300 group"
                style={{
                  background: "rgba(237,229,216,0.2)",
                }}
                onClick={() => setPhotoName("my-photo.jpg")}
              >
                {photoName ? (
                  <div className="flex items-center justify-center gap-3">
                    <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    <span style={{ fontSize: "0.9rem" }}>{photoName}</span>
                    <span
                      className="text-primary"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {t("tryPhotoUploaded")}
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <p
                      className="text-muted-foreground"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {t("tryPhotoUpload")}
                    </p>
                    <p
                      className="text-muted-foreground/50 mt-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {t("tryPhotoFormat")}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Product link */}
            <div>
              <label
                className="block mb-2 text-muted-foreground"
                style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
                {t("tryLinkLabel")}
              </label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  placeholder={t("tryLinkPlaceholder")}
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 outline-none focus:ring-1 focus:ring-primary/25 transition-all"
                  style={{
                    fontSize: "0.9rem",
                    background: "rgba(237,229,216,0.3)",
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {platforms.map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1 rounded-full text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-200"
                    style={{
                      fontSize: "0.7rem",
                      background: "rgba(237,229,216,0.4)",
                    }}
                    onClick={() =>
                      setProductLink(
                        `https://www.${p.toLowerCase()}.com/item/example`
                      )
                    }
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Scene description */}
            <div>
              <label
                className="block mb-2 text-muted-foreground"
                style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
                {t("trySceneLabel")}
              </label>
              <div className="relative">
                <Pen className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                <textarea
                  placeholder={t("tryScenePlaceholder")}
                  value={sceneDesc}
                  onChange={(e) => setSceneDesc(e.target.value)}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 outline-none focus:ring-1 focus:ring-primary/25 transition-all resize-none"
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    background: "rgba(237,229,216,0.3)",
                  }}
                />
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 rounded-xl transition-all duration-300 hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 text-primary-foreground relative overflow-hidden group"
              style={{
                fontSize: "0.95rem",
                letterSpacing: "0.05em",
                background:
                  "linear-gradient(135deg, #A0714A 0%, #8B5E3C 50%, #7A5030 100%)",
                boxShadow:
                  "0 6px 24px rgba(139,94,60,0.2), 0 2px 8px rgba(139,94,60,0.1)",
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("tryGenerating")}
                </>
              ) : (
                t("tryGenerate")
              )}
            </button>
          </div>

          {/* Preview */}
          <div className="try-preview">
            <div
              className="rounded-2xl overflow-hidden aspect-[3/4] relative"
              style={{
                background:
                  "linear-gradient(145deg, rgba(237,229,216,0.3) 0%, rgba(232,221,208,0.2) 100%)",
                boxShadow: "0 4px 24px rgba(139,94,60,0.06)",
              }}
            >
              {generated ? (
                <>
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1658860547138-1e28dfb90867?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzIwMjc1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="AI generated scene"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-6"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(44,31,20,0.6) 0%, transparent 100%)",
                    }}
                  >
                    <div className="flex gap-3 justify-end">
                      <button
                        className="w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                        }}
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                      <button
                        className="w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                        }}
                      >
                        <Share2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30">
                  <ImagePlus className="w-12 h-12 mb-4" />
                  <p style={{ fontSize: "0.9rem" }}>{t("tryPreview")}</p>
                  <p className="mt-1" style={{ fontSize: "0.75rem" }}>
                    {t("tryPreviewHint")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
