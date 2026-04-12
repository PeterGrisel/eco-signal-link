import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ArrowLeft, Linkedin } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CheatsheetFeedback from "@/components/cheatsheet/CheatsheetFeedback";
import Footer from "@/components/Footer";

const IcpAi = () => {
  useEffect(() => {
    document.title = "ICP Scherpslijpen met AI — Cheatsheet | B2BGroeiMachine";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Verfijn je Ideal Customer Profile met Claude, Apollo en LinkedIn. Van vage omschrijving naar scherpe targeting in 20 minuten.");
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
            <span className="text-[9px] font-bold tracking-[.1em] uppercase bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-sm" style={{ fontFamily: "Fira Sans, sans-serif" }}>Gevorderd</span>
          </div>
          <h1 className="text-3xl md:text-[38px] uppercase leading-[.92] tracking-[.01em] text-white" style={{ fontFamily: "Anton, sans-serif" }}>
            ICP SCHERPSLIJPEN<br /><span className="text-[#E3874F]">MET AI</span>
          </h1>
          <p className="text-[13px] text-[#BFBFBF] mt-1">Van vage omschrijving naar scherpe targeting. Claude analyseert, Apollo vindt lookalikes.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <div className="bg-[#181818] border border-[#222] rounded px-4 py-2.5 text-center">
            <div className="text-[32px] text-[#E3874F] leading-none" style={{ fontFamily: "Anton, sans-serif" }}>20</div>
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
              { icon: "🔍", name: "Analyseer", desc: "Huidige klanten bekijken" },
              { icon: "🤖", name: "Claude", desc: "Patronen ontdekken" },
              { icon: "🎯", name: "Apollo", desc: "Lookalikes vinden" },
              { icon: "✅", name: "Valideer", desc: "LinkedIn checken" },
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

        {/* STAP 1 */}
        <Card title="Stap 1 — Klanten analyseren">
          <div className="flex flex-col gap-2.5">
            {[
              { title: "Top 10 klanten opschrijven", desc: "Maak een lijst van je 10 beste klanten. Kijk naar omzet, samenwerking en tevredenheid." },
              { title: "Gemeenschappelijkheden zoeken", desc: "Sector, bedrijfsgrootte, regio, groeifase, type beslisser. Welke patronen zie je?" },
              { title: "Pijnpunten documenteren", desc: "Welk probleem hadden ze voordat ze klant werden? Noteer de exacte woorden die ze gebruikten." },
              { title: "Data verzamelen", desc: "Export je klantenlijst als CSV. Voeg toe: bedrijfsnaam, sector, grootte, omzet, contactpersoon." },
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

        {/* STAP 2 — CLAUDE PROMPTS */}
        <Card title="Stap 2 — Claude prompts voor ICP">
          <div className="flex flex-col gap-2.5">
            <PromptBlock label="Prompt 1 — Patronen ontdekken" text={`Hier is een lijst van mijn 10 beste B2B klanten met hun sector, bedrijfsgrootte, regio en het probleem dat we voor ze oplossen. Analyseer de patronen. Wat hebben deze bedrijven gemeen? Geef me een scherp ICP profiel met: sector, grootte, groeifase, typische pijnpunten en type beslisser.`}>
              Hier is een lijst van mijn 10 beste B2B klanten met hun sector, bedrijfsgrootte, regio en het probleem dat we voor ze oplossen. Analyseer de patronen. Wat hebben deze bedrijven gemeen? Geef me een scherp ICP profiel met: sector, grootte, groeifase, typische pijnpunten en type beslisser.
            </PromptBlock>
            <PromptBlock label="Prompt 2 — Anti-ICP definiëren" text={`Op basis van dit ICP, beschrijf ook het type bedrijf dat NIET bij ons past. Welke kenmerken wijzen op een slechte fit? Noem minimaal 5 disqualifiers die ik kan gebruiken om snel te filteren.`}>
              Op basis van dit ICP, beschrijf ook het type bedrijf dat NIET bij ons past. Welke kenmerken wijzen op een slechte fit? Noem minimaal 5 disqualifiers die ik kan gebruiken om snel te filteren.
            </PromptBlock>
            <PromptBlock label="Prompt 3 — ICP scoring model" text={`Maak een scoring model voor mijn ICP. Geef elk criterium een gewicht (1 tot 5). Criteria: sector fit, bedrijfsgrootte, groeifase, type beslisser, urgentie van probleem. Geef een voorbeeld met 3 fictieve bedrijven.`}>
              Maak een scoring model voor mijn ICP. Geef elk criterium een gewicht (1 tot 5). Criteria: sector fit, bedrijfsgrootte, groeifase, type beslisser, urgentie van probleem. Geef een voorbeeld met 3 fictieve bedrijven.
            </PromptBlock>
          </div>
        </Card>

        {/* STAP 3 — APOLLO */}
        <Card title="Stap 3 — Apollo filters voor lookalikes" full>
          <div className="flex flex-col gap-2.5">
            {[
              { filter: "Sector / Industry", value: "Gebruik de sector uit je ICP. Combineer max 3 gerelateerde sectoren.", tip: "Gebruik 'Industry Keywords' voor niche sectoren." },
              { filter: "Bedrijfsgrootte", value: "Employee count range uit je ICP. Bijv. 50 tot 200.", tip: "Kies 1 range, niet meerdere. Scherper = beter." },
              { filter: "Regio", value: "Nederland, of specifieke provincies als je lokaal werkt.", tip: "Begin klein. Schaal op als je flow bewezen is." },
              { filter: "Functietitel", value: "De beslisser uit je ICP. Bijv. 'CEO', 'Operations Director'.", tip: "Gebruik 'OR' voor variaties: CEO OR Directeur OR Founder." },
              { filter: "Signalen", value: "Funding, hiring, tech change — uit je signaal-prioriteiten.", tip: "Combineer max 2 signalen. Meer = te weinig resultaten." },
            ].map((s, i) => (
              <div key={i} className="p-3 bg-[#141414] rounded border border-[#1e1e1e]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold tracking-[.08em] uppercase bg-[#E3874F]/15 text-[#E3874F] px-1.5 py-0.5 rounded">{s.filter}</span>
                </div>
                <div className="text-[11px] text-white mb-1">{s.value}</div>
                <div className="text-[10px] text-[#666]">💡 {s.tip}</div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <a href="https://get.apollo.io/Your-b2b-link" target="_blank" rel="noopener noreferrer" className="text-[#E3874F] hover:underline text-[10px]" style={{ fontFamily: "Fira Mono, monospace" }}>
              get.apollo.io →
            </a>
          </div>
        </Card>

        {/* STAP 4 — VALIDATIE */}
        <Card title="Stap 4 — LinkedIn validatie" full>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="bg-[#1a1a1a] px-3 py-1.5 text-[10px] font-semibold tracking-[.08em] uppercase text-[#666] border-b border-[#222] rounded-t">Checklist per prospect</div>
              <div className="bg-[#141414] p-3.5 text-[10.5px] text-[#BFBFBF] leading-[1.8] rounded-b whitespace-pre-line" style={{ fontFamily: "Fira Mono, monospace" }}>
                ☐ Past bij sector uit ICP?{"\n"}
                ☐ Juiste bedrijfsgrootte?{"\n"}
                ☐ Beslisser of beïnvloeder?{"\n"}
                ☐ Recent signaal zichtbaar?{"\n"}
                ☐ Actief op LinkedIn? (posts, reacties){"\n"}
                ☐ ICP score ≥ 3 van de 5?
              </div>
            </div>
            <div>
              <div className="bg-[#1a1a1a] px-3 py-1.5 text-[10px] font-semibold tracking-[.08em] uppercase text-[#666] border-b border-[#222] rounded-t">Verwacht resultaat</div>
              <div className="bg-[#141414] p-3.5 text-[10.5px] text-[#BFBFBF] leading-[1.8] rounded-b whitespace-pre-line" style={{ fontFamily: "Fira Mono, monospace" }}>
                Van 100 Apollo resultaten:{"\n"}
                → 30 tot 40 passen bij je ICP{"\n"}
                → 15 tot 20 hebben een recent signaal{"\n"}
                → 8 tot 12 zijn actief op LinkedIn{"\n\n"}
                Die 8 tot 12 zijn je eerste outreach batch.
              </div>
            </div>
          </div>
        </Card>

        {/* FEEDBACK */}
        <CheatsheetFeedback slug="icp-ai" />

        {/* CTA */}
        <Card title="Wil je je ICP structureel bijslijpen?" full accent>
          <p className="text-xs text-[#BFBFBF] mb-3">
            Wij helpen B2B bedrijven hun ICP data-gedreven te verfijnen. Elke maand scherper targeten, hogere conversie.
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

export default IcpAi;
