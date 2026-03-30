import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useNavigate } from "react-router";
import { Download, ExternalLink, Calendar, X as XIcon, Shirt } from "lucide-react";
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

type GlobeDistributionPoint = {
  key: string;
  lon: number;
  lat: number;
  weight: number;
  label: string;
  userId?: number;
  avatarUrl?: string;
  latestItem?: CommunityFeedItem;
};

type GlobeMarkerNode = {
  group: THREE.Group;
  normal: THREE.Vector3;
  baseRadius: number;
  floatAmplitude: number;
  floatSpeed: number;
  phase: number;
  avatar: THREE.Sprite;
  halo: THREE.Sprite;
  haloMaterial: THREE.SpriteMaterial;
  orbitRingA: THREE.Mesh;
  orbitRingB: THREE.Mesh;
  basePulse: THREE.Sprite;
  basePulseMaterial: THREE.SpriteMaterial;
};

const GLOBE_RADIUS = 2.75;
const EARTH_TEXTURES = {
  day: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  normal: "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
  specular: "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
  clouds: "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
};

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

const COMMUNITY_TEXTS = {
  zh: {
    title: "加入Scenew，与全球用户分享你的世界",
    timeline: "时间轴",
    world: "世界各地",
    loading: "正在加载社区动态...",
    justNow: "刚刚",
    userPlaceholder: "社区用户",
    postFallback: "发布了一条社区动态",
    tagSame: "#做同款",
    tagNew: "#新灵感",
    globalDistribution: "全球发布分布",
    activeNodes: (n: number) => `覆盖城市点位 ${n}`,
    totalPosts: (n: number) => `累计发布 ${n}`,
    posts: (n: number) => `发布 ${n}`,
    noProductImages: "暂无商品图",
    copyTitle: "社区动态文案",
    productImages: "商品图",
    download: "下载图片",
    processing: "处理中...",
    saving: "Saving...",
    addAllWardrobe: "一键加入衣橱",
    noImagesInPost: "该动态暂无商品图可加入衣橱",
    addedWardrobe: "已一键加入衣橱",
    addWardrobeFailed: "加入衣橱失败",
    modeSame: "做同款",
    modeInspire: "新灵感",
    generateSimilar: "生成同款",
  },
  en: {
    title: "Join Scenew, share your world globally",
    timeline: "Timeline",
    world: "Worldwide",
    loading: "Loading community feed...",
    justNow: "Just now",
    userPlaceholder: "Community User",
    postFallback: "Published a community update.",
    tagSame: "#SameStyle",
    tagNew: "#NewInspiration",
    globalDistribution: "Global Distribution",
    activeNodes: (n: number) => `${n} active city nodes`,
    totalPosts: (n: number) => `${n} total published posts`,
    posts: (n: number) => `${n} posts`,
    noProductImages: "No product images",
    copyTitle: "Community Post Copy",
    productImages: "Product Images",
    download: "Download",
    processing: "Processing...",
    saving: "Saving...",
    addAllWardrobe: "Add All to Wardrobe",
    noImagesInPost: "No product images in this post",
    addedWardrobe: "Added all to wardrobe",
    addWardrobeFailed: "Failed to add to wardrobe",
    modeSame: "Same Style",
    modeInspire: "Inspire",
    generateSimilar: "Generate Similar",
  },
  hi: {
    title: "Scenew में शामिल हों, दुनिया के साथ अपनी दुनिया साझा करें",
    timeline: "टाइमलाइन",
    world: "दुनियाभर",
    loading: "समुदाय फीड लोड हो रहा है...",
    justNow: "अभी",
    userPlaceholder: "कम्युनिटी यूज़र",
    postFallback: "एक कम्युनिटी अपडेट प्रकाशित किया।",
    tagSame: "#SameStyle",
    tagNew: "#NewInspiration",
    globalDistribution: "वैश्विक वितरण",
    activeNodes: (n: number) => `${n} सक्रिय शहर नोड`,
    totalPosts: (n: number) => `${n} कुल प्रकाशित पोस्ट`,
    posts: (n: number) => `${n} पोस्ट`,
    noProductImages: "कोई प्रोडक्ट इमेज नहीं",
    copyTitle: "कम्युनिटी पोस्ट कॉपी",
    productImages: "प्रोडक्ट इमेज",
    download: "डाउनलोड",
    processing: "प्रोसेस हो रहा है...",
    saving: "सेव हो रहा है...",
    addAllWardrobe: "सभी वार्डरोब में जोड़ें",
    noImagesInPost: "इस पोस्ट में प्रोडक्ट इमेज नहीं है",
    addedWardrobe: "सभी वार्डरोब में जोड़ दिए गए",
    addWardrobeFailed: "वार्डरोब में जोड़ना विफल",
    modeSame: "Same Style",
    modeInspire: "Inspire",
    generateSimilar: "मिलता-जुलता बनाएं",
  },
  es: {
    title: "Unete a Scenew y comparte tu mundo con usuarios globales",
    timeline: "Cronologia",
    world: "Mundo",
    loading: "Cargando comunidad...",
    justNow: "Ahora",
    userPlaceholder: "Usuario",
    postFallback: "Publico una actualizacion de comunidad.",
    tagSame: "#SameStyle",
    tagNew: "#NewInspiration",
    globalDistribution: "Distribucion global",
    activeNodes: (n: number) => `${n} nodos activos`,
    totalPosts: (n: number) => `${n} publicaciones totales`,
    posts: (n: number) => `${n} publicaciones`,
    noProductImages: "Sin imagenes de producto",
    copyTitle: "Texto de la publicacion",
    productImages: "Imagenes de producto",
    download: "Descargar",
    processing: "Procesando...",
    saving: "Guardando...",
    addAllWardrobe: "Agregar todo al armario",
    noImagesInPost: "No hay imagenes de producto en esta publicacion",
    addedWardrobe: "Agregado al armario",
    addWardrobeFailed: "Error al agregar al armario",
    modeSame: "Same Style",
    modeInspire: "Inspire",
    generateSimilar: "Generar similar",
  },
  ar: {
    title: "انضم الى Scenew وشارك عالمك مع المستخدمين حول العالم",
    timeline: "الخط الزمني",
    world: "حول العالم",
    loading: "جار تحميل المجتمع...",
    justNow: "الان",
    userPlaceholder: "مستخدم المجتمع",
    postFallback: "نشر تحديثا في المجتمع.",
    tagSame: "#SameStyle",
    tagNew: "#NewInspiration",
    globalDistribution: "التوزيع العالمي",
    activeNodes: (n: number) => `${n} عقدة نشطة`,
    totalPosts: (n: number) => `${n} منشورا`,
    posts: (n: number) => `${n} منشور`,
    noProductImages: "لا توجد صور منتجات",
    copyTitle: "نص المنشور",
    productImages: "صور المنتجات",
    download: "تنزيل",
    processing: "جار المعالجة...",
    saving: "جار الحفظ...",
    addAllWardrobe: "اضافة الكل الى الخزانة",
    noImagesInPost: "لا توجد صور منتجات في هذا المنشور",
    addedWardrobe: "تمت الاضافة الى الخزانة",
    addWardrobeFailed: "فشل الاضافة الى الخزانة",
    modeSame: "Same Style",
    modeInspire: "Inspire",
    generateSimilar: "انشاء مشابه",
  },
  fr: {
    title: "Rejoignez Scenew et partagez votre monde avec la communaute mondiale",
    timeline: "Chronologie",
    world: "Monde",
    loading: "Chargement de la communaute...",
    justNow: "A l'instant",
    userPlaceholder: "Utilisateur",
    postFallback: "A publie une mise a jour communautaire.",
    tagSame: "#SameStyle",
    tagNew: "#NewInspiration",
    globalDistribution: "Distribution mondiale",
    activeNodes: (n: number) => `${n} villes actives`,
    totalPosts: (n: number) => `${n} publications`,
    posts: (n: number) => `${n} posts`,
    noProductImages: "Aucune image produit",
    copyTitle: "Texte de la publication",
    productImages: "Images produit",
    download: "Telecharger",
    processing: "Traitement...",
    saving: "Enregistrement...",
    addAllWardrobe: "Tout ajouter a la garde-robe",
    noImagesInPost: "Pas d'images produit dans ce post",
    addedWardrobe: "Ajoute a la garde-robe",
    addWardrobeFailed: "Echec de l'ajout",
    modeSame: "Same Style",
    modeInspire: "Inspire",
    generateSimilar: "Generer similaire",
  },
  ja: {
    title: "Scenewに参加して世界中のユーザーとあなたの世界を共有しよう",
    timeline: "タイムライン",
    world: "世界各地",
    loading: "コミュニティを読み込み中...",
    justNow: "たった今",
    userPlaceholder: "コミュニティユーザー",
    postFallback: "コミュニティ投稿を公開しました。",
    tagSame: "#SameStyle",
    tagNew: "#NewInspiration",
    globalDistribution: "グローバル分布",
    activeNodes: (n: number) => `アクティブ都市 ${n}`,
    totalPosts: (n: number) => `投稿数 ${n}`,
    posts: (n: number) => `${n} 件`,
    noProductImages: "商品画像がありません",
    copyTitle: "コミュニティ投稿文",
    productImages: "商品画像",
    download: "ダウンロード",
    processing: "処理中...",
    saving: "保存中...",
    addAllWardrobe: "一括でワードローブへ追加",
    noImagesInPost: "この投稿には商品画像がありません",
    addedWardrobe: "ワードローブに追加しました",
    addWardrobeFailed: "追加に失敗しました",
    modeSame: "Same Style",
    modeInspire: "Inspire",
    generateSimilar: "同様に生成",
  },
} as const;

