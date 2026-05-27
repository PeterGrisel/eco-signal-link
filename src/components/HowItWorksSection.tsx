import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Brain, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    phase: "Dag 0 – 30",
    icon: Search,
    title: "Scan & blauwdruk",
    desc: "Gratis scan, ICP en koopsignalen vastgelegd, het Commercieel Brein gebouwd op uw eigen tools.",
  },
  {
    n: "02",
    phase: "Dag 30 – 60",
    icon: Brain,
    title: "Eerste flows live",
    desc: "Multichannel outreach draait, opvolging loopt, en de eerste gesprekken komen binnen.",
  },
  {
    n: "03",
    phase: "Dag 60 – 90",
    icon: Rocket,
    title: "Meetbare groei",
    desc: "Voorspelbare pijplijn, routing naar sales, en elke cyclus stuurt het systeem zichzelf bij.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="proces" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Zo werkt het
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            In 90 dagen van scan
            <br />
            <span className="text-gradient">naar pijplijn.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Geen project van maanden voordat er iets beweegt. Eén fundament,
            daarna elke maand meetbaar verder.
          </p>
        </motion.div>

        {/* 3 stappen met verbindingslijn */}
        <div className="relative grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Verbindingslijn (desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-7 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-primary/30 via-primary/40 to-primary/30"
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-full border border-primary/30 bg-card flex items-center justify-center relative z-10 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.5)]">
                <s.icon className="w-6 h-6 text-primary" strokeWidth={1.6} />
              </div>

              <div className="mt-5 card-gradient border-glow rounded-2xl p-6 md:p-7 h-full">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-[10px] font-display font-bold tabular-nums text-primary/70 tracking-[0.2em]">
                    {s.n}
                  </span>
                  <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                    {s.phase}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link naar de volledige methode */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            to="/hoe-het-werkt"
            className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all"
          >
            Bekijk de volledige methode
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
