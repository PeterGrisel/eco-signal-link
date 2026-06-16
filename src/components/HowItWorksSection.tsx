import { motion } from "framer-motion";
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
  accent?: string;
}

const HowItWorksSection = ({ accent }: HowItWorksSectionProps = {}) => {
  const accentStyle = accent ? { color: accent } : undefined;
  const accentBorder = accent ? { borderColor: `${accent}55` } : undefined;
  const accentPhaseStyle = accent ? { color: `${accent}CC` } : undefined;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const handle = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) return;
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
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height - vh;
    const step = total / STEPS.length;
    const top = window.scrollY + rect.top + step * i + 4;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const gridPatternStyle: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(to right, hsl(var(--primary) / 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, hsl(var(--primary) / 0.08) 1px, transparent 1px)
    `,
    backgroundSize: "3.5rem 3.5rem",
  };

  return (
    <section id="proces" className="pt-16 md:pt-24 pb-8 md:pb-12 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10 mb-6 md:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
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
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-5">
            Wij bouwen een B2B Engine die uw markt zichtbaar maakt, doelgroepen activeert en signalen omzet in concrete opvolging.
          </p>
        </motion.div>
      </div>

      {/* ===== Scrolling Story Wrapper ===== */}
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: `${STEPS.length * 80 + 20}vh` }}
      >
        {/* Sticky panel — fits any viewport */}
        <div className="sticky top-0 h-[100svh] w-full flex items-center">
          <div className="container mx-auto px-4 md:px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-12 items-center">
              {/* LEFT */}
              <div className="relative flex flex-col justify-center order-2 lg:order-1">
                {/* Pagination */}
                <div className="flex items-center gap-2 mb-5 md:mb-7">
                  {STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToIndex(i)}
                      aria-label={`Ga naar stap ${i + 1}`}
                      className={`h-1 rounded-full transition-all duration-500 ${
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

                <div className="relative max-w-xl min-h-[240px] md:min-h-[260px]">
                  {STEPS.map((slide, i) => {
                    const Icon = slide.icon;
                    const isActive = i === activeIndex;
                    return (
                      <div
                        key={slide.n}
                        className={`transition-all duration-700 ease-in-out ${
                          isActive
                            ? "opacity-100 translate-y-0 relative"
                            : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                        }`}
                      >
                        <div className="flex items-center gap-3 md:gap-4 mb-4">
                          <span
                            className="w-10 h-10 md:w-11 md:h-11 rounded-xl border border-primary/30 bg-card flex items-center justify-center"
                            style={accentBorder}
                          >
                            <Icon
                              className="w-5 h-5 text-primary"
                              strokeWidth={1.6}
                              style={accentStyle}
                            />
                          </span>
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
                            {slide.n}
                          </span>
                          {slide.featured && (
                            <span
                              className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase px-2 py-1 rounded-md border border-primary/30 text-primary"
                              style={accentStyle}
                            >
                              Conversie
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-bold text-2xl md:text-4xl leading-tight mb-3">
                          {slide.title}
                        </h3>
                        <p
                          className="text-[11px] md:text-xs font-display font-semibold tracking-[0.18em] uppercase mb-3"
                          style={accentPhaseStyle}
                        >
                          {slide.subtitle}
                        </p>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {slide.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 md:mt-7">
                  <Link
                    to="/playbooks"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                    style={accentStyle}
                  >
                    Bekijk de 8 uitvoerende playbooks
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* RIGHT */}
              <div
                className="relative rounded-2xl overflow-hidden border border-border/50 h-[42vh] sm:h-[48vh] md:h-[56vh] lg:h-[62vh] order-1 lg:order-2"
                style={gridPatternStyle}
              >
                <div className="absolute inset-3 md:inset-5">
                  {STEPS.map((slide, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <div
                        key={slide.n}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          isActive
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        <div className="card-gradient border-glow rounded-xl p-4 md:p-6 h-full flex flex-col overflow-hidden">
                          <p
                            className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase mb-3"
                            style={accentPhaseStyle}
                          >
                            Diensten
                          </p>
                          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                            {slide.labels.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-md border border-primary/25 bg-primary/5 text-[11px] md:text-xs font-medium text-foreground/85"
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

                          <div className="mt-auto border-t border-primary/15 pt-4">
                            <p
                              className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase mb-2"
                              style={accentPhaseStyle}
                            >
                              Resultaat
                            </p>
                            <p className="text-xs md:text-sm text-primary/90 leading-relaxed font-medium">
                              {slide.resultaat}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
