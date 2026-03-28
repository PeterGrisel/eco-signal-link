export interface PipelineVariable {
  id: string;
  code: string;
  name: string;
  description: string;
  details: string[];
  icon: string;
  phase: string;
  phaseLabel: string;
}

export const pipelinePhases = [
  { key: "attract", label: "Attract", subtitle: "Wie je target", icon: "🧲", color: "from-orange-500/20 to-orange-600/10" },
  { key: "reach", label: "Reach", subtitle: "Wanneer & waarom nu", icon: "🎯", color: "from-blue-500/20 to-blue-600/10" },
  { key: "resonate", label: "Resonate", subtitle: "De boodschap", icon: "✉️", color: "from-purple-500/20 to-purple-600/10" },
  { key: "execute", label: "Execution", subtitle: "Kanalen & flow", icon: "🔁", color: "from-green-500/20 to-green-600/10" },
  { key: "convert", label: "Convert", subtitle: "Na de reactie", icon: "📈", color: "from-primary/20 to-primary/10" },
];

export const pipelineVariables: PipelineVariable[] = [
  {
    id: "x1",
    code: "X1",
    name: "ICP Precision",
    description: "Hoe scherp uw ideale klantprofiel is",
    details: ["Niche versus breed", "Duidelijke pain", "Koopkracht gevalideerd"],
    icon: "🧲",
    phase: "attract",
    phaseLabel: "Attract",
  },
  {
    id: "x2",
    code: "X2",
    name: "Data Integrity",
    description: "Kwaliteit van uw data",
    details: ["Correcte contactgegevens", "Verrijking", "Geen duplicaten"],
    icon: "🗄️",
    phase: "attract",
    phaseLabel: "Attract",
  },
  {
    id: "x3",
    code: "X3",
    name: "Signal Relevance",
    description: "Hoe sterk de koopintentie signalen zijn",
    details: ["Job changes", "Hiring signals", "Funding events", "Tech adoption"],
    icon: "📡",
    phase: "reach",
    phaseLabel: "Reach",
  },
  {
    id: "x4",
    code: "X4",
    name: "Timing Accuracy",
    description: "Hoe goed uw timing klopt",
    details: ["Te vroeg: genegeerd", "Te laat: gemist", "Timing verslaat volume"],
    icon: "⏱️",
    phase: "reach",
    phaseLabel: "Reach",
  },
  {
    id: "x5",
    code: "X5",
    name: "Offer-Market Fit",
    description: "Hoe aantrekkelijk uw aanbod is voor deze doelgroep",
    details: ["Duidelijke waarde", "Urgentie", "Relevantie"],
    icon: "💎",
    phase: "resonate",
    phaseLabel: "Resonate",
  },
  {
    id: "x6",
    code: "X6",
    name: "Message Clarity",
    description: "Hoe helder en begrijpelijk uw boodschap is",
    details: ["Simpel", "Concreet", "Zonder fluff"],
    icon: "✍️",
    phase: "resonate",
    phaseLabel: "Resonate",
  },
  {
    id: "x7",
    code: "X7",
    name: "Personalization Depth",
    description: "Hoe relevant uw bericht voelt",
    details: ["Contextueel versus generiek", "Echte personalisatie", "Geen tokens"],
    icon: "🎭",
    phase: "resonate",
    phaseLabel: "Resonate",
  },
  {
    id: "x8",
    code: "X8",
    name: "Channel Strategy",
    description: "Welke kanalen u gebruikt en hoe ze samenwerken",
    details: ["LinkedIn", "Email", "Calls", "Sequencing"],
    icon: "📣",
    phase: "execute",
    phaseLabel: "Execution",
  },
  {
    id: "x9",
    code: "X9",
    name: "Touchpoint Design",
    description: "Hoe uw follow-ups en flow zijn opgebouwd",
    details: ["Aantal touches", "Timing tussen touches", "Variatie in aanpak"],
    icon: "🔄",
    phase: "execute",
    phaseLabel: "Execution",
  },
  {
    id: "x10",
    code: "X10",
    name: "Conversion Handling",
    description: "Wat er gebeurt na de reactie",
    details: ["Snelheid van opvolging", "Kwalificatie", "Call booking flow"],
    icon: "🏁",
    phase: "convert",
    phaseLabel: "Convert",
  },
];
