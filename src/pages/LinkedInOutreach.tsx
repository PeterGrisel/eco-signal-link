import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ArrowLeft, Linkedin } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CheatsheetFeedback from "@/components/cheatsheet/CheatsheetFeedback";
import Footer from "@/components/Footer";

const LinkedInOutreach = () => {
  useEffect(() => {
    document.title = "LinkedIn Outreach Formules — Cheatsheet | B2BGroeiMachine";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "5 bewezen LinkedIn berichtsjablonen voor B2B outreach. Kopieer de prompts, personaliseer met ChatGPT en ga direct live.");
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
            LINKEDIN<br /><span className="text-[#E3874F]">OUTREACH FORMULES</span>
          </h1>
          <p className="text-[13px] text-[#BFBFBF] mt-1">5 bewezen berichtsjablonen. Personaliseer met ChatGPT en verstuur vandaag nog.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <div className="bg-[#181818] border border-[#222] rounded px-4 py-2.5 text-center">
            <div className="text-[32px] text-[#E3874F] leading-none" style={{ fontFamily: "Anton, sans-serif" }}>10</div>
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
              { icon: "👤", name: "Profiel", desc: "Optimaliseer je headline" },
              { icon: "🎯", name: "ICP", desc: "Bepaal wie je target" },
              { icon: "✉️", name: "Connect", desc: "Stuur connectieverzoek" },
              { icon: "🔄", name: "Follow-up", desc: "Herhaal met waarde" },
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

        {/* STAP 1 — PROFIEL */}
        <Card title="Stap 1 — Profiel optimaliseren">
          <div className="flex flex-col gap-2.5">
            {[
              { title: "Headline herschrijven", desc: "Niet je functietitel. Beschrijf welk resultaat je levert. Voorbeeld: 'Ik help B2B bedrijven hun pipeline 3x vullen zonder cold calling.'" },
              { title: "Banner aanpassen", desc: "Gebruik Canva. Zet je waardepropositie in de banner. Geen logo, geen stockfoto." },
              { title: "About-sectie updaten", desc: "Eerste 3 regels zijn zichtbaar. Begin met het probleem van je klant, niet met je CV." },
              { title: "Featured sectie vullen", desc: "Voeg een case study, cheatsheet of calendly-link toe. Maak het makkelijk om actie te nemen." },
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

        {/* STAP 2 — ICP */}
        <Card title="Stap 2 — ICP targeten op LinkedIn">
          <div className="flex flex-col gap-2.5">
            {[
              { title: "Sales Navigator filters", desc: "Functietitel + bedrijfsgrootte + regio + industrie. Sla als lead list op." },
              { title: "Boolean zoeken (gratis)", desc: 'Gebruik de zoekbalk: "operations manager" AND "logistiek" AND "Nederland".' },
              { title: "Engagement-signalen", desc: "Like en reageer eerst op hun posts. Warm je connectieverzoek op." },
              { title: "Maximaal 20 per dag", desc: "Verstuur niet meer dan 20 verzoeken per dag. LinkedIn bestraft bulk." },
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

        {/* 5 TEMPLATES */}
        <Card title="5 bewezen berichtsjablonen" full>
          <div className="flex flex-col gap-2.5">
            <PromptBlock label="Template 1 — Connectieverzoek (koud)" text={`[Voornaam], bedrijven in de [sector] die groeien voorbij [X] medewerkers lopen vaak tegen [probleem] aan. Herkenbaar? Ik deel graag hoe wij dat oplossen.`}>
              <strong>[Voornaam]</strong>, bedrijven in de <strong>[sector]</strong> die groeien voorbij <strong>[X]</strong> medewerkers lopen vaak tegen <strong>[probleem]</strong> aan. Herkenbaar? Ik deel graag hoe wij dat oplossen.
            </PromptBlock>
            <PromptBlock label="Template 2 — Follow-up na acceptatie" text={`Bedankt voor de connectie, [voornaam]. Geen salespitch. Eén vraag: hoe pakken jullie [specifiek proces] nu aan? Ik ben benieuwd of jullie hetzelfde patroon zien als andere [sector]-bedrijven.`}>
              Bedankt voor de connectie, <strong>[voornaam]</strong>. Geen salespitch. Eén vraag: hoe pakken jullie <strong>[specifiek proces]</strong> nu aan? Ik ben benieuwd of jullie hetzelfde patroon zien als andere <strong>[sector]</strong>-bedrijven.
            </PromptBlock>
            <PromptBlock label="Template 3 — Engagement-reactie" text={`Interessant punt over [onderwerp uit hun post]. Wij zien bij klanten in de [sector] dat [relevante observatie]. Hoe kijken jullie daarnaar?`}>
              Interessant punt over <strong>[onderwerp uit hun post]</strong>. Wij zien bij klanten in de <strong>[sector]</strong> dat <strong>[relevante observatie]</strong>. Hoe kijken jullie daarnaar?
            </PromptBlock>
            <PromptBlock label="Template 4 — InMail (Sales Navigator)" text={`[Voornaam], ik werk met [X] bedrijven in de [sector] die [resultaat] bereiken door [aanpak]. Geen webinar, geen funnel. Gewoon een concreet gesprek van 15 minuten. Interesse?`}>
              <strong>[Voornaam]</strong>, ik werk met <strong>[X]</strong> bedrijven in de <strong>[sector]</strong> die <strong>[resultaat]</strong> bereiken door <strong>[aanpak]</strong>. Geen webinar, geen funnel. Gewoon een concreet gesprek van 15 minuten. Interesse?
            </PromptBlock>
            <PromptBlock label="Template 5 — Voice note script" text={`Hey [voornaam], korte voice note. Ik zag dat jullie [signaal]. Bij vergelijkbare bedrijven lossen wij [probleem] op in [tijdframe]. Mag ik je daar 1 vraag over stellen?`}>
              Hey <strong>[voornaam]</strong>, korte voice note. Ik zag dat jullie <strong>[signaal]</strong>. Bij vergelijkbare bedrijven lossen wij <strong>[probleem]</strong> op in <strong>[tijdframe]</strong>. Mag ik je daar 1 vraag over stellen?
            </PromptBlock>
          </div>
        </Card>

        {/* CHATGPT PROMPTS */}
        <Card title="ChatGPT prompts om te personaliseren" full>
          <div className="flex flex-col gap-2.5">
            <PromptBlock label="Prompt 1 — Bericht personaliseren" text={`Schrijf een LinkedIn connectieverzoek voor [naam], [functie] bij [bedrijf] in de [sector]. Ze hebben recent [signaal]. Mijn aanbod: [korte beschrijving]. Toon: direct, menselijk, max 40 woorden. Geen complimenten.`}>
              Schrijf een LinkedIn connectieverzoek voor <strong>[naam]</strong>, <strong>[functie]</strong> bij <strong>[bedrijf]</strong> in de <strong>[sector]</strong>. Ze hebben recent <strong>[signaal]</strong>. Mijn aanbod: <strong>[korte beschrijving]</strong>. Toon: direct, menselijk, max 40 woorden. Geen complimenten.
            </PromptBlock>
            <PromptBlock label="Prompt 2 — Batch personaliseren" text={`Hier zijn 10 prospects met naam, functie, bedrijf en sector. Schrijf voor elk een LinkedIn connectieverzoek van max 40 woorden. Gebruik geen generieke openingen. Begin met hun situatie.`}>
              Hier zijn 10 prospects met naam, functie, bedrijf en sector. Schrijf voor elk een LinkedIn connectieverzoek van max 40 woorden. Gebruik geen generieke openingen. Begin met hun situatie.
            </PromptBlock>
          </div>
        </Card>

        {/* TIPS */}
        <Card title="Do's & don'ts" full>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="bg-[#1a1a1a] px-3 py-1.5 text-[10px] font-semibold tracking-[.08em] uppercase text-emerald-400 border-b border-[#222] rounded-t">✅ Do's</div>
              <div className="bg-[#141414] p-3.5 text-[10.5px] text-[#BFBFBF] leading-[1.8] rounded-b" style={{ fontFamily: "Fira Mono, monospace" }}>
                Begin met hun situatie, niet met jouzelf{"\n"}
                Max 40 woorden per connectieverzoek{"\n"}
                Reageer eerst op hun content{"\n"}
                Stuur voice notes (hogere response){"\n"}
                Wacht 24 tot 48 uur voor follow-up
              </div>
            </div>
            <div>
              <div className="bg-[#1a1a1a] px-3 py-1.5 text-[10px] font-semibold tracking-[.08em] uppercase text-red-400 border-b border-[#222] rounded-t">❌ Don'ts</div>
              <div className="bg-[#141414] p-3.5 text-[10.5px] text-[#BFBFBF] leading-[1.8] rounded-b" style={{ fontFamily: "Fira Mono, monospace" }}>
                Geen "Ik zag dat je bij X werkt"{"\n"}
                Geen brochure of link in eerste bericht{"\n"}
                Niet meer dan 20 verzoeken per dag{"\n"}
                Geen copy-paste zonder personalisatie{"\n"}
                Geen follow-up na 1 uur
              </div>
            </div>
          </div>
        </Card>

        {/* FEEDBACK */}
        <CheatsheetFeedback slug="linkedin-outreach" />

        {/* CTA */}
        <Card title="Wil je dit structureel aanpakken?" full accent>
          <p className="text-xs text-[#BFBFBF] mb-3">
            Wij bouwen LinkedIn outreach systemen die elke week automatisch prospects vinden, berichten personaliseren en follow-ups plannen.
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

export default LinkedInOutreach;
