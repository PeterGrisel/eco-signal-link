import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const PullQuote = ({ children, inverted = false }: { children: React.ReactNode; inverted?: boolean }) => (
  <div className={`border-l-[3px] ${inverted ? "border-primary/60" : "border-primary"} pl-8 my-12`}>
    <p className={`font-display text-xl md:text-2xl font-medium leading-relaxed italic ${inverted ? "text-foreground" : "text-foreground"}`}>
      {children}
    </p>
  </div>
);

const Brandstory = () => {
  return (
    <div className="min-h-screen">
      {/* ── COVER ── */}
      <section className="min-h-screen flex flex-col justify-between bg-background px-6 md:px-16 lg:px-[72px] py-14">
        <div className="flex justify-between items-start">
          <div className="font-display font-medium text-base tracking-wide text-foreground/90">
            <span className="text-foreground">B2B</span>
            <span className="text-primary">GroeiMachine</span>
          </div>
          <span className="text-xs font-display tracking-[0.12em] uppercase text-foreground/40">
            Brandstory
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col justify-center py-16 md:py-20"
        >
          <h1 className="font-display font-bold text-[clamp(2.4rem,5.5vw,5rem)] leading-[1.08] tracking-tight max-w-[820px]">
            Voorspelbare Groei.
            <br />
            <span className="text-primary italic font-medium">Zonder Gokken.</span>
          </h1>
          <p className="mt-10 text-xs tracking-[0.1em] uppercase text-foreground/45">
            B2BGroeiMachine · 2025
          </p>
        </motion.div>

        <div className="flex justify-between items-end pt-8 border-t border-foreground/10">
          <p className="text-xs text-foreground/30 leading-relaxed">
            Vertrouwelijk · Intern document
            <br />
            b2bgroeimachine.io
          </p>
          <p className="text-xs text-foreground/30 leading-relaxed text-right">
            Signal-Based Prospecting Systems
            <br />
            powered by Rebel Force
          </p>
        </div>
      </section>

      {/* ── DE UITDAGING ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b border-border">
        <SectionLabel>De uitdaging</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          De meeste B2B-bedrijven groeien op
          <br />
          <span className="text-primary italic font-medium">geluk, niet op systeem.</span>
        </h2>

        <div className="max-w-[620px] space-y-5 text-foreground/80 leading-relaxed">
          <p>
            Commerciële groei hangt in de meeste organisaties af van een handvol mensen. De beste salesperson kent de markt, voelt timing aan, weet wie te bellen. Maar zodra die persoon vertrekt, vertrekt de pipeline mee.
          </p>
          <p>
            Elke nieuwe medewerker begint opnieuw. Elke tool wordt losstaand ingezet. Elk kanaal draait op eigen kracht, zonder verbinding met het grotere geheel.
          </p>
        </div>

        <PullQuote>
          Pipeline opbouwen is geen talent-kwestie, het is een systeemvraagstuk.
        </PullQuote>

        <div className="max-w-[620px] text-foreground/80 leading-relaxed">
          <p>
            Het probleem is niet dat bedrijven te weinig doen. Het probleem is dat alles <strong className="text-foreground font-medium">los van elkaar</strong> draait, zonder compounding effect.
          </p>
        </div>
      </motion.section>

      {/* ── DE FOUT IN HET SYSTEEM ── */}
      <motion.section
        {...fadeIn}
        className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 bg-secondary/50"
      >
        <SectionLabel>De fout in het systeem</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          Twee manieren om te falen.
          <br />
          <span className="text-primary italic font-medium">Eén overlookt patroon.</span>
        </h2>

        <div className="max-w-[620px] text-foreground/80 leading-relaxed">
          <p>
            Organisaties investeren in tooling, hiring en agencies in de hoop grip te krijgen op hun pipeline. Maar de meeste mislukken, niet door de verkeerde tool, maar door het ontbreken van een systeem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 mt-10 max-w-[700px]">
          <div>
            <h3 className="text-xs tracking-[0.1em] uppercase text-foreground/50 font-display mb-3">
              Toolfout
            </h3>
            <p className="text-foreground/75 leading-relaxed italic font-display">
              "We gebruiken Apollo, Instantly en LinkedIn, maar niets hangt samen." Herkenbaar. Oplosbaar met integratie.
            </p>
          </div>
          <div>
            <h3 className="text-xs tracking-[0.1em] uppercase text-foreground/50 font-display mb-3">
              Systeemfout, de echte vijand
            </h3>
            <p className="text-foreground/75 leading-relaxed italic font-display">
              "We doen van alles, maar we weten niet wat werkt." Geen feedback loop. Geen kwalificatie. Geen compounding.
            </p>
          </div>
        </div>

        <PullQuote inverted>
          "Genereer jij leads, of bouw je een systeem dat voorspelbaar pipeline creëert?"
        </PullQuote>
      </motion.section>

      {/* ── ONZE AANPAK ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b border-border">
        <SectionLabel>Onze aanpak</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          Wij bouwen systemen.
          <br />
          <span className="text-primary italic font-medium">U plukt de vruchten.</span>
        </h2>

        <div className="max-w-[620px] space-y-5 text-foreground/80 leading-relaxed">
          <p>
            De meeste agencies leveren leads. Wij leveren een machine. Een signaalgebaseerd systeem dat prospects identificeert op het juiste moment, via het juiste kanaal, met de juiste boodschap.
          </p>
          <p>
            Geen koude lijsten. Geen spray-and-pray. Maar een proces dat elke dag slimmer wordt doordat het leert van data, signalen en resultaten.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12 mt-14 max-w-[900px]">
          {[
            {
              num: "01",
              title: "Proces opzetten",
              desc: "ICP-mapping, signaalconfiguratie, kanaalopzet en outreach-flows. Het fundament van uw groei-systeem.",
            },
            {
              num: "02",
              title: "Data laten werken",
              desc: "Elk signaal, elke interactie, elk resultaat bouwt context op. De Datahub wordt uw commerciële geheugen.",
            },
            {
              num: "03",
              title: "Resultaat compoundt",
              desc: "Hoe langer het draait, hoe preciezer de targeting, hoe hoger de conversie. Uw systeem wordt met de dag sterker.",
            },
          ].map((pillar) => (
            <div key={pillar.num} className="pt-6 border-t border-border">
              <span className="font-display text-3xl text-border font-light leading-none mb-4 block">
                {pillar.num}
              </span>
              <h3 className="font-display font-semibold text-sm mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── HET SYSTEEM ── */}
      <motion.section
        {...fadeIn}
        className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 bg-card/50 border-b border-border"
      >
        <SectionLabel>Het systeem</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          Vier lagen.
          <br />
          <span className="text-primary italic font-medium">Eén geïntegreerd systeem.</span>
        </h2>

        <div className="max-w-[620px] text-foreground/80 leading-relaxed mb-12">
          <p>
            B2BGroeiMachine werkt niet met losse campagnes. Het systeem bestaat uit vier lagen die samenwerken, van signaaldetectie tot gekwalificeerde meeting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-[860px]">
          {[
            {
              label: "Laag 1: Signaaldetectie",
              text: "Intent-data, websitebezoek, jobtriggers, funding-signalen, LinkedIn-activiteit. Wij detecteren wanneer prospects in-market zijn.",
            },
            {
              label: "Laag 2: Kwalificatie & Scoring",
              text: "Elk signaal wordt gescoord op relevantie, timing en fit. Alleen de sterkste signalen worden opgepakt.",
            },
            {
              label: "Laag 3: Omnichannel Outreach",
              text: "6 tot 8 touchpoints via e-mail, LinkedIn, telefoon en video. Gepersonaliseerd op basis van het signaal dat de sequence triggerde.",
            },
            {
              label: "Laag 4: Datahub & Context",
              text: "Alle interacties, signalen en resultaten stromen terug naar de Datahub. Het systeem leert, optimaliseert en compound.",
            },
          ].map((layer) => (
            <div key={layer.label} className="p-6 rounded-lg border border-glow card-gradient">
              <h3 className="text-xs font-display font-semibold tracking-[0.08em] uppercase text-primary mb-3">
                {layer.label}
              </h3>
              <p className="text-sm text-foreground/75 leading-relaxed">{layer.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── HET VLIEGWIEL ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 bg-secondary/50">
        <SectionLabel>Het vliegwiel</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          U start met outreach.
          <br />
          <span className="text-primary italic font-medium">Op een gegeven moment vindt de pipeline u.</span>
        </h2>

        <div className="max-w-[620px] space-y-5 text-foreground/80 leading-relaxed">
          <p>
            Fase 1: wij bouwen het systeem en de eerste signalen worden opgepakt. Directe waarde, binnen vier weken operationeel.
          </p>
          <p>
            Fase 2: het systeem begint zelf te signaleren. Proactief, contextueel, actiegericht. Het moment dat het systeem een opportunity detecteert die u zelf nog niet zag, dát is het omslagpunt.
          </p>
        </div>

        <PullQuote inverted>
          "Prospect X heeft drie keer uw pricing-pagina bezocht, matcht uw ICP en heeft recent funding opgehaald. Wil u dit oppakken?"
        </PullQuote>

        <div className="max-w-[620px] text-foreground/80 leading-relaxed">
          <p>
            Het doel is niet meer leads genereren. <strong className="text-foreground font-medium">Het doel is een systeem dat voorspelbaar de juiste gesprekken creëert.</strong>
          </p>
        </div>
      </motion.section>

      {/* ── DRIE HORIZONTEN ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b border-border">
        <SectionLabel>Het pad</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          Drie horizonten.
          <br />
          <span className="text-primary italic font-medium">Eén richting.</span>
        </h2>

        <div className="max-w-[620px] text-foreground/80 leading-relaxed mb-12">
          <p>B2BGroeiMachine groeit mee met uw organisatie. We verkopen het pad, niet het eindpunt.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border max-w-[900px] rounded-lg overflow-hidden">
          {[
            {
              tag: "H1 · Start",
              title: "Directe waarde",
              desc: "Signaaldetectie, outreach-flows, ICP-targeting en kwalificatie. Operationeel in vier weken, meetbare pipeline vanaf maand één.",
            },
            {
              tag: "H2 · Scale",
              title: "Operationele grip",
              desc: "Datahub, intent-scoring, multi-channel automatisering en nurturing. Het systeem dat zichzelf optimaliseert.",
            },
            {
              tag: "H3 · Compound",
              title: "Voorspelbare groei",
              desc: "AI-gedreven signalering, autonome workflows en een commercieel geheugen dat elke interactie verrijkt.",
            },
          ].map((h) => (
            <div key={h.tag} className="bg-background p-7 md:p-8">
              <span className="text-[11px] font-display font-semibold tracking-[0.12em] uppercase text-primary mb-4 block">
                {h.tag}
              </span>
              <h3 className="font-display font-semibold text-lg mb-2">{h.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── VOOR WIE ── */}
      <motion.section {...fadeIn} className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b border-border">
        <SectionLabel>De markt</SectionLabel>
        <h2 className="font-display font-bold text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.18] tracking-tight max-w-[680px] mb-10">
          Drie typen bedrijven.
          <br />
          <span className="text-primary italic font-medium">Eén gemeenschappelijke pijn.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12 mt-6 max-w-[900px]">
          {[
            {
              num: "A",
              title: "Klaar met losse agencies",
              desc: "Betaalt al jaren voor leads die niet converteren. Wil toewerken naar een systeem dat zelf pipeline genereert.",
            },
            {
              num: "B",
              title: "Commercieel team versterken",
              desc: "Heeft ambitie maar geen sales-ops capaciteit. Wil dat het team focust op gesprekken, niet op prospecting.",
            },
            {
              num: "C",
              title: "Volledig uitbesteden",
              desc: "Wil het volledige commerciële proces uitbesteden. Van strategie tot uitvoering, van signaal tot meeting.",
            },
          ].map((seg) => (
            <div key={seg.num} className="pt-6 border-t border-border">
              <span className="font-display text-3xl text-border font-light leading-none mb-4 block">
                {seg.num}
              </span>
              <h3 className="font-display font-semibold text-sm mb-2">{seg.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{seg.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-[620px] text-foreground/80 leading-relaxed mt-14">
          <p>
            B2BGroeiMachine richt zich op B2B-organisaties in de Benelux die serieuze groeiambities hebben maar niet de infrastructuur om die structureel waar te maken. IT, SaaS, consultancy, manufacturing, professionele dienstverlening.
          </p>
        </div>
      </motion.section>

      {/* ── CLOSING ── */}
      <section className="px-6 md:px-16 lg:px-[72px] py-20 md:py-24 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-10"
        >
          <h2 className="font-display font-bold text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.3] tracking-tight max-w-[600px]">
            Wij bouwen systemen die{" "}
            <span className="text-primary italic font-medium">compounding</span> zijn,
            waarbij elk signaal, elke interactie en elk resultaat de volgende stap sterker maakt.
          </h2>

          <div className="max-w-[540px]">
            <p className="text-foreground/55 leading-relaxed">
              Niet als agency die na drie maanden vertrekt. Niet als toolverkoper die u een dashboard geeft.
              Maar als het systeem dat onderdeel wordt van hoe uw organisatie groeit, en elke maand een stukje meer doet.
            </p>
          </div>

          <div className="mt-4">
            <Button variant="hero" size="lg" asChild>
              <a
                href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                Plan een Gesprek
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="flex justify-between items-end pt-7 border-t border-foreground/10 mt-6">
            <span className="text-xs text-foreground/30">
              <span className="text-foreground/50">B2B</span>
              <span className="text-primary/50">GroeiMachine</span>
              {" "}· b2bgroeimachine.io
            </span>
            <span className="text-xs text-foreground/30">
              Voorspelbare Groei. Zonder Gokken.
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Brandstory;
