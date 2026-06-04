import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://b2bgroeimachine.io";
const SITE_NAME = "B2BGroeiMachine";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// In-memory cache with TTL
const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { html: string; timestamp: number }>();

function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.html;
}

function setCache(key: string, html: string) {
  if (cache.size >= 200) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { html, timestamp: Date.now() });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Rich content blocks ──

const HOME_BODY = `
<section>
  <h1>Wij automatiseren en schalen uw B2B salesproces</h1>
  <p>U weet precies waar uw volgende klant vandaan komt. Elke week scherper. Elke maand meer resultaat.</p>
</section>

<section>
  <h2>Eén systeem. Elke sector.</h2>
  <p>Dezelfde aanpak, afgestemd op uw markt. Van profvoetbal tot engineering: wij weten hoe we uw doelgroep bereiken.</p>
  <ul>
    <li><a href="${SITE_URL}/sectoren/profvoetbal">Profvoetbal</a> — Sponsorwerving, partnerschappen en seizoensgebonden campagnes voor clubs en organisaties.</li>
    <li><a href="${SITE_URL}/sectoren/groothandel">Groothandel</a> — Nieuwe afnemers en retailers identificeren op basis van inkooppatronen.</li>
    <li><a href="${SITE_URL}/sectoren/leasemaatschappijen">Leasemaatschappijen</a> — Bedrijven met groeiend wagenpark en contractverlengingen.</li>
    <li><a href="${SITE_URL}/sectoren/engineering">Engineering</a> — Technische beslissers en projectmanagers bij industriële bedrijven.</li>
    <li><a href="${SITE_URL}/sectoren/zakelijke-dienstverlening">Zakelijke Dienstverlening</a> — Accountants, juristen en consultants die groeien.</li>
    <li><a href="${SITE_URL}/sectoren/financiele-sector">Financiële Sector</a> — Vermogensbeheerders, verzekeraars en fintechs.</li>
    <li><a href="${SITE_URL}/sectoren/maakindustrie">Maakindustrie</a> — Productiebedrijven die investeren in automatisering.</li>
    <li><a href="${SITE_URL}/sectoren/opleiding-training">Opleiding &amp; Training</a> — B2B-klanten werven voor incompany trainingen.</li>
  </ul>
</section>

<section>
  <h2>Zo werkt het — Gebouwd voor resultaat</h2>
  <ol>
    <li><strong>Infrastructuur</strong> — Wij zetten alles klaar: e-mail, LinkedIn en CRM. Uw hoofddomein blijft veilig.</li>
    <li><strong>Intelligence</strong> — Wij brengen uw ideale klant in kaart. Daarna volgen we signalen: nieuwe functies, groei en websitebezoek.</li>
    <li><strong>Betrokkenheid</strong> — Via e-mail en LinkedIn nemen we 6 tot 8 keer contact op. Persoonlijk, rustig en op het juiste moment.</li>
    <li><strong>Kwalificatie</strong> — Wij beoordelen elke reactie. Alleen serieuze gesprekken komen in uw agenda.</li>
  </ol>
  <h3>Data als basis</h3>
  <ul>
    <li><strong>Proces levert data</strong> — Ons systeem draait elke dag. De data die het oplevert, gebruiken we om steeds beter te worden.</li>
    <li><strong>Alles in uw eigen tools</strong> — Alle contacten en resultaten staan in uw eigen CRM. Die data is en blijft van u.</li>
    <li><strong>Elke 4 weken bijsturen</strong> — Wat werkt, schalen we op. Wat niet werkt, passen we aan.</li>
  </ul>
</section>

<section>
  <h2>Het volledige proces — Van onbekend tot gesprek, stap voor stap</h2>
  <ol>
    <li><strong>Infrastructuur opzetten</strong> — Wij maken alles klaar: e-mailadressen, LinkedIn en CRM. Uw hoofddomein blijft beschermd.</li>
    <li><strong>Uw ideale klant vinden</strong> — Wij bepalen wie uw beste klanten zijn. Daarna bouwen we een lijst met duizenden matches.</li>
    <li><strong>Signalen herkennen</strong> — Iemand wisselt van baan, een bedrijf groeit, of bezoekt uw website. Wij zien het en scoren elke prospect op interesse.</li>
    <li><strong>E-mail outreach</strong> — Persoonlijke e-mails via meerdere adressen. We testen welke tekst, timing en onderwerpregel het beste werkt.</li>
    <li><strong>LinkedIn contact</strong> — Connectieverzoeken, profielbezoeken en berichten. Alles binnen veilige limieten.</li>
    <li><strong>Kwalificatie</strong> — Alleen gesprekken met echte interesse en de juiste match komen in uw agenda.</li>
    <li><strong>Resultaten in uw CRM</strong> — Alles staat in uw eigen CRM. U ziet precies wat er speelt.</li>
  </ol>
</section>

<section>
  <h2>In 4 weken operationeel</h2>
  <ul>
    <li><strong>Week 1 tot 2: Analyse en opzet</strong> — Uw ideale klant bepalen, de juiste tools kiezen, e-mail en LinkedIn klaarzetten, CRM koppelen.</li>
    <li><strong>Week 3 tot 4: Eerste campagnes live</strong> — Signalen activeren, eerste berichten versturen, testen welke aanpak het beste werkt.</li>
    <li><strong>Maand 2 en verder: Opschalen</strong> — Resultaten analyseren, warme contacten opvolgen, nieuwe doelgroepen toevoegen.</li>
  </ul>
</section>

<section>
  <h2>Datahub — Uw commercieel geheugen</h2>
  <p>Alle data uit uw campagnes op één plek. Zo kunt u met AI steeds slimmer werken.</p>
  <ul>
    <li><strong>Stel vragen aan uw data</strong> — Welke doelgroep levert de meeste klanten? Welk kanaal werkt het best?</li>
    <li><strong>Alle data op één plek</strong> — Contacten, campagnes, signalen en resultaten gebundeld.</li>
    <li><strong>AI wordt steeds slimmer</strong> — Elk gesprek en resultaat voegt context toe.</li>
    <li><strong>U bepaalt wat AI mag zien</strong> — Volledige controle, transparant, veilig en GDPR-proof.</li>
    <li><strong>Klaar voor AI-automatisering</strong> — Van scoring tot opvolging: bouw richting automatische workflows.</li>
    <li><strong>Automatisch opvolgen</strong> — Gebruik uw data om vervolgacties automatisch te laten lopen.</li>
    <li><strong>Alles blijft van u</strong> — Geen verplichtingen. De data, inzichten en modellen zijn van u. Altijd.</li>
  </ul>
</section>

<section>
  <h2>Zo werkt de prijs — Stel uw pakket samen in 4 stappen</h2>
  <p>Begin met een vaste fee. Kies daarna hoeveel uren u wilt. Voeg eventueel Datahub en extra diensten toe.</p>
  <h3>Stap 1: Vaste service fee — €1.500/maand</h3>
  <p>€0 opstartkosten, tot 5 personen, minimaal 6 maanden.</p>
  <ul>
    <li>Klantwerving en recruitment tegelijk</li>
    <li>Uw ideale klant in kaart gebracht</li>
    <li>Signalen herkennen en erop inspelen</li>
    <li>Contact via e-mail en LinkedIn (6 tot 8 keer)</li>
    <li>Elke reactie wordt beoordeeld</li>
    <li>Elke twee weken een helder overzicht</li>
    <li>Uw eigen contactpersoon</li>
  </ul>
  <h3>Stap 2: Optioneel — Engagement-uren</h3>
  <table>
    <tr><th>Pakket</th><th>Uren</th><th>Tarief (6 mnd)</th><th>Tarief (12 mnd, -10%)</th></tr>
    <tr><td>Startpakket</td><td>10h/maand</td><td>€100/uur</td><td>€90/uur</td></tr>
    <tr><td>Meest gekozen</td><td>20h/maand</td><td>€90/uur</td><td>€81/uur</td></tr>
    <tr><td>Maximale output</td><td>40h/maand</td><td>€80/uur</td><td>€72/uur</td></tr>
  </table>
  <h3>Stap 3: Datahub — vanaf €499/maand</h3>
  <p>Uw commercieel geheugen. Alle data en AI-context op één plek. Geen verplichtingen: uw data blijft van u.</p>
  <h3>Stap 4: Add-ons</h3>
  <ul>
    <li><a href="${SITE_URL}/full-service-recruitment">Full Service Recruitment</a> — 15% bruto jaarsalaris. Sourcing, selectie, AI-kwalificatie en begeleiding tot aanname.</li>
    <li><a href="${SITE_URL}/full-sales-management">Full Sales Management</a> — Prijs op aanvraag. Sales, marketing, strategie en relatiebeheer.</li>
  </ul>
</section>

<section>
  <h2>Uw keuze — Wij beheren, of u doet het zelf</h2>
  <p>Geen verplichtingen. Geen eigen platform. Het systeem draait op uw tools.</p>
  <ul>
    <li><strong>Build &amp; Transfer</strong> — Wij bouwen alles op uw tools. Daarna trainen we uw team en draagt u het zelf. Eenmalig project, geen doorlopende kosten.</li>
    <li><strong>Done-for-you (meest gekozen)</strong> — Wij kiezen de beste tools, richten alles in en beheren het dagelijks. U krijgt afspraken in uw agenda, zonder gedoe.</li>
  </ul>
</section>

<section>
  <h2>Waarom Rebel Force — Geen platform. Geen lock-in.</h2>
  <ul>
    <li><strong>Werkt met uw tools</strong> — Wij gebruiken uw CRM, e-mail en LinkedIn. Geen duur platform nodig.</li>
    <li><strong>Opzetten of overnemen</strong> — Wij bouwen het systeem en beheren het. Of we zetten het op, trainen uw team en dragen het over.</li>
    <li><strong>Uw domein blijft veilig</strong> — Aparte e-mailadressen, eigen IP-adressen en een rustig opwarmproces.</li>
  </ul>
  <h3>Wat u krijgt</h3>
  <ul>
    <li>Complete aanpak van begin tot eind</li>
    <li>Twee stromen tegelijk: klanten en recruitment</li>
    <li>Signalen volgen en interesse meten</li>
    <li>Persoonlijk contact via e-mail en LinkedIn</li>
    <li>Elke twee weken een helder overzicht</li>
    <li>Werkt met uw bestaande tools</li>
    <li>Uw domein blijft beschermd</li>
    <li>Warme contacten worden niet vergeten</li>
  </ul>
  <h3>Meetbaar. Gecontroleerd.</h3>
  <ul>
    <li><strong>Meetbaar resultaat</strong> — Ons belangrijkste doel: gesprekken met de juiste mensen.</li>
    <li><strong>Uw naam wordt beschermd</strong> — Nooit uw hoofddomein. Geen spam, geen herhaalde berichten.</li>
    <li><strong>Langetermijnwaarde</strong> — Mensen die nu 'nog niet' zeggen, houden we warm.</li>
  </ul>
</section>

<section>
  <h2>Veelgestelde vragen</h2>
  <dl>
    <dt>Wat doet B2BGroeiMachine precies?</dt>
    <dd>Wij bouwen een systeem dat nieuwe klanten vindt en gesprekken plant. Van het eerste bericht tot een afspraak in uw agenda. Het draait elke dag, zonder dat u er naar hoeft om te kijken.</dd>
    <dt>Voor welke bedrijven is dit geschikt?</dt>
    <dd>Voor B2B-bedrijven in Nederland en België die willen groeien. Van dienstverleners en productiebedrijven tot de financiële sector en profvoetbal.</dd>
    <dt>Hoe snel zijn we operationeel?</dt>
    <dd>Binnen 4 weken. Week 1: strategie en data. Week 2: systeem en teksten. Week 3: de eerste campagnes gaan live. Week 4: bijsturen op basis van resultaten.</dd>
    <dt>Wat zijn signalen?</dt>
    <dd>Signalen zijn veranderingen bij bedrijven. Denk aan: iemand krijgt een nieuwe functie, een bedrijf groeit, of bezoekt uw website. Wij herkennen dat en nemen op het juiste moment contact op.</dd>
    <dt>Zijn jullie een leadgenerator?</dt>
    <dd>Nee! Wij bouwen systemen die dat voor u doen.</dd>
    <dt>Welke kanalen gebruiken jullie?</dt>
    <dd>LinkedIn, e-mail en telefonische opvolging. Alles afgestemd op uw doelgroep. Via meerdere kanalen bereikt u meer mensen.</dd>
  </dl>
</section>

<section>
  <h2>Klaar om meer klanten te krijgen?</h2>
  <p>Plan een vrijblijvend gesprek. We laten u zien hoe het systeem werkt voor uw situatie.</p>
  <p>€0 opstartkosten · Operationeel in 4 weken · Vanaf €1.500/maand</p>
  <p><a href="https://app.usemotion.com/meet/Rebel-Force/meeting">Plan een gratis Demo</a></p>
</section>
`;