type CommunityFeedItem = {
  id: number;
  user_id: number;
  generation_id: number;
  published_at?: string | null;
  user_name: string;
  user_avatar?: string | null;
  cover_image: string;
  generated_images?: string[];
  product_images?: string[];
  product_titles?: string[];
  product_links?: Array<{
    url?: string;
    title?: string;
    selected_image?: string;
    platform?: string;
    shop_name?: string;
    price?: string;
    currency?: string;
  }>;
  product_input_mode?: "link" | "image";
  content: string;
  generated_copy?: string;
  scene_description?: string;
  mode?: string;
};

function toStableAvatarUrl(rawUrl: string | null | undefined, apiBase: string): string | undefined {
  const value = (rawUrl || "").trim();
  if (!value) return undefined;
  const normalizedApiBase = (apiBase || "").replace(/\/$/, "");

  if (value.startsWith("/")) {
    return normalizedApiBase ? `${normalizedApiBase}${value}` : value;
  }

  const isAbsolute = value.startsWith("http://") || value.startsWith("https://");
  if (!isAbsolute) return value;

  const proxyBase = normalizedApiBase || (typeof window !== "undefined" ? window.location.origin : "");
  if (!proxyBase) return value;
  return `${proxyBase}/auth/avatar-proxy?url=${encodeURIComponent(value)}`;
}

