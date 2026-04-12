import { useEffect } from "react";
import b2bLogo from "@/assets/b2b_logo_nieuw.png";

const SignalCheatsheet = () => {
  useEffect(() => {
    document.title = "Claude × Apollo — Signal Cheatsheet | B2BGroeiMachine";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Van marktsignaal naar persoonlijke outreach — zonder developer, zonder koppeling. Signal prospecting cheatsheet.");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#0B0B0B", color: "#FFFFFF", fontFamily: "'Fira Sans', sans-serif", fontSize: "13px", lineHeight: 1.6 }}>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Fira+Sans:wght@400;500;600;700&family=Fira+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div className="flex items-start justify-between gap-6" style={{ background: "#0B0B0B", padding: "36px 48px 28px", borderBottom: "1px solid #222" }}>
        <div className="flex flex-col gap-2">
          <img src={b2bLogo} alt="B2B GroeiMachine" style={{ height: 32, width: "auto", marginBottom: 8, objectFit: "contain" }} />
          <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: 38, textTransform: "uppercase", lineHeight: .92, letterSpacing: ".01em" }}>
            CLAUDE × APOLLO<br /><span style={{ color: "#E3874F" }}>SIGNAL PROSPECTING</span>
          </h1>
          <p style={{ fontSize: 13, color: "#BFBFBF", marginTop: 4 }}>Van marktsignaal naar persoonlijke outreach — zonder developer, zonder koppeling.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5" style={{ paddingTop: 4 }}>
          <div style={{ background: "#181818", border: "1px solid #222", borderRadius: 4, padding: "10px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "Anton, sans-serif", fontSize: 32, color: "#E3874F", lineHeight: 1 }}>15</div>
            <div style={{ fontSize: 10, color: "#666", letterSpacing: ".08em", textTransform: "uppercase" }}>minuten setup</div>
          </div>
          <span style={{ fontSize: 10, color: "#666", letterSpacing: ".06em" }}>b2bgroeimachine.io</span>
        </div>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ padding: "32px 48px 40px" }}>

        {/* FLOW - full width */}
        <Card title="De aanpak in 4 stappen" full>
          <div className="flex items-center justify-between">
            {[
              { icon: "🔌", name: "Connect", desc: "Claude + Apollo MCP" },
              { icon: "📡", name: "Signaal", desc: "Trigger definiëren" },
              { icon: "🤖", name: "Prompt", desc: "Claude filtert & schrijft" },
              { icon: "📨", name: "Actie", desc: "Sequence live in Apollo" },
            ].map((s, i) => (
              <div key={i} className="flex items-center">
                <div className="flex-1 text-center" style={{ padding: "12px 8px", background: "#141414", borderRadius: 4, border: "1px solid #1e1e1e", minWidth: 140 }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontFamily: "Anton, sans-serif", fontSize: 11, letterSpacing: ".05em", textTransform: "uppercase" }}>{s.name}</div>
                  <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>{s.desc}</div>
                </div>
                {i < 3 && <span style={{ fontFamily: "Anton, sans-serif", fontSize: 16, color: "#E3874F", padding: "0 6px" }}>→</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* SETUP */}
        <Card title="Setup (1x, duurt 10 min)">
          <div className="flex flex-col gap-2.5">
            {[
              { title: "Apollo account aanmaken", desc: "Nog geen account? Gebruik de link hieronder voor directe toegang.", link: "get.apollo.io/Your-b2b-link →" },
              { title: "Apollo connector activeren in Claude", desc: "Ga naar Claude.ai → Settings → Connectors → zoek Apollo.io → klik Connect. Klaar." },
              { title: "Test de verbinding", desc: 'Typ in Claude: "Zoek 5 directeuren in de logistiek in Nederland." Werkt het? Dan ben je live.' },
              { title: "Sla je ICP op", desc: "Beschrijf je ideale klant als tekst. Gebruik dit als context in elke prompt." },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#E3874F", color: "#0B0B0B", fontFamily: "Anton, sans-serif", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <div className="flex-1">
                  <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: "#BFBFBF", lineHeight: 1.5 }}>{s.desc}</div>
                  {s.link && <div style={{ color: "#E3874F", fontFamily: "Fira Mono, monospace", fontSize: 10 }}>{s.link}</div>}
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
              <div key={i} className="flex items-start gap-2.5" style={{ padding: "10px 12px", background: "#141414", borderRadius: 4, border: "1px solid #1e1e1e" }}>
                <div style={{ width: 28, height: 28, borderRadius: 4, background: "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{s.icon}</div>
                <div className="flex-1">
                  <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: "#666", lineHeight: 1.4 }}>{s.why}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 2, flexShrink: 0, ...(s.hot ? { background: "rgba(227,135,79,.15)", color: "#E3874F" } : { background: "rgba(255,255,255,.06)", color: "#888" }) }}>{s.hot ? "Hot" : "Warm"}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* PROMPTS - full width */}
        <Card title="Copy-paste prompts voor Claude" full>
          <div className="flex flex-col gap-2.5">
            <PromptBlock label="Prompt 1 — Prospects zoeken op signaal">
              Zoek in Apollo directeuren of operations managers bij bedrijven in de <strong>[sector]</strong> in Nederland, die de afgelopen <strong>[30/60/90 dagen]</strong> van baan zijn gewisseld. Bedrijfsgrootte: <strong>[X–Y medewerkers]</strong>. Geef naam, functie, bedrijf en LinkedIn-URL terug.
            </PromptBlock>
            <PromptBlock label="Prompt 2 — Outreach schrijven op basis van signaal">
              Schrijf een LinkedIn-bericht voor <strong>[naam]</strong>, die recent is gestart als <strong>[functie]</strong> bij <strong>[bedrijf]</strong>. Mijn aanbod: <strong>[korte beschrijving]</strong>. Toon: direct, geen complimenten, begin met een hypothese over hun situatie. Max 60 woorden.
            </PromptBlock>
            <PromptBlock label="Prompt 3 — Batch outreach (meerdere prospects tegelijk)">
              Hier zijn <strong>[X]</strong> prospects uit Apollo met elk hun signaal. Schrijf voor iedereen een apart LinkedIn-bericht van max 60 woorden. Gebruik hun signaal als haakje. Geen generieke openingen. Geen "ik zag dat je bij bedrijf X werkt."
            </PromptBlock>
          </div>
        </Card>

        {/* TEMPLATE - full width */}
        <Card title="Outreach template — bewezen structuur" full>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div style={{ background: "#1a1a1a", padding: "5px 12px", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#666", borderBottom: "1px solid #222", borderRadius: "4px 4px 0 0" }}>Template</div>
              <div style={{ background: "#141414", padding: "14px 16px", fontFamily: "Fira Mono, monospace", fontSize: 10.5, color: "#BFBFBF", lineHeight: 1.8, borderRadius: "0 0 4px 4px", whiteSpace: "pre-line" }}>
                <span style={{ color: "#E3874F" }}>[Naam]</span>, <span style={{ color: "#444" }}>// gebruik voornaam</span>{"\n\n"}
                Bedrijven in <span style={{ color: "#E3874F" }}>[sector]</span> die <span style={{ color: "#E3874F" }}>[signaal]</span>{"\n"}
                lopen vaak tegen <span style={{ color: "#E3874F" }}>[specifiek probleem]</span> aan.{"\n\n"}
                Wij lossen dat op met <span style={{ color: "#E3874F" }}>[aanpak in 1 zin]</span>.{"\n\n"}
                Herkenbaar?
              </div>
            </div>
            <div>
              <div style={{ background: "#1a1a1a", padding: "5px 12px", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#666", borderBottom: "1px solid #222", borderRadius: "4px 4px 0 0" }}>Ingevuld voorbeeld</div>
              <div style={{ background: "#141414", padding: "14px 16px", fontFamily: "Fira Mono, monospace", fontSize: 10.5, color: "#BFBFBF", lineHeight: 1.8, borderRadius: "0 0 4px 4px", whiteSpace: "pre-line" }}>
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
          <div style={{ marginTop: 16, padding: "14px 16px", background: "#141414", borderRadius: 4, borderLeft: "3px solid #E3874F" }}>
            <strong style={{ color: "#E3874F" }}>Regel #1</strong>{" "}
            <span style={{ fontSize: 11, color: "#BFBFBF" }}>Begin nooit met "Ik zag dat je bij bedrijf X werkt." Begin met hun situatie — niet met jouzelf. Timing is alles. Het signaal is jouw credentie.</span>
          </div>
        </Card>

        {/* CTA - full width */}
        <Card title="Wil je ook acties aanmaken direct in Apollo?" full accent>
          <p style={{ fontSize: 12, color: "#BFBFBF", marginBottom: 12 }}>
            Van prospect naar outreach — volledig geautomatiseerd. Sequences live zetten, taken aanmaken, follow-ups plannen. Stuur mij een bericht voor meer info.
          </p>
          <div className="flex items-center gap-4">
            <a href="/contact" style={{ display: "inline-block", background: "#E3874F", color: "#0B0B0B", padding: "8px 20px", borderRadius: 4, fontWeight: 700, fontSize: 12, textDecoration: "none" }}>Stuur een bericht →</a>
            <span style={{ fontSize: 10, color: "#666" }}>linkedin.com/in/petergrisel</span>
          </div>
        </Card>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center" style={{ borderTop: "1px solid #222", padding: "16px 48px" }}>
        <img src={b2bLogo} alt="B2B GroeiMachine" style={{ height: 24, width: "auto" }} />
        <div className="flex gap-6">
          <span style={{ fontSize: 10, color: "#666" }}>b2bgroeimachine.io</span>
          <span style={{ fontSize: 10, color: "#666" }}>info@rebelforce.nl</span>
          <span style={{ fontSize: 10, color: "#666" }}>+31 85 250 2925</span>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, children, full, accent }: { title: string; children: React.ReactNode; full?: boolean; accent?: boolean }) => (
  <div
    className={full ? "md:col-span-2" : ""}
    style={{
      background: "#181818",
      border: accent ? "1px solid #E3874F" : "1px solid #222",
      borderLeft: accent ? "3px solid #E3874F" : undefined,
      borderRadius: 6,
      padding: "20px 22px",
    }}
  >
    <div style={{ fontFamily: "Anton, sans-serif", fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "#E3874F", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ display: "inline-block", width: 3, height: 14, background: "#E3874F", borderRadius: 1 }} />
      {title}
    </div>
    {children}
  </div>
);

const PromptBlock = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ borderRadius: 4, overflow: "hidden" }}>
    <div style={{ background: "#1a1a1a", padding: "5px 12px", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#666", borderBottom: "1px solid #222" }}>{label}</div>
    <div style={{ background: "#141414", padding: "10px 12px", fontFamily: "Fira Mono, monospace", fontSize: 10.5, color: "#BFBFBF", lineHeight: 1.6 }}>{children}</div>
  </div>
);

export default SignalCheatsheet;