const HOMEPAGE_EXTRA_HEAD = `
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: "Wij bouwen schaalbare B2B sales engines: van prospecting tot geboekte afspraken.",
  contactPoint: { "@type": "ContactPoint", contactType: "sales", url: "https://app.usemotion.com/meet/Rebel-Force/meeting" },
})}
</script>
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Wat doet B2BGroeiMachine precies?", acceptedAnswer: { "@type": "Answer", text: "Wij bouwen een systeem dat nieuwe klanten vindt en gesprekken plant. Van het eerste bericht tot een afspraak in uw agenda." } },
    { "@type": "Question", name: "Voor welke bedrijven is dit geschikt?", acceptedAnswer: { "@type": "Answer", text: "Voor B2B-bedrijven in Nederland en België die willen groeien. Van dienstverleners en productiebedrijven tot de financiële sector en profvoetbal." } },
    { "@type": "Question", name: "Hoe snel zijn we operationeel?", acceptedAnswer: { "@type": "Answer", text: "Binnen 4 weken. Week 1: strategie en data. Week 2: systeem en teksten. Week 3: de eerste campagnes gaan live. Week 4: bijsturen op basis van resultaten." } },
    { "@type": "Question", name: "Wat zijn signalen?", acceptedAnswer: { "@type": "Answer", text: "Signalen zijn veranderingen bij bedrijven. Denk aan: iemand krijgt een nieuwe functie, een bedrijf groeit, of bezoekt uw website." } },
    { "@type": "Question", name: "Welke kanalen gebruiken jullie?", acceptedAnswer: { "@type": "Answer", text: "LinkedIn, e-mail en telefonische opvolging. Alles afgestemd op uw doelgroep." } },
  ],
})}
</script>`;

