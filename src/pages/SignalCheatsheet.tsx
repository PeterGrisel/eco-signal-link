import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SignalCheatsheet = () => {
  useEffect(() => {
    document.title = "Claude × Apollo — Signal Cheatsheet | B2BGroeiMachine";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Van marktsignaal naar persoonlijke outreach — zonder developer, zonder koppeling. Signal prospecting cheatsheet.");
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
          <span className="text-[9px] font-bold tracking-[.14em] uppercase text-[#0B0B0B] bg-[#E3874F] px-2 py-0.5 rounded-sm w-fit" style={{ fontFamily: "Fira Sans, sans-serif" }}>B2B GROEIMACHINE</span>
          <h1 className="text-3xl md:text-[38px] uppercase leading-[.92] tracking-[.01em] text-white" style={{ fontFamily: "Anton, sans-serif" }}>
            CLAUDE × APOLLO<br /><span className="text-[#E3874F]">SIGNAL PROSPECTING</span>
          </h1>
          <p className="text-[13px] text-[#BFBFBF] mt-1">Van marktsignaal naar persoonlijke outreach — zonder developer, zonder koppeling.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <div className="bg-[#181818] border border-[#222] rounded px-4 py-2.5 text-center">
            <div className="text-[32px] text-[#E3874F] leading-none" style={{ fontFamily: "Anton, sans-serif" }}>15</div>
            <div className="text-[10px] text-[#666] tracking-[.08em] uppercase">minuten setup</div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 md:px-12 py-8 md:py-10" style={{ background: "#0B0B0B", fontFamily: "'Fira Sans', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#FFFFFF" }}>

        {/* FLOW - full width */}
        <Card title="De aanpak in 4 stappen" full>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-0">
            {[
              { icon: "🔌", name: "Connect", desc: "Claude + Apollo MCP" },
              { icon: "📡", name: "Signaal", desc: "Trigger definiëren" },
              { icon: "🤖", name: "Prompt", desc: "Claude filtert & schrijft" },
              { icon: "📨", name: "Actie", desc: "Sequence live in Apollo" },
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
        <Card title="Setup (1x, duurt 10 min)">
          <div className="flex flex-col gap-2.5">
            {[
              { title: "Apollo account aanmaken", desc: "Nog geen account? Gebruik de link hieronder voor directe toegang.", link: "get.apollo.io" },
              { title: "Apollo connector activeren in Claude", desc: "Ga naar Claude.ai → Settings → Connectors → zoek Apollo.io → klik Connect. Klaar." },
              { title: "Test de verbinding", desc: 'Typ in Claude: "Zoek 5 directeuren in de logistiek in Nederland." Werkt het? Dan ben je live.' },
              { title: "Sla je ICP op", desc: "Beschrijf je ideale klant als tekst. Gebruik dit als context in elke prompt." },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-[22px] h-[22px] rounded-full bg-[#E3874F] text-[#0B0B0B] flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] font-bold" style={{ fontFamily: "Anton, sans-serif" }}>{i + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold text-xs mb-0.5">{s.title}</div>
                  <div className="text-[11px] text-[#BFBFBF] leading-relaxed">{s.desc}</div>
                  {s.link && (
                    <a href="https://get.apollo.io/Your-b2b-link" target="_blank" rel="noopener noreferrer" className="text-[#E3874F] hover:underline text-[10px]" style={{ fontFamily: "Fira Mono, monospace" }}>
                      {s.link} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* SIGNALS */}
        <Card title="De 5 sterkste signalen">
          <div className="flex flex-col gap-2">
            {[
              { icon: "💼", name: "Nieuwe functie (0–90 dagen)", why: "Nieuwe manager = nieuw budget, nieuwe prioriteiten. Beste timing.", hot: true },
              { icon: "📈", name: "Funding ontvangen", why: "Geld binnen = groeiplannen actief. Ze zoeken leveranciers.", hot: true },
              { icon: "🧑‍💼", name: "Vacature sales / ops", why: "Signaal van groei én bottleneck. Jij kunt sneller zijn dan een hire.", hot: true },
              { icon: "🌐", name: "Website tech-change", why: "Nieuwe tools = nieuwe leveranciers welkom. Laagdrempelig gesprek.", hot: false },
              { icon: "📰", name: "Nieuws / persuitgave", why: "Expansie, fusie, award = haakje voor relevante outreach.", hot: false },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 md:p-3 bg-[#141414] rounded border border-[#1e1e1e]">
                <div className="w-7 h-7 rounded bg-[#1e1e1e] flex items-center justify-center text-[13px] flex-shrink-0">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[11px] mb-0.5">{s.name}</div>
                  <div className="text-[10px] text-[#666] leading-snug">{s.why}</div>
                </div>
                <span className={`text-[9px] font-bold tracking-[.08em] uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${s.hot ? "bg-[#E3874F]/15 text-[#E3874F]" : "bg-white/[.06] text-[#888]"}`}>{s.hot ? "Hot" : "Warm"}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* PROMPTS - full width */}
        <Card title="Copy-paste prompts voor Claude" full>
          <div className="flex flex-col gap-2.5">
            <PromptBlock label="Prompt 1 — Prospects zoeken op signaal" text={`Zoek in Apollo directeuren of operations managers bij bedrijven in de [sector] in Nederland, die de afgelopen [30/60/90 dagen] van baan zijn gewisseld. Bedrijfsgrootte: [X–Y medewerkers]. Geef naam, functie, bedrijf en LinkedIn-URL terug.`}>
              Zoek in Apollo directeuren of operations managers bij bedrijven in de <strong>[sector]</strong> in Nederland, die de afgelopen <strong>[30/60/90 dagen]</strong> van baan zijn gewisseld. Bedrijfsgrootte: <strong>[X–Y medewerkers]</strong>. Geef naam, functie, bedrijf en LinkedIn-URL terug.
            </PromptBlock>
            <PromptBlock label="Prompt 2 — Outreach schrijven op basis van signaal" text={`Schrijf een LinkedIn-bericht voor [naam], die recent is gestart als [functie] bij [bedrijf]. Mijn aanbod: [korte beschrijving]. Toon: direct, geen complimenten, begin met een hypothese over hun situatie. Max 60 woorden.`}>
              Schrijf een LinkedIn-bericht voor <strong>[naam]</strong>, die recent is gestart als <strong>[functie]</strong> bij <strong>[bedrijf]</strong>. Mijn aanbod: <strong>[korte beschrijving]</strong>. Toon: direct, geen complimenten, begin met een hypothese over hun situatie. Max 60 woorden.
            </PromptBlock>
            <PromptBlock label="Prompt 3 — Batch outreach (meerdere prospects tegelijk)" text={`Hier zijn [X] prospects uit Apollo met elk hun signaal. Schrijf voor iedereen een apart LinkedIn-bericht van max 60 woorden. Gebruik hun signaal als haakje. Geen generieke openingen. Geen "ik zag dat je bij bedrijf X werkt."`}>
              Hier zijn <strong>[X]</strong> prospects uit Apollo met elk hun signaal. Schrijf voor iedereen een apart LinkedIn-bericht van max 60 woorden. Gebruik hun signaal als haakje. Geen generieke openingen. Geen "ik zag dat je bij bedrijf X werkt."
            </PromptBlock>
          </div>
        </Card>

        {/* TEMPLATE - full width */}
        <Card title="Outreach template — bewezen structuur" full>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="bg-[#1a1a1a] px-3 py-1.5 text-[10px] font-semibold tracking-[.08em] uppercase text-[#666] border-b border-[#222] rounded-t">Template</div>
              <div className="bg-[#141414] p-3.5 text-[10.5px] text-[#BFBFBF] leading-[1.8] rounded-b whitespace-pre-line" style={{ fontFamily: "Fira Mono, monospace" }}>
                <span className="text-[#E3874F]">[Naam]</span>, <span className="text-[#444]">// gebruik voornaam</span>{"\n\n"}
                Bedrijven in <span className="text-[#E3874F]">[sector]</span> die <span className="text-[#E3874F]">[signaal]</span>{"\n"}
                lopen vaak tegen <span className="text-[#E3874F]">[specifiek probleem]</span> aan.{"\n\n"}
                Wij lossen dat op met <span className="text-[#E3874F]">[aanpak in 1 zin]</span>.{"\n\n"}
                Herkenbaar?
              </div>
            </div>
            <div>
              <div className="bg-[#1a1a1a] px-3 py-1.5 text-[10px] font-semibold tracking-[.08em] uppercase text-[#666] border-b border-[#222] rounded-t">Ingevuld voorbeeld</div>
              <div className="bg-[#141414] p-3.5 text-[10.5px] text-[#BFBFBF] leading-[1.8] rounded-b whitespace-pre-line" style={{ fontFamily: "Fira Mono, monospace" }}>
                Thomas,{"\n\n"}
                Bedrijven in de logistiek die net{"\n"}
                een nieuwe operations manager aanstellen{"\n"}
                lopen vaak tegen datasilo's aan die beslissen{"\n"}
                vertragen.{"\n\n"}
                Wij bouwen systemen die dat in weken oplossen.{"\n\n"}
                Herkenbaar?
              </div>
            </div>
          </div>
          <div className="mt-4 p-3.5 bg-[#141414] rounded border-l-[3px] border-[#E3874F]">
            <strong className="text-[#E3874F]">Regel #1</strong>{" "}
            <span className="text-[11px] text-[#BFBFBF]">Begin nooit met "Ik zag dat je bij bedrijf X werkt." Begin met hun situatie — niet met jouzelf. Timing is alles. Het signaal is jouw credentie.</span>
          </div>
        </Card>

        {/* CTA - full width */}
        <Card title="Wil je ook acties aanmaken direct in Apollo?" full accent>
          <p className="text-xs text-[#BFBFBF] mb-3">
            Van prospect naar outreach — volledig geautomatiseerd. Sequences live zetten, taken aanmaken, follow-ups plannen. Stuur mij een bericht voor meer info.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a href="/contact" className="inline-block bg-[#E3874F] text-[#0B0B0B] px-5 py-2 rounded font-bold text-xs no-underline hover:opacity-90 transition-opacity">Stuur een bericht →</a>
            <span className="text-[10px] text-[#666]">linkedin.com/in/petergrisel</span>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

const Card = ({ title, children, full, accent }: { title: string; children: React.ReactNode; full?: boolean; accent?: boolean }) => (
  <div
    className={`${full ? "md:col-span-2" : ""} bg-[#181818] rounded-md p-4 md:p-5 ${accent ? "border border-[#E3874F] border-l-[3px]" : "border border-[#222]"}`}
  >
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
    } catch {
      toast.error("Kopiëren mislukt");
    }
  };

  return (
    <div className="rounded overflow-hidden">
      <div className="flex items-center justify-between bg-[#1a1a1a] px-3 py-1.5 border-b border-[#222]">
        <span className="text-[10px] font-semibold tracking-[.08em] uppercase text-[#666]">{label}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-[#666] hover:text-[#E3874F] transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Gekopieerd" : "Kopieer"}
        </button>
      </div>
      <div className="bg-[#141414] p-3 text-[10.5px] text-[#BFBFBF] leading-relaxed" style={{ fontFamily: "Fira Mono, monospace" }}>{children}</div>
    </div>
  );
};

export default SignalCheatsheet;
