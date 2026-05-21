import ChapterFrame from "../ChapterFrame";
import { X, Check } from "lucide-react";

const standardSteps = [
  { title: "Lijst bouwen", desc: "Export uit database of lijst kopen." },
  { title: "Handmatig onderzoek", desc: "Contacten zoeken, verrijken met de hand." },
  { title: "Outreach versturen", desc: "Mails, LinkedIn of bellen." },
  { title: "Sales opvolgt", desc: "Wat binnenkomt wordt opgepakt." },
  { title: "Meetings krijgen", desc: "Enkele reacties worden gesprekken." },
  { title: "Deals sluiten", desc: "Een paar deals komen rond." },
  { title: "Opnieuw beginnen", desc: "Nieuwe campagne, nieuwe lijst." },
];

const digitalSteps = [
  { title: "Context & ICP", desc: "We leggen markt, data en proces vast." },
  { title: "Commercieel brein", desc: "Logica, segmenten, signalen en scoring." },
  { title: "Targeting engine", desc: "Dynamisch segmenteren en verrijken." },
  { title: "Schaal & statistiek", desc: "Volumes, kanalen en conversie modelleren." },
  { title: "Funnel activatie", desc: "Van universe naar engaged opportunities." },
  { title: "Engagement modules", desc: "Juiste mix per signaal en moment." },
  { title: "Sales routering", desc: "Signalen naar de juiste persoon." },
  { title: "Monitoring & learning", desc: "Meten, optimaliseren, herhalen." },
];

const differences = [
  ["Statische lijsten", "Dynamische doelgroepen"],
  ["Handmatig werk", "Geautomatiseerde verrijking"],
  ["One-size-fits-all", "Context-gedreven"],
  ["Activiteit-gestuurd", "Signaal & intent"],
  ["Losse tools", "Verbonden ecosysteem"],
  ["Achteraf rapporteren", "Realtime intelligence"],
  ["Campagnes", "Schaalbare infrastructuur"],
  ["Begint opnieuw", "Wordt elke cyclus slimmer"],
];

export default function Chapter03TwoWays() {
  return (
    <ChapterFrame
      id="chapter-03" number="03"
      eyebrow="Twee manieren"
      title={<>Twee manieren om B2B groei te sturen. <span className="text-primary">Eén is lineair. Eén schaalt.</span></>}
      intro="De standaardmethode is campagne-gebaseerd, handmatig en lineair. De B2BGroeiMachine-methode is systeem-gebaseerd, signaal-gedreven en schaalbaar."
      closing={<>One setup. One method. <span className="text-primary">Infinite growth motions.</span></>}
      tone="neutral"
    >
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Standaard */}
        <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8">
          <div className="mb-6 pb-5 border-b border-foreground/10">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Standaard methode</div>
            <div className="text-sm text-muted-foreground">Campagne-gebaseerd. Handmatig. Lineair.</div>
          </div>
          <ol className="space-y-4">
            {standardSteps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground/90">{s.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 pt-5 border-t border-foreground/10 flex items-start gap-2">
            <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">Onvoorspelbare pipeline, hoge inspanning, beperkt schaalbaar.</p>
          </div>
        </div>

        {/* Digital */}
        <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="mb-6 pb-5 border-b border-primary/20">
              <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Digital growth method</div>
              <div className="text-sm text-foreground/80">Systeem-gebaseerd. Signaal-gedreven. Schaalbaar.</div>
            </div>
            <ol className="space-y-4">
              {digitalSteps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs tabular-nums text-primary border border-primary/30">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-foreground">{s.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 pt-5 border-t border-primary/20 flex items-start gap-2">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/80">Hogere pipeline-kwaliteit, lagere kosten per opportunity, meetbaar effect.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key differences als doorlopende rij */}
      <div className="mt-12 rounded-2xl border border-foreground/10 bg-background/40 p-8">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6 text-center">
          Het verschil
        </div>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
          {differences.map(([a, b], i) => (
            <div key={i} className="flex items-center gap-3 text-sm py-2 border-b border-foreground/5 last:border-0">
              <span className="flex-1 text-muted-foreground line-through decoration-foreground/20">{a}</span>
              <span className="text-primary/40 text-xs">→</span>
              <span className="flex-1 text-foreground/90 text-right">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </ChapterFrame>
  );
}