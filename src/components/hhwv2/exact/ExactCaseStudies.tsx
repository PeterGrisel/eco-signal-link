import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Spotlight, NumberTicker } from "@/components/hhwv2/ui/magic";

type Metric = {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: string;
};

const CASES: {
  badge: string;
  company: string;
  logo: string;
  title: string;
  titleSub: string;
  body: string;
  metrics: Metric[];
}[] = [
  {
    badge: "Embedded Tech",
    company: "Core-Vision",
    logo: "/logos/core-vision-logo.png",
    title: "Van founder-led sales",
    titleSub: "naar 200+ leads",
    body: "Voor Core-Vision, een embedded-hardware bedrijf dat sales nog founder-led deed, bouwden we een ABM-systeem: 12 ICP-campagnes, een nurture-laag en automatische lead-routing naar het CRM.",
    metrics: [
      { label: "Engaged leads", value: 200, suffix: "+", delta: "ICP Focus" },
      { label: "ICP-campagnes", value: 12, delta: "Active" },
      { label: "Nurture accounts", value: 2000, delta: "In CRM" },
    ],
  },
  {
    badge: "Industrie",
    company: "Eurofast",
    logo: "/logos/eurofast-logo.png",
    title: "Van nul",
    titleSub: "naar globale push",
    body: "Voor Eurofast, een industriële speler in bevestigingstechniek, zetten we de internationale groei op: de EU-markt in kaart (TAM/SAM), een partnerplan voor Azië en de eerste nieuwe markten geactiveerd met outbound.",
    metrics: [
      { label: "Markten in scope", value: 5, delta: "EU & Azië" },
      { label: "TAM/SAM EU", value: "Opgezet", delta: "Voltooid" },
      { label: "Engaged contacten", value: 264, delta: "Sales-ready" },
    ],
  },
  {
    badge: "Sport & Sponsoring",
    company: "Excelsior",
    logo: "/logos/excelsior-logo.png",
    title: "Van club",
    titleSub: "naar sponsor",
    body: "Voor Excelsior bouwden wij een sponsorsysteem. Wij mappen lokale bedrijven, activeren beslissers en zetten vrouwenvoetbal actief op de kaart. Elk signaal wordt een gesprek voor het commerciële team.",
    metrics: [
      { label: "Reply rate", value: 25, suffix: "%", delta: "Op outbound" },
      { label: "Bedrijven in scope", value: 480, delta: "Regionaal" },
      { label: "Vrouwenvoetbal-tracks", value: "Actief", delta: "Live" },
    ],
  },
  {
    badge: "Technisch groothandel",
    company: "Leister",
    logo: "/logos/leister-logo.png",
    title: "Van farmen",
    titleSub: "naar hunting",
    body: "Voor Leister, een technisch groothandel, verschuiven wij het commerciële model. Account managers werken vanuit signalen in plaats van bestaande relaties. Hun netwerk breidt maandelijks uit met nieuwe beslissers en installateurs.",
    metrics: [
      { label: "Nieuwe accounts", value: 800, suffix: "+", delta: "Continu" },
      { label: "Qualifiers", value: 5, delta: "Per maand" },
      { label: "Netwerkgroei", value: "Continu", delta: "Maandelijks" },
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
            key={c.company}
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
                <div className="flex items-center justify-between mb-5">
                  <img
                    src={c.logo}
                    alt={c.company}
                    loading="lazy"
                    className="h-12 md:h-14 w-auto object-contain rounded-md"
                  />
                  <span className="text-[10px] font-display font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Case study
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight leading-tight mb-3">
                  {c.title}
                  <br />
                  <span className="text-foreground/85">{c.titleSub}</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">{c.body}</p>
                <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-display font-semibold text-primary">
                  {c.badge}
                </span>
              </div>
              {/* Right metrics */}
              <div className="space-y-2.5">
                {c.metrics.map((m, idx) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-lg border border-primary/15 bg-background/40 px-4 py-3"
                  >
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-0.5">{m.label}</p>
                      <p className="font-display font-bold text-xl text-foreground leading-none">
                        {typeof m.value === "number" ? (
                          <NumberTicker
                            value={m.value}
                            prefix={m.prefix}
                            suffix={m.suffix}
                            decimals={m.decimals ?? 0}
                          />
                        ) : (
                          <span className="text-primary">{m.value}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.delta && (
                        <span className="text-[10px] font-display font-semibold text-muted-foreground">{m.delta}</span>
                      )}
                      {idx === 0 && <TrendingUp className="h-4 w-4 text-primary" strokeWidth={2} />}
                      <ArrowUpRight className="h-4 w-4 text-primary/70" strokeWidth={2} />
                    </div>
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
