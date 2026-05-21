import { ReactNode } from "react";

/**
 * Cinematic sticky background — gradient + grid + radial glows.
 * Content scrolls over it via negative margin / z-stacking.
 */
export default function StickyAmbientStage({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Sticky background layer */}
      <div
        aria-hidden
        className="sticky top-0 h-screen w-full pointer-events-none z-0 overflow-hidden"
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        {/* Radial primary glow — top */}
        <div
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[120%] h-[80%] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.25), transparent 60%)",
          }}
        />

        {/* Radial primary glow — bottom */}
        <div
          className="absolute -bottom-1/3 left-1/4 w-[60%] h-[60%] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.2), transparent 60%)",
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.85) 100%)",
          }}
        />
      </div>

      {/* Content overlay — pulls back over sticky bg */}
      <div className="relative z-10 -mt-screen" style={{ marginTop: "-100vh" }}>
        {children}
      </div>
    </div>
  );
}