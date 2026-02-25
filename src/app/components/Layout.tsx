import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { ParticleBackground } from "./ParticleBackground";
import { FooterSection } from "./FooterSection";
import { NoiseOverlay } from "./WarmGlow";

export function Layout() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <NoiseOverlay />
      <ParticleBackground />
      <Navbar />
      <Outlet />
      <FooterSection />
    </div>
  );
}
