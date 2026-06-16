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
import GroeistackLeadCapture from "@/components/GroeistackLeadCapture";

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
    canonical: "https://www.b2bgroeimachine.io/playbooks",
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
              { name: "Home", url: "https://www.b2bgroeimachine.io/" },
              { name: "Playbooks", url: "https://www.b2bgroeimachine.io/playbooks" },
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

              {/* Kern-playbooks — bento 4x2 tiles */}
              <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/60 rounded-2xl overflow-hidden shadow-2xl">
                {CORE_PLAYBOOKS.map((pb) => (
                  <Link
                    key={pb.title}
                    to="/playbooks"
                    className="group bg-card/40 hover:bg-card/70 backdrop-blur-sm p-6 md:p-8 transition-colors flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <pb.icon className="w-6 h-6 text-primary/80 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-display font-bold uppercase tracking-[0.22em] text-primary/60 group-hover:text-primary transition-colors">
                        {pb.phase}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground/90 mb-2 group-hover:text-foreground transition-colors">
                      {pb.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {pb.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <GroeistackLeadCapture
            title="Wilt u op de hoogte blijven van alle GTM-ontwikkelingen?"
            description="Ontvang een melding zodra wij nieuwe playbooks, scenario's en strategieën delen."
            source="playbooks"
          />

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
