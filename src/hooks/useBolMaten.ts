import { useEffect, useState } from "react";

/**
 * Maten voor de klantenbol, afhankelijk van de schermbreedte.
 *
 * Stond eerst los op `/klanten` en nog eens op de homepage, waar de tweede
 * versie een grotere bol in een kleinere doos zette: de tegels liepen daardoor
 * over elkaar heen en buiten het kader. Beide pagina's rekenen nu hiermee, dus
 * een volgende aanpassing landt op één plek.
 *
 * Er zit een resize-listener onder. Zonder die listener blijft de bol op de
 * maat staan die gold bij het eerste render, en dat is precies verkeerd op een
 * telefoon die gekanteld wordt.
 */
export function useBolMaten() {
  const [vw, setVw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const opnieuw = () => setVw(window.innerWidth);
    opnieuw();
    window.addEventListener("resize", opnieuw);
    return () => window.removeEventListener("resize", opnieuw);
  }, []);

  const mobiel = vw < 768;
  // Nooit breder dan de beschikbare ruimte; px-6 kost links en rechts 24px.
  const containerSize = mobiel ? Math.max(260, Math.min(340, vw - 48)) : 560;

  return {
    mobiel,
    containerSize,
    /**
     * Drievijfde van de halve doos. Groter en de voorste tegels vallen door de
     * perspectiefvergroting buiten het kader.
     */
    sphereRadius: Math.round(containerSize * 0.375),
    baseImageScale: mobiel ? 0.26 : 0.2,
    /** Op een aanraakscherm bestaat hover niet; laat de tegel dan niet groeien. */
    hoverScale: mobiel ? 1 : 1.15,
    dragSensitivity: mobiel ? 0.4 : 0.6,
    autoRotateSpeed: mobiel ? 0.12 : 0.18,
  };
}
