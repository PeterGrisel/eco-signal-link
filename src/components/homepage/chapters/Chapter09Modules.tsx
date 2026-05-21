import ChapterFrame from "../ChapterFrame";
import { Linkedin, Mail, Phone, Video, Calendar, Sparkles, RefreshCw, Users, Briefcase, Building2, Crown, GitBranch, LayoutDashboard, CalendarCheck } from "lucide-react";

const engagement = [
  { icon: Linkedin, name: "LinkedIn", note: "Profiel · DM · content" },
  { icon: Mail, name: "E-mail", note: "Multichannel sequences" },
  { icon: Phone, name: "Telefoon", note: "Warme opvolging" },
  { icon: Video, name: "Video", note: "1-op-1 en bulk" },
  { icon: Calendar, name: "Afspraken", note: "Inbound book-direct" },
  { icon: Sparkles, name: "Content-nurture", note: "Persoonlijke flows" },
  { icon: RefreshCw, name: "CRM-reactivatie", note: "Stille relaties wakker" },
];

const routing = [
  { icon: Users, name: "SDR", note: "Outbound cadence" },
  { icon: Briefcase, name: "Account Manager", note: "Bestaande relaties" },
  { icon: Building2, name: "Inside Sales", note: "Volumeopvolging" },
  { icon: Crown, name: "Founder-led", note: "Top 1% accounts" },
  { icon: GitBranch, name: "CRM-workflow", note: "Volgende beste actie" },
  { icon: LayoutDashboard, name: "Dashboard", note: "Pijplijnzicht live" },
  { icon: CalendarCheck, name: "Meeting Scheduler", note: "Direct in agenda" },
];

function Grid({ items, accent }: { items: typeof engagement; accent: boolean }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2.5">
      {items.map((m) => (
        <div
          key={m.name}
          className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
            accent ? "border-primary/25 bg-primary/[0.05]" : "border-foreground/10 bg-background/40"
          }`}
        >
          <m.icon className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
          <div className="min-w-0">
            <div className="text-sm text-foreground/90 truncate">{m.name}</div>
            <div className="text-[11px] text-muted-foreground truncate">{m.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Chapter09Modules() {
  return (
    <ChapterFrame
      id="chapter-09"
      number="09"
      eyebrow="Stap 06 — 07 · Engagement & routing"
      title={<>Modules creëren engagement. <span className="text-primary">Routing maakt er actie van.</span></>}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-foreground/10 bg-background/30 p-6">
          <div className="flex items-baseline justify-between mb-5">
            <span className="text-xs uppercase tracking-[0.25em] text-primary/80">Engagement-modules</span>
            <span className="text-[10px] text-muted-foreground">Outbound · Inbound</span>
          </div>
          <Grid items={engagement} accent={false} />
        </div>
        <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6">
          <div className="flex items-baseline justify-between mb-5">
            <span className="text-xs uppercase tracking-[0.25em] text-primary">Routing & sales</span>
            <span className="text-[10px] text-muted-foreground">Mission control</span>
          </div>
          <Grid items={routing} accent />
        </div>
      </div>
    </ChapterFrame>
  );
}