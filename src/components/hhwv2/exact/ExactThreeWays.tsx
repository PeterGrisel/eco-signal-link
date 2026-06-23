import { motion } from "framer-motion";
import { Radar, Send, Workflow, ArrowRight } from "lucide-react";

const ITEMS = [
  {
    icon: Radar,
    title: "Signal Layer",
    body: "We detecteren koopintentie en prioriteren accounts die nu in beweging zijn.",
  },
  {
    icon: Send,
    title: "Outbound Engine",
    body: "We starten relevante gesprekken via multi-channel outreach op schaal.",
  },
  {
    icon: Workflow,
    title: "AI Workflows",
    body: "We automatiseren opvolging, personalisatie en kwalificatie met slimme workflows.",
  },
];

const ExactThreeWays = () => (
  <section id="aanpak" className="py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <p className="text-primary font-display font-semibold text-[11px] tracking-[0.22em] uppercase mb-3">
          Onze aanpak
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
          3 manieren waarop we <span className="font-serif italic text-gradient-animate">groei versnellen</span>
        </h2>
        <p className="text-muted-foreground text-base">
          Niet meer losse acties, maar één samenhangende machine van signalering tot sales.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 md:gap-5">
        {ITEMS.map((it, i) => (
          <motion.a
            key={it.title}
            href="#engine"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group flex items-start gap-4 rounded-xl border border-primary/20 card-gradient p-5 md:p-6 hover:border-primary/45 transition-colors"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
              <it.icon className="h-5 w-5 text-primary" strokeWidth={1.7} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-base text-foreground mb-1">{it.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{it.body}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary self-center shrink-0 transition-transform group-hover:translate-x-1" />
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default ExactThreeWays;