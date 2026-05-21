import ChapterFrame from "../ChapterFrame";

const stages = [
  { tag: "TOF · Awareness", title: "Bereik", desc: "Impressies, weergaves en bezoekers binnen het marktuniversum.", arrow: "Markt → bereik" },
  { tag: "MOF · Engagement", title: "Interactie", desc: "Clicks, replies, profielbezoeken en videoviews per persona.", arrow: "Bereik → engaged" },
  { tag: "BOF · Conversie", title: "Kwalificatie", desc: "Meetings, formulieren en gekwalificeerde commerciële interesse.", arrow: "Engaged → meeting" },
  { tag: "Deal · Sales", title: "Salesactie", desc: "Opvolging, offertes, deals en accountacties met context.", arrow: "Meeting → deal" },
];

export default function Chapter08Funnel() {
  return (
    <ChapterFrame
      id="chapter-08"
      number="08"
      eyebrow="Stap 05 · Funnelactivatie"
      title={<>Van impressies, naar engagement, <span className="text-primary">naar deals.</span></>}
      intro="Gewogen op bron, fit, recency en relevantie."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((s, i) => (
          <div
            key={s.tag}
            className="relative rounded-2xl border border-foreground/10 bg-card/95 shadow-lg p-6 flex flex-col"
            style={{ marginTop: `${i * 14}px` }}
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary mb-3">{s.tag}</span>
            <h3 className="font-display text-2xl text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{s.desc}</p>
            <div className="text-xs text-foreground/60 border-t border-foreground/10 pt-3">{s.arrow}</div>
          </div>
        ))}
      </div>
    </ChapterFrame>
  );
}