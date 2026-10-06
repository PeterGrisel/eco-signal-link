import { useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { z } from "zod";
import PageLoader from "@/components/PageLoader";
import { Container } from "@/components/v2/Container";
import { Footer } from "@/components/v2/Footer";
import { Nav } from "@/components/v2/Nav";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { Button as V2Button } from "@/components/v2/Button";
import { GROEIPLAN_STAPPEN } from "@/data/breinAanpak";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Download, FileText, Loader2, Calendar, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { BOOKING_URL } from "@/content/copy";

type Cell = {
  id: string;
  num: string;
  title: string;
  prompt: string;
  phase: "voor" | "tijdens" | "na";
};

const CELLS: Cell[] = [
  { id: "doelmarkt",     num: "01", title: "Mijn doelmarkt",        prompt: "Wie is mijn ideale klant en wie nadrukkelijk niet?", phase: "voor" },
  { id: "boodschap",     num: "02", title: "Mijn boodschap",        prompt: "Welk probleem los ik op, in de woorden van mijn klant?", phase: "voor" },
  { id: "kanalen",       num: "03", title: "Mijn kanalen",          prompt: "Waar bereik ik mijn koper en in welke volgorde?", phase: "voor" },
  { id: "vangmechanisme",num: "04", title: "Mijn vangmechanisme",   prompt: "Hoe vang ik elke vorm van interesse?", phase: "tijdens" },
  { id: "opwarm",        num: "05", title: "Mijn opwarmsysteem",    prompt: "Hoe bouw ik vertrouwen op tot het koopmoment?", phase: "tijdens" },
  { id: "conversie",     num: "06", title: "Mijn conversiestrategie", prompt: "Hoe wordt een warm gesprek een getekende deal?", phase: "tijdens" },
  { id: "ervaring",      num: "07", title: "Mijn klantervaring",    prompt: "Hoe lever ik een ervaring die wordt doorverteld?", phase: "na" },
  { id: "waarde",        num: "08", title: "Mijn klantwaarde",      prompt: "Hoe groeit de waarde per klant, maand op maand?", phase: "na" },
  { id: "referral",      num: "09", title: "Mijn referralmotor",    prompt: "Hoe organiseer ik aanbevelingen, in plaats van erop te hopen?", phase: "na" },
];

const PHASE_LABEL: Record<Cell["phase"], { label: string; sub: string }> = {
  voor:    { label: "VOOR",    sub: "Prospect" },
  tijdens: { label: "TIJDENS", sub: "Lead" },
  na:      { label: "NA",      sub: "Klant" },
};

/**
 * Het leaky bucket-principe: waar interesse weglekt, per fase van het plan.
 * Afgeleid van de vragen in de vakken hierboven.
 */
const LEKKEN: { fase: string; kop: string; tekst: string }[] = [
  {
    fase: "Voor",
    kop: "Niemand haakt aan.",
    tekst: "Een te brede doelmarkt, een boodschap in uw eigen woorden in plaats van die van de klant, of de verkeerde kanalen.",
  },
  {
    fase: "Tijdens",
    kop: "Interesse koelt af.",
    tekst: "Een reactie of bezoek wordt niet gevangen, leads worden niet opgewarmd, of een warm gesprek wordt geen deal.",
  },
  {
    fase: "Na",
    kop: "U begint steeds opnieuw.",
    tekst: "Klanten groeien niet door en bevelen u niet aan. Elk jaar start de emmer weer leeg.",
  },
];

const emailSchema = z.string().trim().email("Ongeldig e-mailadres").max(255);

const GroeiplanInvullen = () => {
  usePageMeta({
    title: "Het 1-pagina groeiplan | B2B Groeimachine",
    description: "Negen vakken, drie fases: het hele commerciële verhaal van uw bedrijf op één A4. Vind waar uw commercie lekt. Vul het in en download het als PDF.",
    canonical: "https://www.b2bgroeimachine.io/groeiplan",
  });

  const [params] = useSearchParams();
  const isKlant = params.get("klant") === "1";
  const { toast } = useToast();

  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [values, setValues] = useState<Record<string, string>>(
    () => Object.fromEntries(CELLS.map((c) => [c.id, ""])),
  );
  const [downloading, setDownloading] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => ({
    voor: CELLS.filter((c) => c.phase === "voor"),
    tijdens: CELLS.filter((c) => c.phase === "tijdens"),
    na: CELLS.filter((c) => c.phase === "na"),
  }), []);

  /** Het groeiplan als Markdown, om als context aan een AI-assistent te geven. */
  const alsMarkdown = () => {
    const regels = [
      `# 1-pagina groeiplan${company ? `: ${company}` : ""}`,
      "",
      [name && `Opgesteld door ${name}`, new Date().toLocaleDateString("nl-NL")].filter(Boolean).join(" · "),
      "",
      "Negen vakken in drie fases: voor (prospect), tijdens (lead) en na (klant).",
    ];
    (["voor", "tijdens", "na"] as const).forEach((phase) => {
      regels.push("", `## ${PHASE_LABEL[phase].label.charAt(0)}${PHASE_LABEL[phase].label.slice(1).toLowerCase()} (${PHASE_LABEL[phase].sub})`);
      grouped[phase].forEach((cell) => {
        regels.push("", `### ${cell.num} ${cell.title}`, "", `*${cell.prompt}*`, "", values[cell.id].trim() || "_Nog niet ingevuld._");
      });
    });
    return regels.join("\n") + "\n";
  };

  const handleDownload = async (formaat: "pdf" | "md" = "pdf") => {
    if (!isKlant) {
      const r = emailSchema.safeParse(email);
      if (!r.success) {
        setEmailError(r.error.issues[0].message);
        return;
      }
    }
    setDownloading(true);
    try {
      // Save submission (best-effort)
      try {
        await supabase.from("groeiplan_submissions").insert({
          email: email || "klant@intern",
          company: company || null,
          name: name || null,
          mode: isKlant ? "klant" : "visitor",
          fields: values,
          source_url: typeof window !== "undefined" ? window.location.href : null,
        });
      } catch (e) {
        console.warn("Opslaan mislukt:", e);
      }

      const safeName = (company || "groeiplan").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      if (formaat === "md") {
        const blob = new Blob([alsMarkdown()], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `1-pagina-groeiplan-${safeName}.md`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Klaar", description: "Uw groeiplan is gedownload als Markdown." });
        setShowBooking(true);
        return;
      }

      const node = planRef.current;
      if (!node) return;
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      let w = pageW;
      let h = w / ratio;
      if (h > pageH) { h = pageH; w = h * ratio; }
      const x = (pageW - w) / 2;
      const y = (pageH - h) / 2;
      pdf.addImage(imgData, "PNG", x, y, w, h);
      pdf.save(`1-pagina-groeiplan-${safeName}.pdf`);
      toast({ title: "Klaar", description: "Uw groeiplan is gedownload." });
      setShowBooking(true);
    } catch (e) {
      console.error(e);
      toast({ title: "Er ging iets mis", description: "Probeer het opnieuw.", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <PageLoader>
    <div className="min-h-screen bg-brand-paper">
      <Nav />

      <main>
        {/* Hero */}
        <header className="bg-brand-deep text-white">
          <Container className="py-16 lg:py-24">
            <div className="v2-enter max-w-[46rem]">
              <p className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                [ Het groeiplan ]
              </p>
              <h1 className="mb-[22px] font-display text-[length:var(--v2-h1)] font-black leading-[1.02] tracking-[-0.035em]">
                Het 1-pagina <span className="text-brand-accent">groeiplan.</span>
              </h1>
              <p className="max-w-[56ch] text-[16.5px] leading-relaxed text-[#D6CEC3]">
                Negen vakken. Drie fases. Het hele commerciële verhaal van uw bedrijf op één A4. Hier begint elk
                traject.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <V2Button href="#invullen">Vul het groeiplan in</V2Button>
              </div>
            </div>
          </Container>
        </header>

        {/* Waarom een groeiplan: structuur */}
        <Section tone="paper" id="waarom">
          <SectionHeader
            eyebrow="Waarom een groeiplan"
            title="Eerst structuur. Dan pas tempo."
            lead="Zonder plan is commercie een verzameling losse acties: een campagne hier, een leadlijst daar. Het groeiplan zet alles op één pagina, in de volgorde waarin een klant bij u binnenkomt. Voor, tijdens en na. Zo ziet u in één oogopslag wat staat en wat nog ontbreekt."
          />
          <ol className="grid gap-[10px] md:grid-cols-3">
            {(["voor", "tijdens", "na"] as const).map((phase, i) => (
              <Reveal key={phase} index={i} className="h-full">
                <li className="flex h-full flex-col rounded-brand border border-brand-line bg-brand-mist px-5 py-5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                    {PHASE_LABEL[phase].label} · {PHASE_LABEL[phase].sub}
                  </span>
                  <ul className="mt-3 space-y-1.5 text-[14px]">
                    {grouped[phase].map((c) => (
                      <li key={c.id} className="flex gap-2">
                        <span className="font-mono text-[12px] font-bold text-brand-accent-ink">{c.num}</span>
                        <span>{c.title.replace(/^Mijn /, "")}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              </Reveal>
            ))}
          </ol>
        </Section>

        {/* Leaky bucket */}
        <Section tone="deep" id="lekke-emmer">
          <SectionHeader
            deep
            eyebrow="Het leaky bucket-principe"
            title="Een lekke emmer vult u niet door harder te gieten."
            lead="De reflex bij te weinig groei is meer leads. Maar als interesse onderweg weglekt, giet u alleen sneller water in een lekke emmer. Het groeiplan laat zien waar de emmer lekt. Eerst dichten, dan vullen."
          />
          <div className="grid gap-[10px] md:grid-cols-3">
            {LEKKEN.map((l, i) => (
              <Reveal key={l.fase} index={i} className="h-full">
                <div className="flex h-full flex-col rounded-brand border border-white/[.14] p-5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                    Lek {i + 1} · {l.fase}
                  </span>
                  <p className="mt-2 font-display text-lg font-bold">{l.kop}</p>
                  <p className="mt-1.5 text-[13.5px] text-[#A99F93]">{l.tekst}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Invullen */}
        <Section tone="mist" id="invullen">
          <SectionHeader
            eyebrow="Invullen"
            title="Vul uw groeiplan in."
            lead="Maak het, download het en plan een vrijblijvend adviesgesprek. Het formulier staat open: u kunt direct beginnen."
          />

          <ol className="mb-8 grid gap-[10px] sm:grid-cols-3">
            {GROEIPLAN_STAPPEN.map((st, n) => (
              <li key={st.stap} className="rounded-brand border border-brand-line bg-brand-paper px-5 py-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 font-display text-[15px] font-bold">{st.stap}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-brand-ink-2">{st.uitleg}</p>
              </li>
            ))}
          </ol>

          {/* Het plan, voor scherm en PDF */}
          <div className="overflow-x-auto">
            <div
              ref={planRef}
              className="rounded-brand border border-brand-line bg-white p-5 text-brand-ink sm:p-8 md:min-w-[1000px] md:p-12"
              style={{ width: "100%" }}
            >
              <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                Het B2B-groeiplan
              </div>
              <h2 className="mb-2 font-display text-4xl font-black tracking-[-0.03em] md:text-5xl">
                Het 1-pagina groeiplan.
              </h2>
              <p className="mb-8 text-brand-ink-3">
                Negen vakken. Drie fases. Het hele commerciële verhaal van {company || "uw bedrijf"} op één A4.
              </p>

              <div className="space-y-5">
                {(["voor", "tijdens", "na"] as const).map((phase) => (
                  <div key={phase} className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[110px_1fr] sm:gap-6">
                    <div>
                      <div className="font-mono text-xs font-bold tracking-[0.18em] text-brand-accent-ink">
                        {PHASE_LABEL[phase].label}
                      </div>
                      <div className="mt-1 text-sm text-brand-ink-3">{PHASE_LABEL[phase].sub}</div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {grouped[phase].map((cell) => (
                        <div
                          key={cell.id}
                          className="flex min-h-[170px] flex-col self-start rounded-brand bg-brand-tint p-4"
                        >
                          <div className="mb-1 text-sm font-semibold">
                            <span className="text-brand-accent-ink">{cell.num}</span> {cell.title}
                          </div>
                          <div className="mb-2 text-xs leading-snug text-brand-ink-3">{cell.prompt}</div>
                          <textarea
                            value={values[cell.id]}
                            onChange={(e) => {
                              setValues((v) => ({ ...v, [cell.id]: e.target.value }));
                              const t = e.currentTarget;
                              t.style.height = "auto";
                              t.style.height = t.scrollHeight + "px";
                            }}
                            placeholder="Vul hier in"
                            aria-label={cell.title}
                            rows={4}
                            className="min-h-[90px] w-full resize-y overflow-hidden border-0 bg-transparent text-sm placeholder:text-brand-ink-3/60 focus:outline-none focus:ring-0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between border-t border-brand-line pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-ink-3">
                <span>Het groeiplan</span>
                <span>B2B Groeimachine · Rebel Force</span>
              </div>
            </div>
          </div>

          {/* Downloaden: hier vragen we pas om gegevens. */}
          <div className="mt-8 rounded-brand border border-brand-line bg-brand-paper p-6 md:p-8">
            <h3 className="mb-1 font-display text-xl font-bold tracking-[-0.015em]">Download uw groeiplan</h3>
            <p className="mb-5 text-[14px] text-brand-ink-2">
              Vul uw gegevens in. Download het als PDF op één A4, of als Markdown om aan uw AI-assistent te geven.
            </p>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1.2fr_auto] lg:items-start">
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Bedrijfsnaam"
                aria-label="Bedrijfsnaam"
                className="rounded-brand border border-brand-line bg-brand-paper px-4 py-3 text-sm placeholder:text-brand-ink-3 focus:border-brand-accent focus:outline-none"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Naam"
                aria-label="Naam"
                className="rounded-brand border border-brand-line bg-brand-paper px-4 py-3 text-sm placeholder:text-brand-ink-3 focus:border-brand-accent focus:outline-none"
              />
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleDownload("pdf"); }}
                  placeholder="naam@bedrijf.nl"
                  aria-label="Zakelijk e-mailadres"
                  className="w-full rounded-brand border border-brand-line bg-brand-paper px-4 py-3 text-sm placeholder:text-brand-ink-3 focus:border-brand-accent focus:outline-none"
                />
                {emailError && <p className="mt-1.5 text-sm text-red-600">{emailError}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload("pdf")}
                  disabled={downloading}
                  className="inline-flex items-center justify-center rounded-brand bg-brand-accent px-5 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-accent/90 disabled:opacity-60"
                >
                  {downloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload("md")}
                  disabled={downloading}
                  title="Markdown: plak of upload het als context in ChatGPT, Claude of Copilot"
                  className="inline-flex items-center justify-center rounded-brand border border-brand-ink px-5 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-ink hover:text-white disabled:opacity-60"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Markdown voor AI
                </button>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <Footer />

      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className="border-white/10 bg-brand-deep text-white sm:max-w-md">
          <DialogHeader>
            <div className="mb-2 flex items-center gap-2 text-brand-accent">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase">Plan gedownload</span>
            </div>
            <DialogTitle className="text-2xl font-display">
              Plan een vrijblijvend adviesgesprek
            </DialogTitle>
            <DialogDescription className="text-[#CBC3B8]">
              Uw groeiplan staat op papier. In 30 minuten bespreken we samen welke vakken het hardst aan optimalisatie toe zijn en hoe u dat versnelt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBooking(false)}
              className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
            >
              Later
            </Button>
            <Button
              asChild
              className="bg-brand-accent font-medium text-brand-ink hover:bg-brand-accent/90"
            >
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                <Calendar className="h-4 w-4 mr-2" />
                Plan het adviesgesprek
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </PageLoader>
  );
};

export default GroeiplanInvullen;