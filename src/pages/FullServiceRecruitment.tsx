import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users,
  Brain,
  Search,
  Sparkles,
  Target,
  ShieldCheck,
  ArrowRight,
  Check,
  Zap,
  BarChart3,
  Briefcase,
} from "lucide-react";
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

const expertiseDomains = [
  {
    icon: Brain,
    title: "AI & Data Science",
    desc: "Machine learning engineers, data scientists en AI-strategen die complexe vraagstukken oplossen.",
  },
  {
    icon: BarChart3,
    title: "Data & Analytics",
    desc: "Van data-architectuur tot dashboards — professionals die sturen op besluitvorming.",
  },
  {
    icon: Briefcase,
    title: "Digital Leadership",
    desc: "C-level en senior leiders die digitale transformatie dragen en uitvoeren.",
  },
  {
    icon: Zap,
    title: "Sales & Growth",
    desc: "Commerciële professionals die structureel nieuwe markten openen en omzet realiseren.",
  },
  {
    icon: Target,
    title: "Marketing & Strategie",
    desc: "Strategen en uitvoerders die positionering, campagnes en groei combineren.",
  },
  {
    icon: ShieldCheck,
    title: "Fractional Expertise",
    desc: "Flexibele inzet van high-level expertise — waar en wanneer nodig, zonder overhead.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Analyse",
    desc: "We verdiepen ons in uw organisatie, cultuur, team en de exacte rol die u zoekt. Geen standaard intake maar een strategische sessie.",
  },
  {
    step: "02",
    title: "Selectie & Matching",
    desc: "Uit ons exclusieve netwerk matchen we uitsluitend professionals met bewezen impact in uw niche. Kwaliteit boven kwantiteit.",
  },
  {
    step: "03",
    title: "Positionering",
    desc: "Kandidaat en rol worden strategisch op elkaar afgestemd. Wij begeleiden het proces van introductie tot contractondertekening.",
  },
  {
    step: "04",
    title: "Impact & Nazorg",
    desc: "Na plaatsing blijven we betrokken. We monitoren de match, ondersteunen de onboarding en zorgen voor duurzaam succes.",
  },
];

const differentiators = [
  "Geen brede database — een zorgvuldig geselecteerde talentpool",
  "Diepgaande kennis van data, AI en digitale transformatie",
  "Resultaatgericht: geen advies zonder uitvoering",
  "Persoonlijke begeleiding van intake tot onboarding",
  "Fractional en interim mogelijkheden voor maximale flexibiliteit",
  "Bewezen track record bij ambitieuze B2B-organisaties",
];

const FullServiceRecruitment = () => {
  usePageMeta({
    title: "Full Service Recruitment — B2BGroeiMachine",
    description:
      "Exclusief talent in data, AI en digital leadership. Wij verbinden high-impact professionals aan ambitieuze organisaties. Geen massa, maar kwaliteit.",
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

        {/* Hero — inspired by a-typicals bold intro */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase">
                  Full Service Recruitment
                </p>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
                Exclusief talent.
                <br />
                <span className="text-gradient">Echte impact.</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-4">
                Wij verbinden high-impact professionals in data, AI en digital
                leadership aan organisaties die digitale transformatie echt
                willen laten landen.
              </p>
              <p className="text-muted-foreground/70 text-base max-w-2xl leading-relaxed mb-8">
                Geen massa, maar een geselecteerd collectief van experts die
                strategie omzetten in resultaat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a
                    href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bespreek uw vacature →
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Intro block — like a-typicals "Meer dan recruitment" */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <motion.div {...fadeUp}>
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  Meer dan recruitment
                </p>
                <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight mb-6">
                  Een ecosysteem voor
                  <br />
                  <span className="text-gradient">niche-expertise.</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Wij zijn geen traditioneel recruitmentbureau. Wij bouwen een
                  talentcollectief waar diepgaande expertise, ambitie en impact
                  samenkomen. Voor professionals en organisaties die écht
                  willen.
                </p>
              </motion.div>
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <div className="space-y-6">
                  {[
                    {
                      icon: Sparkles,
                      title: "Diepe Expertise",
                      desc: "Data, AI en leadership zijn geen buzzwords. We spreken de taal van de niche en begrijpen de complexiteit.",
                    },
                    {
                      icon: Target,
                      title: "Resultaatgericht",
                      desc: "Geen advies zonder uitvoering. Onze professionals realiseren projecten van strategie tot implementatie.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Exclusief",
                      desc: "We werken alleen met professionals die aantoonbaar impact maken. Geen brede database, maar een zorgvuldig geselecteerde talentpool.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-base mb-1">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Expertise domains — like a-typicals focus areas */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mb-16">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Expertisegebieden
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight mb-4">
                Waar wij het verschil
                <br />
                <span className="text-gradient">maken.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Onze focus ligt op domeinen waar strategie en uitvoering
                samenkomen. Altijd met oog voor schaalbaarheid, data-gedreven
                werken en echte impact.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertiseDomains.map((domain, i) => {
                const Icon = domain.icon;
                return (
                  <motion.div
                    key={domain.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="card-gradient border border-glow rounded-lg p-8 hover:border-primary/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {domain.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {domain.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process — "Van vraag tot impact" like a-typicals */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mb-12">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Hoe wij werken
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">
                Van vraag tot <span className="text-gradient">impact</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Ons proces is strategisch en persoonlijk. Geen cv-schuiven, maar
                een doordachte aanpak die zorgt voor directe en duurzame impact.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="card-gradient border border-glow rounded-lg p-6 relative"
                >
                  <span className="text-primary font-display font-bold text-3xl opacity-30">
                    {item.step}
                  </span>
                  <h3 className="font-display font-semibold text-lg mt-3 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us — differentiators */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeUp}>
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  Waarom wij
                </p>
                <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-6">
                  Niet zomaar een
                  <br />
                  <span className="text-gradient">recruitmentbureau.</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Wij combineren diepgaande marktkennis met het netwerk en de
                  systemen van B2BGroeiMachine. Het resultaat: snellere
                  plaatsingen, betere matches en duurzame impact.
                </p>
              </motion.div>
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <ul className="space-y-4">
                  {differentiators.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground text-sm leading-relaxed">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA pricing */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Aan de slag
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">
                Uw volgende <span className="text-gradient">key hire</span>{" "}
                begint hier
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Vertel ons welke rol u zoekt. Wij komen met een shortlist van
                bewezen professionals die passen bij uw organisatie, cultuur en
                ambitie.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a
                  href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plan een kennismaking →
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
