import { useState, useRef, useEffect } from "react";
import { X, Gift, Sparkles } from "lucide-react";
import { useI18n } from "./I18nContext";
import { toast } from "sonner";

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RedeemModal({ isOpen, onClose }: RedeemModalProps) {
  const { t, user, redeem } = useI18n();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCode("");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error(t("heroRedeemEnterCode"), {
        position: "top-center"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const url = API_BASE ? `${API_BASE}/auth/redeem` : "/api/auth/redeem";
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ code: code.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || t("heroRedeemSuccess"), {
          description: `${t("heroRedeemCreditsAdded")}${data.points_added}`,
          duration: 4000,
          position: "top-center"
        });
        
        // Update local user points context
        redeem(data.points_added);
        
        // Close modal after success
        onClose();
      } else {
        toast.error(t("heroRedeemFailed"), {
          position: "top-center"
        });
      }
    } catch (error) {
      console.error("Redeem error:", error);
      toast.error(t("heroRedeemNetworkError"), {
        position: "top-center"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        style={{ animation: "fadeIn 0.3s ease-out" }}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 opacity-100"
        style={{ animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="bg-gradient-to-r from-[#E8C3BA]/30 to-[#D4AF37]/10 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,transparent_60%)] opacity-50" />
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white transition-colors z-20"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg mb-4 relative z-10">
            <Gift className="w-8 h-8 text-[#D4AF37]" />
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-[#E8C3BA] animate-bounce" />
          </div>
          
          <h2 className="text-xl font-semibold text-[#5C3D24] relative z-10">{t("heroRedeem")}</h2>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("heroRedeemCodeLabel")}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("heroRedeemCodePlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-transparent transition-all uppercase tracking-widest text-center text-lg"
              autoFocus
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              {t("heroRedeemCancel")}
            </button>
            <button
              onClick={handleRedeem}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A0714A] to-[#8B5E3C] text-white font-medium hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t("heroRedeemSubmit")
              )}
            </button>
          </div>
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
