import { motion } from "framer-motion";
import { Flame, TrendingUp, Filter, Calendar, ArrowUpRight } from "lucide-react";

const leads = [
  {
    rank: 1,
    name: "Sarah van den Berg",
    role: "VP Sales",
    company: "TechNova Group",
    signal: "Functiewissel",
    score: 93,
    highlight: true,
  },
  {
    rank: 2,
    name: "Mark de Vries",
    role: "Head of Growth",
    company: "ScaleUp BV",
    signal: "Website bezoek",
    score: 88,
  },
  {
    rank: 3,
    name: "Lisa Jansen",
    role: "Commercial Director",
    company: "Fortex Industries",
    signal: "Hiring signaal",
    score: 84,
  },
  {
    rank: 4,
    name: "Thomas Bakker",
    role: "Managing Partner",
    company: "Apex Consulting",
    signal: "Funding round",
    score: 79,
  },
  {
    rank: 5,
    name: "Eva Mulder",
    role: "CEO",
    company: "Bright Digital",
    signal: "Expansie signaal",
    score: 74,
  },
  {
    rank: 6,
    name: "Joost Hendriks",
    role: "Sales Director",
    company: "Nexus Solutions",
    signal: "Content engagement",
    score: 68,
  },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-primary text-primary-foreground";
  if (score >= 80) return "bg-primary/80 text-primary-foreground";
  if (score >= 70) return "bg-primary/60 text-primary-foreground";
  return "bg-primary/40 text-primary-foreground";
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n[0])
    .join("");

const SignalDashboardMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="rounded-xl border border-glow overflow-hidden shadow-2xl shadow-primary/5 bg-background"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 text-primary" />
          <div>
            <p className="font-display font-bold text-sm text-foreground">
              Top Signaal-Opportunities
            </p>
            <p className="text-xs text-muted-foreground">
              Gerangschikt op intent-score, klaar voor contact
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-md px-2.5 py-1.5">
            <Filter className="w-3 h-3" />
            Alle ICP's
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-md px-2.5 py-1.5">
            <Calendar className="w-3 h-3" />
            Laatste 30 dagen
          </div>
        </div>
      </div>

      {/* Lead rows */}
      <div className="divide-y divide-border">
        {leads.map((lead) => (
          <div
            key={lead.rank}
            className={`flex items-center gap-4 px-6 py-3.5 transition-colors ${
              lead.highlight
                ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
                : "hover:bg-secondary/30"
            }`}
          >
            {/* Rank */}
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                lead.highlight
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {lead.rank}
            </span>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-muted-foreground">
                {getInitials(lead.name)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-semibold text-sm text-foreground truncate">
                  {lead.name}
                </p>
                {lead.highlight && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-primary shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {lead.role} · {lead.company}
              </p>
            </div>

            {/* Signal tag */}
            <span className="hidden sm:inline-block text-[10px] font-display font-semibold tracking-wide uppercase px-2 py-1 rounded bg-secondary text-primary border border-primary/20">
              {lead.signal}
            </span>

            {/* Score */}
            <div
              className={`w-14 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${getScoreColor(
                lead.score
              )}`}
            >
              {lead.score}
              <span className="text-[9px] ml-0.5 opacity-70">IWS</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border bg-secondary/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span>
            <span className="text-foreground font-semibold">12 nieuwe signalen</span> deze week
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          Signal-Based Prospecting
        </span>
      </div>
    </motion.div>
  );
};

export default SignalDashboardMockup;
