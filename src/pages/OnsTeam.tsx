import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import Footer from "@/components/Footer";
import LogoTicker from "@/components/LogoTicker";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin, Users, Globe, Trophy } from "lucide-react";
import peterGrisel from "@/assets/peter-grisel.png";
import teamMember1 from "@/assets/team-member-1.jpg";
import teamMember2 from "@/assets/team-member-2.jpg";
import teamMember3 from "@/assets/team-member-3.jpg";
import teamMember4 from "@/assets/team-member-4.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const heroPhotos = [
  { src: peterGrisel, label: "Founder", top: "8%", left: "8%", rotate: -4 },
  { src: teamMember1, label: "Outbound Lead", top: "5%", right: "12%", rotate: 3 },
  { src: teamMember2, label: "Data Analist", top: "45%", left: "5%", rotate: 2 },
  { src: teamMember3, label: "Strateeg", top: "40%", right: "6%", rotate: -3 },
  { src: teamMember4, label: "AI Engineer", top: "55%", left: "22%", rotate: 5 },
];

const stats = [
  { value: "15+", label: "jaar ervaring", icon: Trophy },
  { value: "4", label: "merken in het ecosysteem", icon: Globe },
  { value: "50+", label: "klanten bediend", icon: Users },
  { value: "3", label: "landen actief", icon: MapPin },
];

const teamMembers = [
  {
    name: "Peter Grisel",
    role: "Founder & CEO",
    experience: "15+ jaar ervaring",
    image: peterGrisel,
    bio: "Peter is eigenaar van de hubs en founder van Rebel Force en AI Fctry. Met meer dan 15 jaar operationeel leiderschap bouwt hij aan een ecosysteem waar ondernemers samen slimmer worden. Van strategie tot uitvoering — Peter verbindt technologie met groei.",
  },
  {
    name: "Lisa van den Berg",
    role: "Head of Outbound",
    experience: "8 jaar ervaring",
    image: teamMember1,
    bio: "Lisa leidt het outbound-team en ontwikkelt multi-channel campagnes die consistent leads opleveren. Met een achtergrond in B2B sales en marketing automation weet ze precies hoe je de juiste beslissers bereikt op het juiste moment.",
  },
  {
    name: "Joris de Vries",
    role: "Data & Analytics Lead",
    experience: "6 jaar ervaring",
    image: teamMember2,
    bio: "Joris vertaalt ruwe data naar actiegerichte inzichten. Hij bouwt dashboards, analyseert campagneprestaties en zorgt ervoor dat elke euro marketingbudget meetbaar rendeert. Data-gedreven besluitvorming is zijn tweede natuur.",
  },
  {
    name: "Sophie Bakker",
    role: "Growth Strategist",
    experience: "7 jaar ervaring",
    image: teamMember3,
    bio: "Sophie ontwikkelt groeistrategieën op maat voor B2B-bedrijven. Van ICP-analyse tot funnel-optimalisatie — ze combineert strategisch denken met hands-on executie om structurele groei te realiseren.",
  },
  {
    name: "Mark Jansen",
    role: "AI & Automation Engineer",
    experience: "5 jaar ervaring",
    image: teamMember4,
    bio: "Mark bouwt de AI-systemen en automatiseringen die onze klanten een voorsprong geven. Van intelligente lead scoring tot geautomatiseerde workflows — hij maakt complexe technologie werkbaar voor het MKB.",
  },
];

const TeamMemberCard = ({ member, index }: { member: typeof teamMembers[0]; index: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500">
        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            width={512}
            height={640}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-display font-bold text-xl mb-1">{member.name}</h3>
            <p className="text-primary font-display text-sm font-semibold">{member.role}</p>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase mb-3">
            {member.experience}
          </p>
          <p className={`text-muted-foreground text-sm leading-relaxed transition-all duration-300 ${expanded ? "" : "line-clamp-3"}`}>
            {member.bio}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline"
          >
            {expanded ? "Minder" : "Lees meer"}
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const OnsTeam = () => {
  usePageMeta({
    title: "Ons Team — B2BGroeiMachine",
    description: "Maak kennis met de experts achter B2BGroeiMachine. Van strategie tot AI — ons team bouwt systemen die structureel B2B groei opleveren.",
    canonical: "https://b2bgroeimachine.io/ons-team",
  });

  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd items={[
          { name: "Home", url: "https://b2bgroeimachine.io/" },
          { name: "Ons Team", url: "https://b2bgroeimachine.io/ons-team" },
        ]} />
        <Navbar />

        {/* Hero — floating photos around heading */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16 overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,hsl(var(--primary)/0.12),transparent_70%)] pointer-events-none" />

          {/* Floating team photos */}
          <div className="absolute inset-0 hidden lg:block">
            {heroPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
                className="absolute"
                style={{
                  top: photo.top,
                  left: photo.left,
                  right: (photo as any).right,
                }}
              >
                <div
                  className="relative"
                  style={{ transform: `rotate(${photo.rotate}deg)` }}
                >
                  <div className="w-28 h-32 xl:w-36 xl:h-40 rounded-xl overflow-hidden border-2 border-border/50 shadow-lg">
                    <img
                      src={photo.src}
                      alt={photo.label}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-display font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    {photo.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center content */}
          <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6"
            >
              <span className="text-primary">Experts</span> die
              <br />
              groei bouwen
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-8"
            >
              Een compact team van specialisten in data, AI en outbound.
              Samen bouwen we systemen die structureel groeien.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button variant="hero" size="lg" asChild>
                <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                  Plan een kennismaking →
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Logo ticker */}
        <LogoTicker />

        {/* Quality section */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeUp}>
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  Waarom ons team
                </p>
                <h2 className="font-display font-bold text-3xl md:text-4xl leading-tight mb-6">
                  Geen generieke bureaumedewerkers, maar <span className="text-primary">specialisten</span>
                </h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed">
                  <p>
                    Elk teamlid is geselecteerd op diepgaande kennis in hun vakgebied.
                    Van AI-engineering tot outbound strategie — we werken alleen met
                    mensen die bewezen resultaat leveren.
                  </p>
                  <p>
                    We combineren de wendbaarheid van een startup met de expertise
                    van een gevestigd bureau. Dat betekent: snelle iteraties,
                    persoonlijk contact en meetbare impact.
                  </p>
                </div>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors"
                  >
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-3" />
                    <p className="font-display font-bold text-3xl text-foreground mb-1">{stat.value}</p>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team grid */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="text-center mb-16">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Maak kennis
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl">
                De experts achter <span className="text-primary">uw groei</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {teamMembers.map((member, i) => (
                <TeamMemberCard key={member.name} member={member} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
                Wil je met ons <span className="text-primary">samenwerken</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Plan een vrijblijvend gesprek en ontdek hoe ons team uw groei kan versnellen.
              </p>
              <div className="flex items-center justify-center gap-3 mb-5">
                <img src={peterGrisel} alt="Peter Grisel" className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
                <span className="text-muted-foreground text-sm">Spreek direct met Peter</span>
              </div>
              <Button variant="hero" size="lg" asChild>
                <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                  Plan een Gesprek →
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageLoader>
  );
};

export default OnsTeam;
