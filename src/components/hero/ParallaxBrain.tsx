import SplineBrain from "./SplineBrain";
import ClientOrbit from "./ClientOrbit";

/**
 * Sticky page-wide stage: brain + client orbit fixed-centered behind all content.
 * No parallax — pure background canvas. Pointer-events disabled.
 */
export default function ParallaxBrain() {
  return (
    <div aria-hidden className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Radial orbit behind brain — pre-blurred so glass cards stay performant */}
      <div className="absolute inset-0 flex items-center justify-center opacity-50 blur-[2px]">
        <ClientOrbit />
      </div>
      {/* Brain on top of orbit */}
      <SplineBrain className="absolute inset-0" />
    </div>
  );
}
