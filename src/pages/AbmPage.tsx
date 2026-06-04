import { useEffect, useState, type CSSProperties } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7 },
};

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

  // Persoonlijke elementen uit Firecrawl (eigen woorden + beelden)
  const personal = (p.personal && typeof p.personal === "object") ? p.personal : {};
  const personalPitch: string | undefined = personal.pitch;
  const personalTagline: string | undefined = personal.tagline;
  const personalClaim: string | undefined = personal.siteClaim;
  const personalBullets: string[] = Array.isArray(personal.bullets) ? personal.bullets.filter((x: any) => typeof x === "string" && x.trim()) : [];
  const personalGallery: string[] = Array.isArray(personal.gallery) ? personal.gallery.filter((x: any) => typeof x === "string" && x.trim()) : [];
  const personalOg: string | undefined = personal.ogImage;

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
  const heroBullets: string[] = personalBullets.length >= 2 ? personalBullets : asList(hero.highlights || p.highlights);
  const heroIntro: string = personalPitch || intro;

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

  // ── Personalisatie samengevoegd voor sectie 2 ─────────────────────────
  const challengeBody: string =
    personalPitch || summary || intro ||
    `${row.company_name} groeit op talent en netwerk. Maar pipeline mag niet afhangen van één persoon. Een systeem dat signalen ziet, scoort en routeert maakt groei voorspelbaar.`;

  const challengeBullets: string[] = (personalBullets.length > 0
    ? personalBullets
    : clientObservations.map((o) => o.title)
  ).slice(0, 3);

  const pillars = [
    { num: "01", title: "Proces opzetten", desc: "ICP-mapping, signaalconfiguratie, kanaalopzet en outreach-flows. Het fundament van uw groei-systeem." },
    { num: "02", title: "Data laten werken", desc: "Elk signaal, elke interactie, elk resultaat bouwt context op. De Datahub wordt uw commerciële geheugen." },
    { num: "03", title: "Resultaat compoundt", desc: "Hoe langer het draait, hoe preciezer de targeting, hoe hoger de conversie." },
  ];

  const layers = [
    { label: "Laag 1: Signaaldetectie", text: "Intent-data, websitebezoek, jobtriggers, funding en LinkedIn-activiteit. We zien wanneer prospects in-market zijn." },
    { label: "Laag 2: Kwalificatie & scoring", text: "Elk signaal gescoord op relevantie, timing en fit. Alleen de sterkste signalen worden opgepakt." },
    { label: "Laag 3: Omnichannel outreach", text: "6 tot 8 touchpoints via e-mail, LinkedIn, telefoon en video. Gepersonaliseerd op het signaal dat triggerde." },
    { label: "Laag 4: Datahub & context", text: "Alle interacties stromen terug. Het systeem leert, optimaliseert en wordt elke maand sterker." },
  ];

  const contactName: string | undefined = p.contact?.name || p.contact?.fullName;
  const contactPhone: string | undefined = p.contact?.phone || p.contact?.tel;
  const contactEmail: string | undefined = p.contact?.email;

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-5 h-px" style={{ backgroundColor: primary }} />
      <span className="text-xs font-display font-semibold tracking-[0.14em] uppercase" style={{ color: primary, ...headingStyle }}>
        {children}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen" style={brandStyle}>
      <style>{`
        .abm-flyer { color: ${textColor}; }
        .abm-flyer .abm-muted { color: ${mutedColor}; }
        .abm-flyer .abm-divider { border-color: ${borderColor}; }
        .abm-flyer .abm-surface { background-color: ${surfaceColor}; border-color: ${borderColor}; }
        .abm-flyer .abm-display { ${headingFont ? `font-family: '${headingFont}', 'Space Grotesk', sans-serif;` : ""} }
      `}</style>

      <div className="abm-flyer">
        {/* Slim top bar — B2BGroeiMachine identity only */}
        <header className="border-b sticky top-0 z-30 backdrop-blur-md" style={{ backgroundColor: `${bgColor}E6`, borderColor }}>
          <div className="px-6 md:px-16 lg:px-[72px] h-14 flex items-center justify-between">
            <a href="https://b2bgroeimachine.io/" className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded text-white font-bold text-[10px]" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>B²</span>
              <span className="abm-display font-semibold tracking-tight text-sm">B2BGroeiMachine</span>
            </a>
            <span className="text-[10px] font-display tracking-[0.18em] uppercase abm-muted hidden sm:inline">
              Voor {row.company_name}
            </span>
          </div>
        </header>

        {/* ── 1. COVER ── */}
        <section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-between px-6 md:px-16 lg:px-[72px] pt-16 pb-12" style={{ backgroundColor: bgColor }}>
          {/* Top: client logo for instant recognition */}
          <div className="flex items-center justify-between">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={row.company_name}
                className="h-10 md:h-12 w-auto opacity-90"
                style={{ maxWidth: 200, objectFit: "contain" }}
              />
            ) : (
              <span className="abm-display font-semibold text-lg" style={{ color: primary }}>{row.company_name}</span>
            )}
            <span className="text-[10px] font-display tracking-[0.12em] uppercase abm-muted">
              Flyer · {new Date().getFullYear()}
            </span>
          </div>

          {/* Middle: claim */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex-1 flex flex-col justify-center py-12"
          >
            <p className="text-xs font-display font-semibold tracking-[0.18em] uppercase mb-6" style={{ color: primary }}>
              Voor {row.company_name}
            </p>
            <h1 className="abm-display font-bold text-[clamp(2.2rem,5.2vw,4.8rem)] leading-[1.06] tracking-tight max-w-[860px]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-6 text-base md:text-xl max-w-[640px] leading-relaxed abm-muted">
                {subtitle}
              </p>
            )}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button asChild size="lg" style={brandBtn} className="shadow-lg">
                <a href={ctaUrl}>
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <a href="#uitdaging" className="text-sm font-medium hover:underline" style={{ color: primary }}>
                Lees verder ↓
              </a>
            </div>
          </motion.div>

          {/* Bottom: meta line */}
          <div className="flex justify-between items-end pt-6 border-t" style={{ borderColor }}>
            <p className="text-xs abm-muted">b2bgroeimachine.io</p>
            <p className="text-xs abm-muted text-right">
              Signal-Based Prospecting Systems<br />
              powered by Rebel Force
            </p>
          </div>
        </section>

        {/* ── 2. DE UITDAGING ── */}
        <motion.section
          id="uitdaging"
          {...fadeIn}
          className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b"
          style={{ borderColor, backgroundColor: bgColor }}
        >
          <SectionLabel>De uitdaging</SectionLabel>
          <h2 className="abm-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
            Wat we bij {row.company_name} zien.
          </h2>

          <div className="max-w-[640px] space-y-5 leading-relaxed">
            <p className="abm-muted text-base md:text-lg">{challengeBody}</p>
          </div>

          {challengeBullets.length > 0 && (
            <ul className="mt-10 grid gap-3 max-w-[640px]">
              {challengeBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm md:text-base leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: primary }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.section>

        {/* ── 3. ONZE AANPAK ── */}
        <motion.section
          {...fadeIn}
          className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b"
          style={{ borderColor, backgroundColor: surfaceColor }}
        >
          <SectionLabel>Onze aanpak</SectionLabel>
          <h2 className="abm-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-12">
            Wij bouwen systemen.{" "}
            <span className="italic font-medium" style={{ color: primary }}>U plukt de vruchten.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10 md:gap-12 max-w-[920px]">
            {pillars.map((pillar) => (
              <div key={pillar.num} className="pt-6 border-t" style={{ borderColor }}>
                <span className="abm-display text-3xl font-light leading-none mb-4 block" style={{ color: `${textColor}40` }}>
                  {pillar.num}
                </span>
                <h3 className="abm-display font-semibold text-sm mb-2">{pillar.title}</h3>
                <p className="text-sm leading-relaxed abm-muted">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 4. HET SYSTEEM ── */}
        <motion.section
          {...fadeIn}
          className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b"
          style={{ borderColor, backgroundColor: bgColor }}
        >
          <SectionLabel>Het systeem</SectionLabel>
          <h2 className="abm-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-12">
            Vier lagen.{" "}
            <span className="italic font-medium" style={{ color: primary }}>Eén systeem.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-5 max-w-[880px]">
            {layers.map((layer) => (
              <div key={layer.label} className="p-6 rounded-lg border abm-surface">
                <h3 className="text-xs abm-display font-semibold tracking-[0.08em] uppercase mb-3" style={{ color: primary }}>
                  {layer.label}
                </h3>
                <p className="text-sm leading-relaxed abm-muted">{layer.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 5. CLOSING ── */}
        <section className="px-6 md:px-16 lg:px-[72px] py-24 md:py-32" style={{ backgroundColor: bgColor }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8 max-w-[720px]"
          >
            <SectionLabel>Tot slot</SectionLabel>
            <h2 className="abm-display font-bold text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.18] tracking-tight">
              Klaar voor het gesprek,{" "}
              <span className="italic font-medium" style={{ color: primary }}>{row.company_name}?</span>
            </h2>
            <p className="text-base md:text-lg leading-relaxed abm-muted max-w-[560px]">
              Wij bouwen niet voor leads. Wij bouwen een systeem dat elke maand sterker wordt. Geen losse campagne. Geen tool-stack. Een werkend brein dat blijft staan.
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-5">
              <Button asChild size="lg" style={brandBtn} className="shadow-lg">
                <a href={ctaUrl}>
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>

            {(contactName || contactPhone || contactEmail) && (
              <div className="mt-6 pt-6 border-t text-sm abm-muted" style={{ borderColor }}>
                {contactName && <span className="block font-medium" style={{ color: textColor }}>{contactName}</span>}
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1">
                  {contactPhone && <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="hover:underline">{contactPhone}</a>}
                  {contactEmail && <a href={`mailto:${contactEmail}`} className="hover:underline">{contactEmail}</a>}
                </div>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AbmPage;