function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.02, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 223, 153, 0.95)");
  gradient.addColorStop(0.4, "rgba(255, 185, 80, 0.6)");
  gradient.addColorStop(1, "rgba(255, 185, 80, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createAvatarFallbackTexture(name: string, seed: number) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const hue = seed % 360;
  const bg = `hsl(${hue}, 68%, 52%)`;
  const bg2 = `hsl(${(hue + 28) % 360}, 62%, 44%)`;
  const initials = (name || "U").trim().slice(0, 2).toUpperCase();

  ctx.clearRect(0, 0, size, size);
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, bg);
  gradient.addColorStop(1, bg2);
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 235, 205, 0.95)";
  ctx.lineWidth = size * 0.035;
  ctx.stroke();

  ctx.fillStyle = "#fff8ef";
  ctx.font = `700 ${size * 0.28}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, size / 2, size / 2 + size * 0.02);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCircularAvatarTextureFromImage(image: CanvasImageSource) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(image, 0, 0, size, size);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 236, 210, 0.95)";
  ctx.lineWidth = size * 0.035;
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createGlobeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#10283F");
  gradient.addColorStop(0.6, "#173A57");
  gradient.addColorStop(1, "#0F2438");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(152, 192, 235, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 16; i += 1) {
    const x = (canvas.width / 16) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let i = 1; i < 8; i += 1) {
    const y = (canvas.height / 8) * i;
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
    "#2A6B88",
  );
  drawLand(
    [[0.22, 0.48], [0.28, 0.52], [0.29, 0.62], [0.26, 0.75], [0.2, 0.84], [0.15, 0.72], [0.18, 0.58]],
    "#2E7591",
  );
  drawLand(
    [[0.43, 0.2], [0.52, 0.16], [0.61, 0.2], [0.62, 0.32], [0.56, 0.36], [0.48, 0.34], [0.41, 0.29]],
    "#33718E",
  );
  drawLand(
    [[0.49, 0.38], [0.55, 0.39], [0.59, 0.46], [0.56, 0.6], [0.53, 0.73], [0.47, 0.67], [0.45, 0.52]],
    "#3A82A0",
  );
  drawLand(
    [[0.62, 0.22], [0.79, 0.23], [0.88, 0.31], [0.86, 0.4], [0.77, 0.45], [0.69, 0.42], [0.63, 0.34]],
    "#2E6986",
  );
  drawLand(
    [[0.77, 0.61], [0.86, 0.63], [0.9, 0.71], [0.87, 0.8], [0.8, 0.78], [0.75, 0.69]],
    "#347794",
  );

  ctx.strokeStyle = "rgba(212, 175, 55, 0.36)";
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildGlobeDistribution(feedData: CommunityFeedItem[], lang: string, apiBase: string): GlobeDistributionPoint[] {
  if (feedData.length === 0) {
    return USER_LOCATIONS.slice(0, 16).map((loc, idx) => ({
      key: `fallback-${idx}`,
      lon: loc.lon,
      lat: loc.lat,
      weight: 1 + (idx % 3),
      label: lang === "zh" ? "社区用户" : "Community User",
      avatarUrl: `https://i.pravatar.cc/160?img=${(idx % 68) + 1}`,
    }));
  }

  const locationMap = new Map<string, GlobeDistributionPoint>();
  feedData.forEach((item) => {
    const stableUserKey = item.user_name || `user-${item.id}`;
    const seed = hashString(`${stableUserKey}-${item.generation_id}`);
    const idx = seed % USER_LOCATIONS.length;
    const loc = USER_LOCATIONS[idx];
    const existing = locationMap.get(stableUserKey);
    if (existing) {
      existing.weight += 1;
      return;
    }
    locationMap.set(stableUserKey, {
      key: `${stableUserKey}-${idx}`,
      lon: loc.lon,
      lat: loc.lat,
      weight: 1,
      label: item.user_name || (lang === "zh" ? "社区用户" : "Community User"),
      userId: item.user_id,
      avatarUrl: toStableAvatarUrl(item.user_avatar, apiBase),
      latestItem: item,
    });
  });

  return Array.from(locationMap.values())
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 26);
}

function WorldMapPanel({
  lang,
  points,
  onOpenDetail,
}: {
  lang: string;
  points: GlobeDistributionPoint[];
  onOpenDetail: (item: CommunityFeedItem) => void;
}) {
  const ct = COMMUNITY_TEXTS[(lang as keyof typeof COMMUNITY_TEXTS)] || COMMUNITY_TEXTS.en;
  const mountRef = useRef<HTMLDivElement | null>(null);
  const totalPosts = points.reduce((sum, item) => sum + item.weight, 0);
  const [hoveredMarker, setHoveredMarker] = useState<{
    visible: boolean;
    x: number;
    y: number;
    label: string;
    count: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    label: "",
    count: 0,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = Math.max(460, mount.clientHeight);

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 8.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.55;
    mount.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.45;
    controls.minDistance = 6.1;
    controls.maxDistance = 9.8;

    const ambientLight = new THREE.AmbientLight(0xcde6ff, 0.95);
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(7, 3.5, 6);
    const rimLight = new THREE.DirectionalLight(0xa6d0ff, 0.95);
    rimLight.position.set(-5, -1.5, -4);
    scene.add(ambientLight, sunLight, rimLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    let disposed = false;
    const globeTexture = createGlobeTexture();
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: globeTexture || undefined,
      color: globeTexture ? "#ffffff" : "#275578",
      shininess: 18,
      specular: new THREE.Color("#6d88a1"),
    });
    const globeMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(globeMesh);

    const cloudGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.014, 80, 80);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    globeGroup.add(cloudMesh);

    const grid = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS * 1.001, 46, 30),
      new THREE.MeshBasicMaterial({
        color: "#8cbde0",
        wireframe: true,
        transparent: true,
        opacity: 0.05,
      }),
    );
    globeGroup.add(grid);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 800;
    const starVertices = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const radius = 9 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      starVertices[i * 3] = x;
      starVertices[i * 3 + 1] = y;
      starVertices[i * 3 + 2] = z;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({
        color: "#e5f3ff",
        size: 0.024,
        transparent: true,
        opacity: 0.72,
        sizeAttenuation: true,
      }),
    );
    scene.add(stars);

    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);
    const pulseTexture = createGlowTexture();
    const markerNodes: GlobeMarkerNode[] = [];
    const markerAvatars: THREE.Sprite[] = [];
    const markerGeometries: THREE.BufferGeometry[] = [];
    const markerMaterials: THREE.Material[] = [];
    const loadedTextures: THREE.Texture[] = [];
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hoveredKey = "";

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const textureLoader = new THREE.TextureLoader();
    const loadEarthTexture = (
      url: string,
      apply: (texture: THREE.Texture) => void,
      options?: { color?: boolean; wrap?: boolean },
    ) => {
      textureLoader.load(
        url,
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          if (options?.color) {
            texture.colorSpace = THREE.SRGBColorSpace;
          }
          texture.anisotropy = maxAnisotropy;
          if (options?.wrap) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
          }
          loadedTextures.push(texture);
          apply(texture);
        },
        undefined,
        () => {
          // Keep canvas fallback when remote texture fails.
        },
      );
    };

    loadEarthTexture(EARTH_TEXTURES.day, (texture) => {
      sphereMaterial.map = texture;
      sphereMaterial.needsUpdate = true;
    }, { color: true });

    loadEarthTexture(EARTH_TEXTURES.normal, (texture) => {
      sphereMaterial.normalMap = texture;
      sphereMaterial.normalScale = new THREE.Vector2(0.8, 0.8);
      sphereMaterial.needsUpdate = true;
    });

    loadEarthTexture(EARTH_TEXTURES.specular, (texture) => {
      sphereMaterial.specularMap = texture;
      sphereMaterial.needsUpdate = true;
    });

    loadEarthTexture(EARTH_TEXTURES.clouds, (texture) => {
      cloudMaterial.map = texture;
      cloudMaterial.needsUpdate = true;
    }, { color: true, wrap: true });

    const loadCircularAvatarTexture = (
      avatarUrl: string,
      fallbackTexture: THREE.Texture | null,
      onReady: (texture: THREE.Texture) => void,
    ) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.referrerPolicy = "no-referrer";
      image.onload = () => {
        if (disposed) return;
        const circularTexture = createCircularAvatarTextureFromImage(image);
        if (circularTexture) {
          circularTexture.anisotropy = maxAnisotropy;
          loadedTextures.push(circularTexture);
          onReady(circularTexture);
          return;
        }
        if (fallbackTexture) {
          onReady(fallbackTexture);
        }
      };
      image.onerror = () => {
        if (disposed) return;
        if (fallbackTexture) {
          onReady(fallbackTexture);
        }
      };
      image.src = avatarUrl;
    };

    const maxWeight = Math.max(...points.map((item) => item.weight), 1);
    const buildAvatarMarker = (point: GlobeDistributionPoint, idx: number, avatarTexture?: THREE.Texture) => {
      const intensity = point.weight / maxWeight;
      const normal = latLonToVector3(point.lat, point.lon, 1).normalize();

      const nodeGroup = new THREE.Group();
      nodeGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      nodeGroup.position.copy(normal.clone().multiplyScalar(GLOBE_RADIUS + 0.01));
      const pulseMaterial = new THREE.SpriteMaterial({
        map: pulseTexture || undefined,
        color: new THREE.Color("#ffcb79"),
        transparent: true,
        depthWrite: false,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      markerMaterials.push(pulseMaterial);
      const basePulse = new THREE.Sprite(pulseMaterial);
      const basePulseSize = 0.24 + intensity * 0.18;
      basePulse.scale.set(basePulseSize, basePulseSize, 1);
      basePulse.position.set(0, 0.03, 0);
      nodeGroup.add(basePulse);

      const ringRadius = 0.18 + intensity * 0.1;
      const ringTube = 0.006 + intensity * 0.003;
      const ringGeometry = new THREE.TorusGeometry(ringRadius, ringTube, 14, 48);
      const ringMaterialA = new THREE.MeshBasicMaterial({
        color: "#f9c983",
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const ringMaterialB = new THREE.MeshBasicMaterial({
        color: "#8ed6ff",
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      markerGeometries.push(ringGeometry);
      markerMaterials.push(ringMaterialA, ringMaterialB);
      const orbitRingA = new THREE.Mesh(ringGeometry, ringMaterialA);
      const orbitRingB = new THREE.Mesh(ringGeometry, ringMaterialB);
      orbitRingA.rotation.x = Math.PI / 2;
      orbitRingB.rotation.x = Math.PI / 2;
      orbitRingB.rotation.y = Math.PI / 4;
      orbitRingA.position.set(0, 0.015, 0);
      orbitRingB.position.set(0, 0.015, 0);
      nodeGroup.add(orbitRingA, orbitRingB);

      const avatarMaterial = new THREE.SpriteMaterial({
        map: avatarTexture,
        transparent: true,
        depthWrite: false,
      });
      markerMaterials.push(avatarMaterial);
      const avatar = new THREE.Sprite(avatarMaterial);
      const avatarScale = 0.24 + intensity * 0.12;
      avatar.scale.set(avatarScale, avatarScale, 1);
      avatar.position.set(0, 0.26 + intensity * 0.08, 0);
      avatar.userData = {
        markerKey: point.key,
        markerLabel: point.label,
        markerCount: point.weight,
        markerUserId: point.userId,
        markerPost: point.latestItem,
      };
      nodeGroup.add(avatar);
      markerAvatars.push(avatar);

      const haloMaterial = new THREE.SpriteMaterial({
        map: pulseTexture || undefined,
        color: new THREE.Color("#ffd28b"),
        transparent: true,
        depthWrite: false,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
      });
      markerMaterials.push(haloMaterial);
      const halo = new THREE.Sprite(haloMaterial);
      const haloScale = avatarScale * 1.6;
      halo.scale.set(haloScale, haloScale, 1);
      halo.position.set(0, 0.24 + intensity * 0.08, 0);
      nodeGroup.add(halo);

      markerGroup.add(nodeGroup);
      markerNodes.push({
        group: nodeGroup,
        normal,
        baseRadius: GLOBE_RADIUS + 0.01,
        floatAmplitude: 0.02 + intensity * 0.03,
        floatSpeed: 0.8 + intensity * 1.1,
        phase: (idx / Math.max(points.length, 1)) * Math.PI * 2,
        avatar,
        halo,
        haloMaterial,
        orbitRingA,
        orbitRingB,
        basePulse,
        basePulseMaterial: pulseMaterial,
      });
    };

    points.forEach((point, idx) => {
      const seed = hashString(`${point.key}-${point.label}-${idx}`);
      const fallbackTexture = createAvatarFallbackTexture(point.label, seed);
      if (!point.avatarUrl) {
        if (fallbackTexture) {
          fallbackTexture.anisotropy = maxAnisotropy;
          loadedTextures.push(fallbackTexture);
        }
        buildAvatarMarker(point, idx, fallbackTexture || undefined);
        return;
      }

      if (fallbackTexture) {
        fallbackTexture.anisotropy = maxAnisotropy;
        loadedTextures.push(fallbackTexture);
      }
      loadCircularAvatarTexture(point.avatarUrl, fallbackTexture, (avatarTexture) => {
        buildAvatarMarker(point, idx, avatarTexture);
      });
    });

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(markerAvatars, false);
      if (hits.length === 0) {
        if (hoveredKey) {
          hoveredKey = "";
          setHoveredMarker((prev) => ({ ...prev, visible: false }));
        }
        return;
      }
      const hit = hits[0].object as THREE.Sprite;
      const data = hit.userData as { markerKey?: string; markerLabel?: string; markerCount?: number };
      const markerKey = data.markerKey || "";
      hoveredKey = markerKey;
      setHoveredMarker({
        visible: true,
        x: event.clientX - rect.left + 12,
        y: event.clientY - rect.top - 12,
        label: data.markerLabel || ct.userPlaceholder,
        count: data.markerCount || 0,
      });
    };

    const handlePointerLeave = () => {
      hoveredKey = "";
      setHoveredMarker((prev) => ({ ...prev, visible: false }));
    };

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(markerAvatars, false);
      if (hits.length === 0) return;
      const hit = hits[0].object as THREE.Sprite;
      const data = hit.userData as {
        markerUserId?: number;
        markerPost?: CommunityFeedItem;
      };
      if (data.markerPost) {
        onOpenDetail(data.markerPost);
      }
    };

    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("click", handleClick);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      globeGroup.rotation.y += 0.00055;
      globeGroup.rotation.x = Math.sin(t * 0.2) * 0.08;
      globeGroup.position.y = Math.sin(t * 0.36) * 0.06;
      markerNodes.forEach((marker) => {
        const pulse = (Math.sin(t * marker.floatSpeed + marker.phase) + 1) / 2;
        const distance = marker.baseRadius + marker.floatAmplitude * pulse;
        marker.group.position.copy(marker.normal.clone().multiplyScalar(distance));
        const haloScale = 0.34 + pulse * 0.22;
        marker.halo.scale.set(haloScale, haloScale, 1);
        marker.haloMaterial.opacity = 0.3 + pulse * 0.45;
        marker.basePulse.scale.set(0.24 + pulse * 0.12, 0.24 + pulse * 0.12, 1);
        marker.basePulseMaterial.opacity = 0.22 + pulse * 0.36;
        marker.orbitRingA.rotation.z += 0.018;
        marker.orbitRingB.rotation.z -= 0.013;
      });
      cloudMesh.rotation.y += 0.00035;
      stars.rotation.y -= 0.0003;
      stars.rotation.x = Math.sin(t * 0.03) * 0.05;
      controls.update();

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = Math.max(460, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      setHoveredMarker((prev) => ({ ...prev, visible: false }));
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("click", handleClick);
      markerGeometries.forEach((geometry) => geometry.dispose());
      markerMaterials.forEach((material) => material.dispose());
      loadedTextures.forEach((texture) => texture.dispose());
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      if (globeTexture) globeTexture.dispose();
      if (pulseTexture) pulseTexture.dispose();
      starsGeometry.dispose();
      renderer.dispose();
      controls.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [points, lang, onOpenDetail, ct.userPlaceholder]);

  return (
    <div
      className="relative w-full h-[74vh] min-h-[560px] overflow-hidden"
      style={{
        background: "transparent",
      }}
    >
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute left-4 top-4 rounded-xl border border-[#E8C3BA]/20 bg-black/35 px-4 py-3 backdrop-blur-sm text-[#F7E4C8]">
        <p className="text-[11px] tracking-[0.16em] uppercase opacity-75">
          {ct.globalDistribution}
        </p>
        <p className="text-sm mt-1">
          {ct.activeNodes(points.length)}
        </p>
        <p className="text-xs opacity-85 mt-1">
          {ct.totalPosts(totalPosts)}
        </p>
      </div>
      {hoveredMarker.visible && (
        <div
          className="absolute z-20 pointer-events-none rounded-xl border border-[#F7D9AC]/55 bg-black/72 px-3 py-2 backdrop-blur-md text-[#FFF1D8] shadow-lg shadow-black/30"
          style={{ left: hoveredMarker.x, top: hoveredMarker.y, transform: "translateY(-100%)" }}
        >
          <p className="text-xs font-medium leading-none">{hoveredMarker.label}</p>
          <p className="text-[11px] mt-1 opacity-85 leading-none">
            {ct.posts(hoveredMarker.count)}
          </p>
        </div>
      )}
    </div>
  );
}

type TimelineItem = {
  id: number;
  userId: number;
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
  productLinks?: Array<{
    url: string;
    title: string;
    selected_image: string;
    platform: string;
    shop_name: string;
    price: string;
    currency: string;
  }>;
  productInputMode?: "link" | "image";
  mode: "copy" | "inspire";
};

type PublicUserProfile = {
  id: number;
  username: string;
  avatar_url?: string | null;
  created_at?: string | null;
  is_me: boolean;
};

function toTimelineItem(item: CommunityFeedItem, lang: string): TimelineItem {
  const ct = COMMUNITY_TEXTS[(lang as keyof typeof COMMUNITY_TEXTS)] || COMMUNITY_TEXTS.en;
  return {
    id: item.id,
    userId: item.user_id,
    generationId: item.generation_id,
    date: item.published_at
      ? new Date(item.published_at).toLocaleString(lang === "zh" ? "zh-CN" : "en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : ct.justNow,
    user: item.user_name,
    avatar: item.user_avatar || "https://i.pravatar.cc/120?img=8",
    content: item.content || ct.postFallback,
    tag:
      item.mode === "copy"
        ? ct.tagSame
        : ct.tagNew,
    cover: item.cover_image,
    images: item.generated_images && item.generated_images.length > 0 ? item.generated_images : [item.cover_image],
    productImages: item.product_images || [],
    productTitles: item.product_titles || [],
    productLinks: Array.isArray(item.product_links)
      ? item.product_links.map((l) => ({
          url: l?.url || "",
          title: l?.title || "",
          selected_image: l?.selected_image || "",
          platform: l?.platform || "",
          shop_name: l?.shop_name || "",
          price: l?.price || "",
          currency: l?.currency || "",
        }))
      : [],
    productInputMode: item.product_input_mode === "link" ? "link" : "image",
    mode: item.mode === "copy" ? "copy" : "inspire",
  };
}

function CommunityTimeline({
  lang,
  feedData,
  loading,
  onOpenDetail,
  onOpenProfile,
}: {
  lang: string;
  feedData: CommunityFeedItem[];
  loading: boolean;
  onOpenDetail: (item: TimelineItem) => void;
  onOpenProfile: (userId: number) => void;
}) {
  const ct = COMMUNITY_TEXTS[(lang as keyof typeof COMMUNITY_TEXTS)] || COMMUNITY_TEXTS.en;
  const feed = useMemo(
    () => {
      if (feedData.length > 0) {
        return feedData.map((item) => toTimelineItem(item, lang));
      }
      return lang === "zh"
        ? [
            { id: -1, userId: -1, generationId: -1, date: "今天 20:16", user: "Luna · 上海", avatar: "https://i.pravatar.cc/120?img=11", content: "发布了新场景：雨夜霓虹感穿搭，已收到 36 次收藏", tag: "#城市夜景", cover: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -2, userId: -2, generationId: -2, date: "今天 18:42", user: "Mika · 东京", avatar: "https://i.pravatar.cc/120?img=5", content: "分享了春季通勤胶囊衣橱模板，正在被 14 个国家用户复用", tag: "#通勤风", cover: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "inspire" },
            { id: -3, userId: -3, generationId: -3, date: "今天 16:09", user: "Aria · 巴黎", avatar: "https://i.pravatar.cc/120?img=32", content: "上传了法式街拍灵感板，新增 120 点互动热度", tag: "#法式穿搭", cover: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -4, userId: -4, generationId: -4, date: "今天 12:31", user: "Nora · 纽约", avatar: "https://i.pravatar.cc/120?img=47", content: "将生成结果同步到社区合集，评论区开启问答模式", tag: "#街头风", cover: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -5, userId: -5, generationId: -5, date: "今天 09:55", user: "Aanya · 孟买", avatar: "https://i.pravatar.cc/120?img=24", content: "完成了夏季配色挑战，上传 3 组多语种场景描述", tag: "#色彩挑战", cover: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "inspire" },
          ]
        : [
            { id: -1, userId: -1, generationId: -1, date: "Today 20:16", user: "Luna · Shanghai", avatar: "https://i.pravatar.cc/120?img=11", content: "Published a neon-night styling scene and gained 36 saves.", tag: "#CityLights", cover: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -2, userId: -2, generationId: -2, date: "Today 18:42", user: "Mika · Tokyo", avatar: "https://i.pravatar.cc/120?img=5", content: "Shared a spring capsule template reused by creators in 14 countries.", tag: "#OfficeStyle", cover: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "inspire" },
            { id: -3, userId: -3, generationId: -3, date: "Today 16:09", user: "Aria · Paris", avatar: "https://i.pravatar.cc/120?img=32", content: "Uploaded a French street-style board with rising engagement.", tag: "#FrenchLook", cover: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -4, userId: -4, generationId: -4, date: "Today 12:31", user: "Nora · New York", avatar: "https://i.pravatar.cc/120?img=47", content: "Synced generation results to community collection with Q&A enabled.", tag: "#Streetwear", cover: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "copy" },
            { id: -5, userId: -5, generationId: -5, date: "Today 09:55", user: "Aanya · Mumbai", avatar: "https://i.pravatar.cc/120?img=24", content: "Finished summer palette challenge and posted 3 multilingual prompts.", tag: "#ColorChallenge", cover: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"], productImages: [], productTitles: [], mode: "inspire" },
          ];
    },
    [feedData, lang],
  );

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">{ct.loading}</div>
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
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#D4AF37]/10 border border-[#E8C3BA]/20 transition-all duration-300 cursor-pointer will-change-transform"
                style={{
                  animationName: "communityFloat",
                  animationDuration: `${5.6 + (index % 3) * 0.9}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${(index % 4) * 0.35}s`,
                }}
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
                  <img
                    src={item.avatar}
                    alt={item.user}
                    className="w-9 h-9 rounded-full object-cover border border-[#E8C3BA]/40 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.userId > 0) onOpenProfile(item.userId);
                    }}
                  />
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
      <style>{`
        @keyframes communityFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}

export function CommunityPage() {
  const { lang } = useI18n();
  const ct = COMMUNITY_TEXTS[(lang as keyof typeof COMMUNITY_TEXTS)] || COMMUNITY_TEXTS.en;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"timeline" | "world">("timeline");
  const [timelineFeed, setTimelineFeed] = useState<CommunityFeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<TimelineItem | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PublicUserProfile | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [addingWardrobeBulk, setAddingWardrobeBulk] = useState(false);
  const API_BASE = useMemo(() => (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, ""), []);
  const globePoints = useMemo(() => buildGlobeDistribution(timelineFeed, lang, API_BASE), [timelineFeed, lang, API_BASE]);

  useEffect(() => {
    const loadFeed = async () => {
      setLoadingFeed(true);
      try {
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

  const openUserProfileModal = async (userId: number) => {
    if (userId <= 0) return;
    const token = localStorage.getItem("token");
    if (!token) {
      window.dispatchEvent(new Event("scenew:unauthorized"));
      return;
    }
    setProfileLoading(true);
    setProfileModalOpen(true);
    setSelectedProfile(null);
    try {
      const res = await fetch(`${API_BASE}/auth/user/${userId}/public`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("load profile failed");
      const data = await res.json();
      setSelectedProfile(data);
    } catch {
      toast.error(lang === "zh" ? "加载用户信息失败" : "Failed to load user profile");
      setProfileModalOpen(false);
    } finally {
      setProfileLoading(false);
    }
  };

  const sendDirectMessage = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedProfile || !messageContent.trim()) return;
    setSendingMessage(true);
    try {
      const res = await fetch(`${API_BASE}/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: selectedProfile.id,
          content: messageContent.trim(),
        }),
      });
      if (!res.ok) throw new Error("send failed");
      toast.success(lang === "zh" ? "私信已发送" : "Message sent");
      setMessageContent("");
      setMessageModalOpen(false);
      setProfileModalOpen(false);
    } catch {
      toast.error(lang === "zh" ? "发送失败，请重试" : "Failed to send");
    } finally {
      setSendingMessage(false);
    }
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
        toast.info(ct.noImagesInPost);
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
      toast.success(ct.addedWardrobe);
    } catch (err) {
      console.error(err);
      toast.error(ct.addWardrobeFailed);
    } finally {
      setAddingWardrobeBulk(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F4] pt-32 pb-10 px-6">
      <GlowOrb className="-top-20 -right-40" color="rgba(212, 165, 116, 0.15)" size="700px" blur="140px" />
      <GlowOrb className="-bottom-32 -left-48" color="rgba(196, 149, 106, 0.12)" size="600px" blur="120px" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mt-6 mb-20">
          <TypewriterText
            key={`community-title-${lang}`}
            text={ct.title}
            as="h2"
            typeSpeed={50}
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
            className="text-[#5C3D24]"
          />
        </div>

        <div
          className="flex rounded-xl p-1 relative max-w-md mx-auto mb-6"
          style={{ background: "rgba(237,229,216,0.4)", border: "1px solid rgba(196,149,106,0.08)" }}
        >
          {([
            { key: "timeline", label: ct.timeline },
            { key: "world", label: ct.world },
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

        <div
          className={`rounded-3xl border border-[#E8C3BA]/40 bg-white/50 shadow-xl shadow-[#A0714A]/10 overflow-hidden ${
            activeTab === "world" ? "min-h-[74vh]" : ""
          }`}
        >
          {activeTab === "timeline" ? (
            <CommunityTimeline
              lang={lang}
              feedData={timelineFeed}
              loading={loadingFeed}
              onOpenDetail={(item) => setSelectedTimelineItem(item)}
              onOpenProfile={(userId) => openUserProfileModal(userId)}
            />
          ) : (
            <WorldMapPanel
              lang={lang}
              points={globePoints}
              onOpenDetail={(item) => setSelectedTimelineItem(toTimelineItem(item, lang))}
            />
          )}
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
                      {ct.download}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto h-1/2 md:h-full border-l border-[#E8C3BA]/20 bg-white/50 backdrop-blur-sm">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedTimelineItem.avatar}
                    alt={selectedTimelineItem.user}
                    className="w-10 h-10 rounded-full object-cover border border-[#E8C3BA]/40 cursor-pointer"
                    onClick={() => {
                      if (selectedTimelineItem.userId > 0) {
                        openUserProfileModal(selectedTimelineItem.userId);
                      }
                    }}
                  />
                  <span className="px-2.5 py-0.5 rounded-full bg-[#A0714A]/10 text-[#A0714A] text-xs font-medium border border-[#A0714A]/20">
                    {selectedTimelineItem.mode === "copy" ? ct.modeSame : ct.modeInspire}
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
                {ct.copyTitle}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {selectedTimelineItem.content || "-"}
              </p>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-[#5C3D24] uppercase tracking-wider mb-3 border-b border-[#E8C3BA]/20 pb-2">
                  {ct.productImages}
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
                  <p className="text-xs text-muted-foreground">{ct.noProductImages}</p>
                )}
              </div>

              <div className="pt-6 border-t border-[#E8C3BA]/20 flex flex-col gap-3 mt-6">
                <button
                  onClick={() => handleDownload((selectedTimelineItem.images?.length ? selectedTimelineItem.images : [selectedTimelineItem.cover])[0])}
                  className="w-full py-3 rounded-xl bg-[#5C3D24] text-white font-medium hover:bg-[#4A311D] transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {ct.download}
                </button>
                <button
                  onClick={handleAddAllToWardrobe}
                  disabled={addingWardrobeBulk}
                  className="w-full py-3 rounded-xl bg-[#A0714A] text-white font-medium hover:bg-[#8B5E3C] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Shirt className="w-4 h-4" />
                  {addingWardrobeBulk
                    ? ct.saving
                    : ct.addAllWardrobe}
                </button>
                <button
                  onClick={() =>
                    navigate("/try", {
                      state: {
                        communityPrefill: {
                          generationId: selectedTimelineItem.generationId,
                          mode: selectedTimelineItem.mode,
                          productInputMode: selectedTimelineItem.productInputMode || "image",
                          productImages: selectedTimelineItem.productImages || [],
                          productTitles: selectedTimelineItem.productTitles || [],
                          productLinks: selectedTimelineItem.productLinks || [],
                        },
                      },
                    })
                  }
                  className="w-full py-3 rounded-xl border border-[#A0714A] text-[#A0714A] font-medium hover:bg-[#A0714A]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {ct.generateSimilar}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {profileModalOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setProfileModalOpen(false);
              setMessageModalOpen(false);
            }}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-[#FDF9F4] border border-[#E8C3BA]/40 shadow-xl p-6">
            <button
              onClick={() => {
                setProfileModalOpen(false);
                setMessageModalOpen(false);
              }}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/5"
            >
              <XIcon className="w-4 h-4 text-[#5C3D24]" />
            </button>

            {profileLoading || !selectedProfile ? (
              <p className="text-sm text-muted-foreground">{lang === "zh" ? "加载中..." : "Loading..."}</p>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-[#E8C3BA]/40 bg-white">
                    {selectedProfile.avatar_url ? (
                      <img src={selectedProfile.avatar_url} alt={selectedProfile.username} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-lg text-[#5C3D24]">{selectedProfile.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "zh" ? "注册时间：" : "Joined: "}
                      {selectedProfile.created_at ? new Date(selectedProfile.created_at).toLocaleDateString() : "-"}
                    </p>
                  </div>
                </div>

                {!selectedProfile.is_me && (
                  <button
                    onClick={() => setMessageModalOpen(true)}
                    className="mt-5 w-full py-2.5 rounded-xl bg-[#A0714A] text-white hover:bg-[#8B5E3C]"
                  >
                    {lang === "zh" ? "私信" : "Message"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {messageModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setMessageModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-[#FDF9F4] border border-[#E8C3BA]/40 shadow-xl p-6">
            <h3 className="text-[#5C3D24] mb-3">
              {lang === "zh" ? `发私信给 ${selectedProfile.username}` : `Message ${selectedProfile.username}`}
            </h3>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
              placeholder={lang === "zh" ? "输入你的留言..." : "Type your message..."}
              className="w-full rounded-xl border border-[#E8C3BA]/35 bg-white p-3 text-sm"
            />
            <button
              onClick={sendDirectMessage}
              disabled={sendingMessage || !messageContent.trim()}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#A0714A] text-white disabled:opacity-50 hover:bg-[#8B5E3C]"
            >
              {sendingMessage ? (lang === "zh" ? "发送中..." : "Sending...") : (lang === "zh" ? "发送私信" : "Send")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
