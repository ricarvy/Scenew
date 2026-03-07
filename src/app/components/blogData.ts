export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown string
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "future-of-ai-fashion",
    title: "AI 正在重塑时尚电商的未来",
    excerpt: "随着生成式 AI 技术的突破，传统的电商拍摄模式正在经历一场革命。了解 Scenew 如何帮助品牌降低 90% 的拍摄成本。",
    content: `
      <p>在当今竞争激烈的电商环境中，高质量的视觉内容是吸引顾客的关键。然而，传统的拍摄流程——模特预约、场地租赁、后期修图——不仅耗资巨大，而且周期漫长。</p>
      
      <h2>传统拍摄的痛点</h2>
      <p>对于中小型卖家而言，为每一件新品拍摄精美的场景图是一笔沉重的负担。通常，一次专业的商业拍摄动辄数千甚至上万元，这还不包括时间成本。</p>
      
      <h2>AI 带来的变革</h2>
      <p>生成式 AI 技术，特别是像 Scenew 这样的场景合成工具，正在彻底改变这一现状。通过简单的“上传+描述”操作，商家可以在几分钟内获得媲美专业摄影棚的场景图。</p>
      
      <blockquote>
        "Scenew 让我们的上新速度提升了 5 倍，而成本仅为原来的十分之一。" —— 某独立站主理人
      </blockquote>

      <h2>不仅仅是省钱</h2>
      <p>除了成本优势，AI 还带来了无限的创意可能。想把夏装放到雪山顶展示？或者让冬装出现在热带雨林？在现实中难以实现的场景，AI 都能轻松搞定。</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
    },
    date: "2026-03-01",
    tags: ["AI技术", "电商趋势", "降本增效"]
  },
  {
    id: "2",
    slug: "how-to-write-perfect-prompts",
    title: "如何写出完美的场景提示词？",
    excerpt: "想要 AI 生成更精准的画面？掌握这 5 个提示词技巧，让你的创意百分百还原。",
    content: `
      <p>很多用户在使用 Scenew 时会问：为什么我生成的场景和想象中不太一样？通常，这取决于你的提示词（Prompt）写得是否足够清晰。</p>
      
      <h2>1. 具体的环境描述</h2>
      <p>不要只说“户外”，试着说“阳光明媚的巴黎街头咖啡馆，背景有模糊的埃菲尔铁塔”。细节越丰富，AI 越能理解你的意图。</p>
      
      <h2>2. 添加光影和氛围</h2>
      <p>光线是照片的灵魂。尝试加入“清晨柔和的阳光”、“赛博朋克霓虹灯光”或“午后慵懒的暖光”等描述。</p>
      
      <h2>3. 指定风格</h2>
      <p>你想要什么样的质感？“电影感”、“胶片风格”、“极简主义”还是“高饱和度商业摄影”？明确风格能让成片更具统一性。</p>
      
      <h2>4. 使用参考图</h2>
      <p>文字难以描述时，Scenew 的“参考图”功能是你的好帮手。上传一张你喜欢的风格图，AI 会参考其构图和色调。</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "Mike Ross",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
    },
    date: "2026-02-25",
    tags: ["教程", "提示词工程", "使用技巧"]
  },
  {
    id: "3",
    slug: "scenew-update-v2",
    title: "Scenew V2.0 发布：更真实的光影融合",
    excerpt: "我们很高兴地宣布 Scenew 的重大更新。全新的光影引擎让合成效果更加自然，几乎无法分辨真假。",
    content: `
      <p>在听取了数千名用户的反馈后，我们带来了 Scenew V2.0。这次更新的核心在于“真实感”的极致追求。</p>
      
      <h2>全新的光影追踪引擎</h2>
      <p>我们重写了光影融合算法。现在，当你在逆光场景中合成人物时，AI 会自动计算边缘光（Rim Light）和环境光遮蔽（AO），让人和背景完美融合。</p>
      
      <h2>细节增强</h2>
      <p>针对衣物褶皱和材质的纹理，V2.0 进行了专门优化。丝绸的光泽、牛仔的粗糙感都能得到更好的保留。</p>
      
      <h2>更快的生成速度</h2>
      <p>得益于模型架构的优化，V2.0 的生成速度提升了 40%。现在，你可以在 30 秒内获得 4 张高清场景图。</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    author: {
      name: "Scenew Team",
      avatar: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100&auto=format&fit=crop"
    },
    date: "2026-02-15",
    tags: ["产品更新", "技术发布"]
  }
];
