import { motion } from "framer-motion";
import { Linkedin, UserPlus, MessageCircle, Eye, TrendingUp, Bell } from "lucide-react";

const activities = [
  { name: "Sarah van den Berg", action: "Connectie geaccepteerd", time: "2 min geleden", type: "accepted", company: "TechNova Group" },
  { name: "Mark de Vries", action: "Profiel bekeken", time: "15 min geleden", type: "viewed", company: "ScaleUp BV" },
  { name: "Lisa Jansen", action: "Bericht beantwoord", time: "1 uur geleden", type: "replied", company: "Fortex Industries" },
  { name: "Thomas Bakker", action: "Connectieverzoek verstuurd", time: "2 uur geleden", type: "pending", company: "Apex Consulting" },
  { name: "Eva Mulder", action: "Post geliked", time: "3 uur geleden", type: "engaged", company: "Bright Digital" },
];

const stats = [
  { label: "Connecties verstuurd", value: "342", icon: UserPlus, change: "+28 deze week" },
  { label: "Berichten verstuurd", value: "156", icon: MessageCircle, change: "+18 deze week" },
  { label: "Profiel views", value: "1.247", icon: Eye, change: "+340 deze week" },
  { label: "Acceptatieratio", value: "38%", icon: TrendingUp, change: "+4% vs vorige maand" },
];

const getInitials = (name: string) =>
  name.split(" ").filter((_, i, arr) => i === 0 || i === arr.length - 1).map((n) => n[0]).join("");

const getTypeIcon = (type: string) => {
  switch (type) {
    case "accepted": return <UserPlus className="w-3 h-3 text-primary" />;
    case "viewed": return <Eye className="w-3 h-3 text-primary/70" />;
    case "replied": return <MessageCircle className="w-3 h-3 text-primary" />;
    case "pending": return <UserPlus className="w-3 h-3 text-muted-foreground" />;
    case "engaged": return <TrendingUp className="w-3 h-3 text-primary/70" />;
    default: return null;
  }
};

const LinkedInMockup = () => {
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
          <Linkedin className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm text-foreground">LinkedIn Automation</span>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">3 profielen actief</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
          <Bell className="w-3 h-3 text-primary" />
          <span><span className="text-foreground font-semibold">5</span> nieuwe notificaties</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        {stats.map((s) => (
          <div key={s.label} className="bg-background px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="font-display font-bold text-xl text-foreground">{s.value}</p>
            <p className="text-[10px] text-primary">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="border-t border-border">
        <div className="px-5 py-2 bg-secondary/30">
          <span className="text-[10px] font-display font-semibold text-muted-foreground tracking-[0.1em] uppercase">Recente activiteit</span>
        </div>
        <div className="divide-y divide-border">
          {activities.map((a) => (
            <div key={a.name + a.action} className="flex items-center gap-3 px-5 py-2.5 hover:bg-secondary/30 transition-colors">
              <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-muted-foreground">{getInitials(a.name)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  <span className="font-semibold">{a.name}</span>
                  <span className="text-muted-foreground"> · {a.company}</span>
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {getTypeIcon(a.type)}
                  <span>{a.action}</span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-border bg-secondary/20 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">Veilige limieten</span> — max 25 connecties/dag
        </span>
        <span className="text-[10px] text-muted-foreground">Social Selling Automation</span>
      </div>
    </motion.div>
  );
};

export default LinkedInMockup;
