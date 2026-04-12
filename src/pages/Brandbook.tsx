import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7 },
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="w-5 h-px bg-primary" />
    <span className="text-xs font-display font-semibold tracking-[0.14em] uppercase text-primary">
      {children}
    </span>
  </div>
);

const ColorSwatch = ({ name, hsl, hex, token, usage }: { name: string; hsl: string; hex: string; token: string; usage: string }) => {
  const [copied, setCopied] = useState(false);
  const copyHex = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="group">
      <button onClick={copyHex} className="w-full text-left">
        <div
          className="w-full aspect-[3/2] rounded-lg mb-3 border border-border transition-transform group-hover:scale-[1.02]"
          style={{ backgroundColor: hex }}
        />
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display font-semibold text-sm">{name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">{hex}</p>
            <p className="text-xs text-muted-foreground font-mono">{hsl}</p>
            <p className="text-xs text-muted-foreground mt-1">{token}</p>
          </div>
          <span className="text-muted-foreground mt-1">
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </span>
        </div>
      </button>
      <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">{usage}</p>
    </div>
  );
};

const PromptBlock = ({ label, content }: { label: string; content: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="p-5 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-display font-semibold tracking-[0.08em] uppercase text-primary">{label}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          {copied ? <><Check className="w-3 h-3" /> Gekopieerd</> : <><Copy className="w-3 h-3" /> Kopieer</>}
        </button>
      </div>
      <pre className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-mono">{content}</pre>
    </div>
  );
};

