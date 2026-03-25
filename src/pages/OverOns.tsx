import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, Users, Brain, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import teamAbout from "@/assets/team-about.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const brands = [
  {
    name: "Rebel Force",
    url: "https://rebelforce.nl",
    description:
      "Het moederbedrijf. Rebel Force is de strategische motor achter alles wat we doen. Vanuit hier sturen we de visie, de richting en de standaard.",
  },
  {
    name: "B2BGroeiMachine",
    url: "/",
    description:
      "Ons outbound-systeem dat data en signalen combineert tot een voorspelbaar groeiproces. Voor bedrijven die structureel willen groeien.",
  },
  {
    name: "RebelHub",
    url: "https://rebelforce-hubs.com",
    description:
      "Het platform waar ondernemers, tools en kennis samenkomen. Digitalisering begrijpelijk en toepasbaar gemaakt.",
  },
  {
    name: "AI-FCTRY",
    url: "https://ai-fctry.com",
    description:
      "Onze AI-divisie. We bouwen praktische AI-oplossingen die écht werken voor het MKB. Geen hype, maar resultaat.",
  },
];

const values = [
  {
    icon: Zap,
    title: "Toegankelijkheid",
    text: "Digitalisering en AI moeten niet voorbehouden zijn aan corporates met diepe zakken. Wij maken het bereikbaar voor élk ambitieus bedrijf.",
  },
  {
    icon: Brain,
    title: "Data-gedreven",
    text: "Geen onderbuikgevoel, maar bewezen patronen. Elke beslissing wordt onderbouwd met data en elke actie levert meetbare inzichten op.",
  },
  {
    icon: Users,
    title: "Partnerschap",
    text: "We zijn geen leverancier die een factuur stuurt en verdwijnt. We bouwen mee aan uw groei als verlengstuk van uw team.",
  },
  {
    icon: Globe,
    title: "Schaalbaar denken",
    text: "Systemen die groeien met u mee. Van lokale markt tot internationale expansie — het fundament blijft staan.",
  },
];

const OverOns = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={teamAbout}
            alt="Team Rebel Force"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.p
            {...fadeUp}
            className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4"
          >
            Over ons
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6 max-w-3xl"
          >
            Digitalisering &amp; AI
            <br />
            <span className="text-gradient">toegankelijk</span> maken.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed"
          >
            Wij geloven dat slimme technologie niet ingewikkeld hoeft te zijn.
            Vanuit Rebel Force bouwen we systemen die digitalisering en AI
            bereikbaar maken voor elk ambitieus bedrijf.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp}>
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Onze missie
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl leading-tight mb-6">
                De kloof dichten tussen{" "}
                <span className="text-primary">technologie</span> en{" "}
                <span className="text-primary">ondernemen</span>.
              </h2>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Veel bedrijven weten dat digitalisering en AI kansen bieden,
                  maar weten niet waar te beginnen. De markt is vol met
                  buzzwords, dure consultants en oplossingen die niet passen bij
                  het MKB.
                </p>
                <p>
                  Daar komen wij in beeld. Vanuit <strong className="text-foreground">Rebel Force</strong> hebben
                  we een ecosysteem gebouwd dat ondernemers stap voor stap
                  meeneemt. Van strategie tot implementatie, van data tot
                  resultaat.
                </p>
                <p>
                  Geen dikke rapporten die in een la verdwijnen, maar werkende
                  systemen die direct waarde opleveren. Dat is onze belofte.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
              Waar we voor staan
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              Onze kernwaarden
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
              Het ecosysteem
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Eén visie. Vier merken.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Elk merk binnen het Rebel Force-ecosysteem heeft een eigen
              specialisatie, maar samen vormen ze één geheel.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {brands.map((brand, i) => (
              <motion.a
                key={brand.name}
                href={brand.url}
                target={brand.url.startsWith("http") ? "_blank" : undefined}
                rel={
                  brand.url.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-xl text-primary">
                    {brand.name}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {brand.description}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
              Klaar om te{" "}
              <span className="text-gradient">groeien</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Ontdek hoe het Rebel Force-ecosysteem uw bedrijf kan versnellen.
              Plan een vrijblijvend gesprek.
            </p>
            <Button variant="hero" size="lg" asChild>
              <a
                href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                target="_blank"
                rel="noopener noreferrer"
              >
                Plan een Gesprek →
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OverOns;
