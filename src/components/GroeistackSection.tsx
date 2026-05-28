import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Radar, Database, Send, Workflow, Sparkles, BarChart3, ArrowRight } from "lucide-react";
import { useState } from "react";
import { groeistackSeed, faviconFor, type GroeistackCategoryKey } from "@/data/groeistack";

const layers = [
  { icon: Radar,     title: "Signalen & data",         desc: "Intent- en koopsignalen plus actuele marktdata.",       category: "signalen" as GroeistackCategoryKey },
  { icon: Database,  title: "Verrijking",              desc: "Bedrijfs- en contactdata aangevuld en geverifieerd.",   category: "verrijking" as GroeistackCategoryKey },
  { icon: Send,      title: "Outreach",                desc: "E-mail, LinkedIn en telefoon in één flow.",             category: "outreach" as GroeistackCategoryKey },
  { icon: Workflow,  title: "CRM & pijplijn",          desc: "Uw eigen CRM, strak ingericht. Bijvoorbeeld HubSpot.",  category: "crm" as GroeistackCategoryKey },
  { icon: Sparkles,  title: "AI & content",            desc: "Personalisatie, video en content op schaal.",           category: "ai" as GroeistackCategoryKey },
  { icon: BarChart3, title: "Dashboard & attributie",  desc: "Eén bron van waarheid met lerende loops.",              category: "dashboard" as GroeistackCategoryKey },
];

const LogoCircle = ({ name, website }: { name: string; website: string }) => {
  const [err, setErr] = useState(false);
  const src = faviconFor(website);
  return (
    <span
      title={name}
      className="w-8 h-8 rounded-full bg-white border-2 border-card overflow-hidden flex items-center justify-center ring-1 ring-foreground/10 shrink-0"
    >
      {err || !src ? (
        <span className="text-[10px] font-display font-bold text-neutral-700">{name[0]}</span>
      ) : (
        <img
          src={src}
          alt={name}
          className="w-4 h-4 object-contain"
          loading="lazy"
          onError={() => setErr(true)}
        />
      )}
    </span>
  );
};

const GroeistackSection = () => {
  return (
    <section id="groeistack" className="py-16 md:py-32 relative">
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
            De Groeistack
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            De beste tools.
            <br />
            <span className="text-gradient">Geïntegreerd in úw systemen.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Wij zijn geen tool. Wij kennen de beste AI- en GTM-tools en smeden
            ze tot één werkend systeem, in uw eigen stack. Data en tools blijven
            van u.
          </p>
        </motion.div>

        {/* Stack-lagen */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {layers.map((l, i) => {
            const tools = groeistackSeed.filter((t) => t.category === l.category).slice(0, 4);
            return (
            <motion.div
              key={l.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="card-gradient border-glow rounded-2xl p-5 md:p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <l.icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight mb-1">
                    {l.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {l.desc}
                  </p>
                </div>
              </div>
              {tools.length > 0 && (
                <div className="flex items-center gap-2 pt-3 border-t border-border/40">
                  <div className="flex -space-x-2">
                    {tools.map((t) => (
                      <LogoCircle key={t.name} name={t.name} website={t.website} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground/80 truncate">
                    {tools.map((t) => t.name).join(" · ")}
                  </span>
                </div>
              )}
            </motion.div>
            );
          })}
        </div>

        {/* Sluit-regel + link naar de volledige Groeistack */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <Link
            to="/groeistack"
            className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all"
          >
            Bekijk de volledige Groeistack
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-muted-foreground">
            Geen lock-in. Uw stack, slimmer gemaakt.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default GroeistackSection;
