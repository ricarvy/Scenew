import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { useI18n, Lang } from "./I18nContext";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { label: t("navHow"), href: "#how-it-works" },
    { label: t("navShowcase"), href: "#showcase" },
    { label: t("navFeatures"), href: "#features" },
    { label: t("navPricing"), href: "/pricing" },
    { label: t("navTry"), href: "/try" },
  ];

  const langOptions: { code: Lang; label: string; flag: string }[] = [
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ];

  const switchLang = (code: Lang) => {
    setLang(code);
    setLangOpen(false);
  };

  const handleSwitchToRegister = () => {
    setLoginOpen(false);
    // Small delay so the close animation finishes before opening the new one
    setTimeout(() => setRegisterOpen(true), 150);
  };

  const handleSwitchToLogin = () => {
    setRegisterOpen(false);
    setTimeout(() => setLoginOpen(true), 150);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl border-b py-3"
            : "bg-transparent py-5"
        }`}
        style={scrolled ? {
          background: "rgba(250,246,240,0.82)",
          borderColor: "rgba(196,149,106,0.08)",
        } : undefined}
        aria-label={lang === "zh" ? "主导航" : "Main navigation"}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a
            href="#"
            className="tracking-[0.25em]"
            style={{
              fontSize: "0.85rem",
              background: "linear-gradient(135deg, #8B5E3C, #A0714A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            SCENEW
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.href.startsWith("/")) {
                    navigate(item.href);
                  } else if (item.href.startsWith("#")) {
                    if (location.pathname !== "/") {
                      navigate("/" + item.href);
                    } else {
                      const el = document.getElementById(item.href.slice(1));
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                {item.label}
              </a>
            ))}

            {/* Language switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50"
                style={{ fontSize: "0.78rem" }}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{t("langLabel")}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                />
              </button>

              {langOpen && (
                <div
                  className="absolute top-full right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-lg shadow-black/8 overflow-hidden min-w-[140px]"
                  style={{ animation: "navDropIn 0.2s ease" }}
                >
                  {langOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => switchLang(opt.code)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors ${
                        lang === opt.code
                          ? "bg-primary/8 text-foreground"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      }`}
                      style={{ fontSize: "0.82rem" }}
                    >
                      <span style={{ fontSize: "1rem" }}>{opt.flag}</span>
                      <span>{opt.label}</span>
                      {lang === opt.code && (
                        <span className="ml-auto text-primary" style={{ fontSize: "0.7rem" }}>
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setLoginOpen(true)}
              className="px-5 py-2 text-primary-foreground rounded-full hover:opacity-90 transition-all duration-300"
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.05em",
                background: "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)",
                boxShadow: "0 4px 16px rgba(139,94,60,0.2)",
              }}
            >
              {t("navLogin")}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: "0.9rem" }}
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  if (item.href.startsWith("/")) {
                    navigate(item.href);
                  } else if (item.href.startsWith("#")) {
                    if (location.pathname !== "/") {
                      navigate("/" + item.href);
                    } else {
                      const el = document.getElementById(item.href.slice(1));
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                {item.label}
              </a>
            ))}

            {/* Mobile language switch */}
            <div className="flex gap-2 pt-2">
              {langOptions.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => switchLang(opt.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                    lang === opt.code
                      ? "bg-primary/10 text-foreground border border-primary/20"
                      : "bg-muted/40 text-muted-foreground"
                  }`}
                  style={{ fontSize: "0.78rem" }}
                >
                  <span>{opt.flag}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setMenuOpen(false);
                setLoginOpen(true);
              }}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-full mt-2"
              style={{ fontSize: "0.85rem" }}
            >
              {t("navLogin")}
            </button>
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <style>{`
        @keyframes navDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
