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

export interface LayerConfig {
  id: number;
  slug: string;
  title: string;
  themeColor: string;
  scoreContribution: number;
  waarom: {
    headline: string;
    body: string;
  };
  wat: {
    instruction: string;
    fields: LayerField[];
  };
  hoe?: {
    instruction: string;
    tools: ToolCard[];
  };
  blueprintTemplate: (inputs: Record<string, any>) => string;
}

export const LAYERS: LayerConfig[] = [
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
    },
    blueprintTemplate: (inputs) => {
      const geo = Array.isArray(inputs.geografie) ? inputs.geografie.join(', ') : inputs.geografie || '';
      return `TARGET: ${inputs.industrie || '—'}, ${inputs.bedrijfsgrootte || '—'} FTE, ${geo || '—'}
BESLISSER: ${inputs.functietitel || '—'}
STAAT: ${inputs.staat_a || '—'}${inputs.staat_b ? ` OF ${inputs.staat_b}` : ''}
UITSLUITEN: ${inputs.uitsluiten || '—'}`;
    },
  },
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
    },
    blueprintTemplate: (inputs) => {
      const signals = [
        'leidinggevende_gewisseld', 'funding_ontvangen', 'specifieke_vacature',
        'competitor_churned', 'tech_stack_wijziging', 'headcount_groei',
        'industrie_match', 'bedrijfsgrootte_match'
      ];
      const rows = signals.map(s => `  ${s.replace(/_/g, ' ')}: ${inputs[s] || 0}`).join('\n');
      return `SCOREMATRIX:\n${rows}\n\nDREMPEL ACTIE: ${inputs.drempel_actie || 40}`;
    },
  },
];

export const TOTAL_LAYERS = 7;
