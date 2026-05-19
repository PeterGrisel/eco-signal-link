import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand, AlarmClock, EyeOff, ArrowRight, Plus, Minus } from "lucide-react";

const hooks = [
  {
    icon: Hand,
    quote: "We doen dit al jaren zo, met de hand.",
    title: "Handmatig werk dat blijft hangen",
    pain: "Offertes, opvolging en data-invoer slokken uren op. De beste mensen zijn bezig met werk dat een systeem zou moeten doen.",
    shift: "Wij brengen het in kaart en automatiseren wat herhaalt.",
  },
  {
    icon: AlarmClock,
    quote: "We wachten tot de klant zich meldt.",
    title: "Reactief in plaats van vooruit",
    pain: "Uw team reageert op binnenkomende vragen, maar mist de signalen die er écht toe doen. Pijplijn voelt elke maand opnieuw onzeker.",
    shift: "Wij draaien het om: van wachten naar weten wanneer u moet bellen.",
  },
  {
    icon: EyeOff,
    quote: "We zien pas dat ze weg zijn als ze al weg zijn.",
    title: "Signalen die u nu niet ziet",
    pain: "Klanten geven hints af: een nieuwe rol, een wisseling van leverancier, een groeispurt. Die signalen verdwijnen in ruis.",
    shift: "Wij vangen ze op en zetten ze om in een gesprek op het juiste moment.",
  },
];

const HookSection = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);
  return (
    <section className="py-20 md:py-28 border-b border-border/30 relative overflow-hidden">
      {/* Subtle background grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Editorial header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-10 md:mb-14"
        >
          <p className="text-primary font-display font-semibold text-xs tracking-[0.25em] uppercase mb-5">
            Herkent u dit?
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            Drie momenten waarop sales{" "}
            <span className="text-muted-foreground/60">stilstaat</span>
            <span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-5 max-w-2xl">
            Uw salesproces hangt te veel aan mensen, losse acties en toevallige
            timing. Dit is wat ondernemers ons elke week vertellen.
          </p>
        </motion.div>

        {/* Accordion list — compact, one open at a time */}
        <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/40 backdrop-blur-sm divide-y divide-border/40">
          {hooks.map((hook, i) => {
            const isOpen = openIndex === i;
            const Icon = hook.icon;
            return (
              <div key={hook.title} className="group">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full text-left flex items-center gap-4 md:gap-6 px-5 md:px-8 py-5 md:py-6 hover:bg-secondary/30 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-mono text-xs text-muted-foreground/70 tracking-widest shrink-0 w-12">
                    0{i + 1}/03
                  </span>
                  <Icon className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? "text-primary" : "text-primary/60"}`} />
                  <p className="flex-1 font-display text-base md:text-xl leading-snug tracking-tight text-foreground">
                    <span className="text-primary/60">“</span>
                    {hook.quote}
                    <span className="text-primary/60">”</span>
                  </p>
                  <span className="shrink-0 w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-8 pb-6 md:pb-8 md:pl-[7.5rem] grid md:grid-cols-2 gap-6 md:gap-10">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-primary/80 mb-2">
                            {hook.title}
                          </p>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {hook.pain}
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5 md:border-l md:border-border/50 md:pl-6">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                            {hook.shift}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HookSection;
