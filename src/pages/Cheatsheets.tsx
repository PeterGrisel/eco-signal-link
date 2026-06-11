import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheatsheetTrainingCta from "@/components/cheatsheet/CheatsheetTrainingCta";
import { FileText, ArrowRight, ThumbsUp, Star } from "lucide-react";
import { trackCTA } from "@/lib/tracking";
import GroeistackLeadCapture from "@/components/GroeistackLeadCapture";

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
  {
    title: "Claude × Gamma — Presentaties in 10 min",
    description: "Presentaties bouwen vanuit Claude met Gamma — zonder PowerPoint, zonder templates slopen.",
    href: "/cheatsheet/gamma-presentaties",
    tag: "Productiviteit",
    level: "Beginner" as Level,
    tools: ["Claude", "Gamma"],
  },
];

const allTools = [...new Set(cheatsheets.flatMap(s => s.tools))];

const slugFromHref: Record<string, string> = {
  "/cheatsheet/signal-prospecting": "signal-prospecting",
  "/cheatsheet/linkedin-outreach": "linkedin-outreach",
  "/cheatsheet/hubspot-pipeline": "hubspot-pipeline",
  "/cheatsheet/icp-ai": "icp-ai",
  "/cheatsheet/multichannel-sequencing": "multichannel-sequencing",
  "/cheatsheet/gamma-presentaties": "gamma-presentaties",
};

type FeedbackStats = Record<string, { votes: number; avgRating: number }>;

const Cheatsheets = () => {
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [stats, setStats] = useState<FeedbackStats>({});

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from("cheatsheet_feedback")
        .select("cheatsheet_slug, helpful, rating");
      if (!data) return;
      const grouped: FeedbackStats = {};
      for (const row of data) {
        if (!grouped[row.cheatsheet_slug]) grouped[row.cheatsheet_slug] = { votes: 0, avgRating: 0 };
        const g = grouped[row.cheatsheet_slug];
        if (row.helpful) g.votes++;
        if (row.rating) {
          const prev = g.avgRating;
          const count = data.filter(r => r.cheatsheet_slug === row.cheatsheet_slug && r.rating).indexOf(row);
          // simple running avg
          g.avgRating = prev ? (prev * count + row.rating) / (count + 1) : row.rating;
        }
      }
      // recalc avg properly
      for (const slug of Object.keys(grouped)) {
        const ratings = data.filter(r => r.cheatsheet_slug === slug && r.rating).map(r => r.rating!);
        grouped[slug].avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      }
      setStats(grouped);
    };
    fetchStats();
  }, []);

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

          <GroeistackLeadCapture
            title="Wilt u op de hoogte blijven van alle GTM-ontwikkelingen?"
            description="Ontvang een melding zodra wij nieuwe cheatsheets, templates en guides delen."
            source="cheatsheets"
          />

          {/* Training upsell */}
          <div className="mb-10">
            <CheatsheetTrainingCta full={false} />
          </div>

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
                onClick={() => trackCTA(`Cheatsheets — Open: ${sheet.title}`, sheet.href)}
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
                  {(() => {
                    const slug = slugFromHref[sheet.href];
                    const s = slug ? stats[slug] : null;
                    if (!s || (!s.votes && !s.avgRating)) return null;
                    return (
                      <div className="flex items-center gap-3 mt-2">
                        {s.votes > 0 && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                            {s.votes}
                          </span>
                        )}
                        {s.avgRating > 0 && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {s.avgRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    );
                  })()}
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
