import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const STATS = [
  { value: "4 weken", label: "tot eerste live signalen" },
  { value: "90 dagen", label: "tot werkend fundament" },
  { value: "100%", label: "in jouw eigen stack" },
];

const QUOTES = [
  {
    headline: "Van handmatig prospecten naar live signaalstroom in jouw CRM.",
    detail: "Outbound op autopilot, sales bepaalt wie wordt gebeld.",
  },
  {
    headline: "ICP, scoring en sequences gebouwd op jouw eigen data.",
    detail: "Geen black box. Jouw team ziet hoe elk onderdeel werkt.",
  },
  {
    headline: "Elke 4 weken bijsturen. Wat werkt schalen, wat niet werkt aanpassen.",
    detail: "Resultaten loopen terug in de engine. Volgende cyclus is scherper.",
  },
];

const ProofSection = () => {
  return (
    <section className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            09 / Bewijs
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Verfijnd met elke build.
            <br />
            <span className="text-gradient">Klaar voor jouw stack.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-5">
            Elke opdracht leerde ons waar groeisystemen breken. Het systeem is het resultaat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border-glow rounded-2xl p-7 text-center"
            >
              <p className="font-display font-bold text-5xl md:text-6xl text-gradient mb-2">{s.value}</p>
              <p className="text-muted-foreground text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {QUOTES.map((q, i) => (
            <motion.div
              key={q.headline}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border-glow rounded-2xl p-6"
            >
              <p className="font-display font-semibold text-lg mb-3 leading-snug">{q.headline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{q.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/klanten"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            Bekijk alle klantverhalen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProofSection;