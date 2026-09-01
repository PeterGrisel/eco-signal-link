import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/v2/Container";
import { SplitHeadline, splitHeadlineText } from "@/components/v2/SplitHeadline";
import { SignaalDiagram } from "./SignaalDiagram";
import { PartnerBadges } from "./PartnerBadges";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { fase, useScrollProgress } from "@/hooks/useScrollProgress";
import { trackCTA } from "@/lib/tracking";

const HEADLINE = [
  [{ text: "Meer omzet" }],
  [{ text: "zonder extra" }],
  [{ text: "verkopers.", accent: true }],
];

/**
 * E-mail plus knop in één veld: de bezoeker typt zijn adres en komt met dat
 * adres al ingevuld in de agenda terecht. Zonder adres opent de modal gewoon.
 */
function AfspraakVeld() {
  const [email, setEmail] = useState("");

  function boek(e: React.FormEvent) {
    e.preventDefault();
    trackCTA("hero_gratis_scan", "hero");
    openBookingModal(email.trim() ? { email: email.trim() } : undefined);
  }

  return (
    <form
      onSubmit={boek}
      className="flex w-full max-w-[480px] flex-col gap-2 rounded-brand border border-white/[.14] bg-white/[.04] p-2 sm:flex-row sm:items-center"
    >
      <label htmlFor="hero-email" className="sr-only">
        Uw zakelijke e-mailadres
      </label>
      <input
        id="hero-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="u@bedrijf.nl"
        autoComplete="email"
        className="min-w-0 grow bg-transparent px-4 py-2.5 text-[15px] text-white placeholder:text-[#8C8378] focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-btn bg-brand-accent px-5 py-2.5 font-display text-[13.5px] font-bold tracking-[-0.01em] text-brand-ink transition-colors duration-[180ms] hover:bg-brand-accent-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        Boek een gratis scan
        <ArrowRight aria-hidden className="size-4" />
      </button>
    </form>
  );
}

/**
 * Scroll-gestuurde hero.
 *
 * Een hoge track met een sticky kind erin: de pagina blijft gewoon scrollen,
 * wij lezen alleen de stand af. De tekstlaag valt weg terwijl het diagram
 * zichzelf opbouwt, van losse bronnen naar één account met een actie. Bij
 * `prefers-reduced-motion` staat alles meteen in de eindstaat.
 */
/** Het scroll-verhaal draait alleen op breed scherm; daaronder één stilstaand beeld. */
function useBreedScherm() {
  const [breed, setBreed] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const zet = () => setBreed(mq.matches);
    zet();
    mq.addEventListener("change", zet);
    return () => mq.removeEventListener("change", zet);
  }, []);
  return breed;
}

export function Hero() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const breed = useBreedScherm();

  // Op smal scherm staat alles meteen in de eindstaat.
  const p = breed ? progress : 1;
  const pTekst = breed ? 1 - fase(p, 0.05, 0.34) : 1;
  // Ondergrens: wie niet scrollt ziet de zes bronnen compleet staan, met de
  // lijnen net op gang. Lager dan dit valt de rij half weg en oogt het beeld
  // stuk in plaats van in opbouw.
  const pDiagram = Math.max(0.34, fase(p, 0, 0.72));
  // Terwijl de tekst wegvalt schuift het beeld naar het midden en groeit het.
  const pNaarMidden = breed ? fase(p, 0.16, 0.62) : 0;

  return (
    <header className="relative bg-brand-deep text-white">
      <div ref={ref} className="relative lg:h-[220svh]">
        <div className="flex min-h-[34rem] items-center overflow-hidden py-16 lg:sticky lg:top-0 lg:h-svh lg:py-0">
          <div aria-hidden className="v2-grid-bg pointer-events-none absolute inset-0 opacity-60" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[120px] top-[60px] size-[560px] rounded-full bg-[radial-gradient(circle,rgba(232,148,90,0.20),transparent_64%)]"
          />

          <Container className="relative z-[2] grid w-full items-center gap-10 lg:grid-cols-[1.02fr_.98fr]">
            {/* Tekstlaag: scherpstellen, dan wegvallen zodat het beeld het overneemt. */}
            <div
              className="v2-enter"
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

              <AfspraakVeld />

              <p className="mt-5 flex items-start gap-2.5 text-[14px] text-[#D6CEC3]">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-accent" />
                In 30 dagen live, anders krijgt u uw geld terug.
              </p>

              <PartnerBadges className="mt-8" />
            </div>

            {/* Beeldlaag: het diagram bouwt zichzelf op terwijl de tekst wegvalt. */}
            <div
              style={{
                transform: `translateX(${-52 * pNaarMidden}%) scale(${1 + pNaarMidden * 0.16})`,
                transformOrigin: "center",
              }}
            >
              <SignaalDiagram progress={pDiagram} />
            </div>
          </Container>

          {/* Scrollhint, verdwijnt zodra de bezoeker begint. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-7 hidden justify-center lg:flex"
            style={{ opacity: 1 - fase(p, 0, 0.08) }}
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#8C8378]">
              Scroll
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
