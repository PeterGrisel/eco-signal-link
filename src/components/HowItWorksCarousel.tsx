import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Eye,
  MessageSquare,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import awarenessStep1 from "@/assets/how-it-works/awareness-step-1.png.asset.json";
import engagementStep2 from "@/assets/how-it-works/engagement-step-2.png.asset.json";
import activitiesStep3 from "@/assets/how-it-works/activities-step-3.png.asset.json";

// =====================================================================
// Types
// =====================================================================
type WrapperStyle = MotionStyle & {
  "--x": MotionValue<string>;
  "--y": MotionValue<string>;
};

interface Step {
  id: string;
  n: string;
  name: string;
  title: string;
  subtitle: string;
  summary: string;
  labels: string[];
  resultaat: string;
  icon: LucideIcon;
  imgSrc: string;
  imgAlt: string;
}

// =====================================================================
// Content — gelijk aan de oude HowItWorksSection (Awareness / Engagement / Activities)
// =====================================================================
const placeholder = (label: string) =>
  `https://placehold.co/1200x800/0a0a0a/E8945A?text=${encodeURIComponent(label)}`;

const steps: readonly Step[] = [
  {
    id: "1",
    n: "01",
    name: "Awareness",
    title: "Awareness",
    subtitle: "We maken zichtbaar waar de commerciële kansen zitten.",
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
      "Een levende targetlijst met accounts die relevant, verrijkt en commercieel geprioriteerd zijn.",
    icon: Eye,
    imgSrc: awarenessStep1.url,
    imgAlt: "Awareness — zichtbaar maken waar de kansen zitten",
  },
  {
    id: "2",
    n: "02",
    name: "Engagement",
    title: "Engagement",
    subtitle: "We activeren de markt met gerichte campagnes.",
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
      "Meer interactie met de juiste accounts en inzicht in wie warm wordt of opvolging nodig heeft.",
    icon: MessageSquare,
    imgSrc: engagementStep2.url,
    imgAlt: "Engagement — markt activeren met gerichte campagnes",
  },
  {
    id: "3",
    n: "03",
    name: "Activities",
    title: "Activities",
    subtitle: "We zetten signalen om in concrete salesactie.",
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
    icon: PhoneCall,
    imgSrc: placeholder("03 · Activities"),
    imgAlt: "Activities — signalen omzetten in salesactie",
  },
];

const TOTAL_STEPS = steps.length;

// =====================================================================
// Hooks
// =====================================================================
function useNumberCycler(totalSteps: number = TOTAL_STEPS, interval = 6000) {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentNumber((prev) => (prev + 1) % totalSteps);
    }, interval);
    return () => clearTimeout(timer);
  }, [currentNumber, totalSteps, interval]);

  const setStep = useCallback(
    (i: number) => setCurrentNumber(i % totalSteps),
    [totalSteps],
  );

  return { currentNumber, setStep };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// =====================================================================
// Sub-components
// =====================================================================
const stepVariants: Variants = {
  inactive: { scale: 0.95, opacity: 0.6 },
  active: { scale: 1, opacity: 1 },
};

interface StepImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const StepImage = forwardRef<HTMLImageElement, StepImageProps>(
  ({ src, alt, className, style }, ref) => (
    <img
      ref={ref}
      alt={alt}
      src={src}
      className={className}
      style={{ userSelect: "none", ...style }}
      onError={(e) => (e.currentTarget.src = placeholder(alt))}
    />
  ),
);
StepImage.displayName = "StepImage";
const MotionStepImage = motion(StepImage);

