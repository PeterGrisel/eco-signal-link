import ChapterFrame from "../ChapterFrame";
import { ExpandingCards, type CardItem } from "@/components/ui/expanding-cards";
import {
  Compass,
  Brain,
  Filter,
  Gauge,
  Workflow,
  Layers,
  Route,
  Activity,
} from "lucide-react";

const steps: CardItem[] = [
  { id: 1, eyebrow: "01", title: "Context & ICP vastleggen", description: "Data, processen, markt- en klantkennis bij elkaar brengen.", icon: <Compass className="h-5 w-5" strokeWidth={1.75} /> },
  { id: 2, eyebrow: "02", title: "Commercieel Brein bouwen", description: "ICP-logica, signalen, segmenten en opvolgingsregels in één laag.", icon: <Brain className="h-5 w-5" strokeWidth={1.75} /> },
  { id: 3, eyebrow: "03", title: "Segmenteren & verrijken", description: "Doelgroepen dynamisch vinden, filteren en prioriteren.", icon: <Filter className="h-5 w-5" strokeWidth={1.75} /> },
  { id: 4, eyebrow: "04", title: "Schaal & volume definiëren", description: "Accounts, contacten, touchpoints, ratio's en capaciteit.", icon: <Gauge className="h-5 w-5" strokeWidth={1.75} /> },
  { id: 5, eyebrow: "05", title: "Funnel activeren", description: "Van markt naar targets, engagement en opportunities.", icon: <Workflow className="h-5 w-5" strokeWidth={1.75} /> },
  { id: 6, eyebrow: "06", title: "Modules inzetten", description: "LinkedIn, e-mail, telefoon, video, nurture en afspraken.", icon: <Layers className="h-5 w-5" strokeWidth={1.75} /> },
  { id: 7, eyebrow: "07", title: "Routeren naar sales", description: "SDR, AM, inside sales, founder-led, CRM en dashboard.", icon: <Route className="h-5 w-5" strokeWidth={1.75} /> },
  { id: 8, eyebrow: "08", title: "Monitoren & automatiseren", description: "Pipeline, rapportage, attributie en lerende loops.", icon: <Activity className="h-5 w-5" strokeWidth={1.75} /> },
];

export default function Chapter04Methode() {
  return (
    <ChapterFrame
      id="chapter-04"
      number="04"
      eyebrow="De methode · acht stappen"
      title={<>Van commerciële context <span className="text-primary">naar schaalbare actie.</span></>}
      intro="Eén setup vormt de basis. Elke volgende module bouwt erop voort."
    >
      <ExpandingCards items={steps} defaultActiveIndex={0} />
    </ChapterFrame>
  );
}