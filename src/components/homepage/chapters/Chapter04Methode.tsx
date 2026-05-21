import ChapterFrame from "../ChapterFrame";

const steps = [
  { n: "01", title: "Context & ICP vastleggen", desc: "Data, processen, markt- en klantkennis bij elkaar brengen." },
  { n: "02", title: "Commercieel Brein bouwen", desc: "ICP-logica, signalen, segmenten en opvolgingsregels in één laag." },
  { n: "03", title: "Segmenteren & verrijken", desc: "Doelgroepen dynamisch vinden, filteren en prioriteren." },
  { n: "04", title: "Schaal & volume definiëren", desc: "Accounts, contacten, touchpoints, ratio's en capaciteit." },
  { n: "05", title: "Funnel activeren", desc: "Markt → targets → engagement → opportunities." },
  { n: "06", title: "Modules inzetten", desc: "LinkedIn, e-mail, telefoon, video, nurture en afspraken." },
  { n: "07", title: "Routeren naar sales", desc: "SDR, AM, inside sales, founder-led, CRM en dashboard." },
  { n: "08", title: "Monitoren & automatiseren", desc: "Pipeline, rapportage, attributie en lerende loops." },
];

export default function Chapter04Methode() {
  return (
    <ChapterFrame
      id="chapter-04"
      number="04"
      eyebrow="De methode · acht stappen"
      title={<>Van commerciële context <span className="text-primary">naar schaalbare actie.</span></>}
      intro="Eén setup vormt de basis. Elke volgende module bouwt erop voort."
    >
      <div className="grid md:grid-cols-2 gap-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className="group relative rounded-2xl border border-foreground/10 bg-background/40 p-6 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="font-display text-3xl text-primary/80 tabular-nums leading-none">{s.n}</span>
              <div>
                <h3 className="text-base md:text-lg font-medium text-foreground mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChapterFrame>
  );
}