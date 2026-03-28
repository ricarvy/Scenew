import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { toast } from "sonner";

export type Lang = "zh" | "en" | "hi" | "es" | "ar" | "fr" | "ja";

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
    navWardrobe: "我的衣橱",
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
    noGenerationsHint: "如果已有生成记录但无法正常显示，请退出当前登录账号后重新登录",
    viewDetails: "查看详情",
    generatedScene: "生成场景",
    downloadImage: "下载图片",

    // Wardrobe Page
    wardrobeTitle: "我的衣橱",
    wardrobeSubtitle: "按品类整理你的常用穿搭，点击可展开或收起。",
    wardrobeCategoryDress: "连衣裙",
    wardrobeCategoryTshirt: "T恤",
    wardrobeCategoryJeans: "牛仔裤",
    wardrobeExpand: "展开",
    wardrobeCollapse: "收起",
    wardrobeEmpty: "暂无单品，稍后可在这里管理你的衣橱。",
    wardrobeAddButton: "加入衣橱",
    wardrobeAddConfirmTitle: "加入衣橱",
    wardrobeAddConfirmDesc: "要将这个商品加入衣橱吗？",
    wardrobeSelectCategory: "选择分类",
    wardrobeConfirm: "确认加入",
    wardrobeCancel: "取消",
    wardrobeAddSuccess: "已加入衣橱",
    wardrobeAddFailed: "加入失败，请重试",
    wardrobeAddCategory: "新增分类",
    wardrobeDeleteCategory: "删除分类",
    wardrobeDeleteItem: "删除单品",

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
    tryLinkLabel: "商品信息",
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
    tryGenerateFailed: "当前太火爆啦，重新试试吧～",
    loginExpired: "登录已失效，请重新登录",

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
    tryLinkSupportHint: "当前仅支持淘宝/天猫 pc端链接，暂不支持淘口令",

    // Product Input Mode
    tryProductModeLink: "链接模式",
    tryProductModeImage: "图片模式",
    tryProductImageUpload: "点击上传商品图片",
    tryProductImageFormat: "支持 JPG / PNG，最大 10MB",
    tryProductImageUploaded: "已上传",
    tryProductImageChange: "更换图片",
    trySeedModeImageWarning: "种草模式仅在链接模式下可用，因为需要从商品链接中获取价格、店铺等信息来生成购物卡片。",
    tryValidationProduct: "请上传商品图片或粘贴商品链接",

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
    modeComparisonTitle: "种草模式 vs 标准模式",
    modeComparisonDesc: "种草模式能够自动融合商品信息",
    modeStandardTitle: "标准模式（纯净版）",
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
    contactModalEmailHint: "scenewai@163.com",
    
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
    pricingPaymentSuccess: "支付成功！点数已到账",
    pricingPaymentCancelled: "支付已取消",
    pricingLoginRequired: "请先登录后再充值",
    pricingProcessing: "正在跳转支付页面…",
    paymentSuccessTitle: "充值成功",
    paymentSuccessDesc: "感谢您的购买，点数已即时到账！",
    paymentBalanceBefore: "充值前余额",
    paymentPointsAdded: "本次充值",
    paymentBalanceAfter: "当前余额",
    paymentSuccessOk: "太好了！",
    paymentCancelledTitle: "支付已取消",
    paymentCancelledDesc: "您取消了本次支付，不会产生任何扣款。如需帮助，请联系客服。",
    paymentCancelledOk: "返回选择",

    // Payment History
    navPaymentHistory: "充值记录",
    paymentHistoryTitle: "充值记录",
    paymentHistoryEmpty: "暂无充值记录",
    paymentHistoryEmptyDesc: "完成首次充值后，记录将会在这里显示",
    paymentHistoryPlan: "套餐",
    paymentHistoryAmount: "金额",
    paymentHistoryPoints: "点数",
    paymentHistoryStatus: "状态",
    paymentHistoryTime: "时间",
    paymentHistoryCompleted: "已完成",
    paymentHistoryPending: "处理中",
    paymentHistoryFailed: "失败",
    paymentHistoryStarter: "入门包",
    paymentHistoryGrowth: "成长包",
    paymentHistoryPro: "专业包",

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
    navWardrobe: "My Wardrobe",
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
    noGenerationsHint: "If you have existing generation records but they are not displaying correctly, please log out and log in again.",
    viewDetails: "View Details",
    generatedScene: "Generated Scene",
    downloadImage: "Download Image",

    // Wardrobe Page
    wardrobeTitle: "My Wardrobe",
    wardrobeSubtitle: "Organize your outfits by category. Click to expand or collapse each section.",
    wardrobeCategoryDress: "Dresses",
    wardrobeCategoryTshirt: "T-Shirts",
    wardrobeCategoryJeans: "Jeans",
    wardrobeExpand: "Expand",
    wardrobeCollapse: "Collapse",
    wardrobeEmpty: "No items yet. You can manage your wardrobe here soon.",
    wardrobeAddButton: "Add to Wardrobe",
    wardrobeAddConfirmTitle: "Add to Wardrobe",
    wardrobeAddConfirmDesc: "Add this product to your wardrobe?",
    wardrobeSelectCategory: "Choose category",
    wardrobeConfirm: "Confirm",
    wardrobeCancel: "Cancel",
    wardrobeAddSuccess: "Added to wardrobe",
    wardrobeAddFailed: "Failed to add. Please try again",
    wardrobeAddCategory: "Add Category",
    wardrobeDeleteCategory: "Delete Category",
    wardrobeDeleteItem: "Delete Item",

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
    tryLinkLabel: "Product Info",
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
    tryGenerateFailed: "It's too popular right now, please try again~",
    loginExpired: "Session expired, please login again",

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
    pricingPlan1Price: "6.99",
    pricingPlan1Points: "200 pts",
    pricingPlan1Desc: "$0.035/pt",
    pricingPlan2Title: "Growth",
    pricingPlan2Price: "17.99",
    pricingPlan2Points: "600 pts",
    pricingPlan2Desc: "$0.030/pt",
    pricingPlan2Discount: "20% OFF",
    pricingPlan3Title: "Pro",
    pricingPlan3Price: "27.99",
    pricingPlan3Points: "1000 pts",
    pricingPlan3Desc: "$0.028/pt",
    pricingPlan3Discount: "30% OFF",
    pricingCurrency: "$",
    pricingBuy: "Top Up",
    pricingFeature1: "No Watermark",
    pricingFeature2: "Valid Forever",
    pricingFeature3: "Priority Queue",
    pricingPopular: "Most Popular",
    pricingBetaModalTitle: "Beta Phase Notice",
    pricingBetaModalDesc: "The product is currently in beta and does not support direct top-up. Please contact scenewai@163.com to get an invitation code for credit redemption.",
    pricingBetaModalClose: "Got it",
    pricingPaymentSuccess: "Payment successful! Credits added",
    pricingPaymentCancelled: "Payment cancelled",
    pricingLoginRequired: "Please login before purchasing",
    pricingProcessing: "Redirecting to payment…",
    paymentSuccessTitle: "Payment Successful",
    paymentSuccessDesc: "Thank you for your purchase! Credits have been added instantly.",
    paymentBalanceBefore: "Balance before",
    paymentPointsAdded: "Credits added",
    paymentBalanceAfter: "Current balance",
    paymentSuccessOk: "Great!",
    paymentCancelledTitle: "Payment Cancelled",
    paymentCancelledDesc: "You cancelled this payment. No charges were made. Contact support if you need help.",
    paymentCancelledOk: "Go back",

    // Payment History
    navPaymentHistory: "Payment History",
    paymentHistoryTitle: "Payment History",
    paymentHistoryEmpty: "No payment records",
    paymentHistoryEmptyDesc: "Your payment history will appear here after your first purchase",
    paymentHistoryPlan: "Plan",
    paymentHistoryAmount: "Amount",
    paymentHistoryPoints: "Credits",
    paymentHistoryStatus: "Status",
    paymentHistoryTime: "Date",
    paymentHistoryCompleted: "Completed",
    paymentHistoryPending: "Pending",
    paymentHistoryFailed: "Failed",
    paymentHistoryStarter: "Starter",
    paymentHistoryGrowth: "Growth",
    paymentHistoryPro: "Pro",

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
    tryLinkSupportHint: "Currently only supports Taobao/Tmall PC links, Taobao Key not supported yet",

    // Product Input Mode
    tryProductModeLink: "Link Mode",
    tryProductModeImage: "Image Mode",
    tryProductImageUpload: "Click to upload product image",
    tryProductImageFormat: "Supports JPG / PNG, max 10MB",
    tryProductImageUploaded: "Uploaded",
    tryProductImageChange: "Change Image",
    trySeedModeImageWarning: "Seeding Mode is only available in Link Mode, as it needs product info (price, shop name, etc.) from the link to generate the shopping card.",
    tryValidationProduct: "Please upload a product image or paste a product link",

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
    modeComparisonDesc: "Seeding Mode automatically integrates product information",
    modeStandardTitle: "Standard Mode (Clean)",
    modeStandardDesc: "Generates clean scene synthesis images, focusing on the blend of person and product without extra elements.",
    modeGrassTitle: "Seeding Mode (Shopping Card)",
    modeGrassDesc: "Automatically extracts product information (price, shop name) and integrates it as a stylish 'Shopping Card' into the image.",
    modeClose: "Got it",

    // Contact
    contactLabel: "Contact Us",
    contactModalTitle: "Contact Us",
    contactModalDesc: "You can contact us via the chat window in the bottom right corner or email us at:",
    contactEmail: "scenewai@163.com",
    contactModalClose: "Got it",
    contactModalEmailHint: "scenewai@163.com",

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
  hi: {
    // Navbar
    navHow: "उपयोग गाइड",
    navShowcase: "शोकेस",
    navFeatures: "विशेषताएँ",
    navTry: "आज़माएँ",
    navPricing: "मूल्य निर्धारण",
    navBlog: "ब्लॉग",
    navLogin: "लॉगिन",
    navLogout: "लॉगआउट",
    navProfile: "प्रोफ़ाइल",
    navGenerations: "मेरी जनरेशन",
    navWardrobe: "मेरी अलमारी",
    langLabel: "हिन्दी",

    // Blog
    blogTitle: "ब्लॉग",
    blogSubtitle: "AI सीन सिंथेसिस में नवीनतम रुझान और प्रेरणा खोजें",
    blogReadMore: "पूरा पढ़ें",
    blogBack: "ब्लॉग पर वापस",
    blogPublished: "प्रकाशित",
    blogShare: "शेयर करें",

    // Generations Page
    myGenerationsTitle: "मेरी जनरेशन",
    noGenerationsTitle: "अभी तक कोई जनरेशन नहीं",
    noGenerationsDesc: "अपना पहला सीन बनाएँ!",
    noGenerationsHint: "यदि आपके पास मौजूदा जनरेशन रिकॉर्ड हैं लेकिन वे सही ढंग से प्रदर्शित नहीं हो रहे, तो कृपया लॉगआउट करके पुनः लॉगिन करें।",
    viewDetails: "विवरण देखें",
    generatedScene: "जनरेट किया गया सीन",
    downloadImage: "इमेज डाउनलोड करें",

    // Wardrobe Page
    wardrobeTitle: "मेरी अलमारी",
    wardrobeSubtitle: "अपने कपड़ों को श्रेणी के अनुसार व्यवस्थित करें। सेक्शन खोलने या बंद करने के लिए क्लिक करें।",
    wardrobeCategoryDress: "ड्रेस",
    wardrobeCategoryTshirt: "टी-शर्ट",
    wardrobeCategoryJeans: "जीन्स",
    wardrobeExpand: "खोलें",
    wardrobeCollapse: "समेटें",
    wardrobeEmpty: "अभी कोई आइटम नहीं। जल्द ही आप यहां अपनी अलमारी प्रबंधित कर पाएंगे।",
    wardrobeAddButton: "अलमारी में जोड़ें",
    wardrobeAddConfirmTitle: "अलमारी में जोड़ें",
    wardrobeAddConfirmDesc: "क्या आप इस प्रोडक्ट को अपनी अलमारी में जोड़ना चाहते हैं?",
    wardrobeSelectCategory: "श्रेणी चुनें",
    wardrobeConfirm: "पुष्टि करें",
    wardrobeCancel: "रद्द करें",
    wardrobeAddSuccess: "अलमारी में जोड़ दिया गया",
    wardrobeAddFailed: "जोड़ने में विफल, कृपया पुनः प्रयास करें",
    wardrobeAddCategory: "श्रेणी जोड़ें",
    wardrobeDeleteCategory: "श्रेणी हटाएं",
    wardrobeDeleteItem: "आइटम हटाएं",

    // Profile Modal
    profileTitle: "प्रोफ़ाइल",
    profileUsername: "उपयोगकर्ता नाम",
    profileEmail: "ईमेल",
    profilePassword: "पासवर्ड",
    profileRegisterDate: "शामिल हुए",
    profilePoints: "क्रेडिट",
    profileEdit: "संपादित करें",
    profileSave: "सहेजें",
    profileCancel: "रद्द करें",
    profileChangePassword: "पासवर्ड बदलें",
    profilePointsUnit: "अंक",
    profileLogout: "लॉगआउट",

    // Hero
    heroTag: "SCENEW — AI सीन सिंथेसिस",
    heroTitle: "अपने जीवन को नई नज़र से देखें",
    heroSubtitle:
      "अपनी फ़ोटो अपलोड करें, प्रोडक्ट लिंक पेस्ट करें, अपना मनचाहा सीन बताएँ — AI आपको प्रोडक्ट के साथ सीन में रखकर कम्पोज़िट बनाता है।",
    heroStart: "शुरू करें",
    heroLearn: "और जानें",
    heroRedeem: "कोड रिडीम करें",
    heroRedeemSuccess: "सफलतापूर्वक रिडीम हुआ! अपनी यात्रा शुरू करें।",
    heroRedeemCodeLabel: "रिडेम्पशन कोड",
    heroRedeemCodePlaceholder: "कोड दर्ज करें",
    heroRedeemSubmit: "रिडीम करें",
    heroRedeemCancel: "रद्द करें",
    heroRedeemLoginFirst: "रिडीम करने के लिए पहले लॉगिन करें",
    heroRedeemEnterCode: "कृपया रिडेम्पशन कोड दर्ज करें",
    heroRedeemCreditsAdded: "क्रेडिट +",
    heroRedeemFailed: "अमान्य रिडेम्पशन कोड",
    heroRedeemNetworkError: "नेटवर्क त्रुटि। कृपया सर्वर कनेक्शन जाँचें",

    // HowItWorks
    howTag: "कैसे काम करता है",
    howTitle: "चार कदम, कल्पना से वास्तविकता तक",
    step1Title: "अपनी फ़ोटो अपलोड करें",
    step1Desc:
      "हाफ-बॉडी या फुल-बॉडी — AI आपकी विशेषताओं को सटीक रूप से निकालता है।",
    step2Title: "प्रोडक्ट लिंक पेस्ट करें",
    step2Desc:
      "Taobao, JD, Tmall, Xiaohongshu, Amazon, eBay, Shopee आदि को सपोर्ट करता है।",
    step3Title: "सीन का वर्णन करें",
    step3Desc:
      "\"पेरिस की सड़कों पर चलना\" \"पहाड़ की चोटी पर कैम्पिंग\" \"ऑफ़िस में मीटिंग\" — आप बताएँ, AI बनाए।",
    step4Title: "सीन जनरेट करें",
    step4Desc:
      "मिनटों में उच्च-गुणवत्ता वाली कम्पोज़िट इमेज प्राप्त करें।",

    // Showcase
    showTag: "शोकेस",
    showTitle: "असीमित सीन, अनंत प्रेरणा",
    showSubtitle:
      "शहर की सड़कों से लेकर पहाड़ की चोटियों तक — हर सीन आपका ट्रायल रूम बन जाता है",
    show1Title: "अर्बन स्टाइल",
    show1Scene: "\"टोक्यो शिबुया की सड़कों पर यह ट्रेंच कोट पहनकर\"",
    show2Title: "होम लिविंग",
    show2Scene: "\"यह सोफ़ा मेरे लिविंग रूम में कैसा दिखेगा\"",
    show3Title: "आउटडोर एडवेंचर",
    show3Scene: "\"इस बैकपैक के साथ बर्फ़ीली चोटी पर खड़े होकर\"",
    show4Title: "बीच वेकेशन",
    show4Scene: "\"इस ड्रेस में मालदीव के बीच पर टहलते हुए\"",

    // Features
    featTag: "विशेषताएँ",
    featTitle: "Scenew क्यों चुनें",
    feat1Title: "मिनटों में जनरेशन",
    feat1Desc:
      "उन्नत AI मॉडल से संचालित, सीन सिंथेसिस मिनटों में पूरी होती है।",
    feat2Title: "गोपनीयता पहले",
    feat2Desc:
      "फ़ोटो केवल वर्तमान जनरेशन के लिए उपयोग होती हैं, प्रोसेसिंग के बाद स्वतः डिलीट हो जाती हैं।",
    feat3Title: "ग्लोबल कॉमर्स",
    feat3Desc:
      "Taobao, JD, Amazon, Shopee और सभी प्रमुख ई-कॉमर्स प्लेटफ़ॉर्म के लिंक सपोर्ट करता है।",
    feat4Title: "यथार्थवादी गुणवत्ता",
    feat4Desc:
      "प्रकाश, परिप्रेक्ष्य और सामग्री का प्राकृतिक मिश्रण — फ़ोटो जैसे परिणाम।",
    feat5Title: "सोशल शेयरिंग",
    feat5Desc:
      "WeChat, Xiaohongshu और Instagram के लिए शेयर-रेडी इमेज एक क्लिक में।",
    feat6Title: "मल्टी-सीन",
    feat6Desc:
      "एक ही प्रोडक्ट, एक क्लिक में कई सीन — स्ट्रीट, होम, वेकेशन, प्रोफ़ेशनल।",

    // TryIt
    tryTag: "अभी आज़माएँ",
    tryTitle: "अपना पहला सीन सिंथेसिस शुरू करें",
    tryTabCopy: "कॉपी",
    tryTabInspire: "प्रेरणा",
    trySloganCopy: "क्लासिक इसलिए क्लासिक हैं क्योंकि उनकी नकल होती है",
    trySloganInspire: "अपनी खुद की चमकदार स्टाइल बनाएँ",
    trySceneImageLabel: "सीन रेफ़रेंस इमेज",
    trySceneImageOptional: "(वैकल्पिक)",
    trySceneImageUpload: "एक सीन फ़ोटो अपलोड करें, AI इसे सिंथेसिस के लिए रेफ़रेंस करेगा",
    trySceneImageFormat: "JPG / PNG सपोर्ट, अधिकतम 10MB",
    trySceneImageUploaded: "अपलोड हो गया",
    trySceneImageChange: "इमेज बदलें",
    tryPhotoLabel: "आपकी फ़ोटो",
    tryPhotoUpload: "हाफ-बॉडी या फुल-बॉडी फ़ोटो अपलोड करने के लिए क्लिक करें",
    tryPhotoFormat: "JPG / PNG सपोर्ट, अधिकतम 10MB",
    tryPhotoUploaded: "अपलोड हो गया",
    tryPhotoChange: "फ़ोटो बदलें",
    tryLinkLabel: "प्रोडक्ट जानकारी",
    tryLinkPlaceholder: "लिंक पेस्ट करें और 'जोड़ें' पर क्लिक करके ऑटो-पार्स करें",
    trySceneLabel: "सीन विवरण",
    trySceneOptional: "(वैकल्पिक)",
    tryScenePlaceholder:
      "अपना मनचाहा सीन बताएँ, जैसे \"शरद ऋतु की दोपहर में पेरिस में सीन नदी के किनारे चलना\"",
    trySceneSuggestTitle: "ये सीन आज़माएँ ✨",
    trySceneSuggest1: "पेरिस की सड़कों पर, शरद ऋतु की धूप",
    trySceneSuggest2: "एक आरामदायक कैफ़े में किताब पढ़ना",
    trySceneSuggest3: "पार्क के रास्ते पर टहलना",
    trySceneSuggest4: "आधुनिक ऑफ़िस में आत्मविश्वास से काम करना",
    trySceneSuggest5: "समुद्र तट पर सूर्यास्त के समय फ़ोटो",
    trySceneSuggest6: "घर के लिविंग रूम में आराम करना",
    tryGenerate: "सीन जनरेट करें",
    tryGenerating: "AI सीन बना रहा है...",
    tryPreview: "सीन प्रीव्यू",
    tryPreviewHint: "फ़ोटो अपलोड करें और प्रोडक्ट लिंक पेस्ट करके जनरेट करें",
    tryPreviewGenerating: "आपके एक्सक्लूसिव पैरेलल यूनिवर्स में प्रवेश हो रहा है...",
    tryPreviewBackgroundTask: "बैकग्राउंड टास्क शुरू हो गया। आप पेज रिफ्रेश या छोड़ सकते हैं। 'मेरी जनरेशन' में परिणाम देखें।",
    tryValidationPhoto: "कृपया पहले अपनी फ़ोटो अपलोड करें",
    tryValidationLink: "कृपया प्रोडक्ट लिंक पेस्ट करें",
    tryResultTitle: "अपने आप का एक और रूप खोजें",
    tryResultRegenerate: "पुनः जनरेट करें",
    tryModeSameStyle: "सेम स्टाइल",
    tryModeNewInspiration: "नई प्रेरणा",
    tryModeSeeding: "सीडिंग मोड",
    tryBackHome: "होम पर वापस",
    tryGenerateFailed: "अभी बहुत भीड़ है, कृपया पुनः प्रयास करें~",
    loginExpired: "सत्र समाप्त हो गया, कृपया पुनः लॉगिन करें",

    // Footer
    footerSlogan: "हर खरीदारी को जीवंत बनाएँ",
    footerProduct: "प्रोडक्ट",
    footerPricing: "मूल्य निर्धारण",
    footerBlog: "ब्लॉग",
    footerAbout: "हमारे बारे में",
    footerCopyright:
      "© 2026 Scenew. सर्वाधिकार सुरक्षित। AI से शॉपिंग को पुनर्परिभाषित करना।",

    // Pricing
    pricingTag: "मूल्य निर्धारण",
    pricingTitle: "अपना प्लान चुनें",
    pricingSubtitle: "लचीला टॉप-अप, हमेशा के लिए मान्य",
    pricingPlan1Title: "स्टार्टर",
    pricingPlan1Price: "579",
    pricingPlan1Points: "200 अंक",
    pricingPlan1Desc: "₹2.90/अंक",
    pricingPlan2Title: "ग्रोथ",
    pricingPlan2Price: "1,499",
    pricingPlan2Points: "600 अंक",
    pricingPlan2Desc: "₹2.50/अंक",
    pricingPlan2Discount: "14% छूट",
    pricingPlan3Title: "प्रो",
    pricingPlan3Price: "2,299",
    pricingPlan3Points: "1000 अंक",
    pricingPlan3Desc: "₹2.30/अंक",
    pricingPlan3Discount: "21% छूट",
    pricingCurrency: "₹",
    pricingBuy: "टॉप अप करें",
    pricingFeature1: "बिना वॉटरमार्क",
    pricingFeature2: "हमेशा के लिए मान्य",
    pricingFeature3: "प्राथमिकता क्यू",
    pricingPopular: "सबसे लोकप्रिय",

    // Login Modal
    loginTitle: "Scenew में आपका स्वागत है",
    loginSubtitle: "AI सीन सिंथेसिस अनुभव शुरू करने के लिए साइन इन करें",
    loginGoogle: "Google से जारी रखें",
    loginTerms: "साइन इन करके, आप हमारी",
    loginTermsLink: "सेवा की शर्तें",
    loginAnd: "और",
    loginPrivacy: "गोपनीयता नीति",
    loginClose: "बंद करें",

    // Email Login
    loginEmailLabel: "ईमेल",
    loginEmailPlaceholder: "अपना ईमेल दर्ज करें",
    loginPasswordLabel: "पासवर्ड",
    loginPasswordPlaceholder: "अपना पासवर्ड दर्ज करें",
    loginSubmit: "साइन इन",
    loginNoAccount: "खाता नहीं है?",
    loginRegisterLink: "साइन अप करें",
    loginOr: "या",
    loginEmailError: "कृपया एक मान्य ईमेल दर्ज करें",
    loginPasswordError: "कृपया अपना पासवर्ड दर्ज करें",

    // Register Modal
    registerTitle: "अपना Scenew खाता बनाएँ",
    registerSubtitle: "AI सीन सिंथेसिस यात्रा शुरू करने के लिए साइन अप करें",
    registerUsername: "उपयोगकर्ता नाम",
    registerUsernamePlaceholder: "अपना उपयोगकर्ता नाम दर्ज करें",
    registerEmail: "ईमेल",
    registerEmailPlaceholder: "अपना ईमेल दर्ज करें",
    registerPassword: "पासवर्ड",
    registerPasswordPlaceholder: "कम से कम 8 अक्षर, अक्षर और संख्याएँ",
    registerConfirmPassword: "पासवर्ड की पुष्टि करें",
    registerConfirmPlaceholder: "पासवर्ड पुनः दर्ज करें",
    registerSubmit: "साइन अप",
    registerHaveAccount: "पहले से खाता है?",
    registerLoginLink: "साइन इन करें",
    registerSuccess: "रजिस्ट्रेशन सफल! लॉगिन पर रीडायरेक्ट हो रहा है…",
    registerErrUsername: "कृपया उपयोगकर्ता नाम दर्ज करें",
    registerErrEmail: "कृपया एक मान्य ईमेल दर्ज करें",
    registerErrPassword: "पासवर्ड 8+ अक्षर का होना चाहिए, अक्षर और संख्याओं के साथ",
    registerErrConfirm: "पासवर्ड मेल नहीं खाते",

    // Product Links (multi)
    tryLinkAdd: "जोड़ें",
    tryLinkPaste: "प्रोडक्ट लिंक पेस्ट करें और जोड़ें",
    tryLinkDetected: "प्लेटफ़ॉर्म पहचाना गया",
    tryLinkRemove: "हटाएँ",
    tryLinkEmpty: "अभी कोई प्रोडक्ट नहीं। जोड़ने के लिए लिंक पेस्ट करें",
    tryLinkFetching: "प्रोडक्ट जानकारी प्राप्त हो रही है…",
    tryLinkFetchError: "प्राप्त करने में विफल, कृपया लिंक जाँचें",
    tryLinkMax: "अधिकतम 5 प्रोडक्ट लिंक",
    tryLinkAdded: "जोड़ा गया",
    tryLinkInfoUnavailable: "प्रोडक्ट विवरण अनुपलब्ध",
    tryLinkRetry: "पुनः प्रयास करें",
    tryLinkUnsupported: "प्लेटफ़ॉर्म अभी सपोर्ट नहीं करता। वर्तमान में केवल Taobao/Tmall लिंक सपोर्ट हैं।",
    tryLinkSupportHint: "वर्तमान में केवल Taobao/Tmall PC लिंक सपोर्ट हैं",

    // Product Input Mode
    tryProductModeLink: "लिंक मोड",
    tryProductModeImage: "इमेज मोड",
    tryProductImageUpload: "प्रोडक्ट इमेज अपलोड करने के लिए क्लिक करें",
    tryProductImageFormat: "JPG / PNG सपोर्ट, अधिकतम 10MB",
    tryProductImageUploaded: "अपलोड हो गया",
    tryProductImageChange: "इमेज बदलें",
    trySeedModeImageWarning: "सीडिंग मोड केवल लिंक मोड में उपलब्ध है, क्योंकि शॉपिंग कार्ड बनाने के लिए लिंक से प्रोडक्ट जानकारी (कीमत, दुकान का नाम आदि) चाहिए।",
    tryValidationProduct: "कृपया प्रोडक्ट इमेज अपलोड करें या प्रोडक्ट लिंक पेस्ट करें",

    // Browser Login Modal
    browserLoginTitle: "प्लेटफ़ॉर्म लॉगिन आवश्यक",
    browserLoginDesc: "इस प्रोडक्ट को एक्सेस करने के लिए लॉगिन आवश्यक है। कृपया नीचे विंडो में लॉगिन पूरा करें",
    browserLoginLoading: "रिमोट ब्राउज़र शुरू हो रहा है…",
    browserLoginConfirm: "लॉगिन पूरा हुआ",
    browserLoginCancel: "रद्द करें",
    browserLoginSuccess: "लॉगिन सफल, प्रोडक्ट जानकारी पुनः प्राप्त हो रही है…",

    // Privacy Policy
    privacyTitle: "गोपनीयता नीति",
    privacyLastUpdated: "अंतिम अपडेट: 7 मार्च, 2026",
    privacyIntro: "Scenew आपकी गोपनीयता को महत्व देता है। यह गोपनीयता नीति बताती है कि हम आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग, संग्रहीत और सुरक्षित करते हैं।",
    privacySection1: "1. जानकारी संग्रह",
    privacySection1Content: "हम आपके द्वारा प्रदान की गई जानकारी एकत्र करते हैं, जिसमें शामिल हैं: रजिस्ट्रेशन पर ईमेल और उपयोगकर्ता नाम; आपके द्वारा अपलोड की गई फ़ोटो और प्रोडक्ट लिंक; और उपयोग डेटा।",
    privacySection2: "2. फ़ोटो उपयोग और संग्रहण",
    privacySection2Content: "आपके द्वारा अपलोड की गई फ़ोटो केवल वर्तमान जनरेशन कार्य के लिए उपयोग होती हैं। मूल फ़ोटो 24 घंटों के भीतर स्वतः डिलीट हो जाती हैं।",
    privacySection3: "3. डेटा सुरक्षा",
    privacySection3Content: "हम आपके डेटा की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपायों का उपयोग करते हैं।",
    privacySection4: "4. तृतीय-पक्ष सेवाएँ",
    privacySection4Content: "हमारी सेवा में तृतीय-पक्ष वेबसाइटों के लिंक हो सकते हैं। हम उनकी गोपनीयता प्रथाओं के लिए ज़िम्मेदार नहीं हैं।",
    privacySection5: "5. नीति अपडेट",
    privacySection5Content: "हम समय-समय पर इस नीति को अपडेट कर सकते हैं। महत्वपूर्ण परिवर्तनों की सूचना ईमेल या वेबसाइट नोटिस द्वारा दी जाएगी।",
    privacyContact: "संपर्क करें: scenewai@163.com",

    // Terms of Service
    termsTitle: "सेवा की शर्तें",
    termsLastUpdated: "अंतिम अपडेट: 7 मार्च, 2026",
    termsIntro: "Scenew में आपका स्वागत है। हमारी सेवा का उपयोग करके, आप इन शर्तों से सहमत होते हैं।",
    termsSection1: "1. खाता रजिस्ट्रेशन",
    termsSection1Content: "कुछ सुविधाओं का उपयोग करने के लिए आपको खाता रजिस्टर करना होगा। आप अपने खाते की जानकारी की गोपनीयता बनाए रखने के लिए ज़िम्मेदार हैं।",
    termsSection2: "2. सेवाएँ",
    termsSection2Content: "Scenew AI-आधारित सीन सिंथेसिस सेवाएँ प्रदान करता है। हम उच्च-गुणवत्ता परिणाम देने का प्रयास करते हैं लेकिन गारंटी नहीं दे सकते।",
    termsSection3: "3. उपयोगकर्ता आचरण",
    termsSection3Content: "आप सहमत हैं कि सेवा का उपयोग किसी भी अवैध या हानिकारक गतिविधियों के लिए नहीं करेंगे।",
    termsSection4: "4. बौद्धिक संपदा",
    termsSection4Content: "हम सेवा से संबंधित सभी बौद्धिक संपदा अधिकार रखते हैं। आप अपनी अपलोड की सामग्री के मालिक हैं।",
    termsSection5: "5. अस्वीकरण",
    termsSection5Content: "सेवा \"जैसी है\" प्रदान की जाती है, बिना किसी वारंटी के।",
    termsContact: "संपर्क: scenewai@163.com",

    // Mode Comparison Modal
    modeComparisonTitle: "सीडिंग मोड vs स्टैंडर्ड मोड",
    modeComparisonDesc: "सीडिंग मोड स्वचालित रूप से प्रोडक्ट जानकारी एकीकृत करता है",
    modeStandardTitle: "स्टैंडर्ड मोड (क्लीन)",
    modeStandardDesc: "क्लीन सीन सिंथेसिस इमेज जनरेट करता है, व्यक्ति और प्रोडक्ट के मिश्रण पर ध्यान केंद्रित करता है।",
    modeGrassTitle: "सीडिंग मोड (शॉपिंग कार्ड)",
    modeGrassDesc: "स्वचालित रूप से प्रोडक्ट जानकारी (कीमत, दुकान का नाम) निकालता है और स्टाइलिश शॉपिंग कार्ड के रूप में इमेज में जोड़ता है।",
    modeClose: "समझ गया",

    // Contact
    contactLabel: "संपर्क करें",
    contactModalTitle: "संपर्क करें",
    contactModalDesc: "आप निचले दाएँ कोने में चैट विंडो या ईमेल के माध्यम से हमसे संपर्क कर सकते हैं:",
    contactEmail: "scenewai@163.com",
    contactModalClose: "समझ गया",
    contactModalEmailHint: "scenewai@163.com",

    // Feedback
    feedbackLabel: "फ़ीडबैक",
    feedbackTitle: "आपकी प्रतिक्रिया महत्वपूर्ण है",
    feedbackDesc: "अपने बहुमूल्य सुझावों से हमें बेहतर बनने में मदद करें",
    feedbackContactHint: "अन्य प्रश्नों के लिए, कृपया संपर्क करें:",
    feedbackPlaceholder: "अपनी प्रतिक्रिया यहाँ दर्ज करें...",
    feedbackSubmit: "फ़ीडबैक सबमिट करें",
    feedbackSubmitting: "सबमिट हो रहा है...",
    feedbackSuccess: "फ़ीडबैक सफलतापूर्वक सबमिट हुआ",
    feedbackError: "सबमिशन विफल, कृपया पुनः प्रयास करें",
    feedbackNetworkError: "नेटवर्क त्रुटि, कृपया कनेक्शन जाँचें",
    feedbackContentRequired: "कृपया फ़ीडबैक सामग्री दर्ज करें",
    pricingBetaModalTitle: "बीटा चरण सूचना",
    pricingBetaModalDesc: "उत्पाद वर्तमान में बीटा में है। कृपया इन्विटेशन कोड के लिए scenewai@163.com से संपर्क करें।",
    pricingBetaModalClose: "समझ गया",
    pricingPaymentSuccess: "भुगतान सफल! क्रेडिट जोड़ दिए गए",
    pricingPaymentCancelled: "भुगतान रद्द किया गया",
    pricingLoginRequired: "कृपया खरीदने से पहले लॉगिन करें",
    pricingProcessing: "भुगतान पेज पर रीडायरेक्ट हो रहा है…",
    paymentSuccessTitle: "भुगतान सफल",
    paymentSuccessDesc: "आपकी खरीदारी के लिए धन्यवाद! क्रेडिट तुरंत जोड़ दिए गए हैं।",
    paymentBalanceBefore: "पहले का बैलेंस",
    paymentPointsAdded: "जोड़े गए क्रेडिट",
    paymentBalanceAfter: "वर्तमान बैलेंस",
    paymentSuccessOk: "बहुत बढ़िया!",
    paymentCancelledTitle: "भुगतान रद्द",
    paymentCancelledDesc: "आपने यह भुगतान रद्द कर दिया। कोई शुल्क नहीं लगा। सहायता के लिए संपर्क करें।",
    paymentCancelledOk: "वापस जाएँ",

    // Payment History
    navPaymentHistory: "भुगतान इतिहास",
    paymentHistoryTitle: "भुगतान इतिहास",
    paymentHistoryEmpty: "कोई भुगतान रिकॉर्ड नहीं",
    paymentHistoryEmptyDesc: "आपकी पहली खरीदारी के बाद भुगतान इतिहास यहाँ दिखाई देगा",
    paymentHistoryPlan: "प्लान",
    paymentHistoryAmount: "राशि",
    paymentHistoryPoints: "क्रेडिट",
    paymentHistoryStatus: "स्थिति",
    paymentHistoryTime: "तारीख",
    paymentHistoryCompleted: "पूर्ण",
    paymentHistoryPending: "प्रक्रिया में",
    paymentHistoryFailed: "विफल",
    paymentHistoryStarter: "स्टार्टर",
    paymentHistoryGrowth: "ग्रोथ",
    paymentHistoryPro: "प्रो",

    // Welcome Letter
    welcomeLetterTitle: "Scenew की ओर से एक पत्र",
    welcomeLetterOpen: "पत्र खोलें",
    welcomeLetterRead: "पूरी कहानी पढ़ें",
    welcomeLetterClose: "अभी बंद करें",
  },
  es: {
    // Navbar
    navHow: "Guía de uso",
    navShowcase: "Galería",
    navFeatures: "Características",
    navTry: "Probar",
    navPricing: "Precios",
    navBlog: "Blog",
    navLogin: "Iniciar sesión",
    navLogout: "Cerrar sesión",
    navProfile: "Perfil",
    navGenerations: "Mis generaciones",
    navWardrobe: "Mi Armario",
    langLabel: "Español",

    // Blog
    blogTitle: "Blog",
    blogSubtitle: "Descubre las últimas tendencias e inspiración en síntesis de escenas con IA",
    blogReadMore: "Leer más",
    blogBack: "Volver al blog",
    blogPublished: "Publicado el",
    blogShare: "Compartir",

    // Generations Page
    myGenerationsTitle: "Mis generaciones",
    noGenerationsTitle: "Aún no hay generaciones",
    noGenerationsDesc: "¡Crea tu primera escena!",
    noGenerationsHint: "Si tienes registros de generación pero no se muestran correctamente, cierra sesión y vuelve a iniciarla.",
    viewDetails: "Ver detalles",
    generatedScene: "Escena generada",
    downloadImage: "Descargar imagen",

    // Wardrobe Page
    wardrobeTitle: "Mi Armario",
    wardrobeSubtitle: "Organiza tus prendas por categoría. Haz clic para expandir o contraer cada sección.",
    wardrobeCategoryDress: "Vestidos",
    wardrobeCategoryTshirt: "Camisetas",
    wardrobeCategoryJeans: "Jeans",
    wardrobeExpand: "Expandir",
    wardrobeCollapse: "Contraer",
    wardrobeEmpty: "Aún no hay prendas. Pronto podrás gestionar tu armario aquí.",
    wardrobeAddButton: "Añadir al armario",
    wardrobeAddConfirmTitle: "Añadir al armario",
    wardrobeAddConfirmDesc: "¿Quieres añadir este producto a tu armario?",
    wardrobeSelectCategory: "Elegir categoría",
    wardrobeConfirm: "Confirmar",
    wardrobeCancel: "Cancelar",
    wardrobeAddSuccess: "Añadido al armario",
    wardrobeAddFailed: "No se pudo añadir. Inténtalo de nuevo",
    wardrobeAddCategory: "Añadir categoría",
    wardrobeDeleteCategory: "Eliminar categoría",
    wardrobeDeleteItem: "Eliminar prenda",

    // Profile Modal
    profileTitle: "Perfil",
    profileUsername: "Nombre de usuario",
    profileEmail: "Correo electrónico",
    profilePassword: "Contraseña",
    profileRegisterDate: "Fecha de registro",
    profilePoints: "Créditos",
    profileEdit: "Editar",
    profileSave: "Guardar",
    profileCancel: "Cancelar",
    profileChangePassword: "Cambiar contraseña",
    profilePointsUnit: "pts",
    profileLogout: "Cerrar sesión",

    // Hero
    heroTag: "SCENEW — Síntesis de escenas con IA",
    heroTitle: "Visualiza tu vida de nuevo",
    heroSubtitle:
      "Sube tu foto, pega un enlace de producto, describe la escena deseada — la IA crea un compuesto de ti con el producto en contexto, dando vida a cada compra.",
    heroStart: "Comenzar",
    heroLearn: "Más información",
    heroRedeem: "Canjear código",
    heroRedeemSuccess: "¡Canjeado con éxito! Comienza tu viaje.",
    heroRedeemCodeLabel: "Código de canje",
    heroRedeemCodePlaceholder: "Introduce el código",
    heroRedeemSubmit: "Canjear",
    heroRedeemCancel: "Cancelar",
    heroRedeemLoginFirst: "Inicia sesión para canjear",
    heroRedeemEnterCode: "Por favor introduce un código de canje",
    heroRedeemCreditsAdded: "Créditos +",
    heroRedeemFailed: "Código de canje inválido",
    heroRedeemNetworkError: "Error de red. Verifica la conexión al servidor",

    // HowItWorks
    howTag: "CÓMO FUNCIONA",
    howTitle: "Cuatro pasos, de la imaginación a la realidad",
    step1Title: "Sube tu foto",
    step1Desc:
      "Medio cuerpo o cuerpo completo — la IA extrae tus características con precisión.",
    step2Title: "Pega el enlace del producto",
    step2Desc:
      "Compatible con Taobao, JD, Tmall, Xiaohongshu, Amazon, eBay, Shopee y más.",
    step3Title: "Describe la escena",
    step3Desc:
      "\"Caminando por las calles de París\" \"Acampando en la cima\" \"Reunión en la oficina\" — tú describes, la IA crea.",
    step4Title: "Genera la escena",
    step4Desc:
      "Obtén imágenes compuestas de alta calidad en minutos para decisiones de compra y redes sociales.",

    // Showcase
    showTag: "GALERÍA",
    showTitle: "Escenas ilimitadas, inspiración infinita",
    showSubtitle:
      "De las calles de la ciudad a las cumbres nevadas — cada escena se convierte en tu probador",
    show1Title: "Estilo urbano",
    show1Scene: "\"Usando esta gabardina en las calles de Shibuya, Tokio\"",
    show2Title: "Hogar",
    show2Scene: "\"¿Cómo se vería este sofá en mi sala de estar?\"",
    show3Title: "Aventura al aire libre",
    show3Scene: "\"De pie en la cima nevada con esta mochila\"",
    show4Title: "Vacaciones en la playa",
    show4Scene: "\"Paseando por la playa de Maldivas con este vestido\"",

    // Features
    featTag: "CARACTERÍSTICAS",
    featTitle: "¿Por qué elegir Scenew?",
    feat1Title: "Generación en minutos",
    feat1Desc:
      "Impulsado por modelos avanzados de IA, la síntesis se completa en minutos.",
    feat2Title: "Privacidad primero",
    feat2Desc:
      "Las fotos solo se usan para la generación actual, se eliminan automáticamente después del procesamiento.",
    feat3Title: "Comercio global",
    feat3Desc:
      "Compatible con enlaces de Taobao, JD, Amazon, Shopee y todas las plataformas principales.",
    feat4Title: "Calidad realista",
    feat4Desc:
      "Mezcla natural de iluminación, perspectiva y materiales — resultados casi fotorrealistas.",
    feat5Title: "Compartir en redes",
    feat5Desc:
      "Generación de imágenes listas para compartir en WeChat, Xiaohongshu e Instagram.",
    feat6Title: "Multi-escena",
    feat6Desc:
      "Mismo producto, múltiples escenas con un clic — urbano, hogar, vacaciones, profesional.",

    // TryIt
    tryTag: "PRUÉBALO AHORA",
    tryTitle: "Comienza tu primera síntesis de escena",
    tryTabCopy: "Copiar",
    tryTabInspire: "Inspirar",
    trySloganCopy: "Los clásicos son clásicos porque son imitados",
    trySloganInspire: "Crea tu propio estilo radiante",
    trySceneImageLabel: "Imagen de referencia",
    trySceneImageOptional: "(Opcional)",
    trySceneImageUpload: "Sube una foto de escena, la IA la usará como referencia",
    trySceneImageFormat: "Admite JPG / PNG, máx. 10MB",
    trySceneImageUploaded: "Subida",
    trySceneImageChange: "Cambiar imagen",
    tryPhotoLabel: "Tu foto",
    tryPhotoUpload: "Haz clic para subir foto de medio cuerpo o cuerpo completo",
    tryPhotoFormat: "Admite JPG / PNG, máx. 10MB",
    tryPhotoUploaded: "Subida",
    tryPhotoChange: "Cambiar foto",
    tryLinkLabel: "Info del producto",
    tryLinkPlaceholder: "Pega el enlace y haz clic en 'Añadir' para parsear automáticamente",
    trySceneLabel: "Descripción de la escena",
    trySceneOptional: "(Opcional)",
    tryScenePlaceholder:
      "Describe la escena deseada, ej. \"Paseando por el Sena en París en una tarde de otoño\"",
    trySceneSuggestTitle: "Prueba estas escenas ✨",
    trySceneSuggest1: "Caminando por las calles de París, luz otoñal",
    trySceneSuggest2: "Leyendo un libro en una cafetería acogedora",
    trySceneSuggest3: "Paseando por una avenida del parque",
    trySceneSuggest4: "Trabajando con confianza en una oficina moderna",
    trySceneSuggest5: "Fotografiando el atardecer en la playa",
    trySceneSuggest6: "Relajándose en la sala de estar",
    tryGenerate: "Generar escena",
    tryGenerating: "La IA está componiendo la escena...",
    tryPreview: "Vista previa",
    tryPreviewHint: "Sube foto y pega enlace del producto para generar",
    tryPreviewGenerating: "Entrando en tu universo paralelo exclusivo...",
    tryPreviewBackgroundTask: "Tarea en segundo plano iniciada. Puedes actualizar o salir de la página. Revisa resultados en 'Mis generaciones'.",
    tryValidationPhoto: "Por favor sube tu foto primero",
    tryValidationLink: "Por favor pega el enlace del producto",
    tryResultTitle: "Explora otra versión de ti mismo",
    tryResultRegenerate: "Regenerar",
    tryModeSameStyle: "Mismo estilo",
    tryModeNewInspiration: "Nueva inspiración",
    tryModeSeeding: "Modo Seeding",
    tryBackHome: "Volver al inicio",
    tryGenerateFailed: "Demasiadas solicitudes, intenta de nuevo~",
    loginExpired: "Sesión expirada, inicia sesión de nuevo",

    // Footer
    footerSlogan: "Da vida a cada compra",
    footerProduct: "Producto",
    footerPricing: "Precios",
    footerBlog: "Blog",
    footerAbout: "Acerca de",
    footerCopyright:
      "© 2026 Scenew. Todos los derechos reservados. Redefiniendo las compras con IA.",

    // Pricing
    pricingTag: "PRECIOS",
    pricingTitle: "Elige tu plan",
    pricingSubtitle: "Recarga flexible, válida para siempre",
    pricingPlan1Title: "Inicial",
    pricingPlan1Price: "6.49",
    pricingPlan1Points: "200 pts",
    pricingPlan1Desc: "€0.032/pt",
    pricingPlan2Title: "Crecimiento",
    pricingPlan2Price: "16.99",
    pricingPlan2Points: "600 pts",
    pricingPlan2Desc: "€0.028/pt",
    pricingPlan2Discount: "20% DTO",
    pricingPlan3Title: "Pro",
    pricingPlan3Price: "25.99",
    pricingPlan3Points: "1000 pts",
    pricingPlan3Desc: "€0.026/pt",
    pricingPlan3Discount: "30% DTO",
    pricingCurrency: "€",
    pricingBuy: "Recargar",
    pricingFeature1: "Sin marca de agua",
    pricingFeature2: "Válido para siempre",
    pricingFeature3: "Cola prioritaria",
    pricingPopular: "Más popular",

    // Login Modal
    loginTitle: "Bienvenido a Scenew",
    loginSubtitle: "Inicia sesión para comenzar tu experiencia de síntesis de escenas con IA",
    loginGoogle: "Continuar con Google",
    loginTerms: "Al iniciar sesión, aceptas nuestros",
    loginTermsLink: "Términos de servicio",
    loginAnd: "y",
    loginPrivacy: "Política de privacidad",
    loginClose: "Cerrar",

    // Email Login
    loginEmailLabel: "Correo electrónico",
    loginEmailPlaceholder: "Introduce tu correo",
    loginPasswordLabel: "Contraseña",
    loginPasswordPlaceholder: "Introduce tu contraseña",
    loginSubmit: "Iniciar sesión",
    loginNoAccount: "¿No tienes cuenta?",
    loginRegisterLink: "Regístrate",
    loginOr: "o",
    loginEmailError: "Introduce un correo válido",
    loginPasswordError: "Introduce tu contraseña",

    // Register Modal
    registerTitle: "Crea tu cuenta Scenew",
    registerSubtitle: "Regístrate para comenzar tu viaje de síntesis con IA",
    registerUsername: "Nombre de usuario",
    registerUsernamePlaceholder: "Introduce tu nombre de usuario",
    registerEmail: "Correo electrónico",
    registerEmailPlaceholder: "Introduce tu correo",
    registerPassword: "Contraseña",
    registerPasswordPlaceholder: "Mínimo 8 caracteres, letras y números",
    registerConfirmPassword: "Confirmar contraseña",
    registerConfirmPlaceholder: "Vuelve a introducir tu contraseña",
    registerSubmit: "Registrarse",
    registerHaveAccount: "¿Ya tienes cuenta?",
    registerLoginLink: "Iniciar sesión",
    registerSuccess: "¡Registro exitoso! Redirigiendo al inicio de sesión…",
    registerErrUsername: "Introduce un nombre de usuario",
    registerErrEmail: "Introduce un correo válido",
    registerErrPassword: "La contraseña debe tener 8+ caracteres con letras y números",
    registerErrConfirm: "Las contraseñas no coinciden",

    // Product Links (multi)
    tryLinkAdd: "Añadir",
    tryLinkPaste: "Pega enlace del producto y añade",
    tryLinkDetected: "Plataforma detectada",
    tryLinkRemove: "Eliminar",
    tryLinkEmpty: "Aún no hay productos. Pega un enlace para añadir",
    tryLinkFetching: "Obteniendo información del producto…",
    tryLinkFetchError: "Error al obtener, verifica el enlace",
    tryLinkMax: "Máximo 5 enlaces de productos",
    tryLinkAdded: "Añadido",
    tryLinkInfoUnavailable: "Detalles del producto no disponibles",
    tryLinkRetry: "Reintentar",
    tryLinkUnsupported: "Plataforma no compatible aún. Actualmente solo se admiten enlaces de Taobao/Tmall.",
    tryLinkSupportHint: "Actualmente solo se admiten enlaces PC de Taobao/Tmall",

    // Product Input Mode
    tryProductModeLink: "Modo enlace",
    tryProductModeImage: "Modo imagen",
    tryProductImageUpload: "Haz clic para subir imagen del producto",
    tryProductImageFormat: "Admite JPG / PNG, máx. 10MB",
    tryProductImageUploaded: "Subida",
    tryProductImageChange: "Cambiar imagen",
    trySeedModeImageWarning: "El Modo Seeding solo está disponible en Modo enlace, ya que necesita información del producto (precio, tienda, etc.) del enlace para generar la tarjeta de compra.",
    tryValidationProduct: "Sube una imagen del producto o pega un enlace",

    // Browser Login Modal
    browserLoginTitle: "Se requiere inicio de sesión",
    browserLoginDesc: "Este producto requiere inicio de sesión. Completa el inicio de sesión en la ventana de abajo",
    browserLoginLoading: "Iniciando navegador remoto…",
    browserLoginConfirm: "Inicio de sesión completado",
    browserLoginCancel: "Cancelar",
    browserLoginSuccess: "Inicio de sesión exitoso, obteniendo información del producto…",

    // Privacy Policy
    privacyTitle: "Política de privacidad",
    privacyLastUpdated: "Última actualización: 7 de marzo de 2026",
    privacyIntro: "Scenew valora tu privacidad. Esta política explica cómo recopilamos, usamos, almacenamos y protegemos tu información personal.",
    privacySection1: "1. Recopilación de información",
    privacySection1Content: "Recopilamos la información que proporcionas: correo y nombre al registrarte; fotos y enlaces que subes; y datos de uso.",
    privacySection2: "2. Uso y almacenamiento de fotos",
    privacySection2Content: "Las fotos se usan solo para la tarea de generación actual. Se eliminan automáticamente en 24 horas.",
    privacySection3: "3. Seguridad de datos",
    privacySection3Content: "Usamos medidas de seguridad estándar de la industria para proteger tus datos.",
    privacySection4: "4. Servicios de terceros",
    privacySection4Content: "Nuestro servicio puede contener enlaces a sitios de terceros. No somos responsables de sus prácticas de privacidad.",
    privacySection5: "5. Actualizaciones de la política",
    privacySection5Content: "Podemos actualizar esta política periódicamente. Te notificaremos de cambios significativos por correo o aviso en el sitio.",
    privacyContact: "Contáctanos: scenewai@163.com",

    // Terms of Service
    termsTitle: "Términos de servicio",
    termsLastUpdated: "Última actualización: 7 de marzo de 2026",
    termsIntro: "Bienvenido a Scenew. Al usar nuestro servicio, aceptas estos términos.",
    termsSection1: "1. Registro de cuenta",
    termsSection1Content: "Debes registrar una cuenta para usar ciertas funciones. Eres responsable de mantener la confidencialidad de tu cuenta.",
    termsSection2: "2. Servicios",
    termsSection2Content: "Scenew proporciona servicios de síntesis de escenas basados en IA. Nos esforzamos por ofrecer resultados de alta calidad.",
    termsSection3: "3. Conducta del usuario",
    termsSection3Content: "Aceptas no usar el servicio para actividades ilegales o dañinas.",
    termsSection4: "4. Propiedad intelectual",
    termsSection4Content: "Conservamos todos los derechos de propiedad intelectual del servicio. Tú posees el contenido que subes.",
    termsSection5: "5. Descargo de responsabilidad",
    termsSection5Content: "El servicio se proporciona \"tal cual\" sin garantías de ningún tipo.",
    termsContact: "Contacto: scenewai@163.com",

    // Mode Comparison Modal
    modeComparisonTitle: "Modo Seeding vs Modo Estándar",
    modeComparisonDesc: "El Modo Seeding integra automáticamente la información del producto",
    modeStandardTitle: "Modo Estándar (Limpio)",
    modeStandardDesc: "Genera imágenes limpias, enfocándose en la fusión de persona y producto.",
    modeGrassTitle: "Modo Seeding (Tarjeta de compra)",
    modeGrassDesc: "Extrae automáticamente información del producto e integra una elegante Tarjeta de compra en la imagen.",
    modeClose: "Entendido",

    // Contact
    contactLabel: "Contáctanos",
    contactModalTitle: "Contáctanos",
    contactModalDesc: "Puedes contactarnos a través del chat o enviarnos un correo a:",
    contactEmail: "scenewai@163.com",
    contactModalClose: "Entendido",
    contactModalEmailHint: "scenewai@163.com",

    // Feedback
    feedbackLabel: "Comentarios",
    feedbackTitle: "Tu opinión nos importa",
    feedbackDesc: "Ayúdanos a mejorar con tus valiosas sugerencias",
    feedbackContactHint: "Para otras consultas, contacta:",
    feedbackPlaceholder: "Escribe tu comentario aquí...",
    feedbackSubmit: "Enviar comentario",
    feedbackSubmitting: "Enviando...",
    feedbackSuccess: "Comentario enviado con éxito",
    feedbackError: "Error al enviar, intenta de nuevo",
    feedbackNetworkError: "Error de red, verifica la conexión",
    feedbackContentRequired: "Escribe un comentario",
    pricingBetaModalTitle: "Aviso de fase beta",
    pricingBetaModalDesc: "El producto está en fase beta. Contacta scenewai@163.com para un código de invitación.",
    pricingBetaModalClose: "Entendido",
    pricingPaymentSuccess: "¡Pago exitoso! Créditos añadidos",
    pricingPaymentCancelled: "Pago cancelado",
    pricingLoginRequired: "Inicia sesión antes de comprar",
    pricingProcessing: "Redirigiendo al pago…",
    paymentSuccessTitle: "Pago exitoso",
    paymentSuccessDesc: "¡Gracias por tu compra! Los créditos se han añadido al instante.",
    paymentBalanceBefore: "Saldo anterior",
    paymentPointsAdded: "Créditos añadidos",
    paymentBalanceAfter: "Saldo actual",
    paymentSuccessOk: "¡Genial!",
    paymentCancelledTitle: "Pago cancelado",
    paymentCancelledDesc: "Has cancelado este pago. No se realizó ningún cargo.",
    paymentCancelledOk: "Volver",

    // Payment History
    navPaymentHistory: "Historial de pagos",
    paymentHistoryTitle: "Historial de pagos",
    paymentHistoryEmpty: "Sin registros de pago",
    paymentHistoryEmptyDesc: "Tu historial de pagos aparecerá aquí después de tu primera compra",
    paymentHistoryPlan: "Plan",
    paymentHistoryAmount: "Monto",
    paymentHistoryPoints: "Créditos",
    paymentHistoryStatus: "Estado",
    paymentHistoryTime: "Fecha",
    paymentHistoryCompleted: "Completado",
    paymentHistoryPending: "Pendiente",
    paymentHistoryFailed: "Fallido",
    paymentHistoryStarter: "Inicial",
    paymentHistoryGrowth: "Crecimiento",
    paymentHistoryPro: "Pro",

    // Welcome Letter
    welcomeLetterTitle: "Una carta de Scenew",
    welcomeLetterOpen: "Abrir carta",
    welcomeLetterRead: "Leer historia completa",
    welcomeLetterClose: "Cerrar por ahora",
  },
  ar: {
    // Navbar
    navHow: "دليل الاستخدام",
    navShowcase: "المعرض",
    navFeatures: "المميزات",
    navTry: "جرّب الآن",
    navPricing: "الأسعار",
    navBlog: "المدونة",
    navLogin: "تسجيل الدخول",
    navLogout: "تسجيل الخروج",
    navProfile: "الملف الشخصي",
    navGenerations: "إبداعاتي",
    navWardrobe: "خزانتي",
    langLabel: "العربية",

    // Blog
    blogTitle: "المدونة",
    blogSubtitle: "اكتشف أحدث الاتجاهات والإلهام في تركيب المشاهد بالذكاء الاصطناعي",
    blogReadMore: "اقرأ المزيد",
    blogBack: "العودة للمدونة",
    blogPublished: "نُشر في",
    blogShare: "مشاركة",

    // Generations Page
    myGenerationsTitle: "إبداعاتي",
    noGenerationsTitle: "لا توجد إبداعات بعد",
    noGenerationsDesc: "ابدأ بإنشاء أول مشهد لك!",
    noGenerationsHint: "إذا كانت لديك سجلات ولكنها لا تظهر بشكل صحيح، يرجى تسجيل الخروج وإعادة تسجيل الدخول.",
    viewDetails: "عرض التفاصيل",
    generatedScene: "المشهد المُنشأ",
    downloadImage: "تحميل الصورة",

    // Wardrobe Page
    wardrobeTitle: "خزانتي",
    wardrobeSubtitle: "نظّم ملابسك حسب الفئة. انقر لتوسيع أو طي كل قسم.",
    wardrobeCategoryDress: "فساتين",
    wardrobeCategoryTshirt: "تي شيرت",
    wardrobeCategoryJeans: "جينز",
    wardrobeExpand: "توسيع",
    wardrobeCollapse: "طي",
    wardrobeEmpty: "لا توجد قطع بعد. يمكنك قريباً إدارة خزانتك هنا.",
    wardrobeAddButton: "أضف إلى الخزانة",
    wardrobeAddConfirmTitle: "أضف إلى الخزانة",
    wardrobeAddConfirmDesc: "هل تريد إضافة هذا المنتج إلى خزانتك؟",
    wardrobeSelectCategory: "اختر الفئة",
    wardrobeConfirm: "تأكيد",
    wardrobeCancel: "إلغاء",
    wardrobeAddSuccess: "تمت الإضافة إلى الخزانة",
    wardrobeAddFailed: "فشلت الإضافة، حاول مرة أخرى",
    wardrobeAddCategory: "إضافة فئة",
    wardrobeDeleteCategory: "حذف الفئة",
    wardrobeDeleteItem: "حذف القطعة",

    // Profile Modal
    profileTitle: "الملف الشخصي",
    profileUsername: "اسم المستخدم",
    profileEmail: "البريد الإلكتروني",
    profilePassword: "كلمة المرور",
    profileRegisterDate: "تاريخ الانضمام",
    profilePoints: "الرصيد",
    profileEdit: "تعديل",
    profileSave: "حفظ",
    profileCancel: "إلغاء",
    profileChangePassword: "تغيير كلمة المرور",
    profilePointsUnit: "نقطة",
    profileLogout: "تسجيل الخروج",

    // Hero
    heroTag: "SCENEW — تركيب المشاهد بالذكاء الاصطناعي",
    heroTitle: "شاهد حياتك من جديد",
    heroSubtitle:
      "ارفع صورتك، الصق رابط المنتج، صف المشهد المطلوب — الذكاء الاصطناعي يُنشئ صورة مركّبة لك مع المنتج في السياق.",
    heroStart: "ابدأ الآن",
    heroLearn: "اعرف المزيد",
    heroRedeem: "استبدال الرمز",
    heroRedeemSuccess: "تم الاستبدال بنجاح! ابدأ رحلتك.",
    heroRedeemCodeLabel: "رمز الاستبدال",
    heroRedeemCodePlaceholder: "أدخل الرمز",
    heroRedeemSubmit: "استبدال",
    heroRedeemCancel: "إلغاء",
    heroRedeemLoginFirst: "يرجى تسجيل الدخول للاستبدال",
    heroRedeemEnterCode: "يرجى إدخال رمز الاستبدال",
    heroRedeemCreditsAdded: "رصيد +",
    heroRedeemFailed: "رمز استبدال غير صالح",
    heroRedeemNetworkError: "خطأ في الشبكة. يرجى التحقق من الاتصال",

    // HowItWorks
    howTag: "كيف يعمل",
    howTitle: "أربع خطوات، من الخيال إلى الواقع",
    step1Title: "ارفع صورتك",
    step1Desc:
      "نصف الجسم أو كامل الجسم — الذكاء الاصطناعي يستخرج ملامحك بدقة.",
    step2Title: "الصق رابط المنتج",
    step2Desc:
      "يدعم Taobao و JD و Tmall و Xiaohongshu و Amazon و eBay و Shopee والمزيد.",
    step3Title: "صف المشهد",
    step3Desc:
      "\"المشي في شوارع باريس\" \"التخييم على قمة جبل\" \"اجتماع في المكتب\" — أنت تصف، الذكاء الاصطناعي يُبدع.",
    step4Title: "أنشئ المشهد",
    step4Desc:
      "احصل على صور مركّبة عالية الجودة في دقائق.",

    // Showcase
    showTag: "المعرض",
    showTitle: "مشاهد لا حدود لها، إلهام لا ينتهي",
    showSubtitle:
      "من شوارع المدينة إلى قمم الجبال — كل مشهد يصبح غرفة قياس خاصة بك",
    show1Title: "أسلوب حضري",
    show1Scene: "\"أرتدي هذا المعطف في شوارع شيبويا، طوكيو\"",
    show2Title: "الحياة المنزلية",
    show2Scene: "\"كيف سيبدو هذا الأريكة في غرفة معيشتي\"",
    show3Title: "مغامرة في الهواء الطلق",
    show3Scene: "\"أقف على قمة ثلجية مع حقيبة الظهر هذه\"",
    show4Title: "عطلة شاطئية",
    show4Scene: "\"أتمشى على شاطئ المالديف بهذا الفستان\"",

    // Features
    featTag: "المميزات",
    featTitle: "لماذا تختار Scenew",
    feat1Title: "إنشاء في دقائق",
    feat1Desc:
      "مدعوم بنماذج ذكاء اصطناعي متقدمة، يكتمل تركيب المشهد في دقائق.",
    feat2Title: "الخصوصية أولاً",
    feat2Desc:
      "الصور تُستخدم فقط للإنشاء الحالي، وتُحذف تلقائياً بعد المعالجة.",
    feat3Title: "تجارة عالمية",
    feat3Desc:
      "يدعم روابط المنتجات من Taobao و JD و Amazon و Shopee وجميع المنصات الرئيسية.",
    feat4Title: "جودة واقعية",
    feat4Desc:
      "مزج طبيعي للإضاءة والمنظور والمواد — نتائج شبه واقعية.",
    feat5Title: "مشاركة اجتماعية",
    feat5Desc:
      "إنشاء صور جاهزة للمشاركة على WeChat و Xiaohongshu و Instagram بنقرة واحدة.",
    feat6Title: "مشاهد متعددة",
    feat6Desc:
      "نفس المنتج، مشاهد متعددة بنقرة واحدة — شارع، منزل، إجازة، عمل.",

    // TryIt
    tryTag: "جرّب الآن",
    tryTitle: "ابدأ أول تركيب مشهد لك",
    tryTabCopy: "نسخ",
    tryTabInspire: "إلهام",
    trySloganCopy: "الكلاسيكيات كلاسيكيات لأنها تُقلَّد",
    trySloganInspire: "اصنع أسلوبك المتألق الخاص",
    trySceneImageLabel: "صورة مرجعية للمشهد",
    trySceneImageOptional: "(اختياري)",
    trySceneImageUpload: "ارفع صورة مشهد، سيستخدمها الذكاء الاصطناعي كمرجع",
    trySceneImageFormat: "يدعم JPG / PNG، الحد الأقصى 10MB",
    trySceneImageUploaded: "تم الرفع",
    trySceneImageChange: "تغيير الصورة",
    tryPhotoLabel: "صورتك",
    tryPhotoUpload: "انقر لرفع صورة نصف أو كامل الجسم",
    tryPhotoFormat: "يدعم JPG / PNG، الحد الأقصى 10MB",
    tryPhotoUploaded: "تم الرفع",
    tryPhotoChange: "تغيير الصورة",
    tryLinkLabel: "معلومات المنتج",
    tryLinkPlaceholder: "الصق الرابط وانقر 'إضافة' للتحليل التلقائي",
    trySceneLabel: "وصف المشهد",
    trySceneOptional: "(اختياري)",
    tryScenePlaceholder:
      "صف المشهد المطلوب، مثل \"التمشي على ضفة نهر السين في باريس في فترة بعد الظهر الخريفية\"",
    trySceneSuggestTitle: "جرّب هذه المشاهد ✨",
    trySceneSuggest1: "المشي في شوارع باريس، ضوء الشمس الخريفي",
    trySceneSuggest2: "قراءة كتاب في مقهى مريح",
    trySceneSuggest3: "التمشي في ممر الحديقة",
    trySceneSuggest4: "العمل بثقة في مكتب حديث",
    trySceneSuggest5: "التصوير عند غروب الشمس على الشاطئ",
    trySceneSuggest6: "الاسترخاء في غرفة المعيشة",
    tryGenerate: "أنشئ المشهد",
    tryGenerating: "الذكاء الاصطناعي يُركّب المشهد...",
    tryPreview: "معاينة المشهد",
    tryPreviewHint: "ارفع صورة والصق رابط المنتج للإنشاء",
    tryPreviewGenerating: "جاري الدخول إلى عالمك الموازي الحصري...",
    tryPreviewBackgroundTask: "بدأت المهمة في الخلفية. يمكنك تحديث الصفحة أو مغادرتها. تحقق من النتائج في 'إبداعاتي'.",
    tryValidationPhoto: "يرجى رفع صورتك أولاً",
    tryValidationLink: "يرجى لصق رابط المنتج",
    tryResultTitle: "اكتشف نسخة أخرى من نفسك",
    tryResultRegenerate: "إعادة الإنشاء",
    tryModeSameStyle: "نفس الأسلوب",
    tryModeNewInspiration: "إلهام جديد",
    tryModeSeeding: "وضع البذر",
    tryBackHome: "العودة للرئيسية",
    tryGenerateFailed: "الخدمة مشغولة حالياً، يرجى المحاولة مرة أخرى~",
    loginExpired: "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى",

    // Footer
    footerSlogan: "أحيِ كل عملية شراء",
    footerProduct: "المنتج",
    footerPricing: "الأسعار",
    footerBlog: "المدونة",
    footerAbout: "حول",
    footerCopyright:
      "© 2026 Scenew. جميع الحقوق محفوظة. إعادة تعريف التسوق بالذكاء الاصطناعي.",

    // Pricing
    pricingTag: "الأسعار",
    pricingTitle: "اختر خطتك",
    pricingSubtitle: "شحن مرن، صالح للأبد",
    pricingPlan1Title: "الأساسية",
    pricingPlan1Price: "25.9",
    pricingPlan1Points: "200 نقطة",
    pricingPlan1Desc: "0.13 د.إ/نقطة",
    pricingPlan2Title: "النمو",
    pricingPlan2Price: "65.9",
    pricingPlan2Points: "600 نقطة",
    pricingPlan2Desc: "0.11 د.إ/نقطة",
    pricingPlan2Discount: "خصم 15%",
    pricingPlan3Title: "الاحترافية",
    pricingPlan3Price: "99.9",
    pricingPlan3Points: "1000 نقطة",
    pricingPlan3Desc: "0.10 د.إ/نقطة",
    pricingPlan3Discount: "خصم 23%",
    pricingCurrency: "د.إ",
    pricingBuy: "اشحن الآن",
    pricingFeature1: "بدون علامة مائية",
    pricingFeature2: "صالح للأبد",
    pricingFeature3: "أولوية في الطابور",
    pricingPopular: "الأكثر شعبية",

    // Login Modal
    loginTitle: "مرحباً بك في Scenew",
    loginSubtitle: "سجّل الدخول لبدء تجربة تركيب المشاهد بالذكاء الاصطناعي",
    loginGoogle: "المتابعة مع Google",
    loginTerms: "بتسجيل الدخول، أنت توافق على",
    loginTermsLink: "شروط الخدمة",
    loginAnd: "و",
    loginPrivacy: "سياسة الخصوصية",
    loginClose: "إغلاق",

    // Email Login
    loginEmailLabel: "البريد الإلكتروني",
    loginEmailPlaceholder: "أدخل بريدك الإلكتروني",
    loginPasswordLabel: "كلمة المرور",
    loginPasswordPlaceholder: "أدخل كلمة المرور",
    loginSubmit: "تسجيل الدخول",
    loginNoAccount: "ليس لديك حساب؟",
    loginRegisterLink: "إنشاء حساب",
    loginOr: "أو",
    loginEmailError: "يرجى إدخال بريد إلكتروني صالح",
    loginPasswordError: "يرجى إدخال كلمة المرور",

    // Register Modal
    registerTitle: "أنشئ حسابك في Scenew",
    registerSubtitle: "سجّل لبدء رحلة تركيب المشاهد بالذكاء الاصطناعي",
    registerUsername: "اسم المستخدم",
    registerUsernamePlaceholder: "أدخل اسم المستخدم",
    registerEmail: "البريد الإلكتروني",
    registerEmailPlaceholder: "أدخل بريدك الإلكتروني",
    registerPassword: "كلمة المرور",
    registerPasswordPlaceholder: "8 أحرف على الأقل، حروف وأرقام",
    registerConfirmPassword: "تأكيد كلمة المرور",
    registerConfirmPlaceholder: "أعد إدخال كلمة المرور",
    registerSubmit: "إنشاء حساب",
    registerHaveAccount: "لديك حساب بالفعل؟",
    registerLoginLink: "تسجيل الدخول",
    registerSuccess: "تم التسجيل بنجاح! جاري إعادة التوجيه لتسجيل الدخول…",
    registerErrUsername: "يرجى إدخال اسم المستخدم",
    registerErrEmail: "يرجى إدخال بريد إلكتروني صالح",
    registerErrPassword: "كلمة المرور 8+ أحرف مع حروف وأرقام",
    registerErrConfirm: "كلمتا المرور غير متطابقتين",

    // Product Links (multi)
    tryLinkAdd: "إضافة",
    tryLinkPaste: "الصق رابط المنتج وأضفه",
    tryLinkDetected: "تم اكتشاف المنصة",
    tryLinkRemove: "إزالة",
    tryLinkEmpty: "لا توجد منتجات بعد. الصق رابطاً لإضافته",
    tryLinkFetching: "جاري جلب معلومات المنتج…",
    tryLinkFetchError: "فشل الجلب، يرجى التحقق من الرابط",
    tryLinkMax: "الحد الأقصى 5 روابط منتجات",
    tryLinkAdded: "تمت الإضافة",
    tryLinkInfoUnavailable: "تفاصيل المنتج غير متوفرة",
    tryLinkRetry: "إعادة المحاولة",
    tryLinkUnsupported: "المنصة غير مدعومة بعد. حالياً يتم دعم روابط Taobao/Tmall فقط.",
    tryLinkSupportHint: "حالياً يدعم فقط روابط Taobao/Tmall لسطح المكتب",

    // Product Input Mode
    tryProductModeLink: "وضع الرابط",
    tryProductModeImage: "وضع الصورة",
    tryProductImageUpload: "انقر لرفع صورة المنتج",
    tryProductImageFormat: "يدعم JPG / PNG، الحد الأقصى 10MB",
    tryProductImageUploaded: "تم الرفع",
    tryProductImageChange: "تغيير الصورة",
    trySeedModeImageWarning: "وضع البذر متاح فقط في وضع الرابط، لأنه يحتاج معلومات المنتج (السعر، اسم المتجر، إلخ) من الرابط لإنشاء بطاقة التسوق.",
    tryValidationProduct: "يرجى رفع صورة المنتج أو لصق رابط المنتج",

    // Browser Login Modal
    browserLoginTitle: "يلزم تسجيل الدخول للمنصة",
    browserLoginDesc: "هذا المنتج يتطلب تسجيل الدخول. أكمل تسجيل الدخول في النافذة أدناه",
    browserLoginLoading: "جاري تشغيل المتصفح عن بُعد…",
    browserLoginConfirm: "اكتمل تسجيل الدخول",
    browserLoginCancel: "إلغاء",
    browserLoginSuccess: "تم تسجيل الدخول بنجاح، جاري إعادة جلب معلومات المنتج…",

    // Privacy Policy
    privacyTitle: "سياسة الخصوصية",
    privacyLastUpdated: "آخر تحديث: 7 مارس 2026",
    privacyIntro: "Scenew تقدّر خصوصيتك. توضح هذه السياسة كيف نجمع ونستخدم ونخزن ونحمي معلوماتك الشخصية.",
    privacySection1: "1. جمع المعلومات",
    privacySection1Content: "نجمع المعلومات التي تقدمها: البريد الإلكتروني واسم المستخدم عند التسجيل؛ الصور والروابط التي ترفعها؛ وبيانات الاستخدام.",
    privacySection2: "2. استخدام وتخزين الصور",
    privacySection2Content: "الصور التي ترفعها تُستخدم فقط لمهمة الإنشاء الحالية. تُحذف الصور الأصلية تلقائياً خلال 24 ساعة.",
    privacySection3: "3. أمن البيانات",
    privacySection3Content: "نستخدم تدابير أمنية معيارية لحماية بياناتك.",
    privacySection4: "4. خدمات الطرف الثالث",
    privacySection4Content: "قد تحتوي خدمتنا على روابط لمواقع طرف ثالث. نحن غير مسؤولين عن ممارسات الخصوصية الخاصة بهم.",
    privacySection5: "5. تحديثات السياسة",
    privacySection5Content: "قد نحدّث هذه السياسة من وقت لآخر. سنُخطرك بالتغييرات الهامة عبر البريد أو إشعار الموقع.",
    privacyContact: "تواصل معنا: scenewai@163.com",

    // Terms of Service
    termsTitle: "شروط الخدمة",
    termsLastUpdated: "آخر تحديث: 7 مارس 2026",
    termsIntro: "مرحباً بك في Scenew. باستخدام خدمتنا، فإنك توافق على هذه الشروط.",
    termsSection1: "1. تسجيل الحساب",
    termsSection1Content: "يجب تسجيل حساب لاستخدام ميزات معينة. أنت مسؤول عن الحفاظ على سرية حسابك.",
    termsSection2: "2. الخدمات",
    termsSection2Content: "Scenew تقدم خدمات تركيب المشاهد المبنية على الذكاء الاصطناعي.",
    termsSection3: "3. سلوك المستخدم",
    termsSection3Content: "توافق على عدم استخدام الخدمة لأي أنشطة غير قانونية أو ضارة.",
    termsSection4: "4. الملكية الفكرية",
    termsSection4Content: "نحتفظ بجميع حقوق الملكية الفكرية المتعلقة بالخدمة. أنت تملك المحتوى الذي ترفعه.",
    termsSection5: "5. إخلاء المسؤولية",
    termsSection5Content: "تُقدّم الخدمة \"كما هي\" بدون أي ضمانات.",
    termsContact: "التواصل: scenewai@163.com",

    // Mode Comparison Modal
    modeComparisonTitle: "وضع البذر مقابل الوضع القياسي",
    modeComparisonDesc: "وضع البذر يدمج معلومات المنتج تلقائياً",
    modeStandardTitle: "الوضع القياسي (نظيف)",
    modeStandardDesc: "ينشئ صور مشاهد نظيفة تركز على مزج الشخص والمنتج.",
    modeGrassTitle: "وضع البذر (بطاقة تسوق)",
    modeGrassDesc: "يستخرج معلومات المنتج تلقائياً ويدمجها كبطاقة تسوق أنيقة في الصورة.",
    modeClose: "فهمت",

    // Contact
    contactLabel: "تواصل معنا",
    contactModalTitle: "تواصل معنا",
    contactModalDesc: "يمكنك التواصل معنا عبر نافذة الدردشة أو البريد الإلكتروني:",
    contactEmail: "scenewai@163.com",
    contactModalClose: "فهمت",
    contactModalEmailHint: "scenewai@163.com",

    // Feedback
    feedbackLabel: "ملاحظات",
    feedbackTitle: "ملاحظاتك تهمنا",
    feedbackDesc: "ساعدنا على التحسن باقتراحاتك القيّمة",
    feedbackContactHint: "لأسئلة أخرى، تواصل:",
    feedbackPlaceholder: "أدخل ملاحظاتك هنا...",
    feedbackSubmit: "إرسال الملاحظات",
    feedbackSubmitting: "جاري الإرسال...",
    feedbackSuccess: "تم إرسال الملاحظات بنجاح",
    feedbackError: "فشل الإرسال، يرجى المحاولة مرة أخرى",
    feedbackNetworkError: "خطأ في الشبكة، تحقق من الاتصال",
    feedbackContentRequired: "يرجى إدخال محتوى الملاحظات",
    pricingBetaModalTitle: "إشعار المرحلة التجريبية",
    pricingBetaModalDesc: "المنتج حالياً في المرحلة التجريبية. تواصل مع scenewai@163.com للحصول على رمز دعوة.",
    pricingBetaModalClose: "فهمت",
    pricingPaymentSuccess: "تم الدفع بنجاح! تمت إضافة الرصيد",
    pricingPaymentCancelled: "تم إلغاء الدفع",
    pricingLoginRequired: "يرجى تسجيل الدخول قبل الشراء",
    pricingProcessing: "جاري إعادة التوجيه للدفع…",
    paymentSuccessTitle: "تم الدفع بنجاح",
    paymentSuccessDesc: "شكراً لشرائك! تمت إضافة الرصيد فوراً.",
    paymentBalanceBefore: "الرصيد قبل",
    paymentPointsAdded: "الرصيد المُضاف",
    paymentBalanceAfter: "الرصيد الحالي",
    paymentSuccessOk: "رائع!",
    paymentCancelledTitle: "تم إلغاء الدفع",
    paymentCancelledDesc: "لقد ألغيت هذا الدفع. لم يتم خصم أي مبلغ.",
    paymentCancelledOk: "العودة",

    // Payment History
    navPaymentHistory: "سجل المدفوعات",
    paymentHistoryTitle: "سجل المدفوعات",
    paymentHistoryEmpty: "لا توجد سجلات دفع",
    paymentHistoryEmptyDesc: "سيظهر سجل مدفوعاتك هنا بعد أول عملية شراء",
    paymentHistoryPlan: "الخطة",
    paymentHistoryAmount: "المبلغ",
    paymentHistoryPoints: "الرصيد",
    paymentHistoryStatus: "الحالة",
    paymentHistoryTime: "التاريخ",
    paymentHistoryCompleted: "مكتمل",
    paymentHistoryPending: "قيد المعالجة",
    paymentHistoryFailed: "فشل",
    paymentHistoryStarter: "الأساسية",
    paymentHistoryGrowth: "النمو",
    paymentHistoryPro: "الاحترافية",

    // Welcome Letter
    welcomeLetterTitle: "رسالة من Scenew",
    welcomeLetterOpen: "افتح الرسالة",
    welcomeLetterRead: "اقرأ القصة كاملة",
    welcomeLetterClose: "أغلق الآن",
  },
  fr: {
    // Navbar
    navHow: "Guide d'utilisation",
    navShowcase: "Vitrine",
    navFeatures: "Fonctionnalités",
    navTry: "Essayer",
    navPricing: "Tarifs",
    navBlog: "Blog",
    navLogin: "Connexion",
    navLogout: "Déconnexion",
    navProfile: "Profil",
    navGenerations: "Mes générations",
    navWardrobe: "Ma Garde-robe",
    langLabel: "Français",

    // Blog
    blogTitle: "Blog",
    blogSubtitle: "Découvrez les dernières tendances et inspirations en synthèse de scènes par IA",
    blogReadMore: "Lire la suite",
    blogBack: "Retour au blog",
    blogPublished: "Publié le",
    blogShare: "Partager",

    // Generations Page
    myGenerationsTitle: "Mes générations",
    noGenerationsTitle: "Aucune génération pour l'instant",
    noGenerationsDesc: "Créez votre première scène !",
    noGenerationsHint: "Si vous avez des enregistrements existants mais qu'ils ne s'affichent pas correctement, veuillez vous déconnecter et vous reconnecter.",
    viewDetails: "Voir les détails",
    generatedScene: "Scène générée",
    downloadImage: "Télécharger l'image",

    // Wardrobe Page
    wardrobeTitle: "Ma Garde-robe",
    wardrobeSubtitle: "Organisez vos tenues par catégorie. Cliquez pour développer ou replier chaque section.",
    wardrobeCategoryDress: "Robes",
    wardrobeCategoryTshirt: "T-shirts",
    wardrobeCategoryJeans: "Jeans",
    wardrobeExpand: "Développer",
    wardrobeCollapse: "Replier",
    wardrobeEmpty: "Aucun article pour le moment. Vous pourrez bientôt gérer votre garde-robe ici.",
    wardrobeAddButton: "Ajouter à la garde-robe",
    wardrobeAddConfirmTitle: "Ajouter à la garde-robe",
    wardrobeAddConfirmDesc: "Ajouter ce produit à votre garde-robe ?",
    wardrobeSelectCategory: "Choisir une catégorie",
    wardrobeConfirm: "Confirmer",
    wardrobeCancel: "Annuler",
    wardrobeAddSuccess: "Ajouté à la garde-robe",
    wardrobeAddFailed: "Echec de l'ajout, reessayez",
    wardrobeAddCategory: "Ajouter une categorie",
    wardrobeDeleteCategory: "Supprimer la categorie",
    wardrobeDeleteItem: "Supprimer l'article",

    // Profile Modal
    profileTitle: "Profil",
    profileUsername: "Nom d'utilisateur",
    profileEmail: "E-mail",
    profilePassword: "Mot de passe",
    profileRegisterDate: "Inscrit le",
    profilePoints: "Crédits",
    profileEdit: "Modifier",
    profileSave: "Enregistrer",
    profileCancel: "Annuler",
    profileChangePassword: "Changer le mot de passe",
    profilePointsUnit: "pts",
    profileLogout: "Déconnexion",

    // Hero
    heroTag: "SCENEW — Synthèse de scènes par IA",
    heroTitle: "Voyez votre vie autrement",
    heroSubtitle:
      "Téléchargez votre photo, collez un lien produit, décrivez la scène souhaitée — l'IA crée un composite de vous avec le produit en contexte.",
    heroStart: "Commencer",
    heroLearn: "En savoir plus",
    heroRedeem: "Utiliser un code",
    heroRedeemSuccess: "Échange réussi ! Commencez votre voyage.",
    heroRedeemCodeLabel: "Code d'échange",
    heroRedeemCodePlaceholder: "Entrez le code",
    heroRedeemSubmit: "Échanger",
    heroRedeemCancel: "Annuler",
    heroRedeemLoginFirst: "Veuillez vous connecter pour échanger",
    heroRedeemEnterCode: "Veuillez entrer un code d'échange",
    heroRedeemCreditsAdded: "Crédits +",
    heroRedeemFailed: "Code d'échange invalide",
    heroRedeemNetworkError: "Erreur réseau. Vérifiez la connexion au serveur",

    // HowItWorks
    howTag: "COMMENT ÇA MARCHE",
    howTitle: "Quatre étapes, de l'imagination à la réalité",
    step1Title: "Téléchargez votre photo",
    step1Desc:
      "Mi-corps ou corps entier — l'IA extrait vos caractéristiques avec précision.",
    step2Title: "Collez le lien du produit",
    step2Desc:
      "Compatible avec Taobao, JD, Tmall, Xiaohongshu, Amazon, eBay, Shopee et plus.",
    step3Title: "Décrivez la scène",
    step3Desc:
      "\"Se promener dans les rues de Paris\" \"Camper au sommet\" \"Réunion au bureau\" — vous décrivez, l'IA crée.",
    step4Title: "Générez la scène",
    step4Desc:
      "Obtenez des images composites de haute qualité en quelques minutes.",

    // Showcase
    showTag: "VITRINE",
    showTitle: "Scènes illimitées, inspiration sans fin",
    showSubtitle:
      "Des rues de la ville aux sommets enneigés — chaque scène devient votre cabine d'essayage",
    show1Title: "Style urbain",
    show1Scene: "\"Porter ce trench dans les rues de Shibuya, Tokyo\"",
    show2Title: "Intérieur",
    show2Scene: "\"À quoi ressemblerait ce canapé dans mon salon ?\"",
    show3Title: "Aventure en plein air",
    show3Scene: "\"Debout au sommet enneigé avec ce sac à dos\"",
    show4Title: "Vacances à la plage",
    show4Scene: "\"Se promener sur la plage des Maldives avec cette robe\"",

    // Features
    featTag: "FONCTIONNALITÉS",
    featTitle: "Pourquoi choisir Scenew",
    feat1Title: "Génération en minutes",
    feat1Desc:
      "Propulsé par des modèles IA avancés, la synthèse se complète en minutes.",
    feat2Title: "Confidentialité d'abord",
    feat2Desc:
      "Les photos ne sont utilisées que pour la génération en cours, supprimées automatiquement après traitement.",
    feat3Title: "Commerce mondial",
    feat3Desc:
      "Compatible avec les liens de Taobao, JD, Amazon, Shopee et toutes les grandes plateformes.",
    feat4Title: "Qualité réaliste",
    feat4Desc:
      "Mélange naturel d'éclairage, de perspective et de matériaux — résultats quasi photoréalistes.",
    feat5Title: "Partage social",
    feat5Desc:
      "Génération en un clic d'images prêtes à partager sur WeChat, Xiaohongshu et Instagram.",
    feat6Title: "Multi-scènes",
    feat6Desc:
      "Même produit, plusieurs scènes en un clic — urbain, maison, vacances, professionnel.",

    // TryIt
    tryTag: "ESSAYEZ MAINTENANT",
    tryTitle: "Commencez votre première synthèse de scène",
    tryTabCopy: "Copier",
    tryTabInspire: "Inspirer",
    trySloganCopy: "Les classiques sont classiques parce qu'ils sont imités",
    trySloganInspire: "Créez votre propre style éclatant",
    trySceneImageLabel: "Image de référence",
    trySceneImageOptional: "(Facultatif)",
    trySceneImageUpload: "Téléchargez une photo de scène, l'IA l'utilisera comme référence",
    trySceneImageFormat: "Formats JPG / PNG, max 10 Mo",
    trySceneImageUploaded: "Téléchargée",
    trySceneImageChange: "Changer l'image",
    tryPhotoLabel: "Votre photo",
    tryPhotoUpload: "Cliquez pour télécharger une photo mi-corps ou corps entier",
    tryPhotoFormat: "Formats JPG / PNG, max 10 Mo",
    tryPhotoUploaded: "Téléchargée",
    tryPhotoChange: "Changer la photo",
    tryLinkLabel: "Info produit",
    tryLinkPlaceholder: "Collez le lien et cliquez 'Ajouter' pour analyser automatiquement",
    trySceneLabel: "Description de la scène",
    trySceneOptional: "(Facultatif)",
    tryScenePlaceholder:
      "Décrivez la scène souhaitée, ex. \"Se promener le long de la Seine à Paris un après-midi d'automne\"",
    trySceneSuggestTitle: "Essayez ces scènes ✨",
    trySceneSuggest1: "Se promener dans les rues de Paris, lumière d'automne",
    trySceneSuggest2: "Lire un livre dans un café cosy",
    trySceneSuggest3: "Flâner dans une allée du parc",
    trySceneSuggest4: "Travailler avec assurance dans un bureau moderne",
    trySceneSuggest5: "Photographier au coucher du soleil sur la plage",
    trySceneSuggest6: "Se détendre dans le salon à la maison",
    tryGenerate: "Générer la scène",
    tryGenerating: "L'IA compose la scène...",
    tryPreview: "Aperçu de la scène",
    tryPreviewHint: "Téléchargez une photo et collez un lien pour générer",
    tryPreviewGenerating: "Entrée dans votre univers parallèle exclusif...",
    tryPreviewBackgroundTask: "Tâche en arrière-plan lancée. Vous pouvez rafraîchir ou quitter la page. Vérifiez les résultats dans 'Mes générations'.",
    tryValidationPhoto: "Veuillez d'abord télécharger votre photo",
    tryValidationLink: "Veuillez coller un lien produit",
    tryResultTitle: "Explorez une autre version de vous-même",
    tryResultRegenerate: "Régénérer",
    tryModeSameStyle: "Même style",
    tryModeNewInspiration: "Nouvelle inspiration",
    tryModeSeeding: "Mode Seeding",
    tryBackHome: "Retour à l'accueil",
    tryGenerateFailed: "Service très sollicité, veuillez réessayer~",
    loginExpired: "Session expirée, veuillez vous reconnecter",

    // Footer
    footerSlogan: "Donnez vie à chaque achat",
    footerProduct: "Produit",
    footerPricing: "Tarifs",
    footerBlog: "Blog",
    footerAbout: "À propos",
    footerCopyright:
      "© 2026 Scenew. Tous droits réservés. Redéfinir le shopping avec l'IA.",

    // Pricing
    pricingTag: "TARIFS",
    pricingTitle: "Choisissez votre forfait",
    pricingSubtitle: "Recharge flexible, valable à vie",
    pricingPlan1Title: "Débutant",
    pricingPlan1Price: "6.49",
    pricingPlan1Points: "200 pts",
    pricingPlan1Desc: "€0.032/pt",
    pricingPlan2Title: "Croissance",
    pricingPlan2Price: "16.99",
    pricingPlan2Points: "600 pts",
    pricingPlan2Desc: "€0.028/pt",
    pricingPlan2Discount: "-20%",
    pricingPlan3Title: "Pro",
    pricingPlan3Price: "25.99",
    pricingPlan3Points: "1000 pts",
    pricingPlan3Desc: "€0.026/pt",
    pricingPlan3Discount: "-30%",
    pricingCurrency: "€",
    pricingBuy: "Recharger",
    pricingFeature1: "Sans filigrane",
    pricingFeature2: "Valable à vie",
    pricingFeature3: "File prioritaire",
    pricingPopular: "Le plus populaire",

    // Login Modal
    loginTitle: "Bienvenue sur Scenew",
    loginSubtitle: "Connectez-vous pour commencer votre expérience de synthèse de scènes par IA",
    loginGoogle: "Continuer avec Google",
    loginTerms: "En vous connectant, vous acceptez nos",
    loginTermsLink: "Conditions d'utilisation",
    loginAnd: "et",
    loginPrivacy: "Politique de confidentialité",
    loginClose: "Fermer",

    // Email Login
    loginEmailLabel: "E-mail",
    loginEmailPlaceholder: "Entrez votre e-mail",
    loginPasswordLabel: "Mot de passe",
    loginPasswordPlaceholder: "Entrez votre mot de passe",
    loginSubmit: "Se connecter",
    loginNoAccount: "Pas encore de compte ?",
    loginRegisterLink: "S'inscrire",
    loginOr: "ou",
    loginEmailError: "Veuillez entrer un e-mail valide",
    loginPasswordError: "Veuillez entrer votre mot de passe",

    // Register Modal
    registerTitle: "Créez votre compte Scenew",
    registerSubtitle: "Inscrivez-vous pour commencer votre voyage de synthèse par IA",
    registerUsername: "Nom d'utilisateur",
    registerUsernamePlaceholder: "Entrez votre nom d'utilisateur",
    registerEmail: "E-mail",
    registerEmailPlaceholder: "Entrez votre e-mail",
    registerPassword: "Mot de passe",
    registerPasswordPlaceholder: "Min. 8 caractères, lettres et chiffres",
    registerConfirmPassword: "Confirmer le mot de passe",
    registerConfirmPlaceholder: "Saisissez à nouveau votre mot de passe",
    registerSubmit: "S'inscrire",
    registerHaveAccount: "Vous avez déjà un compte ?",
    registerLoginLink: "Se connecter",
    registerSuccess: "Inscription réussie ! Redirection vers la connexion…",
    registerErrUsername: "Veuillez entrer un nom d'utilisateur",
    registerErrEmail: "Veuillez entrer un e-mail valide",
    registerErrPassword: "Le mot de passe doit contenir 8+ caractères avec lettres et chiffres",
    registerErrConfirm: "Les mots de passe ne correspondent pas",

    // Product Links (multi)
    tryLinkAdd: "Ajouter",
    tryLinkPaste: "Collez le lien du produit et ajoutez",
    tryLinkDetected: "Plateforme détectée",
    tryLinkRemove: "Supprimer",
    tryLinkEmpty: "Aucun produit. Collez un lien pour ajouter",
    tryLinkFetching: "Récupération des informations produit…",
    tryLinkFetchError: "Échec de récupération, vérifiez le lien",
    tryLinkMax: "Maximum 5 liens produits",
    tryLinkAdded: "Ajouté",
    tryLinkInfoUnavailable: "Détails du produit indisponibles",
    tryLinkRetry: "Réessayer",
    tryLinkUnsupported: "Plateforme non prise en charge. Actuellement, seuls les liens Taobao/Tmall sont acceptés.",
    tryLinkSupportHint: "Actuellement seuls les liens PC Taobao/Tmall sont pris en charge",

    // Product Input Mode
    tryProductModeLink: "Mode lien",
    tryProductModeImage: "Mode image",
    tryProductImageUpload: "Cliquez pour télécharger l'image du produit",
    tryProductImageFormat: "Formats JPG / PNG, max 10 Mo",
    tryProductImageUploaded: "Téléchargée",
    tryProductImageChange: "Changer l'image",
    trySeedModeImageWarning: "Le Mode Seeding n'est disponible qu'en Mode lien, car il nécessite les informations produit (prix, nom du magasin, etc.) du lien pour générer la carte d'achat.",
    tryValidationProduct: "Veuillez télécharger une image du produit ou coller un lien",

    // Browser Login Modal
    browserLoginTitle: "Connexion à la plateforme requise",
    browserLoginDesc: "Ce produit nécessite une connexion. Veuillez vous connecter dans la fenêtre ci-dessous",
    browserLoginLoading: "Lancement du navigateur distant…",
    browserLoginConfirm: "Connexion terminée",
    browserLoginCancel: "Annuler",
    browserLoginSuccess: "Connexion réussie, récupération des informations produit…",

    // Privacy Policy
    privacyTitle: "Politique de confidentialité",
    privacyLastUpdated: "Dernière mise à jour : 7 mars 2026",
    privacyIntro: "Scenew accorde de l'importance à votre vie privée. Cette politique explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles.",
    privacySection1: "1. Collecte d'informations",
    privacySection1Content: "Nous collectons les informations que vous fournissez : e-mail et nom lors de l'inscription ; photos et liens que vous téléchargez ; et données d'utilisation.",
    privacySection2: "2. Utilisation et stockage des photos",
    privacySection2Content: "Les photos sont utilisées uniquement pour la tâche de génération en cours. Elles sont automatiquement supprimées dans les 24 heures.",
    privacySection3: "3. Sécurité des données",
    privacySection3Content: "Nous utilisons des mesures de sécurité standard de l'industrie pour protéger vos données.",
    privacySection4: "4. Services tiers",
    privacySection4Content: "Notre service peut contenir des liens vers des sites tiers. Nous ne sommes pas responsables de leurs pratiques de confidentialité.",
    privacySection5: "5. Mises à jour de la politique",
    privacySection5Content: "Nous pouvons mettre à jour cette politique périodiquement. Nous vous informerons des changements importants par e-mail ou avis sur le site.",
    privacyContact: "Contactez-nous : scenewai@163.com",

    // Terms of Service
    termsTitle: "Conditions d'utilisation",
    termsLastUpdated: "Dernière mise à jour : 7 mars 2026",
    termsIntro: "Bienvenue sur Scenew. En utilisant notre service, vous acceptez ces conditions.",
    termsSection1: "1. Inscription au compte",
    termsSection1Content: "Vous devez créer un compte pour utiliser certaines fonctionnalités. Vous êtes responsable de la confidentialité de votre compte.",
    termsSection2: "2. Services",
    termsSection2Content: "Scenew fournit des services de synthèse de scènes basés sur l'IA. Nous nous efforçons de fournir des résultats de haute qualité.",
    termsSection3: "3. Conduite de l'utilisateur",
    termsSection3Content: "Vous acceptez de ne pas utiliser le service pour des activités illégales ou nuisibles.",
    termsSection4: "4. Propriété intellectuelle",
    termsSection4Content: "Nous conservons tous les droits de propriété intellectuelle liés au service. Vous êtes propriétaire du contenu que vous téléchargez.",
    termsSection5: "5. Clause de non-responsabilité",
    termsSection5Content: "Le service est fourni \"tel quel\" sans aucune garantie.",
    termsContact: "Contact : scenewai@163.com",

    // Mode Comparison Modal
    modeComparisonTitle: "Mode Seeding vs Mode Standard",
    modeComparisonDesc: "Le Mode Seeding intègre automatiquement les informations produit",
    modeStandardTitle: "Mode Standard (Épuré)",
    modeStandardDesc: "Génère des images de synthèse épurées, se concentrant sur la fusion personne-produit.",
    modeGrassTitle: "Mode Seeding (Carte Shopping)",
    modeGrassDesc: "Extrait automatiquement les informations produit et les intègre sous forme d'une élégante Carte Shopping dans l'image.",
    modeClose: "Compris",

    // Contact
    contactLabel: "Nous contacter",
    contactModalTitle: "Nous contacter",
    contactModalDesc: "Vous pouvez nous contacter via le chat ou par e-mail :",
    contactEmail: "scenewai@163.com",
    contactModalClose: "Compris",
    contactModalEmailHint: "scenewai@163.com",

    // Feedback
    feedbackLabel: "Commentaires",
    feedbackTitle: "Vos commentaires comptent",
    feedbackDesc: "Aidez-nous à nous améliorer avec vos précieuses suggestions",
    feedbackContactHint: "Pour d'autres questions, contactez :",
    feedbackPlaceholder: "Entrez vos commentaires ici...",
    feedbackSubmit: "Envoyer",
    feedbackSubmitting: "Envoi en cours...",
    feedbackSuccess: "Commentaire envoyé avec succès",
    feedbackError: "Échec de l'envoi, veuillez réessayer",
    feedbackNetworkError: "Erreur réseau, vérifiez la connexion",
    feedbackContentRequired: "Veuillez entrer un commentaire",
    pricingBetaModalTitle: "Phase bêta",
    pricingBetaModalDesc: "Le produit est en phase bêta. Contactez scenewai@163.com pour un code d'invitation.",
    pricingBetaModalClose: "Compris",
    pricingPaymentSuccess: "Paiement réussi ! Crédits ajoutés",
    pricingPaymentCancelled: "Paiement annulé",
    pricingLoginRequired: "Veuillez vous connecter avant d'acheter",
    pricingProcessing: "Redirection vers le paiement…",
    paymentSuccessTitle: "Paiement réussi",
    paymentSuccessDesc: "Merci pour votre achat ! Les crédits ont été ajoutés instantanément.",
    paymentBalanceBefore: "Solde avant",
    paymentPointsAdded: "Crédits ajoutés",
    paymentBalanceAfter: "Solde actuel",
    paymentSuccessOk: "Super !",
    paymentCancelledTitle: "Paiement annulé",
    paymentCancelledDesc: "Vous avez annulé ce paiement. Aucun frais n'a été appliqué.",
    paymentCancelledOk: "Retour",

    // Payment History
    navPaymentHistory: "Historique des paiements",
    paymentHistoryTitle: "Historique des paiements",
    paymentHistoryEmpty: "Aucun enregistrement de paiement",
    paymentHistoryEmptyDesc: "Votre historique de paiements apparaîtra ici après votre premier achat",
    paymentHistoryPlan: "Forfait",
    paymentHistoryAmount: "Montant",
    paymentHistoryPoints: "Crédits",
    paymentHistoryStatus: "Statut",
    paymentHistoryTime: "Date",
    paymentHistoryCompleted: "Terminé",
    paymentHistoryPending: "En attente",
    paymentHistoryFailed: "Échoué",
    paymentHistoryStarter: "Débutant",
    paymentHistoryGrowth: "Croissance",
    paymentHistoryPro: "Pro",

    // Welcome Letter
    welcomeLetterTitle: "Une lettre de Scenew",
    welcomeLetterOpen: "Ouvrir la lettre",
    welcomeLetterRead: "Lire l'histoire complète",
    welcomeLetterClose: "Fermer pour l'instant",
  },
  ja: {
    // Navbar
    navHow: "使い方ガイド",
    navShowcase: "ショーケース",
    navFeatures: "機能",
    navTry: "試してみる",
    navPricing: "料金",
    navBlog: "ブログ",
    navLogin: "ログイン",
    navLogout: "ログアウト",
    navProfile: "プロフィール",
    navGenerations: "マイ生成",
    navWardrobe: "マイクローゼット",
    langLabel: "日本語",

    // Blog
    blogTitle: "ブログ",
    blogSubtitle: "AIシーン合成の最新トレンドとインスピレーションを探る",
    blogReadMore: "続きを読む",
    blogBack: "ブログに戻る",
    blogPublished: "公開日",
    blogShare: "シェア",

    // Generations Page
    myGenerationsTitle: "マイ生成",
    noGenerationsTitle: "まだ生成がありません",
    noGenerationsDesc: "最初のシーンを作成しましょう！",
    noGenerationsHint: "既存の生成記録があるのに正しく表示されない場合は、ログアウトして再ログインしてください。",
    viewDetails: "詳細を見る",
    generatedScene: "生成されたシーン",
    downloadImage: "画像をダウンロード",

    // Wardrobe Page
    wardrobeTitle: "マイクローゼット",
    wardrobeSubtitle: "カテゴリ別にコーデを整理できます。クリックで各セクションを開閉できます。",
    wardrobeCategoryDress: "ワンピース",
    wardrobeCategoryTshirt: "Tシャツ",
    wardrobeCategoryJeans: "ジーンズ",
    wardrobeExpand: "展開",
    wardrobeCollapse: "折りたたむ",
    wardrobeEmpty: "まだアイテムがありません。今後ここでクローゼットを管理できます。",
    wardrobeAddButton: "クローゼットに追加",
    wardrobeAddConfirmTitle: "クローゼットに追加",
    wardrobeAddConfirmDesc: "この商品をクローゼットに追加しますか？",
    wardrobeSelectCategory: "カテゴリを選択",
    wardrobeConfirm: "追加する",
    wardrobeCancel: "キャンセル",
    wardrobeAddSuccess: "クローゼットに追加しました",
    wardrobeAddFailed: "追加に失敗しました。もう一度お試しください",
    wardrobeAddCategory: "カテゴリ追加",
    wardrobeDeleteCategory: "カテゴリ削除",
    wardrobeDeleteItem: "アイテム削除",

    // Profile Modal
    profileTitle: "プロフィール",
    profileUsername: "ユーザー名",
    profileEmail: "メールアドレス",
    profilePassword: "パスワード",
    profileRegisterDate: "登録日",
    profilePoints: "クレジット",
    profileEdit: "編集",
    profileSave: "保存",
    profileCancel: "キャンセル",
    profileChangePassword: "パスワード変更",
    profilePointsUnit: "pt",
    profileLogout: "ログアウト",

    // Hero
    heroTag: "SCENEW — AIシーン合成",
    heroTitle: "あなたの生活を、新しく見る",
    heroSubtitle:
      "写真をアップロードし、商品リンクを貼り付け、希望のシーンを説明 — AIがあなたと商品をシーンに合成したコンポジットを作成します。",
    heroStart: "始める",
    heroLearn: "詳しく見る",
    heroRedeem: "コードを引き換え",
    heroRedeemSuccess: "引き換え成功！旅を始めましょう。",
    heroRedeemCodeLabel: "引き換えコード",
    heroRedeemCodePlaceholder: "コードを入力",
    heroRedeemSubmit: "引き換え",
    heroRedeemCancel: "キャンセル",
    heroRedeemLoginFirst: "引き換えにはログインが必要です",
    heroRedeemEnterCode: "引き換えコードを入力してください",
    heroRedeemCreditsAdded: "クレジット +",
    heroRedeemFailed: "無効な引き換えコード",
    heroRedeemNetworkError: "ネットワークエラー。サーバー接続を確認してください",

    // HowItWorks
    howTag: "使い方",
    howTitle: "4ステップで想像から現実へ",
    step1Title: "写真をアップロード",
    step1Desc:
      "上半身または全身 — AIがあなたの特徴を正確に抽出し、本物のテクスチャを保持します。",
    step2Title: "商品リンクを貼り付け",
    step2Desc:
      "Taobao、JD、Tmall、Xiaohongshu、Amazon、eBay、Shopeeなどに対応。",
    step3Title: "シーンを説明",
    step3Desc:
      "「パリの街を歩く」「山頂でキャンプ」「オフィスで会議」— あなたが説明し、AIが作ります。",
    step4Title: "シーンを生成",
    step4Desc:
      "数分で高品質な合成画像を取得。ショッピングの判断やSNSシェアに。",

    // Showcase
    showTag: "ショーケース",
    showTitle: "無限のシーン、尽きないインスピレーション",
    showSubtitle:
      "都市の街角から雪山の頂上まで — すべてのシーンがあなたの試着室に",
    show1Title: "アーバンスタイル",
    show1Scene: "「東京・渋谷の街でこのトレンチコートを着て」",
    show2Title: "ホームリビング",
    show2Scene: "「このソファを自分のリビングに置いたらどうなるか」",
    show3Title: "アウトドアアドベンチャー",
    show3Scene: "「このバックパックを背負って雪山の頂上に立つ」",
    show4Title: "ビーチバケーション",
    show4Scene: "「このドレスでモルディブのビーチを散歩」",

    // Features
    featTag: "機能",
    featTitle: "Scenewを選ぶ理由",
    feat1Title: "数分で生成",
    feat1Desc:
      "先進的なAIモデルにより、シーン合成は数分で完了します。",
    feat2Title: "プライバシー優先",
    feat2Desc:
      "写真は現在の生成にのみ使用され、処理後自動削除されます。トレーニングには使用しません。",
    feat3Title: "グローバルコマース",
    feat3Desc:
      "Taobao、JD、Amazon、Shopeeなど、主要なECプラットフォームの商品リンクに対応。",
    feat4Title: "リアルな品質",
    feat4Desc:
      "照明、パース、素材の自然なブレンド — 写真に近いリアルな結果。",
    feat5Title: "SNSシェア",
    feat5Desc:
      "WeChat、Xiaohongshu、Instagramに対応したシェア画像をワンクリックで生成。",
    feat6Title: "マルチシーン",
    feat6Desc:
      "同じ商品、ワンクリックで複数シーン — ストリート、ホーム、バケーション、ビジネス。",

    // TryIt
    tryTag: "今すぐ試す",
    tryTitle: "最初のシーン合成を始めましょう",
    tryTabCopy: "コピー",
    tryTabInspire: "インスパイア",
    trySloganCopy: "クラシックがクラシックなのは真似されるから",
    trySloganInspire: "あなただけの輝くスタイルを作る",
    trySceneImageLabel: "シーン参考画像",
    trySceneImageOptional: "（任意）",
    trySceneImageUpload: "シーン写真をアップロード。AIが合成の参考にします",
    trySceneImageFormat: "JPG / PNG対応、最大10MB",
    trySceneImageUploaded: "アップロード済み",
    trySceneImageChange: "画像を変更",
    tryPhotoLabel: "あなたの写真",
    tryPhotoUpload: "クリックして上半身または全身写真をアップロード",
    tryPhotoFormat: "JPG / PNG対応、最大10MB",
    tryPhotoUploaded: "アップロード済み",
    tryPhotoChange: "写真を変更",
    tryLinkLabel: "商品情報",
    tryLinkPlaceholder: "リンクを貼って「追加」をクリックすると自動解析します",
    trySceneLabel: "シーン説明",
    trySceneOptional: "（任意）",
    tryScenePlaceholder:
      "希望のシーンを説明してください。例：「秋の午後、パリのセーヌ川沿いを散歩」",
    trySceneSuggestTitle: "おすすめシーン ✨",
    trySceneSuggest1: "パリの街を散歩、秋の日差し",
    trySceneSuggest2: "居心地の良いカフェで読書",
    trySceneSuggest3: "公園の並木道を散策",
    trySceneSuggest4: "モダンなオフィスで自信を持って仕事",
    trySceneSuggest5: "ビーチでサンセットを撮影",
    trySceneSuggest6: "自宅のリビングでくつろぐ",
    tryGenerate: "シーンを生成",
    tryGenerating: "AIがシーンを合成中...",
    tryPreview: "シーンプレビュー",
    tryPreviewHint: "写真をアップロードし商品リンクを貼って生成してください",
    tryPreviewGenerating: "あなた専用のパラレルワールドへ...",
    tryPreviewBackgroundTask: "バックグラウンドタスクが開始されました。ページの更新や移動が可能です。「マイ生成」で結果をご確認ください。",
    tryValidationPhoto: "まず写真をアップロードしてください",
    tryValidationLink: "商品リンクを貼り付けてください",
    tryResultTitle: "もう一人の自分を探る",
    tryResultRegenerate: "再生成",
    tryModeSameStyle: "同じスタイル",
    tryModeNewInspiration: "新しいインスピレーション",
    tryModeSeeding: "シーディングモード",
    tryBackHome: "ホームに戻る",
    tryGenerateFailed: "ただいま混雑中です。もう一度お試しください〜",
    loginExpired: "セッションが切れました。再ログインしてください",

    // Footer
    footerSlogan: "すべての買い物に臨場感を",
    footerProduct: "プロダクト",
    footerPricing: "料金",
    footerBlog: "ブログ",
    footerAbout: "について",
    footerCopyright:
      "© 2026 Scenew. All rights reserved. AIでショッピングを再定義。",

    // Pricing
    pricingTag: "料金",
    pricingTitle: "プランを選ぶ",
    pricingSubtitle: "柔軟なチャージ、永久有効",
    pricingPlan1Title: "スターター",
    pricingPlan1Price: "1,080",
    pricingPlan1Points: "200 ポイント",
    pricingPlan1Desc: "¥5.4/pt",
    pricingPlan2Title: "グロース",
    pricingPlan2Price: "2,780",
    pricingPlan2Points: "600 ポイント",
    pricingPlan2Desc: "¥4.6/pt",
    pricingPlan2Discount: "20%OFF",
    pricingPlan3Title: "プロ",
    pricingPlan3Price: "4,280",
    pricingPlan3Points: "1000 ポイント",
    pricingPlan3Desc: "¥4.3/pt",
    pricingPlan3Discount: "30%OFF",
    pricingCurrency: "¥",
    pricingBuy: "チャージする",
    pricingFeature1: "ウォーターマークなし",
    pricingFeature2: "永久有効",
    pricingFeature3: "優先キュー",
    pricingPopular: "一番人気",

    // Login Modal
    loginTitle: "Scenewへようこそ",
    loginSubtitle: "サインインしてAIシーン合成体験を始めましょう",
    loginGoogle: "Googleで続ける",
    loginTerms: "サインインすることで、",
    loginTermsLink: "利用規約",
    loginAnd: "および",
    loginPrivacy: "プライバシーポリシー",
    loginClose: "閉じる",

    // Email Login
    loginEmailLabel: "メールアドレス",
    loginEmailPlaceholder: "メールアドレスを入力",
    loginPasswordLabel: "パスワード",
    loginPasswordPlaceholder: "パスワードを入力",
    loginSubmit: "サインイン",
    loginNoAccount: "アカウントをお持ちでない方",
    loginRegisterLink: "サインアップ",
    loginOr: "または",
    loginEmailError: "有効なメールアドレスを入力してください",
    loginPasswordError: "パスワードを入力してください",

    // Register Modal
    registerTitle: "Scenewアカウントを作成",
    registerSubtitle: "サインアップしてAIシーン合成の旅を始めましょう",
    registerUsername: "ユーザー名",
    registerUsernamePlaceholder: "ユーザー名を入力",
    registerEmail: "メールアドレス",
    registerEmailPlaceholder: "メールアドレスを入力",
    registerPassword: "パスワード",
    registerPasswordPlaceholder: "8文字以上、英字と数字を含む",
    registerConfirmPassword: "パスワード確認",
    registerConfirmPlaceholder: "パスワードを再入力",
    registerSubmit: "サインアップ",
    registerHaveAccount: "すでにアカウントをお持ちの方",
    registerLoginLink: "サインイン",
    registerSuccess: "登録完了！ログインページへリダイレクト中…",
    registerErrUsername: "ユーザー名を入力してください",
    registerErrEmail: "有効なメールアドレスを入力してください",
    registerErrPassword: "パスワードは8文字以上で英字と数字を含む必要があります",
    registerErrConfirm: "パスワードが一致しません",

    // Product Links (multi)
    tryLinkAdd: "追加",
    tryLinkPaste: "商品リンクを貼り付けて追加",
    tryLinkDetected: "プラットフォーム検出",
    tryLinkRemove: "削除",
    tryLinkEmpty: "まだ商品がありません。リンクを貼り付けて追加してください",
    tryLinkFetching: "商品情報を取得中…",
    tryLinkFetchError: "取得に失敗しました。リンクを確認してください",
    tryLinkMax: "商品リンクは最大5つ",
    tryLinkAdded: "追加済み",
    tryLinkInfoUnavailable: "商品詳細は利用できません",
    tryLinkRetry: "再試行",
    tryLinkUnsupported: "このプラットフォームはまだサポートされていません。現在Taobao/Tmallリンクのみ対応です。",
    tryLinkSupportHint: "現在Taobao/TmallのPCリンクのみ対応",

    // Product Input Mode
    tryProductModeLink: "リンクモード",
    tryProductModeImage: "画像モード",
    tryProductImageUpload: "クリックして商品画像をアップロード",
    tryProductImageFormat: "JPG / PNG対応、最大10MB",
    tryProductImageUploaded: "アップロード済み",
    tryProductImageChange: "画像を変更",
    trySeedModeImageWarning: "シーディングモードはリンクモードでのみ利用可能です。ショッピングカードの生成にはリンクから商品情報（価格、店舗名など）を取得する必要があります。",
    tryValidationProduct: "商品画像をアップロードするか商品リンクを貼り付けてください",

    // Browser Login Modal
    browserLoginTitle: "プラットフォームログインが必要です",
    browserLoginDesc: "この商品にアクセスするにはログインが必要です。以下のウィンドウでログインを完了してください",
    browserLoginLoading: "リモートブラウザを起動中…",
    browserLoginConfirm: "ログイン完了",
    browserLoginCancel: "キャンセル",
    browserLoginSuccess: "ログイン成功、商品情報を再取得中…",

    // Privacy Policy
    privacyTitle: "プライバシーポリシー",
    privacyLastUpdated: "最終更新：2026年3月7日",
    privacyIntro: "Scenewはあなたのプライバシーを大切にしています。このポリシーでは、個人情報の収集、使用、保管、保護について説明します。",
    privacySection1: "1. 情報の収集",
    privacySection1Content: "登録時のメールアドレスとユーザー名、アップロードされた写真と商品リンク、使用データなど、お客様が提供する情報を収集します。",
    privacySection2: "2. 写真の使用と保管",
    privacySection2Content: "アップロードされた写真は現在の生成タスクにのみ使用されます。元の写真は24時間以内に自動的に削除されます。",
    privacySection3: "3. データセキュリティ",
    privacySection3Content: "業界標準のセキュリティ対策でデータを保護しています。",
    privacySection4: "4. 第三者サービス",
    privacySection4Content: "当サービスには第三者ウェブサイトへのリンクが含まれる場合があります。それらのプライバシー慣行については責任を負いません。",
    privacySection5: "5. ポリシーの更新",
    privacySection5Content: "このポリシーは随時更新される場合があります。重要な変更はメールまたはサイト通知でお知らせします。",
    privacyContact: "お問い合わせ：scenewai@163.com",

    // Terms of Service
    termsTitle: "利用規約",
    termsLastUpdated: "最終更新：2026年3月7日",
    termsIntro: "Scenewへようこそ。当サービスを利用することで、これらの規約に同意したものとみなされます。",
    termsSection1: "1. アカウント登録",
    termsSection1Content: "一部の機能を利用するにはアカウント登録が必要です。アカウント情報の機密性を維持する責任はお客様にあります。",
    termsSection2: "2. サービス",
    termsSection2Content: "ScenewはAIベースのシーン合成サービスを提供します。高品質な結果を目指しますが、保証するものではありません。",
    termsSection3: "3. ユーザーの行動",
    termsSection3Content: "違法または有害な活動にサービスを使用しないことに同意するものとします。",
    termsSection4: "4. 知的財産",
    termsSection4Content: "サービスに関連するすべての知的財産権は当社に帰属します。お客様はアップロードしたコンテンツの所有権を有します。",
    termsSection5: "5. 免責事項",
    termsSection5Content: "サービスは「現状のまま」提供され、いかなる保証も伴いません。",
    termsContact: "お問い合わせ：scenewai@163.com",

    // Mode Comparison Modal
    modeComparisonTitle: "シーディングモード vs スタンダードモード",
    modeComparisonDesc: "シーディングモードは商品情報を自動的に統合します",
    modeStandardTitle: "スタンダードモード（クリーン）",
    modeStandardDesc: "クリーンなシーン合成画像を生成し、人物と商品のブレンドに焦点を当てます。",
    modeGrassTitle: "シーディングモード（ショッピングカード）",
    modeGrassDesc: "商品情報（価格、店舗名）を自動抽出し、スタイリッシュなショッピングカードとして画像に統合します。",
    modeClose: "了解",

    // Contact
    contactLabel: "お問い合わせ",
    contactModalTitle: "お問い合わせ",
    contactModalDesc: "右下のチャットウィンドウまたはメールでお問い合わせください：",
    contactEmail: "scenewai@163.com",
    contactModalClose: "了解",
    contactModalEmailHint: "scenewai@163.com",

    // Feedback
    feedbackLabel: "フィードバック",
    feedbackTitle: "あなたのフィードバックが大切です",
    feedbackDesc: "貴重なご提案で改善にご協力ください",
    feedbackContactHint: "その他のご質問は：",
    feedbackPlaceholder: "フィードバックをこちらに入力...",
    feedbackSubmit: "フィードバックを送信",
    feedbackSubmitting: "送信中...",
    feedbackSuccess: "フィードバックが正常に送信されました",
    feedbackError: "送信に失敗しました。再試行してください",
    feedbackNetworkError: "ネットワークエラー、接続を確認してください",
    feedbackContentRequired: "フィードバック内容を入力してください",
    pricingBetaModalTitle: "ベータフェーズのお知らせ",
    pricingBetaModalDesc: "製品は現在ベータ版です。招待コードについてはscenewai@163.comまでお問い合わせください。",
    pricingBetaModalClose: "了解",
    pricingPaymentSuccess: "お支払い完了！クレジットが追加されました",
    pricingPaymentCancelled: "お支払いがキャンセルされました",
    pricingLoginRequired: "購入前にログインしてください",
    pricingProcessing: "決済ページへリダイレクト中…",
    paymentSuccessTitle: "お支払い完了",
    paymentSuccessDesc: "ご購入ありがとうございます！クレジットが即座に追加されました。",
    paymentBalanceBefore: "チャージ前残高",
    paymentPointsAdded: "追加クレジット",
    paymentBalanceAfter: "現在の残高",
    paymentSuccessOk: "素晴らしい！",
    paymentCancelledTitle: "お支払いキャンセル",
    paymentCancelledDesc: "お支払いをキャンセルしました。料金は発生していません。",
    paymentCancelledOk: "戻る",

    // Payment History
    navPaymentHistory: "決済履歴",
    paymentHistoryTitle: "決済履歴",
    paymentHistoryEmpty: "決済記録がありません",
    paymentHistoryEmptyDesc: "最初の購入後に決済履歴がここに表示されます",
    paymentHistoryPlan: "プラン",
    paymentHistoryAmount: "金額",
    paymentHistoryPoints: "クレジット",
    paymentHistoryStatus: "ステータス",
    paymentHistoryTime: "日時",
    paymentHistoryCompleted: "完了",
    paymentHistoryPending: "処理中",
    paymentHistoryFailed: "失敗",
    paymentHistoryStarter: "スターター",
    paymentHistoryGrowth: "グロース",
    paymentHistoryPro: "プロ",

    // Welcome Letter
    welcomeLetterTitle: "Scenewからの手紙",
    welcomeLetterOpen: "手紙を開く",
    welcomeLetterRead: "全文を読む",
    welcomeLetterClose: "今は閉じる",
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
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("scenew_lang");
    const valid: Lang[] = ["zh", "en", "hi", "es", "ar", "fr", "ja"];
    return valid.includes(saved as Lang) ? (saved as Lang) : "zh";
  });
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("scenew_lang", l);
  };
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

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || key;
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      setLoginOpen(true);
      toast.error(t("loginExpired"));
    };
    window.addEventListener("scenew:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("scenew:unauthorized", handleUnauthorized);
  }, [lang]); // Add lang dependency to update t() context if needed, though t is stable in this scope structure usually. Better to use ref or stable t.
  
  // Actually t depends on lang state which changes.
  // To avoid re-binding event listener on lang change, we can use a ref for current lang or just let it re-bind.
  // Re-binding is cheap enough here.

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
    const params = new URLSearchParams(window.location.search);
    if (params.get("google_auth") === "1") {
      const token = params.get("access_token");
      if (token) {
        localStorage.setItem("token", token);
        login({
          id: params.get("user_id") || undefined,
          username: params.get("full_name") || params.get("email")?.split("@")[0] || "",
          email: params.get("email") || "",
          avatar: params.get("avatar_url") || undefined,
          credits: Number(params.get("points")) || 0,
        });
      }
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    const savedToken = localStorage.getItem("token");
    if (savedToken && !user) {
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