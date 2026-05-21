import { useState } from "react";
import ChapterFrame from "../ChapterFrame";
import { ExpandingCards, type CardItem } from "@/components/ui/expanding-cards";
import {
  List,
  Search,
  Send,
  PhoneCall,
  CalendarCheck,
  Handshake,
  RotateCw,
  Compass,
  Brain,
  Target,
  Gauge,
  Workflow,
  Layers,
  Route,
  Activity,
} from "lucide-react";

const standardSteps: CardItem[] = [
  { id: "s1", eyebrow: "01", title: "Lijst bouwen", description: "Export uit database of lijst kopen.", icon: <List className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "s2", eyebrow: "02", title: "Handmatig onderzoek", description: "Contacten zoeken en verrijken met de hand.", icon: <Search className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "s3", eyebrow: "03", title: "Outreach versturen", description: "Mails, LinkedIn of bellen, vaak in losse acties.", icon: <Send className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "s4", eyebrow: "04", title: "Sales opvolgt", description: "Wat binnenkomt wordt opgepakt door sales.", icon: <PhoneCall className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "s5", eyebrow: "05", title: "Meetings krijgen", description: "Enkele reacties worden gesprekken.", icon: <CalendarCheck className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "s6", eyebrow: "06", title: "Deals sluiten", description: "Een paar deals komen rond.", icon: <Handshake className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "s7", eyebrow: "07", title: "Opnieuw beginnen", description: "Nieuwe campagne, nieuwe lijst, weer van voren af aan.", icon: <RotateCw className="h-5 w-5" strokeWidth={1.75} /> },
];

const digitalSteps: CardItem[] = [
  { id: "d1", eyebrow: "01", title: "Context & ICP", description: "Wij leggen markt, data en proces vast.", icon: <Compass className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "d2", eyebrow: "02", title: "Commercieel brein", description: "Logica, segmenten, signalen en scoring.", icon: <Brain className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "d3", eyebrow: "03", title: "Targeting engine", description: "Dynamisch segmenteren en verrijken.", icon: <Target className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "d4", eyebrow: "04", title: "Schaal & statistiek", description: "Volumes, kanalen en conversie modelleren.", icon: <Gauge className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "d5", eyebrow: "05", title: "Funnel activatie", description: "Van universe naar engaged opportunities.", icon: <Workflow className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "d6", eyebrow: "06", title: "Engagement modules", description: "De juiste mix per signaal en moment.", icon: <Layers className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "d7", eyebrow: "07", title: "Sales routering", description: "Signalen naar de juiste persoon.", icon: <Route className="h-5 w-5" strokeWidth={1.75} /> },
  { id: "d8", eyebrow: "08", title: "Monitoring & learning", description: "Meten, optimaliseren en herhalen.", icon: <Activity className="h-5 w-5" strokeWidth={1.75} /> },
];

export default function Chapter03TwoWays() {
  const [mode, setMode] = useState<"standaard" | "digital">("digital");
  const items = mode === "digital" ? digitalSteps : standardSteps;

  return (
    <ChapterFrame
      id="chapter-03" number="03"
      eyebrow="Twee manieren"
      title={<>Lineair, of <span className="text-primary">lerend.</span></>}
      intro="De standaard is handmatig. De B2BGroeiMachine is een systeem dat leert."
      closing={<>Eén setup. Eén methode. <span className="text-primary">Oneindig veel groei-bewegingen.</span></>}
      tone="neutral"
    >
      {/* Toggle bovenaan */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-card/95 p-1 shadow-lg">
          {([
            { key: "standaard", label: "Standaard methode" },
            { key: "digital", label: "Digital growth method" },
          ] as const).map((opt) => {
            const active = mode === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setMode(opt.key)}
                className={
                  "px-5 py-2 rounded-full text-sm font-medium transition-colors " +
                  (active
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <ExpandingCards key={mode} items={items} defaultActiveIndex={0} />
    </ChapterFrame>
  );
}