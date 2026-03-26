import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Wat doet B2BGroeiMachine precies?",
    a: "Wij bouwen een systeem dat nieuwe klanten vindt en gesprekken plant. Van het eerste bericht tot een afspraak in uw agenda. Het draait elke dag, zonder dat u er naar hoeft om te kijken.",
  },
  {
    q: "Voor welke bedrijven is dit geschikt?",
    a: "Voor B2B-bedrijven in Nederland en België die willen groeien. Van dienstverleners en productiebedrijven tot de financiële sector en profvoetbal.",
  },
  {
    q: "Hoe snel zijn we operationeel?",
    a: "Binnen 4 weken. Week 1: strategie en data. Week 2: systeem en teksten. Week 3: de eerste campagnes gaan live. Week 4: bijsturen op basis van resultaten.",
  },
  {
    q: "Wat zijn signalen?",
    a: "Signalen zijn veranderingen bij bedrijven. Denk aan: iemand krijgt een nieuwe functie, een bedrijf groeit, of bezoekt uw website. Wij herkennen dat en nemen op het juiste moment contact op.",
  },
  {
    q: "Zijn jullie een leadgenerator?",
    a: "Nee! Wij bouwen systemen die dat voor u doen. Subtiel verschil. 😉",
  },
  {
    q: "Welke kanalen gebruiken jullie?",
    a: "LinkedIn, e-mail en telefonische opvolging. Alles afgestemd op uw doelgroep. Via meerdere kanalen bereikt u meer mensen.",
  },
];

const FaqSection = () => {
  useEffect(() => {
    const id = "faq-jsonld";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    return () => {
      script?.remove();
    };
  }, []);

  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4 text-center">
            Veelgestelde vragen
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center mb-12">
            Alles wat u wilt <span className="text-gradient">weten</span>
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-display font-semibold text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
