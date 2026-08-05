import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import CtaSection from "@/components/CtaSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { Badge } from "@/components/ui/badge";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";

interface TermRow {
  slug: string;
  term: string;
  short_def: string;
  meta_description?: string | null;
  content: string;
  category?: string | null;
  related_terms?: string[] | null;
}

const sb = supabase as unknown as { from: (t: string) => any };

const WoordenboekPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [t, setT] = useState<TermRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<{ term: string; slug: string }[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await sb
        .from("glossary_terms")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      setT((data as TermRow) || null);
      setLoading(false);
      const names = (data as TermRow | null)?.related_terms || [];
      if (names.length) {
        const { data: rel } = await sb
          .from("glossary_terms")
          .select("term, slug")
          .in("term", names)
          .eq("status", "published");
        setRelated((rel as any) || []);
      }
    })();
  }, [slug]);

  usePageMeta({
    title: t ? `${t.term} — definitie | Woordenboek B2BGroeiMachine` : "Woordenboek — B2BGroeiMachine",
    description: t?.meta_description || t?.short_def || "Een term uit het B2B-groei woordenboek.",
    canonical: `https://www.b2bgroeimachine.io/woordenboek/${slug}`,
  });

  if (!loading && !t) return <Navigate to="/woordenboek" replace />;

  return (
    <PageLoader>
      <div className="min-h-screen relative">
        <AmbientBackdrop />
        <div className="relative z-10">
          {t && (
            <BreadcrumbJsonLd
              items={[
                { name: "Home", url: "https://www.b2bgroeimachine.io/" },
                { name: "Woordenboek", url: "https://www.b2bgroeimachine.io/woordenboek" },
                { name: t.term, url: `https://www.b2bgroeimachine.io/woordenboek/${t.slug}` },
              ]}
            />
          )}
          <Navbar />

          <article className="container mx-auto px-4 md:px-6 max-w-3xl pt-32 md:pt-40 pb-12">
            <Link
              to="/woordenboek"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Hele woordenboek
            </Link>

            {loading || !t ? (
              <p className="text-muted-foreground">Laden...</p>
            ) : (
              <>
                <header className="mb-8">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {t.category && <Badge variant="secondary">{t.category}</Badge>}
                  </div>
                  <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-[1.05] mb-4 [text-shadow:0_2px_24px_hsl(var(--background))]">
                    {t.term}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">{t.short_def}</p>
                </header>

                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-display prose-headings:text-foreground prose-headings:tracking-tight
                    prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-5
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-li:text-muted-foreground prose-li:leading-relaxed
                    prose-ul:my-4 prose-ol:my-4"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.content}</ReactMarkdown>
                </div>

                {related.length > 0 && (
                  <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                    <p className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-primary/90 mb-3">
                      Verwante termen
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {related.map((r) => (
                        <Link
                          key={r.slug}
                          to={`/woordenboek/${r.slug}`}
                          className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors"
                        >
                          {r.term}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </article>

          <CtaSection />
          <Footer />
        </div>
      </div>
    </PageLoader>
  );
};

export default WoordenboekPost;