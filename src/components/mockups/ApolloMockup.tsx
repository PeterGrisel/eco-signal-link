import { motion } from "framer-motion";
import { Search, Filter, Building2, MapPin, Users, ChevronDown } from "lucide-react";

const prospects = [
  { name: "Sarah van den Berg", title: "VP Sales", company: "TechNova Group", location: "Amsterdam", employees: "201-500", industry: "SaaS", match: 96 },
  { name: "Mark de Vries", title: "Head of Growth", company: "ScaleUp BV", location: "Rotterdam", employees: "51-200", industry: "IT Services", match: 93 },
  { name: "Lisa Jansen", title: "Commercial Director", company: "Fortex Industries", location: "Utrecht", employees: "501-1000", industry: "Manufacturing", match: 91 },
  { name: "Thomas Bakker", title: "Managing Partner", company: "Apex Consulting", location: "Den Haag", employees: "11-50", industry: "Consulting", match: 88 },
  { name: "Eva Mulder", title: "CEO", company: "Bright Digital", location: "Eindhoven", employees: "51-200", industry: "Digital Agency", match: 85 },
];

const filters = [
  { label: "Job Title", values: ["VP", "Director", "Head of", "C-Level"] },
  { label: "Location", values: ["Nederland"] },
  { label: "Industry", values: ["SaaS", "IT Services", "Consulting"] },
  { label: "Employees", values: ["11-1000"] },
];

const getInitials = (name: string) =>
  name.split(" ").filter((_, i, arr) => i === 0 || i === arr.length - 1).map((n) => n[0]).join("");

const ApolloMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="rounded-xl border border-glow overflow-hidden shadow-2xl shadow-primary/5 bg-background"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm text-foreground">Lead Database</span>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">14.382 contacts</span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {filters.map((f) => (
            <span key={f.label} className="text-[10px] text-muted-foreground border border-border rounded px-2 py-1 flex items-center gap-1">
              <Filter className="w-2.5 h-2.5" />
              {f.label}
              <ChevronDown className="w-2.5 h-2.5" />
            </span>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr_0.6fr] px-5 py-2 border-b border-border bg-secondary/30 text-[10px] font-display font-semibold text-muted-foreground tracking-[0.1em] uppercase">
        <span>Contact</span>
        <span>Functie</span>
        <span>Bedrijf</span>
        <span>Locatie</span>
        <span>Grootte</span>
        <span className="text-right">Match</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {prospects.map((p, i) => (
          <div
            key={p.name}
            className={`grid grid-cols-[1fr] md:grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr_0.6fr] px-5 py-2.5 items-center transition-colors ${
              i === 0 ? "bg-primary/5" : "hover:bg-secondary/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-muted-foreground">{getInitials(p.name)}</span>
              </div>
              <span className="font-display font-semibold text-sm text-foreground truncate">{p.name}</span>
            </div>
            <span className="hidden md:block text-sm text-muted-foreground truncate">{p.title}</span>
            <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground truncate">
              <Building2 className="w-3 h-3 text-primary/60 shrink-0" />
              <span className="truncate">{p.company}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
              {p.location}
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-3 h-3 text-primary/60 shrink-0" />
              {p.employees}
            </div>
            <div className="hidden md:flex justify-end">
              <span className={`text-[10px] font-display font-bold px-2 py-1 rounded ${
                p.match >= 90 ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {p.match}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-border bg-secondary/20 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">5 van 14.382</span> ICP-matches
        </span>
        <span className="text-[10px] text-muted-foreground">ICP-Based Search</span>
      </div>
    </motion.div>
  );
};

export default ApolloMockup;