// ── Static page definitions ──

const STATIC_PAGES: Record<string, {
  title: string;
  description: string;
  h1: string;
  bodyContent: string;
  extraHead?: string;
}> = {
  "/": {
    title: "B2BGroeiMachine — Wij automatiseren en schalen uw B2B salesproces",
    description: "Wij bouwen schaalbare B2B sales engines: van prospecting tot geboekte afspraken. Proces, data en resultaat voor ambitieuze bedrijven in Nederland en België.",
    h1: "Wij automatiseren en schalen uw B2B salesproces",
    bodyContent: HOME_BODY,
    extraHead: HOMEPAGE_EXTRA_HEAD,
  },
  "/over-ons": {
    title: "Over Ons — B2BGroeiMachine",
    description: "Leer het team achter B2BGroeiMachine kennen. Wij zijn specialisten in B2B sales automation en signal-based prospecting.",
    h1: "Over B2BGroeiMachine",
    bodyContent: `<p>B2BGroeiMachine is opgericht om ambitieuze B2B-bedrijven te helpen groeien met schaalbare sales systemen. Ons team combineert expertise in sales automation, data-gedreven prospecting en multichannel outreach.</p>`,
  },
  "/pricing": {
    title: "Pricing — B2BGroeiMachine",
    description: "Bekijk onze pakketten voor B2B sales automation. Van Kickstart tot Scale — kies het pakket dat past bij jouw groeiambitie.",
    h1: "Stel uw pakket samen in 4 stappen",
    bodyContent: `
<section>
  <h2>Stap 1: Vaste service fee — €1.500/maand</h2>
  <p>€0 opstartkosten, tot 5 personen, minimaal 6 maanden.</p>
  <ul>
    <li>Klantwerving en recruitment tegelijk</li>
    <li>Uw ideale klant in kaart gebracht</li>
    <li>Signalen herkennen en erop inspelen</li>
    <li>Contact via e-mail en LinkedIn (6 tot 8 keer)</li>
    <li>Elke reactie wordt beoordeeld</li>
    <li>Elke twee weken een helder overzicht</li>
    <li>Uw eigen contactpersoon</li>
    <li>Tot 5 gebruikers</li>
  </ul>
</section>
<section>
  <h2>Stap 2: Engagement-uren (optioneel)</h2>
  <table>
    <tr><th>Pakket</th><th>Uren</th><th>Tarief (6 mnd)</th><th>Tarief (12 mnd)</th></tr>
    <tr><td>Startpakket</td><td>10h/maand</td><td>€100/uur (€1.000/mnd)</td><td>€90/uur (€900/mnd)</td></tr>
    <tr><td>Meest gekozen</td><td>20h/maand</td><td>€90/uur (€1.800/mnd)</td><td>€81/uur (€1.620/mnd)</td></tr>
    <tr><td>Maximale output</td><td>40h/maand</td><td>€80/uur (€3.200/mnd)</td><td>€72/uur (€2.880/mnd)</td></tr>
  </table>
</section>
<section>
  <h2>Stap 3: Datahub — vanaf €499/maand</h2>
  <p>Uw commercieel geheugen. Alle data en AI-context op één plek. Geen verplichtingen: uw data blijft van u. Werkt met uw bestaande CRM en tools.</p>
</section>
<section>
  <h2>Stap 4: Add-ons</h2>
  <ul>
    <li><a href="${SITE_URL}/full-service-recruitment">Full Service Recruitment</a> — 15% bruto jaarsalaris</li>
    <li><a href="${SITE_URL}/full-sales-management">Full Sales Management</a> — Prijs op aanvraag</li>
  </ul>
</section>`,
  },
  "/contact": {
    title: "Contact — B2BGroeiMachine",
    description: "Neem contact op met B2BGroeiMachine. Plan een vrijblijvend gesprek over B2B sales automation en prospecting.",
    h1: "Neem contact op",
    bodyContent: `<p>Heb je vragen over onze diensten of wil je een vrijblijvend gesprek plannen? Neem contact met ons op.</p>
<p><a href="https://app.usemotion.com/meet/Rebel-Force/meeting">Plan een gesprek</a></p>`,
  },
  "/blog": {
    title: "Blog — B2BGroeiMachine",
    description: "Lees onze artikelen over B2B sales automation, prospecting, outreach en data-gedreven groei.",
    h1: "Blog",
    bodyContent: `<p>Inzichten en best practices over B2B sales automation, signal-based prospecting en multichannel outreach.</p>`,
  },
  "/datahub": {
    title: "Datahub — B2BGroeiMachine",
    description: "Ontdek onze Datahub: het centrale zenuwstelsel voor al je prospecting data, signalen en campagne-inzichten.",
    h1: "Datahub — Uw commercieel geheugen",
    bodyContent: `
<p>Alle data uit uw campagnes op één plek. Zo kunt u met AI steeds slimmer werken.</p>
<ul>
  <li><strong>Stel vragen aan uw data</strong> — Welke doelgroep levert de meeste klanten?</li>
  <li><strong>Alle data op één plek</strong> — Contacten, campagnes, signalen en resultaten.</li>
  <li><strong>AI wordt steeds slimmer</strong> — Elk gesprek voegt context toe.</li>
  <li><strong>U bepaalt wat AI mag zien</strong> — GDPR-proof en transparant.</li>
  <li><strong>Klaar voor AI-automatisering</strong> — Van scoring tot opvolging.</li>
  <li><strong>Alles blijft van u</strong> — Geen verplichtingen.</li>
</ul>
<p>Vanaf €499/maand. <a href="https://app.usemotion.com/meet/Rebel-Force/meeting">Meer weten over Datahub</a></p>`,
  },
  "/full-sales-management": {
    title: "Full Sales Management — B2BGroeiMachine",
    description: "Volledig salesmanagement uitbesteden? Wij nemen het hele traject over: van strategie tot geboekte afspraken.",
    h1: "Full Sales Management",
    bodyContent: `<p>Besteed uw volledige salesoperatie uit aan B2BGroeiMachine. Van strategie en prospecting tot afspraken en opvolging. Wij nemen het hele commerciële proces over: sales, marketing, strategie en relatiebeheer.</p>
<p><a href="https://app.usemotion.com/meet/Rebel-Force/meeting">Bespreek uw situatie</a></p>`,
  },
  "/full-service-recruitment": {
    title: "Full Service Recruitment — B2BGroeiMachine",
    description: "Recruitment via outbound? Wij bouwen een schaalbaar wervingssysteem met signal-based prospecting.",
    h1: "Full Service Recruitment",
    bodyContent: `<p>Schaalbare recruitment via signal-based prospecting. Wij vinden en benaderen de juiste kandidaten proactief. Sourcing, selectie, AI-kwalificatie en begeleiding tot aanname. 15% bruto jaarsalaris, alleen bij succes.</p>
<p><a href="https://app.usemotion.com/meet/Rebel-Force/meeting">Bespreek uw situatie</a></p>`,
  },
};

// ── Sector data for prerendering ──

