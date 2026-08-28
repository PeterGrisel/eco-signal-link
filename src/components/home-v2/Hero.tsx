import { Button } from "@/components/v2/Button";
import { Container } from "@/components/v2/Container";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { SplitHeadline, splitHeadlineText } from "@/components/v2/SplitHeadline";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { trackCTA } from "@/lib/tracking";

const HEADLINE = [
  [{ text: "Van omzetdoel" }],
  [{ text: "naar opportunity" }],
  [{ text: "flow.", accent: true }],
];

/**
 * De rekensom uit de explainer: het omzetdoel wordt teruggerekend naar het
 * aantal opportunities dat de organisatie moet produceren. Dit is de
 * signature-visual van de hero.
 */
const SUM = [
  { value: "€ 1 mln", label: "extra omzet" },
  { value: "€ 50K", label: "orderwaarde" },
  { value: "20", label: "nieuwe klanten" },
  { value: "25%", label: "winkans" },
];

/** De operator staat op de scheidingslijn tussen twee regels, zoals in de explainer. */
const OPS = ["÷", "=", "÷", "="];

function Proof({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-2">
          <span aria-hidden className="size-1.5 rounded-full bg-brand-accent" />
          {item}
        </span>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <header className="relative flex min-h-[calc(100svh-69px)] flex-col justify-center overflow-hidden bg-brand-ground py-20 text-brand-ink">
      <div aria-hidden className="v2-grid-bg pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-20 size-[560px] rounded-full bg-[radial-gradient(circle,rgba(232,148,90,0.20),transparent_62%)]"
      />

      <Container className="relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
        <div className="v2-enter">
          <Eyebrow>Commerciële opportunity-engine</Eyebrow>
          <h1
            aria-label={splitHeadlineText(HEADLINE)}
            className="mb-6 font-display text-[length:var(--v2-h1)] font-bold leading-[1.04] tracking-tight"
          >
            <SplitHeadline lines={HEADLINE} />
          </h1>
          <p className="mb-8 max-w-[50ch] text-[17px] leading-relaxed text-brand-ink-2">
            Omzet en pipeline vertellen wat er aan het einde gebeurt. Ze zeggen
            niets over de voorkant. Wij bouwen het systeem dat structureel
            nieuwe kansen produceert, ze rangschikt op bewijs en uw verkopers
            stuurt naar het account dat nu telt.
          </p>
          <div className="mb-8 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                trackCTA("hero_plan_kennismaking", "hero");
                openBookingModal();
              }}
            >
              Plan een kennismaking
            </Button>
            <Button href="#engine" variant="outline">
              Bekijk de engine
            </Button>
          </div>
          <Proof
            items={[
              "Een label van Rebel Force",
              "Operationeel in 4 weken",
              "Op uw eigen data en CRM",
            ]}
          />
        </div>

        <div className="v2-enter" style={{ "--enter": 2 } as React.CSSProperties}>
          <div className="rounded-lg border border-brand-line bg-brand-surface p-6">
            <p className="mb-5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3">
              De rekensom
            </p>

            <div>
              {SUM.map((row, i) => (
                <div key={row.label}>
                  <div className="flex items-baseline gap-4 py-2">
                    <span className="font-display text-2xl font-bold tracking-tight text-brand-ink">
                      {row.value}
                    </span>
                    <span className="text-[13px] text-brand-ink-3">{row.label}</span>
                  </div>
                  <div className="flex items-center gap-3" aria-hidden>
                    <span className="h-px grow bg-brand-line" />
                    <span className="font-display text-sm font-semibold text-brand-accent">
                      {OPS[i]}
                    </span>
                    <span className="h-px grow bg-brand-line" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-md border border-brand-accent/30 bg-brand-accent/[0.07] px-5 py-4">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
                80 opportunities per jaar
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-2">
                De commerciële TAK: elke 4 tot 5 werkdagen één nieuwe
                opportunity. Haalt u er nu 40, dan lost harder bellen niets op.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
