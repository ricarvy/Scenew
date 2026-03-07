import { X, Sparkles, Copy } from "lucide-react";
import { useI18n } from "./I18nContext";

interface ModeExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModeExplanationModal({ isOpen, onClose }: ModeExplanationModalProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        style={{ animation: "fadeIn 0.3s ease-out" }}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-3xl bg-[#FDF9F4] rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100 opacity-100 flex flex-col"
        style={{ animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-20"
        >
          <X className="w-5 h-5 text-[#5C3D24]" />
        </button>

        <div className="p-8 pb-4 text-center">
          <h2 className="text-2xl font-serif text-[#5C3D24] mb-2">{t("modeComparisonTitle")}</h2>
          <p className="text-muted-foreground">{t("modeComparisonDesc")}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Mode Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8C3BA]/20 shadow-sm flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4 text-[#5C3D24]">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center">
                  <Copy className="w-4 h-4" />
                </div>
                <h3 className="font-medium text-lg">{t("modeStandardTitle")}</h3>
              </div>
              
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 mb-4 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop" 
                  alt="Standard Mode Result" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium px-4 text-center">Original Composition</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed mt-auto">
                {t("modeStandardDesc")}
              </p>
            </div>

            {/* Grass-planting Mode Card */}
            <div className="bg-gradient-to-br from-[#FFF8F0] to-[#FFF0E0] rounded-2xl p-5 border border-[#D4AF37]/30 shadow-md flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-bl-full -mr-4 -mt-4 pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-4 text-[#A0714A]">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <h3 className="font-medium text-lg">{t("modeGrassTitle")}</h3>
              </div>
              
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 mb-4 relative group border border-[#D4AF37]/20">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop" 
                  alt="Grass-planting Mode Result" 
                  className="w-full h-full object-cover"
                />
                {/* Shopping Card Overlay Mockup */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/40 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="flex gap-3 items-center">
                     <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                     </div>
                     <div className="min-w-0">
                       <p className="text-xs font-medium text-[#5C3D24] truncate">Vintage Trench Coat</p>
                       <p className="text-[10px] text-muted-foreground truncate">Autumn Collection 2026</p>
                     </div>
                     <div className="ml-auto text-sm font-bold text-[#A0714A]">¥299</div>
                   </div>
                </div>
              </div>
              
              <p className="text-sm text-[#8B5E3C] leading-relaxed mt-auto font-medium">
                {t("modeGrassDesc")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 border-t border-[#E8C3BA]/10 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#5C3D24] text-white rounded-full hover:bg-[#4A311D] transition-colors shadow-lg shadow-[#5C3D24]/20"
          >
            {t("modeClose")}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
