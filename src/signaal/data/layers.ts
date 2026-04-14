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
  url?: string;
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

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ActMarker {
  number: 1 | 2 | 3 | 4;
  title: string;
  promise: string;
}

export interface LayerConfig {
  id: number;
  slug: string;
  title: string;
  themeColor: string;
  scoreContribution: number;
  veloxMilestone: string;
  act?: ActMarker;
  waarom: {
    headline: string;
    intentie?: string;
    aansluiting: string;
    kern: string;
    valkuilTitel: string;
    valkuil: string;
    scene: string;
    opmaat: string;
    principle?: string;
    stats?: StatComparison;
    quiz?: QuizQuestion[];
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
    themeColor: '#E8945A',
    scoreContribution: 0,
    veloxMilestone: 'Velox verfijnde hun ICP van "tech companies" naar een scherpe definitie met industrie, grootte en beslisser.',
    act: {
      number: 1,
      title: 'Fundament',
      promise: 'Je bouwt je kompas.',
    },
    waarom: {
      headline: 'Scherpte in de definitie bepaalt alles wat erna komt.',
      intentie: 'Na deze laag kun je in drie dimensies — wie, staat, profiel — benoemen op wie jouw systeem gaat reageren.',
      aansluiting: `Je begint met een leeg kompas. Geen scorematrix, geen bronnen, geen alerts — alleen de vraag: op wie reageert dit systeem, en op wie niet? Alles wat je hierna bouwt is afgeleide van het antwoord. Elke onscherpte die je hier laat staan, vermenigvuldigt zich zes lagen verder.`,
      kern: `Definitie werkt in drie dimensies tegelijk: *wie* is de klant (industrie, grootte, beslisser), *in welke staat* zitten ze (recente trigger, groeifase, teamwissel), en *welk profiel* hebben ze (geografie, technologie, budget). Vaagheid in één dimensie maakt de andere twee onbruikbaar — een scherpe industrie zonder scherpe beslisser levert 12.000 hits; een scherpe beslisser zonder scherpe staat levert mensen die niet klaar zijn om te praten.

De verleiding is breed beginnen om niemand te missen. Maar breed definiëren is geen verzekering, het is ruis. Hoe meer mensen je definitie raakt, hoe zwakker elk signaal dat erop volgt.`,
      valkuilTitel: 'De "management"-valkuil',
      valkuil: `Functietitels op hoog abstractieniveau — "management", "tech companies", "Europa" — voelen inclusief en veilig. Ze matchen duizenden mensen, waarvan de meeste niks met je oplossing te maken hebben. De échte beslissers verdrinken in de lijst. Je outreach voelt efficiënt; de cijfers zeggen iets anders.`,
      scene: `Velox Solutions, een B2B SaaS scale-up met 45 mensen, stuurde twee jaar lang 2.000 mails per week naar "tech companies in Europa". De pipeline groeide gestaag, maar deals strandden steeds in de onderhandelingsfase — prospects bleken niet de juiste fit. De founder liet uit frustratie hun twintig best-converterende deals van dat jaar naast elkaar leggen. Het patroon viel in één middag op: B2B SaaS, 50–200 FTE, nieuwe VP Sales, Benelux. De lijst kromp van 12.000 naar 340 bedrijven. Reply rate ging van 2% naar 11%.`,
      opmaat: `In de configuratie zo meteen benoem je alle drie de dimensies. Eén stelregel die de rest van je journey gemakkelijker maakt: als je definitie per dimensie minder dan één zin vraagt, is hij te breed. Meer dan drie zinnen, te smal. Mik op kort, concreet, uitsluitend.`,
      stats: {
        before: { label: 'Reply rate (breed ICP)', value: '2%' },
        after: { label: 'Reply rate (scherp ICP)', value: '11%' },
      },
      principle: 'Hoe smaller je definitie, hoe sterker elk signaal dat erop volgt.',
      quiz: [
        {
          question: 'Waarom kromp Velox hun lijst van 12.000 naar 340 prospects?',
          options: [
            'Ze hadden geen budget meer voor grote lijsten',
            'Ze verfijnden hun ICP op basis van hun best-converterende deals',
            'Hun tool kon maar 340 contacten laden',
            'Ze wilden minder werk voor het SDR-team',
          ],
          correctIndex: 1,
          explanation: 'Door hun 20 best-converterende deals te analyseren, ontdekte Velox dat een scherpe definitie (industrie + grootte + functie + regio) veel meer impact had dan een breed bereik.',
        },
        {
          question: 'Wat is het belangrijkste risico van een te brede ICP-definitie?',
          options: [
            'Je mist potentiële klanten',
            'Je signalen worden onbetrouwbaar omdat ze niet gefilterd zijn',
            'Je hebt meer tools nodig',
            'Je concurrenten zien je strategie',
          ],
          correctIndex: 1,
          explanation: 'Zonder een scherpe definitie krijg je te veel ruis in je signalen. Een breed ICP betekent dat elke trigger op duizenden irrelevante prospects slaat.',
        },
      ],
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
    themeColor: '#D4845A',
    scoreContribution: 15,
    veloxMilestone: 'Velox ontdekte dat VP Sales + funding 80% van hun deals voorspelde en paste hun gewichten aan.',
    waarom: {
      headline: 'Niet alle signalen zijn gelijk. Gewicht maakt het verschil.',
      aansluiting: `Je hebt nu een definitie. Je weet op wie je reageert. Maar als elk signaal dat je straks binnenkrijgt even zwaar telt, is je scherpte tevergeefs — dan reageer je nog steeds op alles. De tweede helft van je fundament: welke signalen wegen zwaar, welke zijn ruis, en hoe vertelt je systeem het verschil?`,
      kern: `Eén signaal is zelden genoeg bewijs. Een vacature kan toeval zijn, een funding-ronde kan fout-geïnterpreteerd worden, een job change kan een sidestep zijn. Maar wanneer twee of drie signalen bij hetzelfde account samenvallen, verandert de statistiek. Je kijkt niet meer naar interesse — je kijkt naar intentie.

Gewicht toekennen is waar je expertise in het systeem komt. Welke combinatie in jouw markt heeft historisch het vaakst tot een deal geleid? Dat is je zwaarste gewicht. Alles wat zwakker correleert, krijgt minder punten — niet nul, maar duidelijk minder. De scorematrix wordt de brug tussen 'er gebeurt iets' en 'er gebeurt iets dat ertoe doet'.`,
      valkuilTitel: 'De democratie-fout',
      valkuil: `Alle signalen hetzelfde gewicht geven voelt eerlijk. Het voelt als objectiviteit. Maar een LinkedIn-like die even zwaar telt als een Series A-ronde is geen objectiviteit, het is een verkeerde model-keuze. Je krijgt honderden "warme" leads per week waarvan er een handvol echt warm zijn — en je team leert het verschil niet meer zien.`,
      scene: `Drie maanden na de ICP-verfijning zat Velox met een nieuw probleem. Ze vingen nu genoeg signalen op, maar de "warme" leadlijst werd langer en langer — 200+ per week — en de deals stagneerden. Het sales team begon de lijst te negeren. Pas toen ze drie maanden aan gesloten deals achteruit analyseerden, viel het kwartje: twee signalen voorspelden 80% van hun wins — een nieuwe VP Sales plus recente funding. Ze verhoogden die gewichten naar 30 en 25, drukten de rest terug. Qualified leads schoten van 12% naar 34%.`,
      opmaat: `Zo meteen bouw je je eigen scorematrix. De vuistregel: als geen enkel signaal boven de 20 punten uitkomt, heb je geen prioritering — je hebt een gemiddelde. Minstens één signaal moet zwaar genoeg wegen dat het alleen al actie rechtvaardigt. Wees niet bang om ongelijk te wegen.`,
      stats: {
        before: { label: 'Qualified leads (gelijk gewicht)', value: '12%' },
        after: { label: 'Qualified leads (gewogen)', value: '34%' },
      },
      principle: 'Eén sterk signaal verslaat tien zwakke.',
      quiz: [
        {
          question: 'Waarom faalde Velox\'s eerste scoringsmodel?',
          options: [
            'Ze hadden te weinig signalen',
            'Ze gaven elk signaal hetzelfde gewicht',
            'Ze gebruikten de verkeerde tools',
            'Hun sales team weigerde mee te werken',
          ],
          correctIndex: 1,
          explanation: 'Door alle signalen even zwaar te wegen, verdrinkten de echte koopsignalen (funding + nieuwe VP Sales) in de ruis van minder relevante triggers.',
        },
        {
          question: 'Wat voorspelde 80% van Velox\'s gesloten deals?',
          options: [
            'Website bezoek + whitepaper download',
            'LinkedIn likes + event attendance',
            'Nieuwe VP Sales + recente funding',
            'Vacature + technologie switch',
          ],
          correctIndex: 2,
          explanation: 'Data-analyse wees uit dat de combinatie van een nieuwe VP Sales en recente funding de sterkste voorspeller was van een deal bij Velox.',
        },
      ],
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
    themeColor: '#C4754A',
    scoreContribution: 15,
    veloxMilestone: 'Velox schroefde terug van 7 naar 3 databronnen en halveerde hun monitor-tijd.',
    act: {
      number: 2,
      title: 'Input',
      promise: 'Je bouwt je stromen.',
    },
    waarom: {
      headline: 'Elke bron antwoordt op één vraag. Kies daarom eerst de vraag.',
      aansluiting: `Je fundament staat: je weet wie je zoekt en welke combinatie van signalen ertoe doet. Nu komt de praktische vraag — waar kómen die signalen vandaan? Je scorematrix is een formule zonder invoer. Tijd om de kranen open te zetten. De vraag is alleen: welke, en in welke volgorde?`,
      kern: `Een databron is geen tool, maar een antwoord-generator. LinkedIn is scherp op job changes en zwak op financiën. Crunchbase is het omgekeerde. Bombora meet intentie maar zegt niks over wie de beslisser is. Je kunt niet zeven bronnen tegelijk productief gebruiken — niet omdat het technisch niet kan, maar omdat je aandacht fragmenteert.

De logica werkt altijd één kant op: eerst het signaal dat je zoekt (uit je scorematrix), dán de bron die dat signaal het scherpst levert. Andersom — eerst een tool abonneren en dan kijken wat eruit komt — levert gegarandeerd te veel data en te weinig inzicht. Elke bron voegt zijn eigen ruis toe aan de stroom die je juist smal wilde houden.`,
      valkuilTitel: 'De tool-verzamelaar',
      valkuil: `Zeven bronnen tegelijk activeren omdat ze allemaal iets lijken te doen. Je splitst je aandacht, schakelt tussen dashboards, mist signalen juist ómdat je ze allemaal volgt. Na drie weken check je er nog twee. Na zes weken nul. De data werkt nog steeds perfect — jij niet meer.`,
      scene: `Velox kwam uit laag 2 met een scorematrix die klopte en een team dat er vertrouwen in begon te krijgen. Wat ze vervolgens fout deden voelde logisch op het moment: ze abonneerden zich in één week op zeven databronnen — Apollo, LinkedIn Sales Nav, Crunchbase, Clay, BuiltWith, Bombora, Google Alerts. Kosten: €1.200 per maand. Na acht weken opende niemand nog meer dan twee dashboards. Niet omdat de data slecht was — ze hadden nooit beslist welke bron welk signaal voedde. Terugschalen naar drie bronnen, elk gekoppeld aan één vraag uit de matrix, bracht het systeem weer in beweging.`,
      opmaat: `In de configuratie zo meteen koppel je per zwaar signaal uit je scorematrix één primaire bron. Als je meer dan drie bronnen wilt aanzetten, ben je bezig een dashboard te bouwen in plaats van een detectiesysteem. Stelregel: één vraag, één bron.`,
      stats: {
        before: { label: 'Dagelijkse monitor-tijd (7 bronnen)', value: '4 uur' },
        after: { label: 'Dagelijkse monitor-tijd (3 bronnen)', value: '45 min' },
      },
      principle: 'Een bron zonder vraag is een tool. Een vraag met een bron is een signaal.',
      quiz: [
        {
          question: 'Waarom schaalden Velox terug van 7 naar 3 databronnen?',
          options: [
            'De andere 4 bronnen waren te duur',
            'Ze konden zich niet focussen en besteedden 4 uur/dag aan monitoren',
            'Hun concurrent gebruikte er ook maar 3',
            'De data was niet accuraat',
          ],
          correctIndex: 1,
          explanation: 'Te veel bronnen leidde tot informatie-overload. Door te focussen op de 3 bronnen die hun sterkste signalen leverden, halveerde de monitoring-tijd en steeg de kwaliteit.',
        },
      ],
    },
    wat: {
      instruction: 'Selecteer de bronnen die relevant zijn voor jouw signalen',
      fields: [
        { key: 'linkedin', label: 'LinkedIn', type: 'checkbox', required: true },
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
      veloxTips: [
        { fieldKey: 'linkedin', tip: 'LinkedIn was Velox\'s belangrijkste bron. Maar pas toen ze focusten op job changes (niet posts of likes) werd het signaal bruikbaar.' },
        { fieldKey: 'funding_data', tip: 'Velox filterde op Series A+ — Seed-bedrijven hadden te weinig budget. Die ene filter scheelde 60% ruis.' },
        { fieldKey: 'technografie', tip: 'Velox ontdekte dat bedrijven die van competitor X naar Y switchten, 4x vaker openstonden voor een gesprek. Technografie was hun sleeper hit.' },
        { fieldKey: 'crm_historiek', tip: 'Velox herontdekte 23 closed-lost deals van >6 maanden geleden. 7 daarvan hadden inmiddels een nieuwe beslisser. 3 werden klant.' },
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
    themeColor: '#B4663A',
    scoreContribution: 20,
    veloxMilestone: 'Velox herformuleerde hun vage zoekvragen naar scherpe filters — relevantie steeg van 2% naar 60%.',
    waarom: {
      headline: 'Een scherpe vraag is het verschil tussen ruis en een deal.',
      intentie: 'Na deze laag kun je per bron één onverbiddelijke vraag formuleren die ruis structureel buiten de deur houdt.',
      aansluiting: `Je hebt nu per zwaar signaal één primaire bron. Maar een bron zonder vraag levert nog geen signaal — het levert een lijst. In deze laag giet je de vraag die je aan elke bron stelt in een vorm die ruis filtert vóór het binnenkomt.`,
      kern: `Tools doen precies wat je ze vraagt. Niet meer, niet minder. Een vraag als "toon bedrijven die groeien" is geen vraag — het is een wens. Tools vertalen wensen naar onbegrensde resultatensets.

Een kritische vraag bevat altijd vier elementen: *wie* (welke segment), *welke verandering* (de trigger), *welk tijdvenster* (hoe recent), en *welke drempel* (ondergrens voor relevantie). Valt er één element weg, dan is je filter lek. Hoe scherper de vraag, hoe minder false positives je moet wegwerken — en de tijdswinst zit niet in de tool, maar in wat jij niet hoeft te bekijken.`,
      valkuilTitel: 'De "toon me alles"-reflex',
      valkuil: `De neiging om je filters open te laten "voor het geval dat". Je wilt niemand missen, dus zoek je bedrijven die "groeien" in plaats van bedrijven die "in 90 dagen een VP Sales hebben aangesteld". Je krijgt 4.000 resultaten, scrolt door 3.950 irrelevante — en mist vervolgens de 50 die ertoe doen.`,
      scene: `Velox draaide inmiddels met drie bronnen. Apollo zou hun primaire bron worden voor job changes. Hun eerste query daar: "Toon bedrijven die groeien." 4.000+ hits per week, minder dan 2% relevant. Het team scrolde door eindeloze lijsten op zoek naar spelden in hooibergen. Eén middag lang herformuleerden ze de query aan de hand van hun scorematrix: "Welke B2B SaaS bedrijven (50–200 FTE, Benelux) hebben in de laatste 90 dagen een VP Sales aangesteld?" Wie, welke verandering, welk tijdvenster, welke drempel. Nieuwe resultatenset: 12–18 hits per week, 60% reageerde.`,
      opmaat: `Zo meteen formuleer je per bron jouw kritische vraag. Toets elke vraag tegen de vier elementen. Ontbreekt er één, herformuleer voor je verder gaat. Beter één scherpe vraag dan drie brede die ruis produceren.`,
      stats: {
        before: { label: 'Relevante hits (vage vraag)', value: '2%' },
        after: { label: 'Relevante hits (scherpe vraag)', value: '60%' },
      },
      principle: 'Een vage vraag krijgt een vaag antwoord. Een scherpe vraag krijgt een deal.',
      quiz: [
        {
          question: 'Wat maakte Velox\'s herformuleerde zoekvraag effectiever?',
          options: [
            'Ze gebruikten meer zoektermen',
            'Ze voegden specifieke parameters toe: wie, welke verandering, welk tijdvenster',
            'Ze betaalden voor een premium plan',
            'Ze schakelden over naar een andere tool',
          ],
          correctIndex: 1,
          explanation: 'Een kritische vraag bevat altijd: wie (B2B SaaS, 50-200 FTE), welke verandering (VP Sales aangesteld), en welk tijdvenster (90 dagen). Dat filtert ruis weg.',
        },
      ],
    },
    wat: {
      instruction: 'Formuleer per geselecteerde bron één kritische vraag',
      fields: [
        { key: 'vraag_linkedin', label: 'Kritische vraag — LinkedIn', type: 'text', placeholder: 'Bijv. Is de DMU gewisseld in de laatste 90 dagen?', required: true },
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
      veloxTips: [
        { fieldKey: 'vraag_linkedin', tip: 'Velox\'s winnende LinkedIn-vraag: "Welke VP Sales is in de laatste 90 dagen aangesteld bij een B2B SaaS met 50-200 FTE?" — 60% van de hits was relevant.' },
        { fieldKey: 'vraag_funding', tip: 'Velox stelde eerst "wie heeft funding?" — te vaag. Na verfijning naar "Series A+ in Benelux, laatste 6 maanden" kregen ze 8 hits per week in plaats van 200.' },
        { fieldKey: 'vraag_jobboards', tip: 'Velox ontdekte dat de vraag "Staat er een Head of Sales vacature open?" een betere voorspeller was dan funding-data. De vacature verscheen gemiddeld 3 weken vóór de hire.' },
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
    themeColor: '#4CAF7D',
    scoreContribution: 15,
    veloxMilestone: 'Velox automatiseerde hun monitoring via Slack-alerts en miste nog maar 3% van de signalen.',
    act: {
      number: 3,
      title: 'Autonomie',
      promise: 'Je systeem draait zonder jou.',
    },
    waarom: {
      headline: 'Automatiseren kan pas als je wéét wat je automatiseert.',
      aansluiting: `Je bronnen staan. Je kritische vragen zijn scherp. Wat nu nog ontbreekt: continuïteit. Je hebt een systeem nodig dat kijkt op vrijdagmiddag, op vakantiedagen, om half twaalf 's avonds — zonder dat iemand het zich hoeft te herinneren.`,
      kern: `Detectie is het kantelpunt waarop het systeem autonoom wordt. Je stelt in: met welke frequentie elke bron wordt gescand, langs welke filterlogica, en via welk kanaal alerts binnenkomen. Jij handelt voortaan alleen nog op *wat eruit komt*, niet op *of er iets zou kunnen zijn*.

De volgorde in de journey is hier niet toevallig. Automatisering vóór scherpte is ruis vermenigvuldigen — je laat een systeem de hele dag brede vragen stellen en krijgt een onleesbare stroom terug. Automatisering na scherpte is precies het tegenovergestelde: het systeem stelt jouw onverbiddelijke vragen, zonder pauze, zonder vermoeidheid. Dit is waarom laag 5 niet laag 2 had kunnen zijn.`,
      valkuilTitel: 'De "ik check het zelf wel"-illusie',
      valkuil: `Handmatig monitoren werkt perfect bij tien accounts. Bij honderd accounts mis je gegarandeerd signalen, alleen je merkt het niet — want je weet niet wat je miste. De gemiste deal verdwijnt in een alternatieve tijdlijn waarin een concurrent sneller was.`,
      scene: `Met scherpe vragen en drie bronnen leek Velox klaar. De founder stond zichzelf toe elke ochtend handmatig LinkedIn, Crunchbase en Google Alerts te checken — hij had de controle graag. Op maandag was hij scherp. Op vrijdag vergat hij het. In één week miste hij drie signalen; één ervan landde twee weken later als closed-won bij een concurrent. Diezelfde middag zette hij dagelijkse geautomatiseerde scans op met alerts via een Slack-channel. Reactietijd ging van 3–5 dagen naar minder dan 4 uur. Gemiste signalen daalden van 40% naar 3%.`,
      opmaat: `Zo meteen bepaal je per bron: frequentie, alert-methode, filterconditie. De stelregel: als je jezelf nog actief moet herinneren om iets te checken, is het geen detectie — dan is het een taak. Alles wat je bedenkt als "ik check dat wel even", hoort hier geautomatiseerd te worden.`,
      stats: {
        before: { label: 'Gemiste signalen (handmatig)', value: '40%' },
        after: { label: 'Gemiste signalen (geautomatiseerd)', value: '3%' },
      },
      principle: 'Wat je niet automatiseert, vergeet je. En wat je vergeet, wint je concurrent.',
      quiz: [
        {
          question: 'Wanneer moet je je monitoring automatiseren?',
          options: [
            'Vanaf dag 1, voordat je weet welke signalen werken',
            'Nooit — handmatig is altijd beter',
            'Nadat je weet welke signalen en bronnen relevant zijn',
            'Alleen als je meer dan 1000 accounts volgt',
          ],
          correctIndex: 2,
          explanation: 'Automatiseer pas als je weet wat je zoekt. Te vroeg automatiseren betekent dat je ruis schaalt. Te laat betekent dat je signalen mist.',
        },
      ],
    },
    wat: {
      instruction: 'Configureer je detectie-instellingen per bron',
      fields: [
        { key: 'freq_linkedin', label: 'Monitor frequentie — LinkedIn', type: 'dropdown', options: [
          { value: 'realtime', label: 'Realtime' }, { value: 'dagelijks', label: 'Dagelijks' }, { value: 'wekelijks', label: 'Wekelijks' },
        ], required: true },
        { key: 'alert_linkedin', label: 'Alert methode — LinkedIn', type: 'dropdown', options: [
          { value: 'email', label: 'Email' }, { value: 'slack', label: 'Slack' }, { value: 'crm', label: 'CRM' }, { value: 'webhook', label: 'Webhook' },
        ], required: true },
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
      veloxTips: [
        { fieldKey: 'freq_linkedin', tip: 'Velox switchte van wekelijks naar dagelijks monitoren op LinkedIn. Ze ontdekten dat job changes binnen 48 uur de hoogste reply rate hadden — daarna daalde die met 40%.' },
        { fieldKey: 'alert_linkedin', tip: 'Velox begon met email-alerts maar miste ze tussen andere mails. Na de switch naar Slack kreeg het team alerts in realtime — en reageerde 3x sneller.' },
        { fieldKey: 'filter_linkedin', tip: 'Zonder filter kreeg Velox 200+ alerts per dag. Met "alleen C-level + target industrie" werden dat er 12. Elk waardevol.' },
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
    themeColor: '#D4845A',
    scoreContribution: 10,
    veloxMilestone: 'Velox verhoogde hun drempel van 15 naar 40 en elimineerde alert fatigue — 8 kwalitatieve alerts per dag.',
    waarom: {
      headline: 'Een drempel scheidt aandacht van ruis. Stel hem bewust.',
      aansluiting: `Je systeem kijkt nu continu. Vragen worden gesteld, signalen komen binnen, scores worden berekend. Maar iemand moet beslissen: wanneer handelt het systeem eigenlijk? Welke score is sterk genoeg voor een alert, en welke laat je wegsijpelen zonder iets te doen?`,
      kern: `Een drempelwaarde is een bewuste keuze tussen twee soorten fouten: false positives (alerts waar je niets mee kunt) en false negatives (kansen die je mist). Te laag gekozen en je inbox ontploft; te hoog en je systeem voelt stil terwijl er deals voorbijtrekken.

De oplossing is niet één drempel, maar zones. Onder een bepaald punt is een account *monitoring* — het systeem houdt bij, jij doet niets. Iets hoger wordt het *nurture* — geautomatiseerde content. Daarboven *actief* — een mens kijkt ernaar. En op het hoogste niveau *prioriteit* — directe, persoonlijke actie. Zo benut je elke score, zonder ze gelijk te behandelen.`,
      valkuilTitel: 'Alert fatigue',
      valkuil: `Een lage drempel lijkt veilig — je mist niets. Maar als je team 47 alerts per dag krijgt, missen ze alles. Niet omdat de tool faalt; omdat de menselijke aandacht voor alert-nr-48 nul is. Het hele systeem faalt stil, en je merkt het pas weken later aan je pipeline.`,
      scene: `Velox's nieuwe geautomatiseerde systeem was een succes — maar binnen twee weken had het een eigen probleem gecreëerd. Drempel stond op 15: elk account met meer dan één signaal triggerde een alert. Resultaat: 47 Slack-meldingen per dag. Het sales team reageerde enthousiast in week 1. In week 2 werden berichten genegeerd. In week 3 opende niemand de channel meer. Ze verhoogden de drempel naar 40 en deelden de schaal op in vier zones. Dagelijkse alerts zakten naar 8. Belangrijker: elk alert leidde tot een actie.`,
      opmaat: `Zo meteen stel je je vier zones in. Een vuistregel om mee te beginnen: als je niet weet wat je drempel moet zijn, kies het punt waarop minstens twee van je zwaarste signalen samen moeten vallen. Start liever te hoog en verlaag als je te weinig alerts krijgt — de andere volgorde is pijnlijker.`,
      stats: {
        before: { label: 'Dagelijkse alerts (drempel 15)', value: '47' },
        after: { label: 'Dagelijkse alerts (drempel 40)', value: '8' },
      },
      principle: 'Een drempel die alles vangt, vangt niets. Kies precision boven recall.',
      quiz: [
        {
          question: 'Waarom is een te lage drempelwaarde gevaarlijk?',
          options: [
            'Je mist belangrijke leads',
            'Het kost te veel rekenkracht',
            'Je team krijgt alert fatigue en stopt met reageren',
            'Je concurrenten zien dat je te veel bereikt',
          ],
          correctIndex: 2,
          explanation: 'Velox kreeg 47 alerts per dag met drempel 15. Na twee weken opende niemand meer het Slack-kanaal. Een hogere drempel (40) gaf 8 kwalitatieve alerts.',
        },
      ],
    },
    wat: {
      instruction: 'Stel je drempelwaarden en score-zones in',
      fields: [
        { key: 'drempel_actie', label: 'Score voor automatische actie', type: 'number', defaultValue: 40, required: true },
        { key: 'drempel_nurture', label: 'Score voor nurture', type: 'number', defaultValue: 20 },
        { key: 'drempel_prioriteit', label: 'Score voor persoonlijke outreach', type: 'number', defaultValue: 60 },
        { key: 'window_dagen', label: 'Hoe lang is een signaal geldig? (dagen)', type: 'number', defaultValue: 90 },
      ],
      veloxTips: [
        { fieldKey: 'drempel_actie', tip: 'Velox begon met 20 — veel te laag. Na twee weken alert fatigue verhoogden ze naar 40. Tip: start op 40 en verlaag alleen als je te weinig alerts krijgt.' },
        { fieldKey: 'drempel_prioriteit', tip: 'Velox\'s prioriteitszone (≥60) bevatte gemiddeld 3-5 accounts per week. Die kregen een persoonlijk videobericht van de founder — met 31% reply rate.' },
        { fieldKey: 'window_dagen', tip: 'Velox ontdekte dat signalen ouder dan 90 dagen bijna nooit meer converteerden. Een nieuwe VP Sales die 4 maanden geleden startte, had zijn toolkeuze al gemaakt.' },
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
    themeColor: '#C4754A',
    scoreContribution: 25,
    veloxMilestone: 'Velox differentieerde hun respons per zone — prioriteitsleads kregen een persoonlijk videobericht met 31% reply rate.',
    act: {
      number: 4,
      title: 'Oogst',
      promise: 'Van signaal naar deal.',
    },
    waarom: {
      headline: 'Hoe zwaarder het signaal, hoe persoonlijker de respons.',
      intentie: 'Na deze laag kun je per scorezone een respons definiëren die recht doet aan de zwaarte van het signaal.',
      aansluiting: `Zes lagen lang heb je gebouwd aan een systeem dat detecteert. Nu moet het ook handelen. Signalen die binnenkomen, scores die worden berekend, drempels die zones bepalen — het is allemaal voorwerk voor deze laatste stap. De respons is waar je investering zich uitbetaalt of verdampt.`,
      kern: `De respons-laag koppelt elke scorezone aan een actie. De basisregel is asymmetrisch: automatiseer volume, personaliseer impact. Nurture-leads krijgen een geautomatiseerde contentreeks — volume is hier de vriend. Actieve leads krijgen een persoonlijk bericht met expliciete referentie aan hun trigger. Prioriteitsleads krijgen iets onnavolgbaars — een videobericht, een telefoontje, een hand-off naar een senior.

De reden voor die asymmetrie: onder de drempel is de marginale kost van een extra bericht laag en de marginale waarde ook. Boven de drempel is de marginale waarde hoog genoeg om twintig minuten per prospect te rechtvaardigen. Een systeem dat beide kanten onderscheidt, oogst. Een systeem dat alles hetzelfde behandelt, verspilt zowel tijd als aandacht.`,
      valkuilTitel: 'Het one-size-fits-all template',
      valkuil: `Denken dat personalisatie betekent dat je "{voornaam}" invult in een template. Echte personalisatie is verwijzen naar de specifieke trigger waarop je reageert. Een generiek "ik zag dat jullie groeien" landt als spam, ongeacht hoe sterk het signaal was dat het triggerde. Het signaal was goud; de respons maakte er ruis van.`,
      scene: `Het detectiesysteem van Velox draaide perfect. Drempels werkten. Zones klopten. En toch: reply rate 1.8%. Elke prospect, ongeacht score, kreeg hetzelfde template-mailtje — "Hi {voornaam}, ik zag dat jullie groeien…" — 3.000 keer per maand. Het sales team klaagde dat de leads "niet warm genoeg" waren. De leads waren prima. De respons was verkeerd. Ze bouwden drie respons-modellen. Nurture kreeg een contentreeks. Actief kreeg een persoonlijk bericht met trigger-referentie. Prioriteit kreeg een videobericht van de founder. Reply rates respectievelijk: 4%, 18%, 31%.`,
      opmaat: `Zo meteen vul je per zone in welke respons erbij hoort. Stelregel: als je nurture- en prioriteit-respons in één template passen, heb je ze niet gedifferentieerd. De eerste moet goed *schalen*, de tweede moet niet te *schalen* zijn. Dat is het punt.`,
      stats: {
        before: { label: 'Reply rate (één template)', value: '1.8%' },
        after: { label: 'Reply rate (prioriteit-zone)', value: '31%' },
      },
      principle: 'Automatiseer volume, personaliseer impact.',
      quiz: [
        {
          question: 'Wat was de kern van Velox\'s fout bij hun outreach?',
          options: [
            'Ze stuurden te weinig berichten',
            'Ze behandelden alle leads hetzelfde, ongeacht de score',
            'Ze gebruikten de verkeerde kanalen',
            'Ze hadden geen CRM-integratie',
          ],
          correctIndex: 1,
          explanation: 'Velox stuurde iedereen hetzelfde template. Door de respons te differentiëren per scorezone (nurture/actief/prioriteit) steeg de reply rate van 1.8% naar 31% in de hoogste zone.',
        },
      ],
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
        { key: 'respons_template_actief', label: 'Kernboodschap — Actief (1 zin)', type: 'text', placeholder: 'Bijv. Directe outreach met referentie naar hun trigger', required: true },
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
      veloxTips: [
        { fieldKey: 'respons_type_nurture', tip: 'Velox automatiseerde nurture volledig met een 5-staps email sequence. Geen handwerk — en toch 4% reply rate. Perfect voor de onderkant van de funnel.' },
        { fieldKey: 'respons_type_prioriteit', tip: 'Voor prioriteitsleads stuurde Velox\'s founder persoonlijke Loom-video\'s. Kost 3 minuten per prospect, maar leverde 31% reply rate op.' },
        { fieldKey: 'respons_template_actief', tip: 'Velox\'s beste actief-bericht: "Ik zag dat jullie Lisa als VP Sales hebben aangesteld — bij onze klant TechCorp leidde dat tot X. Herkenbaar?" Specifiek > generiek.' },
        { fieldKey: 'crm_actie_prioriteit', tip: 'Velox maakte direct een deal aan bij prioriteitsleads, niet alleen een lead. Dit gaf het sales team urgentie en visibility in de pipeline.' },
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
