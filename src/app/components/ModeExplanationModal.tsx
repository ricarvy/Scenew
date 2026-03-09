import { useState } from "react";
import { X, Sparkles, Copy, ZoomIn } from "lucide-react";
import { useI18n } from "./I18nContext";

interface ModeExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModeExplanationModal({ isOpen, onClose }: ModeExplanationModalProps) {
  const { t } = useI18n();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
              
              <div 
                className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 mb-4 relative group cursor-pointer"
                onClick={() => setPreviewImage("https://sceneu-online.oss-cn-shenzhen.aliyuncs.com/webview/gen_1.jpg")}
              >
                <img 
                  src="https://sceneu-online.oss-cn-shenzhen.aliyuncs.com/webview/gen_1.jpg" 
                  alt="Standard Mode Result" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-8 h-8 text-white mb-2" />
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
              
              <div 
                className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 mb-4 relative group border border-[#D4AF37]/20 cursor-pointer"
                onClick={() => setPreviewImage("https://sceneu-online.oss-cn-shenzhen.aliyuncs.com/webview/seed_1.jpg")}
              >
                <img 
                  src="https://sceneu-online.oss-cn-shenzhen.aliyuncs.com/webview/seed_1.jpg" 
                  alt="Grass-planting Mode Result" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
                {/* Shopping Card Overlay Mockup */}
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

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setPreviewImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
            style={{ animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        </div>
      )}

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
