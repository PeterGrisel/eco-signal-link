import FlickeringGrid from "./FlickeringGrid";

/**
 * Fixed ambient stage layer — flickering canvas grid + radial primary glows + vignette.
 * Sits behind the entire homepage, content scrolls over it.
 */
export default function AmbientBackdrop() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-background" />

      {/* Flickering grid */}
      <FlickeringGrid
        squareSize={3}
        gridGap={8}
        flickerChance={0.25}
        maxOpacity={0.18}
        color="232,148,90"
        className="opacity-60"
      />

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

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, hsl(var(--background) / 0.85) 100%)",
        }}
      />
    </div>
  );
}