import ChapterFrame from "../ChapterFrame";
import { motion } from "framer-motion";
import {
  ClipboardList,
  PhoneCall,
  Clock,
  UserRound,
  RotateCcw,
  Frown,
  Brain,
  Search,
  Radar,
  Target,
  Sparkles,
  TrendingUp,
  Smile,
  ArrowDown,
} from "lucide-react";

const oude = [
  { icon: ClipboardList, label: "Lijst maken" },
  { icon: PhoneCall, label: "Mensen benaderen" },
  { icon: Clock, label: "Wachten op reactie" },
  { icon: UserRound, label: "Sales volgt op" },
  { icon: RotateCcw, label: "Opnieuw beginnen" },
];

const slimme = [
  { icon: Brain, label: "Leren wie uw beste klant is" },
  { icon: Search, label: "Meer van zulke bedrijven vinden" },
  { icon: Radar, label: "Interesse herkennen" },
  { icon: Target, label: "De juiste actie starten" },
  { icon: Sparkles, label: "Leren van wat werkt" },
  { icon: TrendingUp, label: "Slim uitbreiden" },
];

function Step({
  n,
  Icon,
  label,
  variant,
}: {
  n: number;
  Icon: typeof ClipboardList;
  label: string;
  variant: "old" | "new";
}) {
  const isNew = variant === "new";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: n * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-4"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums ${
          isNew
            ? "bg-primary/15 text-primary border border-primary/30"
            : "bg-foreground/10 text-foreground/60 border border-foreground/15"
        }`}
      >
        {n}
      </span>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isNew ? "bg-primary/10" : "bg-foreground/[0.06]"
        }`}
      >
        <Icon
          className={`h-4 w-4 ${isNew ? "text-primary" : "text-foreground/55"}`}
          strokeWidth={1.5}
        />
      </span>
      <span
        className={`text-sm md:text-base ${
          isNew ? "text-foreground" : "text-foreground/70"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}

function Column({
  title,
  subtitle,
  badgeTone,
  steps,
  footerIcon: FooterIcon,
  footerText,
  variant,
}: {
  title: string;
  subtitle: string;
  badgeTone: "muted" | "primary";
  steps: typeof oude;
  footerIcon: typeof Frown;
  footerText: string;
  variant: "old" | "new";
}) {
  const isNew = variant === "new";
  return (
    <div
      className={`relative rounded-3xl border p-6 md:p-8 backdrop-blur-sm overflow-hidden ${
        isNew
          ? "border-primary/30 bg-card/95 shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.25)]"
          : "border-foreground/10 bg-card/70"
      }`}
    >
      {isNew && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />
      )}
      <div className="flex justify-center mb-6">
        <span
          className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.25em] ${
            badgeTone === "primary"
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-foreground/10 text-foreground/60 border border-foreground/15"
          }`}
        >
          {title}
        </span>
      </div>
      <p
        className={`text-center text-sm md:text-base mb-7 ${
          isNew ? "text-primary/90" : "text-foreground/60"
        }`}
      >
        {subtitle}
      </p>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={s.label}>
            <Step n={i + 1} Icon={s.icon} label={s.label} variant={variant} />
            {i < steps.length - 1 && (
              <div className="flex justify-start pl-4 my-1">
                <ArrowDown
                  className={`h-3 w-3 ${
                    isNew ? "text-primary/40" : "text-foreground/25"
                  }`}
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        className={`mt-8 flex items-center gap-3 rounded-xl border px-4 py-3 ${
          isNew
            ? "border-primary/25 bg-primary/[0.06]"
            : "border-foreground/10 bg-foreground/[0.04]"
        }`}
      >
        <FooterIcon
          className={`h-4 w-4 shrink-0 ${
            isNew ? "text-primary" : "text-foreground/55"
          }`}
          strokeWidth={1.5}
        />
        <span
          className={`text-xs md:text-sm ${
            isNew ? "text-foreground/90" : "text-foreground/65"
          }`}
        >
          {footerText}
        </span>
      </div>
    </div>
  );
}

export default function Chapter03TwoWays() {
  return (
    <ChapterFrame
      id="chapter-03"
      number="03"
      eyebrow="Vroeger vs nu"
      title={
        <>
          Niet harder zoeken. <span className="text-primary">Slimmer herkennen.</span>
        </>
      }
      intro="Vroeger begon elke maand opnieuw. Nu onthoudt het systeem wat werkt."
      closing={
        <>
          Eén systeem dat leert. <span className="text-primary">Elke dag een beetje slimmer.</span>
        </>
      }
      tone="neutral"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Column
          variant="old"
          title="De oude manier"
          subtitle="Steeds opnieuw beginnen"
          badgeTone="muted"
          steps={oude}
          footerIcon={Frown}
          footerText="Veel handwerk. Elke keer opnieuw."
        />
        <Column
          variant="new"
          title="De slimme manier"
          subtitle="Eén systeem dat blijft leren"
          badgeTone="primary"
          steps={slimme}
          footerIcon={Smile}
          footerText="Het systeem onthoudt, leert en helpt mee."
        />
      </div>
    </ChapterFrame>
  );
}