import { motion } from "framer-motion";
import { Radio, Database, BarChart3, Sparkles, Send, ArrowRight } from "lucide-react";

const PLAYS = [
  {
    title: "Funding-trigger outreach",
    desc: "Een bedrijf haalt nieuwe ronde op. Je benadert ze omdat ze gaan uitbreiden.",
    steps: [
      { icon: Radio, k: "Signaal", v: "Series A opgehaald" },
      { icon: Database, k: "Enrich", v: "Account + contact" },
      { icon: BarChart3, k: "Score", v: "92" },
      { icon: Sparkles, k: "Personaliseer", v: "Refereer aan ronde" },
      { icon: Send, k: "Run", v: "Mail + LinkedIn + call" },
    ],
  },
  {
    title: "Pricing-pagina bezoek",
    desc: "Een ICP-account bekijkt pricing twee keer. Je belt terwijl de intentie hoog is.",
    steps: [
      { icon: Radio, k: "Signaal", v: "Pricing 2x bezocht" },
      { icon: Database, k: "Enrich", v: "Match contact aan account" },
      { icon: BarChart3, k: "Score", v: "97" },
      { icon: Sparkles, k: "Personaliseer", v: "Refereer aan pagina" },
      { icon: Send, k: "Run", v: "Zelfde dag bellen + mail" },
    ],
  },
  {
    title: "Champion job-change",
    desc: "Een champion stapt over. Hij wil mogelijk weer met je werken in zijn nieuwe rol.",
    steps: [
      { icon: Radio, k: "Signaal", v: "Champion vertrok" },
      { icon: Database, k: "Enrich", v: "Nieuw bedrijf + rol" },
      { icon: BarChart3, k: "Score", v: "88" },
      { icon: Sparkles, k: "Personaliseer", v: "Refereer aan oude winst" },
      { icon: Send, k: "Run", v: "Warme sequence" },
    ],
  },
];

const CATEGORIES = [
  { n: 10, label: "Signaal-getriggerde outbound" },
  { n: 8, label: "LinkedIn en content" },
  { n: 4, label: "Inbound en operationeel" },
  { n: 3, label: "ABM en ads" },
  { n: 5, label: "Uitbreiding en retentie" },
  { n: 6, label: "AI-native 2026" },
];

const PlaysSection = () => {
  return (
    <section className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 max-w-4xl">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            06 / Wat is een play?
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
            Een play is één herhaalbare beweging. Een signaal vuurt, de engine verrijkt en scoort, een specifieke sequence draait automatisch.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-5">
            Een bibliotheek van <span className="text-primary font-semibold">36 plays</span> over{" "}
            <span className="text-primary font-semibold">6 categorieën</span>. Wij bouwen de 4 tot 6 die bij jouw ICP passen.
          </p>
        </div>

        <div className="space-y-4 md:space-y-5 mb-12">
          {PLAYS.map((play, i) => (
            <motion.div
              key={play.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border-glow rounded-2xl p-6 md:p-7"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 mb-5">
                <div className="lg:w-1/3">
                  <h3 className="font-display font-bold text-xl mb-1">{play.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{play.desc}</p>
                </div>
                <div className="lg:w-2/3 flex flex-wrap items-stretch gap-2">
                  {play.steps.map((s, idx) => (
                    <div key={s.k} className="flex items-center gap-2 flex-1 min-w-[140px]">
                      <div className="flex-1 p-3 rounded-lg border border-primary/25 bg-background/40">
                        <div className="flex items-center gap-2 mb-1">
                          <s.icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.7} />
                          <span className="text-[9px] font-display font-semibold tracking-[0.16em] uppercase text-primary/70">
                            {s.k}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/85 font-medium">{s.v}</p>
                      </div>
                      {idx < play.steps.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-primary/50 shrink-0 hidden md:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="card-gradient border-glow rounded-2xl p-6 md:p-7">
          <p className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary mb-4">
            De volledige bibliotheek
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-primary/30 bg-primary/5 text-sm"
              >
                <span className="font-display font-bold text-primary">{c.n}</span>
                <span className="text-foreground/85">{c.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaysSection;