import { useEffect, useState, type CSSProperties } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Target, Map, Database, Megaphone, Route, BarChart3, Users, Radio, Award, Shield, Eye, MousePointerClick, Mail, Linkedin, Repeat, TrendingUp, Building2, Briefcase, Headphones, Globe2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";

interface AbmRow {
  slug: string;
  company_name: string;
  payload: any;
  status: string;
  expires_at: string;
}

const sb = supabase as unknown as { from: (t: string) => any; rpc: (n: string, a?: any) => any };

const asList = (v: any): string[] =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : [];

type Step = { title: string; description?: string };
const asSteps = (v: any): Step[] => {
  if (!Array.isArray(v)) return [];
  const out: Step[] = [];
  for (const x of v) {
    if (typeof x === "string" && x.trim()) out.push({ title: x });
    else if (x && typeof x === "object") {
      const title = x.title || x.name || "";
      if (title) out.push({ title, description: x.description || x.desc || x.body });
    }
  }
  return out;
};

const STEP_ICONS = [Target, Map, Database, Megaphone, Route, BarChart3];

// --- Readability helpers (WCAG contrast) ---------------------------------
function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return null;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}
function relLum([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a: string, b: string): number {
  const ra = hexToRgb(a), rb = hexToRgb(b);
  if (!ra || !rb) return 21;
  const la = relLum(ra), lb = relLum(rb);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
function ensureReadable(fg: string, bgs: string[], min: number): string {
  const ok = bgs.every((bg) => contrast(fg, bg) >= min);
  if (ok) return fg;
  // pick best of white / near-black against the darkest bg
  const darkBg = bgs.reduce((acc, c) => {
    const rgb = hexToRgb(c);
    return rgb && relLum(rgb) < relLum(hexToRgb(acc) || [255, 255, 255]) ? c : acc;
  }, bgs[0]);
  const bgRgb = hexToRgb(darkBg);
  const isDark = bgRgb ? relLum(bgRgb) < 0.5 : true;
  // for muted (min ~3.2) use a softer tone; for body (min 4.5) use full white/black
  if (min < 4.5) return isDark ? "#C9D1E0" : "#4B5563";
  return isDark ? "#F5F7FB" : "#0B1220";
}
// -------------------------------------------------------------------------

const AbmPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [row, setRow] = useState<AbmRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await sb
        .from("abm_pages")
        .select("slug, company_name, payload, status, expires_at")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setRow(data as AbmRow);
      setLoading(false);
      sb.rpc("increment_abm_view", { _slug: slug }).then(() => {}, () => {});
    })();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex, nofollow";
    document.head.appendChild(tag);
    return () => { document.head.removeChild(tag); };
  }, []);

  const p = row?.payload || {};
  const hero = p.hero || {};
  const branding = p.branding || {};
  const primary: string = branding.primary || branding.primaryColor || p.primaryColor || "#0B3E91";
  const accent: string = branding.accent || branding.accentColor || p.accentColor || primary;
  const bgColor: string = branding.bg || "#0A0F1E";
  const surfaceColor: string = branding.surface || "#101830";
  const rawTextColor: string = branding.text || "#F5F7FB";
  const rawMutedColor: string = branding.muted || "#9AA5BD";
  // Readability guard: force text/muted to readable values vs bg+surface
  const textColor: string = ensureReadable(rawTextColor, [bgColor, surfaceColor], 4.5);
  const mutedColor: string = ensureReadable(rawMutedColor, [bgColor, surfaceColor], 3.2);
  const borderColor: string = branding.border || `${textColor}1A`;
  const headingFont: string | undefined = branding.headingFont;
  const bodyFont: string | undefined = branding.bodyFont;
  const radius: string = branding.radius === "sm" ? "0.375rem" : branding.radius === "md" ? "0.625rem" : branding.radius === "xl" ? "1.25rem" : "0.875rem";
  const logoUrl: string | undefined = branding.logoLight || branding.logo || branding.logoUrl;
  const heroImage: string | undefined = hero.image || p.imageUrl || p.heroImage;
  const assets = p.assets || branding.assets || {};
  const observationImage: string | undefined = assets.observations || assets.observation;
  const ctaImage: string | undefined = assets.cta;
  const siteScreenshot: string | undefined = assets.siteScreenshot;

  // Inject Google Fonts dynamically when client overrides typography
  useEffect(() => {
    const families: string[] = [];
    if (headingFont) families.push(`${headingFont.replace(/ /g, "+")}:wght@500;600;700;800`);
    if (bodyFont && bodyFont !== headingFont) families.push(`${bodyFont.replace(/ /g, "+")}:wght@400;500;600`);
    if (!families.length) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [headingFont, bodyFont]);

  const title: string = hero.title || p.recommendedVisualTitle || p.title || (row ? `Zo bouwen wij de pipeline voor ${row.company_name}.` : "");
  const subtitle: string = hero.subtitle || p.subtitle || "";
  const eyebrow: string = hero.eyebrow || (row ? row.company_name.toUpperCase() : "");
  const intro: string = hero.intro || p.intro || p.description || p.reasoning || "";
  const highlights = asList(hero.highlights || p.highlights);

  const valueBar = asList(p.valueBar);
  const summary: string = p.summary || "";

  const opportunity = p.opportunity || {};
  const opportunitySteps = asSteps(opportunity.steps || p.opportunitySteps);
  const approach = p.approach || {};
  const approachSteps = asSteps(approach.steps || p.approachSteps);

  const targetAccounts = asList(p.targetAccounts || p.audience);
  const products = asList(p.products || p.services);
  const signals = asList(p.signals?.items || p.signalItems);
  const tiers = asSteps(p.signals?.tiers || p.tiers);
  const expectedOutput = asList(p.expectedOutput || p.outputs);
  const clientExpertise = asSteps(p.expertise || p.clientExpertise);
  const routing: { signal: string; action: string; team: string }[] = Array.isArray(p.routing)
    ? p.routing.filter((r: any) => r && r.signal).map((r: any) => ({
        signal: r.signal, action: r.action || "", team: r.team || r.route || "",
      }))
    : [];
  const certifications = asList(p.certifications);
  const ourExpertise = asSteps(p.ourExpertise || p.b2bExpertise);
  const clientObservations = asSteps(p.clientObservations);
  const ourFit = asSteps(p.ourFit || p.whyUs);
  const caseProof = asSteps(p.caseProof || p.cases);

  const ctaObj = (typeof p.cta === "object" && p.cta) ? p.cta : {};
  const ctaHeadline: string = ctaObj.headline || (typeof p.cta === "string" ? p.cta : "") ||
    (row ? `Klaar om dit voor ${row.company_name} in te richten?` : "");
  const ctaLabel: string = ctaObj.label || "Plan kennismaking";
  const ctaUrl: string = ctaObj.url || p.ctaUrl || "/contact";

  usePageMeta({
    title: row ? `${row.company_name} × B2BGroeiMachine` : "B2BGroeiMachine",
    description: (intro || subtitle).slice(0, 155),
    canonical: row ? `https://b2bgroeimachine.io/voor/${row.slug}` : undefined,
  });

  if (loading) return <div className="min-h-screen bg-background" />;
  if (notFound || !row) return <Navigate to="/404" replace />;
  if (row.status !== "live" || new Date(row.expires_at) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-display mb-3">Deze pagina is verlopen</h1>
          <p className="text-muted-foreground mb-6">
            De ABM pagina voor {row.company_name} is niet meer actief.
          </p>
          <Button asChild><a href="/contact">Neem contact op</a></Button>
        </div>
      </div>
    );
  }

  const brandStyle = {
    "--brand": primary,
    "--brand-accent": accent,
    backgroundColor: bgColor,
    color: textColor,
    fontFamily: bodyFont ? `'${bodyFont}', Inter, system-ui, sans-serif` : undefined,
  } as CSSProperties;
  const headingStyle: CSSProperties = headingFont ? { fontFamily: `'${headingFont}', 'Space Grotesk', sans-serif` } : {};
  const brandBtn: CSSProperties = { backgroundColor: primary, color: "#fff", borderColor: primary, borderRadius: radius };
  const softBrand: CSSProperties = { backgroundColor: `${primary}1A`, color: primary };
  const cardStyle: CSSProperties = { backgroundColor: surfaceColor, borderColor, color: textColor, borderRadius: radius };
  const mutedStyle: CSSProperties = { color: mutedColor };

  const Section = ({ num, title, children, className = "" }: { num?: number | string; title: string; children: React.ReactNode; className?: string }) => (
    <section className={`py-14 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          {num !== undefined && (
            <span className="inline-flex items-center justify-center h-7 w-7 rounded text-xs font-bold text-white" style={{ backgroundColor: primary }}>
              {num}
            </span>
          )}
          <h2 className="font-display text-2xl md:text-3xl tracking-tight" style={headingStyle}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );

  return (
    <div className="abm-skin min-h-screen" style={brandStyle}>
      <style>{`
        .abm-skin .bg-card { background-color: ${surfaceColor} !important; }
        .abm-skin .bg-card\\/40 { background-color: ${surfaceColor}66 !important; }
        .abm-skin .bg-card\\/50 { background-color: ${surfaceColor}80 !important; }
        .abm-skin .bg-background { background-color: ${bgColor} !important; }
        .abm-skin .border-border { border-color: ${borderColor} !important; }
        .abm-skin .text-muted-foreground { color: ${mutedColor} !important; }
        .abm-skin .text-foreground { color: ${textColor} !important; }
        .abm-skin .font-display { ${headingFont ? `font-family: '${headingFont}', 'Space Grotesk', sans-serif !important;` : ""} }
        .abm-skin .rounded-xl, .abm-skin .rounded-2xl { border-radius: ${radius} !important; }
        @keyframes abmFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes abmBeam { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes abmOrb { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-30px) scale(1.1); } 66% { transform: translate(-30px,20px) scale(0.95); } }
        .abm-orb { animation: abmOrb 18s ease-in-out infinite; will-change: transform; }
        .abm-float { animation: abmFloat 8s ease-in-out infinite; }
        .abm-dots { background-image: radial-gradient(${textColor}22 1px, transparent 1px); background-size: 24px 24px; }
        .abm-beam::before { content:""; position:absolute; inset:-2px; border-radius: inherit; padding:2px; background: conic-gradient(from 0deg, transparent 0deg, ${primary} 60deg, transparent 120deg, transparent 240deg, ${accent} 300deg, transparent 360deg); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; animation: abmBeam 6s linear infinite; pointer-events:none; }
      `}</style>
      {/* Top bar — B2BGroeiMachine identity, klantlogo als badge */}
      <header className="border-b backdrop-blur-md sticky top-0 z-30" style={{ backgroundColor: `${bgColor}E6`, borderColor }}>
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <a href="https://b2bgroeimachine.io/" className="flex items-center gap-2 group">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-md text-white font-bold text-xs" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>B²</span>
            <span className="font-display font-bold tracking-tight text-base" style={{ color: textColor }}>B2BGroeiMachine</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm" style={{ color: mutedColor }}>
            <a href="https://b2bgroeimachine.io/werkwijze" className="hover:opacity-100 transition">Werkwijze</a>
            <a href="https://b2bgroeimachine.io/cases" className="hover:opacity-100 transition">Cases</a>
            <a href="https://b2bgroeimachine.io/blog" className="hover:opacity-100 transition">Blog</a>
            <a href="https://b2bgroeimachine.io/contact" className="hover:opacity-100 transition">Contact</a>
          </nav>
          <Button asChild size="sm" style={brandBtn}>
            <a href={ctaUrl}>{ctaLabel}</a>
          </Button>
        </div>
      </header>

      {/* Persoonlijke pagina ribbon met klantlogo */}
      <div className="border-b" style={{ borderColor, backgroundColor: `${primary}0D` }}>
        <div className="container mx-auto px-6 h-12 flex items-center justify-center gap-3 text-xs sm:text-sm">
          <span style={{ color: mutedColor }}>Persoonlijke pagina voor</span>
          {logoUrl ? (
            <img src={logoUrl} alt={row.company_name} className="h-6 w-auto" />
          ) : (
            <span className="font-display font-semibold" style={{ color: primary }}>{row.company_name}</span>
          )}
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background layers: dot pattern + animated orbs */}
        <div className="absolute inset-0 abm-dots opacity-60 pointer-events-none" />
        <div className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-40 abm-orb pointer-events-none" style={{ background: `radial-gradient(circle, ${primary} 0%, transparent 70%)` }} />
        <div className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-30 abm-orb pointer-events-none" style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, animationDelay: "-6s" }} />

        <div className="container mx-auto px-6 py-16 md:py-28 relative grid lg:grid-cols-12 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: `${primary}15`, color: primary, border: `1px solid ${primary}33` }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: primary }} />
              {eyebrow || row.company_name.toUpperCase()} × B2BGROEIMACHINE
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mb-6" style={headingStyle}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-2xl mb-6 font-medium" style={{ color: primary }}>{subtitle}</p>
            )}
            {intro && (
              <p className="text-base md:text-lg leading-relaxed mb-8 max-w-2xl" style={mutedStyle}>{intro}</p>
            )}
            <div className="flex flex-wrap gap-3 items-center">
              <Button asChild size="lg" style={brandBtn} className="shadow-lg hover:shadow-xl transition-shadow">
                <a href={ctaUrl}>{ctaLabel} <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              {siteScreenshot && (
                <a href="#analyse" className="text-sm font-medium underline-offset-4 hover:underline" style={{ color: primary }}>
                  Bekijk wat wij zien →
                </a>
              )}
            </div>
          </motion.div>

          {/* Right column: hero illustration in beam-bordered card, with highlights floating below */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="lg:col-span-5 relative">
            {heroImage && (
              <div className="relative abm-beam rounded-2xl overflow-hidden abm-float" style={{ backgroundColor: surfaceColor }}>
                <img src={heroImage} alt="" className="w-full h-auto block relative z-[1]" />
              </div>
            )}
            {highlights.length > 0 && (
              <div className={`${heroImage ? "mt-5" : ""} rounded-2xl border bg-card p-5 md:p-6 backdrop-blur-sm`} style={{ borderColor: `${primary}33`, backgroundColor: `${surfaceColor}F2` }}>
                <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: primary }}>
                  Waarom we dit voor {row.company_name} maakten
                </p>
                <ul className="space-y-3">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0" style={softBrand}>
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-sm leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Site analyse / screenshot — proof we kennen de klant */}
      {siteScreenshot && (
        <section id="analyse" className="relative py-16 md:py-20 border-b border-border overflow-hidden">
          <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.2em] mb-4" style={{ color: primary }}>WAT WIJ ZIEN</p>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4" style={headingStyle}>
                We hebben uw site uit elkaar gehaald.
              </h2>
              <p className="text-base leading-relaxed" style={mutedStyle}>
                {row.company_name} heeft een duidelijke propositie. Wij zien waar verkeer afhaakt, welke signalen onbenut blijven en hoe we uw pipeline voorspelbaar maken.
              </p>
            </div>
            <div className="lg:col-span-7 relative">
              <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-30 pointer-events-none" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }} />
              <motion.div
                initial={{ opacity: 0, rotateY: -8, rotateX: 4 }}
                whileInView={{ opacity: 1, rotateY: -4, rotateX: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative rounded-xl overflow-hidden border shadow-2xl"
                style={{ borderColor: `${primary}40`, transformPerspective: 1200 }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ backgroundColor: surfaceColor, borderColor }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
                  <span className="ml-3 text-[10px] font-mono" style={{ color: mutedColor }}>
                    {(p.sourceUrl || `https://${row.slug}.nl`).replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <img src={siteScreenshot} alt={`${row.company_name} website`} className="w-full h-auto block max-h-[520px] object-top object-cover" />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Manifest — Hormozi-stijl: signaalprobleem & bewegende markt */}
      <section className="relative py-20 md:py-28 border-b overflow-hidden" style={{ borderColor, backgroundColor: bgColor }}>
        <div className="absolute inset-0 abm-dots opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle, ${primary} 0%, transparent 70%)` }} />
        <div className="container mx-auto px-6 relative max-w-5xl">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-6 text-center" style={{ color: primary }}>
            Het echte probleem
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02] text-center mb-4" style={headingStyle}>
            U heeft geen leadprobleem.
          </h2>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02] text-center mb-16" style={{ ...headingStyle, color: primary }}>
            U heeft een signaalprobleem.
          </h2>

          <p className="font-display text-2xl md:text-3xl text-center mb-10 leading-snug" style={headingStyle}>
            Uw markt beweegt al.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
            {[
              { icon: Eye, t: "Mensen bezoeken uw site" },
              { icon: Mail, t: "Ze openen uw mails" },
              { icon: Linkedin, t: "Ze bekijken profielen" },
              { icon: MousePointerClick, t: "Ze reageren op content" },
              { icon: Repeat, t: "Ze wisselen van leverancier" },
              { icon: TrendingUp, t: "Ze groeien, krimpen, huren" },
            ].map(({ icon: Icon, t }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl border"
                style={{ borderColor: `${primary}30`, backgroundColor: `${surfaceColor}80` }}
              >
                <span className="inline-flex h-9 w-9 rounded-lg items-center justify-center flex-shrink-0" style={softBrand}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm md:text-base font-medium">{t}</span>
              </motion.div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="font-display text-2xl md:text-4xl leading-tight" style={headingStyle}>
              Maar u ziet het pas als ze een formulier invullen.
            </p>
            <p className="font-display text-3xl md:text-5xl leading-tight" style={{ ...headingStyle, color: primary }}>
              En dan bent u te laat.
            </p>
            <div className="h-px w-24 mx-auto my-8" style={{ backgroundColor: `${primary}80` }} />
            <p className="text-lg md:text-xl leading-relaxed" style={mutedStyle}>
              B2BGroeiMachine bouwt het systeem dat die signalen eerder herkent, weegt en omzet naar commerciële actie. Geen losse lijst. Geen eenmalige campagne. Een werkend brein dat blijft staan.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 pt-6 text-left">
              {[
                "Context vastleggen",
                "Markt mappen",
                "Accounts verrijken",
                "Signalen meten",
                "Engagement activeren",
                "Sales routeren",
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ color: textColor }}>
                  <span className="font-mono text-xs" style={{ color: primary }}>0{i + 1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value bar */}
      {(summary || valueBar.length > 0) && (
        <section className="border-b border-border" style={{ backgroundColor: primary }}>
          <div className="container mx-auto px-6 py-6 grid md:grid-cols-12 gap-6 items-center text-white">
            {summary && (
              <p className="md:col-span-7 text-sm md:text-base leading-relaxed">{summary}</p>
            )}
            {valueBar.length > 0 && (
              <ul className="md:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {valueBar.slice(0, 4).map((v, i) => (
                  <li key={i} className="text-[10px] md:text-xs font-semibold tracking-wider uppercase">{v}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* 0 — Client observations (deep personalisation) */}
      {clientObservations.length > 0 && (
        <Section title={`Wat wij van ${row.company_name} zien`}>
          {observationImage && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-border max-w-3xl">
              <img src={observationImage} alt="" className="w-full h-auto block" loading="lazy" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clientObservations.map((s, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card">
                <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: primary }}>Observatie {i + 1}</p>
                <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                {s.description && <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 1 — Opportunity */}
      {opportunitySteps.length > 0 && (
        <Section num={1} title={opportunity.title || "Waar wij de kans zien"}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {opportunitySteps.map((s, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center mb-3" style={softBrand}>
                  <span className="text-sm font-bold">{i + 1}</span>
                </div>
                <h3 className="font-medium mb-1 text-sm">{s.title}</h3>
                {s.description && <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 2 — Approach (numbered process arrow) */}
      {approachSteps.length > 0 && (
        <Section num={2} title={approach.title || `Wat dit voor ${row.company_name} kan betekenen`} className="bg-card/40 border-y border-border">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {approachSteps.map((s, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <div key={i} className="relative">
                  <div className="p-4 rounded-xl border border-border bg-background h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: primary }}>{i + 1}</span>
                      <Icon className="h-4 w-4" style={{ color: primary }} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                    {s.description && <p className="text-xs text-muted-foreground leading-snug">{s.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* 3 & 4 — Target accounts + Products */}
      {(targetAccounts.length > 0 || products.length > 0) && (
        <section className="py-14 border-b border-border">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-10">
            {targetAccounts.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded text-xs font-bold text-white" style={{ backgroundColor: primary }}>3</span>
                  <h2 className="font-display text-2xl md:text-3xl">Target account universe</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {targetAccounts.map((a, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card flex items-center gap-3">
                      <Users className="h-4 w-4 flex-shrink-0" style={{ color: primary }} />
                      <span className="text-sm font-medium leading-tight">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {products.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded text-xs font-bold text-white" style={{ backgroundColor: primary }}>4</span>
                  <h2 className="font-display text-2xl md:text-3xl">Producten & proposities</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {products.map((pr, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card flex items-center gap-3">
                      <Check className="h-4 w-4 flex-shrink-0" style={{ color: primary }} />
                      <span className="text-sm font-medium leading-tight">{pr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5 — Signal-based activation */}
      {(signals.length > 0 || tiers.length > 0) && (
        <Section num={5} title="Signal-based activatie" className="bg-card/40 border-b border-border">
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {signals.length > 0 && (
              <div className="lg:col-span-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Signalen die we volgen</p>
                <ul className="space-y-2">
                  {signals.map((s, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
                      <Radio className="h-4 w-4 flex-shrink-0" style={{ color: primary }} />
                      <span className="text-sm">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="lg:col-span-2 flex items-center justify-center text-xs text-muted-foreground py-4">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-wider mb-1">scoring &amp; profilering</div>
                <ArrowRight className="h-6 w-6 mx-auto lg:block hidden" style={{ color: primary }} />
              </div>
            </div>
            {tiers.length > 0 && (
              <div className="lg:col-span-5 space-y-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Account tiering</p>
                {tiers.map((t, i) => (
                  <div key={i} className="p-4 rounded-xl border-2" style={{ borderColor: primary, backgroundColor: `${primary}0A` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-semibold text-sm" style={{ color: primary }}>Tier {i + 1}</span>
                    </div>
                    <p className="font-semibold text-sm">{t.title}</p>
                    {t.description && <p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* 6 — Expected output */}
      {expectedOutput.length > 0 && (
        <Section num={6} title="Verwachte output">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {expectedOutput.map((o, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-card text-center">
                <div className="h-8 w-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={softBrand}>
                  <BarChart3 className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium leading-snug">{o}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 7 — Client expertise (Onze expertise — about client) */}
      {clientExpertise.length > 0 && (
        <Section num={7} title={`Sterktes van ${row.company_name}`} className="bg-card/40 border-y border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {clientExpertise.map((e, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-background">
                <div className="h-9 w-9 rounded-lg mb-3 flex items-center justify-center" style={softBrand}>
                  <Award className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{e.title}</h3>
                {e.description && <p className="text-xs text-muted-foreground leading-relaxed">{e.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Routing table */}
      {routing.length > 0 && (
        <section className="py-14 border-b border-border">
          <div className="container mx-auto px-6">
          <h2 className="font-display text-2xl md:text-3xl mb-6">Routing: signalen naar het juiste team</h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: `${primary}14` }}>
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">Signaal</th>
                    <th className="px-4 py-3 font-semibold">Actie</th>
                    <th className="px-4 py-3 font-semibold">Route naar</th>
                  </tr>
                </thead>
                <tbody>
                  {routing.map((r, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-4 py-3">{r.signal}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.action}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: primary }}>{r.team}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Certifications strip */}
      {certifications.length > 0 && (
        <section className="py-8 border-b border-border bg-card/40">
          <div className="container mx-auto px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {certifications.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Shield className="h-4 w-4" style={{ color: primary }} />
                {c}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Our (B2BGroeiMachine) expertise */}
      {ourExpertise.length > 0 && (
        <Section title="B2BGroeiMachine expertise">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ourExpertise.map((e, i) => (
              <div key={i} className="p-5 rounded-xl border-2 bg-card" style={{ borderColor: `${primary}60` }}>
                <h3 className="font-semibold text-sm mb-2 text-foreground">{e.title}</h3>
                {e.description && <p className="text-xs text-muted-foreground leading-relaxed">{e.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Why B2BGroeiMachine for this client */}
      {(ourFit.length > 0 || caseProof.length > 0) && (
        <Section title={`Waarom B2BGroeiMachine voor ${row.company_name}`} className="bg-card/40 border-y border-border">
          {ourFit.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {ourFit.map((e, i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-background">
                  <div className="h-9 w-9 rounded-lg mb-3 flex items-center justify-center" style={softBrand}>
                    <Check className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{e.title}</h3>
                  {e.description && <p className="text-xs text-muted-foreground leading-relaxed">{e.description}</p>}
                </div>
              ))}
            </div>
          )}
          {caseProof.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseProof.map((e, i) => (
                <div key={i} className="p-5 rounded-xl border-2" style={{ borderColor: `${primary}40` }}>
                  <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: primary }}>Casevoorbeeld</p>
                  <h3 className="font-semibold text-sm mb-1">{e.title}</h3>
                  {e.description && <p className="text-xs text-muted-foreground leading-relaxed">{e.description}</p>}
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Final CTA banner */}
      <section className="relative py-14 text-white overflow-hidden" style={{ backgroundColor: primary }}>
        {ctaImage && (
          <div className="absolute inset-0 pointer-events-none opacity-15">
            <img src={ctaImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="font-display text-2xl md:text-4xl mb-6 max-w-3xl mx-auto leading-tight">{ctaHeadline}</h2>
          <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 border-white">
            <a href={ctaUrl}>{ctaLabel} <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
          <p className="text-xs mt-6 opacity-70">B2BGroeiMachine, uw partner in voorspelbare B2B groei.</p>
        </div>
      </section>
    </div>
  );
};

export default AbmPage;