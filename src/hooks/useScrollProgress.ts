import { useEffect, useRef, useState } from "react";

/**
 * Voortgang van 0 tot 1 terwijl een element langs de viewport scrollt.
 *
 * 0 zodra de bovenkant van het element de bovenkant van de viewport raakt,
 * 1 zodra de onderkant dat doet. Bedoeld voor een hoge "track" met een sticky
 * kind erin: de pagina blijft gewoon scrollen, wij lezen alleen de stand af.
 *
 * Bij `prefers-reduced-motion` blijft de waarde op 1 staan, zodat de eindstaat
 * meteen zichtbaar is en er niets beweegt.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const meet = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const loop = rect.height - window.innerHeight;
      if (loop <= 0) {
        setProgress(1);
        return;
      }
      const p = Math.min(1, Math.max(0, -rect.top / loop));
      setProgress(p);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(meet);
    };

    meet();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}

/** Hersschaalt `p` van het bereik [a, b] naar [0, 1] en klemt af. */
export function fase(p: number, a: number, b: number) {
  if (b <= a) return p >= b ? 1 : 0;
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}
