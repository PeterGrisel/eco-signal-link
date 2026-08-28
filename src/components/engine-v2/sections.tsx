import { GiantWord } from "@/components/v2/GiantWord";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";

/**
 * De verdiepingssecties van /de-engine.
 *
 * Deze stonden eerder op de homepage. Ze zijn te specialistisch voor een eerste
 * bezoek maar te waardevol om weg te gooien: samen vormen ze de technische
 * onderbouwing waar de homepage naartoe linkt en die u na een salesgesprek
 * doorstuurt.
 */

/* ── De opportunity-taxonomie ──────────────────────────────────────────── */

export function Taxonomie() {
  const routes = [
    ["Acquisition", "Bestaand aanbod, nieuw account."],
    ["Market expansion", "Bestaand aanbod, nieuwe sector, regio of land."],
    ["Product expansion", "Nieuwe propositie voor een bestaande markt."],
    ["Account expansion", "Cross-sell, upsell of een nieuwe toepassing bij bestaande klanten."],
    ["Operational trigger", "Groei, verhuizing, investering, nieuwe vestiging of capaciteit."],
    ["Replacement", "Een systeem, contract of technologie bereikt een vervangingsmoment."],
    ["Regulatory", "Nieuwe wetgeving, normering of compliance creëert noodzaak."],
    ["Technology", "Nieuwe technologie verandert de businesscase of het probleem."],
    ["Partner", "Een partner creëert een nieuwe route naar accounts of use cases."],
    ["New use case", "Een bestaand probleem wordt met een nieuwe oplossing relevant."],
  ];
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="De opportunity-taxonomie"
        title="Tien routes naar waarde."
        lead="Wie groei ziet als het converteren van bestaande vraag, vist steeds efficiënter in dezelfde vijver. Opportunities zijn veel minder begrensd. De taxonomie is geen eindlijst: per klant en per markt breiden wij hem uit. Juist daar zit uw commerciële IP."
      />
      <div className="grid gap-x-10 gap-y-0 border-t border-brand-line md:grid-cols-2">
        {routes.map(([name, body], i) => (
          <Reveal
            key={name}
            index={i}
            className="flex gap-5 border-b border-brand-line py-5"
          >
            <span className="w-7 shrink-0 pt-0.5 font-display text-[11px] font-semibold tracking-[0.14em] text-brand-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="mb-1 font-display text-[16px] font-semibold tracking-tight">
                {name}
              </h3>
              <p className="text-sm leading-relaxed text-brand-ink-2">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── De referentiearchitectuur ─────────────────────────────────────────── */

export function Architectuur() {
  const lagen = [
    {
      n: "1",
      title: "Data",
      body: "Acquisitie uit registers zoals de KvK, plus Apollo, Clay, LinkedIn, websites, vacatures, sectorbronnen en uw eigen klantdata.",
    },
    {
      n: "2",
      title: "Context",
      body: "Normaliseren, personen koppelen, technologie herkennen, classificeren en ontdubbelen, rond de objecten account en opportunity.",
    },
    {
      n: "3",
      title: "Intelligence",
      body: "Fit, opportunity-hypotheses, evidence, timing en probability. Hier wordt bepaald wat de data betekent.",
    },
    {
      n: "4",
      title: "Orchestratie",
      body: "Workflows en agents die events omzetten in acties: verrijken, sequences starten, taken maken, het CRM muteren en follow-up bewaken.",
    },
    {
      n: "5",
      title: "Activatie",
      body: "E-mail, LinkedIn, advertenties, content en belafspraken. De resultaten komen als nieuwe signalen het systeem weer in.",
    },
    {
      n: "6",
      title: "Mens",
      body: "Uw verkoper stapt in zodra een drempel wordt bereikt: complexe context, advies, relatie, onderhandeling en closing.",
    },
  ];
  return (
    <Section id="architectuur">
      <SectionHeader
        eyebrow="De referentiearchitectuur"
        title="Zes lagen, één loop."
        lead="De kracht zit niet in één applicatie, maar in de orchestratie ertussen. Elke klik, vacature, reply of bedrijfswijziging is geen informatie maar een event dat de volgende processtap start."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {lagen.map((l, i) => (
          <Reveal key={l.n} index={i} className="h-full">
            <div className="flex h-full flex-col rounded-lg border border-brand-line bg-brand-surface p-6">
              <span className="mb-4 font-display text-[44px] font-bold leading-none tracking-tight text-brand-accent">
                {l.n}
              </span>
              <h3 className="mb-2 font-display text-[19px] font-semibold tracking-tight">
                {l.title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-ink-2">{l.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 rounded-lg border border-brand-accent/30 bg-brand-accent/[0.07] px-6 py-5">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-brand-accent">
          Outcome → learning → terug naar intelligence
        </p>
        <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-brand-ink-2">
          De uitkomst van elk gesprek gaat terug het systeem in. Welke signalen
          bleken ruis, welke hypothese leverde deals op, welke regels moeten
          worden aangepast. Zo wordt de loop gesloten.
        </p>
      </Reveal>
    </Section>
  );
}

/* ── De digitale commerciele medewerker ────────────────────────────────── */

export function DigitaleMedewerker() {
  const capabilities = [
    ["Observe", "Continu marktdata, accountwijzigingen en gedrag verzamelen."],
    ["Understand", "Data interpreteren in de context van ICP, propositie en hypotheses."],
    ["Decide", "Bepalen welke accounts, opportunities en acties prioriteit krijgen."],
    ["Act", "Verrijken, sequences starten, taken maken, het CRM bijwerken en routeren."],
    ["Learn", "Feedback uit sales verwerken en de weging van signalen bijstellen."],
  ];
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="De digitale commerciële medewerker"
        title="Automation zegt: als X, doe Y."
        lead="Intelligence zegt iets anders: op basis van alles wat wij over dit account weten, wat is nu waarschijnlijk de beste commerciële actie? Dat verschil is de kern van wat wij installeren."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {capabilities.map(([name, body], i) => (
          <Reveal
            key={name}
            index={i}
            className="h-full border-t-[3px] border-brand-line pt-5 first:border-brand-accent"
          >
            <h3 className="mb-2 font-display text-[17px] font-semibold tracking-tight">
              {name}
            </h3>
            <p className="text-[13px] leading-relaxed text-brand-ink-2">{body}</p>
          </Reveal>
        ))}
      </div>

      {/* Concreet beslismoment: dit is hoe intelligence anders kiest dan een regel. */}
      <Reveal className="mt-10 grid gap-0 overflow-hidden rounded-lg border border-brand-line bg-brand-ground md:grid-cols-2">
        <div className="border-b border-brand-line p-6 md:border-b-0 md:border-r">
          <p className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3">
            Wat het systeem ziet
          </p>
          <ul className="space-y-2 text-sm text-brand-ink-2">
            {[
              "92% ICP-fit",
              "Tweede locatie in aantocht",
              "Drie relevante vacatures",
              "Pricingpagina bezocht",
              "Geen reply op de laatste twee mails",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6">
          <p className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
            Wat het systeem besluit
          </p>
          <p className="font-display text-[17px] font-semibold leading-snug tracking-tight text-brand-ink">
            Geen vierde geautomatiseerde mail. Een salescall naar de Operations
            Director.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-brand-ink-2">
            Reden: expansion event, hoge fit, engagement over meerdere kanalen.
            De reden gaat mee naar het CRM, zodat de verkoper weet waarom hij
            belt.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── Connectors als capabilities ───────────────────────────────────────── */

export function Capabilities() {
  const map = [
    ["Apollo of andere databron", "Bedrijven en contactpersonen vinden."],
    ["Clay", "Data verrijken, transformeren en classificeren."],
    ["HeyReach", "LinkedIn-outreach uitvoeren en terugkoppelen."],
    ["E-mailplatform", "Outbound en nurturing uitvoeren."],
    ["Planable", "Social content plannen en publiceren."],
    ["CRM", "Accounts, activiteiten en uitkomsten lezen en schrijven."],
    ["Web analytics", "Intentie en engagement detecteren."],
    ["Calendar", "Afspraken lezen en plannen."],
    ["Voice of Telli", "Bellen, kwalificeren en gesprekken verwerken."],
    ["ERP", "Klant-, order- en omzetcontext toevoegen."],
  ];
  return (
    <Section>
      <SectionHeader
        eyebrow="Connectors als capabilities"
        title="Elke koppeling is een nieuwe vaardigheid."
        lead="Wij zeggen niet: wij koppelen HeyReach. Wij zeggen: de digitale medewerker krijgt de vaardigheid om LinkedIn-outreach uit te voeren en terug te koppelen. Elke databron voegt context toe, elke workflow voegt autonomie toe."
      />
      <div className="grid gap-px overflow-hidden rounded-lg border border-brand-line bg-brand-line sm:grid-cols-2 lg:grid-cols-3">
        {map.map(([name, body], i) => (
          <Reveal key={name} index={i} className="h-full bg-brand-surface p-5">
            <h3 className="mb-1.5 font-display text-[15px] font-semibold tracking-tight">
              {name}
            </h3>
            <p className="text-[13px] leading-relaxed text-brand-ink-2">{body}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8 max-w-[70ch] text-sm leading-relaxed text-brand-ink-2">
        <p>
          De AI hoeft niet te weten welke leverancier onder een commando zit.
          Achter <span className="text-brand-ink">sequence activate</span> kan
          HeyReach zitten, achter <span className="text-brand-ink">crm sync</span>{" "}
          HubSpot of Salesforce. Dat is de abstractielaag die de engine
          onafhankelijk maakt van uw huidige tooling.
        </p>
      </Reveal>
    </Section>
  );
}

/* ── Gecontroleerde autonomie ──────────────────────────────────────────── */

export function Autonomie() {
  const niveaus = [
    {
      label: "Autonoom",
      body: "Data verzamelen, verrijken, scores bijwerken, signalen monitoren en rapporteren.",
    },
    {
      label: "Binnen regels",
      body: "E-mail en LinkedIn binnen goedgekeurde sequences en volumes, nurturing en CRM-updates.",
    },
    {
      label: "Met goedkeuring",
      body: "Persoonlijke high-value outreach, content buiten de standaardkaders en afwijkende acties.",
    },
  ];
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Human in the loop"
        title="Gecontroleerde autonomie."
        lead="Een digitale medewerker hoeft niet alles zelfstandig te mogen doen. Wij richten autonomie in per vaardigheid en per risico. Autonomie zonder grenzen is geen volwassen automatisering."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {niveaus.map((n, i) => (
          <Reveal key={n.label} index={i} className="h-full">
            <div className="flex h-full flex-col rounded-lg border border-brand-line bg-brand-ground p-6">
              <span className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
                Niveau {i + 1}
              </span>
              <h3 className="mb-2 font-display text-[19px] font-semibold tracking-tight">
                {n.label}
              </h3>
              <p className="text-sm leading-relaxed text-brand-ink-2">{n.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8 max-w-[74ch] text-sm leading-relaxed text-brand-ink-2">
        <p>
          Iedere vaardigheid krijgt expliciete rechten, guardrails, logging en
          escalatieregels. Operationele waarborgen horen daar nadrukkelijk bij:
          een eigen subdomein, SPF, DKIM en DMARC, warm-up, volumelimieten,
          monitoring op deliverability en een werkende opt-out.
        </p>
      </Reveal>
    </Section>
  );
}

/* ── De KPI-set ────────────────────────────────────────────────────────── */

export function Kpis() {
  const kpis = [
    ["Growth output", "Omzet, nieuwe deals, expansion revenue en gerealiseerde waarde."],
    ["Opportunity flow", "Nieuwe opportunities per periode, de commerciële TAK en coverage."],
    ["Opportunity quality", "Target naar priority, priority naar gesprek, gesprek naar opportunity."],
    ["Probability", "Win rate, stage conversion en de correlatie tussen signaal en uitkomst."],
    ["Market coverage", "Accounts observed, qualified, target en actieve opportunities."],
    ["Activation", "Bereik, engagement, reply rate en prestaties per kanaal."],
    ["Speed", "Time to detect, time to priority en time to human action."],
    ["Learning", "False positives, false negatives, reason codes en aangepaste hypotheses."],
  ];
  return (
    <Section>
      <SectionHeader
        eyebrow="Sturen op de machine"
        title="KPI's die verder gaan dan opens en clicks."
        lead="Als dit een opportunity-engine is, moeten de cijfers meer meten dan een campagne. Uw managementlaag moet zien of de machine genoeg output produceert en waar de bottleneck zit."
      />
      <div className="grid gap-x-10 gap-y-0 border-t border-brand-line sm:grid-cols-2">
        {kpis.map(([name, body], i) => (
          <Reveal key={name} index={i} className="border-b border-brand-line py-5">
            <h3 className="mb-1 font-display text-[16px] font-semibold tracking-tight">
              {name}
            </h3>
            <p className="text-sm leading-relaxed text-brand-ink-2">{body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── De levering in negen stappen ──────────────────────────────────────── */

export function Levering() {
  const stappen = [
    ["Process design", "Wij modelleren eerst uw commerciële proces, niet de tools."],
    ["Context model", "Een eigen datamodel met account en opportunity als kernobjecten."],
    ["Capability design", "Welke vaardigheden de digitale medewerker moet krijgen."],
    ["Connectors", "Uw databronnen, kanalen en systemen worden aangesloten."],
    ["Workflow-orchestratie", "Events worden omgezet in acties en opvolging."],
    ["Intelligence", "Fit, opportunity, evidence, timing en probability."],
    ["AI-interface", "Toegang via MCP en CLI, zodat de engine aanstuurbaar is."],
    ["Human in the loop", "Rechten, guardrails, goedkeuringen en escalaties."],
    ["Learning loop", "De wekelijkse review die de regels bijstelt."],
  ];
  return (
    <Section tone="invert" className="v2-curtain relative overflow-hidden">
      <GiantWord color="rgba(18,18,18,0.10)" className="-right-10 top-2 text-[16vw]">
        INSTALLATIE
      </GiantWord>
      <div className="relative z-10">
        <SectionHeader
          invert
          eyebrow="De levering"
          title="Negen stappen, van proces tot lerende loop."
          lead="Wij beginnen niet bij Apollo, Clay of uw CRM. Wij beginnen bij het proces dat uw organisatie nodig heeft, en maken daar een machine-leesbare workflow van."
        />
        <div className="grid gap-x-10 gap-y-0 border-t border-brand-ground/20 md:grid-cols-2 lg:grid-cols-3">
          {stappen.map(([name, body], i) => (
            <Reveal
              key={name}
              index={i}
              className="flex gap-4 border-b border-brand-ground/15 py-5"
            >
              <span className="w-6 shrink-0 pt-0.5 font-display text-[11px] font-semibold tracking-[0.14em] text-brand-ground/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mb-1 font-display text-[15px] font-semibold tracking-tight text-brand-ground">
                  {name}
                </h3>
                <p className="text-[13px] leading-relaxed text-brand-ground/70">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <p className="max-w-[54ch] font-display text-[clamp(1.1rem,2vw,1.5rem)] font-semibold leading-snug tracking-tight text-brand-ground">
            Proces, context, intelligence, capabilities, connectors en een
            AI-interface. Samen: een digitale commerciële medewerker.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── De formule ────────────────────────────────────────────────────────── */

export function Formule() {
  const terms = [
    {
      name: "Opportunities",
      body: "Hoeveel relevante kansen kan de organisatie produceren?",
    },
    {
      name: "Probability",
      body: "Hoe groot is de kans dat een opportunity converteert?",
    },
    {
      name: "Value",
      body: "Hoeveel waarde vertegenwoordigt een gewonnen opportunity?",
    },
  ];
  return (
    <Section className="relative overflow-hidden">
      <GiantWord className="-right-8 bottom-0 text-[15vw]">GROWTH</GiantWord>
      <div className="relative z-10">
        <SectionHeader
          eyebrow="Daarmee wordt groei bestuurbaar"
          title="Opportunities × Probability × Value = Growth."
          lead="Traditionele salesoptimalisatie richt zich op probability: betere verkopers, betere scripts, betere voorstellen. Wij beginnen één stap eerder, bij de opportunity flow zelf."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {terms.map((t, i) => (
            <Reveal
              key={t.name}
              index={i}
              className={`border-t-[3px] pt-5 ${i === 0 ? "border-brand-accent" : "border-brand-line"}`}
            >
              <h3 className="mb-2 font-display text-[19px] font-semibold tracking-tight">
                {t.name}
              </h3>
              <p className="text-sm leading-relaxed text-brand-ink-2">{t.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 max-w-[74ch] text-sm leading-relaxed text-brand-ink-2">
          <p>
            Niet elke deal wordt voorspelbaar. Het commerciële systeem wordt wel
            meetbaar: u weet hoeveel opportunities u nodig heeft, hoeveel u er
            produceert, waar ze verloren gaan en wanneer u nieuwe hypotheses
            moet toevoegen.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

