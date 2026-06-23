import { motion } from "framer-motion";
import { Wrench, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PATHS = [
  {
    eyebrow: "Fundament eerst",
    title: "Bouw het groeisysteem",
    icon: Wrench,
    description:
      "Voor rommelige data, losse tools, zwakke signalen of veel handwerk. In 90 dagen bouwen we het fundament. Daarna is het van jou.",
    badge: "Wij bouwen het",
    sub: "Jij wordt eigenaar",
    chips: ["Datafundament", "Signaal-laag", "Routering"],
    cta: "Bouw het fundament",
    href: "#90dagen",
  },
  {
    eyebrow: "Al een fundament",
    title: "Draai de uitvoering",
    icon: Rocket,
    description:
      "Voor bedrijven die nu groei nodig hebben. Onze operators draaien outbound, ads en content vanuit dezelfde ICP en signalen.",
    badge: "Wij draaien het",
    sub: "Direct live",
    chips: ["GTM-engineering", "Ads-engineering", "Content-engineering"],
    cta: "Start bij uitvoering",
    href: "#uitvoering",
  },
];

const TwoPathsSection = () => {
  return (
    <section className="py-16 md:py-28 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            02 / Twee paden
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Bouw het systeem.
            <br />
            <span className="text-gradient italic">Of</span> draai de uitvoering.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-5 max-w-xl">
            Sommige bedrijven hebben eerst het fundament nodig, andere willen direct operators. Allebei kan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {PATHS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-gradient border-glow rounded-2xl p-7 md:p-9 flex flex-col group hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="w-12 h-12 rounded-xl border border-primary/30 bg-card flex items-center justify-center">
                  <p.icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                </span>
                <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80 border border-primary/30 px-2 py-1 rounded-md">
                  {p.eyebrow}
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl md:text-3xl mb-3 leading-tight">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{p.description}</p>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary">
                  {p.badge}
                </span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                  {p.sub}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {p.chips.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center px-3 py-1.5 rounded-md border border-primary/25 bg-primary/5 text-xs font-medium text-foreground/85"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <a
                href={p.href}
                className="mt-auto inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all"
              >
                {p.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TwoPathsSection;