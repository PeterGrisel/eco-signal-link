import ChapterFrame from "../ChapterFrame";
import SpatialProductShowcase, {
  type ProductData,
} from "@/components/ui/spatial-product-showcase";
import {
  ClipboardList,
  PhoneCall,
  Clock,
  UserRound,
  RotateCcw,
  FileSearch,
  Mail,
  Brain,
  Search,
  Radar,
  Target,
  Sparkles,
  TrendingUp,
  Workflow,
  Database,
} from "lucide-react";

const products: [ProductData, ProductData] = [
  {
    id: "vroeger",
    label: "Vroeger",
    eyebrow: "De oude manier",
    title: "Steeds opnieuw beginnen.",
    description:
      "Elke maand een nieuwe lijst, dezelfde outreach en wachten op reactie. Veel handwerk, weinig geheugen en geen voorspelbaarheid.",
    icon: ClipboardList,
    accent: "muted",
    stats: { connectionStatus: "Handmatig", batteryLevel: 32 },
    steps: [
      { icon: FileSearch, label: "Lijst van bedrijven samenstellen" },
      { icon: ClipboardList, label: "Contactgegevens handmatig zoeken" },
      { icon: Mail, label: "Cold outreach versturen" },
      { icon: PhoneCall, label: "Mensen nabellen" },
      { icon: Clock, label: "Wachten op een reactie" },
      { icon: UserRound, label: "Sales volgt losse leads op" },
      { icon: RotateCcw, label: "Volgende maand opnieuw beginnen" },
    ],
  },
  {
    id: "nu",
    label: "Nu",
    eyebrow: "De slimme manier",
    title: "Eén systeem dat blijft leren.",
    description:
      "Het brein onthoudt wie uw beste klant is, herkent koopsignalen en activeert op het juiste moment. Elke cyclus wordt het systeem scherper.",
    icon: Brain,
    accent: "primary",
    stats: { connectionStatus: "Lerend", batteryLevel: 92 },
    steps: [
      { icon: Brain, label: "Leren wie uw beste klant is" },
      { icon: Database, label: "Profiel verrijken met data" },
      { icon: Search, label: "Meer van zulke bedrijven vinden" },
      { icon: Radar, label: "Koopsignalen herkennen" },
      { icon: Target, label: "De juiste actie automatisch starten" },
      { icon: Workflow, label: "Sales pakt warme leads op" },
      { icon: Sparkles, label: "Leren van wat werkt" },
      { icon: TrendingUp, label: "Slim uitbreiden naar nieuwe segmenten" },
    ],
  },
];

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
      <SpatialProductShowcase products={products} defaultActiveId="nu" />
    </ChapterFrame>
  );
}