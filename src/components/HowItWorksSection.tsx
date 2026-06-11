import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PhoneCall,
  ArrowRight,
  BookOpenCheck,
  Eye,
  MessageSquare,
} from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Awareness",
    subtitle: "Van onbekende markt naar dynamische targetlijsten.",
    icon: Eye,
    colSpan: 2 as const,
    summary:
      "Zichtbaar maken wie relevant is. Op basis van data, signalen en commerciële context.",
    labels: [
      "Targetlijsten",
      "Data-verrijking",
      "Signaal-detectie",
      "ICP & segmentatie",
      "Lead scoring",
      "CRM-analyse",
    ],
    resultaat:
      "Een levende targetlijst met accounts die relevant zijn, verrijkt zijn en commercieel geprioriteerd kunnen worden.",
  },
  {
    n: "02",
    title: "Engagement",
    subtitle: "Van relevante accounts naar warme commerciële interactie.",
    icon: MessageSquare,
    colSpan: 1 as const,
    summary:
      "Doelgroepen activeren met gerichte campagnes. Benaderen, voeden, opvolgen.",
    labels: [
      "E-mail campagnes",
      "LinkedIn outreach",
      "Nurture flows",
      "Contentmanagement",
      "Video campagnes",
      "LinkedIn ads",
      "Engagement scoring",
    ],
    resultaat:
      "Meer interactie met de juiste accounts en duidelijk inzicht in wie interesse toont, warm wordt of opvolging nodig heeft.",
  },
  {
    n: "03",
    title: "Activities",
    subtitle: "Van engagement naar concrete salesactie.",
    icon: PhoneCall,
    colSpan: 3 as const,
    featured: true,
    summary:
      "Signalen omzetten in echte acties voor sales, accountmanagement en directie.",
    labels: [
      "Activatiegesprekken",
      "Telefonische opvolging",
      "CRM-inrichting",
      "Sales taken & follow-ups",
      "Lead routering",
      "Offerte-opvolging",
      "Offerte-automatisering",
      "Pipeline rapportage",
    ],
    resultaat:
      "Commerciële signalen worden omgezet naar gesprekken, afspraken, offertes en concrete pipeline.",
  },
];

interface HowItWorksSectionProps {
  accent?: string; // custom brand accent (hex). When set, overrides primary tokens.
}

const HowItWorksSection = ({ accent }: HowItWorksSectionProps = {}) => {
  const accentStyle = accent ? { color: accent } : undefined;
  const accentBorder = accent ? { borderColor: `${accent}55` } : undefined;
  const accentBg = accent ? { backgroundColor: `${accent}15` } : undefined;
  const accentPhaseStyle = accent ? { color: `${accent}CC` } : undefined;
  const accentOutputStyle = accent
    ? { color: `${accent}CC`, borderColor: `${accent}33` }
    : undefined;

  return (
    <section id="proces" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-20 max-w-3xl mx-auto text-center"
        >
          <p
            className="inline-flex items-center justify-center gap-2 text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4 w-full"
            style={accentStyle}
          >
            <BookOpenCheck className="w-4 h-4" strokeWidth={1.8} />
            Het systeem in 3 stappen
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            De B2BGroeiMachine.
            <br />
            <span
              className="text-gradient"
              style={
                accent
                  ? {
                      backgroundImage: "none",
                      WebkitTextFillColor: accent,
                      color: accent,
                    }
                  : undefined
              }
            >
              Van zichtbaarheid naar omzet.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Awareness maakt zichtbaar wie relevant is. Engagement maakt de markt
            warm. Activities zetten signalen om naar omzetgerichte actie.
          </p>
        </motion.div>

        {/* 3 Steps — bento layout: 2 / 1 op rij 1, full-width conversie op rij 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative card-gradient border-glow rounded-2xl p-6 md:p-8 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 will-change-transform ${
                s.colSpan === 3
                  ? "lg:col-span-3"
                  : s.colSpan === 2
                  ? "lg:col-span-2"
                  : "lg:col-span-1"
              } ${s.featured ? "ring-1 ring-primary/40" : ""}`}
              style={
                s.featured && accent
                  ? { boxShadow: `0 0 0 1px ${accent}55` }
                  : undefined
              }
            >
              {/* Dot pattern overlay on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08)_1px,transparent_1px)] bg-[length:6px_6px]" />
              </div>

              <div className="relative flex flex-col h-full">
              {/* Top bar: icon + number */}
              <div className="flex items-center justify-between mb-5">
                <span
                  className="w-11 h-11 rounded-xl border border-primary/30 bg-card flex items-center justify-center"
                  style={accentBorder}
                >
                  <s.icon
                    className="w-5 h-5 text-primary"
                    strokeWidth={1.6}
                    style={accentStyle}
                  />
                </span>
                <div className="flex items-center gap-3">
                  {s.featured && (
                    <span
                      className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase px-2 py-1 rounded-md border border-primary/30 text-primary"
                      style={accentStyle}
                    >
                      Conversie
                    </span>
                  )}
                  <span
                  className="font-display font-bold text-3xl md:text-4xl text-gradient leading-none"
                  style={
                    accent
                      ? {
                          color: accent,
                          WebkitTextFillColor: accent,
                          backgroundImage: "none",
                        }
                      : undefined
                  }
                >
                  {s.n}
                </span>
                </div>
              </div>

              {/* Title + subtitle */}
              <h3 className="font-display font-bold text-xl md:text-2xl leading-tight mb-2">
                {s.title}
              </h3>
              <p
                className="text-sm font-display font-semibold tracking-wide uppercase mb-4"
                style={accentPhaseStyle}
              >
                {s.subtitle}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {s.summary}
              </p>

              {/* Diensten — labels */}
              <div className="mb-6">
                <p
                  className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase mb-3"
                  style={accentPhaseStyle}
                >
                  Diensten
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.labels.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1 rounded-md border border-primary/25 bg-primary/5 text-xs font-medium text-foreground/85"
                      style={
                        accent
                          ? {
                              borderColor: `${accent}40`,
                              backgroundColor: `${accent}10`,
                            }
                          : undefined
                      }
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resultaat */}
              <div
                className="mt-auto border-t border-primary/15 pt-5"
                style={accentOutputStyle}
              >
                <p
                  className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase mb-2"
                  style={accentPhaseStyle}
                >
                  Resultaat
                </p>
                <p className="text-sm text-primary/90 leading-relaxed font-medium">
                  {s.resultaat}
                </p>
              </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link naar de 8 playbooks */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            to="/playbooks"
            className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all"
            style={accentStyle}
          >
            Bekijk de 8 uitvoerende playbooks achter deze 3 stappen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
