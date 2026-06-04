import { useParams, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Radio, FileText, Database, Users, Calendar, Ban } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import CtaSection from "@/components/CtaSection";
import FunnelCalculatorSection from "@/components/FunnelCalculatorSection";
import SectorRelatedContent from "@/components/SectorRelatedContent";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import { getSectorBySlug, sectors } from "@/data/sectors";
import { usePageMeta } from "@/hooks/usePageMeta";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const SectorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const sector = slug ? getSectorBySlug(slug) : undefined;

  usePageMeta({
    title: sector?.metaTitle ?? "Sector — B2BGroeiMachine",
    description: sector?.metaDescription,
    canonical: sector ? `https://b2bgroeimachine.io/sectoren/${slug}` : undefined,
  });

  if (!sector) return <Navigate to="/404" replace />;

  const Icon = sector.icon;

  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd items={[
          { name: "Home", url: "https://b2bgroeimachine.io/" },
          { name: "Sectoren", url: "https://b2bgroeimachine.io/" },
          { name: sector.title, url: `https://b2bgroeimachine.io/sectoren/${sector.slug}` },
        ]} />
        <JsonLd
          id="service-jsonld"
          data={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Leadgeneratie voor ${sector.title}`,
            serviceType: "B2B Leadgeneratie & Sales Automation",
            description: sector.metaDescription || sector.description,
            areaServed: { "@type": "Country", name: "Netherlands" },
            provider: {
              "@type": "Organization",
              name: "B2BGroeiMachine",
              url: "https://b2bgroeimachine.io",
            },
            audience: {
              "@type": "BusinessAudience",
              name: sector.title,
            },
            url: `https://b2bgroeimachine.io/sectoren/${sector.slug}`,
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
                  href="https://meetings-eu1.hubspot.com/peter-grisel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plan een Demo →
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.p {...fadeUp} className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-8">
              Operationeel in 4 weken
            </motion.p>
            <div className="grid sm:grid-cols-4 gap-6">
              {[
                { week: "Week 1", title: "Strategie & Data", desc: "Doelgroepanalyse, ICP-definitie en databronnen koppelen." },
                { week: "Week 2", title: "Systeem & Copy", desc: "Campagne-architectuur opzetten, messaging afstemmen op uw markt." },
                { week: "Week 3", title: "Lancering", desc: "Eerste outreach live. Multichannel campagnes starten." },
                { week: "Week 4", title: "Optimalisatie", desc: "Data evalueren, A/B-testen en bijsturen op basis van resultaten." },
              ].map((step, i) => (
                <motion.div
                  key={step.week}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card-gradient border border-glow rounded-lg p-6 relative"
                >
                  <span className="text-primary font-display font-bold text-sm">{step.week}</span>
                  <h3 className="font-display font-semibold text-lg mt-2 mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
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

        {/* Signals */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="mb-10 max-w-2xl">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Signalen die wij tracken
              </p>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">
                Data-gedreven <span className="text-gradient">timing</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Ons systeem detecteert deze signalen automatisch zodat u precies op het juiste moment in beeld komt.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sector.signals.map((signal, i) => (
                <motion.div
                  key={signal}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-start gap-3 card-gradient border border-glow rounded-lg p-5"
                >
                  <Radio className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <span className="text-sm leading-relaxed">{signal}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <FunnelCalculatorSection defaults={sector.funnelDefaults} />

        {/* Voorbeeldcampagne */}
        {sector.voorbeeldcampagne && (
          <section className="py-24 border-t border-border">
            <div className="container mx-auto px-6 max-w-4xl">
              <motion.div {...fadeUp}>
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Voorbeeldcampagne
                </p>
                <h2 className="font-display font-bold text-2xl md:text-4xl mb-6 leading-tight">
                  Zo ziet het er in <span className="text-gradient">{sector.title.toLowerCase()}</span> uit
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {sector.voorbeeldcampagne}
                </p>
              </motion.div>
            </div>
          </section>
        )}

        {/* Data + Beslissers grid */}
        {(sector.dataGebruikt || sector.beslissers) && (
          <section className="py-24 border-t border-border">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-8">
                {sector.dataGebruikt && (
                  <motion.div {...fadeUp} className="card-gradient border border-glow rounded-lg p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <Database className="w-5 h-5 text-primary" />
                      <h3 className="font-display font-bold text-xl">Welke data gebruiken we</h3>
                    </div>
                    <ul className="space-y-3">
                      {sector.dataGebruikt.map((d) => (
                        <li key={d} className="flex gap-3 text-muted-foreground leading-relaxed">
                          <span className="text-primary mt-1">·</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {sector.beslissers && (
                  <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="card-gradient border border-glow rounded-lg p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="font-display font-bold text-xl">Welke beslissers benaderen we</h3>
                    </div>
                    <ul className="space-y-3">
                      {sector.beslissers.map((b) => (
                        <li key={b} className="flex gap-3 text-muted-foreground leading-relaxed">
                          <span className="text-primary mt-1">·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Na 4 weken */}
        {sector.naVierWeken && (
          <section className="py-24 border-t border-border">
            <div className="container mx-auto px-6">
              <motion.div {...fadeUp} className="max-w-2xl mb-10">
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Na 4 weken
                </p>
                <h2 className="font-display font-bold text-2xl md:text-4xl mb-4">
                  Wat <span className="text-gradient">u letterlijk ziet</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Geen beloftes over aantallen. Wel een concrete check van waar u na vier weken staat.
                </p>
              </motion.div>
              <div className="grid sm:grid-cols-2 gap-4">
                {sector.naVierWeken.map((n, i) => (
                  <motion.div
                    key={n}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex items-start gap-3 card-gradient border border-glow rounded-lg p-5"
                  >
                    <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span className="text-sm leading-relaxed">{n}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Geen goede fit */}
        {sector.geenGoedeFit && (
          <section className="py-24 border-t border-border">
            <div className="container mx-auto px-6 max-w-3xl">
              <motion.div {...fadeUp}>
                <p className="text-muted-foreground font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                  <Ban className="w-4 h-4" /> Wanneer dit geen goede fit is
                </p>
                <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">
                  Wij werken liever eerlijk dan groot.
                </h2>
                <ul className="space-y-4">
                  {sector.geenGoedeFit.map((g) => (
                    <li key={g} className="flex gap-3 text-muted-foreground leading-relaxed">
                      <Ban className="w-4 h-4 text-muted-foreground/70 mt-1 shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>
        )}

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

        <SectorRelatedContent
          sectorTitle={sector.title}
          keywords={[
            ...(sector.signals ?? []).slice(0, 3),
            ...(sector.beslissers ?? []).slice(0, 2),
          ]}
        />

        <CtaSection />
        <Footer />
      </div>
    </PageLoader>
  );
};

export default SectorPage;
