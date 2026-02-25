/**
 * Reusable warm ambient glow orbs + gradient dividers
 */

interface GlowOrbProps {
  className?: string;
  color?: string;
  size?: string;
  blur?: string;
  opacity?: number;
}

export function GlowOrb({
  className = "",
  color = "rgba(196, 149, 106, 0.18)",
  size = "500px",
  blur = "120px",
  opacity = 1,
}: GlowOrbProps) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur})`,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}

export function GradientDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className="relative z-10 h-px w-full overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: flip
            ? "linear-gradient(to right, transparent, rgba(196,149,106,0.25) 30%, rgba(212,165,116,0.4) 50%, rgba(196,149,106,0.25) 70%, transparent)"
            : "linear-gradient(to right, transparent, rgba(184,154,125,0.2) 25%, rgba(196,149,106,0.35) 50%, rgba(184,154,125,0.2) 75%, transparent)",
        }}
      />
    </div>
  );
}

export function SectionGlow({
  position = "center",
}: {
  position?: "left" | "center" | "right";
}) {
  const posClass =
    position === "left"
      ? "-left-64 top-1/2 -translate-y-1/2"
      : position === "right"
        ? "-right-64 top-1/2 -translate-y-1/2"
        : "left-1/2 -translate-x-1/2 top-0";

  return (
    <div
      className={`absolute ${posClass} w-[600px] h-[600px] rounded-full pointer-events-none`}
      style={{
        background:
          "radial-gradient(circle, rgba(196,149,106,0.08) 0%, rgba(212,165,116,0.04) 40%, transparent 70%)",
        filter: "blur(80px)",
      }}
      aria-hidden="true"
    />
  );
}

export function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
      aria-hidden="true"
    />
  );
}
