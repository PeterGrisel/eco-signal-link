import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/v2/Container";
import { SplitHeadline, splitHeadlineText } from "@/components/v2/SplitHeadline";
import { SignaalDiagram } from "./SignaalDiagram";
import { BlackHoleHeroSection } from "@/components/ui/blackhole-hero-section";
import { PartnerBadges } from "./PartnerBadges";
import TalkCard from "@/components/TalkCard";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { fase, useScrollProgress } from "@/hooks/useScrollProgress";
import { trackCTA } from "@/lib/tracking";

const HEADLINE = [
  [{ text: "Meer omzet" }],
  [{ text: "zonder extra" }],
  [{ text: "verkopers.", accent: true }],
];




/**
 * Scroll-gestuurde hero.
 *
 * Een hoge track met een sticky kind erin: de pagina blijft gewoon scrollen,
 * wij lezen alleen de stand af. Drie beats:
 *
 *   1. Het zwarte gat vult het beeld, de propositie staat links in de luwte
 *      die het scrim daar vrijhoudt.
 *   2. De tekst valt weg, een sluier dekt het gat af en de engine bouwt
 *      zichzelf op in het midden.
 *   3. Het diagram staat compleet; onderaan de track ligt een snappunt dat
 *      de bezoeker in één beweging de volgende sectie in trekt.
 *
 * Bij `prefers-reduced-motion` staat alles meteen in de eindstaat en houdt het
 * zwarte gat zichzelf stil.
 */
/** Het scroll-verhaal draait alleen op breed scherm; daaronder één stilstaand beeld. */
function useBreedScherm() {
  // Meteen de juiste stand: anders bouwt het zwarte gat zich eerst in de
  // smalle variant op en daarna nog eens in de brede ("twee keer laden").
  const [breed, setBreed] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const zet = () => setBreed(mq.matches);
    zet();
    mq.addEventListener("change", zet);
    return () => mq.removeEventListener("change", zet);
  }, []);
  return breed;
}

/** Bij binnenkomst zonder anker altijd bovenaan starten. */
function useStartBovenaan() {
  useEffect(() => {
    if (window.location.hash && window.location.hash !== "#") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);
}


/**
 * Zet het snappen aan zolang `el` in beeld is, en weer uit zodra het weg is.
 * Zie de toelichting bij `.v2-hero-snap` in index.css.
 */
function useSnapTerwijlZichtbaar(el: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const wortel = document.documentElement;
    const io = new IntersectionObserver(
      ([entry]) => wortel.classList.toggle("v2-hero-snap", entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      wortel.classList.remove("v2-hero-snap");
    };
  }, [el]);
}

export function Hero() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const breed = useBreedScherm();
  useStartBovenaan();
  useSnapTerwijlZichtbaar(ref);


  // Op smal scherm is er geen scroll-verhaal: het gat staat achter de tekst en
  // het diagram krijgt eronder zijn eigen blok.
  const p = breed ? progress : 0;
  const pTekst = breed ? 1 - fase(p, 0.06, 0.3) : 1;
  // De sluier dekt het gat af zodra de engine het beeld overneemt. Zonder dat
  // vechten twee oranje beelden om dezelfde plek.
  const sluier = breed ? fase(p, 0.16, 0.44) * 0.95 : 0.5;
  const pDiagram = breed ? fase(p, 0.26, 0.86) : 1;
  const pDiagramIn = breed ? fase(p, 0.24, 0.44) : 1;

  return (
    <header className="relative bg-brand-deep text-white">
      <div ref={ref} className="relative lg:h-[280svh]">
        <div className="relative flex min-h-[38rem] items-center overflow-hidden lg:sticky lg:top-0 lg:h-svh">
          {/* Het zwarte gat als achtergrond. Het scrim houdt de leeshelft vrij. */}
          <div aria-hidden className="absolute inset-0 z-0">
            <BlackHoleHeroSection
              focus={breed ? [0.74, 0.44] : [0.5, 0.82]}
              scrim={breed ? "left" : "top"}
              scrimStrength={0.92}
              elevation={breed ? -5.5 : -7}
              fov={breed ? 42 : 58}
              midColor="#E8945A"
              coolColor="#A85410"
              glow={breed ? 1 : 0.85}
              steps={breed ? 300 : 190}
              resolution={breed ? 0.7 : 0.58}
            />
          </div>

          {/* Sluier: dooft het gat terwijl de engine binnenkomt. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] bg-brand-deep"
            style={{ opacity: sluier }}
          />

          {/* Tekstlaag: scherpstellen, dan wegvallen zodat het beeld het overneemt. */}
          <Container className="relative z-[2] w-full py-16 lg:py-0">
            <div
              className="v2-enter max-w-[36rem]"
              style={{
                opacity: pTekst,
                transform: `translateY(${(1 - pTekst) * -28}px)`,
                filter: `blur(${(1 - pTekst) * 5}px)`,
                visibility: pTekst < 0.02 ? "hidden" : undefined,
                pointerEvents: pTekst < 0.35 ? "none" : undefined,
              }}
            >
              <p className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                [ Opportunity-engine voor B2B met bewezen propositie ]
              </p>
              <h1
                aria-label={splitHeadlineText(HEADLINE)}
                className="mb-[22px] font-display text-[length:var(--v2-h1)] font-black leading-[1.02] tracking-[-0.035em]"
              >
                <SplitHeadline lines={HEADLINE} accentClass="text-brand-accent" />
              </h1>
              <p className="mb-7 max-w-[44ch] text-[16.5px] leading-relaxed text-[#D6CEC3]">
                B2B Groeimachine bouwt het systeem achter uw sales, marketing en
                RevOps. Negentig dagen als pilot, of u neemt het daarna zelf in
                beheer.
              </p>
              <TalkCard location="Home hero" />


              <PartnerBadges className="mt-8" />

            </div>
          </Container>

          {/* Beeldlaag: de engine bouwt zichzelf op in het midden van het frame. */}
          <div
            className="pointer-events-none absolute inset-0 z-[3] hidden items-center justify-center px-5 lg:flex"
            style={{
              opacity: pDiagramIn,
              transform: `scale(${0.9 + pDiagramIn * 0.3})`,
              visibility: pDiagramIn < 0.02 ? "hidden" : undefined,
            }}
          >
            <SignaalDiagram progress={pDiagram} />
          </div>

          {/* Scrollhint, verdwijnt zodra de bezoeker begint. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-7 z-[4] hidden justify-center lg:flex"
            style={{ opacity: 1 - fase(p, 0, 0.08) }}
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#8C8378]">
              Scroll
            </span>
          </div>
        </div>
      </div>

      {/* Smal scherm: de engine krijgt zijn eigen blok onder de propositie. */}
      <div className="relative z-[2] bg-brand-deep px-5 pb-14 lg:hidden">
        <SignaalDiagram progress={1} />
      </div>

      {/* Het snappunt: wie het einde van de track nadert wordt de volgende
          sectie in getrokken, in één beweging in plaats van halverwege. */}
      <div aria-hidden className="v2-snap h-px" />
    </header>
  );
}
