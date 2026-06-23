import { motion } from "framer-motion";
import { Target, Send, BarChart3, Rocket, Star, type LucideIcon } from "lucide-react";
import { Spotlight } from "@/components/hhwv2/ui/magic";

type Step = {
  n: number;
  title: string;
  sub: string;
  bullets: string[];
  icon: LucideIcon;
  cssVar: string;
};

const STEPS: Step[] = [
  {
    n: 1,
    title: "Define & Setup",
    sub: "Week 1—2",
    bullets: ["ICP & value proposition", "Tech stack & data setup", "Baseline & doelen"],
    icon: Target,
    cssVar: "var(--funnel-engagement)",
  },
  {
    n: 2,
    title: "Launch",
    sub: "Week 3—4",
    bullets: ["Outbound sequences live", "Content & social launch", "Early signals verzamelen"],
    icon: Send,
    cssVar: "var(--funnel-awareness)",
  },
  {
    n: 3,
    title: "Optimize",
    sub: "Maand 2",
    bullets: ["Data & intent optimalisatie", "A/B testen & itereren", "Meer kwalificaties"],
    icon: BarChart3,
    cssVar: "var(--funnel-conversion)",
  },
  {
    n: 4,
    title: "Scale",
    sub: "Maand 3",
    bullets: ["Winnende flows opschalen", "Team & process alignment", "Pipeline versnellen"],
    icon: Rocket,
    cssVar: "var(--primary)",
  },
  {
    n: 5,
    title: "Expand",
    sub: "Na dag 90",
    bullets: ["Nieuwe segmenten", "Additional channels", "Continue growth"],
    icon: Star,
    cssVar: "var(--funnel-sales)",
  },
];

const ExactNinetyDays = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <p className="text-primary font-display font-semibold text-[11px] tracking-[0.22em] uppercase mb-3">
          Het 90-dagen plan
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
          Wat gebeurt er in de <span className="font-serif italic text-gradient-animate">eerste 90 dagen</span>
        </h2>
        <p className="text-muted-foreground text-base">
          Een heldere route van fundament naar schaalbare omzetbeweging.
        </p>
      </div>

      <div className="relative">
        {/* connecting timeline line (desktop) */}
        <div className="pointer-events-none absolute left-[10%] right-[10%] top-6 hidden md:block h-0.5 overflow-hidden rounded-full">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="h-full w-full origin-left"
            style={{
              background:
                "linear-gradient(to right, hsl(var(--funnel-engagement)), hsl(var(--funnel-awareness)), hsl(var(--funnel-conversion)), hsl(var(--primary)), hsl(var(--funnel-sales)))",
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 md:gap-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col"
              style={{ ["--c" as string]: s.cssVar }}
            >
              {/* node on the line */}
              <div className="relative z-10 mb-5 flex justify-center">
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background">
                  <span
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor: "hsl(var(--c) / 0.6)",
                      background: "hsl(var(--c) / 0.12)",
                      boxShadow: "0 0 24px -4px hsl(var(--c) / 0.6)",
                    }}
                  />
                  <span className="relative font-display font-bold text-base" style={{ color: "hsl(var(--c))" }}>
                    {s.n}
                  </span>
                </span>
              </div>

              {/* card */}
              <div className="group relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-[hsl(var(--c)/0.2)] bg-card/60 backdrop-blur p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--c)/0.5)] hover:shadow-[0_22px_50px_-22px_hsl(var(--c)/0.55)]">
                <Spotlight size={300} fill="hsl(var(--c) / 0.1)" />
                {/* top accent */}
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-0.5"
                  style={{ background: "linear-gradient(to right, transparent, hsl(var(--c) / 0.7), transparent)" }}
                />

                <p className="relative text-[11px] font-display font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  {s.sub}
                </p>
                <p className="relative font-display font-bold text-lg text-foreground mb-3">{s.title}</p>
                <ul className="relative space-y-2 mb-5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[12px] text-muted-foreground leading-snug">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "hsl(var(--c))" }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <span
                  className="relative mt-auto flex h-9 w-9 items-center justify-center rounded-lg border"
                  style={{ borderColor: "hsl(var(--c) / 0.3)", background: "hsl(var(--c) / 0.1)" }}
                >
                  <s.icon className="h-4 w-4" strokeWidth={1.8} style={{ color: "hsl(var(--c))" }} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ExactNinetyDays;
