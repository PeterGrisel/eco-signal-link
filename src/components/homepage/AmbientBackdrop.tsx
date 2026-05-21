import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background";

/**
 * Fixed ambient stage — fluid particles in brand orange + radial glows + vignette.
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

      {/* Fluid particles — brand orange #E8945A, low count for smooth scroll */}
      <div className="absolute inset-0 opacity-70">
        <FluidParticlesBackground
          particleCount={420}
          noiseIntensity={0.0025}
          particleSize={{ min: 0.4, max: 1.6 }}
          colorRgb="232,148,90"
          trailRgba="rgba(10, 10, 12, 0.18)"
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