import { motion } from "framer-motion";

type Metric = { label: string; value: string; accent?: boolean };
type ProofCase = {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  tag: string;
  metrics: Metric[];
};

const CASES: ProofCase[] = [
  {
    eyebrow: "Case study",
    title: (
      <>
        Van founder-led
        <br />
        naar 200+ leads
      </>
    ),
    body:
      "Voor een embedded-hardware bedrijf dat sales nog founder-led deed bouwden we een ABM-systeem: 12 ICP-campagnes, een nurture-laag en automatische lead-routing naar het CRM.",
    tag: "Embedded Tech",
    metrics: [
      { label: "Engaged leads", value: "200+" },
      { label: "ICP-campagnes", value: "12" },
      { label: "Nurture accounts", value: "2.000" },
    ],
  },
  {
    eyebrow: "Case study",
    title: (
      <>
        Van nul systeem
        <br />
        naar globale push
      </>
    ),
    body:
      "Voor een industriële speler in bevestigingstechniek zetten we de internationale groei op: de EU-markt in kaart (TAM/SAM), een partnerplan voor Azië en de eerste nieuwe markten geactiveerd met outbound.",
    tag: "Industrie",
    metrics: [
      { label: "Markten in scope", value: "5" },
      { label: "TAM/SAM EU", value: "Opgezet", accent: true },
      { label: "Engaged contacten", value: "264" },
    ],
  },
];

const ExactProofCases = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6 max-w-5xl">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">
          Proof over promises
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Systemen die <span className="italic text-primary">pipeline opleveren</span>
        </h2>
      </div>

      <div className="space-y-6 md:space-y-8">
        {CASES.map((c, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                  {c.eyebrow}
                </p>
                <h3 className="text-2xl md:text-4xl font-bold text-foreground leading-tight mb-5">
                  {c.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{c.body}</p>
                <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  {c.tag}
                </span>
              </div>

              <div className="space-y-3">
                {c.metrics.map((m, mi) => (
                  <div
                    key={mi}
                    className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/40 px-5 py-4 md:px-6 md:py-5"
                  >
                    <span className="text-sm md:text-base text-muted-foreground">{m.label}</span>
                    <span
                      className={`text-2xl md:text-3xl font-bold ${
                        m.accent ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default ExactProofCases;