import { useEffect, useRef, useState, useCallback } from "react";
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
  X,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Plus,
  ExternalLink,
  ShoppingBag,
  Package,
  Copy,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useI18n } from "./I18nContext";
import { TypewriterText } from "./TypewriterText";
import { GlowOrb } from "./WarmGlow";
import {
  detectPlatform,
  extractProduct,
  NeedLoginError,
  type PlatformInfo,
  type ProductInfo,
} from "./productScraper";
import { BrowserLoginModal } from "./BrowserLoginModal";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import { toast } from "sonner";
import mediumZoom from "medium-zoom";

gsap.registerPlugin(ScrollTrigger);

// ── API Configuration ────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://120.76.142.91:8910";

interface GenerateRequest {
  photo: File;
  productLinks: { url: string; product?: ProductInfo; selectedImageIndex?: number }[];
  sceneDescription: string;
  creativeMode?: "copy" | "inspire";
  sceneImage?: File;
  seedMode?: boolean;
}

interface GenerateResult {
  src: string;
  labelZh: string;
  labelEn: string;
  generatedCopy?: string;
}

/**
 * Call the scene generation backend API.
 */
async function generateSceneImages(
  request: GenerateRequest
): Promise<GenerateResult[]> {
  const formData = new FormData();
  formData.append("photo", request.photo);
  
  // Format links with selected image index
  const formattedLinks = request.productLinks.map(l => {
    // Logic must match ProductCard display logic to ensure WYSIWYG
    const images = l.product?.images && l.product.images.length > 0 
      ? l.product.images 
      : l.product?.image ? [l.product.image] : [];
      
    return {
      url: l.url,
      title: l.product?.title,
      price: l.product?.price,
      currency: l.product?.currency,
      selected_image: images[l.selectedImageIndex || 0] || l.product?.image
    };
  });
  
  formData.append("links", JSON.stringify(formattedLinks));
  formData.append("scene", request.sceneDescription);
  formData.append("mode", request.creativeMode || "copy");
  formData.append("seed_mode", request.seedMode ? "true" : "false");
  
  if (request.sceneImage) {
    formData.append("scene_image", request.sceneImage);
  }

  const res = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || `Generate failed (${res.status})`);
  }

  const data = await res.json();
  
  // Ensure full URL for generated images
  const ensureUrl = (url: string) => 
    url.startsWith("http") ? url : `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  return (data.result_image_urls || []).map((url: string) => ({
    src: ensureUrl(url),
    labelZh: "生成结果",
    labelEn: "Generated Result",
    generatedCopy: data.generated_copy
  }));
}

// ── Product Link Item ────────────────────────────────────────
export interface ProductLinkItem {
  id: string;
  url: string;
  platform: PlatformInfo;
  status: "fetching" | "success" | "error" | "need_login";
  product?: ProductInfo;
  selectedImageIndex?: number;
  taskId?: string;
  error?: string;
}

// ── Helpers ──────────────────────────────────────────────────
function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

let _linkId = 0;
function nextId() {
  return `link-${++_linkId}-${Date.now()}`;
}

// ── Platform icon badge ──────────────────────────────────────
function PlatformBadge({ platform }: { platform: PlatformInfo }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-md flex-shrink-0"
      style={{
        width: "32px",
        height: "32px",
        fontSize: "0.6rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        color: platform.color,
        background: platform.bgColor,
        border: `1px solid ${platform.color}18`,
      }}
    >
      {platform.icon}
    </span>
  );
}

// ── Product Card ─────────────────────────────────────────────
function ProductCard({
  item,
  onRemove,
  onRetry,
  onSelectImage,
  t,
}: {
  item: ProductLinkItem;
  onRemove: () => void;
  onRetry: () => void;
  onSelectImage?: (index: number) => void;
  t: (k: any) => string;
}) {
  const images = item.product?.images && item.product.images.length > 0 
    ? item.product.images 
    : item.product?.image ? [item.product.image] : [];
  
  const selectedImage = images[item.selectedImageIndex || 0] || item.product?.image;

  return (
    <div
      className="relative group rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(255,252,248,0.7)",
        border: `1px solid ${item.status === "error" ? "rgba(160,113,74,0.12)" : item.platform.color + "15"}`,
        boxShadow: "0 2px 12px rgba(139,94,60,0.04)",
      }}
    >
      <div className="flex items-start gap-3 p-3 min-w-0">
        {/* Product thumbnail or platform badge */}
        {item.status === "success" && selectedImage ? (
          <div className="flex flex-col gap-2 flex-shrink-0">
            <div
              className="w-14 h-14 rounded-lg overflow-hidden"
              style={{ border: "1px solid rgba(196,149,106,0.1)" }}
            >
              <ImageWithFallback
                src={selectedImage}
                alt={item.product?.title || "Product"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.platform.bgColor }}>
            {item.status === "fetching" ? (
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: item.platform.color }} />
            ) : (
              <Package className="w-5 h-5" style={{ color: item.platform.color, opacity: 0.6 }} />
            )}
          </div>
        )}

        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Platform tag */}
          <div className="flex items-center gap-1.5 mb-1">
            <PlatformBadge platform={item.platform} />
            <span style={{ fontSize: "0.72rem", color: item.platform.color, fontWeight: 500 }}>
              {item.product?.shop_name || item.platform.name}
            </span>
            {/* "Link added" badge for error/need_login states */}
            {(item.status === "error" || item.status === "need_login") && (
              <span
                className="ml-auto px-1.5 py-0.5 rounded-full"
                style={{
                  fontSize: "0.6rem",
                  color: "#8B5E3C",
                  background: "rgba(139,94,60,0.08)",
                }}
              >
                {t("tryLinkAdded")}
              </span>
            )}
          </div>

          {/* Title or status */}
          {item.status === "success" && item.product?.title ? (
            <div className="flex flex-col gap-0.5">
              <p
                className="text-foreground/90 line-clamp-2"
                style={{ fontSize: "0.78rem", lineHeight: 1.5 }}
              >
                {item.product.title}
              </p>
              {item.product.price && (
                <p className="font-semibold text-right" style={{ fontSize: "0.75rem", color: "#A0714A" }}>
                  <span className="mr-0.5 text-[0.7em] opacity-80">{item.product.currency || "¥"}</span>
                  {item.product.price}
                </p>
              )}
              {/* Image selector thumbnails if multiple images exist */}
              {images.length > 1 && (
                <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectImage?.(idx)}
                      className={`relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                        (item.selectedImageIndex || 0) === idx 
                          ? "ring-2 ring-[#A0714A] ring-offset-1" 
                          : "opacity-70 hover:opacity-100"
                      }`}
                      style={{ border: "1px solid rgba(160,113,74,0.1)" }}
                    >
                      <img 
                        src={img} 
                        alt={`View ${idx + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : item.status === "fetching" ? (
            <p className="text-muted-foreground/60" style={{ fontSize: "0.75rem" }}>
              {t("tryLinkFetching")}
            </p>
          ) : item.status === "error" ? (
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-muted-foreground/50 flex items-center gap-1" style={{ fontSize: "0.72rem" }}>
                {t("tryLinkInfoUnavailable")}
              </p>
              <button
                onClick={onRetry}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                style={{
                  fontSize: "0.65rem",
                  color: "#A0714A",
                  background: "rgba(160,113,74,0.08)",
                }}
              >
                <RefreshCw className="w-2.5 h-2.5" />
                {t("tryLinkRetry")}
              </button>
              <button
                onClick={() => alert(`[Debug] Fetch Error:\n\n${item.error || "Unknown error"}`)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                style={{
                  fontSize: "0.65rem",
                  color: "#c0392b",
                  background: "rgba(192,57,43,0.06)",
                }}
              >
                <AlertCircle className="w-2.5 h-2.5" />
                详情
              </button>
            </div>
          ) : item.status === "need_login" ? (
            <p className="text-amber-600 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
              <AlertCircle className="w-3 h-3" />
              {t("browserLoginTitle")}
            </p>
          ) : null}

          {/* URL preview */}
          <p
            className="text-muted-foreground/40 mt-0.5 truncate"
            style={{ fontSize: "0.65rem" }}
          >
            <ExternalLink className="w-2.5 h-2.5 inline-block flex-shrink-0 mr-1 align-middle" />
            <span className="align-middle">{item.url}</span>
          </p>
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-50 transition-all flex-shrink-0"
          title={t("tryLinkRemove")}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Fetching progress bar */}
      {item.status === "fetching" && (
        <div className="h-0.5 w-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${item.platform.color}, transparent)`,
              animation: "productSlide 1.5s ease infinite",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────
export function TryItSection() {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const sceneImageInputRef = useRef<HTMLInputElement>(null);
  const generateStartRef = useRef<number | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [productLinks, setProductLinks] = useState<ProductLinkItem[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [sceneDesc, setSceneDesc] = useState("");
  const [sceneImageFile, setSceneImageFile] = useState<File | null>(null);
  const [sceneImagePreview, setSceneImagePreview] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [errors, setErrors] = useState<{ photo?: string; link?: string }>({});
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [generatedResults, setGeneratedResults] = useState<
    { src: string; labelZh: string; labelEn: string; generatedCopy?: string }[]
  >([]);
  const [generateError, setGenerateError] = useState<string>("");
  const [seedMode, setSeedMode] = useState(false);

  // Creative mode tab state
  const [creativeMode, setCreativeMode] = useState<"copy" | "inspire">("copy");

  // Browser login modal state
  const [browserLoginOpen, setBrowserLoginOpen] = useState(false);
  const [browserLoginTaskId, setBrowserLoginTaskId] = useState("");
  const [browserLoginLinkId, setBrowserLoginLinkId] = useState("");
  const zoomRef = useRef<ReturnType<typeof mediumZoom> | null>(null);

  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".try-title", {
        scrollTrigger: { trigger: ".try-title", start: "top 85%", toggleActions: "play none none reverse" },
        y: 50, opacity: 0, duration: 1, ease: "power3.out",
      });
      gsap.from(".try-form", {
        scrollTrigger: { trigger: ".try-form", start: "top 85%", toggleActions: "play none none reverse" },
        y: 60, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out",
      });
      gsap.from(".try-preview", {
        scrollTrigger: { trigger: ".try-preview", start: "top 85%", toggleActions: "play none none reverse" },
        y: 60, opacity: 0, duration: 1, delay: 0.35, ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [lang]);

  // ── Photo handling ──────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setErrors((prev) => ({ ...prev, photo: undefined }));
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Scene image handling (inspire mode) ────────────────
  const handleSceneImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSceneImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setSceneImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeSceneImage = () => {
    setSceneImageFile(null);
    setSceneImagePreview("");
    if (sceneImageInputRef.current) sceneImageInputRef.current.value = "";
  };

  // ── Product link handling ──────────────────────────────
  const fetchProductInfo = useCallback(
    async (item: ProductLinkItem) => {
      try {
        const product = await extractProduct(item.url);
        setProductLinks((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, status: "success", product } : p
          )
        );
      } catch (err: any) {
        if (err instanceof NeedLoginError) {
          setProductLinks((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? { ...p, status: "need_login", taskId: err.task_id }
                : p
            )
          );
          // Auto-open browser login
          setBrowserLoginTaskId(err.task_id);
          setBrowserLoginLinkId(item.id);
          setBrowserLoginOpen(true);
        } else {
          const errDetail = [
            `Type: ${err?.name || err?.constructor?.name || typeof err}`,
            `Message: ${err?.message || String(err)}`,
            err?.status ? `Status: ${err.status}` : null,
            `URL: ${item.url}`,
            err?.stack ? `\nStack:\n${err.stack}` : null,
          ]
            .filter(Boolean)
            .join("\n");
          setProductLinks((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? { ...p, status: "error", error: errDetail }
                : p
            )
          );
        }
      }
    },
    []
  );

  const addLink = useCallback(
    (url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return;
      if (!isValidUrl(trimmed)) return;

      const platform = detectPlatform(trimmed);
      const newItem: ProductLinkItem = {
        id: nextId(),
        url: trimmed,
        platform,
        status: "fetching",
      };

      let added = false;
      setProductLinks((prev) => {
        if (prev.length >= 5) return prev;
        if (prev.some((p) => p.url === trimmed)) return prev;
        added = true;
        return [newItem, ...prev];
      });

      // Only clear input & fetch if actually added
      // Use setTimeout to read `added` after setState batching
      setTimeout(() => {
        if (added) {
          setLinkInput("");
          setErrors((prev) => ({ ...prev, link: undefined }));
          fetchProductInfo(newItem);
        }
      }, 0);
    },
    [fetchProductInfo]
  );

  const retryLink = useCallback(
    (id: string) => {
      setProductLinks((prev) => {
        const item = prev.find((p) => p.id === id);
        if (!item) return prev;
        // Trigger fetch in next tick with the found item
        setTimeout(() => {
          fetchProductInfo({ ...item, status: "fetching", error: undefined });
        }, 0);
        return prev.map((p) =>
          p.id === id ? { ...p, status: "fetching", error: undefined } : p
        );
      });
    },
    [fetchProductInfo]
  );

  const removeLink = (id: string) => {
    setProductLinks((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLinkKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLink(linkInput);
    }
  };

  // Browser login success handler
  const handleBrowserLoginSuccess = (product: ProductInfo) => {
    setProductLinks((prev) =>
      prev.map((p) =>
        p.id === browserLoginLinkId
          ? { ...p, status: "success", product }
          : p
      )
    );
    setBrowserLoginOpen(false);
  };

  // ── Validation & generation ─────────────────────────────
  const validate = (): boolean => {
    const newErrors: { photo?: string; link?: string } = {};
    if (!photoFile) newErrors.photo = t("tryValidationPhoto");
    if (productLinks.length === 0) newErrors.link = t("tryValidationLink");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    generateStartRef.current = performance.now();
    setIsGenerating(true);
    setGenerated(false);
    setSelectedResult(null);
    setGenerateError("");
    const request: GenerateRequest = {
      photo: photoFile!,
      productLinks: productLinks.map((link) => ({ 
        url: link.url, 
        product: link.product,
        selectedImageIndex: link.selectedImageIndex 
      })),
      sceneDescription: sceneDesc,
      creativeMode: creativeMode,
      sceneImage: sceneImageFile || undefined,
      seedMode,
    };
    generateSceneImages(request)
      .then((results) => {
        setIsGenerating(false);
        setGenerated(true);
        setGeneratedResults(results);
        const start = generateStartRef.current ?? performance.now();
        const seconds = ((performance.now() - start) / 1000).toFixed(1);
        toast.success(lang === "zh" ? "生成成功" : "Generation succeeded", {
          description: `${lang === "zh" ? "本轮耗时" : "Time"} ${seconds}s`,
        });
      })
      .catch((err) => {
        setIsGenerating(false);
        setGenerateError(err.message || "生成失败");
        const start = generateStartRef.current ?? performance.now();
        const seconds = ((performance.now() - start) / 1000).toFixed(1);
        const detail = typeof err?.message === "string" ? err.message : "";
        toast.error(lang === "zh" ? "生成失败" : "Generation failed", {
          description: `${detail ? `${detail} · ` : ""}${lang === "zh" ? "本轮耗时" : "Time"} ${seconds}s`,
        });
      });
  };

  const handleRegenerate = () => {
    setGenerated(false);
    setSelectedResult(null);
    handleGenerate();
  };
  
  const downloadImage = async (url: string) => {
    try {
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const filename = url.split("/").pop() || "image.jpg";
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();
    }
  };
  
  const copyImageLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(lang === "zh" ? "已经复制到剪贴板" : "Copied to clipboard");
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      toast.success(lang === "zh" ? "已经复制到剪贴板" : "Copied to clipboard");
    }
  };

  const sceneSuggestions = [
    t("trySceneSuggest1"),
    t("trySceneSuggest2"),
    t("trySceneSuggest3"),
    t("trySceneSuggest4"),
    t("trySceneSuggest5"),
    t("trySceneSuggest6"),
  ];
  
  useEffect(() => {
    if (!generated) return;
    const imgs = document.querySelectorAll<HTMLImageElement>(".generated-zoomable");
    if (!zoomRef.current) {
      zoomRef.current = mediumZoom({ margin: 24, background: "rgba(0,0,0,0.85)", scrollOffset: 40 });
    }
    zoomRef.current.attach(imgs);
  }, [generated, generatedResults]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-32 px-6 overflow-hidden"
    >
      {/* Warm ambient */}
      <GlowOrb className="-right-48 top-1/3" color="rgba(212, 165, 116, 0.10)" size="550px" blur="110px" />
      <GlowOrb className="-left-40 bottom-1/4" color="rgba(196, 149, 106, 0.07)" size="400px" blur="90px" />

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-20 try-title">
          <p className="tracking-[0.25em] text-muted-foreground mb-4" style={{ fontSize: "0.7rem" }}>
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

        <div className={`grid gap-12 items-start ${isGenerating || generated || generateError ? 'grid-cols-1 lg:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
          {/* ── Form Panel ── */}
          <div
            className="try-form space-y-6 p-4 sm:p-8 rounded-2xl relative min-w-0"
            style={{
              background: "linear-gradient(145deg, rgba(253,249,244,0.6) 0%, rgba(250,246,240,0.4) 100%)",
              border: "1px solid rgba(196,149,106,0.08)",
              boxShadow: "0 4px 24px rgba(139,94,60,0.04)",
            }}
          >
            <div
              className="absolute -top-16 -right-16 w-32 h-32 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(212,165,116,0.1) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
              aria-hidden="true"
            />

            {/* ── Creative Mode Tabs ── */}
            <div>
              <div
                className="flex rounded-xl p-1 relative"
                style={{ background: "rgba(237,229,216,0.4)", border: "1px solid rgba(196,149,106,0.08)" }}
              >
                {(["copy", "inspire"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCreativeMode(mode)}
                    className="flex-1 relative z-10 py-2.5 rounded-lg transition-all duration-300"
                    style={{
                      fontSize: "0.85rem",
                      letterSpacing: "0.05em",
                      color: creativeMode === mode ? "#5C3D24" : "rgba(139,94,60,0.5)",
                      background: creativeMode === mode
                        ? "linear-gradient(145deg, rgba(255,252,248,0.95) 0%, rgba(253,249,244,0.9) 100%)"
                        : "transparent",
                      boxShadow: creativeMode === mode
                        ? "0 2px 8px rgba(139,94,60,0.08), 0 0 0 1px rgba(196,149,106,0.1)"
                        : "none",
                    }}
                  >
                    {t(mode === "copy" ? "tryTabCopy" : "tryTabInspire")}
                  </button>
                ))}
              </div>
              {/* Tab slogan with typewriter effect */}
              <div className="mt-3 text-center min-h-[1.8rem]">
                <TypewriterText
                  key={`tab-slogan-${creativeMode}-${lang}`}
                  text={t(creativeMode === "copy" ? "trySloganCopy" : "trySloganInspire")}
                  as="p"
                  typeSpeed={40}
                  className="text-muted-foreground/70"
                  style={{ fontSize: "0.78rem", lineHeight: 1.6 }}
                />
              </div>
            </div>
            
            <div
              className="rounded-2xl p-4 sm:p-5 transition-all duration-300"
              style={{
                background: seedMode
                  ? "linear-gradient(135deg, rgba(160,113,74,0.14) 0%, rgba(255,204,102,0.10) 45%, rgba(139,94,60,0.10) 100%)"
                  : "rgba(237,229,216,0.25)",
                border: seedMode ? "1px solid rgba(160,113,74,0.22)" : "1px solid rgba(196,149,106,0.10)",
                boxShadow: seedMode ? "0 10px 32px rgba(139,94,60,0.10)" : "0 2px 10px rgba(139,94,60,0.04)",
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className={`w-4 h-4 ${seedMode ? "seed-sparkle" : ""}`} style={{ color: seedMode ? "#A0714A" : "rgba(139,94,60,0.55)" }} />
                    <p className="font-medium" style={{ color: "#5C3D24", fontSize: "0.88rem" }}>
                      {lang === "zh" ? "种草模式" : "Seeding Mode"}
                    </p>
                    {seedMode && (
                      <span
                        className="px-2 py-0.5 rounded-full seed-pill"
                        style={{ fontSize: "0.65rem", color: "#8B5E3C", background: "rgba(255,255,255,0.55)", border: "1px solid rgba(160,113,74,0.18)" }}
                      >
                        {lang === "zh" ? "ON" : "ON"}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground/70" style={{ fontSize: "0.76rem", lineHeight: 1.55 }}>
                    {lang === "zh"
                      ? "开启后，生成的场景图会自动带上商品的购物卡片截图"
                      : "When on, generated scenes include the product shopping card snapshot"}
                  </p>
                </div>

                <button
                  type="button"
                  aria-pressed={seedMode}
                  onClick={() => setSeedMode((v) => !v)}
                  className="relative w-14 h-9 rounded-full flex-shrink-0 transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A0714A]/30"
                  style={{
                    background: seedMode
                      ? "linear-gradient(135deg, #A0714A 0%, #8B5E3C 55%, #FFCC66 110%)"
                      : "rgba(139,94,60,0.18)",
                    boxShadow: seedMode ? "0 10px 24px rgba(160,113,74,0.28)" : "inset 0 0 0 1px rgba(160,113,74,0.18)",
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 seed-shimmer"
                    style={{ opacity: seedMode ? 1 : 0 }}
                  />
                  <span
                    className="absolute top-1 left-1 w-7 h-7 rounded-full transition-transform duration-300 flex items-center justify-center"
                    style={{
                      transform: seedMode ? "translateX(20px)" : "translateX(0px)",
                      background: "rgba(255,252,248,0.98)",
                      boxShadow: seedMode ? "0 8px 16px rgba(44,31,20,0.22)" : "0 6px 12px rgba(44,31,20,0.14)",
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" style={{ color: seedMode ? "#A0714A" : "rgba(139,94,60,0.55)" }} />
                  </span>
                </button>
              </div>
            </div>

            {/* ── Photo upload ── */}
            <div>
              <label className="block mb-2 text-muted-foreground" style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                {t("tryPhotoLabel")}
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleFileSelect} />
              <div
                className={`border border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 group ${
                  errors.photo ? "border-red-300 bg-red-50/30" : "border-primary/15 hover:border-primary/30"
                }`}
                style={{ background: errors.photo ? undefined : "rgba(237,229,216,0.2)" }}
                onClick={() => !photoPreview && fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <div className="relative p-3">
                    {/* Full-width image preview */}
                    <div className="relative w-full rounded-xl overflow-hidden" style={{ maxHeight: "45vh" }}>
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-xl"
                        style={{ maxHeight: "45vh" }}
                      />
                      {/* Floating action buttons */}
                      <div className="absolute top-2.5 right-2.5 flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="backdrop-blur-md text-white/90 hover:text-white transition-all px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                          style={{ fontSize: "0.72rem", background: "rgba(44,31,20,0.45)" }}
                        >
                          <Upload className="w-3 h-3" />
                          {t("tryPhotoChange")}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                          className="backdrop-blur-md text-white/90 hover:text-red-300 transition-all p-1.5 rounded-lg"
                          style={{ background: "rgba(44,31,20,0.45)" }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {/* Uploaded badge */}
                      <div
                        className="absolute bottom-2.5 left-2.5 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5"
                        style={{ background: "rgba(44,31,20,0.4)" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-white/90" style={{ fontSize: "0.68rem" }}>{t("tryPhotoUploaded")}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8">
                    <Upload className="w-6 h-6 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>{t("tryPhotoUpload")}</p>
                    <p className="text-muted-foreground/50 mt-1" style={{ fontSize: "0.75rem" }}>{t("tryPhotoFormat")}</p>
                  </div>
                )}
              </div>
              {errors.photo && (
                <p className="flex items-center gap-1.5 mt-2 text-red-400" style={{ fontSize: "0.75rem" }}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.photo}
                </p>
              )}
            </div>

            {/* ── Product Links (multi) ── */}
            <div>
              <label className="block mb-2 text-muted-foreground" style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {t("tryLinkLabel")}
                  <span className="text-red-400">*</span>
                  {productLinks.length > 0 && (
                    <span
                      className="ml-auto px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: "0.65rem",
                        color: "#A0714A",
                        background: "rgba(160,113,74,0.08)",
                      }}
                    >
                      {productLinks.length}/5
                    </span>
                  )}
                </span>
              </label>

              {/* Link input with add button */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    ref={linkInputRef}
                    type="url"
                    placeholder={t("tryLinkPlaceholder")}
                    value={linkInput}
                    onChange={(e) => {
                      setLinkInput(e.target.value);
                      if (errors.link) setErrors((prev) => ({ ...prev, link: undefined }));
                    }}
                    onKeyDown={handleLinkKeyDown}
                    disabled={productLinks.length >= 5}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-0 outline-none focus:ring-1 transition-all ${
                      errors.link ? "ring-1 ring-red-300 bg-red-50/30" : "focus:ring-primary/25"
                    } disabled:opacity-50`}
                    style={{
                      fontSize: "0.88rem",
                      background: errors.link ? undefined : "rgba(237,229,216,0.3)",
                    }}
                  />
                </div>
                <button
                  onClick={() => addLink(linkInput)}
                  disabled={!linkInput.trim() || productLinks.length >= 5}
                  className="px-4 py-3 rounded-xl transition-all duration-300 hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5 flex-shrink-0 text-primary-foreground"
                  style={{
                    fontSize: "0.82rem",
                    background: "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)",
                    boxShadow: "0 2px 8px rgba(139,94,60,0.15)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  {t("tryLinkAdd")}
                </button>
              </div>

              {/* Max links warning */}
              {productLinks.length >= 5 && (
                <p className="text-amber-600 mt-2 flex items-center gap-1" style={{ fontSize: "0.72rem" }}>
                  <AlertCircle className="w-3 h-3" />
                  {t("tryLinkMax")}
                </p>
              )}

              {errors.link && (
                <p className="flex items-center gap-1.5 mt-2 text-red-400" style={{ fontSize: "0.75rem" }}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.link}
                </p>
              )}

              {/* Product cards list */}
              {productLinks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {productLinks.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onRemove={() => removeLink(item.id)}
                      onRetry={() => retryLink(item.id)}
                      onSelectImage={(index) => {
                        setProductLinks((prev) =>
                          prev.map((p) =>
                            p.id === item.id ? { ...p, selectedImageIndex: index } : p
                          )
                        );
                      }}
                      t={t}
                    />
                  ))}
                </div>
              )}

              {/* Empty state hint */}
              {productLinks.length === 0 && !errors.link && (
                <p
                  className="text-center text-muted-foreground/40 mt-4 flex items-center justify-center gap-2"
                  style={{ fontSize: "0.75rem" }}
                >
                  <Package className="w-3.5 h-3.5" />
                  {t("tryLinkEmpty")}
                </p>
              )}
            </div>

            {/* ── Scene Reference Image (inspire mode only) ── */}
            {creativeMode === "inspire" && (
              <div>
                <label className="block mb-2 text-muted-foreground" style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                  <span className="flex items-center gap-2">
                    <ImagePlus className="w-3.5 h-3.5" />
                    {t("trySceneImageLabel")}
                    <span className="text-muted-foreground/50" style={{ fontSize: "0.72rem", letterSpacing: "0.02em" }}>
                      {t("trySceneImageOptional")}
                    </span>
                  </span>
                </label>
                <input
                  ref={sceneImageInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleSceneImageSelect}
                />
                <div
                  className="border border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 group border-primary/15 hover:border-primary/30"
                  style={{ background: "rgba(237,229,216,0.2)" }}
                  onClick={() => !sceneImagePreview && sceneImageInputRef.current?.click()}
                >
                  {sceneImagePreview ? (
                    <div className="relative p-3">
                      <div className="relative w-full rounded-xl overflow-hidden" style={{ maxHeight: "28vh" }}>
                        <img
                          src={sceneImagePreview}
                          alt="Scene reference"
                          className="w-full h-full object-contain rounded-xl"
                          style={{ maxHeight: "28vh" }}
                        />
                        {/* Floating action buttons */}
                        <div className="absolute top-2.5 right-2.5 flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); sceneImageInputRef.current?.click(); }}
                            className="backdrop-blur-md text-white/90 hover:text-white transition-all px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                            style={{ fontSize: "0.72rem", background: "rgba(44,31,20,0.45)" }}
                          >
                            <Upload className="w-3 h-3" />
                            {t("trySceneImageChange")}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeSceneImage(); }}
                            className="backdrop-blur-md text-white/90 hover:text-red-300 transition-all p-1.5 rounded-lg"
                            style={{ background: "rgba(44,31,20,0.45)" }}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Uploaded badge */}
                        <div
                          className="absolute bottom-2.5 left-2.5 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5"
                          style={{ background: "rgba(44,31,20,0.4)" }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-white/90" style={{ fontSize: "0.68rem" }}>{t("trySceneImageUploaded")}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 px-4">
                      <ImagePlus className="w-5 h-5 mx-auto mb-2.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors duration-300" />
                      <p className="text-muted-foreground/60" style={{ fontSize: "0.8rem" }}>
                        {t("trySceneImageUpload")}
                      </p>
                      <p className="text-muted-foreground/35 mt-1" style={{ fontSize: "0.7rem" }}>
                        {t("trySceneImageFormat")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Scene description ── */}
            <div>
              <label className="block mb-2 text-muted-foreground" style={{ fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                {t("trySceneLabel")}
                <span className="ml-1.5 text-muted-foreground/50" style={{ fontSize: "0.72rem", letterSpacing: "0.02em" }}>
                  {t("trySceneOptional")}
                </span>
              </label>
              <div className="relative">
                <Pen className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                <textarea
                  placeholder={t("tryScenePlaceholder")}
                  value={sceneDesc}
                  onChange={(e) => setSceneDesc(e.target.value)}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 outline-none focus:ring-1 focus:ring-primary/25 transition-all resize-none"
                  style={{ fontSize: "0.9rem", lineHeight: 1.7, background: "rgba(237,229,216,0.3)" }}
                />
              </div>

              {photoPreview && (
                <div className="mt-3">
                  <p className="text-muted-foreground mb-2.5 flex items-center gap-1.5" style={{ fontSize: "0.75rem" }}>
                    <Sparkles className="w-3.5 h-3.5" style={{ color: "#A0714A" }} />
                    {t("trySceneSuggestTitle")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sceneSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setSceneDesc(s)}
                        className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-all duration-200 hover:shadow-sm"
                        style={{
                          fontSize: "0.72rem",
                          background: sceneDesc === s ? "rgba(160,113,74,0.12)" : "rgba(237,229,216,0.45)",
                          border: sceneDesc === s ? "1px solid rgba(160,113,74,0.2)" : "1px solid transparent",
                          color: sceneDesc === s ? "#8B5E3C" : undefined,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Generate button ── */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 rounded-xl transition-all duration-300 hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 text-primary-foreground relative overflow-hidden group"
              style={{
                fontSize: "0.95rem",
                letterSpacing: "0.05em",
                background: "linear-gradient(135deg, #A0714A 0%, #8B5E3C 50%, #7A5030 100%)",
                boxShadow: "0 6px 24px rgba(139,94,60,0.2), 0 2px 8px rgba(139,94,60,0.1)",
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

          {/* ── Preview Panel ── */}
          {(isGenerating || generated || generateError) && (
          <div className="try-preview min-w-0">
            {generateError ? (
              <div
                className="rounded-2xl overflow-hidden relative p-8"
                style={{
                  background: "linear-gradient(145deg, rgba(237,229,216,0.3) 0%, rgba(232,221,208,0.2) 100%)",
                  boxShadow: "0 4px 24px rgba(139,94,60,0.06)",
                }}
              >
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "rgba(192,57,43,0.08)" }}
                  >
                    <AlertCircle className="w-6 h-6" style={{ color: "#c0392b" }} />
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#5C3D24" }}>
                    {lang === "zh" ? "生成失败" : "Generation Failed"}
                  </p>
                  <p className="text-muted-foreground mt-2 max-w-xs" style={{ fontSize: "0.75rem" }}>
                    {generateError}
                  </p>
                  <button
                    onClick={handleGenerate}
                    className="mt-5 flex items-center gap-1.5 px-5 py-2 rounded-xl text-primary-foreground transition-all hover:opacity-90"
                    style={{
                      fontSize: "0.8rem",
                      background: "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)",
                      boxShadow: "0 2px 8px rgba(139,94,60,0.15)",
                    }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {lang === "zh" ? "重试" : "Retry"}
                  </button>
                </div>
              </div>
            ) : generated ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2" style={{ fontSize: "0.85rem", color: "#5C3D24" }}>
                    <Sparkles className="w-4 h-4" style={{ color: "#A0714A" }} />
                    {t("tryResultTitle")}
                  </p>
                  <button
                    onClick={handleRegenerate}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg"
                    style={{ fontSize: "0.75rem", background: "rgba(237,229,216,0.5)" }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t("tryResultRegenerate")}
                  </button>
                </div>

                <div className="w-full flex justify-center py-4">
                  <Swiper
                    effect={"cards"}
                    grabCursor={true}
                    modules={[EffectCards]}
                    className="w-[240px] h-[320px] sm:w-[280px] sm:h-[380px]"
                    onSlideChange={(swiper) => setSelectedResult(swiper.activeIndex)}
                    initialSlide={selectedResult || 0}
                  >
                    {generatedResults.map((item, idx) => (
                      <SwiperSlide key={idx} className="rounded-xl overflow-hidden shadow-lg bg-white">
                        <div
                          className="relative w-full h-full group"
                          onClick={() => setSelectedResult(idx)}
                        >
                          <ImageWithFallback
                            src={item.src}
                            alt={`Scene ${idx + 1}`}
                            className="w-full h-full object-cover cursor-zoom-in generated-zoomable"
                            data-zoomable
                          />
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{ background: "linear-gradient(to top, rgba(44,31,20,0.55) 0%, transparent 50%)" }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <p className="text-white/90 font-medium" style={{ fontSize: "0.85rem" }}>
                              {lang === "zh" ? item.labelZh : item.labelEn} {idx + 1}
                            </p>
                          </div>
                          
                          {/* Action Buttons (visible on hover or always for active card?) - let's keep them on top right */}
                           <div className="absolute top-3 right-3 flex gap-2 z-10">
                            <button
                              className="w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors bg-black/20 hover:bg-black/40 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                 downloadImage(item.src);
                              }}
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              className="w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors bg-black/20 hover:bg-black/40 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                 copyImageLink(item.src);
                              }}
                              title="Share"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Generated Copy Display */}
                {generatedResults[0]?.generatedCopy && (
                  <div 
                    className="mt-6 p-5 rounded-xl border relative group"
                    style={{ 
                      background: "rgba(255,252,248,0.6)",
                      borderColor: "rgba(160,113,74,0.15)" 
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: "#5C3D24" }}>
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        {lang === "zh" ? "AI 种草文案" : "AI Generated Copy"}
                      </h3>
                      <button
                        onClick={() => {
                          navigator.clipboard
                            .writeText(generatedResults[0].generatedCopy || "")
                            .then(() => {
                              toast.success(lang === "zh" ? "已经复制到剪贴板" : "Copied to clipboard");
                            })
                            .catch(() => {
                              toast.success(lang === "zh" ? "已经复制到剪贴板" : "Copied to clipboard");
                            });
                        }}
                        className="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-muted-foreground hover:text-foreground"
                        title={lang === "zh" ? "复制文案" : "Copy text"}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div 
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: "#4A3B32", fontSize: "0.85rem" }}
                    >
                      {generatedResults[0].generatedCopy}
                    </div>
                  </div>
                )}
              </div>
            ) : isGenerating ? (
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{
                  aspectRatio: "1/1",
                  background: "linear-gradient(145deg, rgba(237,229,216,0.3) 0%, rgba(232,221,208,0.2) 100%)",
                  boxShadow: "0 4px 24px rgba(139,94,60,0.06)",
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(160,113,74,0.08)", animationDuration: "2s" }} />
                    <div className="absolute inset-2 rounded-full animate-ping" style={{ background: "rgba(160,113,74,0.12)", animationDuration: "2s", animationDelay: "0.3s" }} />
                    <div className="absolute inset-4 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(160,113,74,0.1), rgba(196,149,106,0.08))" }}>
                      <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#A0714A" }} />
                    </div>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>{t("tryPreviewGenerating")}</p>
                  <div className="flex gap-3 mt-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: "rgba(160,113,74,0.3)", animationDelay: `${i * 0.3}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{
                  aspectRatio: "1/1",
                  background: "linear-gradient(145deg, rgba(237,229,216,0.3) 0%, rgba(232,221,208,0.2) 100%)",
                  boxShadow: "0 4px 24px rgba(139,94,60,0.06)",
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30">
                  <div className="grid grid-cols-2 gap-3 w-24 h-24 mb-5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(196,149,106,0.06)", border: "1px dashed rgba(196,149,106,0.12)" }}
                      >
                        <ImagePlus className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.9rem" }}>{t("tryPreview")}</p>
                  <p className="mt-1 text-center px-8" style={{ fontSize: "0.75rem" }}>{t("tryPreviewHint")}</p>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      {/* Browser Login Modal for 401 flow */}
      <BrowserLoginModal
        isOpen={browserLoginOpen}
        taskId={browserLoginTaskId}
        onClose={() => setBrowserLoginOpen(false)}
        onLoginSuccess={handleBrowserLoginSuccess}
      />

      <style>{`
        @keyframes productSlide {
          0% { transform: translateX(-100%); width: 40%; }
          50% { width: 60%; }
          100% { transform: translateX(350%); width: 40%; }
        }
        .medium-zoom-overlay {
          z-index: 99999 !important;
        }
        .medium-zoom-image--opened {
          z-index: 100000 !important;
          max-width: calc(100vw - 48px) !important;
          max-height: calc(100vh - 48px) !important;
        }
        .seed-sparkle {
          animation: seedSparkle 1.2s ease-in-out infinite;
        }
        .seed-shimmer {
          background: linear-gradient(120deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.22) 35%, rgba(255,255,255,0.0) 70%);
          animation: seedShimmer 1.6s ease-in-out infinite;
        }
        .seed-pill {
          animation: seedPulse 1.8s ease-in-out infinite;
        }
        @keyframes seedSparkle {
          0% { transform: rotate(-6deg) scale(1); }
          50% { transform: rotate(10deg) scale(1.08); }
          100% { transform: rotate(-6deg) scale(1); }
        }
        @keyframes seedShimmer {
          0% { transform: translateX(-30%); }
          100% { transform: translateX(30%); }
        }
        @keyframes seedPulse {
          0% { box-shadow: 0 0 0 0 rgba(160,113,74,0.22); }
          70% { box-shadow: 0 0 0 10px rgba(160,113,74,0.0); }
          100% { box-shadow: 0 0 0 0 rgba(160,113,74,0.0); }
        }
      `}</style>
    </section>
  );
}
