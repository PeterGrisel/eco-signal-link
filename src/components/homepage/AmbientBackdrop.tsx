/**
 * Fixed ambient stage layer — static dotted grid + radial primary glows + vignette.
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

      {/* Static dotted grid — avoids canvas repaint stutter while keeping the AI Fctry texture */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--primary) / 0.42) 1px, transparent 1.5px)",
          backgroundSize: "12px 12px",
          maskImage: "radial-gradient(ellipse at center, black 18%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 18%, transparent 78%)",
        }}
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