const SECTORS: Record<string, { title: string; tagline: string; description: string; metaTitle: string; metaDescription: string; challenges: string[]; solutions: string[]; signals: string[] }> = {
  "profvoetbal": {
    title: "Profvoetbal", tagline: "Sponsorwerving op een nieuw niveau.",
    description: "Sponsorwerving, partnerschappen en seizoensgebonden campagnes voor clubs en organisaties.",
    metaTitle: "B2B Leadgeneratie voor Profvoetbal — B2BGroeiMachine",
    metaDescription: "Sponsorwerving en partnerschappen voor profvoetbalclubs. Bereik beslissers bij merken die investeren in sport.",
    challenges: ["Sponsorbudgetten staan onder druk", "Beperkt netwerk bij commerciële beslissers", "Seizoensgebonden verkoopcycli"],
    solutions: ["Geautomatiseerde identificatie van bedrijven met sponsoringbudget", "Multichannel outreach naar CMO's en CEO's", "Seizoensgebonden campagnekalender"],
    signals: ["Nieuwe marketingdirecteur aangesteld", "Bedrijf opent nieuwe vestiging", "Sponsorcontract bij concurrent loopt af"],
  },
  "groothandel": {
    title: "Groothandel", tagline: "Nieuwe afnemers, structureel gevonden.",
    description: "Nieuwe afnemers en retailers identificeren op basis van inkooppatronen en marktbewegingen.",
    metaTitle: "B2B Leadgeneratie voor Groothandels — B2BGroeiMachine",
    metaDescription: "Vind nieuwe afnemers en retailers voor uw groothandel met data-gedreven prospecting.",
    challenges: ["Nieuwe afnemers vinden buiten het bestaande netwerk", "Concurrentie op prijs", "Lange sales cycles"],
    solutions: ["Signaaldetectie bij retailers", "Gerichte outreach naar inkoopmanagers", "Geautomatiseerde opvolging"],
    signals: ["Retailer opent nieuwe winkel", "Assortimentswijziging", "Inkoper wisselt van functie"],
  },
  "leasemaatschappijen": {
    title: "Leasemaatschappijen", tagline: "Timing is alles bij fleet management.",
    description: "Bedrijven met groeiend wagenpark, contractverlengingen en fleet managers die actief vergelijken.",
    metaTitle: "B2B Leadgeneratie voor Leasemaatschappijen — B2BGroeiMachine",
    metaDescription: "Bereik fleet managers op het moment dat ze leasecontracten vergelijken.",
    challenges: ["Fleet managers worden overspoeld met aanbiedingen", "Contractmomenten lastig te voorspellen", "Hoge concurrentie"],
    solutions: ["Signaaldetectie bij groeiende bedrijven", "Persoonlijke outreach naar fleet managers en CFO's", "Automatische timing"],
    signals: ["Bedrijf groeit in FTE", "Nieuwe vestiging geopend", "Fleet manager gewisseld"],
  },
  "engineering": {
    title: "Engineering", tagline: "Technische beslissers, bereikbaar gemaakt.",
    description: "Technische beslissers en projectmanagers bij industriële bedrijven.",
    metaTitle: "B2B Leadgeneratie voor Engineering Bedrijven — B2BGroeiMachine",
    metaDescription: "Bereik technische beslissers en projectmanagers in de engineering sector.",
    challenges: ["Technische beslissers moeilijk bereikbaar", "Lange en complexe sales cycles", "Timing cruciaal"],
    solutions: ["Identificatie van lopende projecten", "Gerichte outreach naar projectmanagers", "Technisch onderbouwde messaging"],
    signals: ["Nieuwe bouwvergunning", "Investering in productie-automatisering", "Technisch directeur aangesteld"],
  },
  "zakelijke-dienstverlening": {
    title: "Zakelijke Dienstverlening", tagline: "Groei voor accountants, juristen en consultants.",
    description: "Accountants, juristen en consultants die groeien met data-gedreven leadgeneratie.",
    metaTitle: "B2B Leadgeneratie voor Zakelijke Dienstverlening — B2BGroeiMachine",
    metaDescription: "Groei uw accountancy, juridisch of consultancy kantoor met data-gedreven leadgeneratie.",
    challenges: ["Groei afhankelijk van persoonlijk netwerk", "Partners hebben geen tijd voor business development", "Differentiatie lastig"],
    solutions: ["Geautomatiseerde identificatie van groeiende bedrijven", "Outreach namens partners", "Signaaldetectie bij bedrijfsgebeurtenissen"],
    signals: ["Fusie of overname aangekondigd", "Nieuwe directeur of CFO", "Verhuizing of nieuwe vestiging"],
  },
  "financiele-sector": {
    title: "Financiële Sector", tagline: "Nieuwe klanten in een competitieve markt.",
    description: "Vermogensbeheerders, verzekeraars en fintechs die nieuwe klanten zoeken.",
    metaTitle: "B2B Leadgeneratie voor de Financiële Sector — B2BGroeiMachine",
    metaDescription: "Vermogensbeheerders, verzekeraars en fintechs: vind nieuwe klanten met data-gedreven outbound.",
    challenges: ["Strenge compliance-eisen", "Hoge concurrentie", "Lange doorlooptijden"],
    solutions: ["Compliant outreach binnen AFM en DNB richtlijnen", "Targeting op bedrijfsgrootte en groeisignalen", "Nurture flows voor lange cycles"],
    signals: ["Bedrijf bereikt vermogensdrempel", "Nieuwe CFO aangesteld", "Overname afgerond"],
  },
  "maakindustrie": {
    title: "Maakindustrie", tagline: "Van productievloer naar nieuwe markten.",
    description: "Productiebedrijven die investeren in automatisering en nieuwe markten betreden.",
    metaTitle: "B2B Leadgeneratie voor de Maakindustrie — B2BGroeiMachine",
    metaDescription: "Productiebedrijven die groeien: vind nieuwe afnemers en supply chain partners.",
    challenges: ["Afhankelijkheid van beperkt aantal klanten", "Nieuwe markten betreden zonder netwerk", "Technische messaging vereist"],
    solutions: ["Identificatie van nieuwe afnemers", "Technisch onderbouwde outreach", "Internationale expansie-support"],
    signals: ["Investering in nieuwe productielijn", "Uitbreiding naar nieuw exportland", "Operations manager gewisseld"],
  },
  "opleiding-training": {
    title: "Opleiding & Training", tagline: "B2B-klanten voor incompany programma's.",
    description: "Trainingsbureaus en EdTech-bedrijven die B2B-klanten werven voor incompany trainingen.",
    metaTitle: "B2B Leadgeneratie voor Opleiding & Training — B2BGroeiMachine",
    metaDescription: "Werf B2B-klanten voor incompany trainingen met data-gedreven outreach.",
    challenges: ["HR-budgetten fluctueren sterk", "L&D managers overspoeld met aanbod", "Lange besluitvormingsprocessen"],
    solutions: ["Signaaldetectie bij investering in talent development", "Outreach naar HR Directors en L&D Managers", "Seizoensgebonden campagnes"],
    signals: ["L&D vacature geplaatst", "Nieuwe HR Director aangesteld", "Groei in personeelsbestand"],
  },
};

// ── Solution data for prerendering ──

const SOLUTIONS: Record<string, {
  metaTitle: string; metaDescription: string;
  heroTitle: string; heroTitleGradient: string; heroDescription: string;
  problemTitle: string; problemDescription: string; problems: string[];
  solutionTitle: string; solutionTitleGradient: string; solutionDescription: string;
  features: { title: string; description: string }[];
  resultTitle: string; results: { metric: string; label: string }[];
}> = {
  "voorspelbare-pipeline": {
    metaTitle: "Geen voorspelbare pipeline? Wij bouwen er één — B2BGroeiMachine",
    metaDescription: "Stop met hopen op nieuwe klanten. Bouw een voorspelbare pipeline met geautomatiseerde prospecting, slimme signalen en structurele opvolging.",
    heroTitle: "Geen voorspelbare", heroTitleGradient: "pipeline?",
    heroDescription: "U heeft goede klanten, maar nieuwe deals komen onregelmatig binnen. De ene maand is druk, de volgende stilte. Wij bouwen een systeem dat structureel nieuwe kansen genereert.",
    problemTitle: "Herkenbaar?", problemDescription: "De meeste B2B-bedrijven leunen op bestaande relaties en mond-tot-mondreclame. Zodra dat opdroogt, is er geen plan B.",
    problems: ["Omzet schommelt per kwartaal zonder duidelijke oorzaak", "Nieuwe klanten komen binnen via toeval, niet via een systeem", "Geen zicht op hoeveel leads er nodig zijn om targets te halen", "Sales besteedt meer tijd aan administratie dan aan gesprekken"],
    solutionTitle: "Van hoop naar", solutionTitleGradient: "structuur.",
    solutionDescription: "Wij zetten een geautomatiseerd systeem op dat continu nieuwe prospects identificeert, kwalificeert en opwarmt.",
    features: [
      { title: "Signal-based prospecting", description: "Automatisch bedrijven detecteren die nu koopsignalen afgeven." },
      { title: "Geautomatiseerde outreach", description: "Multichannel sequenties via e-mail, LinkedIn en telefoon." },
      { title: "Pipeline dashboard", description: "Realtime inzicht in elke fase van uw verkoopproces." },
      { title: "Voorspelbare forecast", description: "Data-gedreven voorspellingen op basis van conversieratio's." },
    ],
    resultTitle: "Resultaat na 90 dagen",
    results: [{ metric: "3x", label: "meer gekwalificeerde afspraken" }, { metric: "40%", label: "kortere salescyclus" }, { metric: "85%", label: "minder handmatig werk in prospecting" }],
  },
  "outbound-automatisering": {
    metaTitle: "Handmatig outbound? Automatiseer uw prospecting — B2BGroeiMachine",
    metaDescription: "Stop met handmatig e-mails sturen en LinkedIn-berichten typen. Automatiseer uw outbound met slimme sequenties en AI-gestuurde personalisatie.",
    heroTitle: "Nog steeds handmatig", heroTitleGradient: "outbound?",
    heroDescription: "Uw team besteedt uren aan het handmatig versturen van e-mails, LinkedIn-berichten en opvolgingen. Dat kan slimmer, sneller en effectiever.",
    problemTitle: "Herkenbaar?", problemDescription: "Handmatige outbound is tijdrovend, inconsistent en nauwelijks schaalbaar.",
    problems: ["Sales besteedt 60% van de tijd aan niet-verkopende activiteiten", "Opvolging gebeurt onregelmatig of helemaal niet", "Berichten zijn generiek en worden genegeerd", "Geen inzicht in welke berichten en kanalen werken"],
    solutionTitle: "Automatiseer alles behalve", solutionTitleGradient: "het gesprek.",
    solutionDescription: "Wij zetten een volledig geautomatiseerde outbound-machine op die prospects identificeert, gepersonaliseerde berichten stuurt en opvolgt.",
    features: [
      { title: "AI-personalisatie", description: "Elk bericht wordt automatisch afgestemd op de prospect en het bedrijf." },
      { title: "Multichannel sequenties", description: "E-mail, LinkedIn en telefoon in één gecoördineerde flow." },
      { title: "Automatische opvolging", description: "Tot 7 touchpoints zonder dat uw team iets hoeft te doen." },
      { title: "A/B testing", description: "Continu optimaliseren op basis van open rates en replies." },
    ],
    resultTitle: "Resultaat na 90 dagen",
    results: [{ metric: "5x", label: "meer outreach volume" }, { metric: "35%", label: "hogere reply rates" }, { metric: "70%", label: "tijdsbesparing voor sales" }],
  },
  "commercieel-talent": {
    metaTitle: "Geen commercieel talent? Recruitment als systeem — B2BGroeiMachine",
    metaDescription: "Moeite om goede salesmedewerkers te vinden? Wij sourcen, screenen en plaatsen commercieel talent met een bewezen systematische aanpak.",
    heroTitle: "Geen commercieel", heroTitleGradient: "talent?",
    heroDescription: "Goed commercieel talent is schaars. Vacatures staan maanden open, en de kandidaten die reageren passen niet. Wij veranderen recruitment van geluk in een systeem.",
    problemTitle: "Herkenbaar?", problemDescription: "De arbeidsmarkt voor commercieel talent is krapper dan ooit.",
    problems: ["Vacatures staan maanden open zonder geschikte kandidaten", "Recruitmentbureaus leveren niet wat ze beloven", "Goede kandidaten kiezen voor de concurrent", "Geen employer brand dat commercieel talent aantrekt"],
    solutionTitle: "Recruitment als", solutionTitleGradient: "systeem.",
    solutionDescription: "Wij combineren data-gedreven sourcing, actieve benadering en employer branding om structureel de juiste commerciële profielen aan te trekken.",
    features: [
      { title: "Actieve sourcing", description: "Wij benaderen passieve kandidaten die niet actief zoeken maar wel openstaan." },
      { title: "Employer branding", description: "Positioneer uw bedrijf als aantrekkelijke werkgever voor commercieel talent." },
      { title: "Assessment & screening", description: "Objectieve selectie op basis van competenties en cultuurfit." },
      { title: "Onboarding support", description: "Begeleiding na plaatsing voor een snelle en succesvolle start." },
    ],
    resultTitle: "Resultaat",
    results: [{ metric: "21", label: "dagen gemiddelde time-to-hire" }, { metric: "92%", label: "retentie na 12 maanden" }, { metric: "3x", label: "meer gekwalificeerde kandidaten" }],
  },
  "data-gedreven-sales": {
    metaTitle: "Beslissingen op onderbuikgevoel? Schakel over op data — B2BGroeiMachine",
    metaDescription: "Stop met gokken. Gebruik data en signalen om de juiste prospects te benaderen, op het juiste moment, met de juiste boodschap.",
    heroTitle: "Beslissingen op", heroTitleGradient: "onderbuikgevoel?",
    heroDescription: "Uw salesteam belt de verkeerde bedrijven, op het verkeerde moment, met de verkeerde boodschap. Data verandert dat.",
    problemTitle: "Herkenbaar?", problemDescription: "Zonder data is sales een gokspel. Met data wordt het een precisiemachine.",
    problems: ["Geen inzicht in welke prospects het meest kansrijk zijn", "Sales prioriteert op gevoel in plaats van signalen", "Geen zicht op welke kanalen en berichten converteren", "Rapportages kosten uren en zijn achterhaald zodra ze klaar zijn"],
    solutionTitle: "Data als", solutionTitleGradient: "kompas.",
    solutionDescription: "Wij koppelen intent data, CRM-data en marktinformatie om uw salesteam te voorzien van realtime inzichten.",
    features: [
      { title: "Intent data", description: "Weet welke bedrijven actief onderzoek doen naar uw type oplossing." },
      { title: "Lead scoring", description: "Automatische prioritering op basis van gedrag en bedrijfskenmerken." },
      { title: "Realtime dashboards", description: "Altijd actueel inzicht in pipeline, conversie en performance." },
      { title: "Predictive analytics", description: "Voorspel welke deals de hoogste slagingskans hebben." },
    ],
    resultTitle: "Resultaat na 90 dagen",
    results: [{ metric: "45%", label: "hogere conversie van lead naar deal" }, { metric: "60%", label: "minder tijd aan onkansrijke prospects" }, { metric: "2x", label: "snellere besluitvorming" }],
  },
  "schaalbaar-groeisysteem": {
    metaTitle: "Groei loopt vast? Bouw een schaalbaar systeem — B2BGroeiMachine",
    metaDescription: "Uw bedrijf groeit, maar processen houden het niet bij. Wij bouwen een schaalbaar commercieel systeem dat meegroeit met uw ambitie.",
    heroTitle: "Groei die", heroTitleGradient: "vastloopt?",
    heroDescription: "Uw bedrijf is gegroeid, maar de processen zijn niet meegegroeid. Wat ooit werkte voor 5 klanten, werkt niet meer voor 50. Tijd voor een systeem dat schaalt.",
    problemTitle: "Herkenbaar?", problemDescription: "Groei zonder systeem leidt tot chaos, overbelasting en gemiste kansen.",
    problems: ["Processen die werkten bij 10 klanten breken bij 50", "Alles draait op een paar sleutelpersonen", "Kwaliteit daalt naarmate het volume stijgt", "Geen tijd om structureel te verbeteren"],
    solutionTitle: "Een systeem dat", solutionTitleGradient: "meegroeit.",
    solutionDescription: "Wij ontwerpen en implementeren commerciële processen die schaalbaar zijn: geautomatiseerd waar mogelijk, menselijk waar nodig.",
    features: [
      { title: "Procesautomatisering", description: "Repetitieve taken geautomatiseerd zodat uw team kan focussen op impact." },
      { title: "Toolstack optimalisatie", description: "De juiste tools, correct ingericht en naadloos geïntegreerd." },
      { title: "Playbooks & templates", description: "Gedocumenteerde processen die iedereen kan volgen en uitvoeren." },
      { title: "Performance monitoring", description: "KPI's en dashboards die laten zien waar het systeem bijgestuurd moet worden." },
    ],
    resultTitle: "Resultaat",
    results: [{ metric: "3x", label: "meer output met hetzelfde team" }, { metric: "50%", label: "minder afhankelijk van sleutelpersonen" }, { metric: "90%", label: "van processen gedocumenteerd en herhaalbaar" }],
  },
  "internationaal-uitbreiden": {
    metaTitle: "Uitbreiden naar het buitenland? Wij openen de deur — B2BGroeiMachine",
    metaDescription: "Internationale expansie zonder lokaal team? Wij zetten uw prospecting en salesproces op in nieuwe markten met bewezen methoden.",
    heroTitle: "Uitbreiden naar", heroTitleGradient: "het buitenland?",
    heroDescription: "U wilt nieuwe markten betreden, maar u heeft geen lokaal netwerk, geen team ter plaatse en geen zicht op culturele nuances. Wij openen de deur.",
    problemTitle: "Herkenbaar?", problemDescription: "Internationale expansie is complex, duur en vol onzekerheden.",
    problems: ["Geen netwerk of naamsbekendheid in de doelmarkt", "Culturele verschillen in communicatie en salesstijl", "Hoge kosten voor een lokaal kantoor of team", "Geen inzicht in welke markten het meest kansrijk zijn"],
    solutionTitle: "Nieuwe markten,", solutionTitleGradient: "zelfde systeem.",
    solutionDescription: "Wij repliceren uw bewezen commerciële systeem in nieuwe markten: aangepast aan lokale cultuur, taal en gewoonten.",
    features: [
      { title: "Marktanalyse", description: "Data-gedreven selectie van de meest kansrijke markten en segmenten." },
      { title: "Lokale aanpassing", description: "Berichten, timing en kanalen afgestemd op lokale zakelijke cultuur." },
      { title: "Meertalige outreach", description: "Native-level communicatie in de taal van uw doelgroep." },
      { title: "Remote salesteam", description: "Geen kantoor nodig: wij opereren volledig digitaal vanuit elke markt." },
    ],
    resultTitle: "Resultaat",
    results: [{ metric: "4", label: "nieuwe markten tegelijk betreden" }, { metric: "60", label: "dagen tot eerste gekwalificeerde afspraken" }, { metric: "0", label: "lokale kantoren nodig" }],
  },
  "versnipperde-tools": {
    metaTitle: "Sales in 5 losse tools? Tijd voor integratie — B2BGroeiMachine",
    metaDescription: "Uw sales en recruitment draait op losse tools die niet samenwerken. Wij integreren alles in één gestroomlijnd platform.",
    heroTitle: "Sales in 5", heroTitleGradient: "losse tools?",
    heroDescription: "CRM hier, e-mailtool daar, LinkedIn apart, spreadsheets ertussen. Uw team verliest dagelijks uren aan het schakelen tussen systemen die niet met elkaar praten.",
    problemTitle: "Herkenbaar?", problemDescription: "Versnipperde tools leiden tot dataverlies, dubbel werk en een incompleet beeld.",
    problems: ["Elke tool heeft eigen data die niet synchroon loopt", "Niemand heeft een compleet overzicht van de pipeline", "Rapportages vereisen handmatig samenvoegen uit meerdere bronnen", "Nieuwe medewerkers hebben weken nodig om alle tools te leren"],
    solutionTitle: "Eén", solutionTitleGradient: "geïntegreerd platform.",
    solutionDescription: "Wij consolideren uw toolstack tot een gestroomlijnd systeem waar alles samenwerkt.",
    features: [
      { title: "Tool audit", description: "Analyse van uw huidige stack: wat blijft, wat gaat, wat mist." },
      { title: "Naadloze integratie", description: "Tools die met elkaar praten via API-koppelingen en automatiseringen." },
      { title: "Single source of truth", description: "Eén centraal dashboard met al uw commerciële data." },
      { title: "Training & adoptie", description: "Uw team leert het nieuwe systeem in dagen, niet weken." },
    ],
    resultTitle: "Resultaat",
    results: [{ metric: "75%", label: "minder tijd aan tool-switching" }, { metric: "100%", label: "datasynchronisatie tussen systemen" }, { metric: "1", label: "dashboard voor het hele commerciële proces" }],
  },
  "weg-uit-excel": {
    metaTitle: "Werkt u nog vanuit Excel? Stap over naar een CRM — B2BGroeiMachine",
    metaDescription: "Excel is geen CRM. Wij migreren uw salesproces van spreadsheets naar een professioneel, schaalbaar pipeline-systeem.",
    heroTitle: "Nog steeds werken", heroTitleGradient: "vanuit Excel?",
    heroDescription: "Uw pipeline staat in een spreadsheet. Opvolgingen worden gemist, versies lopen door elkaar en niemand heeft realtime overzicht. Het kan anders.",
    problemTitle: "Herkenbaar?", problemDescription: "Excel werkt prima voor 10 leads. Bij 100 wordt het een nachtmerrie.",
    problems: ["Meerdere versies van dezelfde spreadsheet in omloop", "Geen automatische reminders voor opvolging", "Onmogelijk om te rapporteren op conversieratio's of doorlooptijden", "Data gaat verloren bij personeelswisselingen"],
    solutionTitle: "Van spreadsheets naar", solutionTitleGradient: "pipeline.",
    solutionDescription: "Wij migreren uw data, richten een professioneel CRM in en trainen uw team, zodat u binnen twee weken werkt met een systeem dat meegroeit.",
    features: [
      { title: "CRM selectie & inrichting", description: "Het juiste CRM voor uw bedrijf, correct geconfigureerd vanaf dag één." },
      { title: "Datamigratie", description: "Al uw bestaande data netjes overgezet, opgeschoond en verrijkt." },
      { title: "Automatische workflows", description: "Opvolgreminders, pipeline stages en rapportages die zichzelf draaien." },
      { title: "Team training", description: "Hands-on training zodat iedereen het systeem vanaf dag één gebruikt." },
    ],
    resultTitle: "Resultaat",
    results: [{ metric: "0", label: "leads die door de mazen glippen" }, { metric: "2", label: "weken tot volledig operationeel" }, { metric: "100%", label: "realtime inzicht in uw pipeline" }],
  },
  "gerichte-prospecting": {
    metaTitle: "Schieten met hagel? Tijd voor precisie-targeting — B2BGroeiMachine",
    metaDescription: "Stop met massa-outreach die niemand beantwoordt. Wij helpen u de juiste bedrijven te benaderen, op het juiste moment, met de juiste boodschap.",
    heroTitle: "Schieten met", heroTitleGradient: "hagel?",
    heroDescription: "U stuurt honderden berichten, maar de response is minimaal. Het probleem is niet het volume, het is de targeting. Wij draaien dat om.",
    problemTitle: "Herkenbaar?", problemDescription: "Meer berichten sturen lost niets op als u de verkeerde mensen bereikt.",
    problems: ["Lage reply rates ondanks hoog outreach volume", "Geen duidelijk Ideal Customer Profile gedefinieerd", "Berichten zijn te generiek om op te vallen", "Geen inzicht in welke prospects daadwerkelijk koopintentie hebben"],
    solutionTitle: "Van massa naar", solutionTitleGradient: "precisie.",
    solutionDescription: "Wij definiëren uw ideale klantprofiel, verrijken het met intent data en koopsignalen, en benaderen alleen prospects die er nu klaar voor zijn.",
    features: [
      { title: "ICP-definitie", description: "Scherp afgebakend profiel op basis van data, niet aannames." },
      { title: "Signal-based targeting", description: "Alleen prospects benaderen die actieve koopsignalen afgeven." },
      { title: "Gepersonaliseerde berichten", description: "Elk bericht afgestemd op de specifieke situatie van de prospect." },
      { title: "Continue optimalisatie", description: "A/B testing en data-analyse om conversie continu te verhogen." },
    ],
    resultTitle: "Resultaat na 90 dagen",
    results: [{ metric: "4x", label: "hogere reply rates" }, { metric: "60%", label: "minder outreach volume nodig" }, { metric: "50%", label: "meer gekwalificeerde afspraken" }],
  },
};

