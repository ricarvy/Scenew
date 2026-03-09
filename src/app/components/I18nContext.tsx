import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "zh" | "en";

const translations = {
  zh: {
    // Navbar
    navHow: "使用指南",
    navShowcase: "场景展示",
    navFeatures: "功能特性",
    navTry: "开始体验",
    navPricing: "定价",
    navBlog: "博客",
    navLogin: "登录",
    navLogout: "退出登录",
    navProfile: "个人主页",
    navGenerations: "我的生成",
    langLabel: "中文",

    // Blog
    blogTitle: "博客",
    blogSubtitle: "探索 AI 场景合成的最新动态与灵感",
    blogReadMore: "阅读全文",
    blogBack: "返回列表",
    blogPublished: "发布于",
    blogShare: "分享",

    // Generations Page
    myGenerationsTitle: "我的生成历史",
    noGenerationsTitle: "暂无生成记录",
    noGenerationsDesc: "快去体验第一次场景合成吧！",
    viewDetails: "查看详情",
    generatedScene: "生成场景",
    downloadImage: "下载图片",

    // Profile Modal
    profileTitle: "个人主页",
    profileUsername: "用户名",
    profileEmail: "邮箱",
    profilePassword: "密码",
    profileRegisterDate: "注册时间",
    profilePoints: "剩余点数",
    profileEdit: "修改",
    profileSave: "保存",
    profileCancel: "取消",
    profileChangePassword: "修改密码",
    profilePointsUnit: "点",
    profileLogout: "退出登录",

    // Hero
    heroTag: "SCENEW — AI 场景合成",
    heroTitle: "看见你想要的生活",
    heroSubtitle:
      "上传你的照片，粘贴商品链接，描述期望场景 —— AI 帮你合成「你与商品在场景中」的画面，让每次购物都有画面感。",
    heroStart: "开始体验",
    heroLearn: "了解更多",
    heroRedeem: "邀请码兑换",
    heroRedeemSuccess: "兑换成功！开始您的发现之旅",
    heroRedeemCodeLabel: "兑换码",
    heroRedeemCodePlaceholder: "请输入兑换码",
    heroRedeemSubmit: "确认兑换",
    heroRedeemCancel: "取消",
    heroRedeemLoginFirst: "请先登录后再进行兑换",
    heroRedeemEnterCode: "请输入兑换码",
    heroRedeemCreditsAdded: "点数 +",
    heroRedeemFailed: "兑换码不可用",
    heroRedeemNetworkError: "网络错误，请检查服务器连接",

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
    step4Desc: "几分钟内获得高质量合成图，用于购物决策和社交分享，让消费更有画面感。",

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
    feat1Title: "分钟级生成",
    feat1Desc: "基于先进 AI 模型，几分钟内完成场景合成，支持批量处理。",
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
    tryTitle: "开启独一无二的生活旅程",
    tryTabCopy: "做同款",
    tryTabInspire: "新灵感",
    trySloganCopy: "经典之所以经典，因为总被模仿",
    trySloganInspire: "创造属于你的光芒四射",
    trySceneImageLabel: "场景参考图",
    trySceneImageOptional: "（可选）",
    trySceneImageUpload: "上传一张场景照片，AI 将参考该场景进行合成",
    trySceneImageFormat: "支持 JPG / PNG，最大 10MB",
    trySceneImageUploaded: "已上传",
    trySceneImageChange: "更换图片",
    tryPhotoLabel: "你的照片",
    tryPhotoUpload: "点击上传半身照或全身照",
    tryPhotoFormat: "支持 JPG / PNG，最大 10MB",
    tryPhotoUploaded: "已上传",
    tryPhotoChange: "更换照片",
    tryLinkLabel: "商品链接",
    tryLinkPlaceholder: "粘贴商品链接，点击“添加”即可自动解析商品信息",
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
    tryPreviewGenerating: "正在进入你的专属平行宇宙",
    tryPreviewBackgroundTask: "已生成后台任务，刷新/跳转页面均不影响生成，可在“我的生成”下查看生成结果",
    tryValidationPhoto: "请先上传你的照片",
    tryValidationLink: "请粘贴商品链接",
    tryResultTitle: "探索专属于你的另一个自己",
    tryResultRegenerate: "重新生成",
    tryModeSameStyle: "做同款",
    tryModeNewInspiration: "新灵感",
    tryModeSeeding: "种草模式",
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
    pricingSubtitle: "灵活充值，永久有效",
    pricingPlan1Title: "入门包",
    pricingPlan1Price: "49.9",
    pricingPlan1Points: "200 点",
    pricingPlan1Desc: "¥0.25/点",
    pricingPlan2Title: "成长包",
    pricingPlan2Price: "129.9",
    pricingPlan2Points: "600 点",
    pricingPlan2Desc: "¥0.22/点",
    pricingPlan2Discount: "8折",
    pricingPlan3Title: "专业包",
    pricingPlan3Price: "199.9",
    pricingPlan3Points: "1000 点",
    pricingPlan3Desc: "¥0.20/点",
    pricingPlan3Discount: "7折",
    pricingCurrency: "¥",
    pricingBuy: "立即充值",
    pricingFeature1: "无水印",
    pricingFeature2: "永久有效",
    pricingFeature3: "优先生成",
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
    registerSubtitle: "注后即可享受 AI 场景合成服务",
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
    tryLinkUnsupported: "暂不支持该平台，目前仅支持淘宝/天猫链接",
    
    // Browser Login Modal
    browserLoginTitle: "需要平台登录",
    browserLoginDesc: "该商品需要登录后才能访问，请在下方窗口完成登录",
    browserLoginLoading: "正在启动远程浏览器…",
    browserLoginConfirm: "登录完成",
    browserLoginCancel: "取消",
    browserLoginSuccess: "登录成功，正在重新获取商品信息…",

    // Privacy Policy
    privacyTitle: "隐私政策",
    privacyLastUpdated: "最后更新：2026年3月7日",
    privacyIntro: "Scenew（以下简称“我们”）非常重视您的隐私。本隐私政策旨在说明我们如何收集、使用、存储和保护您的个人信息。",
    privacySection1: "1. 信息收集",
    privacySection1Content: "我们收集您主动提供的信息，包括：注册账号时提供的邮箱和用户名；您上传的照片和商品链接（仅用于场景合成服务）；您的使用数据（如生成记录）。",
    privacySection2: "2. 照片使用与存储",
    privacySection2Content: "您上传的照片仅用于当次场景生成任务。除非您选择保存到“我的生成”，否则原始照片会在处理完成后24小时内自动删除。我们不会将您的照片用于模型训练或任何其他未经授权的用途。",
    privacySection3: "3. 数据安全",
    privacySection3Content: "我们采用行业标准的安全措施来保护您的数据，包括加密传输和安全存储。只有经过授权的人员才能访问您的个人信息。",
    privacySection4: "4. 第三方服务",
    privacySection4Content: "我们的服务可能包含指向第三方网站（如电商平台）的链接。我们不对这些第三方的隐私惯例负责，请您自行阅读其隐私政策。",
    privacySection5: "5. 政策更新",
    privacySection5Content: "我们可能会不时更新本隐私政策。重大变更时，我们会通过邮件或网站公告通知您。",
    privacyContact: "联系我们：scenewai@163.com",

    // Terms of Service
    termsTitle: "服务条款",
    termsLastUpdated: "最后更新：2026年3月7日",
    termsIntro: "欢迎使用 Scenew。通过访问或使用我们的服务，即表示您同意受本条款的约束。",
    termsSection1: "1. 账号注册",
    termsSection1Content: "您需要注册账号才能使用部分功能。您有责任维护账号信息的保密性，并对该账号下的所有活动负责。",
    termsSection2: "2. 服务内容",
    termsSection2Content: "Scenew 提供基于 AI 的场景合成服务。我们致力于提供高质量的生成结果，但不保证生成内容完全符合您的预期。",
    termsSection3: "3. 用户行为",
    termsSection3Content: "您同意不利用本服务进行任何非法、侵权或有害的活动。严禁上传包含暴力、色情或侵犯他人版权的内容。",
    termsSection4: "4. 知识产权",
    termsSection4Content: "我们保留服务相关的所有知识产权。您对自己上传的内容拥有所有权，并授予我们为提供服务所需的有限使用许可。",
    termsSection5: "5. 免责声明",
    termsSection5Content: "本服务按“现状”提供，不包含任何明示或暗示的保证。我们不对因使用服务而产生的任何直接或间接损失负责。",
    termsContact: "如有疑问，请联系：scenewai@163.com",

    // Mode Comparison Modal
    modeComparisonTitle: "种草模式 vs 非种草模式",
    modeComparisonDesc: "种草模式能够自动融合商品信息",
    modeStandardTitle: "非种草模式（纯净版）",
    modeStandardDesc: "生成纯净的场景合成图，专注于展示人与商品的融合效果，画面无额外干扰元素。",
    modeGrassTitle: "种草模式（带货版）",
    modeGrassDesc: "自动提取商品信息（如价格、店铺名），以精美的“购物卡片”形式融入画面，一键生成适合小红书/朋友圈的带货图。",
    modeClose: "明白",

    // Contact
    contactLabel: "联系我们",
    contactModalTitle: "联系我们",
    contactModalDesc: "您可以通过右下角的会话窗口或发送邮件至以下邮箱与我们联系：",
    contactEmail: "scenewai@163.com",
    contactModalClose: "知道了",
    
    // Feedback
    feedbackLabel: "意见反馈",
    feedbackTitle: "您的反馈对我们很重要",
    feedbackDesc: "帮助我们做得更好，期待您的宝贵建议",
    feedbackContactHint: "如有其他问题，请联系：",
    feedbackPlaceholder: "请输入您的反馈内容...",
    feedbackSubmit: "提交反馈",
    feedbackSubmitting: "提交中...",
    feedbackSuccess: "反馈提交成功",
    feedbackError: "提交失败，请重试",
    feedbackNetworkError: "网络错误，请检查连接",
    feedbackContentRequired: "请输入反馈内容",
    pricingBetaModalTitle: "内测阶段说明",
    pricingBetaModalDesc: "当前产品处于内测阶段，暂不支持直接充值。如有需要，请联系 scenewai@163.com 获取邀请码以兑换资源包。",
    pricingBetaModalClose: "知道了",

    // Welcome Letter
    welcomeLetterTitle: "来自 Scenew 的一封信",
    welcomeLetterOpen: "拆开信件",
    welcomeLetterRead: "阅读全文",
    welcomeLetterClose: "暂时收起",
  },
  en: {
    // Navbar
    navHow: "User Guide",
    navShowcase: "Showcase",
    navFeatures: "Features",
    navTry: "Try It",
    navPricing: "Pricing",
    navBlog: "Blog",
    navLogin: "Login",
    navLogout: "Logout",
    navProfile: "Profile",
    navGenerations: "My Generations",
    langLabel: "EN",

    // Blog
    blogTitle: "Blog",
    blogSubtitle: "Explore the latest trends and inspiration in AI scene synthesis",
    blogReadMore: "Read More",
    blogBack: "Back to Blog",
    blogPublished: "Published on",
    blogShare: "Share",

    // Generations Page
    myGenerationsTitle: "My Generations",
    noGenerationsTitle: "No generations yet",
    noGenerationsDesc: "Go ahead and create your first scene!",
    viewDetails: "View Details",
    generatedScene: "Generated Scene",
    downloadImage: "Download Image",

    // Profile Modal
    profileTitle: "Profile",
    profileUsername: "Username",
    profileEmail: "Email",
    profilePassword: "Password",
    profileRegisterDate: "Joined",
    profilePoints: "Credits",
    profileEdit: "Edit",
    profileSave: "Save",
    profileCancel: "Cancel",
    profileChangePassword: "Change Password",
    profilePointsUnit: "pts",
    profileLogout: "Logout",

    // Hero
    heroTag: "SCENEW — AI Scene Synthesis",
    heroTitle: "See your life, anew.",
    heroSubtitle:
      "Upload your photo, paste a product link, describe your desired scene — AI creates a composite of you with the product in context, bringing every purchase to life.",
    heroStart: "Get Started",
    heroLearn: "Learn More",
    heroRedeem: "Redeem Code",
    heroRedeemSuccess: "Redeemed successfully! Start your journey.",
    heroRedeemCodeLabel: "Redemption Code",
    heroRedeemCodePlaceholder: "Enter code",
    heroRedeemSubmit: "Redeem",
    heroRedeemCancel: "Cancel",
    heroRedeemLoginFirst: "Please login to redeem",
    heroRedeemEnterCode: "Please enter a redemption code",
    heroRedeemCreditsAdded: "Credits +",
    heroRedeemFailed: "Invalid redemption code",
    heroRedeemNetworkError: "Network error. Please check server connection",

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
      "Get high-quality composite images in minutes for shopping decisions and social sharing.",

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
    feat1Title: "Minutes Generation",
    feat1Desc:
      "Powered by advanced AI models, scene synthesis completes in minutes with batch processing support.",
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
    tryTabCopy: "Copy",
    tryTabInspire: "Inspire",
    trySloganCopy: "Classics are classics because they are imitated",
    trySloganInspire: "Create your own radiant style",
    trySceneImageLabel: "Scene Reference Image",
    trySceneImageOptional: "(Optional)",
    trySceneImageUpload: "Upload a scene photo, AI will reference this scene for synthesis",
    trySceneImageFormat: "Supports JPG / PNG, max 10MB",
    trySceneImageUploaded: "Uploaded",
    trySceneImageChange: "Change Image",
    tryPhotoLabel: "Your Photo",
    tryPhotoUpload: "Click to upload half-body or full-body photo",
    tryPhotoFormat: "Supports JPG / PNG, max 10MB",
    tryPhotoUploaded: "Uploaded",
    tryPhotoChange: "Change Photo",
    tryLinkLabel: "Product Link",
    tryLinkPlaceholder: "Paste link and click 'Add' to auto-parse info",
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
    tryPreviewGenerating: "Entering your exclusive parallel universe...",
    tryPreviewBackgroundTask: "Background task started. You can refresh or leave the page. Check results in 'My Generations'.",
    tryValidationPhoto: "Please upload your photo first",
    tryValidationLink: "Please paste product link",
    tryResultTitle: "Explore another version of yourself",
    tryResultRegenerate: "Regenerate",
    tryModeSameStyle: "Same Style",
    tryModeNewInspiration: "New Inspiration",
    tryModeSeeding: "Seeding Mode",
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
    pricingSubtitle: "Flexible top-up, valid forever",
    pricingPlan1Title: "Starter",
    pricingPlan1Price: "49.9",
    pricingPlan1Points: "200 pts",
    pricingPlan1Desc: "¥0.25/pt",
    pricingPlan2Title: "Growth",
    pricingPlan2Price: "129.9",
    pricingPlan2Points: "600 pts",
    pricingPlan2Desc: "¥0.22/pt",
    pricingPlan2Discount: "20% OFF",
    pricingPlan3Title: "Pro",
    pricingPlan3Price: "199.9",
    pricingPlan3Points: "1000 pts",
    pricingPlan3Desc: "¥0.20/pt",
    pricingPlan3Discount: "30% OFF",
    pricingCurrency: "¥",
    pricingBuy: "Top Up",
    pricingFeature1: "No Watermark",
    pricingFeature2: "Valid Forever",
    pricingFeature3: "Priority Queue",
    pricingPopular: "Most Popular",
    pricingBetaModalTitle: "Beta Phase Notice",
    pricingBetaModalDesc: "The product is currently in beta and does not support direct top-up. Please contact scenewai@163.com to get an invitation code for credit redemption.",
    pricingBetaModalClose: "Got it",

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
    tryLinkUnsupported: "Platform not supported yet. Currently only Taobao/Tmall links are supported.",

    // Browser Login Modal
    browserLoginTitle: "Platform Login Required",
    browserLoginDesc: "This product requires login to access. Please complete login in the window below",
    browserLoginLoading: "Starting remote browser…",
    browserLoginConfirm: "Login Complete",
    browserLoginCancel: "Cancel",
    browserLoginSuccess: "Login successful, re-fetching product info…",

    // Privacy Policy
    privacyTitle: "Privacy Policy",
    privacyLastUpdated: "Last Updated: March 7, 2026",
    privacyIntro: "Scenew (\"we\", \"us\", or \"our\") values your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information.",
    privacySection1: "1. Information Collection",
    privacySection1Content: "We collect information you provide, including: email and username upon registration; photos and product links you upload (solely for scene synthesis); and usage data.",
    privacySection2: "2. Photo Usage & Storage",
    privacySection2Content: "Photos you upload are used only for the current generation task. Unless you choose to save them to \"My Generations\", original photos are automatically deleted within 24 hours. We do not use your photos for model training or any unauthorized purpose.",
    privacySection3: "3. Data Security",
    privacySection3Content: "We use industry-standard security measures to protect your data, including encryption and secure storage. Only authorized personnel have access to your personal information.",
    privacySection4: "4. Third-Party Services",
    privacySection4Content: "Our service may contain links to third-party websites (e.g., e-commerce platforms). We are not responsible for their privacy practices. Please review their policies.",
    privacySection5: "5. Policy Updates",
    privacySection5Content: "We may update this policy from time to time. We will notify you of significant changes via email or website notice.",
    privacyContact: "Contact us: scenewai@163.com",

    // Terms of Service
    termsTitle: "Terms of Service",
    termsLastUpdated: "Last Updated: March 7, 2026",
    termsIntro: "Welcome to Scenew. By accessing or using our service, you agree to be bound by these terms.",
    termsSection1: "1. Account Registration",
    termsSection1Content: "You must register an account to use certain features. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.",
    termsSection2: "2. Services",
    termsSection2Content: "Scenew provides AI-based scene synthesis services. We strive to provide high-quality results but do not guarantee that generated content will fully meet your expectations.",
    termsSection3: "3. User Conduct",
    termsSection3Content: "You agree not to use the service for any illegal, infringing, or harmful activities. Uploading violent, pornographic, or copyright-infringing content is strictly prohibited.",
    termsSection4: "4. Intellectual Property",
    termsSection4Content: "We retain all intellectual property rights related to the service. You own the content you upload and grant us a limited license necessary to provide the service.",
    termsSection5: "5. Disclaimer",
    termsSection5Content: "The service is provided \"as is\" without warranties of any kind. We are not liable for any direct or indirect damages arising from the use of the service.",
    termsContact: "Contact: scenewai@163.com",

    // Mode Comparison Modal
    modeComparisonTitle: "Seeding Mode vs Standard Mode",
    modeComparisonDesc: "Seeding Mode automatically integrates product info",
    modeStandardTitle: "Standard Mode (Clean)",
    modeStandardDesc: "Generates clean scene synthesis images, focusing on the blend of person and product without extra elements.",
    modeGrassTitle: "Seeding Mode (Shopping Card)",
    modeGrassDesc: "Automatically extracts product info (price, shop name) and integrates it as a stylish 'Shopping Card' into the image.",
    modeClose: "Got it",

    // Contact
    contactLabel: "Contact Us",
    contactModalTitle: "Contact Us",
    contactModalDesc: "You can contact us via the chat window in the bottom right corner or email us at:",
    contactEmail: "scenewai@163.com",
    contactModalClose: "Got it",

    // Feedback
    feedbackLabel: "Feedback",
    feedbackTitle: "Your Feedback Matters",
    feedbackDesc: "Help us improve with your valuable suggestions",
    feedbackContactHint: "For other questions, please contact:",
    feedbackPlaceholder: "Enter your feedback here...",
    feedbackSubmit: "Submit Feedback",
    feedbackSubmitting: "Submitting...",
    feedbackSuccess: "Feedback submitted successfully",
    feedbackError: "Submission failed, please try again",
    feedbackNetworkError: "Network error, please check connection",
    feedbackContentRequired: "Please enter feedback content",

    // Welcome Letter
    welcomeLetterTitle: "A Letter from Scenew",
    welcomeLetterOpen: "Open Letter",
    welcomeLetterRead: "Read Full Story",
    welcomeLetterClose: "Close for now",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["zh"];

interface User {
  id?: number | string; // Added id field
  username: string;
  email: string;
  avatar?: string;
  credits?: number;
  joinedDate?: string;
}

export interface CostConfig {
  cost_same_style: number;
  cost_new_inspiration: number;
  cost_seed_mode_extra: number;
}

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  redeem: (amount: number) => void;
  refreshUser: () => Promise<void>;
  costConfig: CostConfig | null;
  isLoginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  isRegisterOpen: boolean;
  setRegisterOpen: (open: boolean) => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: "zh",
  setLang: () => {},
  t: (key) => key,
  user: null,
  login: () => {},
  logout: () => {},
  redeem: () => {},
  refreshUser: async () => {},
  costConfig: null,
  isLoginOpen: false,
  setLoginOpen: () => {},
  isRegisterOpen: false,
  setRegisterOpen: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("scenew_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [costConfig, setCostConfig] = useState<CostConfig | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    const fetchCostConfig = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        // Use /auth/cost-config directly as defined in backend openapi.json
        const url = API_BASE ? `${API_BASE}/auth/cost-config` : "/auth/cost-config";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setCostConfig(data);
        }
      } catch (err) {
        console.error("Failed to fetch cost config", err);
      }
    };
    fetchCostConfig();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      setLoginOpen(true);
    };
    window.addEventListener("scenew:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("scenew:unauthorized", handleUnauthorized);
  }, []);

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || key;
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("scenew_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("scenew_user");
    localStorage.removeItem("token");
  };

  const redeem = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, credits: (user.credits || 0) + amount };
      setUser(updatedUser);
      localStorage.setItem("scenew_user", JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      // Use /auth/me directly as defined in backend openapi.json
      const url = API_BASE ? `${API_BASE}/auth/me` : "/auth/me";
      
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
        return;
      }

      if (!res.ok) {
        console.error("Failed to refresh user info");
        return;
      }

      const data = await res.json();
      
      // Update user state with fresh data
      // Response format: { id, email, full_name, avatar_url, is_active, points }
      setUser(prev => {
        if (!prev) return null;
        const updatedUser: User = {
          ...prev,
          id: data.id,
          username: data.full_name || data.username || prev.username,
          email: data.email,
          avatar: data.avatar_url,
          credits: data.points
        };
        localStorage.setItem("scenew_user", JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  useEffect(() => {
    // Only fetch user info once when app loads if token exists
    const token = localStorage.getItem("token");
    if (token && !user) {
      refreshUser();
    }
  }, []);

  return (
    <I18nContext.Provider value={{ 
      lang, 
      setLang, 
      t, 
      user, 
      login, 
      logout, 
      redeem,
      refreshUser,
      costConfig,
      isLoginOpen,
      setLoginOpen,
      isRegisterOpen,
      setRegisterOpen
    }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}