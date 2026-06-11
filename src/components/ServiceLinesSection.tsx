import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { CTA } from "@/content/copy";
import {
  Send,
  Crosshair,
  Bot,
  Linkedin,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type ServiceLine = {
  icon: LucideIcon;
  name: string;
  tagline: string;
  /** Het ICP-filter: voor wie deze lijn werkt. */
  fit: string;
  description: string;
  outcomes: string[];
  href: string;
  linkLabel: string;
};

// Vier service-lijnen, elk met een scherp ICP-filter. Gemapt op onze
// bestaande diensten en methodepagina's.
const lines: ServiceLine[] = [
  {
    icon: Send,
    name: "Outbound Engine",
    tagline: "Multichannel prospecting die gesprekken boekt",
    fit: "B2B met een TAM boven 1.000 accounts en een dealwaarde vanaf €5k",
    description:
      "E-mail, LinkedIn en telefoon in één signaal-gedreven flow. Wij vinden de juiste accounts, benaderen de beslissers en boeken elke week gesprekken met sales-bevoegde contacten.",
    outcomes: [
      "Verrijkte lijsten op fit, intent en timing",
      "Gepersonaliseerde sequenties op meerdere kanalen",
      "Afspraken direct in uw eigen agenda en CRM",
    ],
    href: "/cheatsheet/multichannel-sequencing",
    linkLabel: "Bekijk de aanpak",
  },
  {
    icon: Crosshair,
    name: "ABM & Named Accounts",
    tagline: "Een-op-een bewegingen naar uw droomklanten",
    fit: "B2B met een scherpe TAM onder 1.000 accounts en een dealwaarde vanaf €50k",
    description:
      "Voor een korte lijst van droomaccounts bouwen wij persoonlijke campagnes. Buyer-group mapping, content en video op maat, en een hands-on commercieel proces dat de hele DMU raakt.",
    outcomes: [
      "Buyer-group mapping per account",
      "Persoonlijke content, video en landingspagina's",
      "Volledige commerciële opvolging namens u",
    ],
    href: "/full-sales-management",
    linkLabel: "Bekijk de aanpak",
  },
  {
    icon: Bot,
    name: "AI RevOps & Pipeline",
    tagline: "Schoon CRM, scherpe data, de volgende beste actie",
    fit: "Tech-scale-ups van Seed tot Series C, of dienstverleners met 50+ medewerkers",
    description:
      "Wij ruimen uw CRM op, kwalificeren leads in real time en bouwen dashboards die kloppen. Uw team verliest geen tijd meer aan administratie en weet elke week wat de volgende stap is.",
    outcomes: [
      "Opgeschoond CRM met heldere pijplijn-fases",
      "Automatische kwalificatie en verrijking",
      "Eén dashboard met attributie en lerende loops",
    ],
    href: "/pipeline-equation",
    linkLabel: "Bekijk de aanpak",
  },
  {
    icon: Linkedin,
    name: "LinkedIn Content & Authority",
    tagline: "Vraag creëren met content die top-of-mind houdt",
    fit: "Founders en commercieel leiders wiens ICP actief is op LinkedIn",
    description:
      "Thought-leadership content en AI-video die uw merk zichtbaar maken bij de juiste mensen. Wij bouwen een contentmotor die warme vraag creëert, zodat outbound makkelijker landt.",
    outcomes: [
      "Contentkalender en redactie namens u",
      "AI-avatar video-outreach op schaal",
      "Distributie die uw ICP daadwerkelijk bereikt",
    ],
    href: "/cheatsheet/linkedin-outreach",
    linkLabel: "Bekijk de aanpak",
  },
];

const ServiceLinesSection = () => {
  return (
    <section id="diensten" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Onze service-lijnen
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            Vier motoren.
            <br />
            <span className="text-gradient">Eén voorspelbare pijplijn.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Elke lijn lost een ander stuk van uw groei op. U start met de lijn
            die bij uw markt past; ze versterken elkaar in één systeem. Niet
            zeker welke? Tijdens de scan bepalen we het samen.
          </p>
        </motion.div>

        {/* Service-lijnen grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {lines.map((line, i) => (
            <motion.div
              key={line.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="card-gradient border-glow rounded-2xl p-6 md:p-8 flex flex-col hover:border-primary/30 transition-colors"
            >
              {/* Icoon + naam */}
              <div className="flex items-start gap-4 mb-4">
                <span className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <line.icon className="w-6 h-6 text-primary" strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="font-display font-bold text-xl md:text-2xl leading-tight">
                    {line.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-snug mt-1">
                    {line.tagline}
                  </p>
                </div>
              </div>

              {/* ICP-filter */}
              <div className="inline-flex items-start gap-2 rounded-lg border border-border/60 bg-foreground/[0.03] px-3 py-2 mb-4">
                <span className="text-[10px] font-display font-semibold uppercase tracking-[0.18em] text-primary/80 shrink-0 mt-0.5">
                  Voor wie
                </span>
                <span className="text-sm text-foreground/80 leading-snug">
                  {line.fit}
                </span>
              </div>

              {/* Beschrijving */}
              <p className="text-muted-foreground leading-relaxed mb-5">
                {line.description}
              </p>

              {/* Uitkomsten */}
              <ul className="flex flex-col gap-2.5 mb-6">
                {line.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-foreground/85 leading-snug">{o}</span>
                  </li>
                ))}
              </ul>

              {/* Link naar de aanpak */}
              <Link
                to={line.href}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
              >
                {line.linkLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Sectie-CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-col items-center gap-3 text-center"
        >
          <Button
            variant="hero"
            size="lg"
            className="group relative h-12 rounded-full px-7 text-base overflow-hidden"
            asChild
          >
            <CtaLink intent="gratisScan" location="ServiceLines">
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{CTA.gratisScan.label}</span>
            </CtaLink>
          </Button>
          <p className="text-sm text-muted-foreground">
            Geen verkoopgesprek. Wij bepalen samen welke lijn uw pijplijn opent.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceLinesSection;
