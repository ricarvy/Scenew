import { useState, useEffect } from "react";
import { useI18n } from "./I18nContext";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock, ShoppingBag, User, Image as ImageIcon, ExternalLink, Calendar, ChevronRight, Download, X as XIcon, Loader2 } from "lucide-react";
import { GenerationHistory, getGenerations, initializeMockData } from "./generationHistory";
import { GlowOrb } from "./WarmGlow";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectCards, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";

export function GenerationsPage() {
  const { t, lang, user } = useI18n();
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<GenerationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGen, setSelectedGen] = useState<GenerationHistory | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Only fetch if user is logged in or we have a token
    if (user || token) {
      setLoading(true);
      console.log("Fetching generations...");
      // In real scenario, user.id should be available. For now we use a placeholder or handle mock
      // But since we updated getGenerations to be async and fetch from API:
      getGenerations(user?.id || "current").then(data => {
         console.log("Generations data received:", data);
         setGenerations(data);
         setLoading(false);
      }).catch(err => {
        console.error("Failed to fetch generations", err);
        setLoading(false);
        // If the error is Unauthorized (from generationHistory.ts), the I18nContext listener will handle the modal
        // But we can also show a toast or redirect here if needed.
        if (err.message === "Unauthorized") {
             // Let the event listener in I18nContext handle the login modal
             // We just stop loading
        }
      });
    } else {
       // If no user, maybe redirect or show empty
       console.log("No user or token found, skipping fetch");
       setGenerations([]);
       setLoading(false);
    }
    window.scrollTo(0, 0);
  }, [user]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(lang === "zh" ? "zh-CN" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + "..." : str;
  };

  const handleDownload = (imageUrl: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `scenew-generation-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FDF9F4] pt-24 pb-12 relative overflow-hidden">
      {/* Background Glows */}
      <GlowOrb className="top-0 left-0" color="rgba(232, 195, 186, 0.15)" size="600px" blur="100px" />
      <GlowOrb className="bottom-0 right-0" color="rgba(212, 175, 55, 0.1)" size="500px" blur="120px" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#5C3D24]" />
          </button>
          <h1 className="text-2xl font-serif text-[#5C3D24]">{t("myGenerationsTitle")}</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#A0714A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : generations.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-[#E8C3BA]/20">
            <ImageIcon className="w-16 h-16 mx-auto text-[#E8C3BA] mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-[#5C3D24] mb-2">{t("noGenerationsTitle")}</h3>
            <p className="text-muted-foreground mb-6">{t("noGenerationsDesc")}</p>
            <button
              onClick={() => navigate("/try")}
              className="px-6 py-2.5 bg-[#A0714A] text-white rounded-full hover:bg-[#8B5E3C] transition-colors"
            >
              {t("heroStart")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((gen) => (
              <div 
                key={gen.id}
                onClick={() => gen.status === "success" && setSelectedGen(gen)}
                className={`group bg-white rounded-2xl overflow-hidden border border-[#E8C3BA]/20 transition-all duration-300 flex flex-col ${
                  gen.status === "success" 
                    ? "hover:border-[#D4AF37]/40 shadow-sm hover:shadow-xl hover:shadow-[#D4AF37]/10 cursor-pointer" 
                    : "cursor-default opacity-90"
                }`}
              >
                {/* Main Result Image (Thumbnail) */}
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 group/image">
                  {gen.status === "processing" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FDF9F4]/80 backdrop-blur-sm z-10">
                      <div className="w-12 h-12 relative mb-4">
                        <div className="absolute inset-0 border-4 border-[#A0714A]/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#A0714A] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-[#A0714A] font-medium text-sm animate-pulse">
                        {lang === "zh" ? "正在生成中..." : "Generating..."}
                      </p>
                    </div>
                  ) : (
                    <img 
                      src={gen.resultImage} 
                      alt="Generation Result" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Hover Download Button - Only for success */}
                  {gen.status === "success" && (
                    <button
                      onClick={(e) => handleDownload(gen.resultImage, e)}
                      className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm opacity-0 group-hover/image:opacity-100 transition-opacity z-10"
                      title={t("downloadImage")}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* Overlay with small thumbnails */}
                  <div className="absolute bottom-3 right-3 flex gap-2 z-0">
                    <div className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden shadow-md bg-white">
                      <img src={gen.userImage} className="w-full h-full object-cover" alt="User" />
                    </div>
                    <div className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden shadow-md bg-white">
                      <img src={gen.productImage} className="w-full h-full object-cover" alt="Product" />
                    </div>
                  </div>
                  
                  {/* Date Badge or Status Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-[#5C3D24] flex items-center gap-1 shadow-sm pointer-events-none z-10">
                    {gen.status === "processing" ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {lang === "zh" ? "生成中" : "Processing"}
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        {lang === "zh" ? "生成成功" : "Success"}
                      </>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                     <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(gen.timestamp)}
                     </span>
                     {gen.duration && gen.duration > 0 && (
                       <span className="bg-[#FAF6F0] px-2 py-0.5 rounded text-[#A0714A]">
                         {gen.duration.toFixed(1)}s
                       </span>
                     )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                     <span className="text-xs text-muted-foreground">
                        {gen.status === "processing" 
                          ? (lang === "zh" ? "请稍候..." : "Please wait...") 
                          : t("viewDetails")}
                     </span>
                     {gen.status === "success" && (
                       <div className="w-6 h-6 rounded-full bg-[#FAF6F0] flex items-center justify-center group-hover:bg-[#A0714A] group-hover:text-white transition-colors">
                         <ChevronRight className="w-3 h-3" />
                       </div>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedGen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedGen(null)}
          />
          
          <div className="relative w-full max-w-5xl h-[85vh] bg-[#FDF9F4] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[scaleIn_0.3s_ease-out]">
            <button 
              onClick={() => setSelectedGen(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>

            {/* Left: Result Images (Swiper) */}
            <div className="w-full md:w-3/5 bg-[#FDF9F4] relative flex items-center justify-center h-1/2 md:h-full overflow-hidden">
              {/* For demo purposes, we'll duplicate the single result image to simulate multiple variations */}
              <Swiper
                modules={[Pagination, Navigation, EffectCoverflow]}
                effect="coverflow"
                pagination={{ clickable: true }}
                navigation={true}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                className="w-full h-full"
                spaceBetween={0}
              >
                {(selectedGen.resultImages && selectedGen.resultImages.length > 0 ? selectedGen.resultImages : [selectedGen.resultImage]).map((img, idx) => (
                  <SwiperSlide key={idx} className="flex items-center justify-center bg-transparent relative group !w-auto">
                    <img 
                      src={img} 
                      alt={`Result ${idx + 1}`} 
                      className="w-auto h-full object-contain max-h-[85vh] p-4 md:p-8 block"
                    />
                    {/* Hover Download Button for Slide */}
                    <button
                      onClick={(e) => handleDownload(img, e)}
                      className="absolute bottom-8 right-8 px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm font-medium z-10"
                    >
                      <Download className="w-4 h-4" />
                      {t("downloadImage")}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto h-1/2 md:h-full border-l border-[#E8C3BA]/20 bg-white/50 backdrop-blur-sm">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#A0714A]/10 text-[#A0714A] text-xs font-medium border border-[#A0714A]/20">
                    {selectedGen.mode === "copy" ? t("tryTabCopy") : t("tryTabInspire")}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(selectedGen.timestamp).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-2xl font-serif text-[#5C3D24] leading-tight mb-4">
                  {lang === "zh" ? "推荐文案" : "Recommended Copy"}
                </h2>
                <div className="relative">
                   <div className="absolute -left-2 top-0 bottom-0 w-1 bg-[#A0714A]/20 rounded-full" />
                   <p className="text-sm text-[#5C3D24]/80 leading-relaxed pl-3 italic whitespace-pre-wrap">
                     {selectedGen.generatedCopy || selectedGen.prompt}
                   </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Source Images Section */}
                <div>
                  <h3 className="text-sm font-medium text-[#5C3D24] uppercase tracking-wider mb-4 border-b border-[#E8C3BA]/20 pb-2 text-center">
                    {lang === "zh" ? "素材来源" : "Source Assets"}
                  </h3>
                  
                  <div className="space-y-6">
                    {/* User Photo */}
                    <div className="space-y-2 flex flex-col items-center">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <User className="w-3 h-3" /> {t("tryPhotoLabel")}
                      </p>
                      <div className="aspect-[3/4] w-32 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm group cursor-zoom-in">
                        <img src={selectedGen.userImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="User" />
                      </div>
                    </div>

                    {/* Product Photos (Swiper) */}
                    <div className="space-y-2 flex flex-col items-center">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <ShoppingBag className="w-3 h-3" /> {t("tryLinkLabel")}
                      </p>
                      {/* Swiper for Product Images */}
                      <div className="w-full max-w-[300px] h-[200px] mx-auto overflow-hidden">
                        <Swiper
                           modules={[Pagination, EffectCoverflow]}
                           effect="coverflow"
                           grabCursor={true}
                           centeredSlides={true}
                           slidesPerView={2}
                           coverflowEffect={{
                             rotate: 50,
                             stretch: 0,
                             depth: 100,
                             modifier: 1,
                             slideShadows: true,
                           }}
                           pagination={{ clickable: true, dynamicBullets: true }}
                           className="w-full h-full pb-8"
                        >
                          {/* Simulating multiple product images */}
                          {(selectedGen.productImages && selectedGen.productImages.length > 0 ? selectedGen.productImages : [selectedGen.productImage]).map((img, idx) => (
                            <SwiperSlide key={idx}>
                              <img 
                                src={img} 
                                className="w-full h-full object-cover cursor-zoom-in" 
                                alt={`Product ${idx}`} 
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-[#E8C3BA]/20 flex flex-col gap-3">
                  <button className="w-full py-3 rounded-xl bg-[#5C3D24] text-white font-medium hover:bg-[#4A311D] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#5C3D24]/20">
                    <Download className="w-4 h-4" />
                    {t("downloadImage")}
                  </button>
                  <button 
                    onClick={() => {
                        // TODO: Implement "Use as template" or similar
                        navigate("/try");
                    }}
                    className="w-full py-3 rounded-xl border border-[#A0714A] text-[#A0714A] font-medium hover:bg-[#A0714A]/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t("tryResultRegenerate")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: #A0714A !important;
          background: rgba(255, 255, 255, 0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 18px !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet-active {
          background: #A0714A !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(160, 113, 74, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(160, 113, 74, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(160, 113, 74, 0.5);
        }
      `}</style>
    </div>
  );
}
