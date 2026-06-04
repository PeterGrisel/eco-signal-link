import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Download, FileText, Radar, Database, Send, Workflow, Sparkles, BarChart3, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WaitlistHero } from "@/components/ui/waitlist-hero";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import CtaLink from "@/components/CtaLink";
import pdfAsset from "@/assets/hego-playbook.pdf.asset.json";
import hegoLogo from "@/assets/hego-logo.png.asset.json";
import { FrostedGlassCard } from "@/components/ui/interactive-frosted-glass-card";
import { BentoGrid } from "@/components/ui/bento-grid";
import { COPY } from "@/content/copy";
import { Compass, Brain, Filter, Calculator, Layers, Send as SendIcon, Route, LineChart, BookOpenCheck } from "lucide-react";

// Configure pdf.js worker from CDN (matches installed pdfjs-dist version)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// HEGO brand palette (from JSON: blue, grey, white, metallic silver)
const HEGO = {
  primary: "#003E7E", // industrial HEGO blue
  primaryGlow: "#1E6FBF",
  silver: "#B8C2CC",
  surface: "#0B1B33",
};

const playbookSections = [
  { title: "Onze Expertise", desc: "Hoe we RVS- en aluminiumkopers vinden voordat ze actief zoeken." },
  { title: "Maatwerk Bewerkingen", desc: "Signalen rond lasersnijden, ponsen, slijpen en borstelen." },
  { title: "Direct uit Voorraad", desc: "Inzicht in voorraadbehoefte van groothandel en producenten." },
  { title: "Waarom HEGO", desc: "Positionering ten opzichte van wederverkopers en service centers." },
  { title: "Vraag een Offerte aan", desc: "Conversiepaden naar snelle offerte en eerste levering." },
];

const productsServices = [
  "RVS platen & coils",
  "Aluminium platen & coils",
  "Buizen & kokers",
  "Stafmateriaal",
  "Slijpen en borstelen",
  "Lasersnijden",
  "Ponsen en knippen",
  "Foxinox RVS Service Center",
];

const groeistackLayers = [
  { icon: Radar, title: "Signalen & data", desc: "Intent rond RVS, aluminium en metaalbewerking." },
  { icon: Database, title: "Verrijking", desc: "Inkopers, technici en eigenaren verrijkt en geverifieerd." },
  { icon: Send, title: "Outreach", desc: "E-mail, LinkedIn en telefoon in één flow." },
  { icon: Workflow, title: "CRM & pijplijn", desc: "Strak CRM met heldere offertestromen." },
  { icon: Sparkles, title: "AI & content", desc: "Persoonlijke content per segment en sector." },
  { icon: BarChart3, title: "Dashboard", desc: "Eén bron van waarheid met lerende loops." },
];

