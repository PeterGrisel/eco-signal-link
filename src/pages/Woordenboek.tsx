import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import CtaSection from "@/components/CtaSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";

interface TermRow {
  slug: string;
  term: string;
  short_def: string;
  category?: string | null;
}

const sb = supabase as unknown as { from: (t: string) => any };

const Woordenboek = () => {
  const [items, setItems] = useState<TermRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  usePageMeta({
    title: "Woordenboek — B2B-groei begrippen uitgelegd | B2BGroeiMachine",
    description:
      "Heldere definities voor B2B-groei, signalen, ICP, intent data en RevOps. Dagelijks aangevuld door onze AI-redactie.",
    canonical: "https://b2bgroeimachine.io/woordenboek",
  });

  useEffect(() => {
    (async () => {
      const { data } = await sb
        .from("glossary_terms")
        .select("slug, term, short_def, category")
        .eq("status", "published")
        .order("term", { ascending: true });
      setItems((data as TermRow[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (t) =>
        t.term.toLowerCase().includes(needle) ||
        (t.short_def || "").toLowerCase().includes(needle),
    );
  }, [items, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, TermRow[]>();
    for (const t of filtered) {
      const letter = (t.term[0] || "#").toUpperCase();
      const key = /[A-Z]/.test(letter) ? letter : "#";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <PageLoader>
      <div className="min-h-screen relative">
        <AmbientBackdrop />
        <div className="relative z-10">
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: "https://b2bgroeimachine.io/" },
              { name: "Woordenboek", url: "https://b2bgroeimachine.io/woordenboek" },
            ]}
          />
          <Navbar />

          <section className="relative pt-32 md:pt-40 pb-10 md:pb-14">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  Woordenboek
                </p>
                <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tighter leading-[1.04] mb-6 [text-shadow:0_2px_24px_hsl(var(--background))]">
                  B2B-groei <span className="text-gradient">in heldere woorden.</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Definities voor signalen, ICP, intent data, RevOps en alles
                  daartussenin. Dagelijks aangevuld.
                </p>

                <div className="relative mt-8 max-w-md mx-auto">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Zoek een term..."
                    className="w-full rounded-full bg-card/60 border border-border/60 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/40"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-20 max-w-5xl">
            {loading ? (
              <p className="text-center text-muted-foreground">Laden...</p>
            ) : filtered.length === 0 ? (
              <div className="text-center max-w-md mx-auto rounded-2xl border border-dashed border-border/60 bg-card/30 p-10">
                <BookOpen className="w-8 h-8 text-primary/70 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nog geen termen. De autopilot vult dit woordenboek dagelijks aan.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {grouped.map(([letter, list]) => (
                  <div key={letter}>
                    <p className="font-display font-bold text-2xl text-primary mb-4 border-b border-border/60 pb-2">
                      {letter}
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {list.map((t) => (
                        <Link
                          key={t.slug}
                          to={`/woordenboek/${t.slug}`}
                          className="group card-gradient border-glow rounded-xl p-4 hover:border-primary/30 transition-colors"
                        >
                          <p className="font-display font-semibold text-base group-hover:text-primary transition-colors mb-1">
                            {t.term}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                            {t.short_def}
                          </p>
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

export default Woordenboek;