import { motion } from "framer-motion";
import { Spotlight, NumberTicker } from "@/components/hhwv2/ui/magic";

type Metric = {
  label: string;
  /** Numerieke waarde (telt op bij in-view). Laat weg bij een tekst-waarde. */
  value?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Niet-numerieke waarde, bijv. "Opgezet". Wordt accent-gekleurd getoond. */
  text?: string;
};

const CASES: {
  badge: string;
  title: string;
  titleSub: string;
  body: string;
  metrics: Metric[];
}[] = [
  {
    badge: "Embedded Tech",
    title: "Van founder-led",
    titleSub: "naar 200+ leads",
    body:
      "Voor een embedded-hardware bedrijf dat sales nog founder-led deed bouwden we een ABM-systeem: 12 ICP-campagnes, een nurture-laag en automatische lead-routing naar het CRM.",
    metrics: [
      { label: "Engaged leads", value: 200, suffix: "+" },
      { label: "ICP-campagnes", value: 12 },
      { label: "Nurture accounts", value: 2000 },
    ],
  },
  {
    badge: "Industrie",
    title: "Van nul systeem",
    titleSub: "naar globale push",
    body:
      "Voor een industriële speler in bevestigingstechniek zetten we de internationale groei op: de EU-markt in kaart (TAM/SAM), een partnerplan voor Azië en de eerste nieuwe markten geactiveerd met outbound.",
    metrics: [
      { label: "Markten in scope", value: 5 },
      { label: "TAM/SAM EU", text: "Opgezet" },
      { label: "Engaged contacten", value: 264 },
    ],
  },
];

const ExactCaseStudies = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <p className="text-primary font-display font-semibold text-[11px] tracking-[0.22em] uppercase mb-3">
          Proof over promises
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
          Systemen die <span className="font-serif italic text-gradient-animate">pipeline opleveren</span>
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-5 md:gap-6">
        {CASES.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-primary/20 card-gradient p-6 md:p-7"
          >
            <Spotlight size={420} />
            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Left */}
              <div>
                <p className="text-primary font-display font-semibold text-[11px] tracking-[0.22em] uppercase mb-3">
                  Case study
                </p>
                <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight leading-tight mb-3">
                  {c.title}
                  <br />
                  <span className="text-foreground/85">{c.titleSub}</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{c.body}</p>
                <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-display font-semibold text-primary">
                  {c.badge}
                </span>
              </div>
              {/* Right metrics */}
              <div className="space-y-2.5">
                {c.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between gap-4 rounded-lg border border-primary/15 bg-background/40 px-4 py-3.5"
                  >
                    <span className="text-[13px] text-muted-foreground">{m.label}</span>
                    {m.text ? (
                      <span className="font-display font-bold text-xl text-primary leading-none">{m.text}</span>
                    ) : (
                      <span className="font-display font-bold text-2xl text-foreground leading-none">
                        <NumberTicker
                          value={m.value ?? 0}
                          prefix={m.prefix}
                          suffix={m.suffix}
                          decimals={m.decimals ?? 0}
                        />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ExactCaseStudies;
