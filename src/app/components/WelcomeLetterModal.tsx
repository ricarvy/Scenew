import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useI18n } from "./I18nContext";
import { X, MailOpen } from "lucide-react";

export function WelcomeLetterModal() {
  const { user, t } = useI18n();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<"envelope" | "opening" | "letter">("envelope");

  useEffect(() => {
    // Check if user is logged in or if letter has been seen
    const hasSeenLetter = localStorage.getItem("scenew_welcome_letter_seen");
    
    if (!user && !hasSeenLetter) {
      // Delay opening slightly for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("scenew_welcome_letter_seen", "true");
  };

  const handleOpenLetter = () => {
    setStage("opening");
    setTimeout(() => {
      setStage("letter");
    }, 800); // Animation duration
  };

  const handleReadMore = () => {
    // Mark as seen so it doesn't pop up again
    localStorage.setItem("scenew_welcome_letter_seen", "true");
    // Close modal
    setIsOpen(false);
    // Navigate to specific blog post
    navigate("/blog/your-image-deserves-to-be-seen");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500"
        onClick={handleClose}
      />
      
      <div className="relative z-10 w-full max-w-lg perspective-1000">
        {/* Stage 1: Envelope */}
        {stage === "envelope" && (
          <div 
            className="bg-[#FDF9F4] rounded-xl shadow-2xl p-8 text-center transform transition-all duration-500 hover:scale-105 cursor-pointer border border-[#E8C3BA]/30 relative overflow-hidden group"
            onClick={handleOpenLetter}
            style={{
              animation: "float 6s ease-in-out infinite",
              backgroundImage: "radial-gradient(circle at center, #fff 0%, #FDF9F4 100%)"
            }}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/5 transition-colors text-[#5C3D24]/60 hover:text-[#5C3D24]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-24 h-24 mx-auto mb-6 bg-[#5C3D24]/5 rounded-full flex items-center justify-center group-hover:bg-[#5C3D24]/10 transition-colors">
              <MailOpen className="w-10 h-10 text-[#5C3D24]" />
            </div>
            
            <h3 className="text-2xl font-serif text-[#5C3D24] mb-3">
              {t("welcomeLetterTitle")}
            </h3>
            
            <p className="text-muted-foreground mb-8 max-w-xs mx-auto text-sm">
              To: You
            </p>

            <button 
              className="px-8 py-3 bg-[#5C3D24] text-white rounded-full hover:bg-[#4A311D] transition-all shadow-lg hover:shadow-xl font-medium tracking-wide text-sm"
            >
              {t("welcomeLetterOpen")}
            </button>

            {/* Decorative stamp */}
            <div className="absolute top-6 left-6 opacity-20 rotate-[-15deg] pointer-events-none">
              <div className="w-16 h-16 border-2 border-[#5C3D24] rounded-full flex items-center justify-center">
                <span className="text-[10px] font-serif text-[#5C3D24]">SCENEW</span>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2 & 3: Opening Animation & Letter Content */}
        {(stage === "opening" || stage === "letter") && (
          <div 
            className={`bg-[#fff] rounded-sm shadow-2xl overflow-hidden transition-all duration-1000 relative max-h-[80vh] flex flex-col ${
              stage === "opening" ? "scale-y-0 opacity-0 translate-y-20" : "scale-y-100 opacity-100 translate-y-0"
            }`}
            style={{
              backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')"
            }}
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors text-[#5C3D24]/60 hover:text-[#5C3D24] z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto p-8 md:p-12 custom-scrollbar">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <span className="text-[#A0714A] text-xs tracking-[0.2em] uppercase block mb-2">Scenew</span>
                  <h2 className="text-2xl md:text-3xl font-serif text-[#5C3D24] leading-tight">
                    {t("welcomeLetterTitle")}
                  </h2>
                </div>

                <div className="prose prose-sm md:prose-base text-[#6B5D52] font-light leading-relaxed mb-8 font-serif">
                  <p>
                    有些话，在心里转了很多圈，最后还是咽了回去。
                  </p>
                  <p>
                    有些图，在脑海里已经完整得像一幅画，却始终没能变成手机相册里的任何一张。
                  </p>
                  <p>
                    这篇文章，是写给你的。
                  </p>
                  <p className="italic text-center text-[#A0714A]/80 my-6">
                    ——写给每一个「差一点就放弃表达」的人
                  </p>
                </div>

                <div className="text-center pt-4 border-t border-[#E8C3BA]/30">
                  <button
                    onClick={handleReadMore}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-[#5C3D24] text-white rounded-full hover:bg-[#4A311D] transition-all shadow-md hover:shadow-lg text-sm font-medium"
                  >
                    {t("welcomeLetterRead")}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  
                  <div className="mt-4">
                    <button 
                      onClick={handleClose}
                      className="text-xs text-[#A0714A] hover:text-[#8B5E3C] hover:underline"
                    >
                      {t("welcomeLetterClose")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E8C3BA;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
