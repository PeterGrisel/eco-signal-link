import ChapterFrame from "../ChapterFrame";
import { Star, TrendingUp, MapPin, Radio, UserCheck } from "lucide-react";

const references = [
  { icon: Star, label: "Beste klanten" },
  { icon: TrendingUp, label: "Hoogmarge-deals" },
  { icon: MapPin, label: "Referentiemarkten" },
  { icon: Radio, label: "Koopsignalen" },
  { icon: UserCheck, label: "Beslissers" },
];

const axes = [
  { k: "Fit", v: "past binnen ICP", score: 64 },
  { k: "Context", v: "markt, branche, fase", score: 82 },
  { k: "Intent", v: "gedrag en signaal", score: 71 },
  { k: "Timing", v: "recency & ritme", score: 86 },
];

const targets = [
  "Nieuwe ICP's",
  "Nieuwe regio's",
  "Nieuwe partners",
  "Nieuwe collega's",
  "Nieuwe proposities",
];

export default function Chapter06Blauwdruk() {
  return (
    <ChapterFrame
      id="chapter-06"
      number="06"
      eyebrow="Stap 03 · Segmenteren & verrijken"
      title={<>Uw beste klanten worden <span className="text-primary">de blauwdruk voor schaal.</span></>}
      intro="Wij vertalen referentieklanten, marktpatronen en koopsignalen naar dynamische ICP's en doelgroepen."
    >
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Referentiemodellen */}
        <div className="rounded-2xl border border-foreground/10 bg-card/85 backdrop-blur-md shadow-lg p-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Referentiemodellen</div>
          <ul className="space-y-2.5">
            {references.map((r) => (
              <li key={r.label} className="flex items-center gap-3 rounded-lg bg-foreground/[0.03] border border-foreground/10 px-3 py-2">
                <r.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span className="text-sm text-foreground/85">{r.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Score op vier assen */}
        <div className="rounded-2xl border border-primary/30 bg-card/85 backdrop-blur-md shadow-xl ring-1 ring-primary/30 p-6 relative">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Score op vier assen</div>
          <div className="space-y-3">
            {axes.map((a) => (
              <div key={a.k}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-display text-foreground">{a.k}</span>
                  <span className="text-xs text-muted-foreground">{a.v}</span>
                </div>
                <div className="h-1 w-full rounded-full bg-foreground/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary/40 to-primary rounded-full" style={{ width: `${a.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamische doelgroepen */}
        <div className="rounded-2xl border border-foreground/10 bg-card/85 backdrop-blur-md shadow-lg p-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Dynamische doelgroepen</div>
          <ul className="space-y-2.5">
            {targets.map((t) => (
              <li key={t} className="rounded-lg bg-foreground/[0.03] border border-foreground/10 px-3 py-2 text-sm text-foreground/85">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ChapterFrame>
  );
}