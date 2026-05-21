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
    q: "Wat is een nulmeting?",
    a: "Een korte analyse van uw sales- en serviceproces. Wij brengen in kaart wat handmatig loopt, waar signalen blijven liggen en welke stappen het meeste opleveren als we ze automatiseren. U krijgt een concrete kaart binnen 5 werkdagen.",
  },
  {
    q: "Wat doet B2BGroeiMachine precies?",
    a: "Wij vinden handmatig en reactief werk in uw proces en automatiseren het. Van leadgeneratie tot opvolging en service-signalen. Het systeem draait elke dag, zonder dat uw team eraan moet trekken.",
  },
  {
    q: "Voor welke bedrijven is dit geschikt?",
    a: "Voor B2B-bedrijven in Nederland en België met een team dat te veel tijd kwijt is aan handwerk. Maakindustrie, bouw, technische dienstverlening, groothandel en zakelijke dienstverlening passen het beste.",
  },
  {
    q: "Hoe snel zien we resultaat?",
    a: "Eerste 30 dagen: nulmeting en kaart. Dag 30 tot 60: eerste automatiseringen live. Dag 60 tot 90: meetbare verschuiving in pipeline en tijdwinst. Geen wonderclaims, wel een meetbare lijn.",
  },
  {
    q: "Wat kost het?",
    a: "Vast maandtarief, drie maanden opzegbaar. U betaalt voor uitvoering, niet voor uren of beloftes. Exacte investering hangt af van de scope die uit de nulmeting komt.",
  },
  {
    q: "Zit ik vast aan jullie tools?",
    a: "Nee. Wij zijn agnostisch en bouwen op uw bestaande stack. Geen eigen platform, geen vendor lock-in. Bij Build & Transfer dragen we alles over inclusief data en draaiboek.",
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
    <section id="faq" className="py-16 md:py-24 pb-32 md:pb-24 border-t border-border">
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

          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-3">
              <span className="inline-block animate-bounce">👆</span>
              <span>Nog steeds niet overtuigd?</span>
            </div>
            <p className="text-center text-lg font-display font-semibold mb-4">
              Bel ons op <a href="tel:+31852502925" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">+31 85 250 2925</a>
            </p>
            <p className="text-center text-muted-foreground text-sm">
              Binnen 15 min weet u of dit iets voor uw bedrijf is.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
