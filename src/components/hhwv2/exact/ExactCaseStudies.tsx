import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";

const CASES = [
  {
    badge: "Cybersecurity",
    title: "+36 meetings",
    titleSub: "in 22 dagen",
    body:
      "Voor een cybersecurity scale-up bouwden we een nieuwe outbound engine die binnen 3 weken resultaten opleverde.",
    metrics: [
      { label: "Meetings booked", value: "36", delta: "+260%" },
      { label: "Reply rate", value: "21%", delta: "+11pp" },
      { label: "Pipeline created", value: "€1.4M", delta: "" },
    ],
  },
  {
    badge: "B2B SaaS",
    title: "€3M pipeline",
    titleSub: "in 3 maanden",
    body:
      "Voor een B2B SaaS bedrijf optimaliseerden we signalen, content en outreach en bouwden we een voorspelbare pipeline machine.",
    metrics: [
      { label: "Pipeline created", value: "€3.0M", delta: "+180%" },
      { label: "SQLs", value: "74", delta: "+145%" },
      { label: "Win rate", value: "28%", delta: "+8pp" },
    ],
  },
];

const ExactCaseStudies = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-5 md:gap-6">
        {CASES.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="rounded-2xl border border-primary/20 card-gradient p-6 md:p-7"
          >
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
                {c.metrics.map((m, idx) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-lg border border-primary/15 bg-background/40 px-4 py-3"
                  >
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-0.5">{m.label}</p>
                      <p className="font-display font-bold text-2xl text-foreground leading-none">{m.value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.delta && (
                        <span className="text-[11px] font-display font-semibold text-primary">{m.delta}</span>
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