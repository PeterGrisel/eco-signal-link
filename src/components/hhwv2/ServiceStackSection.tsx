import { Workflow, Wrench, BookOpen } from "lucide-react";
import BentoGrid from "./ui/BentoGrid";

const ServiceStackSection = () => {
  return (
    <section className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Drie manieren om met ons te bouwen
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Eén engine.
            <br />
            <span className="font-serif italic text-gradient">Drie leveringsvormen.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-5">
            Kies wat past bij jouw team. Wij draaien het, of jij neemt het over.
          </p>
        </div>
        <BentoGrid
          items={[
            {
              span: "wide",
              eyebrow: "Done-for-you · OpEx",
              title: "Wij draaien de engine",
              pitch: "Volledig ontzorgd. Jullie krijgen de afspraken.",
              body:
                "Wij bouwen de signalen, lijsten, sequences en routes in jullie eigen stack. Maandelijks fee. Geen tooling-marge. Eigenaarschap blijft bij jullie.",
              icon: <Workflow className="w-5 h-5 text-primary" strokeWidth={1.6} />,
              href: "/",
              cta: "Bekijk levering",
            },
            {
              eyebrow: "Build & transfer · CapEx",
              title: "Wij bouwen, jullie nemen over",
              pitch: "90 dagen samen bouwen. Daarna jullie eigendom.",
              body:
                "Fundament, playbooks en draaiboeken. Wij trainen jullie team en dragen volledig over.",
              icon: <Wrench className="w-5 h-5 text-primary" strokeWidth={1.6} />,
              href: "/playbooks",
              cta: "Bekijk playbooks",
            },
            {
              eyebrow: "Self-serve · Toolkit",
              title: "Frameworks & Signaal",
              pitch: "Cheatsheets, calculators en de Signaal-agent.",
              body:
                "Bouw zelf mee met onze frameworks en de Signaal-journey.",
              icon: <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.6} />,
              href: "/signaal",
              cta: "Open Signaal",
            },
          ]}
        />
      </div>
    </section>
  );
};

export default ServiceStackSection;