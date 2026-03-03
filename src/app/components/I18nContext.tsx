import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "zh" | "en";

const translations = {
  zh: {
    // Navbar
    navHow: "工作原理",
    navShowcase: "场景展示",
    navFeatures: "功能特性",
    navTry: "开始体验",
    navPricing: "定价",
    navLogin: "登录",
    langLabel: "中文",

    // Hero
    heroTag: "SCENEW — AI 场景合成",
    heroTitle: "看见你想要的生活",
    heroSubtitle:
      "上传你的照片，粘贴商品链接，描述期望场景 —— AI 帮你合成「你与商品在场景中」的画面，让每次购物都有画面感。",
    heroStart: "开始体验",
    heroLearn: "了解更多",

    // HowItWorks
    howTag: "HOW IT WORKS",
    howTitle: "四步，从想象到画面",
    step1Title: "上传你的照片",
    step1Desc: "半身照或全身照均可，AI 会精准提取你的形象特征，保留真实质感。",
    step2Title: "粘贴商品链接",
    step2Desc:
      "支持淘宝、京东、天猫、小红书、Amazon、eBay、Shopee 等主流电商平台。",
    step3Title: "描述期望场景",
    step3Desc:
      "「在巴黎街头散步」「在山顶露营」「在办公室开会」——你描述，AI 创造。",
    step4Title: "生成场景图",
    step4Desc: "几秒内获得高质量合成图，用于购物决策和社交分享，让消费更有画面感。",

    // Showcase
    showTag: "SHOWCASE",
    showTitle: "场景无限，灵感随行",
    showSubtitle:
      "从都市街头到雪山之巅，从客厅一角到热带海滩——每个场景都可以成为你的试衣间",
    show1Title: "都市街拍",
    show1Scene: "「穿着这件风衣，走在东京涩谷街头」",
    show2Title: "家居生活",
    show2Scene: "「这款沙发放在我的客厅里会是什么感觉」",
    show3Title: "户外探险",
    show3Scene: "「背着这个登山包站在雪山之巅」",
    show4Title: "海滨度假",
    show4Scene: "「穿着这条裙子在马尔代夫的沙滩漫步」",

    // Features
    featTag: "FEATURES",
    featTitle: "为什么选择 Scenew",
    feat1Title: "秒级生成",
    feat1Desc: "基于先进 AI 模型，几秒内完成场景合成，支持批量处理。",
    feat2Title: "隐私保护",
    feat2Desc: "照片仅用于当次生成，处理完成后自动删除，不会用于模型训练。",
    feat3Title: "全球电商",
    feat3Desc: "支持淘宝、京东、Amazon、Shopee 等全球主流电商平台商品链接。",
    feat4Title: "真实质感",
    feat4Desc: "光影、透视、材质自然融合，告别粗糙合成，接近实拍效果。",
    feat5Title: "社交分享",
    feat5Desc: "一键生成适合朋友圈、小红书、Instagram 的分享图片。",
    feat6Title: "多场景切换",
    feat6Desc: "同一件商品，一键切换多个场景——街拍、居家、度假、职场。",

    // TryIt
    tryTag: "TRY IT NOW",
    tryTitle: "开始你的第一次场景合成",
    tryPhotoLabel: "你的照片",
    tryPhotoUpload: "点击上传半身照或全身照",
    tryPhotoFormat: "支持 JPG / PNG，最大 10MB",
    tryPhotoUploaded: "已上传",
    tryPhotoChange: "更换照片",
    tryLinkLabel: "商品链接",
    tryLinkPlaceholder: "粘贴商品链接...",
    trySceneLabel: "场景描述",
    trySceneOptional: "（可选）",
    tryScenePlaceholder:
      "描述你想要的场景，例如「穿着这件大衣在巴黎塞纳河畔漫步，秋日午后的阳光」",
    trySceneSuggestTitle: "试试这些场景 ✨",
    trySceneSuggest1: "在巴黎街头散步，秋日阳光",
    trySceneSuggest2: "在温馨咖啡馆里看书",
    trySceneSuggest3: "在公园的林荫道漫步",
    trySceneSuggest4: "在现代办公室里自信工作",
    trySceneSuggest5: "在海滨日落时分拍照",
    trySceneSuggest6: "在家中客厅放松",
    tryGenerate: "生成场景图",
    tryGenerating: "AI 正在合成场景...",
    tryPreview: "场景预览",
    tryPreviewHint: "上传照片并填写商品链接后点击生成",
    tryPreviewGenerating: "正在为你生成 4 种场景组合…",
    tryValidationPhoto: "请先上传你的照片",
    tryValidationLink: "请粘贴商品链接",
    tryResultTitle: "AI 为你生成了 4 种场景",
    tryResultRegenerate: "重新生成",
    tryBackHome: "返回首页",

    // Footer
    footerSlogan: "让每次购物都有画面感",
    footerProduct: "产品",
    footerPricing: "定价",
    footerBlog: "博客",
    footerAbout: "关于",
    footerCopyright:
      "© 2026 Scenew. All rights reserved. 以 AI 重新定义购物体验。",

    // Pricing
    pricingTag: "PRICING",
    pricingTitle: "选择适合你的方案",
    pricingSubtitle: "从免费开始，随时升级解锁更多可能",
    pricingMonthly: "月付",
    pricingYearly: "年付",
    pricingSave: "省 17%",
    pricingFreeTitle: "Free",
    pricingFreePrice: "0",
    pricingFreePeriod: "/月",
    pricingFreeDesc: "适合尝鲜体验",
    pricingFreeF1: "每月 5 次场景合成",
    pricingFreeF2: "标准画质输出",
    pricingFreeF3: "基础场景模板",
    pricingFreeF4: "水印标识",
    pricingFreeCta: "免费开始",
    pricingProTitle: "Pro",
    pricingProPriceMonthly: "19.9",
    pricingProPriceYearly: "199",
    pricingProPeriodMonthly: "/月",
    pricingProPeriodYearly: "/年",
    pricingProDesc: "为创作者和重度用户打造",
    pricingProF1: "无限次场景合成",
    pricingProF2: "超高清画质输出",
    pricingProF3: "全部高级场景模板",
    pricingProF4: "无水印",
    pricingProF5: "批量处理",
    pricingProF6: "优先生成队列",
    pricingProCta: "升级 Pro",
    pricingCurrency: "HKD",
    pricingPopular: "最受欢迎",

    // Login Modal
    loginTitle: "欢迎来到 Scenew",
    loginSubtitle: "登录后即可开始 AI 场景合成体验",
    loginGoogle: "使用 Google 账号登录",
    loginTerms: "登录即表示你同意我们的",
    loginTermsLink: "服务条款",
    loginAnd: "和",
    loginPrivacy: "隐私政策",
    loginClose: "关闭",

    // Email Login
    loginEmailLabel: "邮箱地址",
    loginEmailPlaceholder: "请输入邮箱",
    loginPasswordLabel: "密码",
    loginPasswordPlaceholder: "请输入密码",
    loginSubmit: "登录",
    loginNoAccount: "还没有账号？",
    loginRegisterLink: "立即注册",
    loginOr: "或",
    loginEmailError: "请输入有效的邮箱地址",
    loginPasswordError: "请输入密码",

    // Register Modal
    registerTitle: "创建 Scenew 账号",
    registerSubtitle: "注��后即可享受 AI 场景合成服务",
    registerUsername: "用户名",
    registerUsernamePlaceholder: "请输入用户名",
    registerEmail: "邮箱地址",
    registerEmailPlaceholder: "请输入邮箱",
    registerPassword: "密码",
    registerPasswordPlaceholder: "至少 8 位，含字母和数字",
    registerConfirmPassword: "确认密码",
    registerConfirmPlaceholder: "再次输入密码",
    registerSubmit: "注册",
    registerHaveAccount: "已有账号？",
    registerLoginLink: "去登录",
    registerSuccess: "注册成功！正在跳转登录…",
    registerErrUsername: "请输入用户名",
    registerErrEmail: "请输入有效的邮箱地址",
    registerErrPassword: "密码至少 8 位，需包含字母和数字",
    registerErrConfirm: "两次密码不一致",

    // Product Links (multi)
    tryLinkAdd: "添加",
    tryLinkPaste: "粘贴商品链接并添加",
    tryLinkDetected: "已识别平台",
    tryLinkRemove: "移除",
    tryLinkEmpty: "暂无商品，请粘贴链接添加",
    tryLinkFetching: "正在获取商品信息…",
    tryLinkFetchError: "获取失败，请检查链接",
    tryLinkMax: "最多添加 5 个商品链接",
    tryLinkAdded: "已添加",
    tryLinkInfoUnavailable: "暂未获取到商品详情",
    tryLinkRetry: "重试",

    // Browser Login Modal
    browserLoginTitle: "需要平台登录",
    browserLoginDesc: "该商品需要登录后才能访问，请在下方窗口完成登录",
    browserLoginLoading: "正在启动远程浏览器…",
    browserLoginConfirm: "登录完成",
    browserLoginCancel: "取消",
    browserLoginSuccess: "登录成功，正在重新获取商品信息…",
  },
  en: {
    // Navbar
    navHow: "How It Works",
    navShowcase: "Showcase",
    navFeatures: "Features",
    navTry: "Try It",
    navPricing: "Pricing",
    navLogin: "Login",
    langLabel: "EN",

    // Hero
    heroTag: "SCENEW — AI Scene Synthesis",
    heroTitle: "See your life, anew.",
    heroSubtitle:
      "Upload your photo, paste a product link, describe your desired scene — AI creates a composite of you with the product in context, bringing every purchase to life.",
    heroStart: "Get Started",
    heroLearn: "Learn More",

    // HowItWorks
    howTag: "HOW IT WORKS",
    howTitle: "Four Steps, From Imagination to Reality",
    step1Title: "Upload Your Photo",
    step1Desc:
      "Half-body or full-body — AI precisely extracts your features while preserving authentic texture.",
    step2Title: "Paste Product Link",
    step2Desc:
      "Supports Taobao, JD, Tmall, Xiaohongshu, Amazon, eBay, Shopee and more.",
    step3Title: "Describe the Scene",
    step3Desc:
      '"Walking in Paris streets" "Camping on a mountaintop" "Meeting at the office" — you describe, AI creates.',
    step4Title: "Generate Scene",
    step4Desc:
      "Get high-quality composite images in seconds for shopping decisions and social sharing.",

    // Showcase
    showTag: "SHOWCASE",
    showTitle: "Unlimited Scenes, Endless Inspiration",
    showSubtitle:
      "From city streets to mountain peaks, from living rooms to tropical beaches — every scene becomes your fitting room",
    show1Title: "Urban Style",
    show1Scene: '"Wearing this trench coat on the streets of Shibuya, Tokyo"',
    show2Title: "Home Living",
    show2Scene: '"How would this sofa look in my living room"',
    show3Title: "Outdoor Adventure",
    show3Scene: '"Standing atop a snowy peak with this backpack"',
    show4Title: "Beach Vacation",
    show4Scene: '"Strolling on the Maldives beach in this dress"',

    // Features
    featTag: "FEATURES",
    featTitle: "Why Choose Scenew",
    feat1Title: "Lightning Fast",
    feat1Desc:
      "Powered by advanced AI models, scene synthesis completes in seconds with batch processing support.",
    feat2Title: "Privacy First",
    feat2Desc:
      "Photos are used only for the current generation, auto-deleted after processing, never used for training.",
    feat3Title: "Global Commerce",
    feat3Desc:
      "Supports product links from Taobao, JD, Amazon, Shopee and all major global e-commerce platforms.",
    feat4Title: "Realistic Quality",
    feat4Desc:
      "Natural blending of lighting, perspective, and materials — near photo-realistic results.",
    feat5Title: "Social Sharing",
    feat5Desc:
      "One-click generation of share-ready images for WeChat, Xiaohongshu, and Instagram.",
    feat6Title: "Multi-Scene",
    feat6Desc:
      "Same product, multiple scenes in one click — street style, home, vacation, professional.",

    // TryIt
    tryTag: "TRY IT NOW",
    tryTitle: "Start Your First Scene Synthesis",
    tryPhotoLabel: "Your Photo",
    tryPhotoUpload: "Click to upload half-body or full-body photo",
    tryPhotoFormat: "Supports JPG / PNG, max 10MB",
    tryPhotoUploaded: "Uploaded",
    tryPhotoChange: "Change Photo",
    tryLinkLabel: "Product Link",
    tryLinkPlaceholder: "Paste product link...",
    trySceneLabel: "Scene Description",
    trySceneOptional: "（Optional）",
    tryScenePlaceholder:
      'Describe your desired scene, e.g. "Walking along the Seine in Paris on an autumn afternoon"',
    trySceneSuggestTitle: "Try These Scenes ✨",
    trySceneSuggest1: "Walking in Paris streets, autumn sunlight",
    trySceneSuggest2: "Reading a book in a cozy café",
    trySceneSuggest3: "Strolling down a park avenue",
    trySceneSuggest4: "Working confidently in a modern office",
    trySceneSuggest5: "Photographing at sunset on the beach",
    trySceneSuggest6: "Relaxing in the living room at home",
    tryGenerate: "Generate Scene",
    tryGenerating: "AI is composing the scene...",
    tryPreview: "Scene Preview",
    tryPreviewHint: "Upload photo and paste product link to generate",
    tryPreviewGenerating: "Generating 4 scene combinations for you...",
    tryValidationPhoto: "Please upload your photo first",
    tryValidationLink: "Please paste product link",
    tryResultTitle: "AI has generated 4 scenes for you",
    tryResultRegenerate: "Regenerate",
    tryBackHome: "Back to Home",

    // Footer
    footerSlogan: "Bring every purchase to life",
    footerProduct: "Product",
    footerPricing: "Pricing",
    footerBlog: "Blog",
    footerAbout: "About",
    footerCopyright:
      "© 2026 Scenew. All rights reserved. Redefining shopping with AI.",

    // Pricing
    pricingTag: "PRICING",
    pricingTitle: "Choose Your Plan",
    pricingSubtitle: "Start free, upgrade anytime to unlock more",
    pricingMonthly: "Monthly",
    pricingYearly: "Yearly",
    pricingSave: "Save 17%",
    pricingFreeTitle: "Free",
    pricingFreePrice: "0",
    pricingFreePeriod: "/mo",
    pricingFreeDesc: "Perfect for trying out",
    pricingFreeF1: "5 scene generations / month",
    pricingFreeF2: "Standard quality output",
    pricingFreeF3: "Basic scene templates",
    pricingFreeF4: "Watermarked",
    pricingFreeCta: "Get Started Free",
    pricingProTitle: "Pro",
    pricingProPriceMonthly: "19.9",
    pricingProPriceYearly: "199",
    pricingProPeriodMonthly: "/mo",
    pricingProPeriodYearly: "/yr",
    pricingProDesc: "For creators and power users",
    pricingProF1: "Unlimited scene generations",
    pricingProF2: "Ultra HD quality output",
    pricingProF3: "All premium scene templates",
    pricingProF4: "No watermark",
    pricingProF5: "Batch processing",
    pricingProF6: "Priority generation queue",
    pricingProCta: "Upgrade to Pro",
    pricingCurrency: "HKD",
    pricingPopular: "Most Popular",

    // Login Modal
    loginTitle: "Welcome to Scenew",
    loginSubtitle: "Sign in to start your AI scene synthesis experience",
    loginGoogle: "Continue with Google",
    loginTerms: "By signing in, you agree to our",
    loginTermsLink: "Terms of Service",
    loginAnd: "and",
    loginPrivacy: "Privacy Policy",
    loginClose: "Close",

    // Email Login
    loginEmailLabel: "Email",
    loginEmailPlaceholder: "Enter your email",
    loginPasswordLabel: "Password",
    loginPasswordPlaceholder: "Enter your password",
    loginSubmit: "Sign In",
    loginNoAccount: "Don't have an account?",
    loginRegisterLink: "Sign Up",
    loginOr: "or",
    loginEmailError: "Please enter a valid email",
    loginPasswordError: "Please enter your password",

    // Register Modal
    registerTitle: "Create Your Scenew Account",
    registerSubtitle: "Sign up to start your AI scene synthesis journey",
    registerUsername: "Username",
    registerUsernamePlaceholder: "Enter your username",
    registerEmail: "Email",
    registerEmailPlaceholder: "Enter your email",
    registerPassword: "Password",
    registerPasswordPlaceholder: "At least 8 chars, letters & numbers",
    registerConfirmPassword: "Confirm Password",
    registerConfirmPlaceholder: "Re-enter your password",
    registerSubmit: "Sign Up",
    registerHaveAccount: "Already have an account?",
    registerLoginLink: "Sign In",
    registerSuccess: "Registration successful! Redirecting to login…",
    registerErrUsername: "Please enter a username",
    registerErrEmail: "Please enter a valid email",
    registerErrPassword: "Password must be 8+ chars with letters & numbers",
    registerErrConfirm: "Passwords do not match",

    // Product Links (multi)
    tryLinkAdd: "Add",
    tryLinkPaste: "Paste product link and add",
    tryLinkDetected: "Platform detected",
    tryLinkRemove: "Remove",
    tryLinkEmpty: "No products yet. Paste a link to add",
    tryLinkFetching: "Fetching product info…",
    tryLinkFetchError: "Fetch failed, please check the link",
    tryLinkMax: "Maximum 5 product links",
    tryLinkAdded: "Added",
    tryLinkInfoUnavailable: "Product details unavailable",
    tryLinkRetry: "Retry",

    // Browser Login Modal
    browserLoginTitle: "Platform Login Required",
    browserLoginDesc: "This product requires login to access. Please complete login in the window below",
    browserLoginLoading: "Starting remote browser…",
    browserLoginConfirm: "Login Complete",
    browserLoginCancel: "Cancel",
    browserLoginSuccess: "Login successful, re-fetching product info…",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["zh"];

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "zh",
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}