import SplineBrain from "./SplineBrain";
import ClientOrbit from "./ClientOrbit";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Sticky page-wide stage: brain + client orbit fixed-centered behind all content.
 * No parallax — pure background canvas. Pointer-events disabled.
 */
export default function ParallaxBrain() {
  const isMobile = useIsMobile();

  return (
    <div aria-hidden className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Radial orbit behind brain — pre-blurred so glass cards stay performant */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25 blur-[1px] scale-75 md:opacity-50 md:blur-[2px] md:scale-100">
        <ClientOrbit rings={isMobile ? 2 : 2} baseSize={isMobile ? 12 : 22} gap={isMobile ? 6 : 14} />
      </div>
      {/* Brain on top of orbit */}
      <SplineBrain className="absolute inset-0" />
    </div>
  );
}
