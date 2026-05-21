import SplineBrain from "./SplineBrain";
import ClientOrbit from "./ClientOrbit";

/**
 * Sticky page-wide stage: brain + client orbit fixed-centered behind all content.
 * No parallax — pure background canvas. Pointer-events disabled.
 */
export default function ParallaxBrain() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Radial orbit behind brain */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <ClientOrbit />
      </div>
      {/* Brain on top of orbit */}
      <SplineBrain className="absolute inset-0" />
      {/* Soft vignette so content cards read clearly */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.55)_75%,hsl(var(--background)/0.85)_100%)]" />
    </div>
  );
}
