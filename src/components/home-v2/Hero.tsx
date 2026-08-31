import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/v2/Container";
import { SplitHeadline, splitHeadlineText } from "@/components/v2/SplitHeadline";
import { SignaalDiagram } from "./SignaalDiagram";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
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
      className="flex w-full max-w-[520px] flex-col gap-2 rounded-brand border border-white/[.14] bg-white/[.04] p-2 sm:flex-row sm:items-center"
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
        className="min-w-0 grow bg-transparent px-4 py-3 text-[15px] text-white placeholder:text-[#8C8378] focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-btn bg-brand-accent px-5 py-3 font-display text-[13.5px] font-bold tracking-[-0.01em] text-brand-ink transition-colors duration-[180ms] hover:bg-brand-accent-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        Boek een gratis scan
        <ArrowRight aria-hidden className="size-4" />
      </button>
    </form>
  );
}

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-brand-deep py-16 text-white lg:py-24">
      <div aria-hidden className="v2-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[120px] top-[80px] size-[560px] rounded-full bg-[radial-gradient(circle,rgba(232,148,90,0.20),transparent_64%)]"
      />

      <Container className="relative z-[2] grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
        <div className="v2-enter">
          <p className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
            [ Opportunity-engine voor B2B met bewezen propositie ]
          </p>
          <h1
            aria-label={splitHeadlineText(HEADLINE)}
            className="mb-[22px] font-display text-[length:var(--v2-h1)] font-black leading-[1.02] tracking-[-0.035em]"
          >
            <SplitHeadline lines={HEADLINE} accentClass="text-brand-accent" />
          </h1>
          <p className="mb-8 max-w-[46ch] text-[17px] leading-relaxed text-[#D6CEC3]">
            B2B Groeimachine bouwt het systeem achter uw sales, marketing en
            RevOps. Wij draaien het negentig dagen als pilot, of u neemt het
            daarna zelf in beheer.
          </p>

          <AfspraakVeld />

          <p className="mt-5 flex items-start gap-2.5 text-[14px] text-[#D6CEC3]">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-accent" />
            In 30 dagen live, anders krijgt u uw geld terug.
          </p>

          <a
            href="#hoe-het-werkt"
            className="mt-5 inline-flex items-center gap-1.5 border-b border-white/30 pb-0.5 text-[14px] text-white transition-colors duration-[180ms] hover:border-brand-accent hover:text-brand-accent"
          >
            Bekijk hoe het werkt <span aria-hidden>→</span>
          </a>
        </div>

        <div className="v2-enter" style={{ "--enter": 2 } as React.CSSProperties}>
          <SignaalDiagram />
        </div>
      </Container>
    </header>
  );
}
