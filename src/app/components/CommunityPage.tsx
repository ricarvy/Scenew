import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router";
import { Download, ExternalLink, ShoppingBag, Calendar, X as XIcon, Shirt } from "lucide-react";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import { TypewriterText } from "./TypewriterText";
import { GlowOrb } from "./WarmGlow";
import { useI18n } from "./I18nContext";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

type MarkerNode = {
  group: THREE.Group;
  avatarTexture: THREE.Texture;
  pinMaterial: THREE.Material;
  spriteMaterial: THREE.Material;
  baseY: number;
  phase: number;
  speed: number;
  bornAt: number;
};

const COMMUNITY_TITLE = "加入Scenew，与全球用户分享你的世界";
const COMMUNITY_TITLE_EN = "Join Scenew, share your world globally";
const MAP_WIDTH = 10.8;
const MAP_HEIGHT = 5.8;

const USER_LOCATIONS = [
  { lon: -74.0, lat: 40.7 }, { lon: -118.2, lat: 34.1 }, { lon: -43.2, lat: -22.9 }, { lon: -0.1, lat: 51.5 },
  { lon: 2.35, lat: 48.85 }, { lon: 13.4, lat: 52.5 }, { lon: 37.6, lat: 55.7 }, { lon: 77.2, lat: 28.6 },
  { lon: 72.8, lat: 19.1 }, { lon: 116.4, lat: 39.9 }, { lon: 121.5, lat: 31.2 }, { lon: 139.7, lat: 35.6 },
  { lon: 151.2, lat: -33.8 }, { lon: 144.9, lat: -37.8 }, { lon: 103.8, lat: 1.3 }, { lon: 100.5, lat: 13.7 },
  { lon: 106.8, lat: -6.2 }, { lon: 55.3, lat: 25.2 }, { lon: 46.7, lat: 24.7 }, { lon: 31.2, lat: 30.0 },
  { lon: 36.8, lat: -1.3 }, { lon: 28.0, lat: -26.2 }, { lon: -99.1, lat: 19.4 }, { lon: -70.7, lat: -33.4 },
  { lon: -3.7, lat: 40.4 }, { lon: 12.5, lat: 41.9 }, { lon: 18.1, lat: 59.3 }, { lon: 174.8, lat: -36.8 },
  { lon: -79.4, lat: 43.7 }, { lon: -123.1, lat: 49.2 }, { lon: 114.2, lat: 22.3 }, { lon: 121.0, lat: 14.6 },
];

type CommunityFeedItem = {
  id: number;
  generation_id: number;
  published_at?: string | null;
  user_name: string;
  user_avatar?: string | null;
  cover_image: string;
  generated_images?: string[];
  product_images?: string[];
  product_titles?: string[];
  content: string;
  generated_copy?: string;
  scene_description?: string;
  mode?: string;
};

