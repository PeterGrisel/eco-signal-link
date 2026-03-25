import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Users, Search, Target, Handshake, ArrowRight } from "lucide-react";
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
    icon: Search,
    title: "Sourcing",
    subtitle: "De juiste kandidaten vinden",
    description:
      "Wij zoeken niet in standaard databases. Met dezelfde data-gedreven aanpak waarmee wij prospects vinden, identificeren wij ook het juiste talent. Gericht, snel en zonder ruis.",
    features: [
      "Actieve en passieve kandidaten bereiken",
      "Multichannel sourcing (LinkedIn, e-mail, netwerk)",
      "Data-gedreven kandidaatselectie",
      "Marktanalyse en salarisbenchmarking",
    ],
  },
  {
    icon: Target,
    title: "Selectie",
    subtitle: "Kwaliteit boven kwantiteit",
    description:
      "Geen stapels cv's, maar een shortlist van kandidaten die écht passen. Wij screenen op competenties, cultuurfit en groeipotentieel zodat u alleen relevante gesprekken voert.",
    features: [
      "Diepgaande screening en interviews",
      "Competentie- en cultuurfit assessment",
      "Referentiechecks en achtergrondverificatie",
      "Shortlist met onderbouwde motivatie",
    ],
  },
  {
    icon: Handshake,
    title: "Begeleiding",
    subtitle: "Van introductie tot contract",
    description:
      "Het proces stopt niet bij de shortlist. Wij begeleiden het volledige traject: van eerste kennismaking tot contractondertekening. Zodat u zich kunt focussen op uw business.",
    features: [
      "Interviewplanning en -coördinatie",
      "Onderhandelingsbegeleiding",
      "Contractbegeleiding en onboarding-advies",
      "Nazorg na plaatsing",
    ],
  },
  {
    icon: Users,
    title: "Teamopbouw",
    subtitle: "Structureel de juiste mensen",
    description:
      "Eén goede hire is een begin. Wij helpen u structureel het juiste team opbouwen: van profieldefiniëring en employer branding tot een doorlopende recruitmentpipeline.",
    features: [
      "Profieldefiniëring en functiearchitectuur",
      "Employer branding en arbeidsmarktpositionering",
      "Doorlopende recruitmentpipeline",
      "Strategisch workforce planning",
    ],
  },
];

const FullServiceRecruitment = () => {
  usePageMeta({
    title: "Full Service Recruitment — B2BGroeiMachine",
    description:
      "Van sourcing tot plaatsing: wij nemen uw volledige recruitment uit handen. Data-gedreven, persoonlijk en resultaatgericht.",
    canonical: "https://eco-signal-link.lovable.app/full-service-recruitment",
  });

  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://eco-signal-link.lovable.app/" },
            {
              name: "Full Service Recruitment",
              url: "https://eco-signal-link.lovable.app/full-service-recruitment",
            },
          ]}
        />
        <Navbar />

        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="max-w-3xl">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-6">
                Add-on: Recruitment
              </p>
              <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
                Full Service
                <br />
                <span className="text-gradient">Recruitment.</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                Van sourcing tot plaatsing: wij nemen uw volledige recruitment uit handen.
                Data-gedreven, persoonlijk en resultaatgericht — zodat u zich kunt focussen op groei.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a
                  href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bespreek uw vacature →
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
                <span className="text-gradient">volledige recruitment.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Elke pijler versterkt de andere. Samen vormen ze een sluitend recruitmentproces
                dat structureel de juiste mensen aan uw organisatie verbindt.
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
                Van vacature tot <span className="text-gradient">plaatsing</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Intake & profiel", desc: "We brengen de rol, het team en de cultuur in kaart." },
                { step: "02", title: "Sourcing & selectie", desc: "Data-gedreven zoeken, screenen en een onderbouwde shortlist." },
                { step: "03", title: "Gesprekken & keuze", desc: "Wij coördineren het interviewproces en begeleiden de besluitvorming." },
                { step: "04", title: "Plaatsing & nazorg", desc: "Contract, onboarding-advies en opvolging na de start." },
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
            <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Investering
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">
                Prijs op aanvraag
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Elke vacature is anders. We stellen een aanpak samen die past bij uw rol, markt en urgentie.
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

export default FullServiceRecruitment;
