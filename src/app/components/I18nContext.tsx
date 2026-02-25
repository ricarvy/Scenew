import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "zh" | "en";

const translations = {
  zh: {
    // Navbar
    navHow: "工作原理",
    navShowcase: "场景展示",
    navFeatures: "功能特性",
    navTry: "开始体验",
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
    tryLinkLabel: "商品链接",
    tryLinkPlaceholder: "粘贴商品链接...",
    trySceneLabel: "场景描述",
    tryScenePlaceholder:
      "描述你想要的场景，例如「穿着这件大衣在巴黎塞纳河畔漫步，秋日午后的阳光」",
    tryGenerate: "生成场景图",
    tryGenerating: "AI 正在合成场景...",
    tryPreview: "场景预览",
    tryPreviewHint: "填写左侧信息后点击生成",
    tryBackHome: "返回首页",

    // Footer
    footerSlogan: "让每次购物都有画面感",
    footerProduct: "产品",
    footerPricing: "定价",
    footerBlog: "博客",
    footerAbout: "关于",
    footerCopyright:
      "© 2026 Scenew. All rights reserved. 以 AI 重新定义购物体验。",

    // Login Modal
    loginTitle: "欢迎来到 Scenew",
    loginSubtitle: "登录后即可开始 AI 场景合成体验",
    loginGoogle: "使用 Google 账号登录",
    loginTerms: "登录即表示你同意我们的",
    loginTermsLink: "服务条款",
    loginAnd: "和",
    loginPrivacy: "隐私政策",
    loginClose: "关闭",
  },
  en: {
    // Navbar
    navHow: "How It Works",
    navShowcase: "Showcase",
    navFeatures: "Features",
    navTry: "Try It",
    navLogin: "Login",
    langLabel: "EN",

    // Hero
    heroTag: "SCENEW — AI Scene Synthesis",
    heroTitle: "See the Life You Want",
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
    tryLinkLabel: "Product Link",
    tryLinkPlaceholder: "Paste product link...",
    trySceneLabel: "Scene Description",
    tryScenePlaceholder:
      'Describe your desired scene, e.g. "Walking along the Seine in Paris on an autumn afternoon"',
    tryGenerate: "Generate Scene",
    tryGenerating: "AI is composing the scene...",
    tryPreview: "Scene Preview",
    tryPreviewHint: "Fill in the form and click generate",
    tryBackHome: "Back to Home",

    // Footer
    footerSlogan: "Bring every purchase to life",
    footerProduct: "Product",
    footerPricing: "Pricing",
    footerBlog: "Blog",
    footerAbout: "About",
    footerCopyright:
      "© 2026 Scenew. All rights reserved. Redefining shopping with AI.",

    // Login Modal
    loginTitle: "Welcome to Scenew",
    loginSubtitle: "Sign in to start your AI scene synthesis experience",
    loginGoogle: "Continue with Google",
    loginTerms: "By signing in, you agree to our",
    loginTermsLink: "Terms of Service",
    loginAnd: "and",
    loginPrivacy: "Privacy Policy",
    loginClose: "Close",
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