const Brandbook = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── COVER ── */}
      <section className="min-h-[70vh] flex flex-col justify-center bg-background px-6 md:px-16 lg:px-[72px] pt-32 pb-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-xs font-display tracking-[0.12em] uppercase text-foreground/40 mb-6 block">
            Brand Guide · 2025
          </span>
          <h1 className="font-display font-bold text-[clamp(2.4rem,5.5vw,5rem)] leading-[1.08] tracking-tight max-w-[820px]">
            B2B GroeiMachine
            <br />
            <span className="text-primary italic font-medium">Brand Guide.</span>
          </h1>
          <p className="mt-8 max-w-[520px] text-foreground/70 leading-relaxed">
            Visuele identiteit, tone of voice en richtlijnen voor consistente communicatie. Voor intern gebruik, partners en freelancers.
          </p>
        </motion.div>
      </section>

      {/* ── MERKIDENTITEIT ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b border-border">
        <SectionLabel>Merkidentiteit</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          Wie wij zijn.
        </h2>

        <div className="grid md:grid-cols-2 gap-12 max-w-[900px]">
          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p>
              <strong className="text-foreground font-medium">B2B GroeiMachine</strong> bouwt signal-based prospecting systems voor B2B-bedrijven in de Benelux. Wij zijn geen agency, geen toolverkoper, maar de architecten van voorspelbare commerciële groei.
            </p>
            <p>
              Powered by <strong className="text-foreground font-medium">Rebel Force</strong>. De sub-branding <strong className="text-foreground font-medium">RF×AI</strong> benadrukt de synergie tussen mens en machine.
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-5 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Naam</p>
              <p className="font-display font-semibold">B2B GroeiMachine</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Subtitel</p>
              <p className="font-display font-semibold">Signal-Based Prospecting Systems</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Sub-branding</p>
              <p className="font-display font-semibold">RF×AI <span className="font-normal text-muted-foreground text-sm">— Rebel Force × AI</span></p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Domein</p>
              <p className="font-display font-semibold">b2bgroeimachine.io</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── KLEUREN ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b border-border">
        <SectionLabel>Kleurenpalet</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-4">
          Donker, warm, professioneel.
        </h2>
        <p className="max-w-[520px] text-foreground/70 leading-relaxed mb-12">
          Een donker thema met warme terracotta-accenten. Klik op een kleur om de hex-code te kopiëren.
        </p>

        <h3 className="font-display font-semibold text-sm mb-6 text-foreground/60 uppercase tracking-[0.1em]">Primaire kleuren</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 max-w-[900px]">
          <ColorSwatch name="Background" hsl="0 0% 7%" hex="#121212" token="--background" usage="Hoofdachtergrond van alle pagina's." />
          <ColorSwatch name="Foreground" hsl="30 20% 92%" hex="#EEEAE4" token="--foreground" usage="Primaire tekst op donkere achtergrond." />
          <ColorSwatch name="Primary (Accent)" hsl="24 75% 63%" hex="#E8945A" token="--primary" usage="CTA-knoppen, links, highlights en accent-elementen." />
          <ColorSwatch name="Card" hsl="0 0% 10%" hex="#1A1A1A" token="--card" usage="Kaarten, dialogen en verhoogde oppervlakken." />
        </div>

        <h3 className="font-display font-semibold text-sm mb-6 text-foreground/60 uppercase tracking-[0.1em]">Ondersteunende kleuren</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[900px]">
          <ColorSwatch name="Secondary" hsl="0 0% 14%" hex="#242424" token="--secondary" usage="Alternatieve secties en hover-states." />
          <ColorSwatch name="Muted" hsl="0 0% 16%" hex="#292929" token="--muted" usage="Subtiele achtergronden en disabled states." />
          <ColorSwatch name="Muted Text" hsl="30 10% 55%" hex="#998D7D" token="--muted-foreground" usage="Labels, captions en secundaire tekst." />
          <ColorSwatch name="Border" hsl="0 0% 18%" hex="#2E2E2E" token="--border" usage="Scheidingslijnen en kaartranden." />
        </div>

        <div className="mt-14 max-w-[620px]">
          <h3 className="font-display font-semibold text-sm mb-4">Gradients & Effecten</h3>
          <div className="space-y-3">
            <PromptBlock label="Glow gradient" content="radial-gradient(ellipse 600px 400px at 50% 0%, hsl(24 75% 63% / 0.15), transparent)" />
            <PromptBlock label="Card gradient" content="linear-gradient(135deg, hsl(0 0% 12%), hsl(0 0% 9%))" />
            <PromptBlock label="Text gradient" content="linear-gradient(135deg, hsl(24 85% 58%), hsl(30 90% 65%))" />
            <PromptBlock label="Glow shadow" content="0 0 60px -20px hsl(24 75% 63% / 0.3)" />
          </div>
        </div>
      </motion.section>

      {/* ── TYPOGRAFIE ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 bg-secondary/50 border-b border-border">
        <SectionLabel>Typografie</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          Twee fonts. Twee rollen.
        </h2>

        <div className="grid md:grid-cols-2 gap-12 max-w-[900px]">
          <div>
            <div className="p-8 rounded-lg border border-border bg-background mb-4">
              <p className="font-display text-4xl font-bold tracking-tight mb-2">Space Grotesk</p>
              <p className="font-display text-lg text-muted-foreground">ABCDEFGHIJKLM</p>
              <p className="font-display text-lg text-muted-foreground">abcdefghijklm</p>
              <p className="font-display text-lg text-muted-foreground">0123456789</p>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.1em] mb-2">Display font</p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Gebruikt voor koppen (H1 tot H6), labels, navigatie, knoppen en sectie-titels. Gewichten: 400, 500, 600, 700.
            </p>
          </div>
          <div>
            <div className="p-8 rounded-lg border border-border bg-background mb-4">
              <p className="font-body text-4xl font-semibold tracking-tight mb-2">Inter</p>
              <p className="font-body text-lg text-muted-foreground">ABCDEFGHIJKLM</p>
              <p className="font-body text-lg text-muted-foreground">abcdefghijklm</p>
              <p className="font-body text-lg text-muted-foreground">0123456789</p>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.1em] mb-2">Body font</p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Gebruikt voor lopende tekst, paragrafen, beschrijvingen en formulieren. Gewichten: 300, 400, 500, 600.
            </p>
          </div>
        </div>

        <div className="mt-14 max-w-[900px]">
          <h3 className="font-display font-semibold text-sm mb-6 text-foreground/60 uppercase tracking-[0.1em]">Typografische schaal</h3>
          <div className="space-y-6 border-t border-border pt-6">
            {[
              { label: "H1", size: "clamp(2.4rem, 5.5vw, 5rem)", weight: "700", example: "Voorspelbare Groei." },
              { label: "H2", size: "clamp(1.8rem, 3.5vw, 2.8rem)", weight: "700", example: "Wij bouwen systemen." },
              { label: "H3", size: "1.125rem (18px)", weight: "600", example: "Directe waarde" },
              { label: "Body", size: "1rem (16px)", weight: "400", example: "De meeste B2B-bedrijven groeien op geluk, niet op systeem." },
              { label: "Small / Caption", size: "0.875rem (14px)", weight: "400", example: "Labels en secundaire tekst" },
              { label: "Micro / Tag", size: "0.75rem (12px)", weight: "600", example: "SECTION LABEL" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 pb-6 border-b border-border last:border-0">
                <span className="font-display font-semibold text-xs text-primary w-24 shrink-0 uppercase tracking-wider">{t.label}</span>
                <div className="flex-1">
                  <p className="font-display text-foreground" style={{ fontSize: t.label === "Body" || t.label === "Small / Caption" ? undefined : undefined, fontWeight: Number(t.weight) }}>
                    {t.example}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t.size} · weight {t.weight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── TONE OF VOICE ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b border-border">
        <SectionLabel>Tone of Voice</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          Direct, concreet, rustig zelfverzekerd.
        </h2>

        <div className="max-w-[620px] space-y-5 text-foreground/80 leading-relaxed mb-12">
          <p>
            Wij schrijven op <strong className="text-foreground font-medium">B1-taalniveau</strong>. Korte zinnen, maximaal 12 woorden. Concrete taal zonder abstract zakelijk jargon. Directe aanspreking met 'u' en 'uw'.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mb-12">
          <div className="p-6 rounded-lg border border-primary/20 bg-primary/5">
            <h3 className="text-xs font-display font-semibold tracking-[0.08em] uppercase text-primary mb-4">✓ Wel</h3>
            <ul className="space-y-3 text-sm text-foreground/80 leading-relaxed">
              <li>Korte zinnen, maximaal 12 woorden.</li>
              <li>Getallen voluit: "3 tot 5" in plaats van "3-5".</li>
              <li>Komma's en dubbele punten, geen em-dashes (—).</li>
              <li>Concrete voorbeelden boven abstracte beloftes.</li>
              <li>"Wij bouwen systemen" niet "wij bieden oplossingen".</li>
              <li>Aanspreking met 'u' en 'uw'.</li>
            </ul>
          </div>
          <div className="p-6 rounded-lg border border-destructive/20 bg-destructive/5">
            <h3 className="text-xs font-display font-semibold tracking-[0.08em] uppercase text-destructive mb-4">✗ Niet</h3>
            <ul className="space-y-3 text-sm text-foreground/80 leading-relaxed">
              <li>Geen buzzwords: "synergie", "next-level", "disruptief".</li>
              <li>Geen vage beloftes over aantallen meetings.</li>
              <li>Geen overmatig gebruik van streepjes (—).</li>
              <li>Geen "je/jij" tenzij in informele cheatsheets.</li>
              <li>Geen ellipsen (...) in koppen.</li>
              <li>Geen superlatieven zonder bewijs.</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[900px]">
          <h3 className="font-display font-semibold text-sm mb-4">Kernboodschappen</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Positionering", text: "Wij bouwen systemen, geen campagnes." },
              { label: "Instap", text: "€0 opstartkosten, operationeel in 4 weken." },
              { label: "Pricing", text: "Transparante uurtarieven, startend bij €100/u." },
            ].map((msg) => (
              <div key={msg.label} className="p-5 rounded-lg border border-border bg-card">
                <p className="text-xs text-muted-foreground mb-2">{msg.label}</p>
                <p className="font-display font-semibold text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── COMPONENTEN ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 bg-secondary/50 border-b border-border">
        <SectionLabel>UI Componenten</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          Knoppen, kaarten en patronen.
        </h2>

        <div className="max-w-[900px] space-y-12">
          {/* Buttons */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-6 text-foreground/60 uppercase tracking-[0.1em]">Knoppen</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="hero" size="lg">Primary CTA</Button>
              <Button variant="heroOutline" size="lg">Secondary CTA</Button>
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Section Label */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-6 text-foreground/60 uppercase tracking-[0.1em]">Sectielabels</h3>
            <div className="flex items-center gap-3">
              <div className="w-5 h-px bg-primary" />
              <span className="text-xs font-display font-semibold tracking-[0.14em] uppercase text-primary">
                Sectienaam
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Streepje (5px breed) + uppercase label in Space Grotesk, tracking 0.14em.</p>
          </div>

          {/* Pull Quote */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-6 text-foreground/60 uppercase tracking-[0.1em]">Pull Quote</h3>
            <div className="border-l-[3px] border-primary pl-8">
              <p className="font-display text-xl md:text-2xl font-medium leading-relaxed italic text-foreground">
                Pipeline opbouwen is geen talent-kwestie, het is een systeemvraagstuk.
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">3px border-left in primary. Space Grotesk, italic, medium.</p>
          </div>

          {/* Card */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-6 text-foreground/60 uppercase tracking-[0.1em]">Kaarten</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-[600px]">
              <div className="p-6 rounded-lg border border-glow card-gradient">
                <h4 className="text-xs font-display font-semibold tracking-[0.08em] uppercase text-primary mb-3">Card Title</h4>
                <p className="text-sm text-foreground/75 leading-relaxed">Gradient achtergrond met subtiele glow-rand. Gebruikt voor feature-blokken.</p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h4 className="text-xs font-display font-semibold tracking-[0.08em] uppercase text-primary mb-3">Flat Card</h4>
                <p className="text-sm text-foreground/75 leading-relaxed">Effen achtergrond met standaard border. Gebruikt voor info-blokken.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── LAYOUT REGELS ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b border-border">
        <SectionLabel>Layout & Spacing</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          Regels voor consistentie.
        </h2>

        <div className="max-w-[900px]">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "Max breedte content", value: "620px (tekst), 900px (grids)" },
              { label: "Horizontale padding", value: "24px (mobiel), 64px (tablet), 72px (desktop)" },
              { label: "Verticale sectie-padding", value: "80px tot 96px (py-20 / py-24)" },
              { label: "Border radius", value: "0.5rem (8px) — var(--radius)" },
              { label: "Sectiescheiding", value: "1px border in --border kleur of achtergrondwisseling" },
              { label: "Grid gap", value: "24px (gap-6) voor kaarten, 48px (gap-12) voor kolommen" },
              { label: "Animatie", value: "Framer Motion fade-in, 0.7s, viewport-triggered" },
              { label: "Container max", value: "1400px gecentreerd (2xl breakpoint)" },
            ].map((rule) => (
              <div key={rule.label} className="p-5 rounded-lg border border-border bg-card">
                <p className="text-xs text-muted-foreground mb-1">{rule.label}</p>
                <p className="font-display font-semibold text-sm">{rule.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── CSS TOKENS ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 bg-secondary/50">
        <SectionLabel>Design Tokens</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-4">
          Kopieer en plak.
        </h2>
        <p className="max-w-[520px] text-foreground/70 leading-relaxed mb-10">
          Alle CSS custom properties die het design systeem aansturen.
        </p>

        <div className="max-w-[700px]">
          <PromptBlock
            label="CSS Custom Properties"
            content={`:root {
  --background: 0 0% 7%;
  --foreground: 30 20% 92%;
  --primary: 24 75% 63%;
  --primary-foreground: 0 0% 7%;
  --secondary: 0 0% 14%;
  --muted: 0 0% 16%;
  --muted-foreground: 30 10% 55%;
  --card: 0 0% 10%;
  --border: 0 0% 18%;
  --radius: 0.5rem;

  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
}`}
          />
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Brandbook;
