import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { usePageMeta } from "@/hooks/usePageMeta";

interface AbmRow {
  slug: string;
  company_name: string;
  payload: any;
  status: string;
  expires_at: string;
}

const sb = supabase as unknown as { from: (t: string) => any; rpc: (n: string, a?: any) => any };

const AbmPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [row, setRow] = useState<AbmRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await sb
        .from("abm_pages")
        .select("slug, company_name, payload, status, expires_at")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setRow(data as AbmRow);
      setLoading(false);
      // Fire-and-forget view counter
      sb.rpc("increment_abm_view", { _slug: slug }).then(() => {}, () => {});
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const p = row?.payload || {};
  const title: string = p.recommendedVisualTitle || p.title || p.headline ||
    (row ? `Een groeimachine op maat voor ${row.company_name}` : "");
  const intro: string = p.intro || p.description || p.reasoning || "";
  const cta: string = p.cta || "Plan een korte kennismaking";
  const ctaUrl: string = p.ctaUrl || p.cta_url || "/contact";
  const services: string[] = Array.isArray(p.services) ? p.services : [];
  const opportunity: string = p.commercialOpportunity || p.opportunity || "";
  const branding = p.branding || {};
  const primary: string | undefined = branding.primary || branding.primaryColor || p.primaryColor;
  const accent: string | undefined = branding.accent || branding.accentColor || p.accentColor;
  const logoUrl: string | undefined = branding.logo || branding.logoUrl || p.logoUrl;
  const heroImage: string | undefined = p.imageUrl || p.image || p.heroImage;

  usePageMeta({
    title: row ? `${row.company_name} × B2BGroeiMachine` : "B2BGroeiMachine",
    description: intro.slice(0, 155),
    canonical: row ? `https://b2bgroeimachine.io/voor/${row.slug}` : undefined,
    noindex: true,
  });

  if (loading) return <div className="min-h-screen" />;
  if (notFound || !row) return <Navigate to="/404" replace />;
  if (row.status !== "live" || new Date(row.expires_at) < new Date()) {
    return (
      <PageLoader>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center px-6">
            <div className="text-center max-w-md">
              <h1 className="text-3xl font-display mb-3">Deze pagina is verlopen</h1>
              <p className="text-muted-foreground mb-6">
                De voorbeeldpagina voor {row.company_name} is niet meer actief.
              </p>
              <Button asChild><a href="/contact">Neem contact op</a></Button>
            </div>
          </main>
          <Footer />
        </div>
      </PageLoader>
    );
  }

  const customStyle = primary
    ? ({ "--brand": primary, "--brand-accent": accent || primary } as React.CSSProperties)
    : undefined;

  return (
    <PageLoader>
      <div className="min-h-screen flex flex-col bg-background" style={customStyle}>
        <Navbar />
        <main className="flex-1">
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-border">
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={primary ? { background: `radial-gradient(60% 50% at 50% 0%, ${primary}, transparent 70%)` } : undefined}
            />
            <div className="container mx-auto px-6 pt-28 pb-20 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs uppercase tracking-wider text-muted-foreground mb-6">
                  {logoUrl ? (
                    <img src={logoUrl} alt={row.company_name} className="h-4 w-auto" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Voor {row.company_name}
                </div>
                <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6">
                  {title}
                </h1>
                {intro && (
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                    {intro}
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    style={primary ? { backgroundColor: primary, color: "#fff", borderColor: primary } : undefined}
                  >
                    <a href={ctaUrl}>{cta} <ArrowRight className="ml-2 h-4 w-4" /></a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Hero image */}
          {heroImage && (
            <section className="container mx-auto px-6 -mt-10 mb-16 relative z-10">
              <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
                <img src={heroImage} alt={title} className="w-full h-auto block" />
              </div>
            </section>
          )}

          {/* Services */}
          {services.length > 0 && (
            <section className="container mx-auto px-6 py-16">
              <div className="max-w-3xl mb-10">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Wat we voor u inzetten</p>
                <h2 className="font-display text-3xl md:text-4xl">
                  Concrete oplossingen voor {row.company_name}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="p-5 rounded-xl border border-border bg-card hover:bg-card/60 transition-colors"
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center mb-3"
                      style={primary ? { backgroundColor: `${primary}1A`, color: primary } : { backgroundColor: "hsl(var(--accent))" }}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium leading-snug">{s}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Opportunity / closing */}
          {opportunity && (
            <section className="container mx-auto px-6 py-16 border-t border-border">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Onze inschatting</p>
                <p className="text-xl md:text-2xl leading-relaxed font-display">{opportunity}</p>
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="container mx-auto px-6 py-20">
            <div
              className="rounded-2xl p-10 md:p-14 border border-border relative overflow-hidden"
              style={primary ? { background: `linear-gradient(135deg, ${primary}14, transparent)` } : undefined}
            >
              <h3 className="font-display text-3xl md:text-4xl max-w-2xl mb-4">
                Klaar om dit voor {row.company_name} in te richten?
              </h3>
              <p className="text-muted-foreground max-w-xl mb-6">{cta}</p>
              <Button
                asChild
                size="lg"
                style={primary ? { backgroundColor: primary, color: "#fff", borderColor: primary } : undefined}
              >
                <a href={ctaUrl}>Plan een gesprek <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default AbmPage;