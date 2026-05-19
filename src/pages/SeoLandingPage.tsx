import { useEffect } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import CtaSection from "@/components/CtaSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
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

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs mb-6">
                <Sparkles className="w-3 h-3" /> {page.keyword}
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                {page.h1}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">{page.intro}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/contact">Plan een kennismaking <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/pipeline-equation">Bereken uw pipeline</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problems */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.h2 {...fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {page.problemTitle}
            </motion.h2>
            <ul className="mt-8 grid md:grid-cols-2 gap-4">
              {page.problems.map((p, i) => (
                <motion.li
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex gap-3 p-5 rounded-lg border border-border bg-card"
                >
                  <span className="text-primary mt-1">—</span>
                  <span className="text-foreground/90">{p}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Solution + features */}
        <section className="py-20 border-t border-border bg-card/30">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.h2 {...fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {page.solutionTitle}
            </motion.h2>
            <motion.p {...fadeUp} className="text-lg text-muted-foreground max-w-2xl mb-12">
              {page.solutionLead}
            </motion.p>
            <div className="grid md:grid-cols-2 gap-6">
              {page.features.map((f, i) => (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="p-6 rounded-xl border border-border bg-background"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="w-5 h-5 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.h2 {...fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
              {page.proofTitle}
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {page.proof.map((r, i) => (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="p-8 rounded-xl border border-border bg-card text-center"
                >
                  <div className="font-display text-5xl font-bold text-primary mb-2">{r.metric}</div>
                  <div className="text-muted-foreground">{r.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 border-t border-border bg-card/30">
          <div className="container mx-auto px-6 max-w-3xl">
            <motion.h2 {...fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
              Veelgestelde vragen
            </motion.h2>
            <div className="space-y-4">
              {page.faqs.map((f, i) => (
                <motion.details
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group p-6 rounded-lg border border-border bg-background"
                >
                  <summary className="cursor-pointer font-display text-lg font-semibold text-foreground list-none flex items-center justify-between">
                    {f.q}
                    <span className="text-primary transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{f.a}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* Related solutions */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              Verwante oplossingen
            </motion.h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {page.relatedSolutions.map((r) => (
                <Link
                  key={r.slug}
                  to={`/solutions/${r.slug}`}
                  className="p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors flex items-center justify-between group"
                >
                  <span className="text-foreground">{r.label}</span>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
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
