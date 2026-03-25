import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, TrendingUp, Megaphone, Target, Handshake, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import CtaSection from "@/components/CtaSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { usePageMeta } from "@/hooks/usePageMeta";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const pillars = [
  {
    icon: TrendingUp,
    title: "Sales",
    subtitle: "Gestructureerde acquisitie",
    description:
      "Geen losse belletjes of een 'we-zien-wel-aanpak'. Wij geven vorm en inhoud aan uw salesgesprekken met structuur, overtuigingskracht en professionele opvolging. Van prospecting tot closing: elke stap is meetbaar en herhaalbaar.",
    features: [
      "Outbound salesgesprekken namens uw bedrijf",
      "Omnichannel opvolging (e-mail, telefoon, LinkedIn)",
      "Pipeline-opbouw en CRM-management",
      "Deal-coaching en closing-ondersteuning",
    ],
  },
  {
    icon: Megaphone,
    title: "Marketing",
    subtitle: "Zichtbaarheid en leadgeneratie",
    description:
      "Om te groeien moet u zichtbaar zijn voor de juiste klanten. Wij nemen uw marketing uit handen met slimme campagnes, sterke content en een heldere positionering. Zo trekt u de juiste doelgroep aan en maakt u van bezoekers echte klanten.",
    features: [
      "Website en SEO-optimalisatie",
      "Content marketing en thought leadership",
      "AI Avatar video-outreach",
      "Conversie-optimalisatie en landingspagina's",
    ],
  },
  {
    icon: Target,
    title: "Strategie",
    subtitle: "Commerciële koers bepalen",
    description:
      "Groei start met de juiste keuzes. Samen stippelen we een commerciële koers uit: we scherpen uw propositie aan, brengen de toegevoegde waarde glashelder onder woorden en zetten een praktisch uitvoerbaar plan op papier, passend bij uw doelgroep.",
    features: [
      "ICP-definitie en marktanalyse",
      "Propositie aanscherpen en positionering",
      "Commercieel plan en roadmap",
      "Concurrentieanalyse en differentiatie",
    ],
  },
  {
    icon: Handshake,
    title: "Relatiebeheer",
    subtitle: "Klantbehoud en herhaalopdrachten",
    description:
      "Meer omzet haalt u niet alleen uit nieuwe klanten. Bestaande klanten heeft u al overtuigd. Wij helpen u relaties actief te versterken, klantbehoud te vergroten en meer herhaalopdrachten te realiseren, op een natuurlijke manier.",
    features: [
      "Actief accountmanagement",
      "Klantretentie en upsell-strategieën",
      "Gestructureerde check-ins en opvolging",
      "Klanttevredenheidsmonitoring",
    ],
  },
];

const FullSalesManagement = () => {
  useEffect(() => {
    document.title = "Full Sales Management — B2B GroeiMachine";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc)
      metaDesc.setAttribute(
        "content",
        "Van strategie tot uitvoering: wij nemen uw volledige commerciële proces over. Sales, marketing, strategie en relatiebeheer in één pakket."
      );
    return () => {
      document.title = "B2B Groeimachine — Schaalbare Leadgeneratie & Sales Automation";
    };
  }, []);

  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://eco-signal-link.lovable.app/" },
            { name: "Full Sales Management", url: "https://eco-signal-link.lovable.app/full-sales-management" },
          ]}
        />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="max-w-3xl">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-6">
                Add-on: Klantwerving
              </p>
              <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
                Full Sales
                <br />
                <span className="text-gradient">Management.</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                Van strategie tot uitvoering: wij nemen uw volledige commerciële proces over.
                Salesgesprekken, marketing, relatiebeheer en strategische groei, allemaal vanuit één team.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a
                  href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bespreek uw situatie →
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* 4 Pillars */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mb-16">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Vier pijlers
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight mb-4">
                Eén partner voor uw
                <br />
                <span className="text-gradient">volledige groei.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Elke pijler versterkt de andere. Samen vormen ze een sluitend commercieel systeem
                dat structureel nieuwe klanten binnenhaalt én bestaande relaties laat groeien.
              </p>
            </motion.div>

            <div className="space-y-8">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="card-gradient border border-glow rounded-lg p-8 md:p-10 hover:border-primary/30 transition-colors group"
                  >
                    <div className="grid md:grid-cols-[1fr_1fr] gap-8">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-xl">{pillar.title}</h3>
                            <p className="text-muted-foreground text-xs">{pillar.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                      <div>
                        <ul className="space-y-3">
                          {pillar.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm">
                              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                              <span className="text-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mb-12">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Werkwijze
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">
                Van kennismaking tot <span className="text-gradient">resultaat</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Intake & analyse", desc: "We brengen uw markt, doelgroep en huidige aanpak in kaart." },
                { step: "02", title: "Strategie & plan", desc: "Samen definiëren we de commerciële koers en prioriteiten." },
                { step: "03", title: "Uitvoering", desc: "Ons team gaat aan de slag met sales, marketing en relatiebeheer." },
                { step: "04", title: "Optimalisatie", desc: "Op basis van data sturen we continu bij voor maximaal resultaat." },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="card-gradient border border-glow rounded-lg p-6"
                >
                  <span className="text-primary font-display font-bold text-3xl opacity-30">{item.step}</span>
                  <h3 className="font-display font-semibold text-lg mt-3 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing note */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div
              {...fadeUp}
              className="max-w-2xl mx-auto text-center"
            >
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Investering
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">
                Prijs op aanvraag
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Elk bedrijf is anders. We stellen een pakket samen dat past bij uw doelen, markt en groeifase.
                Plan een vrijblijvend gesprek en we bespreken de mogelijkheden.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a
                  href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plan een gesprek →
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        <CtaSection />
        <Footer />
      </div>
    </PageLoader>
  );
};

export default FullSalesManagement;
