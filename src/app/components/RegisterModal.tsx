import { useEffect, useRef, useState } from "react";
import { X, User, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useI18n } from "./I18nContext";
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: (email?: string, password?: string) => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { t } = useI18n();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
      setSuccess(false);
      setIsSubmitting(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePassword = (v: string) => v.length >= 8 && /[a-zA-Z]/.test(v) && /\d/.test(v);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!username.trim()) errs.username = t("registerErrUsername");
    if (!validateEmail(email)) errs.email = t("registerErrEmail");
    if (!validatePassword(password)) errs.password = t("registerErrPassword");
    if (password !== confirmPassword) errs.confirm = t("registerErrConfirm");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    
    // Call backend register API
    const handleRegister = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://120.24.150.216:8910";
        // User specified POST /auth/register
        // Removing /api prefix based on login assumption, but double check consistency.
        // Actually, if login failed with /api, maybe register also needs no /api?
        // Or maybe user just gave the router path.
        // Let's try /auth/register (without /api) to match the Login change.
        
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username, 
            email, 
            password 
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || data.error || "Registration failed");
        }

        setIsSubmitting(false);
        setSuccess(true);
        setTimeout(() => {
          onSwitchToLogin(email, password);
        }, 1800);
      } catch (err: any) {
        console.error("Register error:", err);
        setErrors({ email: err.message || "Registration failed" });
        setIsSubmitting(false);
      }
    };

    handleRegister();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        style={{ animation: "regFadeIn 0.3s ease" }}
      />

      <div
        className="relative rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          animation: "regSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          background: "linear-gradient(145deg, #FDF9F4 0%, #FAF6F0 100%)",
          boxShadow:
            "0 24px 80px rgba(139,94,60,0.12), 0 8px 24px rgba(139,94,60,0.06), 0 0 0 1px rgba(196,149,106,0.08)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all z-10"
          aria-label={t("loginClose")}
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="h-1.5"
          style={{
            background:
              "linear-gradient(to right, rgba(160,113,74,0.3), #A0714A, #8B5E3C, #A0714A, rgba(160,113,74,0.3))",
          }}
        />

        <div className="px-8 pt-8 pb-8 relative">
          <div
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
            aria-hidden="true"
          />

          {success ? (
            <div className="text-center py-10" style={{ animation: "regFadeIn 0.5s ease" }}>
              <div
                className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(52,168,83,0.12), rgba(52,168,83,0.06))",
                  animation: "regPulse 1.5s ease infinite",
                }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: "#34A853" }} />
              </div>
              <p style={{ fontSize: "1.1rem", color: "#34A853" }}>{t("registerSuccess")}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p
                  className="tracking-[0.3em] text-primary mb-3"
                  style={{ fontSize: "0.7rem" }}
                >
                  SCENEW
                </p>
                <h2 style={{ fontSize: "1.35rem", lineHeight: 1.3 }}>
                  {t("registerTitle")}
                </h2>
                <p
                  className="text-muted-foreground mt-2"
                  style={{ fontSize: "0.85rem", lineHeight: 1.6 }}
                >
                  {t("registerSubtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <label
                    className="block mb-1.5 text-muted-foreground"
                    style={{ fontSize: "0.78rem", letterSpacing: "0.05em" }}
                  >
                    {t("registerUsername")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                    <input
                      type="text"
                      placeholder={t("registerUsernamePlaceholder")}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) setErrors((p) => ({ ...p, username: "" }));
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-0 outline-none focus:ring-1 transition-all ${
                        errors.username ? "ring-1 ring-red-300 bg-red-50/30" : "focus:ring-primary/25"
                      }`}
                      style={{
                        fontSize: "0.88rem",
                        background: errors.username ? undefined : "rgba(237,229,216,0.3)",
                      }}
                    />
                  </div>
                  {errors.username && (
                    <p className="flex items-center gap-1 mt-1.5 text-red-400" style={{ fontSize: "0.72rem" }}>
                      <AlertCircle className="w-3 h-3" />
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block mb-1.5 text-muted-foreground"
                    style={{ fontSize: "0.78rem", letterSpacing: "0.05em" }}
                  >
                    {t("registerEmail")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                    <input
                      type="email"
                      placeholder={t("registerEmailPlaceholder")}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-0 outline-none focus:ring-1 transition-all ${
                        errors.email ? "ring-1 ring-red-300 bg-red-50/30" : "focus:ring-primary/25"
                      }`}
                      style={{
                        fontSize: "0.88rem",
                        background: errors.email ? undefined : "rgba(237,229,216,0.3)",
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="flex items-center gap-1 mt-1.5 text-red-400" style={{ fontSize: "0.72rem" }}>
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    className="block mb-1.5 text-muted-foreground"
                    style={{ fontSize: "0.78rem", letterSpacing: "0.05em" }}
                  >
                    {t("registerPassword")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("registerPasswordPlaceholder")}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                      }}
                      className={`w-full pl-10 pr-10 py-3 rounded-xl border-0 outline-none focus:ring-1 transition-all ${
                        errors.password ? "ring-1 ring-red-300 bg-red-50/30" : "focus:ring-primary/25"
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
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="flex items-center gap-1 mt-1.5 text-red-400" style={{ fontSize: "0.72rem" }}>
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    className="block mb-1.5 text-muted-foreground"
                    style={{ fontSize: "0.78rem", letterSpacing: "0.05em" }}
                  >
                    {t("registerConfirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder={t("registerConfirmPlaceholder")}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirm) setErrors((p) => ({ ...p, confirm: "" }));
                      }}
                      className={`w-full pl-10 pr-10 py-3 rounded-xl border-0 outline-none focus:ring-1 transition-all ${
                        errors.confirm ? "ring-1 ring-red-300 bg-red-50/30" : "focus:ring-primary/25"
                      }`}
                      style={{
                        fontSize: "0.88rem",
                        background: errors.confirm ? undefined : "rgba(237,229,216,0.3)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirm && (
                    <p className="flex items-center gap-1 mt-1.5 text-red-400" style={{ fontSize: "0.72rem" }}>
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirm}
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
                      <span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      />
                      ...
                    </span>
                  ) : (
                    t("registerSubmit")
                  )}
                </button>
              </form>

              {/* Switch to login */}
              <p
                className="text-center text-muted-foreground mt-5"
                style={{ fontSize: "0.82rem" }}
              >
                {t("registerHaveAccount")}{" "}
                <button
                  onClick={() => onSwitchToLogin()}
                  className="text-primary hover:underline underline-offset-2 transition-colors"
                >
                  {t("registerLoginLink")}
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
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes regFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes regSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes regPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
