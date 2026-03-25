import { motion } from "framer-motion";
import { LayoutDashboard, CalendarCheck, TrendingUp, Users, ArrowRight } from "lucide-react";

const pipelineStages = [
  { name: "Nieuw", count: 12, value: "€48.000", color: "bg-muted-foreground/30" },
  { name: "Gecontacteerd", count: 28, value: "€112.000", color: "bg-primary/30" },
  { name: "Gesprek gepland", count: 8, value: "€64.000", color: "bg-primary/50" },
  { name: "Voorstel verstuurd", count: 5, value: "€85.000", color: "bg-primary/70" },
  { name: "Onderhandeling", count: 3, value: "€54.000", color: "bg-primary" },
];

const recentDeals = [
  { name: "TechNova Group", contact: "Sarah van den Berg", stage: "Gesprek gepland", value: "€12.000", daysInStage: 2 },
  { name: "ScaleUp BV", contact: "Mark de Vries", stage: "Voorstel verstuurd", value: "€18.500", daysInStage: 1 },
  { name: "Fortex Industries", contact: "Lisa Jansen", stage: "Onderhandeling", value: "€24.000", daysInStage: 3 },
  { name: "Apex Consulting", contact: "Thomas Bakker", stage: "Gecontacteerd", value: "€8.000", daysInStage: 5 },
];

const getStageColor = (stage: string) => {
  switch (stage) {
    case "Gesprek gepland": return "bg-primary/50 text-primary";
    case "Voorstel verstuurd": return "bg-primary/70 text-primary-foreground";
    case "Onderhandeling": return "bg-primary text-primary-foreground";
    default: return "bg-secondary text-muted-foreground";
  }
};

const HubSpotMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="rounded-xl border border-glow overflow-hidden shadow-2xl shadow-primary/5 bg-background"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm text-foreground">Pipeline Overview</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3 text-primary" /> <span className="text-foreground font-semibold">8 meetings</span> deze week</span>
          <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-primary" /> Pipeline: <span className="text-foreground font-semibold">€363.000</span></span>
        </div>
      </div>

      {/* Pipeline visual */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
          {pipelineStages.map((s) => (
            <div
              key={s.name}
              className={`${s.color} flex-1 flex items-center justify-center relative group cursor-default`}
              title={`${s.name}: ${s.count} deals — ${s.value}`}
            >
              <span className="text-[9px] font-bold text-foreground/80 hidden md:block">{s.count}</span>
            </div>
          ))}
        </div>
        <div className="hidden md:flex justify-between mt-2">
          {pipelineStages.map((s) => (
            <div key={s.name} className="text-center flex-1">
              <p className="text-[9px] text-muted-foreground">{s.name}</p>
              <p className="text-[10px] font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent deals */}
      <div className="hidden md:grid grid-cols-[1.5fr_1.2fr_1fr_0.8fr_0.6fr] px-5 py-2 border-b border-border bg-secondary/30 text-[10px] font-display font-semibold text-muted-foreground tracking-[0.1em] uppercase">
        <span>Bedrijf</span>
        <span>Contact</span>
        <span>Fase</span>
        <span>Waarde</span>
        <span className="text-right">Dagen</span>
      </div>

      <div className="divide-y divide-border">
        {recentDeals.map((d, i) => (
          <div key={d.name} className={`grid grid-cols-[1fr] md:grid-cols-[1.5fr_1.2fr_1fr_0.8fr_0.6fr] px-5 py-2.5 items-center transition-colors ${i === 0 ? "bg-primary/5" : "hover:bg-secondary/30"}`}>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-primary/60 shrink-0" />
              <span className="font-display font-semibold text-sm text-foreground truncate">{d.name}</span>
            </div>
            <span className="hidden md:block text-sm text-muted-foreground truncate">{d.contact}</span>
            <div className="hidden md:flex">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStageColor(d.stage)}`}>{d.stage}</span>
            </div>
            <span className="hidden md:block text-sm font-semibold text-foreground">{d.value}</span>
            <span className="hidden md:block text-sm text-right text-muted-foreground">{d.daysInStage}d</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-border bg-secondary/20 flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <ArrowRight className="w-3 h-3 text-primary" />
          <span className="text-foreground font-semibold">Alles synct</span> automatisch met uw CRM
        </span>
        <span className="text-[10px] text-muted-foreground">Pipeline Management</span>
      </div>
    </motion.div>
  );
};

export default HubSpotMockup;
