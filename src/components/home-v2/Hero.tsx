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

/** De rekensom uit de explainer, de signature-visual van de hero. */
const SOM = [
  { waarde: "€ 1 mln", label: "extra omzet" },
  { waarde: "€ 50K", label: "orderwaarde" },
  { waarde: "20", label: "nieuwe klanten" },
  { waarde: "25%", label: "winkans" },
];
const OPS = ["÷", "=", "÷", "="];

function Proof({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#A29584]">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-[7px]">
          <span aria-hidden className="size-[5px] rounded-full bg-brand-accent" />
          {item}
        </span>
      ))}
    </div>
  );
}

/** Hero vult de viewport; rechts de rekensom die het hele verhaal samenvat. */
export function Hero() {
  return (
    <header className="relative flex min-h-[calc(100svh-63px)] flex-col justify-center overflow-hidden bg-brand-deep py-20 text-white">
      <div aria-hidden className="v2-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[90px] -top-[60px] size-[520px] rounded-full bg-[radial-gradient(circle,rgba(232,148,90,0.22),transparent_62%)]"
      />

      <Container className="relative z-[2] grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
        <div className="v2-enter">
          <Eyebrow tone="deep">Commerciële opportunity-engine</Eyebrow>
          <h1
            aria-label={splitHeadlineText(HEADLINE)}
            className="mb-[22px] font-display text-[length:var(--v2-h1)] font-black leading-[1.02] tracking-[-0.035em]"
          >
            <SplitHeadline lines={HEADLINE} accentClass="text-brand-accent" />
          </h1>
          <p className="mb-[30px] max-w-[48ch] text-[17px] text-[#D6CEC3]">
            Omzet en pipeline vertellen wat er aan het einde gebeurt. Wij bouwen
            het systeem dat aan de voorkant structureel nieuwe kansen
            produceert, ze rangschikt op bewijs en uw verkopers stuurt naar het
            account dat nu telt.
          </p>
          <div className="mb-7 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                trackCTA("hero_gratis_scan", "hero");
                openBookingModal();
              }}
            >
              Boek een gratis scan
            </Button>
            <Button href="#prijzen" variant="invert">
              Bekijk de prijzen
            </Button>
          </div>
          <Proof
            items={["Nul opstartkosten", "Operationeel in 4 weken", "Op uw eigen data en CRM"]}
          />
        </div>

        <div className="v2-enter" style={{ "--enter": 2 } as React.CSSProperties}>
          <div className="rounded-brand border border-white/[.12] bg-brand-deep-2 p-6">
            <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#A29584]">
              De rekensom
            </p>
            <div>
              {SOM.map((rij, i) => (
                <div key={rij.label}>
                  <div className="flex items-baseline gap-4 py-2">
                    <span className="font-display text-2xl font-black tracking-[-0.02em] text-white">
                      {rij.waarde}
                    </span>
                    <span className="text-[13px] text-[#A29584]">{rij.label}</span>
                  </div>
                  <div className="flex items-center gap-3" aria-hidden>
                    <span className="h-px grow bg-white/[.12]" />
                    <span className="font-display text-sm font-bold text-brand-accent">
                      {OPS[i]}
                    </span>
                    <span className="h-px grow bg-white/[.12]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-brand border border-brand-accent/40 bg-brand-accent/[0.10] px-5 py-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                80 opportunities per jaar
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[#D6CEC3]">
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
