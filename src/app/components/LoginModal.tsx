import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useI18n } from "./I18nContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { t } = useI18n();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.3s ease" }}
      />

      {/* Modal */}
      <div
        className="relative rounded-2xl w-full max-w-md overflow-hidden"
        style={{
          animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          background: "linear-gradient(145deg, #FDF9F4 0%, #FAF6F0 100%)",
          boxShadow: "0 24px 80px rgba(139,94,60,0.12), 0 8px 24px rgba(139,94,60,0.06), 0 0 0 1px rgba(196,149,106,0.08)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all z-10"
          aria-label={t("loginClose")}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top decorative gradient */}
        <div
          className="h-1.5"
          style={{
            background: "linear-gradient(to right, rgba(160,113,74,0.3), #A0714A, #8B5E3C, #A0714A, rgba(160,113,74,0.3))",
          }}
        />

        <div className="px-8 pt-10 pb-8 relative">
          {/* Warm corner glow */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
            aria-hidden="true"
          />

          {/* Logo */}
          <div className="text-center mb-8">
            <p
              className="tracking-[0.3em] text-primary mb-3"
              style={{ fontSize: "0.7rem" }}
            >
              SCENEW
            </p>
            <h2 style={{ fontSize: "1.5rem", lineHeight: 1.3 }}>
              {t("loginTitle")}
            </h2>
            <p
              className="text-muted-foreground mt-3"
              style={{ fontSize: "0.9rem", lineHeight: 1.6 }}
            >
              {t("loginSubtitle")}
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
          </div>

          {/* Google login button */}
          <button
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border border-border/80 bg-background hover:bg-muted/40 transition-all duration-300 hover:shadow-md hover:shadow-primary/[0.05] hover:border-primary/20 group"
            style={{ fontSize: "0.95rem" }}
            onClick={() => {
              // Simulate Google login
              alert("Google OAuth redirect...");
              onClose();
            }}
          >
            <GoogleIcon />
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              {t("loginGoogle")}
            </span>
          </button>

          {/* Terms */}
          <p
            className="text-center text-muted-foreground/70 mt-6 px-4"
            style={{ fontSize: "0.72rem", lineHeight: 1.6 }}
          >
            {t("loginTerms")}{" "}
            <a href="#" className="text-primary underline underline-offset-2">
              {t("loginTermsLink")}
            </a>{" "}
            {t("loginAnd")}{" "}
            <a href="#" className="text-primary underline underline-offset-2">
              {t("loginPrivacy")}
            </a>
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}