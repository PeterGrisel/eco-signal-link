import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GraduationCap, ArrowRight, Signal, Users, BarChart3, Zap } from "lucide-react";

type Level = "Starter" | "Gevorderd" | "Expert";
type PriceRange = "Gratis" | "< €100" | "€100+";

const levels: Level[] = ["Starter", "Gevorderd", "Expert"];
const priceRanges: PriceRange[] = ["Gratis", "< €100", "€100+"];

const levelColors: Record<Level, string> = {
  Starter: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Gevorderd: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Expert: "bg-red-500/15 text-red-400 border-red-500/30",
};

const levelColorsActive: Record<Level, string> = {
  Starter: "bg-emerald-500/25 text-emerald-300 border-emerald-400 ring-1 ring-emerald-500/30",
  Gevorderd: "bg-amber-500/25 text-amber-300 border-amber-400 ring-1 ring-amber-500/30",
  Expert: "bg-red-500/25 text-red-300 border-red-400 ring-1 ring-red-500/30",
};

const trainingen = [
  {
    title: "Signaal Detectiesysteem",
    description: "Bouw uw eigen geautomatiseerde prospecting-machine. 7 lagen, AI-agent, blueprint en installatie-checklists.",
    href: "/signaal",
    tag: "Prospecting",
    level: "Starter" as Level,
    price: 97,
    priceLabel: "€97 eenmalig",
    duration: "90 min",
    icon: Signal,
    featured: true,
  },
  {
    title: "Pipeline Equation™ Masterclass",
    description: "Leer het X1–X10 framework om uw volledige sales-pipeline te analyseren, optimaliseren en voorspelbaar te maken.",
    href: "/pipeline-equation",
    tag: "Strategie",
    level: "Gevorderd" as Level,
    price: 0,
    priceLabel: "Gratis",
    duration: "30 min",
    icon: BarChart3,
    featured: false,
  },
  {
    title: "ICP Scherpslijpen met AI",
    description: "Workshop: verfijn uw Ideal Customer Profile met AI-tools. Van vage omschrijving naar laserscerpe targeting.",
    href: "/cheatsheet/icp-ai",
    tag: "Targeting",
    level: "Gevorderd" as Level,
    price: 0,
    priceLabel: "Gratis",
    duration: "20 min",
    icon: Users,
    featured: false,
  },
  {
    title: "Multi-channel Sequencing Playbook",
    description: "E-mail, LinkedIn en calling in één geautomatiseerde flow. 14-dagen sequentie met templates per kanaal.",
    href: "/cheatsheet/multichannel-sequencing",
    tag: "Outbound",
    level: "Expert" as Level,
    price: 0,
    priceLabel: "Gratis",
    duration: "25 min",
    icon: Zap,
    featured: false,
  },
];

function matchesPriceRange(price: number, range: PriceRange): boolean {
  if (range === "Gratis") return price === 0;
  if (range === "< €100") return price > 0 && price < 100;
  return price >= 100;
}

const Trainingen = () => {
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [activePrice, setActivePrice] = useState<PriceRange | null>(null);

  useEffect(() => {
    document.title = "Trainingen | B2BGroeiMachine";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Interactieve trainingen en workshops voor B2B sales, prospecting en pipeline management.");
  }, []);

  const filtered = trainingen
    .filter(t => !activeLevel || t.level === activeLevel)
    .filter(t => !activePrice || matchesPriceRange(t.price, activePrice));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Trai<span className="text-primary">ningen</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            Interactieve programma's om uw B2B sales-systeem op te bouwen. Kies uw niveau en ga aan de slag.
          </p>

          {/* Level filter */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground font-medium mr-1">Niveau:</span>
            <button
              onClick={() => setActiveLevel(null)}
              className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
                activeLevel === null
                  ? "bg-primary/20 text-primary border-primary ring-1 ring-primary/30"
                  : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              Alle
            </button>
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(activeLevel === level ? null : level)}
                className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
                  activeLevel === level ? levelColorsActive[level] : `${levelColors[level]} hover:opacity-80`
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Price filter */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs text-muted-foreground font-medium mr-1">Prijs:</span>
            <button
              onClick={() => setActivePrice(null)}
              className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
                activePrice === null
                  ? "bg-primary/20 text-primary border-primary ring-1 ring-primary/30"
                  : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              Alle
            </button>
            {priceRanges.map((range) => (
              <button
                key={range}
                onClick={() => setActivePrice(activePrice === range ? null : range)}
                className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
                  activePrice === range
                    ? "bg-primary/20 text-primary border-primary ring-1 ring-primary/30"
                    : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Training cards */}
          <div className="grid gap-4">
            {filtered.map((training) => (
              <Link
                key={training.href}
                to={training.href}
                className={`group flex items-start gap-4 p-6 rounded-lg border transition-all ${
                  training.featured
                    ? "border-primary/40 bg-primary/5 hover:border-primary/70 hover:shadow-[0_0_30px_hsl(var(--primary)/0.1)]"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center ${
                  training.featured ? "bg-primary/20" : "bg-primary/10"
                }`}>
                  <training.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{training.tag}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${levelColors[training.level]}`}>
                      {training.level}
                    </span>
                    {training.featured && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                        Populair
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{training.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{training.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm font-display font-bold text-foreground">{training.priceLabel}</span>
                    <span className="text-xs text-muted-foreground">⏱ {training.duration}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Geen trainingen gevonden voor deze filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Trainingen;
