import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Target,
  Send,
  PhoneCall,
  ArrowRight,
  BookOpenCheck,
  Eye,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Awareness",
    subtitle: "Van onbekende markt naar dynamische targetlijsten.",
    icon: Eye,
    summary:
      "We starten met het zichtbaar maken van relevante accounts, prospects en bestaande klantkansen. Niet op basis van statische lijsten, maar op basis van data, signalen en commerciële context.",
    doen: [
      "opbouwen van dynamische prospect- en leadlijsten",
      "analyseren van bestaande klantdata en CRM-informatie",
      "herkennen van commerciële signalen zoals websitebezoek, branche, gedrag, orderhistorie, marktfit of engagement",
      "verrijken van accounts en contactpersonen",
      "toekennen van relevantiescores voor kwalificatie en prioriteit",
      "segmenteren op markt, regio, productgroep, use case of klantwaarde",
    ],
    resultaat:
      "Een levende targetlijst met accounts die relevant zijn, verrijkt zijn en commercieel geprioriteerd kunnen worden.",
  },
  {
    n: "02",
    title: "Engagement",
    subtitle: "Van relevante accounts naar warme commerciële interactie.",
    icon: MessageSquare,
    summary:
      "Daarna activeren we de juiste doelgroepen met gerichte campagnes. We zorgen dat prospects, leads en bestaande klanten niet alleen in een lijst staan, maar structureel worden benaderd, gevoed en opgevolgd.",
    doen: [
      "omzetten van dynamische lijsten naar actieve campagnes",
      "uitvoeren van campagnes via e-mail, LinkedIn en eventueel telefoon",
      "categoriseren van leads en prospects op engagementniveau",
      "ontwikkelen van tekstuele campagnes, LinkedIn-berichten en nurture flows",
      "maken en inzetten van contentcampagnes, eventueel met video",
      "uitvoeren of ondersteunen van LinkedIn-advertenties",
      "opvolgen op basis van gedrag, interactie en relevantie",
    ],
    resultaat:
      "Meer interactie met de juiste accounts en duidelijk inzicht in wie interesse toont, warm wordt of opvolging nodig heeft.",
  },
  {
    n: "03",
    title: "Activities",
    subtitle: "Van engagement naar concrete salesactie.",
    icon: PhoneCall,
    summary:
      "De laatste stap is zorgen dat commerciële signalen niet blijven hangen in dashboards of campagnes, maar worden omgezet naar echte acties voor sales, accountmanagement, binnendienst of directie.",
    doen: [
      "overnemen of ondersteunen van activatiegesprekken",
      "telefonisch opvolgen van warme leads of campagnesignalen",
      "verwerken van signalen, statussen en opvolging in CRM",
      "aanmaken van salesactiviteiten, taken en follow-ups",
      "routeren van kansen naar de juiste persoon of afdeling",
      "ondersteunen bij offerte-opvolging",
      "waar mogelijk automatiseren van delen van het offerteproces",
      "rapporteren op gesprekken, kansen, pipeline en conversie",
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

        {/* 3 Steps */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-gradient border-glow rounded-2xl p-6 md:p-8 flex flex-col"
            >
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
                <span
                  className="font-display font-bold text-3xl text-gradient leading-none"
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

              {/* Wat we doen */}
              <div className="mb-6">
                <p
                  className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase mb-3"
                  style={accentPhaseStyle}
                >
                  Wat we doen
                </p>
                <ul className="space-y-2">
                  {s.doen.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed"
                    >
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0"
                        style={accent ? { backgroundColor: accent } : undefined}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
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
