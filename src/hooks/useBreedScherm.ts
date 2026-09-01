import { useEffect, useState } from "react";

/**
 * True vanaf het `lg`-breekpunt van Tailwind. Voor onderdelen die op breed
 * scherm een scroll-verhaal draaien en daaronder één stilstaand beeld tonen:
 * zo staat er maar één versie in de DOM in plaats van twee waarvan er één met
 * CSS verborgen is en de voorlezer beide oplepelt.
 *
 * De beginwaarde wordt meteen uit de media query gelezen. Anders bouwt een
 * zwaar onderdeel zich eerst in de smalle variant op en daarna nog eens in de
 * brede — het zwarte gat in de hero laadde daardoor twee keer.
 */
export function useBreedScherm(query = "(min-width: 1024px)") {
  const [breed, setBreed] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const zet = () => setBreed(mq.matches);
    zet();
    mq.addEventListener("change", zet);
    return () => mq.removeEventListener("change", zet);
  }, [query]);
  return breed;
}
