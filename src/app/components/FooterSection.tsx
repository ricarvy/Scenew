import { Github, Twitter, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import { useI18n } from "./I18nContext";

export function FooterSection() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const footerLinks = [
    { label: t("footerProduct"), href: "#" },
    { label: t("footerPricing"), href: "/pricing" },
    { label: t("footerBlog"), href: "#" },
    { label: t("footerAbout"), href: "#" },
  ];

  return (
    <footer className="relative z-10 overflow-hidden">
      {/* Warm gradient top accent */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent 5%, rgba(196,149,106,0.25) 30%, rgba(212,165,116,0.4) 50%, rgba(196,149,106,0.25) 70%, transparent 95%)",
        }}
      />

      <div
        className="py-20 px-6 relative"
        style={{
          background:
            "linear-gradient(180deg, rgba(237,229,216,0.12) 0%, transparent 60%)",
        }}
      >
        {/* Subtle warm glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(196,149,106,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p
                className="tracking-[0.2em] mb-2"
                style={{
                  fontSize: "0.9rem",
                  background:
                    "linear-gradient(135deg, #8B5E3C, #A0714A, #8B5E3C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SCENEW
              </p>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.8rem" }}
              >
                {t("footerSlogan")}
              </p>
            </div>

            <nav className="flex gap-8" aria-label="Footer navigation">
              {footerLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  style={{ fontSize: "0.85rem" }}
                  onClick={(e) => {
                    if (item.href.startsWith("/")) {
                      e.preventDefault();
                      navigate(item.href);
                    }
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex gap-3">
              {[
                { icon: Github, label: "Github" },
                { icon: Twitter, label: "Twitter" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 group"
                  style={{
                    background: "rgba(237,229,216,0.5)",
                  }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 text-center relative">
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(196,149,106,0.12), transparent)",
              }}
            />
            <p
              className="text-muted-foreground/50"
              style={{ fontSize: "0.75rem" }}
            >
              {t("footerCopyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}