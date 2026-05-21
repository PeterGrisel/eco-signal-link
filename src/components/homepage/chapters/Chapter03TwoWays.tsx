import ChapterFrame from "../ChapterFrame";
import SpatialProductShowcase, {
  type ProductData,
} from "@/components/ui/spatial-product-showcase";
import { ClipboardList, Brain, Repeat, Sparkles, Gauge, Workflow } from "lucide-react";

const products: [ProductData, ProductData] = [
  {
    id: "standaard",
    label: "Standaard",
    eyebrow: "Standaard methode",
    title: "Campagne-gebaseerd. Handmatig. Lineair.",
    description:
      "Een lijst, wat outreach en wachten op reactie. Het werkt soms, maar de pijplijn is moeilijk voorspelbaar en elke cyclus begint opnieuw.",
    icon: ClipboardList,
    accent: "muted",
    stats: { connectionStatus: "Statisch", batteryLevel: 32 },
    features: [
      { label: "Voorspelbaarheid", value: 28, icon: Gauge },
      { label: "Schaalbaarheid", value: 24, icon: Repeat },
    ],
  },
  {
    id: "digital",
    label: "Digital growth",
    eyebrow: "Digital growth method",
    title: "Systeem-gebaseerd. Signaal-gedreven. Schaalbaar.",
    description:
      "Eén commercieel brein verbindt data, signalen en opvolging. Het systeem leert per cyclus en richt de juiste actie op het juiste moment.",
    icon: Brain,
    accent: "primary",
    stats: { connectionStatus: "Lerend", batteryLevel: 92 },
    features: [
      { label: "Voorspelbaarheid", value: 88, icon: Gauge },
      { label: "Automatisering", value: 84, icon: Workflow },
    ],
  },
];

export default function Chapter03TwoWays() {
  return (
    <ChapterFrame
      id="chapter-03" number="03"
      eyebrow="Twee manieren"
      title={<>Lineair, of <span className="text-primary">lerend.</span></>}
      intro="De standaard is handmatig. De B2BGroeiMachine is een systeem dat leert."
      closing={<>Eén setup. Eén methode. <span className="text-primary">Oneindig veel groei-bewegingen.</span></>}
      tone="neutral"
    >
      <SpatialProductShowcase products={products} defaultActiveId="digital" />
    </ChapterFrame>
  );
}