function createAvatarTexture(seed: number) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const hue = (seed * 37) % 360;
  const bg = `hsl(${hue}, 70%, 55%)`;
  const fg = "#fffaf2";

  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, size, size);

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size / 2, size * 0.43, size * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = fg;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size / 2, size * 0.72, size * 0.26, 0, Math.PI * 2);
  ctx.fillStyle = fg;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createMapTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#12263A");
  gradient.addColorStop(1, "#0C1A2A");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(152, 192, 235, 0.18)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 12; i += 1) {
    const x = (canvas.width / 12) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let i = 1; i < 6; i += 1) {
    const y = (canvas.height / 6) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const drawLand = (points: Array<[number, number]>, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    points.forEach(([x, y], idx) => {
      if (idx === 0) ctx.moveTo(x * canvas.width, y * canvas.height);
      else ctx.lineTo(x * canvas.width, y * canvas.height);
    });
    ctx.closePath();
    ctx.fill();
  };

  drawLand(
    [[0.08, 0.26], [0.2, 0.18], [0.29, 0.26], [0.27, 0.38], [0.2, 0.48], [0.12, 0.43], [0.07, 0.33]],
    "#2A5E7A",
  );
  drawLand(
    [[0.22, 0.48], [0.28, 0.52], [0.29, 0.62], [0.26, 0.75], [0.2, 0.84], [0.15, 0.72], [0.18, 0.58]],
    "#2B6A83",
  );
  drawLand(
    [[0.43, 0.2], [0.52, 0.16], [0.61, 0.2], [0.62, 0.32], [0.56, 0.36], [0.48, 0.34], [0.41, 0.29]],
    "#2D6D86",
  );
  drawLand(
    [[0.49, 0.38], [0.55, 0.39], [0.59, 0.46], [0.56, 0.6], [0.53, 0.73], [0.47, 0.67], [0.45, 0.52]],
    "#347A96",
  );
  drawLand(
    [[0.62, 0.22], [0.79, 0.23], [0.88, 0.31], [0.86, 0.4], [0.77, 0.45], [0.69, 0.42], [0.63, 0.34]],
    "#2C637E",
  );
  drawLand(
    [[0.77, 0.61], [0.86, 0.63], [0.9, 0.71], [0.87, 0.8], [0.8, 0.78], [0.75, 0.69]],
    "#306F8A",
  );

  ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function lonLatToXY(lon: number, lat: number) {
  const x = (lon / 180) * (MAP_WIDTH / 2);
  const y = (lat / 90) * (MAP_HEIGHT / 2);
  return { x, y };
}

function pickBatch(count: number) {
  const pool = [...USER_LOCATIONS];
  const batch: Array<{ lon: number; lat: number }> = [];
  while (batch.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    batch.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return batch;
}

function WorldMapPanel() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = Math.max(420, mount.clientHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fdf9f4");

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.65);
    directionalLight.position.set(0, 5, 8);
    scene.add(ambientLight, directionalLight);

    const mapGroup = new THREE.Group();
    scene.add(mapGroup);

    const mapTexture = createMapTexture();
    const planeGeometry = new THREE.PlaneGeometry(MAP_WIDTH, MAP_HEIGHT);
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: mapTexture || undefined,
      color: mapTexture ? "#ffffff" : "#1f3f58",
      roughness: 0.85,
      metalness: 0.05,
    });
    const mapPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    mapGroup.add(mapPlane);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(MAP_WIDTH * 1.05, MAP_HEIGHT * 1.05),
      new THREE.MeshBasicMaterial({
        color: "#d4af37",
        transparent: true,
        opacity: 0.08,
      }),
    );
    glow.position.z = -0.06;
    mapGroup.add(glow);

    const markerLayer = new THREE.Group();
    markerLayer.position.z = 0.12;
    mapGroup.add(markerLayer);
    let markers: MarkerNode[] = [];

    const clearMarkers = () => {
      markers.forEach((m) => {
        markerLayer.remove(m.group);
        m.avatarTexture.dispose();
        m.pinMaterial.dispose();
        m.spriteMaterial.dispose();
      });
      markers = [];
    };

    const spawnBatch = () => {
      clearMarkers();
      const batch = pickBatch(10);
      batch.forEach((loc, idx) => {
        const { x, y } = lonLatToXY(loc.lon, loc.lat);
        const avatarTexture = createAvatarTexture(Math.floor(Math.random() * 999) + idx);
        if (!avatarTexture) return;

        const markerGroup = new THREE.Group();
        markerGroup.position.set(x, y, 0);

        const pinGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -0.18, 0),
          new THREE.Vector3(0, 0.25, 0),
        ]);
        const pinMaterial = new THREE.LineBasicMaterial({
          color: "#d4af37",
          transparent: true,
          opacity: 0.75,
        });
        const pin = new THREE.Line(pinGeometry, pinMaterial);
        markerGroup.add(pin);

        const spriteMaterial = new THREE.SpriteMaterial({
          map: avatarTexture,
          transparent: true,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.34, 0.34, 0.34);
        sprite.position.set(0, 0.33, 0);
        markerGroup.add(sprite);

        markerLayer.add(markerGroup);
        markers.push({
          group: markerGroup,
          avatarTexture,
          pinMaterial,
          spriteMaterial,
          baseY: y,
          phase: Math.random() * Math.PI * 2,
          speed: 1.2 + Math.random() * 0.8,
          bornAt: performance.now(),
        });
      });
    };

    spawnBatch();
    const markerInterval = window.setInterval(spawnBatch, 5000);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      mapGroup.rotation.x = Math.sin(t * 0.22) * 0.02;
      mapGroup.position.y = Math.sin(t * 0.28) * 0.04;
      markers.forEach((marker) => {
        const age = (performance.now() - marker.bornAt) / 1000;
        const rise = Math.min(age * 0.08, 0.2);
        const wave = Math.sin(t * marker.speed + marker.phase) * 0.05;
        marker.group.position.y = marker.baseY + rise + wave;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = Math.max(420, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(markerInterval);
      window.removeEventListener("resize", onResize);
      clearMarkers();
      planeGeometry.dispose();
      planeMaterial.dispose();
      if (mapTexture) mapTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[64vh] min-h-[440px]" />;
}

type TimelineItem = {
  id: number;
  generationId: number;
  date: string;
  user: string;
  avatar: string;
  content: string;
  tag: string;
  cover: string;
  images: string[];
  productImages: string[];
  productTitles: string[];
  mode: "copy" | "inspire";
};

function CommunityTimeline({
  lang,
  feedData,
  loading,
  onOpenDetail,
}: {
  lang: string;
  feedData: CommunityFeedItem[];
  loading: boolean;
  onOpenDetail: (item: TimelineItem) => void;
}) {
  const feed = useMemo(
    () => {
      if (feedData.length > 0) {
        return feedData.map((item) => ({
          id: item.id,
          generationId: item.generation_id,
          date: item.published_at
            ? new Date(item.published_at).toLocaleString(lang === "zh" ? "zh-CN" : "en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : (lang === "zh" ? "刚刚" : "Just now"),
          user: item.user_name,
          avatar: item.user_avatar || "https://i.pravatar.cc/120?img=8",
          content: item.content || (lang === "zh" ? "发布了一条社区动态" : "Published a community update."),
          tag:
            item.mode === "copy"
              ? (lang === "zh" ? "#做同款" : "#SameStyle")
              : (lang === "zh" ? "#新灵感" : "#NewInspiration"),
          cover: item.cover_image,
          images: item.generated_images && item.generated_images.length > 0 ? item.generated_images : [item.cover_image],
          productImages: item.product_images || [],
          productTitles: item.product_titles || [],
          mode: item.mode === "copy" ? "copy" : "inspire",
        }));
      }
      return lang === "zh"
        ? [
            { id: -1, generationId: -1, date: "今天 20:16", user: "Luna · 上海", avatar: "https://i.pravatar.cc/120?img=11", content: "发布了新场景：雨夜霓虹感穿搭，已收到 36 次收藏", tag: "#城市夜景", cover: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -2, generationId: -2, date: "今天 18:42", user: "Mika · 东京", avatar: "https://i.pravatar.cc/120?img=5", content: "分享了春季通勤胶囊衣橱模板，正在被 14 个国家用户复用", tag: "#通勤风", cover: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "inspire" },
            { id: -3, generationId: -3, date: "今天 16:09", user: "Aria · 巴黎", avatar: "https://i.pravatar.cc/120?img=32", content: "上传了法式街拍灵感板，新增 120 点互动热度", tag: "#法式穿搭", cover: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -4, generationId: -4, date: "今天 12:31", user: "Nora · 纽约", avatar: "https://i.pravatar.cc/120?img=47", content: "将生成结果同步到社区合集，评论区开启问答模式", tag: "#街头风", cover: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -5, generationId: -5, date: "今天 09:55", user: "Aanya · 孟买", avatar: "https://i.pravatar.cc/120?img=24", content: "完成了夏季配色挑战，上传 3 组多语种场景描述", tag: "#色彩挑战", cover: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "inspire" },
          ]
        : [
            { id: -1, generationId: -1, date: "Today 20:16", user: "Luna · Shanghai", avatar: "https://i.pravatar.cc/120?img=11", content: "Published a neon-night styling scene and gained 36 saves.", tag: "#CityLights", cover: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -2, generationId: -2, date: "Today 18:42", user: "Mika · Tokyo", avatar: "https://i.pravatar.cc/120?img=5", content: "Shared a spring capsule template reused by creators in 14 countries.", tag: "#OfficeStyle", cover: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "inspire" },
            { id: -3, generationId: -3, date: "Today 16:09", user: "Aria · Paris", avatar: "https://i.pravatar.cc/120?img=32", content: "Uploaded a French street-style board with rising engagement.", tag: "#FrenchLook", cover: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -4, generationId: -4, date: "Today 12:31", user: "Nora · New York", avatar: "https://i.pravatar.cc/120?img=47", content: "Synced generation results to community collection with Q&A enabled.", tag: "#Streetwear", cover: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -5, generationId: -5, date: "Today 09:55", user: "Aanya · Mumbai", avatar: "https://i.pravatar.cc/120?img=24", content: "Finished summer palette challenge and posted 3 multilingual prompts.", tag: "#ColorChallenge", cover: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "inspire" },
          ];
    },
    [feedData, lang],
  );

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        {lang === "zh" ? "正在加载社区动态..." : "Loading community feed..."}
      </div>
    );
  }

  return (
    <div className="relative px-2 py-3 md:px-6 md:py-6">
      <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-[#A0714A]/20 via-[#A0714A]/40 to-transparent hidden md:block" />
      <div className="space-y-8">
        {feed.map((item, index) => (
          <div
            key={`${item.user}-${index}`}
            className={`group relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-0 z-20 flex flex-col items-center h-full pointer-events-none hidden md:flex">
              <div className="w-4 h-4 rounded-full border-2 border-[#A0714A] bg-[#FDF9F4] group-hover:bg-[#A0714A] transition-colors shadow-[0_0_0_4px_rgba(253,249,244,0.5)] mt-8 relative z-10" />
              <span className="mt-2 text-xs font-medium text-[#A0714A] bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[#E8C3BA]/20 whitespace-nowrap shadow-sm z-0">
                {item.date}
              </span>
            </div>
            <div className="hidden md:block w-5/12" />
            <div className="w-full md:w-5/12">
              <div
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#D4AF37]/10 border border-[#E8C3BA]/20 transition-all duration-300 cursor-pointer"
                onClick={() => onOpenDetail(item)}
              >
                <div className="w-full aspect-video overflow-hidden bg-[#f4ede4]">
                  <img
                    src={item.cover}
                    alt={item.tag}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                <div className="md:hidden text-xs text-[#A0714A] mb-2">{item.date}</div>
                <div className="flex items-center gap-3 mb-3">
                  <img src={item.avatar} alt={item.user} className="w-9 h-9 rounded-full object-cover border border-[#E8C3BA]/40" />
                  <div>
                    <p className="text-sm font-medium text-[#5C3D24]">{item.user}</p>
                    <p className="text-xs text-[#A0714A]">{item.tag}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommunityPage() {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"timeline" | "world">("timeline");
  const [timelineFeed, setTimelineFeed] = useState<CommunityFeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<TimelineItem | null>(null);
  const [addingWardrobeBulk, setAddingWardrobeBulk] = useState(false);

  useEffect(() => {
    const loadFeed = async () => {
      setLoadingFeed(true);
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
        const res = await fetch(`${API_BASE}/community/feed?limit=40`);
        if (res.ok) {
          const data = await res.json();
          setTimelineFeed(Array.isArray(data) ? data : []);
        } else {
          setTimelineFeed([]);
        }
      } catch (err) {
        console.error("Failed to load community feed", err);
        setTimelineFeed([]);
      } finally {
        setLoadingFeed(false);
      }
    };
    loadFeed();
  }, []);

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `scenew-community-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddAllToWardrobe = async () => {
    if (!selectedTimelineItem) return;
    const token = localStorage.getItem("token");
    if (!token) {
      window.dispatchEvent(new Event("scenew:unauthorized"));
      return;
    }
    setAddingWardrobeBulk(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      const catRes = await fetch(`${API_BASE}/wardrobe/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let targetCategory = "dress";
      if (catRes.ok) {
        const cats: Array<{ id: number; name: string }> = await catRes.json();
        if (cats.length > 0) targetCategory = cats[0].name;
      }

      const productImages = selectedTimelineItem.productImages || [];
      const productTitles = selectedTimelineItem.productTitles || [];
      if (productImages.length === 0) {
        toast.info(lang === "zh" ? "该动态暂无商品图可加入衣橱" : "No product images in this post");
        return;
      }
      await Promise.all(
        productImages.map((img, idx) =>
          fetch(`${API_BASE}/wardrobe/items`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              category: targetCategory,
              product_image_url: img,
              product_title: productTitles[idx] || "",
              source_generation_id: selectedTimelineItem.generationId > 0 ? selectedTimelineItem.generationId : null,
            }),
          }).then((res) => {
            if (!res.ok) throw new Error("add wardrobe failed");
          }),
        ),
      );
      toast.success(lang === "zh" ? "已一键加入衣橱" : "Added all to wardrobe");
    } catch (err) {
      console.error(err);
      toast.error(lang === "zh" ? "加入衣橱失败" : "Failed to add to wardrobe");
    } finally {
      setAddingWardrobeBulk(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F4] pt-24 pb-10 px-6">
      <GlowOrb className="-top-20 -right-40" color="rgba(212, 165, 116, 0.15)" size="700px" blur="140px" />
      <GlowOrb className="-bottom-32 -left-48" color="rgba(196, 149, 106, 0.12)" size="600px" blur="120px" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <TypewriterText
            key={`community-title-${lang}`}
            text={lang === "zh" ? COMMUNITY_TITLE : COMMUNITY_TITLE_EN}
            as="h2"
            typeSpeed={50}
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.2 }}
            className="text-[#5C3D24]"
          />
        </div>

        <div
          className="flex rounded-xl p-1 relative max-w-md mx-auto mb-6"
          style={{ background: "rgba(237,229,216,0.4)", border: "1px solid rgba(196,149,106,0.08)" }}
        >
          {([
            { key: "timeline", label: lang === "zh" ? "时间轴" : "Timeline" },
            { key: "world", label: lang === "zh" ? "世界各地" : "Worldwide" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 relative z-10 py-2.5 rounded-lg transition-all duration-300"
              style={{
                fontSize: "0.9rem",
                letterSpacing: "0.03em",
                color: activeTab === tab.key ? "#5C3D24" : "rgba(139,94,60,0.55)",
                background:
                  activeTab === tab.key
                    ? "linear-gradient(145deg, rgba(255,252,248,0.95) 0%, rgba(253,249,244,0.9) 100%)"
                    : "transparent",
                boxShadow:
                  activeTab === tab.key
                    ? "0 2px 8px rgba(139,94,60,0.08), 0 0 0 1px rgba(196,149,106,0.1)"
                    : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-[#E8C3BA]/40 bg-white/50 shadow-xl shadow-[#A0714A]/10 overflow-hidden">
          {activeTab === "timeline" ? (
            <CommunityTimeline
              lang={lang}
              feedData={timelineFeed}
              loading={loadingFeed}
              onOpenDetail={(item) => setSelectedTimelineItem(item)}
            />
          ) : <WorldMapPanel />}
        </div>
      </div>

      {selectedTimelineItem && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTimelineItem(null)}
          />

          <div className="relative w-full max-w-5xl h-[85vh] bg-[#FDF9F4] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <button
              onClick={() => setSelectedTimelineItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <div className="w-full md:w-3/5 bg-[#FDF9F4] relative flex items-center justify-center h-1/2 md:h-full overflow-hidden">
              <Swiper
                modules={[Pagination, Navigation, EffectCoverflow]}
                effect="coverflow"
                pagination={{ clickable: true }}
                navigation={true}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                coverflowEffect={{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: false }}
                className="w-full h-full"
              >
                {(selectedTimelineItem.images?.length ? selectedTimelineItem.images : [selectedTimelineItem.cover]).map((img, idx) => (
                  <SwiperSlide key={idx} className="flex items-center justify-center bg-transparent relative group !w-auto">
                    <img src={img} alt={`Result ${idx + 1}`} className="w-auto h-full object-contain max-h-[85vh] p-4 md:p-8 block" />
                    <button
                      onClick={() => handleDownload(img)}
                      className="absolute bottom-8 right-8 px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm font-medium z-10"
                    >
                      <Download className="w-4 h-4" />
                      {lang === "zh" ? "下载图片" : "Download"}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto h-1/2 md:h-full border-l border-[#E8C3BA]/20 bg-white/50 backdrop-blur-sm">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <img src={selectedTimelineItem.avatar} alt={selectedTimelineItem.user} className="w-10 h-10 rounded-full object-cover border border-[#E8C3BA]/40" />
                  <span className="px-2.5 py-0.5 rounded-full bg-[#A0714A]/10 text-[#A0714A] text-xs font-medium border border-[#A0714A]/20">
                    {selectedTimelineItem.mode === "copy" ? (lang === "zh" ? "做同款" : "Same Style") : (lang === "zh" ? "新灵感" : "Inspire")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#5C3D24]">{selectedTimelineItem.user}</p>
                  <p className="text-xs text-[#A0714A] flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {selectedTimelineItem.date} · {selectedTimelineItem.tag}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-serif text-[#5C3D24] leading-tight mb-4">
                {lang === "zh" ? "社区动态文案" : "Community Post Copy"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {selectedTimelineItem.content || "-"}
              </p>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-[#5C3D24] uppercase tracking-wider mb-3 border-b border-[#E8C3BA]/20 pb-2">
                  {lang === "zh" ? "商品图" : "Product Images"}
                </h3>
                {selectedTimelineItem.productImages?.length ? (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedTimelineItem.productImages.map((img, idx) => (
                      <div key={`${img}-${idx}`} className="rounded-lg overflow-hidden border border-[#E8C3BA]/30 bg-white">
                        <img src={img} className="w-full h-20 object-cover" alt={`Product ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">{lang === "zh" ? "暂无商品图" : "No product images"}</p>
                )}
              </div>

              <div className="pt-6 border-t border-[#E8C3BA]/20 flex flex-col gap-3 mt-6">
                <button
                  onClick={() => handleDownload((selectedTimelineItem.images?.length ? selectedTimelineItem.images : [selectedTimelineItem.cover])[0])}
                  className="w-full py-3 rounded-xl bg-[#5C3D24] text-white font-medium hover:bg-[#4A311D] transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {lang === "zh" ? "下载图片" : "Download"}
                </button>
                <button
                  onClick={handleAddAllToWardrobe}
                  disabled={addingWardrobeBulk}
                  className="w-full py-3 rounded-xl bg-[#A0714A] text-white font-medium hover:bg-[#8B5E3C] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Shirt className="w-4 h-4" />
                  {addingWardrobeBulk
                    ? (lang === "zh" ? "处理中..." : "Saving...")
                    : (lang === "zh" ? "一键加入衣橱" : "Add All to Wardrobe")}
                </button>
                <button
                  onClick={() => navigate("/try")}
                  className="w-full py-3 rounded-xl border border-[#A0714A] text-[#A0714A] font-medium hover:bg-[#A0714A]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {lang === "zh" ? "生成同款" : "Generate Similar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
