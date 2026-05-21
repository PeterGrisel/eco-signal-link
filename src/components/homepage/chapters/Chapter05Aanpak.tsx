import ChapterFrame from "../ChapterFrame";
import { Wrench, Zap, ArrowRight } from "lucide-react";

const paths = [
  {
    icon: Zap,
    tag: "Done-for-you",
    title: "Wij draaien uw machine",
    desc: "Wij bouwen, beheren en optimaliseren de groeimachine op uw eigen tools. U krijgt resultaten, geen huiswerk.",
    bullets: [
      "Maandelijkse engagement-uren",
      "Wij draaien dagelijks de operatie",
      "Rapportage op signalen en pipeline",
    ],
  },
  {
    icon: Wrench,
    tag: "Build & Transfer",
    title: "U neemt het over",
    desc: "Wij bouwen het systeem volledig in uw stack. Daarna trainen we uw team en draagen we de operatie over.",
    bullets: [
      "Eenmalig bouw-traject",
      "Volledige overdracht aan uw team",
      "Optionele doorlopende support",
    ],
  },
];

export default function Chapter05Aanpak() {
  return (
    <ChapterFrame
      id="chapter-05" number="05"
      eyebrow="Hoe wij dit voor u bouwen"
      title={<>Twee paden. <span className="text-primary">Eén nulmeting om te kiezen.</span></>}
      intro="We starten altijd hetzelfde: één gesprek om uw situatie en signalen door te nemen. Daarna kiezen we samen het pad dat past."
      tone="warm"
    >
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {paths.map((p, i) => (
          <div
            key={i}
            className="rounded-2xl border border-foreground/10 bg-background/40 p-8 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <p.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-primary">{p.tag}</span>
            </div>
            <h3 className="font-display text-2xl font-medium mb-3 text-foreground">{p.title}</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{p.desc}</p>
            <ul className="space-y-2">
              {p.bullets.map((b, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                  <ArrowRight className="h-3.5 w-3.5 text-primary mt-1 shrink-0" strokeWidth={2} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ChapterFrame>
  );
}