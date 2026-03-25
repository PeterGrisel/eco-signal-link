import { motion } from "framer-motion";
import { Search, Filter, Mail, Linkedin, Building2, MapPin, Briefcase } from "lucide-react";

const prospects = [
  {
    name: "Alexander Blokland",
    role: "Managing Director",
    company: "Lucom Benelux BV",
    location: "Amsterdam",
    industry: "IT Services",
    signals: ["email", "linkedin"],
    score: "Excellent",
  },
  {
    name: "Edwin Vanlaerhoven",
    role: "CCO · Strategy & Innovation",
    company: "Certhon",
    location: "Rotterdam",
    industry: "Agritech",
    signals: ["email", "linkedin"],
    score: "Excellent",
  },
  {
    name: "Saskia Nijs",
    role: "Co-founder · Boardmember",
    company: "Speakers Academy",
    location: "Utrecht",
    industry: "Professional Services",
    signals: ["email"],
    score: "Excellent",
  },
  {
    name: "Maarten de Kok",
    role: "Manager Business Design",
    company: "WLB Consulting",
    location: "Eindhoven",
    industry: "Management Consulting",
    signals: ["email", "linkedin"],
    score: "Goed",
  },
  {
    name: "Lisa Jansen",
    role: "Head of Growth",
    company: "ScaleUp BV",
    location: "Den Haag",
    industry: "SaaS",
    signals: ["email", "linkedin"],
    score: "Excellent",
  },
  {
    name: "Thomas Bakker",
    role: "Sales Director",
    company: "Nexus Solutions",
    location: "Breda",
    industry: "IT Services",
    signals: ["email"],
    score: "Goed",
  },
  {
    name: "Eva Mulder",
    role: "VP Commercial",
    company: "Bright Digital",
    location: "Amsterdam",
    industry: "Digital Agency",
    signals: ["email", "linkedin"],
    score: "Excellent",
  },
  {
    name: "Joost Hendriks",
    role: "Managing Partner",
    company: "Apex Group",
    location: "Groningen",
    industry: "Consulting",
    signals: ["email"],
    score: "Goed",
  },
];

const filters = [
  { label: "Job Titles", value: "C-Level, Director, VP" },
  { label: "Locatie", value: "Nederland" },
  { label: "Sector", value: "IT, SaaS, Consulting" },
  { label: "Signalen", value: "Actief" },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n[0])
    .join("");

const ProspectingMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="rounded-xl border border-glow overflow-hidden shadow-2xl shadow-primary/5 bg-background"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-border">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm text-foreground">
            Automatische Prospecting
          </span>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            2.847 matches
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {filters.map((f) => (
            <span
              key={f.label}
              className="text-[10px] text-muted-foreground border border-border rounded px-2 py-1 flex items-center gap-1"
            >
              <Filter className="w-2.5 h-2.5" />
              {f.label}: <span className="text-foreground font-medium">{f.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr_0.6fr] px-6 py-2.5 border-b border-border bg-secondary/30 text-[10px] font-display font-semibold text-muted-foreground tracking-[0.1em] uppercase">
        <span>Naam</span>
        <span>Functie</span>
        <span>Bedrijf</span>
        <span>Locatie</span>
        <span>Kanalen</span>
        <span className="text-right">Score</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {prospects.map((p, i) => (
          <div
            key={p.name}
            className={`grid grid-cols-[1fr] md:grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr_0.6fr] px-6 py-3 items-center transition-colors ${
              i === 0 ? "bg-primary/5" : "hover:bg-secondary/30"
            }`}
          >
            {/* Name */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {getInitials(p.name)}
                </span>
              </div>
              <span className="font-display font-semibold text-sm text-foreground truncate">
                {p.name}
              </span>
            </div>

            {/* Role */}
            <span className="hidden md:block text-sm text-muted-foreground truncate">
              {p.role}
            </span>

            {/* Company */}
            <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground truncate">
              <Building2 className="w-3 h-3 text-primary/60 shrink-0" />
              <span className="truncate">{p.company}</span>
            </div>

            {/* Location */}
            <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
              {p.location}
            </div>

            {/* Channels */}
            <div className="hidden md:flex items-center gap-2">
              {p.signals.includes("email") && (
                <span className="w-6 h-6 rounded bg-secondary border border-border flex items-center justify-center">
                  <Mail className="w-3 h-3 text-primary" />
                </span>
              )}
              {p.signals.includes("linkedin") && (
                <span className="w-6 h-6 rounded bg-secondary border border-border flex items-center justify-center">
                  <Linkedin className="w-3 h-3 text-primary" />
                </span>
              )}
            </div>

            {/* Score */}
            <div className="hidden md:flex justify-end">
              <span
                className={`text-[10px] font-display font-bold px-2 py-1 rounded ${
                  p.score === "Excellent"
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {p.score}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border bg-secondary/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Briefcase className="w-3.5 h-3.5 text-primary" />
          <span>
            <span className="text-foreground font-semibold">8 van 2.847</span> prospects weergegeven
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          Signaal-gebaseerde filtering
        </span>
      </div>
    </motion.div>
  );
};

export default ProspectingMockup;
