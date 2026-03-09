import { useState } from "react";
import { X, MessageSquare, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "./I18nContext";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useI18n();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error(t("feedbackContentRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const url = API_BASE ? `${API_BASE}/api/feedback` : "/api/feedback";
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
          content,
        }),
      });

      if (response.ok) {
        toast.success(t("feedbackSuccess"));
        setIsOpen(false);
        setContent("");
        setScore(5);
      } else {
        toast.error(t("feedbackError"));
      }
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error(t("feedbackNetworkError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-[#5C3D24] text-white rounded-full shadow-lg hover:bg-[#4A311D] transition-all duration-300 hover:scale-105 group"
        aria-label="Feedback"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {t("feedbackLabel")}
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-full max-w-md bg-[#FDF9F4] rounded-2xl shadow-2xl p-6 transform transition-all scale-100 opacity-100">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5 text-[#5C3D24]" />
            </button>

            <h3 className="text-xl font-serif text-[#5C3D24] mb-2 text-center">
              {t("feedbackTitle")}
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {t("feedbackDesc")}
            </p>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setScore(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= score 
                        ? "fill-[#D4AF37] text-[#D4AF37]" 
                        : "text-[#E8C3BA] hover:text-[#D4AF37]"
                    }`} 
                  />
                </button>
              ))}
            </div>

            {/* Content Input */}
            <div className="mb-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("feedbackPlaceholder")}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#E8C3BA]/30 bg-white focus:outline-none focus:ring-1 focus:ring-[#A0714A]/50 resize-none text-sm placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 bg-[#5C3D24] text-white rounded-xl hover:bg-[#4A311D] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("feedbackSubmitting")}
                </>
              ) : (
                t("feedbackSubmit")
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
