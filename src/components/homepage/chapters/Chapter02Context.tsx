import ChapterFrame from "../ChapterFrame";
import { Brain, Users, Scale, Megaphone, Radio, GitBranch, UserCircle, BarChart3, Star, Bell, Sprout, Headphones } from "lucide-react";

const contextPieces = [
  { icon: Users, label: "ICP & doelgroep" },
  { icon: Scale, label: "Redenen & keuzes" },
  { icon: Megaphone, label: "Kanalen & content" },
  { icon: Radio, label: "Koopsignalen" },
  { icon: GitBranch, label: "Proces & opvolgingslogica" },
  { icon: UserCircle, label: "Beslissers" },
];

const outputs = [
  { icon: Star, label: "Lead scoring" },
  { icon: Bell, label: "Sales alert" },
  { icon: Sprout, label: "Nurture" },
  { icon: Headphones, label: "Opvolging" },
];

export default function Chapter02Context() {
  return (
    <ChapterFrame
      id="chapter-02" number="02"
      eyebrow="Context vastleggen"
      title={<>Van kennis in hoofden naar <span className="text-primary">digitaal meetbare context.</span></>}
      intro="Waarom doen we wat we doen? Hoe starten we sales? Als die context niet wordt vastgelegd, blijven signalen onzichtbaar."
      closing={<>Niet alleen activiteit vastleggen. <span className="text-primary">Eerst context vastleggen.</span></>}
    >
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-0">
        {/* Fase 1: Hoe het nu gaat */}
        <div className="rounded-l-2xl rounded-r-2xl lg:rounded-r-none border border-foreground/10 bg-card/95 shadow-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs tabular-nums text-muted-foreground">01</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Hoe het nu vaak gaat</span>
          </div>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li>Kennis zit in hoofden</li>
            <li>Beslissingen mondeling genomen</li>
            <li>Waarom is niet vastgelegd</li>
            <li>Sales start op gevoel of timing</li>
          </ul>
          <div className="mt-6 pt-5 border-t border-foreground/10 space-y-1.5 text-xs text-muted-foreground">
            <p>× Afhankelijk van mensen</p>
            <p>× Geen gedeeld geheugen</p>
            <p>× Signalen moeilijk meetbaar</p>
          </div>
        </div>

        {/* Fase 2: Wat we vastleggen */}
        <div className="rounded-2xl lg:rounded-none border border-primary/30 bg-card/95 shadow-xl ring-1 ring-primary/30 p-6 lg:-mx-px lg:-my-4 lg:py-10 relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs tabular-nums text-primary">02</span>
            <span className="text-xs uppercase tracking-wider text-primary">Wat we vastleggen</span>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/30 flex flex-col items-center justify-center mb-5">
              <Brain className="h-5 w-5 text-primary mb-0.5" strokeWidth={1.5} />
              <span className="text-[8px] uppercase tracking-wide text-foreground/80 text-center leading-tight px-1">
                Commercieel<br/>brein
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              {contextPieces.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-md bg-card/95 shadow-lg border border-foreground/10 px-2 py-1.5">
                  <p.icon className="h-3 w-3 text-primary shrink-0" strokeWidth={1.5} />
                  <span className="text-[10px] text-foreground/80 truncate">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground italic">
            We leggen context, keuzes en commerciële logica vast in één systeem.
          </p>
        </div>

        {/* Fase 3: Wat dat mogelijk maakt */}
        <div className="rounded-2xl lg:rounded-l-none border border-foreground/10 bg-card/95 shadow-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs tabular-nums text-muted-foreground">03</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Wat dat mogelijk maakt</span>
          </div>

          <div className="rounded-md bg-card/95 shadow-lg border border-foreground/10 px-3 py-2 mb-4 flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
            <span className="text-xs text-foreground/80">Digitale signalen meten</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {outputs.map((o, i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded-md bg-card/95 shadow-lg border border-foreground/10 py-3">
                <o.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span className="text-[10px] text-foreground/80 text-center px-1">{o.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-foreground/10 space-y-1.5 text-xs text-muted-foreground">
            <p className="text-primary">✓ Context wordt meetbaar</p>
            <p className="text-primary">✓ Beslissingen herhaalbaar</p>
            <p className="text-primary">✓ Sales wordt slimmer gestart</p>
          </div>
        </div>
      </div>
    </ChapterFrame>
  );
}