import { useEffect } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, AlertTriangle, Compass, Target, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import CtaSection from "@/components/CtaSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import InfographicStats from "@/components/blog/InfographicStats";
import InfographicProcessFlow from "@/components/blog/InfographicProcessFlow";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { seoLandingPages } from "@/data/seoLandingPages";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const SeoLandingPage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  const page = seoLandingPages.find((p) => p.slug === slug);

  if (!page) return <Navigate to="/404" replace />;

  const canonical = `https://b2bgroeimachine.io/${page.slug}`;

  usePageMeta({
    title: page.metaTitle,
    description: page.metaDescription,
    canonical,
  });

  // FAQ JSON-LD
  useEffect(() => {
    const id = "faq-jsonld";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    return () => { script?.remove(); };
  }, [page]);

  const sections = [
    { id: "probleem", label: "Probleem" },
    { id: "aanpak", label: "Aanpak" },
    { id: "richting", label: "Richting" },
    { id: "faq", label: "Vragen" },
  ];

  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://b2bgroeimachine.io/" },
            { name: page.keyword, url: canonical },
          ]}
        />
        <Navbar />

        {/* Editorial Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <motion.div {...fadeUp} className="mb-6 flex items-center gap-3 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="opacity-40">/</span>
              <span className="text-primary">{page.keyword}</span>
            </motion.div>

            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs mb-8 uppercase tracking-wider font-semibold">
                <Sparkles className="w-3 h-3" /> Gids voor {page.keyword}
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[1.05] tracking-tight mb-8">
                {page.h1}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10 leading-relaxed font-light">
                {page.intro}
              </p>
              <div className="flex flex-wrap gap-3 mb-12">
                <Button asChild size="lg">
                  <Link to="/contact">Plan een kennismaking <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/pipeline-equation">Bereken uw pipeline</Link>
                </Button>
              </div>

              {/* Editorial meta strip */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/60 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> 5 min lezen
                </span>
                <span className="opacity-40">·</span>
                <span>In deze gids:</span>
                <div className="flex flex-wrap gap-2">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="px-3 py-1 rounded-full border border-border bg-card hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problems — editorial pull-quote feel */}
        <section id="probleem" className="py-24 border-t border-border scroll-mt-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div {...fadeUp} className="mb-12">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                <AlertTriangle className="w-3.5 h-3.5" /> Het probleem
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {page.problemTitle}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
              {page.problems.map((p, i) => (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="p-8 bg-card flex gap-5"
                >
                  <span className="font-display text-3xl font-bold text-primary/60 leading-none shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg text-foreground/90 leading-relaxed">{p}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution + features as Process Flow infographic */}
        <section id="aanpak" className="py-24 border-t border-border bg-card/30 scroll-mt-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div {...fadeUp} className="mb-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                <Compass className="w-3.5 h-3.5" /> De aanpak
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {page.solutionTitle}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                {page.solutionLead}
              </p>
            </motion.div>

            <InfographicProcessFlow
              title="Vier bouwstenen, één systeem"
              phases={page.features.map((f, i) => ({
                title: f.title,
                icon: ["target", "brain", "zap", "chart"][i % 4],
                items: [f.description],
              }))}
            />
          </div>
        </section>

        {/* Proof as InfographicStats */}
        <section id="richting" className="py-24 border-t border-border scroll-mt-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div {...fadeUp} className="mb-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                <Target className="w-3.5 h-3.5" /> De richting
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {page.proofTitle}
              </h2>
            </motion.div>

            <InfographicStats
              title="Doelen die we samen scherp maken"
              stats={page.proof.map((p) => ({ value: p.metric, label: p.label }))}
            />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 border-t border-border bg-card/30 scroll-mt-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <motion.div {...fadeUp} className="mb-12">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Veelgestelde vragen
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Wat klanten vaak willen weten
              </h2>
            </motion.div>
            <div className="space-y-3">
              {page.faqs.map((f, i) => (
                <motion.details
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group rounded-xl border border-border bg-background overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <summary className="cursor-pointer p-6 font-display text-lg font-semibold text-foreground list-none flex items-center justify-between gap-4">
                    <span className="flex items-baseline gap-4">
                      <span className="text-primary/60 text-sm font-mono shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {f.q}
                    </span>
                    <span className="text-primary text-2xl leading-none transition-transform group-open:rotate-45 shrink-0">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pl-[4.25rem]">
                    <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* Related solutions — editorial cards */}
        <section className="py-24 border-t border-border scroll-mt-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div {...fadeUp} className="mb-10 flex items-end justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                  <ArrowRight className="w-3.5 h-3.5" /> Lees verder
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Verwante oplossingen
                </h2>
              </div>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-4">
              {page.relatedSolutions.map((r, i) => (
                <motion.div
                  key={r.slug}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    to={`/solutions/${r.slug}`}
                    className="block p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/60 transition-all group h-full"
                  >
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                      Oplossing
                    </div>
                    <div className="font-display text-lg font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {r.label}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary opacity-60 group-hover:opacity-100 transition-opacity">
                      Bekijken <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CtaSection />
        <Footer />
      </div>
    </PageLoader>
  );
};

export default SeoLandingPage;
