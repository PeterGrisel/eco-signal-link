"use client";

import createGlobe, { type COBEOptions } from "cobe";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Standaardconfiguratie in de huisstijl: een donkere bol op de donkere
 * achtergrond, met het merkoranje (#E8945A) als markerkleur. De markers
 * volgen onze markt — de Benelux als thuisbasis, de rest van West-Europa
 * en Spanje eromheen.
 *
 * Let op: dit is cobe v2. Daar bestaat `onRender` niet meer en draait de bol
 * niet uit zichzelf; wie hem laat bewegen roept zelf `globe.update()` aan in
 * een requestAnimationFrame-lus. Voorbeelden die `onRender` in de opties
 * zetten, komen van v0.6 en tekenen op v2 één stilstaand frame.
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
    { location: [51.4416, 5.4697], size: 0.06 }, // Eindhoven
    { location: [53.2194, 6.5665], size: 0.05 }, // Groningen
    { location: [50.8503, 4.3517], size: 0.07 }, // Brussel
    { location: [51.2194, 4.4025], size: 0.05 }, // Antwerpen
    { location: [51.5074, -0.1278], size: 0.06 }, // Londen
    { location: [48.8566, 2.3522], size: 0.06 }, // Parijs
    { location: [52.52, 13.405], size: 0.06 }, // Berlijn
    { location: [45.4642, 9.19], size: 0.05 }, // Milaan
    { location: [40.4168, -3.7038], size: 0.07 }, // Madrid
    { location: [41.3874, 2.1686], size: 0.05 }, // Barcelona
  ],
};

/** Zo staat West-Europa meteen naar de kijker toe in plaats van de Stille Oceaan. */
const START_PHI = 4.6;
/** Radialen per frame; op 60fps een rondje in ongeveer veertig seconden. */
const AUTO_ROTATIE = 0.0025;

/**
 * De bol wordt opnieuw opgebouwd als `config` van identiteit verandert, dus
 * geef een stabiele constante mee (of memoiseer hem) en geen inline object.
 */
export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: Omit<COBEOptions, "width" | "height">;
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
    frame = requestAnimationFrame(teken);

    const fadeIn = window.setTimeout(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(frame);
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

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
    >
      <canvas
        className="size-full cursor-grab opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) => startSlepen(e.clientX)}
        onPointerUp={stopSlepen}
        onPointerOut={stopSlepen}
        onPointerMove={(e) => sleepNaar(e.clientX)}
        onTouchMove={(e) => e.touches[0] && sleepNaar(e.touches[0].clientX)}
      />
    </div>
  );
}
