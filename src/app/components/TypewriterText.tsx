import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";

interface TypewriterTextProps {
  text: string;
  typeSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  typeSpeed = 50,
  className = "",
  style,
  as: Tag = "span",
  showCursor = true,
  onComplete,
}: TypewriterTextProps) {
  const elRef = useRef<HTMLElement>(null);
  const typedRef = useRef<Typed | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!elRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          // Small delay so it feels intentional
          setTimeout(() => {
            if (elRef.current) {
              typedRef.current = new Typed(elRef.current, {
                strings: [text],
                typeSpeed,
                showCursor,
                cursorChar: "|",
                onComplete: () => {
                  onComplete?.();
                  // Hide cursor after completion with a delay
                  setTimeout(() => {
                    if (elRef.current) {
                      const cursor =
                        elRef.current.parentElement?.querySelector(
                          ".typed-cursor"
                        );
                      if (cursor) {
                        (cursor as HTMLElement).style.opacity = "0";
                        (cursor as HTMLElement).style.transition =
                          "opacity 0.5s";
                      }
                    }
                  }, 1200);
                },
              });
            }
          }, 200);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(elRef.current);

    return () => {
      observer.disconnect();
      typedRef.current?.destroy();
    };
  }, [text, hasTriggered]);

  // Reset when text changes (e.g. language switch)
  useEffect(() => {
    if (hasTriggered && typedRef.current) {
      typedRef.current.destroy();
      setHasTriggered(false);
    }
  }, [text]);

  return (
    <Tag className={className} style={style}>
      <span ref={elRef as any} />
    </Tag>
  );
}
