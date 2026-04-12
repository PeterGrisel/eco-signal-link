import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, ArrowRight, ThumbsUp, Star } from "lucide-react";

type Level = "Beginner" | "Gevorderd" | "Expert";

const levels: Level[] = ["Beginner", "Gevorderd", "Expert"];

const levelColors: Record<Level, string> = {
  Beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Gevorderd: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Expert: "bg-red-500/15 text-red-400 border-red-500/30",
};

const levelColorsActive: Record<Level, string> = {
  Beginner: "bg-emerald-500/25 text-emerald-300 border-emerald-400 ring-1 ring-emerald-500/30",
  Gevorderd: "bg-amber-500/25 text-amber-300 border-amber-400 ring-1 ring-amber-500/30",
  Expert: "bg-red-500/25 text-red-300 border-red-400 ring-1 ring-red-500/30",
};

const cheatsheets = [
  {
    title: "Claude × Apollo — Signal Prospecting",
    description: "Van marktsignaal naar persoonlijke outreach — zonder developer, zonder koppeling. In 15 minuten live.",
    href: "/cheatsheet/signal-prospecting",
    tag: "Prospecting",
    level: "Beginner" as Level,
    tools: ["Claude", "Apollo"],
  },
  {
    title: "LinkedIn Outreach Formules",
    description: "5 bewezen berichtsjablonen voor koude connectieverzoeken. Personaliseer met ChatGPT en verstuur vandaag nog.",
    href: "/cheatsheet/linkedin-outreach",
    tag: "Outreach",
    level: "Beginner" as Level,
    tools: ["LinkedIn", "ChatGPT"],
  },
  {
    title: "HubSpot Pipeline Setup in 30 min",
    description: "Van lege CRM naar werkende pipeline. Dealfases, properties, automatiseringen en dashboard voor B2B.",
    href: "/cheatsheet/hubspot-pipeline",
    tag: "CRM",
    level: "Beginner" as Level,
    tools: ["HubSpot"],
  },
  {
    title: "ICP Scherpslijpen met AI",
    description: "Verfijn je Ideal Customer Profile met Claude, Apollo en LinkedIn. Van vage omschrijving naar scherpe targeting.",
    href: "/cheatsheet/icp-ai",
    tag: "Strategie",
    level: "Gevorderd" as Level,
    tools: ["Claude", "Apollo", "LinkedIn"],
  },
  {
    title: "Multi-channel Sequencing Playbook",
    description: "E-mail, LinkedIn en calling in één flow. 14-dagen sequentie met templates per kanaal en exacte timing.",
    href: "/cheatsheet/multichannel-sequencing",
    tag: "Outbound",
    level: "Expert" as Level,
    tools: ["Instantly", "Apollo", "LinkedIn"],
  },
];

const allTools = [...new Set(cheatsheets.flatMap(s => s.tools))];

const Cheatsheets = () => {
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Cheatsheets | B2BGroeiMachine";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Praktische cheatsheets en quick-start guides voor B2B sales, prospecting en automatisering.");
  }, []);

  const filtered = cheatsheets
    .filter(s => !activeLevel || s.level === activeLevel)
    .filter(s => !activeTool || s.tools.includes(activeTool));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Cheat<span className="text-primary">sheets</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            Praktische quick-start guides. Kopieer de prompts, volg de stappen en ga direct live.
          </p>

          {/* Level filter */}
          <div className="flex items-center gap-2 mb-8">
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

          {/* Tool filter */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs text-muted-foreground font-medium mr-1">Tool:</span>
            <button
              onClick={() => setActiveTool(null)}
              className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
                activeTool === null
                  ? "bg-primary/20 text-primary border-primary ring-1 ring-primary/30"
                  : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              Alle
            </button>
            {allTools.map((tool) => (
              <button
                key={tool}
                onClick={() => setActiveTool(activeTool === tool ? null : tool)}
                className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
                  activeTool === tool
                    ? "bg-primary/20 text-primary border-primary ring-1 ring-primary/30"
                    : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                {tool}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {filtered.map((sheet) => (
              <Link
                key={sheet.href}
                to={sheet.href}
                className="group flex items-start gap-4 p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{sheet.tag}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${levelColors[sheet.level]}`}>{sheet.level}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{sheet.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{sheet.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cheatsheets;