const HegoPage = () => {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [viewerWidth, setViewerWidth] = useState(900);
  const [zoom, setZoom] = useState(1);
  const viewerRef = useRef<HTMLDivElement | null>(null);

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
    title: "HEGO × B2BGroeiMachine — Market Activation Playbook",
    description:
      "Persoonlijk playbook voor HEGO: hoe wij groothandel, traders en producenten activeren rond RVS, aluminium en maatwerk bewerkingen.",
    canonical: "https://b2bgroeimachine.io/voor/hego",
  });

  useEffect(() => {
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex, nofollow";
    document.head.appendChild(tag);
    return () => {
      document.head.removeChild(tag);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero — Gemini-style scroll-driven flowlines */}
      <section
        className="relative min-h-screen flex items-center border-b border-border bg-background overflow-hidden"
      >
        <div
          className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${HEGO.primary} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${HEGO.primaryGlow} 0%, transparent 70%)` }}
        />

        {/* Gemini-style flowlines as background */}
        <svg
          width="1440"
          height="890"
          viewBox="0 0 1440 890"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
          aria-hidden
        >
          {[
            { d: "M0 663C145.5 663 191 666.5 269 626C347 585.5 408.5 562.5 506.5 542.5C604.5 522.5 658 540 716 547C774 554 803.5 543.5 859 522.5C914.5 501.5 943 490.5 1024.5 490.5C1106 490.5 1168 535 1232.5 543C1297 551 1361 547 1440 547", color: HEGO.primary, delay: 0 },
            { d: "M0 587C147.5 587 145.5 587 224 587C302.5 587 351 591 419 571C487 551 543 521 615 521C687 521 729 543 791 561C853 579 893 593 977 575C1061 557 1099 511 1170 491C1241 471 1301 503 1440 503", color: HEGO.primaryGlow, delay: 0.15 },
            { d: "M0 514C147.5 514 195.5 514 274 514C352.5 514 395 514 478 514C561 514 593 528 671 528C749 528 802 510 880 510C958 510 1011 528 1089 528C1167 528 1212 514 1290 514C1368 514 1364.5 514 1440 514", color: "#4FABFF", delay: 0.3 },
            { d: "M0 438C147.5 438 145.5 438 224 438C302.5 438 351 438 419 458C487 478 543 508 615 508C687 508 729 486 791 468C853 450 893 436 977 454C1061 472 1099 518 1170 538C1241 558 1301 526 1440 526", color: HEGO.silver, delay: 0.45 },
            { d: "M0 364C145.5 364 191 360.5 269 401C347 441.5 408.5 464.5 506.5 484.5C604.5 504.5 658 487 716 480C774 473 803.5 483.5 859 504.5C914.5 525.5 943 536.5 1024.5 536.5C1106 536.5 1168 492 1232.5 484C1297 476 1361 480 1440 480", color: "#8FB8FE", delay: 0.6 },
          ].map((p, i) => (
            <motion.path
              key={i}
              d={p.d}
              stroke={p.color}
              strokeWidth={2}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 2.6, delay: p.delay, ease: "easeInOut" }}
            />
          ))}
        </svg>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="relative mb-6 inline-flex items-center justify-center -mt-16 md:-mt-24">
              {/* Liquid glass backdrop - brighter for contrast */}
              <div
                aria-hidden
                className="absolute inset-0 -mx-8 -my-6 rounded-3xl backdrop-blur-2xl border"
                style={{
                  background: `radial-gradient(130% 130% at 30% 20%, hsl(var(--foreground) / 0.95) 0%, hsl(var(--foreground) / 0.85) 45%, hsl(var(--foreground) / 0.7) 100%)`,
                  borderColor: `hsl(var(--foreground) / 0.6)`,
                  boxShadow: `inset 0 1px 0 hsl(0 0% 100% / 0.6), inset 0 -1px 0 hsl(var(--foreground) / 0.2), 0 30px 80px -20px ${HEGO.primary}99`,
                }}
              />
              {/* Specular highlight */}
              <div
                aria-hidden
                className="absolute inset-0 -mx-8 -my-6 rounded-3xl pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, hsl(0 0% 100% / 0.5) 0%, transparent 40%, transparent 60%, hsl(0 0% 100% / 0.2) 100%)`,
                  mixBlendMode: "overlay",
                }}
              />
              <img
                src={hegoLogo.url}
                alt="HEGO logo"
                className="relative h-16 md:h-20 w-auto object-contain drop-shadow-lg"
                width={512}
                height={512}
              />
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-6">
              Slimmer werken door
              <br />
              <span style={{ color: HEGO.primaryGlow }}>automatiseren van handmatige acties.</span>
            </h1>
            <FrostedGlassCard
              className="max-w-2xl mb-8"
              background={`linear-gradient(135deg, hsl(var(--foreground) / 0.10), hsl(var(--foreground) / 0.02))`}
              borderColor={`hsl(var(--foreground) / 0.18)`}
              glareColor={`${HEGO.primaryGlow}66`}
              style={{
                boxShadow: `inset 0 1px 0 hsl(var(--foreground) / 0.15), 0 20px 60px -20px ${HEGO.primary}66`,
              }}
            >
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed px-6 py-5">
                Persoonlijk Market Activation Playbook voor HEGO. Hoe wij groothandel, traders, fabrikanten en metaalbewerkers activeren rond uw voorraad en maatwerk capaciteit.
              </p>
            </FrostedGlassCard>
            <a
              href="#playbook"
              className="inline-flex items-center gap-2 font-semibold text-sm md:text-base rounded-full px-6 py-3 text-white hover:opacity-90 transition"
              style={{ backgroundColor: HEGO.primary }}
            >
              Bekijk het playbook <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* PDF viewer */}
      <section id="playbook" className="min-h-screen flex items-center py-16 md:py-24 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="font-display text-xs tracking-[0.2em] uppercase mb-3" style={{ color: HEGO.primaryGlow }}>
              Market Activation Playbook
            </p>
            <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-4">
              Speciaal samengesteld
              <br />
              <span style={{ color: HEGO.primaryGlow }}>voor HEGO.</span>
            </h2>
            <FrostedGlassCard
              className="max-w-2xl mx-auto"
              background={`linear-gradient(135deg, hsl(var(--foreground) / 0.10), hsl(var(--foreground) / 0.02))`}
              borderColor={`hsl(var(--foreground) / 0.18)`}
              glareColor={`${HEGO.primaryGlow}66`}
              style={{
                boxShadow: `inset 0 1px 0 hsl(var(--foreground) / 0.15), 0 20px 60px -20px ${HEGO.primary}66`,
              }}
            >
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed px-6 py-5">
                Het volledige playbook. Onze analyse, aanpak en eerste plan voor HEGO. Doorbladeren kan hieronder of download de PDF.
              </p>
            </FrostedGlassCard>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-30 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${HEGO.primary}, ${HEGO.primaryGlow})` }}
            />
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-background">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/60">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" style={{ color: HEGO.primaryGlow }} />
                  HEGO_Market_Activation_Playbook.pdf
                </div>
                <a
                  href={pdfAsset.url}
                  download
                  className="text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-80"
                  style={{ color: HEGO.primaryGlow }}
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
              <div ref={viewerRef} className="bg-[#1a1a1a] flex flex-col items-center p-4 md:p-6 min-h-[60vh] overflow-auto">
                <Document
                  file={pdfAsset.url}
                  onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                  loading={<div className="text-muted-foreground py-20">Playbook laden…</div>}
                  error={<div className="text-muted-foreground py-20">PDF kon niet geladen worden. <a href={pdfAsset.url} className="underline" style={{ color: HEGO.primaryGlow }}>Download hier</a>.</div>}
                >
                  <Page
                    pageNumber={page}
                    width={viewerWidth * zoom}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="shadow-2xl rounded-md overflow-hidden"
                  />
                </Document>
                {numPages > 0 && (
                  <div className="flex items-center gap-3 mt-5 flex-wrap justify-center">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border disabled:opacity-30 hover:border-foreground/40 transition"
                      aria-label="Vorige pagina"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium tabular-nums">
                      {page} / {numPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(numPages, p + 1))}
                      disabled={page >= numPages}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border disabled:opacity-30 hover:border-foreground/40 transition"
                      aria-label="Volgende pagina"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <button
                      onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                      disabled={zoom <= 0.5}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border disabled:opacity-30 hover:border-foreground/40 transition"
                      aria-label="Uitzoomen"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium tabular-nums w-12 text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                      disabled={zoom >= 3}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border disabled:opacity-30 hover:border-foreground/40 transition"
                      aria-label="Inzoomen"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      disabled={zoom === 1}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border disabled:opacity-30 hover:border-foreground/40 transition"
                      aria-label="Reset zoom"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 playbooks — bento grid in HEGO brandkleur */}
      <section className="min-h-screen flex items-center py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 w-full">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p
              className="inline-flex items-center justify-center gap-2 font-display font-semibold text-xs tracking-[0.2em] uppercase mb-4"
              style={{ color: HEGO.primaryGlow }}
            >
              <BookOpenCheck className="w-4 h-4" strokeWidth={1.8} />
              Het Playbook-systeem
            </p>
            <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-6">
              Acht playbooks.
              <br />
              <span style={{ color: HEGO.primaryGlow }}>Eén werkend groeisysteem voor HEGO.</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Elke fase is een playbook dat in uw eigen tools draait. Samen vormen ze één werkend groeisysteem dat blijft staan.
            </p>
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
            return (
              <BentoGrid
                accent={HEGO.primaryGlow}
                items={baseItems}
              />
            );
          })()}
        </div>
      </section>

      <div className="min-h-screen flex items-center">
        <div className="w-full">
          <WaitlistHero logoSrc={hegoLogo.url} logoAlt="HEGO logo" />
        </div>
      </div>

      <Footer />

    </div>
  );
};

export default HegoPage;