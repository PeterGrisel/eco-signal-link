import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  Database,
  Send,
  Workflow,
  Sparkles,
  BarChart3,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CtaSection from "@/components/CtaSection";
import GroeistackLeadCapture from "@/components/GroeistackLeadCapture";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import {
  groeistackCategories,
  groeistackSeed,
  faviconFor,
  type GroeistackCategory,
} from "@/data/groeistack";

interface ToolRow {
  name: string;
  category: string;
  description: string;
  website: string;
  logo_url?: string | null;
}

const iconMap: Record<GroeistackCategory["icon"], LucideIcon> = {
  radar: Radar,
  database: Database,
  send: Send,
  workflow: Workflow,
  sparkles: Sparkles,
  barchart: BarChart3,
};

const seedRows: ToolRow[] = groeistackSeed.map((t) => ({ ...t, logo_url: null }));

const LogoBadge = ({ tool }: { tool: ToolRow }) => {
  const [err, setErr] = useState(false);
  const src = tool.logo_url || faviconFor(tool.website);
  return (
    <span className="w-10 h-10 rounded-xl border border-foreground/10 bg-white overflow-hidden flex items-center justify-center shrink-0">
      {err || !src ? (
        <span className="text-sm font-display font-bold text-neutral-700">
          {tool.name[0]}
        </span>
      ) : (
        <img
          src={src}
          alt={tool.name}
          className="w-6 h-6 object-contain"
          loading="lazy"
          onError={() => setErr(true)}
        />
      )}
    </span>
  );
};

const Groeistack = () => {
  const [tools, setTools] = useState<ToolRow[]>(seedRows);

  usePageMeta({
    title: "De Groeistack — onze AI- en GTM-toolstack | B2BGroeiMachine",
    description:
      "De beste AI- en GTM-tools, gecureerd en geïntegreerd in uw eigen systemen. Van signalen en verrijking tot outreach, CRM en attributie.",
    canonical: "https://b2bgroeimachine.io/groeistack",
  });

  useEffect(() => {
    (async () => {
      // groeistack_tools staat (nog) niet in de gegenereerde types
      const sb = supabase as unknown as {
        from: (t: string) => any;
      };
      const { data, error } = await sb
        .from("groeistack_tools")
        .select("name, category, description, website, logo_url")
        .eq("published", true)
        .order("category")
        .order("sort_order");
      if (!error && Array.isArray(data) && data.length) {
        setTools(data as ToolRow[]);
      }
    })();
  }, []);

  return (
    <PageLoader>
      <div className="min-h-screen relative">
        <AmbientBackdrop />
        <div className="relative z-10">
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: "https://b2bgroeimachine.io/" },
              { name: "De Groeistack", url: "https://b2bgroeimachine.io/groeistack" },
            ]}
          />
          <Navbar />

          {/* Hero */}
          <section className="relative pt-32 md:pt-40 pb-12 md:pb-16">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  De Groeistack
                </p>
                <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tighter leading-[1.04] mb-6 [text-shadow:0_2px_24px_hsl(var(--background))]">
                  De beste tools.{" "}
                  <span className="text-gradient">Eén systeem.</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Wij zijn geen tool. Wij kennen de beste AI- en GTM-tools en
                  smeden ze tot één werkend systeem, in uw eigen stack. Data en
                  tools blijven van u.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Lead Capture bovenaan de pagina */}
          <GroeistackLeadCapture />

          {/* Categorieën */}
          <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-20 space-y-12 md:space-y-16">
            {groeistackCategories.map((cat) => {
              const Icon = iconMap[cat.icon];
              const items = tools.filter((t) => t.category === cat.key);
              if (items.length === 0) return null;
              return (
                <section key={cat.key}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h2 className="font-display font-bold text-xl md:text-2xl leading-tight">
                        {cat.label}
                      </h2>
                      <p className="text-sm text-muted-foreground">{cat.blurb}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {items.map((tool, i) => (
                      <motion.a
                        key={tool.name}
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: i * 0.03 }}
                        className="group card-gradient border-glow rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 transition-colors"
                      >
                        <LogoBadge tool={tool} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <h3 className="font-display font-bold text-base truncate">
                              {tool.name}
                            </h3>
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </section>
              );
            })}

            <div className="text-center pt-8 max-w-lg mx-auto space-y-4">
              <p className="font-display font-bold text-xl md:text-2xl text-foreground">
                Ziet u door de tools de omzet niet meer? 😉
              </p>
              <p className="text-muted-foreground">
                Wij adviseren u graag persoonlijk over wat echt werkt voor uw pijplijn.
              </p>
              <p className="text-[11px] text-muted-foreground/60 pt-4">
                Onze gecureerde selectie. Geen lock-in: wij bouwen het in uw eigen
                stack en u blijft eigenaar van uw data.
              </p>
            </div>
          </div>

          <CtaSection />
          <Footer />
        </div>
      </div>
    </PageLoader>
  );
};

export default Groeistack;
