import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, ExternalLink, Linkedin, BadgeCheck, Users, Sparkles, Globe, Shield, Check } from "lucide-react";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";

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

          {/* Performance Partnership Section */}
          <div className="mt-16 mb-24">
            <div className="relative p-6 md:p-8 lg:p-10 rounded-2xl border border-primary/15 bg-gradient-to-b from-[#14151A] to-[#0D0E11] overflow-hidden">
              {/* Background dot grid pattern to match the image precisely */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{
                  backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                  backgroundSize: '16px 1px',
                }}
              />
              <div 
                className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                style={{
                  backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                  backgroundSize: '1px 16px',
                }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
                {/* Left column: Proposition and requirements */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                      Voor gekwalificeerde klanten
                    </span>
                  </div>
                  
                  <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
                    Performance Partnership.
                  </h2>
                  <p className="font-display text-lg md:text-xl font-medium text-primary mb-6">
                    Lage techkosten. Gedeelde upside.
                  </p>
                  
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                    Voor wie al omzet draait, maar het systeem mist. Wij bouwen en draaien de groeimachine. U deelt mee in de upside die het systeem oplevert.
                  </p>

                  <div>
                    <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-primary/70 mb-4">
                      Toelating
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                      {[
                        "Bewezen B2B-propositie met klanten",
                        "Gezonde marges en dealwaarde",
                        "Transparante CRM- en salesdata",
                        "Heldere attributie-afspraken vooraf"
                      ].map((req, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-xs md:text-sm">
                          <span className="text-primary font-bold shrink-0 mt-0.5">✓</span>
                          <span className="text-muted-foreground font-medium">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right column: Interactive/visual pricing cards and footnotes */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-black/20 p-5 md:p-6 rounded-xl border border-border/40 backdrop-blur-sm">
                  <div>
                    {/* Top Row: Price Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* Min Techkosten Card */}
                      <div className="p-4 rounded-xl bg-[#111216] border border-border/50 flex flex-col">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Min. Techkosten
                        </span>
                        <span className="text-xl md:text-2xl font-bold font-display text-foreground tracking-tight">
                          €500 – €1.000
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1">
                          / maand
                        </span>
                      </div>

                      {/* Revenue Share Card with Glow Accent */}
                      <div className="p-4 rounded-xl bg-[#111216] border border-primary/40 shadow-[0_0_15px_rgba(232,148,90,0.05)] flex flex-col relative">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">
                          Revenue Share
                        </span>
                        <span className="text-xl md:text-2xl font-bold font-display text-primary tracking-tight">
                          5 – 15%
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1">
                          van toegeschreven omzet
                        </span>
                      </div>
                    </div>

                    {/* Dotted Footnotes stack to match visual styling */}
                    <div className="space-y-3 mb-6">
                      <div className="p-3.5 rounded-lg border border-dashed border-border/60 text-[11px] text-muted-foreground leading-relaxed bg-[#111216]/40">
                        Alleen op duidelijk afgebakende, door het systeem gegenereerde of beïnvloede omzet. Attributie wordt vooraf vastgelegd.
                      </div>
                      
                      <div className="p-3.5 rounded-lg border border-dashed border-border/60 text-[11px] text-muted-foreground leading-relaxed bg-[#111216]/40">
                        Wij investeren regelmatig in start-ups met een barter-constructie.{" "}
                        <button 
                          onClick={() => openBookingModal()}
                          className="text-primary hover:underline font-semibold"
                        >
                          Bekijk de voorwaarden
                        </button>
                        {" "}en join onze hub.
                      </div>
                    </div>
                  </div>

                  {/* Big Accent CTA Button */}
                  <button
                    onClick={() => openBookingModal()}
                    className="w-full py-3.5 px-6 rounded-xl bg-primary text-black font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(232,148,90,0.2)] active:scale-[0.98]"
                  >
                    Boek gratis scan →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Wat krijg je als partner */}
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Wat krijg je als <span className="text-primary">Partner?</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-base mb-10 max-w-2xl">
              Als Signal Partner krijg je niet alleen een badge — je wordt onderdeel van een groeiend ecosysteem 
              van B2B-ondernemers die signal-based selling toepassen, kennis delen en naar elkaar doorverwijzen.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {/* Badge & Zichtbaarheid */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <BadgeCheck className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">Signal Certified Badge</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bewijs dat je signal-based selling beheerst. Zichtbaar in de directory voor prospects en collega-ondernemers in uw sector.
                </p>
              </div>

              {/* Referral */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">Referral & Commissie</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ontvang een unieke referral-code. Verdien commissie wanneer je het Signaal Detectiesysteem doorverwijst naar andere ondernemers.
                </p>
              </div>

              {/* Community */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">Netwerk & Community</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sluit aan bij een netwerk van signal-based sellers. Deel kennis, verwijs leads door en groei samen met gelijkgestemde B2B-professionals.
                </p>
              </div>
            </div>

            {/* RebelHub sectie */}
            <div className="p-8 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-card">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <div className="flex-1">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-primary/15 text-primary border border-primary/25 mb-4">
                    Fysiek netwerk
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-bold mb-3">
                    RebelHub — Coworking voor <span className="text-primary">Ondernemers</span>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    Als partner heb je toegang tot RebelHub: het coworking netwerk in het Rivierenland. 
                    Gratis werkplekken voor starters, betaalbare flexplekken voor professionals, en elke 
                    twee weken een hands-on AI-training. Momenteel 1 locatie open, 10 gepland.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {[
                      { label: "Gratis werkplek", desc: "Op beschikbaarheid (barter)" },
                      { label: "Flex Lidmaatschap", desc: "€149/maand — vaste werkplek" },
                      { label: "AI Trainingen", desc: "Elke 2 weken, gratis voor leden" },
                      { label: "10 locaties gepland", desc: "Van Nijmegen tot Dordrecht" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-2.5 text-sm">
                        <span className="text-primary font-bold mt-0.5 shrink-0">✓</span>
                        <div>
                          <span className="text-foreground font-medium">{item.label}</span>
                          <span className="text-muted-foreground"> — {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://rebelforce-hubs.lovable.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                  >
                    Bekijk RebelHub <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Onderdeel van */}
                <div className="md:w-72 shrink-0 flex flex-col gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1">Onderdeel van</p>
                  <a
                    href="https://rebelforce.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <span className="font-display text-sm font-bold text-foreground">RebelForce</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Digitale strategie & AI-implementatie</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </a>
                  <a
                    href="https://ai-readyscan.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <span className="font-display text-sm font-bold text-foreground">AI Fctry</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">AI-implementatiepartner voor uw bedrijf</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 text-center p-8 rounded-xl border border-border bg-card">
              <BadgeCheck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-bold text-xl mb-2">Klaar om aan te sluiten?</h3>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
                Voltooi het Signaal Detectiesysteem en ontvang uw Signal Certified badge.
                Word zichtbaar voor andere B2B-professionals in uw sector.
              </p>
              <a
                href="/signaal"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all"
              >
                Start het Signaal Detectiesysteem
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
