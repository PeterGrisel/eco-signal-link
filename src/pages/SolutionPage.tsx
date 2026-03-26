import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import CtaSection from "@/components/CtaSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { usePageMeta } from "@/hooks/usePageMeta";
import { solutions } from "@/data/solutions";
import { sectors } from "@/data/sectors";

// Map solution slugs to relevant sector slugs
const solutionSectorMap: Record<string, string[]> = {
  "voorspelbare-pipeline": ["zakelijke-dienstverlening", "groothandel", "leasemaatschappijen", "financiele-sector"],
  "outbound-automatisering": ["groothandel", "engineering", "maakindustrie", "opleiding-training"],
  "commercieel-talent": ["zakelijke-dienstverlening", "financiele-sector", "profvoetbal"],
  "data-gedreven-sales": ["leasemaatschappijen", "maakindustrie", "groothandel", "engineering"],
  "schaalbaar-groeisysteem": ["zakelijke-dienstverlening", "opleiding-training", "financiele-sector", "maakindustrie"],
  "internationaal-uitbreiden": ["maakindustrie", "engineering", "groothandel"],
  "versnipperde-tools": ["zakelijke-dienstverlening", "groothandel", "opleiding-training", "leasemaatschappijen"],
  "weg-uit-excel": ["groothandel", "maakindustrie", "zakelijke-dienstverlening", "opleiding-training"],
  "gerichte-prospecting": ["profvoetbal", "leasemaatschappijen", "engineering", "financiele-sector"],
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const SolutionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const solution = solutions.find((s) => s.slug === slug);

  if (!solution) return <Navigate to="/404" replace />;

  usePageMeta({
    title: solution.metaTitle,
    description: solution.metaDescription,
    canonical: `https://b2bgroeimachine.io/solutions/${solution.slug}`,
  });

  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://b2bgroeimachine.io/" },
            { name: solution.title, url: `https://b2bgroeimachine.io/solutions/${solution.slug}` },
          ]}
        />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="max-w-3xl">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-6">
                {solution.heroSubtitle}
              </p>
              <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
                {solution.heroTitle}
                <br />
                <span className="text-gradient">{solution.heroTitleGradient}</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                {solution.heroDescription}
              </p>
              <Button variant="hero" size="lg" asChild>
                <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                  Bespreek uw situatie →
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mb-12">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Het probleem
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight mb-4">
                {solution.problemTitle}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {solution.problemDescription}
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-4">
              {solution.problems.map((problem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="card-gradient border border-glow rounded-lg p-6 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-destructive text-sm font-bold">!</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{problem}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mb-16">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Onze aanpak
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight mb-4">
                {solution.solutionTitle}{" "}
                <span className="text-gradient">{solution.solutionTitleGradient}</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {solution.solutionDescription}
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-6">
              {solution.features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="card-gradient border border-glow rounded-lg p-8 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-lg">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="text-center mb-12">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Impact
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
                {solution.resultTitle}
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {solution.results.map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center card-gradient border border-glow rounded-lg p-8"
                >
                  <span className="text-primary font-display font-bold text-4xl md:text-5xl">{result.metric}</span>
                  <p className="text-muted-foreground text-sm mt-2">{result.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">
                Herkenbaar? <span className="text-gradient">Laten we praten.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Plan een vrijblijvend gesprek en ontdek hoe wij dit voor uw bedrijf oplossen.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                  Plan een gesprek →
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Related Sectors */}
        {(() => {
          const relatedSlugs = solutionSectorMap[solution.slug] || [];
          const relatedSectors = relatedSlugs
            .map((s) => sectors.find((sec) => sec.slug === s))
            .filter(Boolean);
          if (relatedSectors.length === 0) return null;
          return (
            <section className="py-24 border-t border-border">
              <div className="container mx-auto px-6">
                <motion.div {...fadeUp} className="max-w-2xl mb-12">
                  <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                    Sectoren
                  </p>
                  <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
                    Werkt in <span className="text-gradient">uw branche.</span>
                  </h2>
                </motion.div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedSectors.map((sector, i) => (
                    <motion.div
                      key={sector!.slug}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                    >
                      <Link
                        to={`/sectoren/${sector!.slug}`}
                        className="card-gradient border border-glow rounded-lg p-6 hover:border-primary/30 transition-colors group block h-full"
                      >
                        <sector.icon className="w-7 h-7 text-primary mb-4" />
                        <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {sector!.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">{sector!.description}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          Bekijk sector <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        <CtaSection />
        <Footer />
      </div>
    </PageLoader>
  );
};

export default SolutionPage;
