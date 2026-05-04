import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ArrowLeft, Linkedin } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CheatsheetFeedback from "@/components/cheatsheet/CheatsheetFeedback";
import CheatsheetTrainingCta from "@/components/cheatsheet/CheatsheetTrainingCta";
import Footer from "@/components/Footer";

const MultichannelSequencing = () => {
  useEffect(() => {
    document.title = "Multi-channel Sequencing Playbook — Cheatsheet | B2BGroeiMachine";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "14-dagen multi-channel sequentie: e-mail, LinkedIn en calling gecombineerd. Templates per kanaal met exacte timing.");
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
            <span className="text-[9px] font-bold tracking-[.1em] uppercase bg-red-500/15 text-red-400 px-2 py-0.5 rounded-sm" style={{ fontFamily: "Fira Sans, sans-serif" }}>Expert</span>
          </div>
          <h1 className="text-3xl md:text-[38px] uppercase leading-[.92] tracking-[.01em] text-white" style={{ fontFamily: "Anton, sans-serif" }}>
            MULTI-CHANNEL<br /><span className="text-[#E3874F]">SEQUENCING PLAYBOOK</span>
          </h1>
          <p className="text-[13px] text-[#BFBFBF] mt-1">E-mail, LinkedIn en calling in één geautomatiseerde flow. 14 dagen, 9 touchpoints.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <div className="bg-[#181818] border border-[#222] rounded px-4 py-2.5 text-center">
            <div className="text-[32px] text-[#E3874F] leading-none" style={{ fontFamily: "Anton, sans-serif" }}>45</div>
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
              { icon: "📋", name: "Ontwerp", desc: "Sequentie plannen" },
              { icon: "📧", name: "E-mail", desc: "Instantly instellen" },
              { icon: "💼", name: "LinkedIn", desc: "Touchpoints plannen" },
              { icon: "📞", name: "Calling", desc: "Scripts schrijven" },
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

        {/* 14-DAGEN SCHEMA */}
        <Card title="14-dagen sequentie schema" full>
          <div className="flex flex-col gap-1.5">
            {[
              { dag: 1, kanaal: "📧 E-mail", actie: "Eerste e-mail: probleem + hypothese", kleur: "bg-blue-500/15 text-blue-400" },
              { dag: 2, kanaal: "💼 LinkedIn", actie: "Connectieverzoek met korte note", kleur: "bg-sky-500/15 text-sky-400" },
              { dag: 3, kanaal: "💼 LinkedIn", actie: "Like of reageer op hun recente post", kleur: "bg-sky-500/15 text-sky-400" },
              { dag: 5, kanaal: "📧 E-mail", actie: "Follow-up: case study of resultaat delen", kleur: "bg-blue-500/15 text-blue-400" },
              { dag: 7, kanaal: "📞 Calling", actie: "Eerste belpoging. Voicemail als geen gehoor", kleur: "bg-emerald-500/15 text-emerald-400" },
              { dag: 8, kanaal: "💼 LinkedIn", actie: "DM: refereer naar e-mail of voicemail", kleur: "bg-sky-500/15 text-sky-400" },
              { dag: 10, kanaal: "📧 E-mail", actie: "Waarde-mail: relevante insight of artikel", kleur: "bg-blue-500/15 text-blue-400" },
              { dag: 12, kanaal: "📞 Calling", actie: "Tweede belpoging. Andere tijd proberen", kleur: "bg-emerald-500/15 text-emerald-400" },
              { dag: 14, kanaal: "📧 E-mail", actie: "Break-up mail: laatste kans, geen druk", kleur: "bg-blue-500/15 text-blue-400" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-[#141414] rounded border border-[#1e1e1e]">
                <div className="w-8 h-8 rounded bg-[#E3874F]/15 flex items-center justify-center text-[11px] text-[#E3874F] font-bold flex-shrink-0" style={{ fontFamily: "Anton, sans-serif" }}>D{s.dag}</div>
                <span className={`text-[9px] font-bold tracking-[.08em] uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${s.kleur}`}>{s.kanaal}</span>
                <span className="text-[11px] text-[#BFBFBF]">{s.actie}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* E-MAIL TEMPLATES */}
        <Card title="E-mail templates (Instantly)" full>
          <div className="flex flex-col gap-2.5">
            <PromptBlock label="E-mail 1 — Eerste contact" text={`Onderwerp: [Signaal] bij [bedrijf]?\n\n[Voornaam],\n\nBedrijven in de [sector] die [signaal] meemaken lopen vaak tegen [probleem] aan.\n\nWij helpen [type bedrijf] dit oplossen door [aanpak in 1 zin].\n\nHerkenbaar? Dan plan ik graag 15 minuten in.\n\nGroet,\n[Jouw naam]`}>
              <strong>Onderwerp:</strong> [Signaal] bij [bedrijf]?{"\n\n"}
              [Voornaam],{"\n\n"}
              Bedrijven in de [sector] die [signaal] meemaken lopen vaak tegen [probleem] aan.{"\n\n"}
              Wij helpen [type bedrijf] dit oplossen door [aanpak in 1 zin].{"\n\n"}
              Herkenbaar? Dan plan ik graag 15 minuten in.{"\n\n"}
              Groet,{"\n"}[Jouw naam]
            </PromptBlock>
            <PromptBlock label="E-mail 2 — Follow-up met bewijs" text={`Onderwerp: Re: [Signaal] bij [bedrijf]?\n\n[Voornaam],\n\nKort voorbeeld: [klant] had hetzelfde probleem. Resultaat na [tijdframe]: [concreet resultaat].\n\nWil je zien hoe? 15 minuten, geen verplichtingen.\n\n[Jouw naam]`}>
              <strong>Onderwerp:</strong> Re: [Signaal] bij [bedrijf]?{"\n\n"}
              [Voornaam],{"\n\n"}
              Kort voorbeeld: [klant] had hetzelfde probleem. Resultaat na [tijdframe]: [concreet resultaat].{"\n\n"}
              Wil je zien hoe? 15 minuten, geen verplichtingen.{"\n\n"}
              [Jouw naam]
            </PromptBlock>
            <PromptBlock label="E-mail 3 — Break-up" text={`Onderwerp: Laatste check\n\n[Voornaam],\n\nIk heb een paar keer contact gezocht. Geen reactie is ook een antwoord.\n\nMocht [probleem] later spelen: dit mailtje staat altijd open.\n\nSucces,\n[Jouw naam]`}>
              <strong>Onderwerp:</strong> Laatste check{"\n\n"}
              [Voornaam],{"\n\n"}
              Ik heb een paar keer contact gezocht. Geen reactie is ook een antwoord.{"\n\n"}
              Mocht [probleem] later spelen: dit mailtje staat altijd open.{"\n\n"}
              Succes,{"\n"}[Jouw naam]
            </PromptBlock>
          </div>
        </Card>

        {/* CALLING SCRIPTS */}
        <Card title="Calling scripts" full>
          <div className="flex flex-col gap-2.5">
            <PromptBlock label="Script — Eerste belpoging" text={`"Hoi [voornaam], je spreekt met [jouw naam] van [bedrijf]. Ik bel even kort. Ik werk met bedrijven in de [sector] die [probleem] ervaren. Is dat iets wat bij jullie speelt? ... [Ja/Nee] ... Dan stel ik voor dat we 15 minuten inplannen om te kijken of het relevant is. Wat past deze week?"`}>
              "Hoi <strong>[voornaam]</strong>, je spreekt met <strong>[jouw naam]</strong> van <strong>[bedrijf]</strong>. Ik bel even kort. Ik werk met bedrijven in de <strong>[sector]</strong> die <strong>[probleem]</strong> ervaren. Is dat iets wat bij jullie speelt? ... Dan stel ik voor dat we 15 minuten inplannen. Wat past deze week?"
            </PromptBlock>
            <PromptBlock label="Script — Voicemail" text={`"Hoi [voornaam], [jouw naam] hier van [bedrijf]. Ik stuurde je eerder een mail over [onderwerp]. Ik bel even kort om te checken of het relevant is. Bel me gerust terug op [nummer], of reageer op mijn mail. Fijne dag."`}>
              "Hoi <strong>[voornaam]</strong>, <strong>[jouw naam]</strong> hier van <strong>[bedrijf]</strong>. Ik stuurde je eerder een mail over <strong>[onderwerp]</strong>. Ik bel even kort om te checken of het relevant is. Bel me gerust terug op <strong>[nummer]</strong>, of reageer op mijn mail. Fijne dag."
            </PromptBlock>
          </div>
        </Card>

        <CheatsheetTrainingCta variant="compact" trackLabel="Cheatsheet Mid CTA — Multichannel" />

        {/* INSTANTLY SETUP */}
        <Card title="Instantly setup checklist">
          <div className="flex flex-col gap-2.5">
            {[
              { title: "Domein opwarmen", desc: "Minimaal 2 weken warming. Start met 5 mails per dag, bouw op naar 30." },
              { title: "E-mail account koppelen", desc: "Gebruik een apart domein voor outreach. Nooit je hoofddomein." },
              { title: "Lead list uploaden", desc: "CSV met naam, e-mail, bedrijf, sector, signaal. Personalisatie-velden meegeven." },
              { title: "Sequence instellen", desc: "3 e-mails, verspreid over 14 dagen. A/B test onderwerp-regels." },
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

        {/* APOLLO SETUP */}
        <Card title="Apollo setup voor sequences">
          <div className="flex flex-col gap-2.5">
            {[
              { title: "Prospect lijst opbouwen", desc: "Gebruik je ICP filters. Exporteer als CSV of koppel direct aan Instantly." },
              { title: "Signaal-filters activeren", desc: "Nieuwe functie, funding, hiring. Sla als 'Saved Search' op." },
              { title: "Contactgegevens verifiëren", desc: "Apollo verifieert e-mails automatisch. Filter op 'Verified' voor hogere deliverability." },
              { title: "Wekelijks verversen", desc: "Nieuwe prospects verschijnen continu. Check je Saved Search elke maandag." },
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
          <div className="mt-3">
            <a href="https://get.apollo.io/Your-b2b-link" target="_blank" rel="noopener noreferrer" className="text-[#E3874F] hover:underline text-[10px]" style={{ fontFamily: "Fira Mono, monospace" }}>
              get.apollo.io →
            </a>
          </div>
        </Card>

        {/* KPI's */}
        <Card title="KPI's om te meten" full>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Open rate", target: "> 50%", desc: "E-mail geopend" },
              { label: "Reply rate", target: "> 5%", desc: "Reacties op e-mail" },
              { label: "LinkedIn accept", target: "> 30%", desc: "Connectieverzoeken geaccepteerd" },
              { label: "Call connect", target: "> 15%", desc: "Gesprekken gevoerd" },
              { label: "Meeting booked", target: "> 3%", desc: "Afspraken ingepland" },
              { label: "Bounce rate", target: "< 3%", desc: "E-mails niet bezorgd" },
              { label: "Unsubscribe", target: "< 1%", desc: "Opt-outs per campagne" },
              { label: "Touches tot deal", target: "6 tot 9", desc: "Gemiddeld aantal contactmomenten" },
            ].map((s, i) => (
              <div key={i} className="p-3 bg-[#141414] rounded border border-[#1e1e1e] text-center">
                <div className="text-[11px] font-semibold mb-0.5">{s.label}</div>
                <div className="text-[#E3874F] text-sm font-bold" style={{ fontFamily: "Anton, sans-serif" }}>{s.target}</div>
                <div className="text-[10px] text-[#666] mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* FEEDBACK */}
        <CheatsheetFeedback slug="multichannel-sequencing" />

        {/* TRAINING UPSELL */}
        <CheatsheetTrainingCta />

        {/* CTA */}
        <Card title="Wil je een multi-channel machine laten bouwen?" full accent>
          <p className="text-xs text-[#BFBFBF] mb-3">
            Wij bouwen volledige outbound systemen: Apollo prospecting, Instantly e-mail, LinkedIn touchpoints en calling flows. Volledig geautomatiseerd.
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

export default MultichannelSequencing;
