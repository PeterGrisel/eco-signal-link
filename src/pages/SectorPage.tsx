import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import CtaSection from "@/components/CtaSection";
import { getSectorBySlug, sectors } from "@/data/sectors";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const SectorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const sector = slug ? getSectorBySlug(slug) : undefined;

  useEffect(() => {
    if (sector) {
      document.title = sector.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", sector.metaDescription);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", sector.metaTitle);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", sector.metaDescription);
    }
    return () => {
      document.title = "B2B Groeimachine — Schaalbare Leadgeneratie & Sales Automation";
    };
  }, [sector]);

  if (!sector) return <Navigate to="/404" replace />;

  const Icon = sector.icon;

  return (
    <PageLoader>
      <div className="min-h-screen">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase">
                  {sector.title}
                </p>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
                Leadgeneratie voor
                <br />
                <span className="text-gradient">{sector.title}.</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                {sector.description}
              </p>
              <Button variant="hero" size="lg" asChild>
                <a
                  href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plan een Demo →
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid sm:grid-cols-3 gap-8 max-w-3xl">
              {sector.results.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Challenges & Solutions */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16">
              <motion.div {...fadeUp}>
                <h2 className="font-display font-bold text-2xl md:text-3xl mb-8">
                  De uitdagingen in <span className="text-primary">{sector.title}</span>
                </h2>
                <ul className="space-y-5">
                  {sector.challenges.map((c) => (
                    <li key={c} className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-muted-foreground leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
                <h2 className="font-display font-bold text-2xl md:text-3xl mb-8">
                  Onze <span className="text-gradient">aanpak</span>
                </h2>
                <ul className="space-y-5">
                  {sector.solutions.map((s) => (
                    <li key={s} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Other sectors */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="mb-12">
              <h2 className="font-display font-bold text-2xl md:text-3xl">
                Ook actief in andere sectoren
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sectors
                .filter((s) => s.slug !== sector.slug)
                .slice(0, 4)
                .map((s, i) => (
                  <motion.a
                    key={s.slug}
                    href={`/sectoren/${s.slug}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="card-gradient border border-glow rounded-lg p-6 hover:border-primary/30 transition-colors group"
                  >
                    <s.icon className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-display font-semibold text-base group-hover:text-primary transition-colors">
                      {s.title}
                    </h3>
                  </motion.a>
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

export default SectorPage;
