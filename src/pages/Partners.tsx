import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, ExternalLink, Linkedin, BadgeCheck, Users } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  company: string;
  sector: string | null;
  expertise: string[];
  tagline: string | null;
  website: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
}

const SECTORS = [
  "IT & SaaS",
  "Zakelijke Dienstverlening",
  "Maakindustrie",
  "Engineering",
  "Financiële Sector",
  "Groothandel",
  "Opleiding & Training",
  "Leasemaatschappijen",
  "Profvoetbal",
];

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Signal Partners | B2BGroeiMachine";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Ontdek gecertificeerde Signal Partners — ondernemers die signal-based selling toepassen in hun B2B-groei.");
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase
        .from("partners")
        .select("id, name, company, sector, expertise, tagline, website, linkedin_url, avatar_url")
        .eq("is_approved", true)
        .eq("is_visible", true)
        .order("created_at", { ascending: false });
      setPartners((data as Partner[]) || []);
      setLoading(false);
    };
    fetchPartners();
  }, []);

  const filtered = partners
    .filter(p => !activeSector || p.sector === activeSector)
    .filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        p.expertise.some(e => e.toLowerCase().includes(q))
      );
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-primary" />
            </div>
            <span className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase">
              Signal Certified
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Signal <span className="text-primary">Partners</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            Ondernemers die signal-based selling toepassen in hun dagelijkse B2B-groei.
            Vind een partner in uw branche of sluit u aan na het voltooien van het Signaal Detectiesysteem.
          </p>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoek op naam, bedrijf of expertise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Sector filter */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <span className="text-xs text-muted-foreground font-medium mr-1">Sector:</span>
            <button
              onClick={() => setActiveSector(null)}
              className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
                activeSector === null
                  ? "bg-primary/20 text-primary border-primary ring-1 ring-primary/30"
                  : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              Alle
            </button>
            {SECTORS.map((sector) => (
              <button
                key={sector}
                onClick={() => setActiveSector(activeSector === sector ? null : sector)}
                className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
                  activeSector === sector
                    ? "bg-primary/20 text-primary border-primary ring-1 ring-primary/30"
                    : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* Partners grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((partner, i) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {partner.avatar_url ? (
                        <img src={partner.avatar_url} alt={partner.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display font-bold text-primary text-lg">
                          {partner.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-semibold text-base text-foreground truncate">{partner.name}</h3>
                        <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{partner.company}</p>
                    </div>
                  </div>

                  {partner.tagline && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{partner.tagline}</p>
                  )}

                  {partner.sector && (
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary mb-3">
                      {partner.sector}
                    </span>
                  )}

                  {partner.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {partner.expertise.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    {partner.linkedin_url && (
                      <a
                        href={partner.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                {partners.length === 0
                  ? "Binnenkort verschijnen hier de eerste Signal Partners."
                  : "Geen partners gevonden voor deze filters."}
              </p>
              {partners.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Voltooi het{" "}
                  <a href="/signaal" className="text-primary hover:underline">Signaal Detectiesysteem</a>
                  {" "}om u aan te melden als partner.
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center p-8 rounded-xl border border-border bg-card">
            <BadgeCheck className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="font-display font-bold text-2xl mb-2">Word Signal Partner</h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
              Voltooi het Signaal Detectiesysteem en ontvang uw Signal Certified badge.
              Wordt zichtbaar voor andere B2B-professionals in uw sector.
            </p>
            <a
              href="/signaal"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all"
            >
              Start het Signaal Detectiesysteem
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
