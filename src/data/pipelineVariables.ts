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
  { key: "attract", label: "Attract", subtitle: "Wie u bereikt", icon: "🧲", color: "from-orange-500/20 to-orange-600/10" },
  { key: "reach", label: "Reach", subtitle: "Het juiste moment", icon: "🎯", color: "from-blue-500/20 to-blue-600/10" },
  { key: "resonate", label: "Resonate", subtitle: "Wat u zegt", icon: "✉️", color: "from-purple-500/20 to-purple-600/10" },
  { key: "execute", label: "Execution", subtitle: "Hoe u het doet", icon: "🔁", color: "from-green-500/20 to-green-600/10" },
  { key: "convert", label: "Convert", subtitle: "Van reactie naar klant", icon: "📈", color: "from-primary/20 to-primary/10" },
];

export const pipelineVariables: PipelineVariable[] = [
  {
    id: "x1",
    code: "X1",
    name: "ICP Precision",
    description: "Weet u precies wie uw ideale klant is?",
    details: ["Scherp afgebakend", "Duidelijk probleem", "Voldoende budget"],
    icon: "🧲",
    phase: "attract",
    phaseLabel: "Attract",
  },
  {
    id: "x2",
    code: "X2",
    name: "Data Integrity",
    description: "Klopt uw data? Juiste namen, nummers, e-mails?",
    details: ["Geen foute gegevens", "Verrijkt met extra info", "Geen dubbele records"],
    icon: "🗄️",
    phase: "attract",
    phaseLabel: "Attract",
  },
  {
    id: "x3",
    code: "X3",
    name: "Signal Relevance",
    description: "Ziet u wanneer iemand klaar is om te kopen?",
    details: ["Nieuwe functie gestart", "Team groeit", "Net funding ontvangen", "Nieuwe software in gebruik"],
    icon: "📡",
    phase: "reach",
    phaseLabel: "Reach",
  },
  {
    id: "x4",
    code: "X4",
    name: "Timing Accuracy",
    description: "Bereikt u mensen op het juiste moment?",
    details: ["Te vroeg: ze luisteren niet", "Te laat: al bij een ander", "Timing wint van volume"],
    icon: "⏱️",
    phase: "reach",
    phaseLabel: "Reach",
  },
  {
    id: "x5",
    code: "X5",
    name: "Offer-Market Fit",
    description: "Spreekt uw aanbod deze doelgroep écht aan?",
    details: ["Duidelijke waarde", "Voelt urgent", "Past bij hun situatie"],
    icon: "💎",
    phase: "resonate",
    phaseLabel: "Resonate",
  },
  {
    id: "x6",
    code: "X6",
    name: "Message Clarity",
    description: "Begrijpt iemand in 5 seconden wat u doet?",
    details: ["Korte zinnen", "Concreet", "Geen wollig taalgebruik"],
    icon: "✍️",
    phase: "resonate",
    phaseLabel: "Resonate",
  },
  {
    id: "x7",
    code: "X7",
    name: "Personalization Depth",
    description: "Voelt uw bericht persoonlijk of massaal?",
    details: ["Op maat, niet generiek", "Echte context", "Geen standaard templates"],
    icon: "🎭",
    phase: "resonate",
    phaseLabel: "Resonate",
  },
  {
    id: "x8",
    code: "X8",
    name: "Channel Strategy",
    description: "Gebruikt u de juiste kanalen, in de juiste volgorde?",
    details: ["LinkedIn", "E-mail", "Telefoon", "Slim gecombineerd"],
    icon: "📣",
    phase: "execute",
    phaseLabel: "Execution",
  },
  {
    id: "x9",
    code: "X9",
    name: "Touchpoint Design",
    description: "Hoe zien uw opvolgingen eruit?",
    details: ["Hoeveel contactmomenten", "Hoeveel tijd ertussen", "Genoeg afwisseling"],
    icon: "🔄",
    phase: "execute",
    phaseLabel: "Execution",
  },
  {
    id: "x10",
    code: "X10",
    name: "Conversion Handling",
    description: "Wat gebeurt er als iemand reageert?",
    details: ["Snel opvolgen", "Goed kwalificeren", "Makkelijk gesprek inplannen"],
    icon: "🏁",
    phase: "convert",
    phaseLabel: "Convert",
  },
];
