import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import InfiniteSlider from "./ui/InfiniteSlider";

const SECTORS = [
  "B2B SaaS",
  "Maakindustrie",
  "Zakelijke dienstverlening",
  "Logistiek",
  "Bouw",
  "Tech-scale-ups",
  "Groothandel",
  "Engineering",
  "Installatie",
  "AgriTech",
];

const CASES = [
  {
    eyebrow: "Case study",
    title: "Van founder-led naar voorspelbare pipeline",
    pitch:
      "Hoe een B2B-SaaS-team binnen 90 dagen 2 nieuwe gesprekken per dag opbouwde via signaal-getriggerde outbound.",
    href: "/klanten",
    badge: "B2B SaaS",
    metric: "+ 2 gesprekken / dag",
  },
  {
    eyebrow: "Case study",
    title: "€3M pipeline in 3 maanden",
    pitch:
      "Hoe een scale-up de outbound-engine opnieuw bouwde en in één kwartaal de omzet verdubbelde.",
    href: "/klanten",
    badge: "Maakindustrie",
    metric: "€3M pipeline",
  },
];

const LogoWallCases = () => {
  return (
    <section className="relative py-16 md:py-24 border-y border-primary/10">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-[11px] font-display font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-6">
          B2B-teams die met ons bouwen aan voorspelbare groei
        </p>
        <InfiniteSlider
          speed={40}
          items={SECTORS.map((s) => (
            <span
              key={s}
              className="inline-flex items-center rounded-full border border-primary/25 bg-card/40 px-5 py-2 text-sm font-display font-semibold tracking-wide text-foreground/80"
            >
              {s}
            </span>
          ))}
        />
        <div className="mt-12 grid md:grid-cols-2 gap-4 md:gap-6">
          {CASES.map((c, i) => (
            <motion.a
              key={c.title}
              href={c.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-primary/20 card-gradient p-6 md:p-8 flex flex-col min-h-[260px] transition-transform hover:-translate-y-1"
            >
              <div className="absolute -right-4 -top-4 font-serif italic text-[7rem] md:text-[9rem] leading-none text-primary/10 select-none pointer-events-none">
                {c.metric.split(" ")[0]}
              </div>
              <div className="relative flex items-center justify-between mb-4">
                <span className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-primary/80">
                  {c.eyebrow}
                </span>
                <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                  {c.badge}
                </span>
              </div>
              <h3 className="relative font-display font-bold text-2xl md:text-3xl leading-tight mb-3">
                {c.title}
              </h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
                {c.pitch}
              </p>
              <span className="relative mt-auto inline-flex items-center gap-2 text-primary font-medium text-sm transition-all group-hover:gap-3">
                Lees de case
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoWallCases;