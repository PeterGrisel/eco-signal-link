import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  User,
  Globe,
  Database,
  Eye,
  MessageSquare,
  Target,
  Handshake,
  Megaphone,
  Search,
  FileText,
  Send,
  Mail,
  RefreshCw,
  Layout,
  ClipboardList,
  ListChecks,
  Headphones,
  CalendarCheck,
  BarChart3,
  MousePointerClick,
  MessageCircle,
  Reply,
  Users,
  ShieldCheck,
  Phone,
  Trophy,
  Brain,
  Radio,
  LineChart,
  Activity,
} from "lucide-react";

type FunnelTone = "awareness" | "engagement" | "conversion" | "sales";

const toneClasses: Record<FunnelTone, { text: string; bg: string; border: string; dot: string; stroke: string }> = {
  awareness: {
    text: "text-[hsl(var(--funnel-awareness))]",
    bg: "bg-[hsl(var(--funnel-awareness)/0.10)]",
    border: "border-[hsl(var(--funnel-awareness)/0.35)]",
    dot: "bg-[hsl(var(--funnel-awareness))]",
    stroke: "hsl(var(--funnel-awareness))",
  },
  engagement: {
    text: "text-[hsl(var(--funnel-engagement))]",
    bg: "bg-[hsl(var(--funnel-engagement)/0.10)]",
    border: "border-[hsl(var(--funnel-engagement)/0.35)]",
    dot: "bg-[hsl(var(--funnel-engagement))]",
    stroke: "hsl(var(--funnel-engagement))",
  },
  conversion: {
    text: "text-[hsl(var(--funnel-conversion))]",
    bg: "bg-[hsl(var(--funnel-conversion)/0.10)]",
    border: "border-[hsl(var(--funnel-conversion)/0.35)]",
    dot: "bg-[hsl(var(--funnel-conversion))]",
    stroke: "hsl(var(--funnel-conversion))",
  },
  sales: {
    text: "text-[hsl(var(--funnel-sales))]",
    bg: "bg-[hsl(var(--funnel-sales)/0.10)]",
    border: "border-[hsl(var(--funnel-sales)/0.35)]",
    dot: "bg-[hsl(var(--funnel-sales))]",
    stroke: "hsl(var(--funnel-sales))",
  },
};

const dataSources = [
  { icon: Building2, title: "Bedrijfsdata", body: "Firmografie, groeidata, financieel, technologie." },
  { icon: TrendingUp, title: "Koopsignalen", body: "Hiring, investeringen, vestigingen, intent." },
  { icon: User, title: "Gedrag & interactie", body: "Website, downloads, e-mail, engagement." },
  { icon: Globe, title: "Externe bronnen", body: "Nieuws, persberichten, social, aanbestedingen." },
  { icon: Database, title: "CRM & historie", body: "Deals, gesprekken, klantdata, interacties." },
];

const funnelLayers: Array<{
  tone: FunnelTone;
  label: string;
  sub: string;
  icon: typeof Eye;
  tools: Array<{ icon: typeof Eye; label: string }>;
  kpis: Array<{ icon: typeof Eye; label: string; sub: string }>;
}> = [
  {
    tone: "awareness",
    label: "Awareness",
    sub: "Zichtbaarheid & bereik",
    icon: Eye,
    tools: [
      { icon: Megaphone, label: "Paid social ads" },
      { icon: Search, label: "Search ads" },
      { icon: FileText, label: "Content & SEO" },
    ],
    kpis: [
      { icon: BarChart3, label: "Bereik", sub: "Impressies" },
      { icon: MousePointerClick, label: "Klikratio", sub: "CTR" },
    ],
  },
  {
    tone: "engagement",
    label: "Engagement",
    sub: "Interactie & interesse",
    icon: MessageSquare,
    tools: [
      { icon: Send, label: "Social outreach" },
      { icon: Mail, label: "E-mail sequences" },
      { icon: RefreshCw, label: "Retargeting" },
    ],
    kpis: [
      { icon: MessageCircle, label: "Reacties", sub: "% Engagement" },
      { icon: Reply, label: "Antwoordratio", sub: "% Reply" },
    ],
  },
  {
    tone: "conversion",
    label: "Conversie",
    sub: "Kwalificatie & intentie",
    icon: Target,
    tools: [
      { icon: Layout, label: "Landingspagina's" },
      { icon: ClipboardList, label: "Forms & CTA's" },
      { icon: ListChecks, label: "Lead scoring" },
    ],
    kpis: [
      { icon: Users, label: "Leads", sub: "Conversieratio" },
      { icon: ShieldCheck, label: "Kwaliteit", sub: "SQL %" },
    ],
  },
  {
    tone: "sales",
    label: "Sales",
    sub: "Gesprekken & deals",
    icon: Handshake,
    tools: [
      { icon: Database, label: "CRM" },
      { icon: Headphones, label: "Sales engagement" },
      { icon: CalendarCheck, label: "Meeting scheduler" },
    ],
    kpis: [
      { icon: Phone, label: "Gesprekken", sub: "Aantal" },
      { icon: Trophy, label: "Deals", sub: "Win rate / €" },
    ],
  },
];

const benefits = [
  { icon: Brain, title: "Centrale intelligentie", body: "Alle data en signalen op één plek." },
  { icon: Radio, title: "Real-time signalen", body: "Detecteer kansen eerder dan uw concurrent." },
  { icon: LineChart, title: "Leer & optimaliseer", body: "AI en data verbeteren elke campagne." },
  { icon: TrendingUp, title: "Voorspelbare groei", body: "Van losse acties naar één schaalbaar systeem." },
  { icon: ShieldCheck, title: "Volledige controle", body: "Transparant, meetbaar en op uw doelen." },
];

const tofMof = [
  { label: "TOF", sub: "Top of funnel", tone: "awareness" as FunnelTone },
  { label: "MOF", sub: "Middle of funnel", tone: "engagement" as FunnelTone },
  { label: "BOF", sub: "Bottom of funnel", tone: "sales" as FunnelTone },
];

/**
 * Funnel shape — 4 stacked trapeziums in a single SVG.
 * viewBox 400x340; widths shrink 380 → 260 → 180 → 120.
 */
const FunnelShape = () => {
  const layers = [
    { tone: "awareness" as FunnelTone, y0: 10, y1: 85, w0: 380, w1: 300 },
    { tone: "engagement" as FunnelTone, y0: 90, y1: 165, w0: 296, w1: 220 },
    { tone: "conversion" as FunnelTone, y0: 170, y1: 245, w0: 216, w1: 150 },
    { tone: "sales" as FunnelTone, y0: 250, y1: 320, w0: 146, w1: 90 },
  ];
  const cx = 200;
  return (
    <svg viewBox="0 0 400 340" className="w-full h-auto" aria-hidden>
      <defs>
        {layers.map((l) => (
          <linearGradient key={l.tone} id={`grad-${l.tone}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`hsl(var(--funnel-${l.tone}))`} stopOpacity="0.25" />
            <stop offset="100%" stopColor={`hsl(var(--funnel-${l.tone}))`} stopOpacity="0.08" />
          </linearGradient>
        ))}
      </defs>
      {layers.map((l, i) => {
        const pts = [
          [cx - l.w0 / 2, l.y0],
          [cx + l.w0 / 2, l.y0],
          [cx + l.w1 / 2, l.y1],
          [cx - l.w1 / 2, l.y1],
        ]
          .map((p) => p.join(","))
          .join(" ");
        return (
          <motion.polygon
            key={l.tone}
            points={pts}
            fill={`url(#grad-${l.tone})`}
            stroke={`hsl(var(--funnel-${l.tone}))`}
            strokeWidth="1.5"
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          />
        );
      })}
      {/* Layer labels */}
      {layers.map((l, i) => {
        const yMid = (l.y0 + l.y1) / 2;
        const layer = funnelLayers[i];
        return (
          <g key={`lbl-${l.tone}`}>
            <text
              x={cx}
              y={yMid - 4}
              textAnchor="middle"
              className="fill-foreground"
              style={{ font: "700 16px var(--font-display, system-ui)" }}
            >
              {layer.label.toUpperCase()}
            </text>
            <text
              x={cx}
              y={yMid + 12}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ font: "400 10px var(--font-body, system-ui)" }}
            >
              {layer.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const FunnelInfographic = () => {
  return (
    <section className="py-12 md:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16 max-w-3xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-[11px] md:text-sm tracking-[0.25em] uppercase mb-3 md:mb-4">
            Hoe het werkt
          </p>
          <h2 className="font-display font-bold text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-3 md:mb-4">
            <span className="text-primary">B2B</span> Groeimachine
          </h2>
          <p className="font-display text-[11px] sm:text-sm md:text-base tracking-[0.18em] uppercase text-muted-foreground mb-3 md:mb-4">
            Van signalen naar schaalbare groei
          </p>
          <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">
            Een schaalbaar B2B systeem dat elke week slimmer wordt.
          </p>
        </motion.div>

        {/* TOF / MOF / BOF rail */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-8 mb-8 md:mb-14 flex-wrap">
          {tofMof.map((t, i) => {
            const tone = toneClasses[t.tone];
            return (
              <div key={t.label} className="flex items-center gap-2 sm:gap-3 md:gap-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${tone.bg} ${tone.border} border-2 rotate-45 flex items-center justify-center shrink-0`}>
                    <span className={`-rotate-45 font-display font-bold text-[10px] sm:text-xs md:text-sm ${tone.text}`}>
                      {t.label}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-display font-semibold text-xs sm:text-sm text-foreground leading-tight">{t.label}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{t.sub}</div>
                  </div>
                </div>
                {i < tofMof.length - 1 && (
                  <div className="hidden md:block w-12 lg:w-20 border-t border-dashed border-border" />
                )}
              </div>
            );
          })}
        </div>

        {/* 3-column funnel grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,420px)_1fr] gap-8 lg:gap-8 items-start mb-10 md:mb-12">
          {/* LEFT — data sources */}
          <div>
            <p className="text-primary font-display font-semibold text-[11px] tracking-[0.18em] uppercase mb-3 md:mb-4 lg:text-right">
              Signalen & data · B2B focus
            </p>
            <div className="space-y-2.5 md:space-y-3">
              {dataSources.map((d, i) => (
                <motion.div
                  key={d.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="card-gradient border border-glow rounded-lg p-3 md:p-4 flex items-start gap-3"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <d.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-[13px] md:text-sm text-foreground uppercase tracking-wide leading-tight">{d.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug mt-1">{d.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CENTER — funnel shape */}
          <div className="relative mx-auto w-full max-w-sm md:max-w-md order-first lg:order-none">
            <FunnelShape />
          </div>

          {/* RIGHT — tools + KPIs (stacked sub-grid) */}
          <div className="space-y-6 md:space-y-6">
            <div>
              <p className="text-primary font-display font-semibold text-[11px] tracking-[0.18em] uppercase mb-3 md:mb-4">
                Tools & connecties
              </p>
              <div className="space-y-2.5 md:space-y-3">
                {funnelLayers.map((layer, i) => {
                  const tone = toneClasses[layer.tone];
                  return (
                    <motion.div
                      key={layer.label}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className={`rounded-lg border ${tone.border} ${tone.bg} p-3`}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                        <span className={`text-[10px] font-display font-semibold uppercase tracking-wider ${tone.text}`}>{layer.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                        {layer.tools.map((tool) => (
                          <div key={tool.label} className="flex items-center gap-2 text-xs">
                            <tool.icon className={`w-3.5 h-3.5 ${tone.text}`} />
                            <span className="text-foreground/85 leading-tight">{tool.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-primary font-display font-semibold text-[11px] tracking-[0.18em] uppercase mb-3 md:mb-4">
                Meten wat telt · signal based
              </p>
              <div className="space-y-2.5 md:space-y-3">
                {funnelLayers.map((layer, i) => {
                  const tone = toneClasses[layer.tone];
                  return (
                    <motion.div
                      key={`kpi-${layer.label}`}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className={`rounded-lg border ${tone.border} p-3`}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                        <span className={`text-[10px] font-display font-semibold uppercase tracking-wider ${tone.text}`}>{layer.label}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {layer.kpis.map((k) => (
                          <div key={k.label} className="flex items-center gap-2 min-w-0">
                            <k.icon className={`w-3.5 h-3.5 ${tone.text} shrink-0`} />
                            <div className="leading-tight min-w-0">
                              <div className="text-xs font-semibold text-foreground truncate">{k.label}</div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wide truncate">{k.sub}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence core */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="card-gradient border border-glow rounded-2xl p-5 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-5 md:gap-10"
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center">
              <Brain className="w-8 h-8 md:w-12 md:h-12 text-primary" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-primary font-display font-semibold text-[11px] tracking-[0.22em] uppercase mb-2">
              Intelligentielaag · optioneel
            </p>
            <h3 className="font-display font-bold text-lg md:text-2xl text-foreground mb-2 leading-tight">
              Het zenuwcentrum van uw groeimachine
            </h3>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
              Verbindt, verrijkt en analyseert elke interactie. Uw commerciële systeem wordt elke week slimmer.
            </p>
          </div>
        </motion.div>

        {/* Benefits row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 md:gap-3 mb-10 md:mb-12">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-gradient border border-glow rounded-lg p-3 md:p-4"
            >
              <b.icon className="w-5 h-5 text-primary mb-2" />
              <h4 className="font-display font-bold text-[13px] md:text-sm text-foreground mb-1 leading-tight">{b.title}</h4>
              <p className="text-xs text-muted-foreground leading-snug">{b.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer claim */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto px-2"
        >
          <p className="text-primary font-display font-semibold text-[11px] md:text-sm tracking-[0.25em] md:tracking-[0.3em] uppercase mb-3">
            100% B2B focus
          </p>
          <p className="text-muted-foreground text-sm md:text-lg mb-2 leading-relaxed">
            Geen leads. Geen lijsten. Geen tijdelijke trucs.
          </p>
          <p className="text-foreground font-display text-base md:text-xl leading-snug">
            Wij bouwen het <span className="text-gradient">commerciële systeem</span> achter voorspelbare B2B groei.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FunnelInfographic;