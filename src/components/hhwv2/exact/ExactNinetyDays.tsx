import { motion } from "framer-motion";
import { Target, Send, BarChart3, Rocket, Star } from "lucide-react";

const STEPS = [
  {
    n: 1,
    title: "Define & Setup",
    sub: "Week 1—2",
    bullets: ["ICP & value proposition", "Tech stack & data setup", "Baseline & doelen"],
    icon: Target,
    tint: "bg-[hsl(var(--funnel-engagement))]/20 text-[hsl(var(--funnel-engagement))]",
  },
  {
    n: 2,
    title: "Launch",
    sub: "Week 3—4",
    bullets: ["Outbound sequences live", "Content & social launch", "Early signals verzamelen"],
    icon: Send,
    tint: "bg-[hsl(var(--funnel-awareness))]/20 text-[hsl(var(--funnel-awareness))]",
  },
  {
    n: 3,
    title: "Optimize",
    sub: "Maand 2",
    bullets: ["Data & intent optimalisatie", "A/B testen & itereren", "Meer kwalificaties"],
    icon: BarChart3,
    tint: "bg-primary/20 text-primary",
  },
  {
    n: 4,
    title: "Scale",
    sub: "Maand 3",
    bullets: ["Winnende flows opschalen", "Team & process alignment", "Pipeline versnellen"],
    icon: Rocket,
    tint: "bg-[hsl(var(--funnel-conversion))]/20 text-[hsl(var(--funnel-conversion))]",
  },
  {
    n: 5,
    title: "Expand",
    sub: "Na dag 90",
    bullets: ["Nieuwe segmenten", "Additional channels", "Continue growth"],
    icon: Star,
    tint: "bg-[hsl(var(--funnel-sales))]/20 text-[hsl(var(--funnel-sales))]",
  },
];

const ExactNinetyDays = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
          Wat gebeurt er in de <span className="font-serif italic text-gradient-animate">eerste 90 dagen</span>
        </h2>
        <p className="text-muted-foreground text-base">
          Een heldere route van fundament naar schaalbare omzetbeweging.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="relative rounded-xl border border-primary/20 card-gradient p-5 flex flex-col"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full font-display font-bold text-sm mb-3 ${s.tint}`}
            >
              {s.n}
            </span>
            <p className="text-[11px] text-muted-foreground mb-1">{s.sub}</p>
            <p className="font-display font-bold text-base text-foreground mb-3">{s.title}</p>
            <ul className="space-y-1.5 mb-5">
              {s.bullets.map((b) => (
                <li key={b} className="text-[12px] text-muted-foreground leading-relaxed">
                  • {b}
                </li>
              ))}
            </ul>
            <span className="mt-auto flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-card text-primary/70">
              <s.icon className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ExactNinetyDays;