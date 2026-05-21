import ChapterFrame from "../ChapterFrame";
import { CheckSquare, MessageSquare, Mail, LayoutDashboard, CalendarCheck, FileBarChart } from "lucide-react";

const deliveries = [
  { icon: CheckSquare, name: "CRM-taak", title: "Actiegerichte opvolging", desc: "Volgende beste actie, met context, direct in HubSpot of Salesforce." },
  { icon: MessageSquare, name: "Teams · Slack", title: "High-intent signaal", desc: "Realtime ping wanneer een doelaccount commerciële intent toont." },
  { icon: Mail, name: "E-mail briefing", title: "Dagelijkse briefing", desc: "Eén commerciële briefing per ochtend, per rol gefocust." },
  { icon: LayoutDashboard, name: "Salesdashboard", title: "Funnel- en signaalzicht", desc: "Eén beeld van pipeline, signalen en de status per beweging." },
  { icon: CalendarCheck, name: "Agenda", title: "Ingeplande meeting", desc: "Gekwalificeerde routes leiden naar een bevestigde afspraak." },
  { icon: FileBarChart, name: "Directie-rapport", title: "Pipeline & omzetzicht", desc: "Wekelijkse rapportage, attributie en leerloops voor de directie." },
];

export default function Chapter10Levering() {
  return (
    <ChapterFrame
      id="chapter-10"
      number="10"
      eyebrow="Stap 08 · Levering"
      title={<>Geleverd waar uw teams <span className="text-primary">al werken.</span></>}
      intro="Het systeem routeert context en volgende acties direct in bestaande workflows."
      closing={<>Geen rapport. <span className="text-primary">Een volgende beste actie.</span></>}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveries.map((d) => (
          <div key={d.name} className="rounded-2xl border border-foreground/10 bg-background/40 p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <d.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-primary">{d.name}</span>
            </div>
            <h3 className="font-display text-lg text-foreground mb-1.5">{d.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
          </div>
        ))}
      </div>
    </ChapterFrame>
  );
}