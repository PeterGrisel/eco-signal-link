import ChapterFrame from "../ChapterFrame";
import { Brain, Database, Target, Radio, GitBranch, Layers, Workflow } from "lucide-react";

const layers = [
  { icon: Database, label: "Data" },
  { icon: Target, label: "ICP" },
  { icon: Radio, label: "Signalen" },
  { icon: GitBranch, label: "Regels" },
  { icon: Layers, label: "Context" },
  { icon: Workflow, label: "Proces" },
];

const benefits = [
  "Dynamische ICP per beweging",
  "Signaal-scoring per kanaal",
  "Routingregels per team",
  "Hergebruik over markten heen",
];

export default function Chapter05Brein() {
  return (
    <ChapterFrame
      id="chapter-05"
      number="05"
      eyebrow="Stap 01 — 02 · Het fundament"
      title={<>Het <span className="text-primary">Commerciële Brein</span>: context wordt herbruikbare intelligentie.</>}
      intro="Wij beginnen niet bij campagnes. Wij beginnen bij het commerciële DNA van uw bedrijf — één herbruikbare laag voor ICP, signalen, regels en routing."
    >
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Visual: orbital brein */}
        <div className="relative aspect-square max-w-md mx-auto w-full">
          <div className="absolute inset-0 rounded-full border border-primary/20" />
          <div className="absolute inset-8 rounded-full border border-primary/15" />
          <div className="absolute inset-16 rounded-full border border-primary/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center h-28 w-28 rounded-full bg-primary/10 border border-primary/40">
              <Brain className="h-7 w-7 text-primary mb-1" strokeWidth={1.5} />
              <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/90 text-center leading-tight">
                Commercieel<br />Brein
              </span>
            </div>
          </div>
          {layers.map((l, i) => {
            const angle = (i / layers.length) * 2 * Math.PI - Math.PI / 2;
            const r = 42; // %
            const x = 50 + r * Math.cos(angle);
            const y = 50 + r * Math.sin(angle);
            return (
              <div
                key={l.label}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-md bg-background/80 border border-foreground/15 px-2.5 py-1.5 shadow-sm"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <l.icon className="h-3 w-3 text-primary" strokeWidth={1.6} />
                <span className="text-[10px] uppercase tracking-wider text-foreground/85">{l.label}</span>
              </div>
            );
          })}
        </div>

        {/* Right column: benefits */}
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-primary/80 mb-4">Geen campagne. Een fundament.</p>
          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-background/75 px-4 py-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-foreground/85">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ChapterFrame>
  );
}