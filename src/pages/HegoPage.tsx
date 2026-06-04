import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Download, FileText, Radar, Database, Send, Workflow, Sparkles, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { supabase } from "@/integrations/supabase/client";
import { faviconFor } from "@/data/groeistack";
import CtaLink from "@/components/CtaLink";
import pdfAsset from "@/assets/hego-playbook.pdf.asset.json";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

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

interface ClientLogo {
  id: string;
  name: string;
  domain: string;
  logo_url: string | null;
  scale: number;
  padding: number;
  website: string | null;
}

const ClientBadge = ({ c }: { c: ClientLogo }) => {
  const [err, setErr] = useState(false);
  const src = c.logo_url || faviconFor(c.website || c.domain);
  return (
    <div className="flex items-center justify-center h-16 w-32 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition">
      {err || !src ? (
        <span className="font-display font-bold text-foreground/60">{c.name}</span>
      ) : (
        <img
          src={src}
          alt={c.name}
          className="object-contain max-h-12 max-w-full"
          style={{ transform: `scale(${c.scale ?? 1})`, padding: c.padding ?? 0 }}
          loading="lazy"
          onError={() => setErr(true)}
        />
      )}
    </div>
  );
};

const HegoPage = () => {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [viewerWidth, setViewerWidth] = useState(900);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const p1 = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const p2 = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const p3 = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const p4 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const p5 = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

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

  useEffect(() => {
    supabase
      .from("client_logos")
      .select("id, name, domain, logo_url, scale, padding, website")
      .eq("is_visible", true)
      .order("sort_order")
      .limit(12)
      .then(({ data }) => setClients((data as ClientLogo[]) ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero — Gemini-style scroll-driven flowlines */}
      <section
        ref={heroRef}
        className="relative h-[200vh] border-b border-border bg-background overflow-clip"
      >
        <div
          className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${HEGO.primary} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${HEGO.primaryGlow} 0%, transparent 70%)` }}
        />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="pt-28 md:pt-32 flex justify-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: `${HEGO.primary}1F`, color: HEGO.primaryGlow, border: `1px solid ${HEGO.primary}55` }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: HEGO.primaryGlow }} />
              HEGO × B2BGROEIMACHINE
            </div>
          </div>
          <GoogleGeminiEffect
            pathLengths={[p1, p2, p3, p4, p5]}
            title="Uw partner in RVS en aluminium. Snel geleverd, perfect op maat."
            description="Persoonlijk Market Activation Playbook voor HEGO. Hoe wij groothandel, traders, fabrikanten en metaalbewerkers activeren rond uw voorraad en maatwerk capaciteit."
            colors={[HEGO.primary, HEGO.primaryGlow, "#4FABFF", HEGO.silver, "#8FB8FE"]}
            ctaLabel="Bekijk het playbook"
            ctaHref="#playbook"
          />
        </div>
      </section>

      {/* PDF viewer */}
      <section id="playbook" className="py-16 md:py-24 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="font-display text-xs tracking-[0.2em] uppercase mb-3" style={{ color: HEGO.primaryGlow }}>
              Market Activation Playbook
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              Speciaal samengesteld voor HEGO.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Het volledige playbook. Onze analyse, aanpak en eerste plan voor HEGO. Doorbladeren kan hieronder of download
              de PDF.
            </p>
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
              <div ref={viewerRef} className="bg-[#1a1a1a] flex flex-col items-center p-4 md:p-6 min-h-[60vh]">
                <Document
                  file={pdfAsset.url}
                  onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                  loading={<div className="text-muted-foreground py-20">Playbook laden…</div>}
                  error={<div className="text-muted-foreground py-20">PDF kon niet geladen worden. <a href={pdfAsset.url} className="underline" style={{ color: HEGO.primaryGlow }}>Download hier</a>.</div>}
                >
                  <Page
                    pageNumber={page}
                    width={viewerWidth}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="shadow-2xl rounded-md overflow-hidden"
                  />
                </Document>
                {numPages > 0 && (
                  <div className="flex items-center gap-4 mt-5">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Playbook sections */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="font-display text-xs tracking-[0.2em] uppercase mb-3" style={{ color: HEGO.primaryGlow }}>
              Wat staat erin
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              Vijf hoofdstukken. Eén concrete route naar nieuwe offertes.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {playbookSections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card/40 p-6 hover:border-foreground/20 transition"
              >
                <div
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-white font-bold text-sm mb-4"
                  style={{ background: `linear-gradient(135deg, ${HEGO.primary}, ${HEGO.primaryGlow})` }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-14 rounded-2xl border border-border bg-card/40 p-6 md:p-8">
            <p className="font-display text-xs tracking-[0.2em] uppercase mb-3" style={{ color: HEGO.primaryGlow }}>
              Producten & diensten in scope
            </p>
            <div className="flex flex-wrap gap-2">
              {productsServices.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border"
                  style={{ borderColor: `${HEGO.primary}55`, color: "hsl(var(--foreground))", backgroundColor: `${HEGO.primary}10` }}
                >
                  <Check className="h-3.5 w-3.5" style={{ color: HEGO.primaryGlow }} />
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client logos */}
      {clients.length > 0 && (
        <section className="py-14 border-b border-border bg-card/20">
          <div className="container mx-auto px-4 md:px-6">
            <p className="text-center font-display text-xs tracking-[0.25em] uppercase text-muted-foreground mb-8">
              Vertrouwd door industriële B2B-spelers
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {clients.map((c) => (
                <ClientBadge key={c.id} c={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mini Groeistack */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="font-display text-xs tracking-[0.2em] uppercase mb-3" style={{ color: HEGO.primaryGlow }}>
              De Groeistack
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              Het systeem achter het playbook.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Zes lagen. Geen losse tools. Eén machine die signalen omzet in offertes voor HEGO.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {groeistackLayers.map((l) => {
              const Icon = l.icon;
              return (
                <div key={l.title} className="rounded-xl border border-border bg-card/40 p-5">
                  <div
                    className="inline-flex items-center justify-center h-10 w-10 rounded-lg mb-3"
                    style={{ backgroundColor: `${HEGO.primary}1F`, color: HEGO.primaryGlow }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-semibold text-base mb-1">{l.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{l.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${HEGO.primary}40 0%, transparent 70%)` }}
        />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
              Klaar om dit voor HEGO
              <br />
              <span style={{ color: HEGO.primaryGlow }}>in te richten?</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              We lopen het playbook samen door. U bepaalt wat er als eerste live gaat.
            </p>
            <Button asChild size="lg" style={{ backgroundColor: HEGO.primary }} className="text-white hover:opacity-90">
              <CtaLink intent="gratisScan" location="HEGO Page CTA" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HegoPage;