function FeatureCard({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = useIsMobile();
  const s = steps[step];
  const Icon = s.icon;

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isMobile) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className="group relative w-full rounded-3xl"
      onMouseMove={handleMouseMove}
      style={
        {
          "--x": useMotionTemplate`${mouseX}px`,
          "--y": useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      {/* Soft hover spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(450px circle at var(--x) var(--y), hsl(var(--primary) / 0.12), transparent 60%)",
        }}
      />

      <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-card/80 backdrop-blur-md card-gradient">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* LEFT — Copy */}
          <div className="lg:col-span-2 p-8 md:p-10 flex flex-col min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col h-full"
              >
                {/* Top: icon + number */}
                <div className="flex items-center justify-between mb-5">
                  <span className="w-11 h-11 rounded-xl border border-primary/30 bg-background/50 flex items-center justify-center">
                    <Icon
                      className="w-5 h-5 text-primary"
                      strokeWidth={1.6}
                    />
                  </span>
                  <span className="font-display font-bold text-3xl md:text-4xl text-gradient leading-none">
                    {s.n}
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl md:text-3xl leading-tight mb-2">
                  {s.title}
                </h3>
                <p className="text-xs font-display font-semibold tracking-[0.18em] uppercase text-primary/85 mb-4">
                  {s.subtitle}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {s.summary}
                </p>

                <div className="mb-6">
                  <p className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80 mb-3">
                    Diensten
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {s.labels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center px-2.5 py-1 rounded-md border border-primary/25 bg-primary/5 text-xs font-medium text-foreground/85"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto border-t border-primary/15 pt-5">
                  <p className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80 mb-2">
                    Resultaat
                  </p>
                  <p className="text-sm text-primary/90 leading-relaxed font-medium">
                    {s.resultaat}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — Image */}
          <div className="relative lg:col-span-3 min-h-[320px] lg:min-h-[460px] border-t lg:border-t-0 lg:border-l border-primary/10 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.06),transparent_70%)] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 24,
                  mass: 0.6,
                }}
                className="absolute inset-0 flex items-center justify-center p-6 md:p-10"
              >
                <MotionStepImage
                  src={s.imgSrc}
                  alt={s.imgAlt}
                  className="max-h-full max-w-full object-contain rounded-2xl border border-primary/15 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

function StepsNav({
  current,
  onChange,
}: {
  current: number;
  onChange: (i: number) => void;
}) {
  return (
    <nav aria-label="Voortgang" className="flex justify-center">
      <ol className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((s, idx) => {
          const completed = current > idx;
          const isCurrent = current === idx;
          return (
            <motion.li
              key={s.id}
              initial="inactive"
              animate={isCurrent ? "active" : "inactive"}
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                onClick={() => onChange(idx)}
                className={cn(
                  "group flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : "border border-primary/20 bg-card/50 text-foreground/80 hover:bg-primary/10 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    completed
                      ? "bg-primary-foreground/90 text-primary"
                      : isCurrent
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary/15 text-primary",
                  )}
                >
                  {completed ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <span className="text-[11px] font-display font-bold">
                      {idx + 1}
                    </span>
                  )}
                </span>
                <span className="hidden sm:inline-block">{s.name}</span>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}

// =====================================================================
// Main
// =====================================================================
const HowItWorksCarousel = () => {
  const { currentNumber: step, setStep } = useNumberCycler();

  return (
    <section id="proces" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header — identiek aan oude sectie */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-3xl mx-auto text-center"
        >
          <p className="inline-flex items-center justify-center gap-2 text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4 w-full">
            <BookOpenCheck className="w-4 h-4" strokeWidth={1.8} />
            Zo lossen we het op
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Van groeidoel naar
            <br />
            <span className="text-gradient">commerciële uitvoering.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Wij bouwen een B2B Engine die uw markt zichtbaar maakt, doelgroepen
            activeert en signalen omzet in concrete opvolging. Niet als losse
            campagne, maar als doorlopend groeisysteem.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
          <FeatureCard step={step}>{null}</FeatureCard>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <StepsNav current={step} onChange={setStep} />
          </motion.div>
        </div>

        {/* Link naar playbooks */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            to="/playbooks"
            className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all"
          >
            Bekijk de 8 uitvoerende playbooks achter deze 3 stappen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksCarousel;