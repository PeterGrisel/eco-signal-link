import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ArrowLeft, Linkedin } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CheatsheetFeedback from "@/components/cheatsheet/CheatsheetFeedback";
import CheatsheetTrainingCta from "@/components/cheatsheet/CheatsheetTrainingCta";
import Footer from "@/components/Footer";

const GammaCheatsheet = () => {
  useEffect(() => {
    document.title = "Claude × Gamma — Presentaties Cheatsheet | B2BGroeiMachine";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Presentaties bouwen vanuit Claude met Gamma — zonder PowerPoint, zonder templates slopen. In 10 minuten een deck.");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO HEADER */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 pt-28 md:pt-32 px-4 md:px-12 pb-7" style={{ background: "#0B0B0B", borderBottom: "1px solid #222" }}>
        <div className="flex flex-col gap-2">
          <Link to="/cheatsheets" className="inline-flex items-center gap-1.5 text-[#666] hover:text-[#E3874F] transition-colors text-xs mb-2">
            <ArrowLeft className="w-3 h-3" />
            Alle cheatsheets
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold tracking-[.14em] uppercase text-[#0B0B0B] bg-[#E3874F] px-2 py-0.5 rounded-sm w-fit" style={{ fontFamily: "Fira Sans, sans-serif" }}>B2B GROEIMACHINE</span>
            <span className="text-[9px] font-bold tracking-[.1em] uppercase bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-sm" style={{ fontFamily: "Fira Sans, sans-serif" }}>Beginner</span>
            <span className="text-[9px] font-bold tracking-[.1em] uppercase bg-[#7C6FE0]/15 text-[#7C6FE0] px-2 py-0.5 rounded-sm" style={{ fontFamily: "Fira Sans, sans-serif" }}>Gamma</span>
          </div>
          <h1 className="text-3xl md:text-[38px] uppercase leading-[.92] tracking-[.01em] text-white" style={{ fontFamily: "Anton, sans-serif" }}>
            CLAUDE × <span className="text-[#7C6FE0]">GAMMA</span><br /><span className="text-[#E3874F]">SLIDES IN 10 MINUTEN</span>
          </h1>
          <p className="text-[13px] text-[#BFBFBF] mt-1">Presentaties bouwen vanuit Claude — zonder PowerPoint, zonder templates slopen.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <div className="bg-[#181818] border border-[#222] rounded px-4 py-2.5 text-center">
            <div className="text-[32px] text-[#E3874F] leading-none" style={{ fontFamily: "Anton, sans-serif" }}>10</div>
            <div className="text-[10px] text-[#666] tracking-[.08em] uppercase">min per deck</div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 md:px-12 py-8 md:py-10" style={{ background: "#0B0B0B", fontFamily: "'Fira Sans', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#FFFFFF" }}>

        {/* FLOW */}
        <Card title="Hoe het werkt — 4 stappen" full>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-0">
            {[
              { icon: "🔌", name: "Connect", desc: "Gamma connector in Claude" },
              { icon: "💬", name: "Prompt", desc: "Beschrijf je presentatie" },
              { icon: "⚡", name: "Genereer", desc: "Claude + Gamma bouwen" },
              { icon: "✅", name: "Klaar", desc: "Bewerkbaar in Gamma" },
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

        {/* SETUP */}
        <Card title="Setup (1x, duurt 5 min)">
          <div className="flex flex-col gap-2.5">
            {[
              { title: "Gamma account aanmaken", desc: "Gratis te starten. Ga naar gamma.app en maak een account aan.", link: "gamma.app" },
              { title: "Gamma connector activeren in Claude", desc: "Claude.ai → Settings → Connectors → zoek Gamma → klik Connect." },
              { title: "Test de verbinding", desc: 'Typ in Claude: "Maak een presentatie van 5 slides over AI." Werkt het? Je bent live.' },
              { title: "Stel je huisstijl in", desc: "Upload je logo en kleuren in Gamma. Claude pakt dit automatisch op bij elke generatie." },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-[22px] h-[22px] rounded-full bg-[#7C6FE0] text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] font-bold" style={{ fontFamily: "Anton, sans-serif" }}>{i + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold text-xs mb-0.5">{s.title}</div>
                  <div className="text-[11px] text-[#BFBFBF] leading-relaxed">{s.desc}</div>
                  {s.link && (
                    <a href="https://gamma.app" target="_blank" rel="noopener noreferrer" className="text-[#7C6FE0] hover:underline text-[10px]" style={{ fontFamily: "Fira Mono, monospace" }}>
                      {s.link} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* USE CASES */}
        <Card title="5 toepassingen die tijd besparen" titleColor="purple">
          <div className="flex flex-col gap-2">
            {[
              { icon: "🎯", name: "Sales pitch deck", desc: "Aanpak, bewijs, CTA in één prompt. Per prospect aanpasbaar.", tag: "Snel", hot: true },
              { icon: "📊", name: "Rapportage / maandupdate", desc: "Plak je data, Claude structureert en visualiseert.", tag: "Snel", hot: true },
              { icon: "🤝", name: "Onboarding presentatie", desc: "Eén keer goed opbouwen, daarna alleen updaten via chat.", tag: "Pro", hot: false },
              { icon: "🧠", name: "Workshop / training", desc: "Structuur vanuit outline, slides per module automatisch.", tag: "Pro", hot: false },
              { icon: "📣", name: "Investor / partner pitch", desc: "Probleem → aanpak → bewijs → CTA. Claude houdt de logica vast.", tag: "Pro", hot: false },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 md:p-3 bg-[#141414] rounded border border-[#1e1e1e]">
                <div className="w-7 h-7 rounded bg-[#1e1e1e] flex items-center justify-center text-[13px] flex-shrink-0">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[11px] mb-0.5">{s.name}</div>
                  <div className="text-[10px] text-[#666] leading-snug">{s.desc}</div>
                </div>
                <span className={`text-[9px] font-bold tracking-[.08em] uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${s.hot ? "bg-[#E3874F]/15 text-[#E3874F]" : "bg-[#7C6FE0]/15 text-[#7C6FE0]"}`}>{s.tag}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* PROMPTS */}
        <Card title="Copy-paste prompts voor Claude" full>
          <div className="flex flex-col gap-2.5">
            <PromptBlock label="Prompt 1 — Nieuw deck bouwen vanuit scratch" text={`Maak een Gamma presentatie van [X slides] over [onderwerp]. Doelgroep: [wie]. Doel: [overtuigen / informeren / verkopen]. Toon: [professioneel / direct / inspirerend]. Thema: donker. Gebruik mijn huisstijl.`}>
              Maak een Gamma presentatie van <strong>[X slides]</strong> over <strong>[onderwerp]</strong>. Doelgroep: <strong>[wie]</strong>. Doel: <strong>[overtuigen / informeren / verkopen]</strong>. Toon: <strong>[professioneel / direct / inspirerend]</strong>. Thema: donker. Gebruik mijn huisstijl.
            </PromptBlock>
            <PromptBlock label="Prompt 2 — Bestaande tekst omzetten naar slides" text={`Hier is mijn tekst / outline: [plak inhoud]. Zet dit om in een Gamma presentatie van [X slides]. Houd de kernboodschap per slide kort: max 3 bullets. Voeg een sterke openingsslide en een CTA-slide toe aan het einde.`}>
              Hier is mijn tekst / outline: <strong>[plak inhoud]</strong>. Zet dit om in een Gamma presentatie van <strong>[X slides]</strong>. Houd de kernboodschap per slide kort: max 3 bullets. Voeg een sterke openingsslide en een CTA-slide toe aan het einde.
            </PromptBlock>
            <PromptBlock label="Prompt 3 — Slide aanpassen zonder de rest te breken" text={`Pas slide [nummer] van mijn presentatie aan. Nieuwe inhoud: [wat er moet staan]. Laat de rest van de presentatie ongewijzigd. Houd dezelfde opmaak en huisstijl aan.`}>
              Pas slide <strong>[nummer]</strong> van mijn presentatie aan. Nieuwe inhoud: <strong>[wat er moet staan]</strong>. Laat de rest van de presentatie ongewijzigd. Houd dezelfde opmaak en huisstijl aan.
            </PromptBlock>
            <PromptBlock label="Prompt 4 — Sales pitch per prospect personaliseren" text={`Pas mijn standaard pitch deck aan voor [bedrijfsnaam]. Zij zijn actief in [sector] en hun pijnpunt is [probleem]. Verwerk dit in de opening, de probleemslide en de CTA. Laat de rest staan.`}>
              Pas mijn standaard pitch deck aan voor <strong>[bedrijfsnaam]</strong>. Zij zijn actief in <strong>[sector]</strong> en hun pijnpunt is <strong>[probleem]</strong>. Verwerk dit in de opening, de probleemslide en de CTA. Laat de rest staan.
            </PromptBlock>
          </div>
        </Card>

        {/* PRO TIPS */}
        <Card title="Pro tips — meer resultaat uit elke prompt" full titleColor="purple">
          <div className="flex flex-col gap-2">
            {[
              "Geef context vóór je prompt. Vertel Claude wie je doelgroep is en wat je wil dat ze doen na de presentatie. Dat bepaalt de structuur.",
              "Gebruik één gesprek voor het hele deck. Claude onthoudt je context. Je hoeft niet opnieuw uit te leggen bij elke aanpassing.",
              "Stel je huisstijl eenmalig in Gamma in. Logo, kleuren, fonts — Claude pakt dit automatisch op. Geen handmatige opmaak meer.",
              "Minder tekst per slide = betere output. Vraag Claude om max 3 punten per slide. Gamma vult visueel aan. Slides zijn geen Word-documenten.",
              "Eindig altijd met een CTA-slide. \"Wat moet de lezer doen na deze presentatie?\" — geef dat mee in je prompt.",
            ].map((tip, i) => (
              <div key={i} className="flex gap-2.5 p-2.5 md:p-3 bg-[#141414] rounded border border-[#1e1e1e]">
                <span className="text-[13px] font-bold text-[#7C6FE0] flex-shrink-0 min-w-[20px]" style={{ fontFamily: "Anton, sans-serif" }}>0{i + 1}</span>
                <span className="text-[11px] text-[#BFBFBF] leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* FEEDBACK */}
        <CheatsheetFeedback slug="gamma-presentaties" />

        {/* TRAINING UPSELL */}
        <CheatsheetTrainingCta />

        {/* CTA */}
        <Card title="Wil je ook acties aanmaken direct vanuit Claude?" full accent>
          <p className="text-xs text-[#BFBFBF] mb-3">
            Van prompt naar gepersonaliseerde presentatie — volledig geautomatiseerd. Apollo, Gamma, n8n gekoppeld in één workflow. Stuur mij een bericht voor meer info.
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

const Card = ({ title, children, full, accent, titleColor }: { title: string; children: React.ReactNode; full?: boolean; accent?: boolean; titleColor?: "purple" }) => (
  <div
    className={`${full ? "md:col-span-2" : ""} bg-[#181818] rounded-md p-4 md:p-5 ${accent ? "border border-[#E3874F] border-l-[3px]" : "border border-[#222]"}`}
  >
    <div className={`flex items-center gap-2 mb-3.5 text-[13px] tracking-[.1em] uppercase ${titleColor === "purple" ? "text-[#7C6FE0]" : "text-[#E3874F]"}`} style={{ fontFamily: "Anton, sans-serif" }}>
      <span className={`inline-block w-[3px] h-3.5 rounded-sm ${titleColor === "purple" ? "bg-[#7C6FE0]" : "bg-[#E3874F]"}`} />
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
    } catch {
      toast.error("Kopiëren mislukt");
    }
  };

  return (
    <div className="rounded overflow-hidden">
      <div className="flex items-center justify-between bg-[#1a1a1a] px-3 py-1.5 border-b border-[#222]">
        <span className="text-[10px] font-semibold tracking-[.08em] uppercase text-[#666]">{label}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] text-[#666] hover:text-[#7C6FE0] transition-colors">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Gekopieerd" : "Kopieer"}
        </button>
      </div>
      <div className="bg-[#141414] p-3 text-[10.5px] text-[#BFBFBF] leading-relaxed" style={{ fontFamily: "Fira Mono, monospace" }}>{children}</div>
    </div>
  );
};

export default GammaCheatsheet;