// ── Client-specific landing pages (/voor/:slug) ──
// Private pages, served as noindex but with rich per-client OG tags for social previews.
const CLIENT_PAGES: Record<string, {
  clientName: string;
  title: string;
  description: string;
  ogImage: string;
  h1: string;
  intro: string;
}> = {
  hego: {
    clientName: "HEGO",
    title: "HEGO × B2BGroeiMachine — Market Activation Playbook",
    description: "Persoonlijk playbook voor HEGO: hoe wij groothandel, traders en producenten activeren rond RVS, aluminium en maatwerk bewerkingen.",
    ogImage: `${SITE_URL}/og/hego.jpg`,
    h1: "HEGO × B2BGroeiMachine — Market Activation Playbook",
    intro: "Persoonlijk playbook voor HEGO. Onze analyse, aanpak en eerste plan voor RVS, aluminium en maatwerk bewerkingen.",
  },
};

// ── HTML builder ──

function buildHtml(meta: {
  title: string;
  description: string;
  url: string;
  h1: string;
  bodyContent: string;
  extraHead?: string;
  ogImage?: string;
  noindex?: boolean;
}): string {
  const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  ${meta.noindex ? `<meta name="robots" content="noindex, nofollow">` : ""}
  <link rel="canonical" href="${escapeHtml(meta.url)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:url" content="${escapeHtml(meta.url)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:locale" content="nl_NL">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">
  ${meta.extraHead || ""}
</head>
<body>
  <header>
    <nav>
      <a href="${SITE_URL}/">${SITE_NAME}</a>
      <a href="${SITE_URL}/over-ons">Over Ons</a>
      <a href="${SITE_URL}/pricing">Pricing</a>
      <a href="${SITE_URL}/blog">Blog</a>
      <a href="${SITE_URL}/contact">Contact</a>
    </nav>
  </header>
  <main>
    <h1>${escapeHtml(meta.h1)}</h1>
    ${meta.bodyContent}
  </main>
  <footer>
    <p>&copy; 2024 ${SITE_NAME}. Alle rechten voorbehouden.</p>
  </footer>
</body>
</html>`;
}

const cacheHeaders = {
  ...corsHeaders,
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  "X-Prerender": "1",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/";
    const noCache = url.searchParams.get("nocache") === "1";
    const pageUrl = `${SITE_URL}${path}`;

    // Check cache first
    if (!noCache) {
      const cached = getCached(path);
      if (cached) {
        return new Response(cached, {
          headers: { ...cacheHeaders, "X-Cache": "HIT" },
        });
      }
    }

    // 1. Static pages
    const staticPage = STATIC_PAGES[path];
    if (staticPage) {
      const html = buildHtml({
        title: staticPage.title,
        description: staticPage.description,
        url: pageUrl,
        h1: staticPage.h1,
        bodyContent: staticPage.bodyContent,
        extraHead: staticPage.extraHead,
      });
      setCache(path, html);
      return new Response(html, {
        headers: { ...cacheHeaders, "X-Cache": "MISS" },
      });
    }

    // 2. Blog post: /blog/:slug
    const blogMatch = path.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: post } = await supabase
        .from("blog_posts")
        .select("title, excerpt, meta_description, content, featured_image, published_at")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (post) {
        const plainContent = post.content
          .replace(/#{1,6}\s/g, "")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
          .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
          .replace(/```[\s\S]*?```/g, "")
          .replace(/`([^`]+)`/g, "$1")
          .replace(/\n{2,}/g, "</p><p>")
          .substring(0, 5000);

        const ogImage = post.featured_image || DEFAULT_OG_IMAGE;
        const extraHead = `
          <meta property="og:type" content="article">
          <meta property="og:image" content="${escapeHtml(ogImage)}">
          <meta name="twitter:image" content="${escapeHtml(ogImage)}">
          ${post.published_at ? `<meta property="article:published_time" content="${post.published_at}">` : ""}
          <script type="application/ld+json">
          ${JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.meta_description || post.excerpt || "",
            image: ogImage,
            datePublished: post.published_at,
            author: { "@type": "Organization", name: SITE_NAME },
            publisher: { "@type": "Organization", name: SITE_NAME },
          })}
          </script>`;

        const html = buildHtml({
          title: `${post.title} — ${SITE_NAME}`,
          description: post.meta_description || post.excerpt || "",
          url: pageUrl,
          h1: post.title,
          bodyContent: `<p>${plainContent}</p>`,
          extraHead,
          ogImage,
        });
        setCache(path, html);
        return new Response(html, {
          headers: { ...cacheHeaders, "X-Cache": "MISS" },
        });
      }
    }

    // 3. Sector page: /sectoren/:slug
    const sectorMatch = path.match(/^\/sectoren\/([^/]+)$/);
    if (sectorMatch) {
      const slug = sectorMatch[1];
      const sector = SECTORS[slug];

      if (sector) {
        const sectorBody = `
<p>${escapeHtml(sector.description)}</p>
<section>
  <h2>Uitdagingen in ${escapeHtml(sector.title)}</h2>
  <ul>${sector.challenges.map(c => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
</section>
<section>
  <h2>Onze aanpak voor ${escapeHtml(sector.title)}</h2>
  <ul>${sector.solutions.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
</section>
<section>
  <h2>Signalen die wij volgen</h2>
  <ul>${sector.signals.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
</section>
<p><a href="https://app.usemotion.com/meet/Rebel-Force/meeting">Bespreek uw situatie</a></p>`;

        const html = buildHtml({
          title: sector.metaTitle,
          description: sector.metaDescription,
          url: pageUrl,
          h1: `${sector.title} — ${sector.tagline}`,
          bodyContent: sectorBody,
        });
        setCache(path, html);
        return new Response(html, {
          headers: { ...cacheHeaders, "X-Cache": "MISS" },
        });
      }

      // Fallback for unknown sector slugs
      const html = buildHtml({
        title: `${slug.replace(/-/g, " ")} — ${SITE_NAME}`,
        description: `B2B sales automation voor de ${slug.replace(/-/g, " ")} sector.`,
        url: pageUrl,
        h1: slug.replace(/-/g, " "),
        bodyContent: `<p>Ontdek hoe B2BGroeiMachine bedrijven in de ${escapeHtml(slug.replace(/-/g, " "))} sector helpt met schaalbare sales automation.</p>`,
      });
      setCache(path, html);
      return new Response(html, {
        headers: { ...cacheHeaders, "X-Cache": "MISS" },
      });
    }

    // 4. Solution page: /solutions/:slug
    const solutionMatch = path.match(/^\/solutions\/([^/]+)$/);
    if (solutionMatch) {
      const slug = solutionMatch[1];
      const solution = SOLUTIONS[slug];

      if (solution) {
        const solutionBody = `
<p>${escapeHtml(solution.heroDescription)}</p>
<section>
  <h2>${escapeHtml(solution.problemTitle)}</h2>
  <p>${escapeHtml(solution.problemDescription)}</p>
  <ul>${solution.problems.map(p => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
</section>
<section>
  <h2>${escapeHtml(solution.solutionTitle)} ${escapeHtml(solution.solutionTitleGradient)}</h2>
  <p>${escapeHtml(solution.solutionDescription)}</p>
  <ul>${solution.features.map(f => `<li><strong>${escapeHtml(f.title)}</strong> — ${escapeHtml(f.description)}</li>`).join("")}</ul>
</section>
<section>
  <h2>${escapeHtml(solution.resultTitle)}</h2>
  <ul>${solution.results.map(r => `<li><strong>${escapeHtml(r.metric)}</strong> ${escapeHtml(r.label)}</li>`).join("")}</ul>
</section>
<p><a href="https://app.usemotion.com/meet/Rebel-Force/meeting">Bespreek uw situatie</a></p>`;

        const html = buildHtml({
          title: solution.metaTitle,
          description: solution.metaDescription,
          url: pageUrl,
          h1: `${solution.heroTitle} ${solution.heroTitleGradient}`,
          bodyContent: solutionBody,
        });
        setCache(path, html);
        return new Response(html, {
          headers: { ...cacheHeaders, "X-Cache": "MISS" },
        });
      }

      // Fallback for unknown solution slugs
      const title = slug.replace(/-/g, " ");
      const html = buildHtml({
        title: `${title} — ${SITE_NAME}`,
        description: `${title} — onze oplossing voor ambitieuze B2B-bedrijven.`,
        url: pageUrl,
        h1: title,
        bodyContent: `<p>Lees meer over onze ${escapeHtml(title)} oplossing voor B2B sales automation.</p>
<p><a href="https://app.usemotion.com/meet/Rebel-Force/meeting">Bespreek uw situatie</a></p>`,
      });
      setCache(path, html);
      return new Response(html, {
        headers: { ...cacheHeaders, "X-Cache": "MISS" },
      });
    }

    // 5. Blog index with posts list
    if (path === "/blog") {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: posts } = await supabase
        .from("blog_posts")
        .select("title, slug, excerpt, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(50);

      const postsList = (posts || [])
        .map(
          (p) =>
            `<article><h2><a href="${SITE_URL}/blog/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.excerpt || "")}</p></article>`
        )
        .join("\n");

      const page = STATIC_PAGES["/blog"];
      const html = buildHtml({
        title: page.title,
        description: page.description,
        url: pageUrl,
        h1: page.h1,
        bodyContent: page.bodyContent + postsList,
      });
      setCache(path, html);
      return new Response(html, {
        headers: { ...cacheHeaders, "X-Cache": "MISS" },
      });
    }

    // 6. Client landing pages: /voor/:slug (noindex, per-client OG tags)
    const clientMatch = path.match(/^\/voor\/([^/]+)$/);
    if (clientMatch) {
      const slug = clientMatch[1];
      const client = CLIENT_PAGES[slug];
      if (client) {
        const body = `
<section>
  <h2>${escapeHtml(client.clientName)}</h2>
  <p>${escapeHtml(client.intro)}</p>
</section>
<p><a href="${SITE_URL}/">Terug naar ${SITE_NAME}</a></p>`;
        const html = buildHtml({
          title: client.title,
          description: client.description,
          url: pageUrl,
          h1: client.h1,
          bodyContent: body,
          ogImage: client.ogImage,
          noindex: true,
        });
        setCache(path, html);
        return new Response(html, {
          headers: { ...cacheHeaders, "X-Cache": "MISS" },
        });
      }
      // Unknown client slug: still serve noindex stub
      const html = buildHtml({
        title: `${SITE_NAME} — Persoonlijke pagina`,
        description: "Persoonlijke pagina.",
        url: pageUrl,
        h1: "Persoonlijke pagina",
        bodyContent: `<p><a href="${SITE_URL}/">Terug naar ${SITE_NAME}</a></p>`,
        noindex: true,
      });
      return new Response(html, {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Fallback: 404
    return new Response(
      buildHtml({
        title: `Pagina niet gevonden — ${SITE_NAME}`,
        description: "Deze pagina bestaat niet.",
        url: pageUrl,
        h1: "Pagina niet gevonden",
        bodyContent: `<p>De pagina die je zoekt bestaat niet. <a href="${SITE_URL}/">Ga terug naar de homepage</a>.</p>`,
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      }
    );
  } catch (error) {
    console.error("Prerender error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
