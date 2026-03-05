import { useEffect, useRef, useState } from "react";
import { X, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useI18n } from "./I18nContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
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

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { t } = useI18n();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setEmail("");
      setPassword("");
      setErrors({});
      setIsSubmitting(false);
      setShowPassword(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = t("loginEmailError");
    if (!password.trim()) errs.password = t("loginPasswordError");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    
    // Call backend login API
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://120.76.142.91:8910";
      // The backend uses /auth/login (without /api prefix if API_BASE includes port 8910, 
      // but usually API_BASE ends with /api? No, based on productScraper.ts it's just the host:port)
      // Wait, productScraper says: `${API_BASE}/api/auth/login-page`
      // User says: POST /auth/login
      // Let's assume API_BASE is the root URL. 
      // If user meant the path is /auth/login relative to root, we should check if we need /api prefix or not.
      // Based on previous code: `${API_BASE}/api/auth/login`
      // If user says "POST /auth/login", maybe they mean the path changed?
      // Or maybe they mean the *resource* path.
      // Let's stick to what's likely correct based on existing patterns, but adjust if needed.
      // Existing productScraper uses /api/auth/...
      // User input: "POST /auth/login"
      // If the backend is FastAPI mounted at /, then it might be /auth/login directly.
      // But if it's behind Nginx or router with /api prefix...
      // Let's try /api/auth/login first as it was before, but if user explicitly says /auth/login...
      // Let's look at productScraper.ts again.
      // It uses `${API_BASE}/api/auth/login-page`.
      // So if I use `${API_BASE}/auth/login`, it might be missing /api.
      // However, user input is specific. Let's assume user means the *endpoint path* on the backend router.
      // If previous code worked with /api/auth/login, I should keep /api if that's the convention.
      // But user input might imply a change.
      // Let's try to be safe. If user says "/auth/login", and API_BASE is "http://...:8910", then URL is "http://...:8910/auth/login".
      // But if the backend is structured with /api prefix for everything...
      // Let's check if productScraper.ts works. User said "productScraper works".
      // productScraper uses /api/auth/login-page.
      // So likely the prefix is /api/auth.
      // But user said: "POST /auth/login".
      // This is ambiguous. Does user mean "/api/auth/login" or literally "/auth/login"?
      // Usually "POST /auth/login" means the route definition.
      // If I look at the previous failed command output, it was 404 or something? No, it was just git error.
      // Let's assume the user is correcting the path to be `/auth/login` (implying NO /api prefix? or maybe just describing the auth module?)
      // Wait, standard practice: /api/v1/auth...
      // Let's try to search for backend code if possible? No, I can't see backend code.
      // Let's assume the user is giving the *exact* path relative to the domain.
      // So I will change it to `/auth/login` and `/auth/register` (removing `/api` prefix if it was there, or adding it if needed).
      // BUT, productScraper uses `/api/auth/...`.
      // If I change Login to `/auth/login`, it might be inconsistent.
      // Let's try to use `/api/auth/login` first (which is what I had).
      // Wait, I already had `/api/auth/login` in the code I wrote in previous turn.
      // And user said "无法调用后端的登录接口".
      // Maybe the path IS `/auth/login` (without /api)?
      // Let's try changing it to `${API_BASE}/auth/login` (removing /api).
      
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }

      // Success
      alert(t("loginSuccess") || "Login successful!");
      // TODO: Save token/user info if backend returns it
      // localStorage.setItem("token", data.token);
      onClose();
    } catch (err: any) {
      console.error("Login error:", err);
      // Set error message to email field for simplicity, or general error
      setErrors({ email: err.message || "Login failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        style={{ animation: "loginFadeIn 0.3s ease" }}
      />

      {/* Modal */}
      <div
        className="relative rounded-2xl w-full max-w-md overflow-hidden"
        style={{
          animation: "loginSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          background: "linear-gradient(145deg, #FDF9F4 0%, #FAF6F0 100%)",
          boxShadow:
            "0 24px 80px rgba(139,94,60,0.12), 0 8px 24px rgba(139,94,60,0.06), 0 0 0 1px rgba(196,149,106,0.08)",
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
            background:
              "linear-gradient(to right, rgba(160,113,74,0.3), #A0714A, #8B5E3C, #A0714A, rgba(160,113,74,0.3))",
          }}
        />

        <div className="px-8 pt-8 pb-8 relative">
          {/* Warm corner glow */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
            aria-hidden="true"
          />

          {/* Logo */}
          <div className="text-center mb-6">
            <p
              className="tracking-[0.3em] text-primary mb-3"
              style={{ fontSize: "0.7rem" }}
            >
              SCENEW
            </p>
            <h2 style={{ fontSize: "1.35rem", lineHeight: 1.3 }}>
              {t("loginTitle")}
            </h2>
            <p
              className="text-muted-foreground mt-2"
              style={{ fontSize: "0.85rem", lineHeight: 1.6 }}
            >
              {t("loginSubtitle")}
            </p>
          </div>

          {/* Google login button */}
          <button
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl border border-border/80 bg-background hover:bg-muted/40 transition-all duration-300 hover:shadow-md hover:shadow-primary/[0.05] hover:border-primary/20 group"
            style={{ fontSize: "0.9rem" }}
            onClick={() => {
              alert("Google OAuth redirect...");
              onClose();
            }}
          >
            <GoogleIcon />
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              {t("loginGoogle")}
            </span>
          </button>

          {/* Divider "or" */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center">
              <span
                className="px-3 text-muted-foreground/60"
                style={{
                  fontSize: "0.75rem",
                  background: "linear-gradient(145deg, #FDF9F4 0%, #FAF6F0 100%)",
                }}
              >
                {t("loginOr")}
              </span>
            </div>
          </div>

          {/* Email login form */}
          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div>
              <label
                className="block mb-1.5 text-muted-foreground"
                style={{ fontSize: "0.78rem", letterSpacing: "0.05em" }}
              >
                {t("loginEmailLabel")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="email"
                  placeholder={t("loginEmailPlaceholder")}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-0 outline-none focus:ring-1 transition-all ${
                    errors.email
                      ? "ring-1 ring-red-300 bg-red-50/30"
                      : "focus:ring-primary/25"
                  }`}
                  style={{
                    fontSize: "0.88rem",
                    background: errors.email ? undefined : "rgba(237,229,216,0.3)",
                  }}
                />
              </div>
              {errors.email && (
                <p
                  className="flex items-center gap-1 mt-1.5 text-red-400"
                  style={{ fontSize: "0.72rem" }}
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                className="block mb-1.5 text-muted-foreground"
                style={{ fontSize: "0.78rem", letterSpacing: "0.05em" }}
              >
                {t("loginPasswordLabel")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("loginPasswordPlaceholder")}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                  }}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border-0 outline-none focus:ring-1 transition-all ${
                    errors.password
                      ? "ring-1 ring-red-300 bg-red-50/30"
                      : "focus:ring-primary/25"
                  }`}
                  style={{
                    fontSize: "0.88rem",
                    background: errors.password ? undefined : "rgba(237,229,216,0.3)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  className="flex items-center gap-1 mt-1.5 text-red-400"
                  style={{ fontSize: "0.72rem" }}
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl text-primary-foreground transition-all duration-300 hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                background: "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)",
                boxShadow: "0 4px 16px rgba(139,94,60,0.2)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ...
                </span>
              ) : (
                t("loginSubmit")
              )}
            </button>
          </form>

          {/* Switch to register */}
          <p
            className="text-center text-muted-foreground mt-4"
            style={{ fontSize: "0.82rem" }}
          >
            {t("loginNoAccount")}{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-primary hover:underline underline-offset-2 transition-colors"
            >
              {t("loginRegisterLink")}
            </button>
          </p>

          {/* Terms */}
          <p
            className="text-center text-muted-foreground/60 mt-4 px-4"
            style={{ fontSize: "0.68rem", lineHeight: 1.6 }}
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
        @keyframes loginFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes loginSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
