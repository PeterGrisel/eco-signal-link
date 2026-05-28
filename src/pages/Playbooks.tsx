import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import CtaSection from "@/components/CtaSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
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

          {/* Hero */}
          <section className="relative pt-32 md:pt-40 pb-12 md:pb-16">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  Playbooks
                </p>
                <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tighter leading-[1.04] mb-6 [text-shadow:0_2px_24px_hsl(var(--background))]">
                  Groei-scenario's,{" "}
                  <span className="text-gradient">stap voor stap.</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Praktische gidsen voor concrete B2B-situaties, gebouwd op De
                  Groeistack en onze methode. Elke dag een nieuwe.
                </p>
              </motion.div>
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {items.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: (i % 6) * 0.04 }}
                  >
                    <Link
                      to={`/playbooks/${p.slug}`}
                      className="group card-gradient border-glow rounded-2xl p-6 flex flex-col h-full hover:border-primary/30 transition-colors"
                    >
                      {p.service_line && (
                        <span className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary/80 mb-3">
                          {p.service_line}
                        </span>
                      )}
                      <h2 className="font-display font-bold text-xl leading-tight mb-3 group-hover:text-primary transition-colors">
                        {p.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                        {p.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                        Lees playbook <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </motion.div>
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
