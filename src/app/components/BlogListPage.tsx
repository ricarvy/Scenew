import { useNavigate } from "react-router";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useI18n } from "./I18nContext";
import { GlowOrb } from "./WarmGlow";
import { blogPosts } from "./blogData";

export function BlogListPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20 relative overflow-hidden flex flex-col items-center">
      {/* Warm ambient glow orbs - Matching HeroSection */}
      <GlowOrb
        className="-top-20 -right-40"
        color="rgba(212, 165, 116, 0.15)"
        size="700px"
        blur="140px"
      />
      <GlowOrb
        className="-bottom-32 -left-48"
        color="rgba(196, 149, 106, 0.12)"
        size="600px"
        blur="120px"
      />
      <GlowOrb
        className="top-1/3 left-1/2 -translate-x-1/2"
        color="rgba(228, 186, 140, 0.06)"
        size="900px"
        blur="160px"
      />

      <div className="max-w-6xl w-full mx-auto px-6 relative z-10">
        <header className="mb-20 text-center relative">
          {/* Subtle warm halo behind title */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(212,165,116,0.07) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
            aria-hidden="true"
          />
          
          <h1 className="text-4xl md:text-5xl font-serif text-[#5C3D24] mb-4 relative z-10">{t("blogTitle")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto relative z-10">{t("blogSubtitle")}</p>
        </header>

        <div className="relative">
          {/* Center Vertical Timeline Line */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-[#A0714A]/20 via-[#A0714A]/40 to-transparent hidden md:block" />

          <div className="space-y-12">
            {blogPosts.map((post, index) => (
              <div 
                key={post.id}
                className={`group relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline Dot & Date */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 z-20 flex flex-col items-center h-full pointer-events-none hidden md:flex">
                  <div className="w-4 h-4 rounded-full border-2 border-[#A0714A] bg-[#FDF9F4] group-hover:bg-[#A0714A] transition-colors shadow-[0_0_0_4px_rgba(253,249,244,0.5)] mt-8 relative z-10" />
                  <span className="mt-2 text-xs font-medium text-[#A0714A] bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[#E8C3BA]/20 whitespace-nowrap shadow-sm z-0">
                    {post.date}
                  </span>
                </div>

                {/* Spacer for layout balance */}
                <div className="hidden md:block w-5/12" />

                {/* Card */}
                <div className="w-full md:w-5/12">
                  <div 
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#D4AF37]/10 border border-[#E8C3BA]/20 transition-all duration-300 cursor-pointer flex flex-col group-hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="w-full aspect-video relative overflow-hidden">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      
                      {/* Mobile Date Badge */}
                      <div className="absolute top-3 left-3 md:hidden bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-[#5C3D24] flex items-center gap-1 shadow-sm">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex gap-2 mb-3">
                        {post.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#A0714A] text-xs">#{tag}</span>
                        ))}
                      </div>
                      
                      <h2 className="text-xl font-serif text-[#5C3D24] mb-3 group-hover:text-[#A0714A] transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-xs font-medium text-[#5C3D24]">{post.author.name}</span>
                        </div>
                        
                        <span className="text-sm font-medium text-[#A0714A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {t("blogReadMore")} <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
