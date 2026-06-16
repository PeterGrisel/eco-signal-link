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

interface PlaybookRow {
  slug: string;
  title: string;
  excerpt?: string | null;
  meta_description?: string | null;
  content: string;
  service_line?: string | null;
  audience?: string | null;
  tools?: string[] | null;
}

const sb = supabase as unknown as { from: (t: string) => any };

const PlaybookPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pb, setPb] = useState<PlaybookRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await sb
        .from("playbooks")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      setPb((data as PlaybookRow) || null);
      setLoading(false);
    })();
  }, [slug]);

  usePageMeta({
    title: pb ? `${pb.title} | Playbook — B2BGroeiMachine` : "Playbook — B2BGroeiMachine",
    description: pb?.meta_description || pb?.excerpt || "Een GTM-playbook van B2BGroeiMachine.",
    canonical: `https://www.b2bgroeimachine.io/playbooks/${slug}`,
  });

  if (!loading && !pb) return <Navigate to="/playbooks" replace />;

  return (
    <PageLoader>
      <div className="min-h-screen relative">
        <AmbientBackdrop />
        <div className="relative z-10">
          {pb && (
            <BreadcrumbJsonLd
              items={[
                { name: "Home", url: "https://www.b2bgroeimachine.io/" },
                { name: "Playbooks", url: "https://www.b2bgroeimachine.io/playbooks" },
                { name: pb.title, url: `https://www.b2bgroeimachine.io/playbooks/${pb.slug}` },
              ]}
            />
          )}
          <Navbar />

          <article className="container mx-auto px-4 md:px-6 max-w-3xl pt-32 md:pt-40 pb-12">
            <Link
              to="/playbooks"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Alle playbooks
            </Link>

            {loading || !pb ? (
              <p className="text-muted-foreground">Laden...</p>
            ) : (
              <>
                <header className="mb-8">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {pb.service_line && <Badge variant="secondary">{pb.service_line}</Badge>}
                    {pb.audience && <Badge variant="outline">{pb.audience}</Badge>}
                  </div>
                  <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-[1.05] mb-4 [text-shadow:0_2px_24px_hsl(var(--background))]">
                    {pb.title}
                  </h1>
                  {pb.excerpt && (
                    <p className="text-lg text-muted-foreground leading-relaxed">{pb.excerpt}</p>
                  )}
                </header>

                {pb.tools && pb.tools.length > 0 && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mb-8">
                    <p className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-primary/90 mb-3">
                      Uit De Groeistack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pb.tools.map((t) => (
                        <span key={t} className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-foreground/80">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-display prose-headings:text-foreground prose-headings:tracking-tight
                    prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-5
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-li:text-muted-foreground prose-li:leading-relaxed
                    prose-ul:my-4 prose-ol:my-4"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{pb.content}</ReactMarkdown>
                </div>
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

export default PlaybookPost;
