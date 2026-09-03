import { FallingPattern } from "@/components/ui/falling-pattern";

/**
 * Fixed ambient stage — falling pattern in brand orange + radial glows + vignette.
 * Sits behind the entire homepage; chapter cards sit on top with bg-card/95.
 */
export default function AmbientBackdrop() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-background" />

      {/* Falling pattern — brand orange, helderder gemaakt (dark:brightness
          uit het origineel werkt niet zonder .dark-class op deze site) */}
      <div className="absolute inset-0 brightness-[1.8]">
        <FallingPattern
          color="hsl(var(--primary))"
          backgroundColor="hsl(var(--background))"
          duration={200}
        />
      </div>

      {/* Radial primary glow — top */}
      <div
        className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[120%] h-[80%] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.18), transparent 60%)",
        }}
      />

      {/* Radial primary glow — bottom-left */}
      <div
        className="absolute -bottom-1/3 -left-1/4 w-[80%] h-[80%] rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 60%)",
        }}
      />

      {/* Vignette — houdt de randen donker en tekst leesbaar */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 15%, hsl(var(--background) / 0.88) 100%)",
        }}
      />
    </div>
  );
}
