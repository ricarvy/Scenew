import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { X, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useI18n } from "./I18nContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  initialEmail?: string;
  initialPassword?: string;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister, initialEmail, initialPassword }: LoginModalProps) {
  const { t, login } = useI18n();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState(initialEmail || "");
  const [password, setPassword] = useState(initialPassword || "");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (initialEmail) setEmail(initialEmail);
      else setEmail("");

      if (initialPassword) setPassword(initialPassword);
      else setPassword("");

      setErrors({});
      setIsSubmitting(false);
      setShowPassword(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialEmail, initialPassword]);

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
      // Use API_BASE if available, otherwise use proxy
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      // Use /auth/login directly as defined in backend openapi.json
      const loginUrl = API_BASE ? `${API_BASE}/auth/login` : "/auth/login";
      
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response data:", data);

      if (!res.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }

      // Save token (check common fields)
      const token = data.token || data.access_token || data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token saved to localStorage:", token.substring(0, 10) + "...");
      } else {
        console.error("Login successful but no token found in response:", data);
      }

      // Update global user state
      // Assuming backend returns user info like { id, email, username, avatar? }
      // If not, use email as username fallback
      login({
        id: data.id || data.user_id,
        username: data.username || email.split('@')[0],
        email: email,
        avatar: data.avatar,
        credits: data.points
      });

      // alert(t("loginSuccess") || "Login successful!"); // Removed ugly alert
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

          {/* Google Login */}
          <button
            type="button"
            onClick={() => {
              const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
              window.location.href = `${API_BASE}/auth/login/google`;
            }}
            className="w-full py-3 rounded-xl border border-[#dadce0] bg-white flex items-center justify-center gap-3 transition-all hover:bg-gray-50 hover:shadow-sm"
            style={{ fontSize: "0.88rem" }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {t("loginGoogle")}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[#e0d6ca]" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{t("loginOr")}</span>
            <div className="flex-1 h-px bg-[#e0d6ca]" />
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
            <button onClick={() => navigate("/terms")} className="text-primary underline underline-offset-2">
              {t("loginTermsLink")}
            </button>{" "}
            {t("loginAnd")}{" "}
            <button onClick={() => navigate("/privacy")} className="text-primary underline underline-offset-2">
              {t("loginPrivacy")}
            </button>
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
