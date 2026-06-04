import { useEffect, useRef, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Download, FileText, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, RotateCcw, BookOpenCheck,
  Compass, Brain, Filter, Calculator, Layers, Send as SendIcon, Route, LineChart,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WaitlistHero } from "@/components/ui/waitlist-hero";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, trackCTA, trackScrollDepth, stopScrollDepth, startTimeOnPage, flushTimeOnPage } from "@/lib/tracking";
import { FrostedGlassCard } from "@/components/ui/interactive-frosted-glass-card";
import { BentoGrid } from "@/components/ui/bento-grid";
import { COPY } from "@/content/copy";
import PricingSection from "@/components/PricingSection";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ClientRow {
  slug: string;
  company_name: string;
  pdf_url: string | null;
  logo_url: string | null;
  brand_primary_hex: string | null;
  brand_glow_hex: string | null;
  brand_primary_hsl: string | null;
  brand_glow_hsl: string | null;
  hero_headline: string | null;
  hero_subline: string | null;
  intro: string | null;
  status: string;
  expires_at: string;
}

const sb = supabase as unknown as { from: (t: string) => any; rpc: (n: string, a?: any) => any };

// Lighten an HSL string ("H S% L%") by adding to L (clamped).
function hslWith(hsl: string, deltaL = 0, satMul = 1): string {
  const m = hsl.match(/^(\d+)\s+(\d+)%\s+(\d+)%$/);
  if (!m) return hsl;
  const h = parseInt(m[1], 10);
  const s = Math.min(100, Math.max(0, Math.round(parseInt(m[2], 10) * satMul)));
  const l = Math.min(95, Math.max(5, parseInt(m[3], 10) + deltaL));
  return `${h} ${s}% ${l}%`;
}

const ClientPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [row, setRow] = useState<ClientRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [viewerWidth, setViewerWidth] = useState(900);
  const [zoom, setZoom] = useState(1);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await sb
        .from("abm_pages")
        .select("slug, company_name, pdf_url, logo_url, brand_primary_hex, brand_glow_hex, brand_primary_hsl, brand_glow_hsl, hero_headline, hero_subline, intro, status, expires_at")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setRow(data as ClientRow);
      setLoading(false);
      sb.rpc("increment_abm_view", { _slug: slug }).then(() => {}, () => {});
      // Generate signed URL for private bucket
      const rawUrl: string | null = (data as ClientRow).pdf_url;
      if (rawUrl) {
        const marker = "/abm-assets/";
        const idx = rawUrl.indexOf(marker);
        const path = idx >= 0 ? rawUrl.substring(idx + marker.length) : rawUrl;
        const { data: signed } = await supabase.storage
          .from("abm-assets")
          .createSignedUrl(path, 60 * 60 * 24);
        if (!cancelled && signed?.signedUrl) setSignedPdfUrl(signed.signedUrl);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    const update = () => {
      if (viewerRef.current) {
        setViewerWidth(Math.min(viewerRef.current.clientWidth - 32, 1100));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  usePageMeta({
    title: row ? `${row.company_name} × B2BGroeiMachine — Market Activation Playbook` : "B2BGroeiMachine",
    description: row?.intro || `Persoonlijk playbook voor ${row?.company_name || "uw bedrijf"}.`,
    canonical: row ? `https://b2bgroeimachine.io/voor/${row.slug}` : undefined,
  });

  useEffect(() => {
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex, nofollow";
    document.head.appendChild(tag);
    return () => { document.head.removeChild(tag); };
  }, []);

  useEffect(() => {
    if (!slug) return;
    trackEvent("client_page_view", "client_page", slug, { client_slug: slug, path: `/voor/${slug}` });
    startTimeOnPage(`/voor/${slug}`);
    trackScrollDepth();
    return () => { flushTimeOnPage(); stopScrollDepth(); };
  }, [slug]);

  useEffect(() => {
    if (!slug || page <= 1) return;
    trackEvent("client_pdf_page_view", "client_page", slug, { client_slug: slug, pdf_page: page });
  }, [page, slug]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (notFound || !row) return <Navigate to="/404" replace />;
  if (row.status !== "live" || new Date(row.expires_at) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-display mb-3">Deze pagina is verlopen</h1>
          <p className="text-muted-foreground mb-6">De pagina voor {row.company_name} is niet meer actief.</p>
          <a href="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Neem contact op</a>
        </div>
      </div>
    );
  }

  const primaryHex = row.brand_primary_hex || "#0F4C75";
  const glowHex = row.brand_glow_hex || "#3282B8";
  const primaryHsl = row.brand_primary_hsl || "208 78% 26%";
  const glowHsl = row.brand_glow_hsl || "203 56% 46%";
  const brandClass = `client-brand-${row.slug}`;
  const pdfUrl = signedPdfUrl || row.pdf_url;
  const headline = row.hero_headline || "Slimmer werken door";
  const subline = row.hero_subline || "automatiseren van handmatige acties.";
  const introText = row.intro || `Persoonlijk Market Activation Playbook voor ${row.company_name}.`;

  // Dynamic per-client CSS — mirrors the .hego-brand / .sealeco-brand pattern in index.css.
  const brandCss = `
    .${brandClass} .text-gradient {
      background-image: linear-gradient(135deg, hsl(${primaryHsl}), hsl(${glowHsl}));
    }
    .${brandClass} .glow-bg {
      background:
        radial-gradient(ellipse 800px 500px at 50% 0%, hsl(${primaryHsl} / 0.10), transparent 70%),
        radial-gradient(ellipse 800px 500px at 50% 100%, hsl(${glowHsl} / 0.08), transparent 70%);
    }
    .${brandClass} #pricing .rounded-2xl,
    .${brandClass} #pricing .rounded-xl {
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      background: linear-gradient(135deg, hsl(var(--foreground) / 0.08), hsl(var(--foreground) / 0.02));
      border-color: hsl(var(--foreground) / 0.15);
      box-shadow: inset 0 1px 0 hsl(var(--foreground) / 0.12), 0 20px 60px -20px hsl(${hslWith(primaryHsl, -10)} / 0.45);
    }
    .${brandClass} #pricing .rounded-2xl:hover,
    .${brandClass} #pricing .rounded-xl:hover {
      border-color: hsl(${glowHsl} / 0.5);
    }
    .${brandClass} #pricing .border-primary\\/40.bg-primary\\/5,
    .${brandClass} #pricing .border-primary\\/40.bg-primary\\/10 {
      background: linear-gradient(135deg, hsl(${primaryHsl} / 0.18), hsl(${glowHsl} / 0.06));
      border-color: hsl(${glowHsl} / 0.5);
      box-shadow: inset 0 1px 0 hsl(var(--foreground) / 0.15), 0 0 50px -10px hsl(${glowHsl} / 0.45);
    }
    .${brandClass} #pricing .text-primary,
    .${brandClass} #pricing .text-primary\\/80,
    .${brandClass} #pricing .text-primary\\/90 {
      color: hsl(${hslWith(glowHsl, 15)});
    }
  `;

  const SILVER = "#B8C7BC";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style dangerouslySetInnerHTML={{ __html: brandCss }} />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center border-b border-border bg-background overflow-hidden">
        <div
          className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${primaryHex} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${glowHex} 0%, transparent 70%)` }}
        />

        <svg
          width="1440" height="890" viewBox="0 0 1440 890"
          xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-70" aria-hidden
        >
          {[
            { d: "M0 663C145.5 663 191 666.5 269 626C347 585.5 408.5 562.5 506.5 542.5C604.5 522.5 658 540 716 547C774 554 803.5 543.5 859 522.5C914.5 501.5 943 490.5 1024.5 490.5C1106 490.5 1168 535 1232.5 543C1297 551 1361 547 1440 547", color: primaryHex, delay: 0 },
            { d: "M0 587C147.5 587 145.5 587 224 587C302.5 587 351 591 419 571C487 551 543 521 615 521C687 521 729 543 791 561C853 579 893 593 977 575C1061 557 1099 511 1170 491C1241 471 1301 503 1440 503", color: glowHex, delay: 0.15 },
            { d: "M0 514C147.5 514 195.5 514 274 514C352.5 514 395 514 478 514C561 514 593 528 671 528C749 528 802 510 880 510C958 510 1011 528 1089 528C1167 528 1212 514 1290 514C1368 514 1364.5 514 1440 514", color: "#4FABFF", delay: 0.3 },
            { d: "M0 438C147.5 438 145.5 438 224 438C302.5 438 351 438 419 458C487 478 543 508 615 508C687 508 729 486 791 468C853 450 893 436 977 454C1061 472 1099 518 1170 538C1241 558 1301 526 1440 526", color: SILVER, delay: 0.45 },
            { d: "M0 364C145.5 364 191 360.5 269 401C347 441.5 408.5 464.5 506.5 484.5C604.5 504.5 658 487 716 480C774 473 803.5 483.5 859 504.5C914.5 525.5 943 536.5 1024.5 536.5C1106 536.5 1168 492 1232.5 484C1297 476 1361 480 1440 480", color: "#8FB8FE", delay: 0.6 },
          ].map((p, i) => (
            <motion.path key={i} d={p.d} stroke={p.color} strokeWidth={2} fill="none"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 2.6, delay: p.delay, ease: "easeInOut" }}
            />
          ))}
        </svg>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto">
            {row.logo_url && (
              <div className="relative mb-6 inline-flex items-center justify-center -mt-16 md:-mt-24">
                <div aria-hidden className="absolute inset-0 -mx-8 -my-6 rounded-3xl backdrop-blur-2xl border"
                  style={{
                    background: `radial-gradient(130% 130% at 30% 20%, hsl(var(--foreground) / 0.95) 0%, hsl(var(--foreground) / 0.85) 45%, hsl(var(--foreground) / 0.7) 100%)`,
                    borderColor: `hsl(var(--foreground) / 0.6)`,
                    boxShadow: `inset 0 1px 0 hsl(0 0% 100% / 0.6), inset 0 -1px 0 hsl(var(--foreground) / 0.2), 0 30px 80px -20px ${primaryHex}99`,
                  }}
                />
                <div aria-hidden className="absolute inset-0 -mx-8 -my-6 rounded-3xl pointer-events-none"
                  style={{ background: `linear-gradient(135deg, hsl(0 0% 100% / 0.5) 0%, transparent 40%, transparent 60%, hsl(0 0% 100% / 0.2) 100%)`, mixBlendMode: "overlay" }}
                />
                <img src={row.logo_url} alt={`${row.company_name} logo`}
                  className="relative h-16 md:h-20 w-auto object-contain drop-shadow-lg" />
              </div>
            )}
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl tracking-tight leading-[1.05] mb-6">
              {headline}
              <br />
              <span style={{ color: glowHex }}>{subline}</span>
            </h1>
            <FrostedGlassCard
              className="max-w-2xl 2xl:max-w-4xl 3xl:max-w-5xl mb-8"
              background={`linear-gradient(135deg, hsl(var(--foreground) / 0.10), hsl(var(--foreground) / 0.02))`}
              borderColor={`hsl(var(--foreground) / 0.18)`}
              glareColor={`${glowHex}66`}
              style={{ boxShadow: `inset 0 1px 0 hsl(var(--foreground) / 0.15), 0 20px 60px -20px ${primaryHex}66` }}
            >
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed px-6 py-5">{introText}</p>
            </FrostedGlassCard>
            {pdfUrl && (
              <a href="#playbook" className="inline-flex items-center gap-2 font-semibold text-sm md:text-base rounded-full px-6 py-3 hover:opacity-90 transition"
                style={{ backgroundColor: glowHex, color: primaryHex }}>
                Bekijk het playbook <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* PDF viewer */}
      {pdfUrl && (
        <section id="playbook" className="min-h-screen flex items-center py-16 md:py-24 bg-card/30 border-b border-border">
          <div className="container mx-auto px-4 md:px-6 w-full">
            <div className="max-w-3xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto text-center mb-10">
              <p className="font-display text-xs tracking-[0.2em] uppercase mb-3" style={{ color: glowHex }}>
                Market Activation Playbook
              </p>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl tracking-tight leading-[1.05] mb-4">
                Speciaal samengesteld
                <br />
                <span style={{ color: glowHex }}>voor {row.company_name}.</span>
              </h2>
              <FrostedGlassCard
                className="max-w-2xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto"
                background={`linear-gradient(135deg, hsl(var(--foreground) / 0.10), hsl(var(--foreground) / 0.02))`}
                borderColor={`hsl(var(--foreground) / 0.18)`}
                glareColor={`${glowHex}66`}
                style={{ boxShadow: `inset 0 1px 0 hsl(var(--foreground) / 0.15), 0 20px 60px -20px ${primaryHex}66` }}
              >
                <p className="text-base md:text-lg text-foreground/90 leading-relaxed px-6 py-5">
                  Het volledige playbook. Onze analyse, aanpak en eerste plan voor {row.company_name}. Doorbladeren kan hieronder of download de PDF.
                </p>
              </FrostedGlassCard>
            </div>

            <div className="relative max-w-5xl 2xl:max-w-7xl 3xl:max-w-[1600px] mx-auto">
              <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-30 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${primaryHex}, ${glowHex})` }} />
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-background">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/60">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4" style={{ color: glowHex }} />
                    {row.company_name}_Playbook.pdf
                  </div>
                  <a href={pdfUrl} download
                    onClick={() => trackCTA(`${row.slug}_playbook_download`, pdfUrl)}
                    className="text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-80"
                    style={{ color: glowHex }}>
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                </div>
                <div ref={viewerRef} className="bg-[#1a1a1a] flex flex-col items-center p-4 md:p-6 min-h-[60vh] overflow-auto">
                  <Document file={pdfUrl}
                    onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                    loading={<div className="text-muted-foreground py-20">Playbook laden…</div>}
                    error={<div className="text-muted-foreground py-20">PDF kon niet geladen worden. <a href={pdfUrl} className="underline" style={{ color: glowHex }}>Download hier</a>.</div>}
                  >
                    <Page pageNumber={page} width={viewerWidth * zoom}
                      renderAnnotationLayer={false} renderTextLayer={false}
                      className="shadow-2xl rounded-md overflow-hidden" />
                  </Document>
                  {numPages > 0 && (
                    <div className="flex items-center gap-3 mt-5 flex-wrap justify-center">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border disabled:opacity-30 hover:border-foreground/40 transition" aria-label="Vorige pagina">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium tabular-nums">{page} / {numPages}</span>
                      <button onClick={() => setPage((p) => Math.min(numPages, p + 1))} disabled={page >= numPages}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border disabled:opacity-30 hover:border-foreground/40 transition" aria-label="Volgende pagina">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} disabled={zoom <= 0.5}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border disabled:opacity-30 hover:border-foreground/40 transition" aria-label="Uitzoomen">
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium tabular-nums w-12 text-center">{Math.round(zoom * 100)}%</span>
                      <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} disabled={zoom >= 3}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border disabled:opacity-30 hover:border-foreground/40 transition" aria-label="Inzoomen">
                        <ZoomIn className="h-4 w-4" />
                      </button>
                      <button onClick={() => setZoom(1)} disabled={zoom === 1}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border disabled:opacity-30 hover:border-foreground/40 transition" aria-label="Reset zoom">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8 playbooks bento */}
      <section className="min-h-screen flex items-center py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto text-center mb-12">
            <p className="inline-flex items-center justify-center gap-2 font-display font-semibold text-xs tracking-[0.2em] uppercase mb-4" style={{ color: glowHex }}>
              <BookOpenCheck className="w-4 h-4" strokeWidth={1.8} />
              Het Playbook-systeem
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl tracking-tight leading-[1.05] mb-6">
              Acht playbooks.
              <br />
              <span style={{ color: glowHex }}>Eén werkend groeisysteem voor {row.company_name}.</span>
            </h2>
            <FrostedGlassCard
              className="max-w-2xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto"
              background={`linear-gradient(135deg, hsl(var(--foreground) / 0.10), hsl(var(--foreground) / 0.02))`}
              borderColor={`hsl(var(--foreground) / 0.18)`}
              glareColor={`${glowHex}66`}
              style={{ boxShadow: `inset 0 1px 0 hsl(var(--foreground) / 0.15), 0 20px 60px -20px ${primaryHex}66` }}
            >
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed px-6 py-5">
                Elke fase is een playbook dat in uw eigen tools draait. Samen vormen ze één werkend groeisysteem dat blijft staan.
              </p>
            </FrostedGlassCard>
          </div>

          {(() => {
            const icons = [Compass, Brain, Filter, Calculator, Layers, SendIcon, Route, LineChart];
            const phases = ["Fundament", "Fundament", "Doelgroep", "Doelgroep", "Activatie", "Activatie", "Sales", "Optimalisatie"];
            const baseItems = COPY.methode.layers.map((l, i) => {
              const Icon = icons[i];
              return {
                title: `${l.number} · ${l.title}`,
                description: l.line,
                icon: <Icon className="w-5 h-5" strokeWidth={1.6} />,
                status: `Playbook · ${phases[i]}`,
                tags: [l.output.replace(/^U krijgt:\s*/i, "").replace(/\.$/, "")],
                colSpan: i === 0 ? 2 : 1,
                hasPersistentHover: i === 0,
                featured: true,
              };
            });
            return <BentoGrid accent={glowHex} items={baseItems} />;
          })()}
        </div>
      </section>

      {/* Pricing — branded */}
      <div
        className={brandClass}
        style={{
          ["--primary" as any]: glowHsl,
          ["--primary-foreground" as any]: primaryHsl,
        }}
      >
        <PricingSection />
      </div>

      <div className="min-h-screen flex items-center">
        <div className="w-full">
          <WaitlistHero
            logoSrc={row.logo_url || undefined}
            logoAlt={`${row.company_name} logo`}
            accentColor={glowHex}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClientPage;