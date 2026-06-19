import { useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Download, Loader2, Lock, Calendar, CheckCircle2 } from "lucide-react";
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

const emailSchema = z.string().trim().email("Ongeldig e-mailadres").max(255);

const GroeiplanInvullen = () => {
  usePageMeta({
    title: "1-Pagina Groeiplan invullen | B2BGroeiMachine",
    description: "Vul jouw 9-vakken groeiplan in en download het als PDF. Het hele commerciële verhaal van je bedrijf op één A4.",
    canonical: "https://www.b2bgroeimachine.io/groeiplan",
  });

  const [params] = useSearchParams();
  const isKlant = params.get("klant") === "1";
  const { toast } = useToast();

  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(isKlant);
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

  const unlock = () => {
    const r = emailSchema.safeParse(email);
    if (!r.success) {
      setEmailError(r.error.issues[0].message);
      return;
    }
    setEmailError("");
    setUnlocked(true);
    toast({ title: "Aan de slag", description: "Vul de negen vakken in en download je groeiplan." });
  };

  const handleDownload = async () => {
    if (!unlocked) return;
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
      const safeName = (company || "groeiplan").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      pdf.save(`1-pagina-groeiplan-${safeName}.pdf`);
      toast({ title: "Klaar", description: "Je groeiplan is gedownload." });
      setShowBooking(true);
    } catch (e) {
      console.error(e);
      toast({ title: "Er ging iets mis", description: "Probeer het opnieuw.", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="text-[#E8945A] font-mono text-xs tracking-[0.2em] uppercase mb-4">
              Het B2B-Groeiplan
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Het 1-Pagina Groeiplan.
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              Negen vakken. Drie fases. Vul samen met je team het hele commerciële verhaal van je bedrijf in. Download het als PDF op één A4.
            </p>
          </motion.div>

          {!unlocked && (
            <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 max-w-2xl">
              <div className="flex items-center gap-2 text-[#E8945A] mb-3">
                <Lock className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.2em] font-mono">Toegang</span>
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Eerst je e-mailadres</h2>
              <p className="text-sm text-white/60 mb-5">
                Vul je zakelijke e-mail in. Daarna kun je je groeiplan invullen en als PDF downloaden.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") unlock(); }}
                  placeholder="naam@bedrijf.nl"
                  className="flex-1 rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:border-[#E8945A] focus:outline-none"
                />
                <Button onClick={unlock} className="bg-[#E8945A] hover:bg-[#E8945A]/90 text-black font-medium">
                  Start invullen
                </Button>
              </div>
              {emailError && <p className="text-red-400 text-sm mt-2">{emailError}</p>}
            </div>
          )}

          {/* Top bar: identity + download */}
          {unlocked && (
            <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-2xl">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Bedrijfsnaam"
                  className="rounded-lg bg-white/[0.03] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#E8945A] focus:outline-none"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Naam"
                  className="rounded-lg bg-white/[0.03] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#E8945A] focus:outline-none"
                />
              </div>
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-[#E8945A] hover:bg-[#E8945A]/90 text-black font-medium"
              >
                {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Download PDF
              </Button>
            </div>
          )}

          {/* The plan - rendered for screen & PDF capture */}
          <div className="overflow-x-auto">
            <div
              ref={planRef}
              className="bg-white text-neutral-900 rounded-2xl p-8 md:p-12 min-w-[1000px] shadow-2xl"
              style={{ width: "100%" }}
            >
              <div className="text-[#E8945A] font-mono text-[11px] tracking-[0.25em] uppercase mb-3">
                Het B2B-Groeiplan
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-2">
                Het 1-Pagina Groeiplan.
              </h2>
              <p className="italic text-neutral-500 mb-8">
                Negen vakken. Drie fases. Het hele commerciële verhaal van {company || "uw bedrijf"} op één A4.
              </p>

              <div className="space-y-5">
                {(["voor","tijdens","na"] as const).map((phase) => (
                  <div key={phase} className="grid grid-cols-[110px_1fr] gap-6 items-start">
                    <div>
                      <div className="text-[#E8945A] font-mono text-xs tracking-[0.2em] font-semibold">
                        {PHASE_LABEL[phase].label}
                      </div>
                      <div className="text-neutral-500 text-sm mt-1">{PHASE_LABEL[phase].sub}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {grouped[phase].map((cell) => (
                        <div
                          key={cell.id}
                          className="rounded-xl bg-[#FAF1E8] p-4 min-h-[170px] flex flex-col self-start"
                        >
                          <div className="text-sm font-semibold text-neutral-900 mb-1">
                            <span className="text-[#E8945A]">{cell.num}</span>{" "}
                            {cell.title}
                          </div>
                          <div className="text-xs text-neutral-500 mb-2 leading-snug">
                            {cell.prompt}
                          </div>
                          <textarea
                            value={values[cell.id]}
                            onChange={(e) => {
                              setValues((v) => ({ ...v, [cell.id]: e.target.value }));
                              const t = e.currentTarget;
                              t.style.height = "auto";
                              t.style.height = t.scrollHeight + "px";
                            }}
                            placeholder={unlocked ? "Vul hier in…" : "—"}
                            disabled={!unlocked}
                            rows={4}
                            className="w-full min-h-[90px] resize-y bg-transparent text-sm text-neutral-800 placeholder-neutral-300 focus:outline-none focus:ring-0 border-0 overflow-hidden"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[10px] tracking-[0.2em] text-neutral-400 mt-8 pt-4 border-t border-neutral-100 font-mono uppercase">
                <span>06 · Het Groeiplan</span>
                <span>B2B Groeimachine · Rebel Force</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className="bg-[#0F0F10] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-[#E8945A] mb-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase">Plan gedownload</span>
            </div>
            <DialogTitle className="text-2xl font-display">
              Bespreek je groeiplan met Peter
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Je groeiplan staat op papier. In 30 minuten bespreken we samen welke vakken het hardst aan optimalisatie toe zijn en hoe je dat versnelt.
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
              className="bg-[#E8945A] hover:bg-[#E8945A]/90 text-black font-medium"
            >
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                <Calendar className="h-4 w-4 mr-2" />
                Plan een gesprek
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroeiplanInvullen;