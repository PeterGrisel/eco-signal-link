import { useEffect } from "react";
import { Container } from "@/components/v2/Container";
import { SplitHeadline, splitHeadlineText } from "@/components/v2/SplitHeadline";
import { BlackHoleHeroSection } from "@/components/ui/blackhole-hero-section";
import { PartnerBadges } from "./PartnerBadges";
import TalkCard from "@/components/TalkCard";
import { useBreedScherm } from "@/hooks/useBreedScherm";

const HEADLINE = [
  [{ text: "Klaar om te schalen?", accent: true }],
];




/**
 * Sluitsectie van de homepage.
 *
 * Het zwarte gat staat achter de propositie. Geen scroll-verhaal meer: de
 * tekst staat meteen scherp en blijft staan.
 */
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


export function Hero() {
  const breed = useBreedScherm();
  useStartBovenaan();

  return (
    <header id="contact" className="relative bg-brand-deep text-white">
      <div className="relative flex min-h-[38rem] items-center overflow-hidden lg:min-h-svh">
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
            steps={breed ? 210 : 170}
            resolution={breed ? 0.6 : 0.52}
          />
        </div>

        <Container className="relative z-[2] w-full py-16 lg:py-0">
          <div className="v2-enter max-w-[36rem]">
            <p className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
              [ Commercie hoeft geen zwart gat te zijn ]
            </p>
            <h2
              aria-label={splitHeadlineText(HEADLINE)}
              className="mb-[22px] font-display text-[length:var(--v2-h1)] font-black leading-[1.02] tracking-[-0.035em]"
            >
              <SplitHeadline lines={HEADLINE} accentClass="text-brand-accent" />
            </h2>
            <p className="mb-7 max-w-[44ch] text-[16.5px] leading-relaxed text-[#D6CEC3]">
              B2B Groeimachine ontwerpt en bouwt het systeem achter uw sales,
              marketing en RevOps. Negentig dagen als pilot, daarna
              maandelijks opzegbaar.
            </p>
            <TalkCard location="Home hero" />

            {/* Secundair pad: wie nog niet wil bellen, kijkt eerst de pilot in. */}
            <div className="mt-4 flex justify-start">
              <a
                href="#pilot"
                className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-accent transition-colors duration-[180ms] hover:text-brand-accent-ink"
              >
                Bekijk de pilot →
              </a>
            </div>

            <PartnerBadges className="mt-8" />

          </div>
        </Container>
      </div>

    </header>
  );
}
