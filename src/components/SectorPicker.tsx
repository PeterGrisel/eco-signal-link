import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Radar } from "lucide-react";
import { sectors } from "@/data/sectors";

const SectorPicker = () => {
  const [activeSlug, setActiveSlug] = useState(sectors[0].slug);
  const active = sectors.find((s) => s.slug === activeSlug) ?? sectors[0];
  const ActiveIcon = active.icon;

  return (
    <section className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-primary mb-3">
            Werkt in elke B2B branche
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Kies uw sector
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Zie direct welke signalen wij volgen en wat u na vier weken in huis heeft.
          </p>
        </div>

        {/* Chips */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto md:flex-wrap md:justify-center pb-3 md:pb-0 mb-8 md:mb-10 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {sectors.map((s) => {
            const Icon = s.icon;
            const isActive = s.slug === activeSlug;
            return (
              <button
                key={s.slug}
                onClick={() => setActiveSlug(s.slug)}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                  isActive
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
                aria-pressed={isActive}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Detail card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 md:p-10"
          >
            <div className="flex items-start gap-4 mb-6 md:mb-8">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ActiveIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-semibold">{active.title}</h3>
                <p className="text-muted-foreground mt-1">{active.tagline}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                  <Radar className="w-4 h-4 text-primary" />
                  Signalen die wij volgen
                </div>
                <ul className="space-y-3">
                  {active.signals.slice(0, 4).map((sig) => (
                    <li key={sig} className="flex gap-3 text-sm md:text-base">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Wat u krijgt na vier weken
                </div>
                <ul className="space-y-3">
                  {(active.naVierWeken ?? []).slice(0, 4).map((r) => (
                    <li key={r} className="flex gap-3 text-sm md:text-base">
                      <Check className="w-4 h-4 mt-1 text-primary shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 md:mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Meer weten over onze aanpak voor {active.title.toLowerCase()}?
              </p>
              <Link
                to={`/sectoren/${active.slug}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                Bekijk de sectorpagina
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SectorPicker;