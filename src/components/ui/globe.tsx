import createGlobe, { type COBEOptions } from "cobe";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Standaardconfiguratie in de huisstijl: een donkere bol op de donkere
 * achtergrond, met het merkoranje (#E8945A) als markerkleur. De markers
 * lopen van de thuisbasis in de Benelux naar de steden waar we verder werken.
 *
 * Let op: dit is cobe v2. Daar bestaat `onRender` niet meer in COBEOptions en
 * heeft createGlobe geen eigen animatielus — hij tekent één frame bij het
 * aanmaken en daarna alleen bij `globe.update()`. Voorbeelden die de rotatie
 * via `onRender` regelen komen van v0.6 en leveren op v2 een stilstaande bol.
 */
export const GLOBE_CONFIG: Omit<COBEOptions, "width" | "height"> = {
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.28,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 5,
  baseColor: [0.36, 0.33, 0.3],
  markerColor: [232 / 255, 148 / 255, 90 / 255],
  glowColor: [0.55, 0.35, 0.22],
  markers: [
    { location: [52.3676, 4.9041], size: 0.1 }, // Amsterdam
    { location: [51.9244, 4.4777], size: 0.07 }, // Rotterdam
    { location: [50.8503, 4.3517], size: 0.06 }, // Brussel
    { location: [51.5074, -0.1278], size: 0.08 }, // Londen
    { location: [48.8566, 2.3522], size: 0.07 }, // Parijs
    { location: [52.52, 13.405], size: 0.07 }, // Berlijn
    { location: [40.4168, -3.7038], size: 0.06 }, // Madrid
    { location: [40.7128, -74.006], size: 0.09 }, // New York
    { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
    { location: [1.3521, 103.8198], size: 0.06 }, // Singapore
    { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
  ],
};

/** Zo staat West-Europa meteen naar de kijker toe in plaats van de Stille Oceaan. */
const START_PHI = 4.6;
/** Radialen per frame; op 60fps een rondje in ongeveer veertig seconden. */
const AUTO_ROTATIE = 0.0025;

/**
 * Draaiende wereldbol, sleepbaar met de muis.
 *
 * Vult de breedte van zijn ouder en houdt zichzelf vierkant, dus zet hem in
 * een container met een eigen breedte of geef er een `max-w-` aan mee.
 *
 * De bol wordt opnieuw opgebouwd als `config` van identiteit verandert, dus
 * geef een stabiele constante mee (of memoiseer hem) en geen inline object.
 */
export function Globe({
  className,
  config = GLOBE_CONFIG,
  interactief = true,
}: {
  className?: string;
  config?: Omit<COBEOptions, "width" | "height">;
  /** Uit voor decoratief gebruik: geen sleep, en klikken gaan er doorheen. */
  interactief?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Alles wat per frame verandert staat in een ref. Met state zou elke
  // muisbeweging een rerender uitlokken, en zou de animatielus bovendien de
  // waarde vasthouden die hij bij het opstarten zag.
  const phi = useRef(START_PHI);
  const breedte = useRef(0);
  const rotatieOffset = useRef(0);
  const sleepStartX = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const meetBreedte = () => {
      breedte.current = canvas.offsetWidth;
    };
    meetBreedte();
    window.addEventListener("resize", meetBreedte);

    const globe = createGlobe(canvas, {
      ...config,
      phi: START_PHI,
      width: breedte.current,
      height: breedte.current,
    });

    // Wie beweging heeft uitgezet, krijgt een stilstaande bol.
    const stilzetten = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    const teken = () => {
      if (sleepStartX.current === null && !stilzetten) phi.current += AUTO_ROTATIE;
      globe.update({
        phi: phi.current + rotatieOffset.current,
        width: breedte.current,
        height: breedte.current,
      });
      frame = requestAnimationFrame(teken);
    };

    // Een WebGL-lus die buiten beeld doortelt is verspilde rekentijd, en op de
    // homepage staat de bol ver onder de vouw. Alleen tekenen als hij te zien is.
    const kijker = new IntersectionObserver(
      ([item]) => {
        if (item.isIntersecting && !frame) {
          frame = requestAnimationFrame(teken);
        } else if (!item.isIntersecting && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "200px" },
    );
    kijker.observe(canvas);

    const fadeIn = window.setTimeout(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      kijker.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(fadeIn);
      window.removeEventListener("resize", meetBreedte);
      globe.destroy();
    };
  }, [config]);

  const startSlepen = (clientX: number) => {
    sleepStartX.current = clientX - rotatieOffset.current * 200;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  };

  const stopSlepen = () => {
    sleepStartX.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  };

  const sleepNaar = (clientX: number) => {
    if (sleepStartX.current === null) return;
    rotatieOffset.current = (clientX - sleepStartX.current) / 200;
  };

  const sleepHandlers = interactief
    ? {
        onPointerDown: (e: React.PointerEvent) => startSlepen(e.clientX),
        onPointerUp: stopSlepen,
        onPointerOut: stopSlepen,
        onPointerMove: (e: React.PointerEvent) => sleepNaar(e.clientX),
        onTouchMove: (e: React.TouchEvent) =>
          e.touches[0] && sleepNaar(e.touches[0].clientX),
      }
    : {};

  return (
    <div
      className={cn(
        "mx-auto aspect-square w-full max-w-[600px]",
        !interactief && "pointer-events-none",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-700 [contain:layout_paint_size]",
          interactief && "cursor-grab",
        )}
        ref={canvasRef}
        aria-hidden={!interactief}
        {...sleepHandlers}
      />
    </div>
  );
}
