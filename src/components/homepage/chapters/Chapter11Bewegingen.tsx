import ChapterFrame from "../ChapterFrame";
import { UserPlus, MapPin, Globe, Handshake, Briefcase, RotateCcw } from "lucide-react";
import { ProjectCard } from "@/components/ui/ProjectCard";

const motions = [
  {
    n: "01",
    icon: UserPlus,
    title: "Klanten werven",
    description: "Bouw een voorspelbare stroom van gekwalificeerde B2B-leads. Volledig geautomatiseerd en gebaseerd op realtime intentiedata.",
    link: "/groeistack",
    linkText: "Ontdek systeem"
  },
  {
    n: "02",
    icon: MapPin,
    title: "Lokaal uitbreiden",
    description: "Versterk uw marktpositie in specifieke regio's. Bereik lokale beslissers met gepersonaliseerde campagnes en relevante data.",
    link: "/groeistack",
    linkText: "Regio's targeten"
  },
  {
    n: "03",
    icon: Globe,
    title: "Nieuwe markten openen",
    description: "Betreed nieuwe sectoren of landen met minimale frictie. Test de haalbaarheid vooraf met betrouwbare doelgroepdata.",
    link: "/groeistack",
    linkText: "Markten verkennen"
  },
  {
    n: "04",
    icon: Handshake,
    title: "Partners vinden",
    description: "Identificeer en verbind met strategische partners, resellers of distributeurs die uw groei in Europa versnellen.",
    link: "/groeistack",
    linkText: "Partnering starten"
  },
  {
    n: "05",
    icon: Briefcase,
    title: "Talent werven",
    description: "Trek de beste professionals aan voor uw openstaande posities. Directe en actieve benadering van passief toptalent.",
    link: "/groeistack",
    linkText: "Werving automatiseren"
  },
  {
    n: "06",
    icon: RotateCcw,
    title: "Relaties reactiveren",
    description: "Activeer slapende accounts en voormalige klanten. Breng uzelf opnieuw top-of-mind met relevante signalen op het juiste moment.",
    link: "/groeistack",
    linkText: "Klanten wekken"
  },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {motions.map((m) => (
            <ProjectCard
              key={m.n}
              number={m.n}
              icon={m.icon}
              title={m.title}
              description={m.description}
              link={m.link}
              linkText={m.linkText}
            />
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center">
          <div className="rounded-full border border-primary/30 bg-primary/[0.06] px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-primary">
            Eén fundament · B2B-groeisysteem
          </div>
        </div>
      </div>
    </ChapterFrame>
  );
}