import { useEffect, useState, type CSSProperties } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Target, Map, Database, Megaphone, Route, BarChart3, Users, Radio, Award, Shield } from "lucide-react";
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
  const textColor: string = branding.text || "#F5F7FB";
  const mutedColor: string = branding.muted || "#9AA5BD";
  const borderColor: string = branding.border || `${textColor}1A`;
  const headingFont: string | undefined = branding.headingFont;
  const bodyFont: string | undefined = branding.bodyFont;
  const radius: string = branding.radius === "sm" ? "0.375rem" : branding.radius === "md" ? "0.625rem" : branding.radius === "xl" ? "1.25rem" : "0.875rem";
  const logoUrl: string | undefined = branding.logoLight || branding.logo || branding.logoUrl;
  const heroImage: string | undefined = hero.image || p.imageUrl || p.heroImage;
  const assets = p.assets || branding.assets || {};
  const observationImage: string | undefined = assets.observations || assets.observation;
  const ctaImage: string | undefined = assets.cta;

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
      `}</style>
      {/* Top bar */}
      <header className="border-b backdrop-blur sticky top-0 z-30" style={{ backgroundColor: `${surfaceColor}CC`, borderColor }}>
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={row.company_name} className="h-7 w-auto" />
            ) : (
              <span className="font-display font-semibold" style={{ color: primary }}>{row.company_name}</span>
            )}
            <span className="text-xs text-muted-foreground hidden sm:inline">× B2BGroeiMachine</span>
          </div>
          <Button asChild size="sm" style={brandBtn}>
            <a href={ctaUrl}>{ctaLabel}</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(60% 60% at 0% 0%, ${primary}1A, transparent 70%)` }} />
        {heroImage && (
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-luminosity">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="container mx-auto px-6 py-16 md:py-24 relative grid lg:grid-cols-12 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.2em] mb-4" style={{ color: primary }}>{eyebrow}</p>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight mb-5">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-2xl mb-6" style={{ color: primary }}>{subtitle}</p>
            )}
            {intro && (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">{intro}</p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" style={brandBtn}>
                <a href={ctaUrl}>{ctaLabel} <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </motion.div>
          {highlights.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-card p-6 md:p-7" style={{ borderColor: `${primary}33` }}>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
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
            </motion.div>
          )}
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