import React, { useRef, useEffect, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface FrostedGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  borderColor?: string;
  background?: string;
  style?: CSSProperties;
}

export const FrostedGlassCard: React.FC<FrostedGlassCardProps> = ({
  children,
  className,
  glareColor = "rgba(255, 255, 255, 0.25)",
  borderColor = "rgba(255, 255, 255, 0.18)",
  background = "rgba(255, 255, 255, 0.08)",
  style,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 6;
      const rotateX = ((y - centerY) / centerY) * -6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div style={{ perspective: "1000px" }} className="relative">
      <div
        ref={cardRef}
        className={cn(
          "relative rounded-3xl overflow-hidden transition-transform duration-200 ease-out will-change-transform",
          className
        )}
        style={{
          background,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${borderColor}`,
          boxShadow:
            "0 25px 60px -20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
          ...style,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glareColor}, transparent 40%)`,
            mixBlendMode: "overlay",
          }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};
