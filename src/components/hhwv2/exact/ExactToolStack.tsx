import { useState } from "react";
import { motion } from "framer-motion";
import { Radar, Database, Send, Workflow, Sparkles, BarChart3 } from "lucide-react";
import { groeistackSeed, faviconFor, type GroeistackCategoryKey } from "@/data/groeistack";

const CATEGORIES: {
  key: GroeistackCategoryKey;
  label: string;
  blurb: string;
  icon: typeof Radar;
}[] = [
  { key: "signalen", label: "Signalen & data", blurb: "Koopintentie detecteren.", icon: Radar },
  { key: "verrijking", label: "Verrijking", blurb: "Lijsten verrijken en verifiëren.", icon: Database },
  { key: "outreach", label: "Outreach", blurb: "Multichannel benaderen op schaal.", icon: Send },
  { key: "crm", label: "CRM & pijplijn", blurb: "Eén bron van waarheid voor sales.", icon: Workflow },
  { key: "ai", label: "AI & content", blurb: "Personalisatie, content en video.", icon: Sparkles },
  { key: "dashboard", label: "Dashboard & attributie", blurb: "Meten, leren en bijsturen.", icon: BarChart3 },
];

const ToolChip = ({ name, website }: { name: string; website: string }) => {
  const [err, setErr] = useState(false);
  const src = faviconFor(website);
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-primary/15 bg-background/50 px-2.5 py-1.5">
      <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-white/90 overflow-hidden shrink-0">
        {err || !src ? (
          <span className="text-[8px] font-display font-bold text-neutral-700">{name[0]}</span>
        ) : (
          <img src={src} alt="" className="h-3 w-3 object-contain" loading="lazy" onError={() => setErr(true)} />
        )}
      </span>
      <span className="text-[11px] font-display font-medium text-foreground/80 whitespace-nowrap">{name}</span>
    </span>
  );
};

const ExactToolStack = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <p className="text-primary font-display font-semibold text-[11px] tracking-[0.22em] uppercase mb-3">
          De groeistack
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
          Gebouwd met de <span className="font-serif italic text-gradient-animate">beste tools</span>
        </h2>
        <p className="text-muted-foreground text-base">
          Wij blijven vendor-neutraal. U houdt eigenaarschap over data en systemen.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {CATEGORIES.map((cat, i) => {
          const tools = groeistackSeed.filter((t) => t.category === cat.key);
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-xl border border-primary/20 card-gradient p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                  <cat.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="font-display font-bold text-sm text-foreground leading-tight">{cat.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">{cat.blurb}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tools.map((t) => (
                  <ToolChip key={t.name} name={t.name} website={t.website} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default ExactToolStack;