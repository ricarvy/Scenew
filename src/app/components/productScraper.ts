/**
 * Product scraper utility - calls backend /api/extract endpoint
 * Backend: http://120.76.142.91:8910
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://120.76.142.91:8910";

export interface ProductInfo {
  title: string;
  image: string;
  images?: string[];
  platform: string;
  price?: string;
  shop_name?: string;
  currency?: string;
}

export interface ExtractResponse {
  success: boolean;
  data?: ProductInfo;
  task_id?: string;
  need_login?: boolean;
  error?: string;
}

export class NeedLoginError extends Error {
  task_id: string;
  constructor(taskId: string) {
    super("Platform login required");
    this.name = "NeedLoginError";
    this.task_id = taskId;
  }
}

export class ScraperError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ScraperError";
    this.status = status;
  }
}

/**
 * Extract product info from a URL.
 * Optionally pass cookies from a previous login session.
 * Throws NeedLoginError (401) if platform login is required.
 */
export async function extractProduct(url: string, cookies?: string): Promise<ProductInfo> {
  const body: Record<string, string> = { url };
  if (cookies) body.cookies = cookies;

  const res = await fetch(`${API_BASE}/api/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    const body = await res.json();
    if (body.need_login && body.task_id) {
      throw new NeedLoginError(body.task_id);
    }
    throw new ScraperError("Unauthorized", 401);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new ScraperError(text, res.status);
  }

  const data: ExtractResponse = await res.json();
  if (!data.success || !data.data) {
    throw new ScraperError(data.error || "Extract failed", 500);
  }

  // Ensure full image URL
  const product = data.data;
  const ensureUrl = (url: string) => 
    url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;

  if (product.image) {
    product.image = ensureUrl(product.image);
  }
  if (product.images && Array.isArray(product.images)) {
    product.images = product.images.map(ensureUrl);
  }

  return product;
}

/**
 * Start remote browser login session for a task.
 * Returns the WebSocket endpoint for CDP screencast.
 */
export async function startLoginSession(taskId: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/auth/login-page?task_id=${encodeURIComponent(taskId)}`);
  if (!res.ok) {
    throw new ScraperError("Failed to start login session", res.status);
  }
  const data = await res.json();
  return data.ws_endpoint;
}

/**
 * Confirm login completion, triggers cookie extraction + re-crawl.
 */
export async function confirmLogin(taskId: string): Promise<ProductInfo> {
  const res = await fetch(`${API_BASE}/api/auth/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task_id: taskId }),
  });
  if (!res.ok) {
    throw new ScraperError("Login confirmation failed", res.status);
  }
  const data = await res.json();
  if (!data.success || !data.data) {
    throw new ScraperError(data.error || "Re-extract failed", 500);
  }
  const product = data.data;
  if (product.image && !product.image.startsWith("http")) {
    product.image = `${API_BASE}${product.image.startsWith("/") ? "" : "/"}${product.image}`;
  }
  return product;
}

/**
 * Detect shopping platform from URL
 */
export interface PlatformInfo {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  icon: string; // emoji or short label
}

const PLATFORM_RULES: { pattern: RegExp; info: PlatformInfo }[] = [
  {
    pattern: /taobao\.com/i,
    info: { id: "taobao", name: "淘宝", color: "#FF5000", bgColor: "rgba(255,80,0,0.08)", icon: "TB" },
  },
  {
    pattern: /tmall\.com/i,
    info: { id: "tmall", name: "天猫", color: "#E4393C", bgColor: "rgba(228,57,60,0.08)", icon: "TM" },
  },
  {
    pattern: /jd\.com/i,
    info: { id: "jd", name: "京东", color: "#E4393C", bgColor: "rgba(228,57,60,0.08)", icon: "JD" },
  },
  {
    pattern: /xiaohongshu\.com|xhslink\.com/i,
    info: { id: "xhs", name: "小红书", color: "#FE2C55", bgColor: "rgba(254,44,85,0.08)", icon: "XHS" },
  },
  {
    pattern: /amazon\.(com|co\.|ca|de|fr|co\.uk|co\.jp|in)/i,
    info: { id: "amazon", name: "Amazon", color: "#FF9900", bgColor: "rgba(255,153,0,0.08)", icon: "AMZ" },
  },
  {
    pattern: /ebay\.(com|co\.|de|fr)/i,
    info: { id: "ebay", name: "eBay", color: "#0064D2", bgColor: "rgba(0,100,210,0.08)", icon: "EB" },
  },
  {
    pattern: /shopee\.(com|sg|co|tw|vn|ph|my|th|co\.id)/i,
    info: { id: "shopee", name: "Shopee", color: "#EE4D2D", bgColor: "rgba(238,77,45,0.08)", icon: "SP" },
  },
  {
    pattern: /1688\.com/i,
    info: { id: "1688", name: "1688", color: "#FF6A00", bgColor: "rgba(255,106,0,0.08)", icon: "1688" },
  },
  {
    pattern: /pinduoduo\.com|yangkeduo\.com/i,
    info: { id: "pdd", name: "拼多多", color: "#E02E24", bgColor: "rgba(224,46,36,0.08)", icon: "PDD" },
  },
  {
    pattern: /walmart\.com/i,
    info: { id: "walmart", name: "Walmart", color: "#0071CE", bgColor: "rgba(0,113,206,0.08)", icon: "WM" },
  },
];

export function detectPlatform(url: string): PlatformInfo {
  for (const rule of PLATFORM_RULES) {
    if (rule.pattern.test(url)) return rule.info;
  }
  // Generic platform
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    const short = hostname.split(".")[0].slice(0, 4).toUpperCase();
    return {
      id: "other",
      name: hostname,
      color: "#8B5E3C",
      bgColor: "rgba(139,94,60,0.08)",
      icon: short,
    };
  } catch {
    return {
      id: "unknown",
      name: "Unknown",
      color: "#999",
      bgColor: "rgba(153,153,153,0.08)",
      icon: "?",
    };
  }
}