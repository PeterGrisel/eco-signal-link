export interface LayerField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'dropdown' | 'multiselect' | 'number' | 'checkbox';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string | number;
}

export interface ToolCard {
  name: string;
  purpose: string;
  cost?: string;
  question?: string;
}

export interface CaseStudy {
  situation: string;
  result: string;
  lesson: string;
}

export interface StatComparison {
  before: { label: string; value: string };
  after: { label: string; value: string };
}

export interface VeloxTip {
  fieldKey: string;
  tip: string;
}

export interface LayerConfig {
  id: number;
  slug: string;
  title: string;
  themeColor: string;
  scoreContribution: number;
  waarom: {
    headline: string;
    body: string;
    caseStudy?: CaseStudy;
    stats?: StatComparison;
    mistake?: { title: string; body: string };
    principle?: string;
  };
  wat: {
    instruction: string;
    fields: LayerField[];
    veloxTips?: VeloxTip[];
  };
  hoe?: {
    instruction: string;
    tools: ToolCard[];
  };
  blueprintTemplate: (inputs: Record<string, any>) => string;
}

export const LAYERS: LayerConfig[] = [
  // ─── LAAG 01 — DEFINITIE ───
  {
    id: 1,
    slug: 'definitie',
    title: 'Definitie',
    themeColor: '#6B6B72',
    scoreContribution: 0,
    waarom: {
      headline: 'De meeste systemen definiëren wie. Stoppen dan.',
      body: `Timing wint van volume. Maar timing vereist definitie. Niet wie je ideale klant is in abstracto — maar wie historisch het snelst sloot, het langst bleef, het minst moeite kostte. Dat is je fundament.

Drie vragen sturen het hele systeem aan: wie, in welke staat, met welk profiel. Als één van de drie vaag is, klopt het systeem nooit.

De definitie-laag is het fundament. Geen score, want zonder fundament heeft scoren geen zin. Alles wat je hierna bouwt, staat of valt met de scherpte van deze laag.`,
      caseStudy: {
        situation: 'Velox Solutions, een B2B SaaS scale-up met 45 man, targette "tech companies in Europa". Hun SDR-team stuurde 2.000 mails per week naar een brede lijst. De pipeline groeide, maar deals strandden steeds in de onderhandelingsfase — de prospects bleken niet de juiste fit.',
        result: 'Na analyse van hun 20 best-converterende deals verfijnde Velox hun ICP naar: "B2B SaaS, 50-200 FTE, met een nieuwe VP Sales, in de Benelux." De lijst kromp van 12.000 naar 340 bedrijven — maar de reply rate steeg van 2% naar 11%.',
        lesson: 'Minder bereik, meer impact. Velox boekte meer omzet met 340 prospects dan met 12.000.',
      },
      stats: {
        before: { label: 'Reply rate (breed ICP)', value: '2%' },
        after: { label: 'Reply rate (scherp ICP)', value: '11%' },
      },
      mistake: {
        title: 'De "management" valkuil',
        body: '"Management" als functietitel matcht 12.000 mensen. "VP Sales bij scale-ups met Series A" matcht 47 — en die zijn allemaal relevant. Velox maakte deze fout drie maanden lang voordat ze het doorhadden.',
      },
      principle: 'Hoe smaller je definitie, hoe sterker elk signaal dat erop volgt.',
    },
    wat: {
      instruction: 'Pas dit toe op jouw situatie',
      fields: [
        { key: 'industrie', label: 'Industrie', type: 'text', placeholder: 'Bijv. Maakindustrie, Logistiek', required: true },
        { key: 'bedrijfsgrootte', label: 'Bedrijfsgrootte', type: 'dropdown', options: [
          { value: '10-50', label: '10–50 FTE' },
          { value: '50-200', label: '50–200 FTE' },
          { value: '200-500', label: '200–500 FTE' },
          { value: '500+', label: '500+ FTE' },
        ], required: true },
        { key: 'functietitel', label: 'Functietitel beslisser', type: 'text', placeholder: 'Exacte titel van beslisser', required: true },
        { key: 'geografie', label: 'Geografie', type: 'multiselect', options: [
          { value: 'NL', label: 'Nederland' },
          { value: 'DACH', label: 'DACH' },
          { value: 'Benelux', label: 'Benelux' },
          { value: 'Europa', label: 'Europa' },
        ], required: true },
        { key: 'staat_a', label: 'Organisatorische trigger', type: 'text', placeholder: 'Bijv. nieuwe CTO aangesteld', required: true },
        { key: 'staat_b', label: 'Groeidruk trigger', type: 'text', placeholder: 'Bijv. 30% headcount groei in 6 maanden' },
        { key: 'uitsluiten', label: 'Wat sluit je expliciet uit?', type: 'textarea', placeholder: 'Bijv. Overheid, bedrijven < 10 FTE' },
      ],
      veloxTips: [
        { fieldKey: 'industrie', tip: 'Velox begon met "tech" — veel te breed. Pas toen ze kozen voor "B2B SaaS met een sales-team van 5+" werden hun signalen bruikbaar.' },
        { fieldKey: 'functietitel', tip: 'Velox maakte de fout om "management" te targeten. Toen ze switchten naar "VP Sales" daalde hun lijst van 12.000 naar 340 — maar de conversie vertienvoudigde.' },
        { fieldKey: 'staat_a', tip: 'De gouden trigger van Velox: "nieuwe VP Sales aangesteld in de laatste 90 dagen." Dit ene signaal voorspelde 40% van hun deals.' },
        { fieldKey: 'bedrijfsgrootte', tip: 'Velox ontdekte dat hun product het best paste bij 50-200 FTE. Kleiner had geen budget, groter had al interne oplossingen.' },
        { fieldKey: 'uitsluiten', tip: 'Velox vergat maandenlang om overheid en onderwijs uit te sluiten. Die leads scoorden hoog maar converteerden nooit vanwege procurement-processen.' },
      ],
    },
    blueprintTemplate: (inputs) => {
      const geo = Array.isArray(inputs.geografie) ? inputs.geografie.join(', ') : inputs.geografie || '';
      return `TARGET: ${inputs.industrie || '—'}, ${inputs.bedrijfsgrootte || '—'} FTE, ${geo || '—'}
BESLISSER: ${inputs.functietitel || '—'}
STAAT: ${inputs.staat_a || '—'}${inputs.staat_b ? ` OF ${inputs.staat_b}` : ''}
UITSLUITEN: ${inputs.uitsluiten || '—'}`;
    },
  },

  // ─── LAAG 02 — SIGNAALGEWICHTEN ───
  {
    id: 2,
    slug: 'signaalgewichten',
    title: 'Signaalgewichten',
    themeColor: '#A78BFA',
    scoreContribution: 15,
    waarom: {
      headline: 'Één signaal is ruis. Combinatie is intentie.',
      body: `Een enkele trigger — een vacature, een funding-ronde, een job change — zegt weinig. Het kan toeval zijn. Maar als drie signalen samenvallen bij hetzelfde account, heb je geen lead meer. Je hebt intentie.

De kunst is niet meer signalen verzamelen. De kunst is gewicht toekennen. Welk signaal is goud waard in jouw markt? Welk signaal is ruis? Dat verschilt per industrie, per ICP, per aanbieding.

In deze laag bouw je je scorematrix. Je bepaalt welke combinatie van signalen een prospect van 'koud' naar 'heet' tilt.`,
      caseStudy: {
        situation: 'Velox gaf elk signaal hetzelfde gewicht: een LinkedIn-postje telde even zwaar als een Series A-ronde. Het resultaat? Een waslijst van "warme" leads die eigenlijk lauw waren. Het sales team verloor vertrouwen in het systeem.',
        result: 'Na 3 maanden data-analyse ontdekte Velox dat twee signalen 80% van hun gesloten deals voorspelden: een nieuwe VP Sales + recente funding. Ze verhoogden die gewichten naar 30 en 25, en verlaagden de rest. Het percentage qualified leads steeg van 12% naar 34%.',
        lesson: 'Niet alle signalen zijn gelijk. Velox stopte met democratisch wegen en begon met data-gedreven prioriteren.',
      },
      stats: {
        before: { label: 'Qualified leads (gelijk gewicht)', value: '12%' },
        after: { label: 'Qualified leads (gewogen)', value: '34%' },
      },
      mistake: {
        title: 'De democratie-fout',
        body: 'Alle signalen hetzelfde gewicht geven voelt eerlijk, maar is dodelijk. Als een LinkedIn-like even zwaar telt als een funding-ronde, verdrinkt het echte signaal in de ruis. Velox had 200+ "warme" leads per week — waarvan er 8 echt warm waren.',
      },
      principle: 'Eén sterk signaal verslaat tien zwakke.',
    },
    wat: {
      instruction: 'Stel de gewichten in voor jouw signalen',
      fields: [
        { key: 'leidinggevende_gewisseld', label: 'Leidinggevende gewisseld', type: 'number', defaultValue: 30 },
        { key: 'funding_ontvangen', label: 'Funding ontvangen', type: 'number', defaultValue: 25 },
        { key: 'specifieke_vacature', label: 'Specifieke vacature', type: 'number', defaultValue: 20 },
        { key: 'competitor_churned', label: 'Competitor churned', type: 'number', defaultValue: 20 },
        { key: 'tech_stack_wijziging', label: 'Tech stack wijziging', type: 'number', defaultValue: 15 },
        { key: 'headcount_groei', label: 'Headcount groei', type: 'number', defaultValue: 15 },
        { key: 'industrie_match', label: 'Industrie match', type: 'number', defaultValue: 5 },
        { key: 'bedrijfsgrootte_match', label: 'Bedrijfsgrootte match', type: 'number', defaultValue: 5 },
        { key: 'drempel_actie', label: 'Drempel voor actie', type: 'number', defaultValue: 40 },
      ],
      veloxTips: [
        { fieldKey: 'leidinggevende_gewisseld', tip: 'Dit was Velox\'s #1 signaal. Een nieuwe VP Sales betekende bijna altijd een review van tooling in de eerste 90 dagen.' },
        { fieldKey: 'funding_ontvangen', tip: 'Velox ontdekte dat Series A bedrijven 3x vaker converteerden dan Seed — ze hadden budget én urgentie.' },
        { fieldKey: 'drempel_actie', tip: 'Velox begon met drempel 20 en kreeg 47 alerts per dag. Bij 40 daalde dat naar 8 kwalitatieve alerts. Start hoger dan je denkt.' },
        { fieldKey: 'competitor_churned', tip: 'Competitor churn was Velox\'s geheim wapen: accounts die net van een concurrent af waren, hadden al een bewezen behoefte.' },
      ],
    },
    blueprintTemplate: (inputs) => {
      const signals = [
        'leidinggevende_gewisseld', 'funding_ontvangen', 'specifieke_vacature',
        'competitor_churned', 'tech_stack_wijziging', 'headcount_groei',
        'industrie_match', 'bedrijfsgrootte_match'
      ];
      const rows = signals.map(s => `  ${s.replace(/_/g, ' ')}: ${inputs[s] ?? 0}`).join('\n');
      return `SCOREMATRIX:\n${rows}\n\nDREMPEL ACTIE: ${inputs.drempel_actie ?? 40}`;
    },
  },

  // ─── LAAG 03 — BRONNEN ───
  {
    id: 3,
    slug: 'bronnen',
    title: 'Bronnen',
    themeColor: '#60A5FA',
    scoreContribution: 15,
    waarom: {
      headline: 'Elke bron is een tap. Eerst bouwen. Dan automatiseren.',
      body: `Je hebt nu een scorematrix. Maar scores hebben data nodig. Elke databron is een kraan die je openzet — en elke kraan levert een ander type signaal.

Het gevaar is te veel bronnen tegelijk openzetten. Dan verdrink je in data zonder dat je weet wat je ermee moet. Begin met de bronnen die jouw sterkste signalen leveren. Voeg pas toe als de eerste stroom loopt.

De volgorde is cruciaal: eerst de vraag, dan de bron. Niet andersom. Te veel teams kiezen tools voordat ze weten welke vraag ze beantwoorden.`,
      caseStudy: {
        situation: 'Velox tekende abonnementen op 7 databronnen tegelijk: Apollo, LinkedIn Sales Nav, Crunchbase, Clay, BuiltWith, Bombora en Google Alerts. Het team besteedde 4 uur per dag aan het checken van dashboards. Na twee maanden was niemand meer gemotiveerd.',
        result: 'Ze schaalden terug naar 3 bronnen: LinkedIn (job changes), Crunchbase (funding) en hun eigen CRM (closed-lost revisits). De monitoring-tijd daalde van 4 uur naar 45 minuten. De kwaliteit van hun signalen steeg omdat ze zich konden focussen.',
        lesson: 'Velox leerde: begin met 2-3 bronnen die je sterkste signalen voeden. Voeg pas toe als de eerste stroom loopt.',
      },
      stats: {
        before: { label: 'Dagelijkse monitor-tijd (7 bronnen)', value: '4 uur' },
        after: { label: 'Dagelijkse monitor-tijd (3 bronnen)', value: '45 min' },
      },
      mistake: {
        title: 'De tool-verzamelaar',
        body: 'Meer tools ≠ meer inzicht. Velox betaalde €1.200/maand aan tools die ze niet effectief gebruikten. Het probleem was niet de data — het was het gebrek aan focus op welke data ertoe deed.',
      },
      principle: 'Eerst de vraag, dan de bron. Nooit andersom.',
    },
    wat: {
      instruction: 'Selecteer de bronnen die relevant zijn voor jouw signalen',
      fields: [
        { key: 'linkedin', label: 'LinkedIn', type: 'checkbox' },
        { key: 'linkedin_detail', label: 'Welk type activiteit monitor je?', type: 'text', placeholder: 'Bijv. job changes, posts, connecties' },
        { key: 'jobboards', label: 'Jobboards', type: 'checkbox' },
        { key: 'jobboards_detail', label: 'Welke functietitels zijn signalen?', type: 'text', placeholder: 'Bijv. Head of Sales, CTO' },
        { key: 'funding_data', label: 'Funding data', type: 'checkbox' },
        { key: 'funding_data_detail', label: 'Welke rondes zijn relevant?', type: 'text', placeholder: 'Bijv. Series A, Seed' },
        { key: 'technografie', label: 'Technografie', type: 'checkbox' },
        { key: 'technografie_detail', label: 'Welke tools zijn indicatoren?', type: 'text', placeholder: 'Bijv. Salesforce, HubSpot, Marketo' },
        { key: 'nieuws', label: 'Nieuws', type: 'checkbox' },
        { key: 'nieuws_detail', label: 'Welke zoektermen gebruik je?', type: 'text', placeholder: 'Bijv. overname, expansie, IPO' },
        { key: 'crm_historiek', label: 'CRM historiek', type: 'checkbox' },
        { key: 'crm_historiek_detail', label: 'Hoe ver terug kijk je?', type: 'text', placeholder: 'Bijv. 12 maanden' },
        { key: 'intent_platforms', label: 'Intent platforms', type: 'checkbox' },
        { key: 'intent_platforms_detail', label: 'Welke categorieën?', type: 'text', placeholder: 'Bijv. Sales Automation, CRM software' },
      ],
    },
    hoe: {
      instruction: 'Kies je executie-tools voor databronnen',
      tools: [
        { name: 'Apollo.io', purpose: 'Technografie + contactdata', cost: '$49-99/mo', question: 'Welke technografische signalen zijn leidend?' },
        { name: 'LinkedIn Sales Nav', purpose: 'Gedragssignalen', cost: '$79/mo', question: 'Welke gedragsveranderingen monitor je?' },
        { name: 'Crunchbase', purpose: 'Funding events', cost: '$29-49/mo', question: 'Welke funding rondes zijn relevant?' },
        { name: 'Clay', purpose: 'Multi-bron enrichment', cost: '$149/mo', question: 'Hoeveel bronnen combineer je?' },
        { name: 'BuiltWith', purpose: 'Technografische detectie', cost: '$295/mo', question: 'Welke tech stack changes zijn signalen?' },
        { name: 'Google Alerts', purpose: 'Nieuws monitoring (gratis)', cost: 'Gratis', question: 'Welke zoektermen zijn het meest specifiek?' },
        { name: 'Bombora', purpose: 'Intent data', cost: 'Op aanvraag', question: 'Welke intent categorieën matchen je aanbod?' },
      ],
    },
    blueprintTemplate: (inputs) => {
      const sources = ['linkedin', 'jobboards', 'funding_data', 'technografie', 'nieuws', 'crm_historiek', 'intent_platforms'];
      const active = sources.filter(s => inputs[s]);
      const details = active.map(s => `  ${s}: ${inputs[s + '_detail'] || '—'}`).join('\n');
      const tools = (inputs._selectedTools || []).join(', ');
      return `BRONNEN (${active.length}):\n${details || '  Geen geselecteerd'}\n\nTOOLS: ${tools || '—'}`;
    },
  },

  // ─── LAAG 04 — KRITISCHE VRAGEN ───
  {
    id: 4,
    slug: 'kritische-vragen',
    title: 'Kritische Vragen',
    themeColor: '#2DD4BF',
    scoreContribution: 20,
    waarom: {
      headline: 'De kwaliteit van de vraag bepaalt de kwaliteit van het tool.',
      body: `Tools doen wat je ze vraagt. Niet meer, niet minder. De meeste teams configureren hun tools met vage parameters en krijgen vage resultaten terug.

Een kritische vraag is de brug tussen jouw signaal en de databron. Het is de precieze formulering van wat je wilt weten. Niet "wie is er aan het groeien?" maar "welke bedrijven in de maakindustrie hebben hun engineering team met >20% uitgebreid in de afgelopen 90 dagen?"

Hoe scherper de vraag, hoe minder ruis. Hoe minder ruis, hoe minder tijd je verspilt aan false positives. Formuleer voor elke bron één onverbiddelijke vraag.`,
      caseStudy: {
        situation: 'Velox\'s oorspronkelijke zoekvraag in Apollo was: "Toon bedrijven die groeien." Het resultaat: 4.000+ hits per week, waarvan minder dan 2% relevant. Hun SDR team scrollde door eindeloze lijsten op zoek naar de naald in de hooiberg.',
        result: 'Na het herformuleren naar: "Welke B2B SaaS bedrijven (50-200 FTE, Benelux) hebben in de laatste 90 dagen een VP Sales aangesteld?" kregen ze 12-18 resultaten per week — waarvan 60% daadwerkelijk reageerde op outreach.',
        lesson: 'De vraag "wie groeit?" leverde ruis. De vraag "wie heeft net een beslisser aangesteld?" leverde deals.',
      },
      stats: {
        before: { label: 'Relevante hits (vage vraag)', value: '2%' },
        after: { label: 'Relevante hits (scherpe vraag)', value: '60%' },
      },
      mistake: {
        title: 'De "toon me alles" reflex',
        body: 'Velox dacht dat meer data beter was. Maar "toon me bedrijven die groeien" is geen vraag — het is een wens. Een kritische vraag bevat altijd: wie, welke verandering, welk tijdvenster, en welke drempel.',
      },
      principle: 'Een vage vraag krijgt een vaag antwoord. Een scherpe vraag krijgt een deal.',
    },
    wat: {
      instruction: 'Formuleer per geselecteerde bron één kritische vraag',
      fields: [
        { key: 'vraag_linkedin', label: 'Kritische vraag — LinkedIn', type: 'text', placeholder: 'Bijv. Is de DMU gewisseld in de laatste 90 dagen?' },
        { key: 'output_linkedin', label: 'Gewenste output — LinkedIn', type: 'text', placeholder: 'Bijv. Lijst met naam, titel, bedrijf, datum' },
        { key: 'vertraging_linkedin', label: 'Acceptabele vertraging — LinkedIn', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
        { key: 'vraag_jobboards', label: 'Kritische vraag — Jobboards', type: 'text', placeholder: 'Bijv. Staat er een VP Sales vacature open bij >200 FTE?' },
        { key: 'output_jobboards', label: 'Gewenste output — Jobboards', type: 'text', placeholder: 'Bijv. Bedrijfsnaam, vacature URL, publicatiedatum' },
        { key: 'vertraging_jobboards', label: 'Acceptabele vertraging — Jobboards', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
        { key: 'vraag_funding', label: 'Kritische vraag — Funding', type: 'text', placeholder: 'Bijv. Heeft het bedrijf Series A+ ontvangen in de laatste 6 maanden?' },
        { key: 'output_funding', label: 'Gewenste output — Funding', type: 'text', placeholder: 'Bijv. Bedrijf, bedrag, ronde, datum' },
        { key: 'vertraging_funding', label: 'Acceptabele vertraging — Funding', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
        { key: 'vraag_technografie', label: 'Kritische vraag — Technografie', type: 'text', placeholder: 'Bijv. Is er een switch van competitor tool naar alternatief?' },
        { key: 'output_technografie', label: 'Gewenste output — Technografie', type: 'text', placeholder: '' },
        { key: 'vertraging_technografie', label: 'Acceptabele vertraging — Technografie', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
        { key: 'vraag_nieuws', label: 'Kritische vraag — Nieuws', type: 'text', placeholder: 'Bijv. Is er een overname, fusie of expansie aangekondigd?' },
        { key: 'output_nieuws', label: 'Gewenste output — Nieuws', type: 'text', placeholder: '' },
        { key: 'vertraging_nieuws', label: 'Acceptabele vertraging — Nieuws', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
        { key: 'vraag_crm', label: 'Kritische vraag — CRM historiek', type: 'text', placeholder: 'Bijv. Welke closed-lost deals zijn >6 maanden oud?' },
        { key: 'output_crm', label: 'Gewenste output — CRM', type: 'text', placeholder: '' },
        { key: 'vertraging_crm', label: 'Acceptabele vertraging — CRM', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
        { key: 'vraag_intent', label: 'Kritische vraag — Intent platforms', type: 'text', placeholder: 'Bijv. Welke accounts tonen intent op onze categorie?' },
        { key: 'output_intent', label: 'Gewenste output — Intent', type: 'text', placeholder: '' },
        { key: 'vertraging_intent', label: 'Acceptabele vertraging — Intent', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
      ],
    },
    blueprintTemplate: (inputs) => {
      const sources = ['linkedin', 'jobboards', 'funding', 'technografie', 'nieuws', 'crm', 'intent'];
      const rows = sources
        .filter(s => inputs[`vraag_${s}`])
        .map(s => `  ${s.toUpperCase()}:\n    Vraag: ${inputs[`vraag_${s}`]}\n    Output: ${inputs[`output_${s}`] || '—'}\n    Vertraging: ${inputs[`vertraging_${s}`] || '—'}`)
        .join('\n');
      return `KRITISCHE VRAGEN:\n${rows || '  Nog niet ingevuld'}`;
    },
  },

  // ─── LAAG 05 — DETECTIE ───
  {
    id: 5,
    slug: 'detectie',
    title: 'Detectie',
    themeColor: '#34D399',
    scoreContribution: 15,
    waarom: {
      headline: 'Het systeem kijkt. Jij niet.',
      body: `Handmatig prospecten is het equivalent van met een verrekijker de horizon afzoeken. Het werkt — totdat je even niet kijkt. En dan mis je het moment.

Detectie is de laag waar je systeem autonoom wordt. Je stelt de frequentie in, de alert-methode, de filterlogica. Het systeem monitort continu. Jij handelt alleen als het signaal sterk genoeg is.

De meeste teams automatiseren te vroeg of te laat. Te vroeg: je automatiseert ruis. Te laat: je doet alles handmatig terwijl het systeem het werk kan doen. Deze laag is het kantelpunt.`,
      caseStudy: {
        situation: 'Velox\'s founder checkte elke ochtend handmatig LinkedIn, Crunchbase en Google Alerts. Op maandag was hij scherp. Op vrijdag vergat hij het. In één week miste hij 3 signalen — waarvan één leidde tot een deal bij een concurrent.',
        result: 'Na het instellen van dagelijkse geautomatiseerde scans met alerts via Slack, ontdekte Velox gemiddeld 40% meer relevante signalen per week. Reactietijd daalde van 3-5 dagen naar minder dan 4 uur.',
        lesson: 'Het systeem vergeet nooit. Velox\'s founder wel. Automatisering won het van discipline.',
      },
      stats: {
        before: { label: 'Gemiste signalen (handmatig)', value: '40%' },
        after: { label: 'Gemiste signalen (geautomatiseerd)', value: '3%' },
      },
      mistake: {
        title: 'De "ik check het zelf wel" illusie',
        body: 'Handmatig monitoren werkt als je 10 accounts volgt. Bij 100+ accounts mis je gegarandeerd signalen. Velox ontdekte achteraf dat ze in Q2 minstens 8 funding-rondes hadden gemist omdat niemand op vrijdag Crunchbase opende.',
      },
      principle: 'Wat je niet automatiseert, vergeet je. En wat je vergeet, wint je concurrent.',
    },
    wat: {
      instruction: 'Configureer je detectie-instellingen per bron',
      fields: [
        { key: 'freq_linkedin', label: 'Monitor frequentie — LinkedIn', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
        { key: 'alert_linkedin', label: 'Alert methode — LinkedIn', type: 'dropdown', options: [
          { value: 'email', label: 'Email' }, { value: 'slack', label: 'Slack' }, { value: 'crm', label: 'CRM' }, { value: 'webhook', label: 'Webhook' },
        ] },
        { key: 'filter_linkedin', label: 'Filterconditie — LinkedIn', type: 'text', placeholder: 'Bijv. Alleen C-level in target industrie' },
        { key: 'freq_jobboards', label: 'Monitor frequentie — Jobboards', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
        { key: 'alert_jobboards', label: 'Alert methode — Jobboards', type: 'dropdown', options: [
          { value: 'email', label: 'Email' }, { value: 'slack', label: 'Slack' }, { value: 'crm', label: 'CRM' }, { value: 'webhook', label: 'Webhook' },
        ] },
        { key: 'filter_jobboards', label: 'Filterconditie — Jobboards', type: 'text', placeholder: '' },
        { key: 'freq_funding', label: 'Monitor frequentie — Funding', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
        { key: 'alert_funding', label: 'Alert methode — Funding', type: 'dropdown', options: [
          { value: 'email', label: 'Email' }, { value: 'slack', label: 'Slack' }, { value: 'crm', label: 'CRM' }, { value: 'webhook', label: 'Webhook' },
        ] },
        { key: 'filter_funding', label: 'Filterconditie — Funding', type: 'text', placeholder: '' },
        { key: 'freq_overig', label: 'Monitor frequentie — Overig', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ] },
        { key: 'alert_overig', label: 'Alert methode — Overig', type: 'dropdown', options: [
          { value: 'email', label: 'Email' }, { value: 'slack', label: 'Slack' }, { value: 'crm', label: 'CRM' }, { value: 'webhook', label: 'Webhook' },
        ] },
        { key: 'filter_overig', label: 'Filterconditie — Overig', type: 'text', placeholder: '' },
      ],
    },
    hoe: {
      instruction: 'Kies je automatiseringstools',
      tools: [
        { name: 'Apollo Saved Searches', purpose: 'Automatisch bijhouden van zoekopdrachten', cost: 'Incl. in Apollo plan' },
        { name: 'Clay Waterfalls', purpose: 'Multi-bron sequentieel verrijken', cost: '$149+/mo' },
        { name: 'Zapier/Make', purpose: 'Webhook naar CRM koppeling', cost: '$19-49/mo' },
        { name: 'LinkedIn Alerts', purpose: 'Gratis job change tracking', cost: 'Gratis' },
        { name: 'PhantomBuster', purpose: 'Geautomatiseerd scrapen', cost: '$56-128/mo' },
      ],
    },
    blueprintTemplate: (inputs) => {
      const sources = ['linkedin', 'jobboards', 'funding', 'overig'];
      const rows = sources
        .filter(s => inputs[`freq_${s}`])
        .map(s => `  ${s.toUpperCase()}: ${inputs[`freq_${s}`]} → ${inputs[`alert_${s}`] || '—'}${inputs[`filter_${s}`] ? ` (${inputs[`filter_${s}`]})` : ''}`)
        .join('\n');
      const tools = (inputs._selectedTools || []).join(', ');
      return `DETECTIE-INSTELLINGEN:\n${rows || '  Nog niet geconfigureerd'}\n\nTOOLS: ${tools || '—'}`;
    },
  },

  // ─── LAAG 06 — DREMPELWAARDE ───
  {
    id: 6,
    slug: 'drempelwaarde',
    title: 'Drempelwaarde',
    themeColor: '#FBBF24',
    scoreContribution: 10,
    waarom: {
      headline: 'Timing is geen gevoel. Het is een getal.',
      body: `De meeste sales teams handelen op gevoel. "Dit voelt als een goede lead." Maar gevoel schaalt niet. Getallen wel.

Je drempelwaarde bepaalt wanneer het systeem handelt. Te laag: je reageert op ruis en verspilt je tijd. Te hoog: je mist kansen omdat het signaal niet sterk genoeg lijkt.

De juiste drempel is niet statisch. Het is een getal dat je bijstelt op basis van resultaten. Maar je hebt een startpunt nodig. In deze laag stel je vier zones in: monitoring, nurture, actief en prioriteit.`,
      caseStudy: {
        situation: 'Velox stelde hun drempel in op 15 punten — elke account met meer dan één signaal kreeg een alert. Het resultaat: 47 alerts per dag. Het sales team begon alerts te negeren. Na twee weken opende niemand meer de Slack-channel.',
        result: 'Ze verhoogden de drempel naar 40 punten en creëerden zones: monitoring (<20), nurture (20-39), actief (40-59) en prioriteit (≥60). Het aantal dagelijkse alerts daalde van 47 naar 8 — en elk alert leidde tot een actie.',
        lesson: 'Velox leerde dat de drempel niet laag genoeg moet zijn om alles te vangen — maar hoog genoeg om alleen te handelen als het ertoe doet.',
      },
      stats: {
        before: { label: 'Dagelijkse alerts (drempel 15)', value: '47' },
        after: { label: 'Dagelijkse alerts (drempel 40)', value: '8' },
      },
      mistake: {
        title: 'Alert fatigue',
        body: 'Een drempel van 15 klinkt veilig — je mist niets. Maar als je team 47 alerts per dag krijgt, missen ze alles. Velox ontdekte dat hun SDR team na week 2 geen enkel alert meer las. De tool werkte perfect. Het team niet meer.',
      },
      principle: 'Een drempel die alles vangt, vangt niets. Kies voor precision boven recall.',
    },
    wat: {
      instruction: 'Stel je drempelwaarden en score-zones in',
      fields: [
        { key: 'drempel_actie', label: 'Score voor automatische actie', type: 'number', defaultValue: 40 },
        { key: 'drempel_nurture', label: 'Score voor nurture', type: 'number', defaultValue: 20 },
        { key: 'drempel_prioriteit', label: 'Score voor persoonlijke outreach', type: 'number', defaultValue: 60 },
        { key: 'window_dagen', label: 'Hoe lang is een signaal geldig? (dagen)', type: 'number', defaultValue: 90 },
      ],
    },
    blueprintTemplate: (inputs) => {
      return `DREMPELWAARDEN:
  MONITORING: <${inputs.drempel_nurture ?? 20}
  NURTURE: ${inputs.drempel_nurture ?? 20}–${(inputs.drempel_actie ?? 40) - 1}
  ACTIEF: ${inputs.drempel_actie ?? 40}–${(inputs.drempel_prioriteit ?? 60) - 1}
  PRIORITEIT: ≥${inputs.drempel_prioriteit ?? 60}

SIGNAAL GELDIGHEID: ${inputs.window_dagen ?? 90} dagen`;
    },
  },

  // ─── LAAG 07 — RESPONS ───
  {
    id: 7,
    slug: 'respons',
    title: 'Respons',
    themeColor: '#F87171',
    scoreContribution: 25,
    waarom: {
      headline: 'Het systeem handelt. Op het juiste moment.',
      body: `Je hebt nu een volledig detectiesysteem. Signalen komen binnen, scores worden berekend, drempels bepalen urgentie. Maar het systeem is pas compleet als het ook handelt.

De respons-laag verbindt detectie met actie. Per scorezone bepaal je wat er gebeurt: een automatische sequence, een persoonlijk bericht, een taak in je CRM. Het verschil tussen een goed systeem en een geweldig systeem zit in de snelheid en relevantie van de respons.

De gouden regel: hoe hoger de score, hoe persoonlijker de respons. Automatiseer de onderkant, personaliseer de bovenkant.`,
      caseStudy: {
        situation: 'Velox stuurde elke prospect hetzelfde template-mailtje, ongeacht de score. "Hi {voornaam}, ik zag dat jullie groeien…" — 3.000 keer per maand. De reply rate: 1.8%. Het sales team klaagde dat de leads "niet warm genoeg" waren.',
        result: 'Na het invoeren van gedifferentieerde respons per zone veranderde alles. Nurture-leads kregen een geautomatiseerde contentreeks. Actieve leads een persoonlijk bericht met referentie naar hun specifieke trigger. Prioriteitsleads kregen een videobericht van de founder. Reply rate per zone: nurture 4%, actief 18%, prioriteit 31%.',
        lesson: 'Het verschil zat niet in de leads — het zat in de respons. Velox had altijd goede signalen. Ze behandelden ze alleen allemaal hetzelfde.',
      },
      stats: {
        before: { label: 'Reply rate (één template)', value: '1.8%' },
        after: { label: 'Reply rate (prioriteit-zone)', value: '31%' },
      },
      mistake: {
        title: 'Het one-size-fits-all template',
        body: 'Velox dacht dat personalisatie = {voornaam} invullen. Maar echte personalisatie is: "Ik zag dat jullie vorige maand Lisa als VP Sales hebben aangesteld — bij onze klant TechCorp leidde dat tot een herstructurering van het sales proces. Herkenbaar?"',
      },
      principle: 'Hoe hoger de score, hoe persoonlijker de respons. Automatiseer volume, personaliseer impact.',
    },
    wat: {
      instruction: 'Configureer je respons per scorezone',
      fields: [
        // NURTURE zone
        { key: 'respons_type_nurture', label: 'Respons type — Nurture', type: 'dropdown', options: [
          { value: 'sequence', label: 'Email sequence' }, { value: 'linkedin', label: 'LinkedIn' },
          { value: 'direct_email', label: 'Direct email' }, { value: 'call', label: 'Telefonisch' },
        ] },
        { key: 'respons_template_nurture', label: 'Kernboodschap — Nurture (1 zin)', type: 'text', placeholder: 'Bijv. Delen van relevante content over hun uitdaging' },
        { key: 'respons_timing_nurture', label: 'Timing — Nurture', type: 'dropdown', options: [
          { value: 'direct', label: 'Direct' }, { value: 'binnen_1uur', label: 'Binnen 1 uur' }, { value: 'zelfde_dag', label: 'Zelfde dag' },
        ] },
        { key: 'crm_actie_nurture', label: 'CRM actie — Nurture', type: 'dropdown', options: [
          { value: 'lead_aanmaken', label: 'Lead aanmaken' }, { value: 'deal_aanmaken', label: 'Deal aanmaken' },
          { value: 'taak', label: 'Taak aanmaken' }, { value: 'notitie', label: 'Notitie toevoegen' },
        ] },
        // ACTIEF zone
        { key: 'respons_type_actief', label: 'Respons type — Actief', type: 'dropdown', options: [
          { value: 'sequence', label: 'Email sequence' }, { value: 'linkedin', label: 'LinkedIn' },
          { value: 'direct_email', label: 'Direct email' }, { value: 'call', label: 'Telefonisch' },
        ] },
        { key: 'respons_template_actief', label: 'Kernboodschap — Actief (1 zin)', type: 'text', placeholder: 'Bijv. Directe outreach met referentie naar hun trigger' },
        { key: 'respons_timing_actief', label: 'Timing — Actief', type: 'dropdown', options: [
          { value: 'direct', label: 'Direct' }, { value: 'binnen_1uur', label: 'Binnen 1 uur' }, { value: 'zelfde_dag', label: 'Zelfde dag' },
        ] },
        { key: 'crm_actie_actief', label: 'CRM actie — Actief', type: 'dropdown', options: [
          { value: 'lead_aanmaken', label: 'Lead aanmaken' }, { value: 'deal_aanmaken', label: 'Deal aanmaken' },
          { value: 'taak', label: 'Taak aanmaken' }, { value: 'notitie', label: 'Notitie toevoegen' },
        ] },
        // PRIORITEIT zone
        { key: 'respons_type_prioriteit', label: 'Respons type — Prioriteit', type: 'dropdown', options: [
          { value: 'sequence', label: 'Email sequence' }, { value: 'linkedin', label: 'LinkedIn' },
          { value: 'direct_email', label: 'Direct email' }, { value: 'call', label: 'Telefonisch' },
        ] },
        { key: 'respons_template_prioriteit', label: 'Kernboodschap — Prioriteit (1 zin)', type: 'text', placeholder: 'Bijv. Persoonlijk bericht van founder met specifieke referentie' },
        { key: 'respons_timing_prioriteit', label: 'Timing — Prioriteit', type: 'dropdown', options: [
          { value: 'direct', label: 'Direct' }, { value: 'binnen_1uur', label: 'Binnen 1 uur' }, { value: 'zelfde_dag', label: 'Zelfde dag' },
        ] },
        { key: 'crm_actie_prioriteit', label: 'CRM actie — Prioriteit', type: 'dropdown', options: [
          { value: 'lead_aanmaken', label: 'Lead aanmaken' }, { value: 'deal_aanmaken', label: 'Deal aanmaken' },
          { value: 'taak', label: 'Taak aanmaken' }, { value: 'notitie', label: 'Notitie toevoegen' },
        ] },
      ],
    },
    hoe: {
      instruction: 'Kies je outreach en automatiseringstools',
      tools: [
        { name: 'Apollo Sequences', purpose: 'Geautomatiseerde email cadences', cost: '$49-99/mo' },
        { name: 'Instantly', purpose: 'Hoog-volume email', cost: '$30-77/mo' },
        { name: 'Smartlead', purpose: 'AI-gepersonaliseerde sequences', cost: '$39-94/mo' },
        { name: 'HubSpot Workflows', purpose: 'CRM-native automation', cost: 'Incl. in HubSpot' },
        { name: 'Lemlist', purpose: 'Video + personalisatie', cost: '$59-99/mo' },
      ],
    },
    blueprintTemplate: (inputs) => {
      const zones = ['nurture', 'actief', 'prioriteit'];
      const rows = zones.map(z => {
        const type = inputs[`respons_type_${z}`] || '—';
        const msg = inputs[`respons_template_${z}`] || '—';
        const timing = inputs[`respons_timing_${z}`] || '—';
        const crm = inputs[`crm_actie_${z}`] || '—';
        return `  ${z.toUpperCase()}:\n    Type: ${type}\n    Boodschap: ${msg}\n    Timing: ${timing}\n    CRM: ${crm}`;
      }).join('\n');
      const tools = (inputs._selectedTools || []).join(', ');
      return `RESPONS-TRIGGERS:\n${rows}\n\nTOOLS: ${tools || '—'}`;
    },
  },
];

export const TOTAL_LAYERS = 7;
