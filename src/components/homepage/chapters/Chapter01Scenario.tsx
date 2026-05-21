import ChapterFrame from "../ChapterFrame";
import { Rocket, MailOpen, MousePointerClick, PhoneCall, Globe, Linkedin, Eye, FileText, Briefcase, Activity, Brain, Bell, Sprout, Handshake } from "lucide-react";

const oldFlow = [
  { icon: Rocket, label: "Lancering of campagne" },
  { icon: MailOpen, label: "Wachten op reactie" },
  { icon: MousePointerClick, label: "Een paar aanvragen" },
  { icon: PhoneCall, label: "Sales volgt op" },
];

const signals = [
  { icon: Globe, label: "Website bezoek" },
  { icon: Linkedin, label: "Profiel bezoek" },
  { icon: FileText, label: "Content view" },
  { icon: MailOpen, label: "E-mail open" },
  { icon: Eye, label: "Page revisit" },
  { icon: Briefcase, label: "Job post" },
  { icon: Activity, label: "CRM activiteit" },
  { icon: MousePointerClick, label: "Ad interactie" },
];

const outputs = [
  { icon: Sprout, label: "Nurture" },
  { icon: Bell, label: "Sales alert" },
  { icon: PhoneCall, label: "SDR opvolging" },
  { icon: Handshake, label: "Meeting" },
];

export default function Chapter01Scenario() {
  return (
    <ChapterFrame
      id="chapter-01" number="01"
      eyebrow="Het herkenbare scenario"
      title={<>U wacht op een lancering. <span className="text-primary">De markt geeft al signalen af.</span></>}
      intro="Veel prospects zoeken niet actief. Ze laten verspreid, indirect en vaak kleine signalen zien over tientallen kanalen. De kracht zit in het herkennen, combineren en wegen van die signalen."
      closing={<>Engagement is geen losse actie. <span className="text-primary">Het is een patroon van gedrag.</span></>}
      tone="cool"
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Hoe het vaak voelt */}
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Hoe het vaak voelt
          </div>
          <ol className="space-y-5">
            {oldFlow.map((step, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-xs text-muted-foreground tabular-nums">
                  {i + 1}
                </span>
                <step.icon className="h-5 w-5 text-muted-foreground/70" strokeWidth={1.5} />
                <span className="text-base text-foreground/80">{step.label}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 space-y-2 text-sm text-muted-foreground">
            <p>× Afhankelijk van timing</p>
            <p>× Alleen zichtbaar gedrag telt mee</p>
            <p>× Veel potentie blijft onzichtbaar</p>
          </div>
        </div>

        {/* Wat er echt gebeurt */}
        <div className="relative rounded-2xl border border-primary/20 bg-primary/[0.10] p-8">
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-8">
            Wat er echt gebeurt in de markt
          </div>

          <div className="grid grid-cols-2 gap-2 mb-8">
            {signals.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-foreground/10 bg-background/45 backdrop-blur-md px-3 py-2"
              >
                <s.icon className="h-3.5 w-3.5 text-primary/80" strokeWidth={1.5} />
                <span className="text-xs text-foreground/80 truncate">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/30">
              <Brain className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-wide text-foreground">Commercieel brein</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {outputs.map((o, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <o.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span className="text-[10px] text-foreground/70 leading-tight">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChapterFrame>
  );
}