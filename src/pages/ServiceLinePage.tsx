import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Send, Target, Brain, Megaphone, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import CtaSection from "@/components/CtaSection";
import CtaLink from "@/components/CtaLink";
import MiniFaq from "@/components/MiniFaq";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import { usePageMeta } from "@/hooks/usePageMeta";
import { serviceLines, type ServiceIcon } from "@/data/serviceLines";
import { solutions } from "@/data/solutions";

const iconMap: Record<ServiceIcon, LucideIcon> = {
  outbound: Send,
  abm: Target,
  brein: Brain,
  content: Megaphone,
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const ServiceLinePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const line = serviceLines.find((l) => l.slug === slug);

  if (!line) return <Navigate to="/404" replace />;

  const Icon = iconMap[line.icon];
  const others = serviceLines.filter((l) => l.slug !== line.slug);
  const related = line.relatedSolution
    ? solutions.find((s) => s.slug === line.relatedSolution)
    : undefined;
  const url = `https://b2bgroeimachine.io/diensten/${line.slug}`;

  usePageMeta({
    title: line.metaTitle,
    description: line.metaDescription,
    canonical: url,
  });

  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://b2bgroeimachine.io/" },
            { name: "Diensten", url: "https://b2bgroeimachine.io/#diensten" },
            { name: line.name, url },
          ]}
        />
        <JsonLd
          id="serviceline-jsonld"
          data={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: line.name,
            serviceType: "B2B Go-to-Market",
            description: line.metaDescription,
            areaServed: { "@type": "Country", name: "Netherlands" },
            provider: {
              "@type": "Organization",
              name: "B2BGroeiMachine",
              url: "https://b2bgroeimachine.io",
            },
            url,
            inLanguage: "nl-NL",
          }}
        />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                </span>
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase">
                  {line.eyebrow}
                </p>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
                {line.heroTitle}
                <br />
                <span className="text-gradient">{line.heroTitleGradient}</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                {line.heroDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <CtaLink intent="gratisScan" location={`Dienstlijn hero — ${line.name}`} />
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/#diensten">Alle diensten</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Voor wie */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div {...fadeUp}>
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  Voor wie
                </p>
                <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight leading-tight mb-4">
                  Is dit <span className="text-gradient">voor u?</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Herkent u zich in dit profiel? Dan past deze lijn. Twijfelt u?
                  Dat bepalen we samen in de gratis scan.
                </p>
              </motion.div>
              <motion.ul {...fadeUp} className="space-y-3">
                {line.criteria.map((c) => (
                  <li
                    key={c}
                    className="card-gradient border border-glow rounded-lg p-5 flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground leading-relaxed">{c}</span>
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </section>

        {/* Probleem */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mb-12">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Het probleem
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight mb-4">
                {line.problemTitle}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {line.problemDescription}
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-4">
              {line.problems.map((problem, i) => (
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

        {/* Wat we leveren */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mb-12">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Wat we leveren
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight mb-4">
                {line.tagline}
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {line.includes.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="card-gradient border border-glow rounded-lg p-6 flex items-center gap-3 hover:border-primary/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-display font-semibold">{f}</span>
                </motion.div>
              ))}
            </div>
            <motion.p
              {...fadeUp}
              className="text-lg font-medium text-foreground/90 border-l-2 border-primary/50 pl-4 max-w-2xl"
            >
              {line.outcome}
            </motion.p>
          </div>
        </section>

        {/* Hoe het werkt */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mb-12">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Hoe het werkt
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight">
                Van setup naar <span className="text-gradient">beweging.</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {line.process.map((p, i) => (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="card-gradient border border-glow rounded-lg p-6"
                >
                  <span className="text-primary font-display font-bold text-sm">
                    {p.step}
                  </span>
                  <h3 className="font-display font-bold text-lg mt-3 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {p.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Resultaat */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="text-center mb-12">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Resultaat
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
                Waar het naartoe werkt.
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {line.results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center card-gradient border border-glow rounded-lg p-8"
                >
                  <span className="text-primary font-display font-bold text-3xl md:text-4xl">
                    {r.metric}
                  </span>
                  <p className="text-muted-foreground text-sm mt-2">{r.label}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic text-center mt-8 max-w-xl mx-auto">
              Indicatief, geen belofte. Tijdens de scan rekenen we het door op uw
              eigen markt en cijfers.
            </p>
          </div>
        </section>

        {/* Andere dienstlijnen */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mb-12">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Andere lijnen
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
                Eén fundament, <span className="text-gradient">meer wegen.</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-4">
              {others.map((o, i) => {
                const OIcon = iconMap[o.icon];
                return (
                  <motion.div
                    key={o.slug}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Link
                      to={`/diensten/${o.slug}`}
                      className="card-gradient border border-glow rounded-lg p-6 hover:border-primary/30 transition-colors group block h-full"
                    >
                      <OIcon className="w-7 h-7 text-primary mb-4" strokeWidth={1.6} />
                      <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {o.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                        {o.tagline}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                        Bekijk lijn <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            {related && (
              <motion.div {...fadeUp} className="mt-8">
                <Link
                  to={`/solutions/${related.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Verdieping: {related.title}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        <MiniFaq />
        <CtaSection />
        <Footer />
      </div>
    </PageLoader>
  );
};

export default ServiceLinePage;
