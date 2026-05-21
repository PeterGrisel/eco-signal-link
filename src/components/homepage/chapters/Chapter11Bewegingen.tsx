import ChapterFrame from "../ChapterFrame";
import { UserPlus, MapPin, Globe, Handshake, Briefcase, RotateCcw } from "lucide-react";

const motions = [
  { icon: UserPlus, n: "01", title: "Klanten werven" },
  { icon: MapPin, n: "02", title: "Lokaal uitbreiden" },
  { icon: Globe, n: "03", title: "Nieuwe markten openen" },
  { icon: Handshake, n: "04", title: "Partners vinden" },
  { icon: Briefcase, n: "05", title: "Talent werven" },
  { icon: RotateCcw, n: "06", title: "Relaties reactiveren" },
];

export default function Chapter11Bewegingen() {
  return (
    <ChapterFrame
      id="chapter-11"
      number="11"
      eyebrow="Hergebruik · één systeem, zes bewegingen"
      title={<>Eenmaal verbonden. <span className="text-primary">Niet meer opnieuw beginnen.</span></>}
      intro="Hetzelfde fundament voedt elke commerciële beweging die u erop wilt zetten."
    >
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {motions.map((m) => (
            <div
              key={m.n}
              className="group rounded-2xl border border-foreground/10 bg-card/95 shadow-lg p-6 hover:border-primary/40 hover:bg-background/60 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] tabular-nums text-primary/70 tracking-[0.2em]">{m.n}</span>
                <span className="h-px flex-1 bg-foreground/10 group-hover:bg-primary/40 transition-colors" />
                <m.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg md:text-xl text-foreground">{m.title}</h3>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center">
          <div className="rounded-full border border-primary/30 bg-primary/[0.06] px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-primary">
            Eén fundament · B2B-groeisysteem
          </div>
        </div>
      </div>
    </ChapterFrame>
  );
}