import { useEffect, useState, useRef } from "react";
import { X, Sparkles, Heart } from "lucide-react";
import { useI18n } from "./I18nContext";
import { toast } from "sonner";
import gsap from "gsap";

export function WomenDayModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  
  // Confident women portraits (Unsplash source for demo)
  const portraits = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop", // Professional Black Woman
    "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=600&auto=format&fit=crop", // Confident Asian Woman
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop", // Smiling White Woman
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop", // Fashion Portrait
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&auto=format&fit=crop", // Outdoor Joy
  ];

  const [currentPortraitIndex, setCurrentPortraitIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    
    // Auto-flip portraits every 3 seconds
    const interval = setInterval(() => {
      setCurrentPortraitIndex(prev => (prev + 1) % portraits.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    // Check if user has seen the modal today
    const seenDate = localStorage.getItem("scenew_womenday_seen");
    const today = new Date().toDateString();

    if (seenDate !== today) {
      // Small delay for entrance animation
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Mouse trail effect
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = modal.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Move cursor
      gsap.to(cursorRef.current, {
        x,
        y,
        duration: 0.1,
        ease: "power2.out"
      });

      // Create trail particle
      const particle = document.createElement("div");
      // Use different shades of pink/gold for variety
      const colors = ["#E8C3BA", "#F472B6", "#D4AF37", "#FFFFFF"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      particle.className = "absolute rounded-full pointer-events-none z-50 mix-blend-screen";
      particle.style.backgroundColor = randomColor;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${Math.random() * 4 + 2}px`; // Random size 2-6px
      particle.style.height = particle.style.width;
      particle.style.filter = "blur(0.5px)";
      particle.style.boxShadow = `0 0 4px ${randomColor}`; // Glow effect
      
      trailRef.current?.appendChild(particle);

      // Animate trail
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 60, // Wider spread
        y: (Math.random() - 0.5) * 60,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    };

    const handleMouseEnter = () => {
      gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      modal.style.cursor = "none";
    };

    const handleMouseLeave = () => {
      gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
      modal.style.cursor = "default";
    };

    modal.addEventListener("mousemove", handleMouseMove);
    modal.addEventListener("mouseenter", handleMouseEnter);
    modal.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      modal.removeEventListener("mousemove", handleMouseMove);
      modal.removeEventListener("mouseenter", handleMouseEnter);
      modal.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("scenew_womenday_seen", new Date().toDateString());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("MUSE38");
    toast.success(lang === "zh" ? "邀请码 MUSE38 已复制" : "Code MUSE38 copied");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.5s ease-out" }}
      />

      {/* Modal Content - Dreamy Style */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-[380px] bg-[#FAF6F0] rounded-[2rem] overflow-hidden transform transition-all duration-500 group"
        style={{
          boxShadow: "0 25px 60px -12px rgba(92, 61, 36, 0.4), 0 0 0 1px rgba(255,255,255,0.4), inset 0 0 40px rgba(232, 195, 186, 0.2)",
          animation: "modalFloat 6s ease-in-out infinite alternate"
        }}
      >
        {/* Custom Star Cursor */}
        <div 
          ref={cursorRef}
          className="absolute w-6 h-6 pointer-events-none z-[60] opacity-0 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        >
          <Sparkles className="w-full h-full text-[#D4AF37] fill-[#D4AF37]" />
        </div>
        
        {/* Trail Container */}
        <div ref={trailRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-30 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 text-[#5C3D24] hover:scale-110 border border-white/30"
          style={{ cursor: "pointer" }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dreamy Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
           {/* Moving Aurora */}
           <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-[#E8C3BA]/20 via-[#D4AF37]/10 to-[#FAF6F0]/5 blur-[80px] animate-[aurora_10s_linear_infinite]" />
           
           {/* Floating Bubbles */}
           {[...Array(6)].map((_, i) => (
             <div 
               key={i}
               className="absolute rounded-full mix-blend-overlay animate-[floatBubble_8s_ease-in-out_infinite]"
               style={{
                 width: Math.random() * 60 + 20 + 'px',
                 height: Math.random() * 60 + 20 + 'px',
                 left: Math.random() * 100 + '%',
                 top: Math.random() * 100 + '%',
                 background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(${212 + Math.random()*40}, 175, 55, 0.1))`,
                 animationDelay: Math.random() * 5 + 's',
                 animationDuration: Math.random() * 10 + 10 + 's'
               }}
             />
           ))}
        </div>

        {/* Central "Mirror" Element - 3D Flip Card */}
        <div className="relative h-64 w-full flex items-center justify-center mt-6 perspective-1000">
           <div 
             className="w-40 h-56 relative preserve-3d transition-transform duration-1000"
             style={{
               transformStyle: "preserve-3d",
               // Use key prop to trigger re-render animation, or just animate rotation
             }}
           >
             {/* We use a swiper-like effect or just cross-fade inside the mirror frame? 
                 The user asked for "flip". A true 3D flip usually shows the back.
                 But here we want to show different photos.
                 Let's implement a card that flips 180deg to show the next photo.
             */}
             <div 
               className="w-full h-full rounded-[40%] border-4 border-white/40 relative backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.3)] overflow-hidden"
               style={{
                 borderRadius: "50% 50% 0 0 / 40% 40% 0 0", // Arch shape
                 transform: "translateZ(0)", // Fix for Safari overflow
               }}
             >
                {/* Photo Container with Flip Animation */}
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{
                     // We toggle a class or style to flip?
                     // Actually, let's just use a simple transition between two layers or a keyframe flip
                  }}
                >
                  {portraits.map((src, idx) => (
                    <div
                      key={src}
                      className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out backface-hidden"
                      style={{
                        opacity: idx === currentPortraitIndex ? 1 : 0,
                        transform: idx === currentPortraitIndex 
                          ? "rotateY(0deg) scale(1)" 
                          : idx < currentPortraitIndex ? "rotateY(-180deg) scale(0.8)" : "rotateY(180deg) scale(0.8)",
                        zIndex: idx === currentPortraitIndex ? 10 : 0,
                        backfaceVisibility: "hidden" 
                      }}
                    >
                      <img 
                        src={src} 
                        alt="Confident Woman" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#5C3D24]/60 to-transparent mix-blend-multiply" />
                    </div>
                  ))}
                </div>

                {/* Mirror Surface Overlay (Gloss) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 pointer-events-none z-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[200%] h-full -skew-x-12 animate-[shimmer_4s_infinite] pointer-events-none z-20 mix-blend-overlay" />
                
                {/* Frame Border Glow */}
                <div className="absolute inset-0 rounded-[inherit] border border-[#D4AF37]/30 pointer-events-none z-30" />
             </div>
             
             {/* Decorative Frame Elements */}
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[120%] h-4 bg-[#FAF6F0] blur-md z-[-1]" />
           </div>
        </div>

        {/* Content Body */}
        <div className="px-8 pb-10 relative z-10 text-center">
          {/* Title */}
          <div className="mb-6 relative">
             <h2 className="text-3xl font-serif text-[#5C3D24] mb-1 leading-none tracking-tight">
              {lang === "zh" ? "不被定义" : "Define Your"}
            </h2>
            <h2 className="text-3xl font-serif text-[#5C3D24] italic font-light tracking-wide">
              {lang === "zh" ? "自成风景" : "Own Scenery"}
            </h2>
            <p className="text-[9px] tracking-[0.4em] text-[#A0714A] uppercase mt-3 font-medium opacity-80">
              3.8 Women's Day
            </p>
          </div>

          {/* Message */}
          <p className="text-[#5C3D24]/70 text-xs leading-loose font-light mb-8 max-w-[280px] mx-auto">
            {lang === "zh" 
              ? "生活不是为了取悦世界，而是为了庆祝自己。送你一把开启平行世界的钥匙。" 
              : "Life is a celebration of yourself. Here is a key to your parallel world."}
          </p>

          {/* Hidden Code Button */}
          <button
            onClick={handleCopy}
            className="group/btn relative w-full py-4 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#A0714A]/20 active:scale-[0.98]"
            style={{ cursor: "none" }} // Ensure custom cursor works here too
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#A0714A] via-[#8B5E3C] to-[#A0714A] bg-[length:200%_100%] animate-[gradientFlow_3s_linear_infinite]" />
            
            <div className="relative flex items-center justify-center gap-2 text-white">
              <Heart className="w-4 h-4 fill-white/20 animate-bounce" />
              <span className="text-sm font-medium tracking-widest">
                {lang === "zh" ? "领取节日限定礼遇" : "Claim Your Gift"}
              </span>
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
        @keyframes aurora {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatBubble {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        @keyframes gradientFlow {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}
