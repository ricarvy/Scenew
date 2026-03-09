import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Menu, X, ChevronDown, Globe, User, Image as ImageIcon } from "lucide-react";
import { useI18n, Lang } from "./I18nContext";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";
import { ProfileModal } from "./ProfileModal";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  // const [loginOpen, setLoginOpen] = useState(false); // Moved to Context
  // const [registerOpen, setRegisterOpen] = useState(false); // Moved to Context
  const [profileOpen, setProfileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { 
    lang, 
    setLang, 
    t, 
    user, 
    logout, 
    isLoginOpen: loginOpen, 
    setLoginOpen, 
    isRegisterOpen: registerOpen, 
    setRegisterOpen 
  } = useI18n();
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

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { label: t("navHow"), href: "#how-it-works" },
    { label: t("navShowcase"), href: "#showcase" },
    { label: t("navFeatures"), href: "#features" },
    { label: t("navBlog"), href: "/blog" },
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

  const handleSwitchToLogin = (email?: string, password?: string) => {
    setRegisterOpen(false);
    setTimeout(() => {
      setLoginOpen(true);
      // We'll pass these props to LoginModal if it supports them, or store in state/ref
      // But LoginModal is controlled. We should modify LoginModal to accept initial values.
      // For now, let's just pass them as props to LoginModal component.
      // We need to update LoginModal interface first.
      if (email && password) {
        // A simple way is to use a ref or state in Navbar to pass to LoginModal
        setInitialLoginCredentials({ email, password });
      }
    }, 150);
  };

  const [initialLoginCredentials, setInitialLoginCredentials] = useState<{email?: string, password?: string}>({});

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

          {/* Desktop nav - Centered */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-7">
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
          </div>

          {/* Right side: Lang + Auth */}
          <div className="hidden md:flex items-center gap-4 flex-shrink min-w-0">
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

            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate hidden md:block">
                    {user.username}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-lg shadow-black/8 overflow-hidden py-1"
                    style={{ animation: "navDropIn 0.2s ease" }}
                  >
                    <div className="px-4 py-3 border-b border-border/50 md:hidden">
                      <p className="font-medium text-sm truncate">{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/generations");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      {t("navGenerations")}
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      {t("navProfile")}
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50/50 transition-colors flex items-center gap-2"
                    >
                      {t("navLogout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
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
            )}
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
            {user && (
              <div className="flex flex-col gap-4 pb-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-lg overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                {/* Mobile User Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/generations");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors text-sm"
                  >
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    {t("navGenerations")}
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setProfileOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors text-sm"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    {t("navProfile")}
                  </button>
                </div>
              </div>
            )}
            
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
                if (user) {
                  logout();
                } else {
                  setLoginOpen(true);
                }
              }}
              className={`w-full py-2.5 rounded-full mt-2 transition-colors ${
                user 
                  ? "bg-red-50 text-red-500 hover:bg-red-100" 
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
              style={{ fontSize: "0.85rem" }}
            >
              {user ? t("navLogout") : t("navLogin")}
            </button>
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          setInitialLoginCredentials({});
        }}
        onSwitchToRegister={handleSwitchToRegister}
        initialEmail={initialLoginCredentials.email}
        initialPassword={initialLoginCredentials.password}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <ProfileModal 
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
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