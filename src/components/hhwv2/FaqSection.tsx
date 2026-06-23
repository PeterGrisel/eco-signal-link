import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Wat bouwen jullie precies?",
    a: "Een B2B Engine: schone data, live signalen en plays die de juiste accounts vinden en bereiken op het juiste moment. Gebouwd in jouw tools, in 90 dagen. Daarna is het van jou.",
  },
  {
    q: "Voor wie is het?",
    a: "B2B-bedrijven voorbij product-market-fit met een waardevolle deal (vanaf ongeveer €25k ACV) en een duidelijke set target-accounts. Als groei afhangt van de juiste accounts bereiken, past het.",
  },
  {
    q: "Vervangen jullie onze tools of ons team?",
    a: "Nee. Wij bouwen in jouw stack en dragen het over. Jouw team blijft eigenaar en ziet hoe alles werkt. Niets om uit te rukken, geen black box.",
  },
  {
    q: "Hoe verschilt dit van een SDR inhuren of nog een tool kopen?",
    a: "Een SDR of tool is één extra ding om te managen. Wij bouwen het systeem eronder: schone data, gescoorde signalen en plays die van signaal naar afspraak gaan.",
  },
  {
    q: "Wat gebeurt er in de 90-dagen build?",
    a: "Drie fases. Data: wie en waarom. Signaal: wanneer, met 10 tot 15 live signalen gescoord. Plays: 4 tot 6 plays live. Je eindigt met een werkende engine, geen slidedeck.",
  },
  {
    q: "Wat kost het en hoe starten we?",
    a: "Pricing is op maat van jouw stack en doelen. We lopen het door in een gesprek van 30 minuten. De 90-dagen build is een vast traject. De uitvoeringslaag erna is maandelijks.",
  },
];

const FaqSection = () => (
  <section className="py-16 md:py-32 relative">
    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
      <div className="mb-12 md:mb-16 max-w-3xl">
        <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
          10 / Vragen
        </p>
        <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
          Veelgestelde
          <br />
          <span className="text-gradient">vragen.</span>
        </h2>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {FAQS.map((f, i) => (
          <AccordionItem
            key={f.q}
            value={`item-${i}`}
            className="card-gradient border-glow rounded-xl px-6"
          >
            <AccordionTrigger className="text-left font-display font-semibold text-lg hover:no-underline py-5">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FaqSection;