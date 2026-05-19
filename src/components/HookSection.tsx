import { motion } from "framer-motion";
import { Hand, AlarmClock, EyeOff, ArrowRight } from "lucide-react";

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
          className="max-w-3xl mb-14 md:mb-20"
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
            Niet omdat uw team niet hard werkt. Maar omdat het proces eronder
            ontbreekt. Dit is wat ondernemers ons elke week vertellen.
          </p>
        </motion.div>

        {/* Pain cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
          {hooks.map((hook, i) => (
            <motion.article
              key={hook.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-card p-7 md:p-9 flex flex-col hover:bg-secondary/30 transition-colors duration-300"
            >
              {/* Number + icon row */}
              <div className="flex items-center justify-between mb-7">
                <span className="font-mono text-xs text-muted-foreground/70 tracking-widest">
                  0{i + 1} / 03
                </span>
                <hook.icon className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
              </div>

              {/* Customer quote — the pain in their own voice */}
              <blockquote className="mb-6">
                <p className="font-display text-xl md:text-2xl leading-snug text-foreground tracking-tight">
                  <span className="text-primary/60">“</span>
                  {hook.quote}
                  <span className="text-primary/60">”</span>
                </p>
              </blockquote>

              {/* Label */}
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-primary/80 mb-3">
                {hook.title}
              </p>

              {/* Pain description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {hook.pain}
              </p>

              {/* Resolution — pushed to bottom */}
              <div className="mt-auto pt-5 border-t border-border/50 flex items-start gap-2.5">
                <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                  {hook.shift}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HookSection;
