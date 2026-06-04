import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Radar,
  Crosshair,
  Send,
  Network,
  Inbox,
  LineChart,
  BookOpenCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { FeatureCard } from "@/components/blocks/grid-feature-cards";

const PLAYBOOKS = [
  {
    slug: "signaal",
    phase: "Doelgroep",
    title: "Signaal-playbook",
    description:
      "Vang koopintent uit jobchanges, funding en tech-stack. Scoor en route automatisch.",
    icon: Radar,
  },
  {
    slug: "icp-tam",
    phase: "Fundament",
    title: "ICP & TAM-playbook",
    description:
      "Maak uw markt zichtbaar. Van totale markt naar tier-1, tier-2 en tier-3 accounts.",
    icon: Crosshair,
  },
  {
    slug: "outbound",
    phase: "Activatie",
    title: "Outbound-playbook",
    description:
      "Multi-channel sequenties via e-mail, LinkedIn en telefoon in één pipeline.",
    icon: Send,
  },
  {
    slug: "crm-routing",
    phase: "Activatie",
    title: "CRM Routing-playbook",
    description:
      "Elke lead verrijkt, gescoord en automatisch toegewezen aan de juiste owner.",
    icon: Network,
  },
  {
    slug: "inbound",
    phase: "Sales",
    title: "Inbound Orchestratie-playbook",
    description:
      "Van form-fill tot geboekte meeting in minuten, zonder handmatige tussenstap.",
    icon: Inbox,
  },
  {
    slug: "pipeline",
    phase: "Optimalisatie",
    title: "Pipeline Rapportage-playbook",
    description:
      "Eén dashboard met attributie die klopt. Stuur op de cijfers die er echt toe doen.",
    icon: LineChart,
  },
  {
    slug: "abm",
    phase: "Strategie",
    title: "ABM-playbook",
    description:
      "Account-based campagnes op uw tier-1 lijst. Persoonlijk, gecoördineerd en meetbaar.",
    icon: Users,
  },
  {
    slug: "ai-personalisatie",
    phase: "Optimalisatie",
    title: "AI-personalisatie-playbook",
    description:
      "Genereer relevante openers en context per account. Zonder ruis, met hogere replyrate.",
    icon: Sparkles,
  },
];

const PlaybookShowcase = () => {
  return (
    <section id="playbooks" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <BookOpenCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-display font-semibold text-xs tracking-[0.2em] uppercase">
              Playbooks
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tighter leading-[1.04] mb-4">
            Concrete playbooks uit het{" "}
            <span className="text-gradient">systeem</span>.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Elk playbook is een bewezen werkstroom. Klaar om in te zetten,
            volledig aan te passen aan uw markt.
          </p>
        </div>

        {/* Grid — geïnspireerd op grid-feature-cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border border-border/60 bg-card/30 divide-x divide-y divide-border/60">
          {PLAYBOOKS.map((pb) => (
            <Link
              key={pb.slug}
              to="/playbooks"
              className="group block hover:bg-card/60 transition-colors"
            >
              <FeatureCard
                feature={{
                  title: pb.title,
                  description: pb.description,
                  icon: pb.icon,
                }}
              />
              <div className="px-6 pb-6 -mt-2 flex items-center justify-between">
                <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80">
                  {pb.phase}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  Bekijk
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/playbooks"
            className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all"
          >
            Bekijk alle playbooks
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PlaybookShowcase;
