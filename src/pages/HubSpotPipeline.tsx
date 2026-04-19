import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ArrowLeft, Linkedin } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CheatsheetFeedback from "@/components/cheatsheet/CheatsheetFeedback";
import CheatsheetTrainingCta from "@/components/cheatsheet/CheatsheetTrainingCta";
import Footer from "@/components/Footer";

const HubSpotPipeline = () => {
  useEffect(() => {
    document.title = "HubSpot Pipeline Setup in 30 min — Cheatsheet | B2BGroeiMachine";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Richt je HubSpot CRM pipeline in 30 minuten in. Dealfases, properties, automatiseringen en dashboard voor B2B.");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 pt-28 md:pt-32 px-4 md:px-12 pb-7" style={{ background: "#0B0B0B", borderBottom: "1px solid #222" }}>
        <div className="flex flex-col gap-2">
          <Link to="/cheatsheets" className="inline-flex items-center gap-1.5 text-[#666] hover:text-[#E3874F] transition-colors text-xs mb-2">
            <ArrowLeft className="w-3 h-3" />
            Alle cheatsheets
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold tracking-[.14em] uppercase text-[#0B0B0B] bg-[#E3874F] px-2 py-0.5 rounded-sm w-fit" style={{ fontFamily: "Fira Sans, sans-serif" }}>B2B GROEIMACHINE</span>
            <span className="text-[9px] font-bold tracking-[.1em] uppercase bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-sm" style={{ fontFamily: "Fira Sans, sans-serif" }}>Beginner</span>
          </div>
          <h1 className="text-3xl md:text-[38px] uppercase leading-[.92] tracking-[.01em] text-white" style={{ fontFamily: "Anton, sans-serif" }}>
            HUBSPOT PIPELINE<br /><span className="text-[#E3874F]">SETUP IN 30 MIN</span>
          </h1>
          <p className="text-[13px] text-[#BFBFBF] mt-1">Van lege CRM naar werkende pipeline. Dealfases, properties en automatiseringen.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <div className="bg-[#181818] border border-[#222] rounded px-4 py-2.5 text-center">
            <div className="text-[32px] text-[#E3874F] leading-none" style={{ fontFamily: "Anton, sans-serif" }}>30</div>
            <div className="text-[10px] text-[#666] tracking-[.08em] uppercase">minuten setup</div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 md:px-12 py-8 md:py-10" style={{ background: "#0B0B0B", fontFamily: "'Fira Sans', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#FFFFFF" }}>

        {/* FLOW */}
        <Card title="De aanpak in 4 stappen" full>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-0">
            {[
              { icon: "📊", name: "Dealfases", desc: "5 fases instellen" },
              { icon: "🏷️", name: "Properties", desc: "Velden aanmaken" },
              { icon: "⚡", name: "Automations", desc: "Workflows bouwen" },
              { icon: "📈", name: "Dashboard", desc: "KPI's zichtbaar" },
            ].map((s, i) => (
              <div key={i} className="flex items-center flex-1 w-full md:w-auto">
                <div className="flex-1 text-center py-5 px-4 bg-[#141414] rounded-lg border border-[#1e1e1e]">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-xs tracking-[.06em] uppercase font-bold" style={{ fontFamily: "Anton, sans-serif" }}>{s.name}</div>
                  <div className="text-[10px] text-[#666] mt-1">{s.desc}</div>
                </div>
                {i < 3 && <span className="hidden md:flex items-center justify-center text-[#E3874F] px-4 text-lg" style={{ fontFamily: "Anton, sans-serif" }}>→</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* DEALFASES */}
        <Card title="Stap 1 — Dealfases instellen">
          <div className="flex flex-col gap-2">
            {[
              { name: "Nieuw contact", pct: "10%", desc: "Lead is geïdentificeerd. Eerste contactmoment gepland." },
              { name: "Gesprek gevoerd", pct: "25%", desc: "Eerste call of meeting afgerond. Behoefte is verkend." },
              { name: "Voorstel verstuurd", pct: "50%", desc: "Offerte of propositie gedeeld. Budget is besproken." },
              { name: "Onderhandeling", pct: "75%", desc: "Voorwaarden worden afgestemd. Beslisser is betrokken." },
              { name: "Gewonnen / Verloren", pct: "100%", desc: "Deal gesloten of verloren. Reden vastgelegd." },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-[#141414] rounded border border-[#1e1e1e]">
                <div className="w-7 h-7 rounded bg-[#E3874F]/15 flex items-center justify-center text-[10px] text-[#E3874F] font-bold flex-shrink-0">{s.pct}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[11px] mb-0.5">{s.name}</div>
                  <div className="text-[10px] text-[#666] leading-snug">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* PROPERTIES */}
        <Card title="Stap 2 — Properties aanmaken">
          <div className="flex flex-col gap-2.5">
            {[
              { title: "Leadbron", desc: "Dropdown: LinkedIn, Website, Referral, Event, Cold outreach. Verplicht bij elk nieuw contact." },
              { title: "ICP score", desc: "Getal 1 tot 5. Hoe goed past dit bedrijf bij je ideale klant? Gebruik als filter." },
              { title: "Volgende actie", desc: "Tekstveld. Wat is de eerstvolgende stap? Voorkomt dat deals stil komen te liggen." },
              { title: "Reden verloren", desc: "Dropdown: Te duur, Geen budget, Timing, Concurrent, Geen fit. Essentieel voor leren." },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-[22px] h-[22px] rounded-full bg-[#E3874F] text-[#0B0B0B] flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] font-bold" style={{ fontFamily: "Anton, sans-serif" }}>{i + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold text-xs mb-0.5">{s.title}</div>
                  <div className="text-[11px] text-[#BFBFBF] leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AUTOMATIONS */}
        <Card title="Stap 3 — Automatiseringen" full>
          <div className="flex flex-col gap-2.5">
            {[
              { trigger: "Deal > 7 dagen in fase", action: "Stuur herinnering naar deal owner", why: "Voorkomt dat deals stil liggen zonder actie." },
              { trigger: "Nieuwe deal aangemaakt", action: "Stuur welkomstmail naar contact", why: "Eerste indruk. Bevestig dat je bezig bent." },
              { trigger: "Deal naar 'Voorstel verstuurd'", action: "Maak follow-up taak na 3 dagen", why: "Nooit vergeten op te volgen na een offerte." },
              { trigger: "Deal verloren", action: "Stuur feedback-enquête", why: "Leer waarom je verliest. Data voor verbetering." },
            ].map((s, i) => (
              <div key={i} className="p-3 bg-[#141414] rounded border border-[#1e1e1e]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold tracking-[.08em] uppercase bg-[#E3874F]/15 text-[#E3874F] px-1.5 py-0.5 rounded">Trigger</span>
                  <span className="text-[11px] font-semibold">{s.trigger}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold tracking-[.08em] uppercase bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded">Actie</span>
                  <span className="text-[11px] text-[#BFBFBF]">{s.action}</span>
                </div>
                <div className="text-[10px] text-[#666] mt-1">{s.why}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* DASHBOARD */}
        <Card title="Stap 4 — Dashboard KPI's" full>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Open deals", desc: "Totaal aantal actieve deals" },
              { label: "Pipeline waarde", desc: "Som van alle open deal bedragen" },
              { label: "Gem. doorlooptijd", desc: "Dagen van eerste contact tot close" },
              { label: "Win rate", desc: "% gewonnen vs. totaal gesloten" },
              { label: "Deals per fase", desc: "Staafdiagram per pipeline fase" },
              { label: "Leadbron verdeling", desc: "Welke kanalen leveren op" },
              { label: "Activiteit per rep", desc: "Taken, calls, mails per persoon" },
              { label: "Verliesredenen", desc: "Top redenen waarom deals mislukken" },
            ].map((s, i) => (
              <div key={i} className="p-3 bg-[#141414] rounded border border-[#1e1e1e] text-center">
                <div className="text-[11px] font-semibold mb-1">{s.label}</div>
                <div className="text-[10px] text-[#666]">{s.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* FEEDBACK */}
        <CheatsheetFeedback slug="hubspot-pipeline" />

        {/* TRAINING UPSELL */}
        <CheatsheetTrainingCta />

        {/* CTA */}
        <Card title="Wil je je HubSpot professioneel laten inrichten?" full accent>
          <p className="text-xs text-[#BFBFBF] mb-3">
            Wij richten je volledige CRM in: pipeline, properties, automations en dashboards. Afgestemd op jouw verkoopproces.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a href="/contact" className="inline-block bg-[#E3874F] text-[#0B0B0B] px-5 py-2 rounded font-bold text-xs no-underline hover:opacity-90 transition-opacity">Stuur een bericht →</a>
            <a href="https://linkedin.com/in/petergrisel" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#0A66C2] text-white px-4 py-2 rounded font-semibold text-xs no-underline hover:bg-[#004182] transition-colors">
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

const Card = ({ title, children, full, accent }: { title: string; children: React.ReactNode; full?: boolean; accent?: boolean }) => (
  <div className={`${full ? "md:col-span-2" : ""} bg-[#181818] rounded-md p-4 md:p-5 ${accent ? "border border-[#E3874F] border-l-[3px]" : "border border-[#222]"}`}>
    <div className="flex items-center gap-2 mb-3.5 text-[13px] tracking-[.1em] uppercase text-[#E3874F]" style={{ fontFamily: "Anton, sans-serif" }}>
      <span className="inline-block w-[3px] h-3.5 bg-[#E3874F] rounded-sm" />
      {title}
    </div>
    {children}
  </div>
);

const PromptBlock = ({ label, children, text }: { label: string; children: React.ReactNode; text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Prompt gekopieerd!");
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Kopiëren mislukt"); }
  };
  return (
    <div className="rounded overflow-hidden">
      <div className="flex items-center justify-between bg-[#1a1a1a] px-3 py-1.5 border-b border-[#222]">
        <span className="text-[10px] font-semibold tracking-[.08em] uppercase text-[#666]">{label}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] text-[#666] hover:text-[#E3874F] transition-colors">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Gekopieerd" : "Kopieer"}
        </button>
      </div>
      <div className="bg-[#141414] p-3 text-[10.5px] text-[#BFBFBF] leading-relaxed" style={{ fontFamily: "Fira Mono, monospace" }}>{children}</div>
    </div>
  );
};

export default HubSpotPipeline;
