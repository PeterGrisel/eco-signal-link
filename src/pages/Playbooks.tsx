import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ArrowUpRight,
  BookOpenCheck,
  Radar,
  Crosshair,
  Send,
  Network,
  Inbox,
  LineChart,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import CtaSection from "@/components/CtaSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { FeatureCard } from "@/components/blocks/grid-feature-cards";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";

interface PlaybookRow {
  slug: string;
  title: string;
  excerpt?: string | null;
  service_line?: string | null;
  audience?: string | null;
  tools?: string[] | null;
  published_at?: string | null;
}

const sb = supabase as unknown as { from: (t: string) => any };

const CORE_PLAYBOOKS = [
  { phase: "Fundament", title: "ICP & TAM", description: "Van totale markt naar tier-1, tier-2 en tier-3 accounts.", icon: Crosshair },
  { phase: "Doelgroep", title: "Signaal", description: "Vang koopintent uit jobchanges, funding en tech-stack.", icon: Radar },
  { phase: "Strategie", title: "ABM", description: "Account-based campagnes op uw tier-1 lijst.", icon: Users },
  { phase: "Activatie", title: "Outbound", description: "Multi-channel sequenties: e-mail, LinkedIn en telefoon.", icon: Send },
  { phase: "Activatie", title: "CRM Routing", description: "Elke lead verrijkt, gescoord en automatisch toegewezen.", icon: Network },
  { phase: "Sales", title: "Inbound Orchestratie", description: "Van form-fill tot geboekte meeting in minuten.", icon: Inbox },
  { phase: "Optimalisatie", title: "AI-personalisatie", description: "Relevante openers en context per account, zonder ruis.", icon: Sparkles },
  { phase: "Optimalisatie", title: "Pipeline Rapportage", description: "Eén dashboard met attributie die klopt.", icon: LineChart },
];

const Playbooks = () => {
  const [items, setItems] = useState<PlaybookRow[]>([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: "Playbooks — GTM-gidsen op basis van De Groeistack | B2BGroeiMachine",
    description:
      "Praktische, AI-gegenereerde playbooks voor concrete B2B-groei-scenario's, gebouwd op De Groeistack en onze methode.",
    canonical: "https://b2bgroeimachine.io/playbooks",
  });

  useEffect(() => {
    (async () => {
      const { data } = await sb
        .from("playbooks")
        .select("slug, title, excerpt, service_line, audience, tools, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      setItems((data as PlaybookRow[]) || []);
      setLoading(false);
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
              { name: "Playbooks", url: "https://b2bgroeimachine.io/playbooks" },
            ]}
          />
          <Navbar />

          {/* Hero met kern-playbooks geïntegreerd */}
          <section className="relative pt-32 md:pt-40 pb-12 md:pb-16">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
                  <BookOpenCheck className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary font-display font-semibold text-xs tracking-[0.2em] uppercase">
                    Playbooks
                  </span>
                </div>
                <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tighter leading-[1.04] mb-6 [text-shadow:0_2px_24px_hsl(var(--background))]">
                  Groei-scenario's,{" "}
                  <span className="text-gradient">stap voor stap.</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Praktische gidsen voor concrete B2B-situaties, gebouwd op De
                  Groeistack en onze methode. Elke dag een nieuwe.
                </p>
              </div>

              {/* Kern-playbooks — compacte index in de hero */}
              <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-card/20 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-border/60 bg-card/30">
                  <p className="text-[11px] font-display font-semibold tracking-[0.22em] uppercase text-primary/80">
                    Kern-playbooks uit het systeem
                  </p>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {CORE_PLAYBOOKS.length} stromen
                  </span>
                </div>
                <ul className="divide-y divide-border/40">
                  {CORE_PLAYBOOKS.map((pb) => (
                    <li key={pb.title}>
                      <Link
                        to="/playbooks"
                        className="group flex items-center gap-4 px-5 md:px-6 py-3.5 hover:bg-card/40 transition-colors"
                      >
                        <span className="shrink-0 w-9 h-9 rounded-lg border border-border/60 bg-background/40 flex items-center justify-center text-primary/90 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                          <pb.icon className="w-4 h-4" />
                        </span>
                        <span className="hidden sm:inline-block w-28 shrink-0 text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/70">
                          {pb.phase}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-display font-semibold text-sm md:text-base text-foreground leading-tight">
                            {pb.title}
                          </span>
                          <span className="block text-xs md:text-sm text-muted-foreground leading-snug truncate">
                            {pb.description}
                          </span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Grid */}
          <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-20">
            {loading ? (
              <p className="text-center text-muted-foreground">Laden...</p>
            ) : items.length === 0 ? (
              <div className="text-center max-w-md mx-auto rounded-2xl border border-dashed border-border/60 bg-card/30 p-10">
                <BookOpen className="w-8 h-8 text-primary/70 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  De eerste playbooks worden binnenkort gepubliceerd. Kom snel
                  terug.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(
                  items.reduce<Record<string, PlaybookRow[]>>((acc, p) => {
                    const label = p.service_line || "Overig";
                    (acc[label] ||= []).push(p);
                    return acc;
                  }, {})
                ).map(([label, group]) => (
                  <div key={label}>
                    <div className="flex items-baseline justify-between gap-4 mb-4 px-1">
                      <h2 className="font-display font-semibold text-xs tracking-[0.22em] uppercase text-primary/80">
                        {label}
                      </h2>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {group.length} {group.length === 1 ? "playbook" : "playbooks"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border border-border/60 bg-card/30 divide-x divide-y divide-border/60">
                      {group.map((p) => (
                        <Link
                          key={p.slug}
                          to={`/playbooks/${p.slug}`}
                          className="group block hover:bg-card/60 transition-colors"
                        >
                          <FeatureCard
                            feature={{
                              title: p.title,
                              description: p.excerpt || "",
                              icon: BookOpen,
                            }}
                          />
                          <div className="px-6 pb-6 -mt-2 flex items-center justify-between">
                            <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80">
                              {p.service_line || "Playbook"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                              Bekijk
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <CtaSection />
          <Footer />
        </div>
      </div>
    </PageLoader>
  );
};

export default Playbooks;
