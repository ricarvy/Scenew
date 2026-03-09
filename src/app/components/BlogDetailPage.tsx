import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { useI18n } from "./I18nContext";
import { GlowOrb } from "./WarmGlow";
import { blogPosts } from "./blogData";

export function BlogDetailPage() {
  const { id } = useParams();
  const { t } = useI18n();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-[#5C3D24] mb-4">Post Not Found</h1>
          <button 
            onClick={() => navigate("/blog")}
            className="text-[#A0714A] hover:underline"
          >
            {t("blogBack")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F4] pt-24 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <GlowOrb className="top-0 left-0" color="rgba(232, 195, 186, 0.15)" size="600px" blur="100px" />
      <GlowOrb className="bottom-0 right-0" color="rgba(212, 175, 55, 0.1)" size="500px" blur="120px" />

      <article className="max-w-4xl mx-auto px-6 relative z-10">
        <button 
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 text-muted-foreground hover:text-[#5C3D24] transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t("blogBack")}
        </button>

        <header className="mb-16 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-[#A0714A] mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#E8C3BA]/30">#{tag}</span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-serif text-[#5C3D24] leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground border-b border-[#E8C3BA]/20 pb-10 mb-12">
            <div className="flex items-center gap-2">
              <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white" />
              <span className="font-medium text-[#5C3D24]">{post.author.name}</span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {t("blogPublished")} {post.date}
            </span>
          </div>
        </header>

        <div className="relative mb-16 rounded-2xl overflow-hidden shadow-xl shadow-[#D4AF37]/10 aspect-[21/9]">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div 
          className="prose prose-lg mx-auto max-w-2xl 
            prose-headings:font-serif prose-headings:text-[#5C3D24] prose-headings:font-normal prose-headings:mt-24 prose-headings:mb-12 prose-headings:text-center
            prose-p:text-[#6B5D52] prose-p:leading-[2.5] prose-p:mb-12 prose-p:font-light prose-p:tracking-wide
            prose-strong:text-[#5C3D24] prose-strong:font-medium
            prose-a:text-[#A0714A] prose-a:no-underline prose-a:border-b prose-a:border-[#A0714A]/30 hover:prose-a:border-[#A0714A]
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-20 prose-img:max-w-[90%] prose-img:mx-auto
            prose-hr:border-[#E8C3BA] prose-hr:my-24 prose-hr:w-24 prose-hr:mx-auto prose-hr:border-t-2
            prose-blockquote:border-l-2 prose-blockquote:border-[#A0714A] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#8B5E3C] prose-blockquote:my-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-8 border-t border-[#E8C3BA]/20 flex items-center justify-between">
          <span className="font-serif text-[#5C3D24] text-lg">{t("blogShare")}</span>
          <div className="flex gap-4">
            <button className="p-2 rounded-full bg-white hover:bg-[#FAF6F0] text-[#5C3D24] transition-colors shadow-sm border border-gray-100">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-white hover:bg-[#FAF6F0] text-[#5C3D24] transition-colors shadow-sm border border-gray-100">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-white hover:bg-[#FAF6F0] text-[#5C3D24] transition-colors shadow-sm border border-gray-100">
              <Linkedin className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-white hover:bg-[#FAF6F0] text-[#5C3D24] transition-colors shadow-sm border border-gray-100">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
