import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
    subtitle: "We maken zichtbaar waar de commerciële kansen zitten.",
    icon: Eye,
    colSpan: 2 as const,
    summary:
      "We vertalen uw groeidoel naar concrete doelgroepen, accounts, contactpersonen en signalen.",
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
    subtitle: "We activeren de markt met gerichte campagnes.",
    icon: MessageSquare,
    colSpan: 1 as const,
    summary:
      "We brengen uw doelgroep in beweging via e-mail, LinkedIn, content en nurture flows.",
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
    subtitle: "We zetten signalen om in concrete salesactie.",
    icon: PhoneCall,
    colSpan: 3 as const,
    featured: true,
    summary:
      "We zorgen dat sales, accountmanagement of directie weet wie moet worden opgevolgd, waarom en met welke boodschap.",
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
  const accentPhaseStyle = accent ? { color: `${accent}CC` } : undefined;

  // Interactive scrolling story state
  const scrollWrapRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const wrap = scrollWrapRef.current;
    if (!wrap) return;
    const handle = () => {
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const step = total / STEPS.length;
      const next = Math.min(
        STEPS.length - 1,
        Math.max(0, Math.floor(scrolled / Math.max(step, 1)))
      );
      setActiveIndex(next);
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  const scrollToIndex = (i: number) => {
    const wrap = scrollWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const step = total / STEPS.length;
    const top = window.scrollY + rect.top + step * i + 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const active = STEPS[activeIndex];
  const ActiveIcon = active.icon;

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
            Zo lossen we het op
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Van groeidoel naar
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
              commerciële uitvoering.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Wij bouwen een B2B Engine die uw markt zichtbaar maakt, doelgroepen activeert en signalen omzet in concrete opvolging. Niet als losse campagne, maar als doorlopend groeisysteem.
          </p>
        </motion.div>

        {/* Interactive scrolling story */}
        <div
          ref={scrollWrapRef}
          className="relative"
          style={{ height: `${STEPS.length * 100}vh` }}
        >
          <div className="sticky top-0 h-screen flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 w-full">
              {/* Left: text + pagination */}
              <div className="flex flex-col justify-center">
                {/* Pagination bars */}
                <div className="flex items-center gap-2 mb-8">
                  {STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToIndex(i)}
                      aria-label={`Ga naar stap ${i + 1}`}
                      className={`h-1 rounded-full transition-all duration-500 ease-in-out ${
                        i === activeIndex
                          ? "w-12 bg-primary"
                          : "w-6 bg-primary/20 hover:bg-primary/40"
                      }`}
                      style={
                        accent && i === activeIndex
                          ? { backgroundColor: accent }
                          : undefined
                      }
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.n}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <span
                        className="w-12 h-12 rounded-xl border border-primary/30 bg-card flex items-center justify-center"
                        style={accentBorder}
                      >
                        <ActiveIcon
                          className="w-5 h-5 text-primary"
                          strokeWidth={1.6}
                          style={accentStyle}
                        />
                      </span>
                      <span
                        className="font-display font-bold text-4xl md:text-5xl text-gradient leading-none"
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
                        {active.n}
                      </span>
                      {active.featured && (
                        <span
                          className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase px-2 py-1 rounded-md border border-primary/30 text-primary"
                          style={accentStyle}
                        >
                          Conversie
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-3">
                      {active.title}
                    </h3>
                    <p
                      className="text-sm font-display font-semibold tracking-wide uppercase mb-5"
                      style={accentPhaseStyle}
                    >
                      {active.subtitle}
                    </p>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                      {active.summary}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: visual panel with diensten + resultaat */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.n}
                    initial={{ opacity: 0, scale: 0.98, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -16 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative card-gradient border-glow rounded-2xl p-6 md:p-8 overflow-hidden"
                  >
                    <div className="absolute inset-0 pointer-events-none opacity-60">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08)_1px,transparent_1px)] bg-[length:6px_6px]" />
                    </div>

                    <div className="relative">
                      <p
                        className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase mb-3"
                        style={accentPhaseStyle}
                      >
                        Diensten
                      </p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {active.labels.map((item, idx) => (
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

                      <div className="border-t border-primary/15 pt-5">
                        <p
                          className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase mb-2"
                          style={accentPhaseStyle}
                        >
                          Resultaat
                        </p>
                        <p className="text-sm md:text-base text-primary/90 leading-relaxed font-medium">
                          {active.resultaat}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
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
