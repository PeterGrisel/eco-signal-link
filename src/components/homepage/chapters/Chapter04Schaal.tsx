import ChapterFrame from "../ChapterFrame";
import { Building2, Users, Activity, Calendar, TrendingUp } from "lucide-react";

const steps = [
  { icon: Building2, value: "2.000", label: "Bedrijven in de funnel", note: "ICP-fit en verrijkt" },
  { icon: Users, value: "4.000", label: "Beslissers benaderd", note: "Op meerdere kanalen" },
  { icon: Activity, value: "200", label: "Accounts in beweging", note: "Engagement boven drempel" },
  { icon: Calendar, value: "20", label: "Gesprekken per maand", note: "Met sales-bevoegd contact" },
  { icon: TrendingUp, value: "€500k", label: "Pipeline toegevoegd", note: "Op kwartaalbasis" },
];

export default function Chapter04Schaal() {
  return (
    <ChapterFrame
      id="chapter-04" number="04"
      eyebrow="De rekensom"
      title={<>De schaal die <span className="text-primary">een systeem oplevert.</span></>}
      intro="Wat er gebeurt als context, signalen en routering samenwerken. Indicatieve cijfers per kwartaal, gebaseerd op middelgrote B2B-trajecten."
      tone="warm"
    >
      <div className="relative">
        {/* Verbindende lijn */}
        <div className="hidden lg:block absolute top-1/2 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-2 relative">
          {steps.map((s, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background border border-primary/30">
                <s.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <div className="font-display text-4xl md:text-5xl font-light text-foreground tabular-nums mb-1">
                {s.value}
              </div>
              <div className="text-sm text-foreground/80 mb-1">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground italic max-w-2xl mx-auto">
        Geen belofte. Een rekenmodel. Tijdens de nulmeting vullen we het in met uw eigen markt, ICP en uitgangscijfers.
      </p>
    </ChapterFrame>
  );
}