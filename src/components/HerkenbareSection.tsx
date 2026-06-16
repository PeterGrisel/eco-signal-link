import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const pijnen = [
  {
    title: "Sales is druk, maar niet met nieuwe groei",
    body: "Accountmanagers beheren bestaande klanten, lossen problemen op en reageren op aanvragen. Structurele acquisitie schiet er steeds bij in.",
  },
  {
    title: "Leads en signalen verdwijnen tussen wal en schip",
    body: "Websitebezoek, LinkedIn-interactie, oude relaties, offertes en CRM-data bevatten commerciële signalen. Alleen worden ze niet consequent opgevolgd.",
  },
  {
    title: "De founder of directie blijft trekken",
    body: "Nieuwe kansen ontstaan vooral via netwerk, toeval of directie-inzet. Daardoor wordt groei moeilijk schaalbaar.",
  },
  {
    title: "Marketing en sales werken naast elkaar",
    body: "Campagnes, content, data en opvolging zijn niet verbonden in één ritme. Er is activiteit, maar te weinig commerciële conversie.",
  },
  {
    title: "Nieuwe markten blijven ideeën op papier",
    body: "Iedereen ziet kansen in nieuwe segmenten, regio's of klantgroepen. Maar niemand bouwt er wekelijks lijsten, campagnes en opvolgacties voor.",
  },
  {
    title: "CRM is geen groeisysteem",
    body: "Het CRM laat vooral zien wat al gebeurd is. Niet welke accounts nu aandacht verdienen, welke signalen warm zijn en welke actie vandaag nodig is.",
  },
];

const HerkenbareSection = () => {
  return (
    <section id="herkenbaar" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: intro */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            <Badge variant="outline" className="mb-5 border-primary/40 text-primary font-display tracking-[0.2em] uppercase text-xs">
              Herkenbaar?
            </Badge>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
              Dit is waar groei
              <br />
              <span className="text-gradient">vaak vastloopt.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mt-6 max-w-md">
              Niet omdat de markt er niet is. Maar omdat niemand structureel eigenaar is van het vinden, activeren en opvolgen van nieuwe kansen.
            </p>
          </motion.div>

          {/* Right: advantages grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            {pijnen.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="flex flex-row gap-4"
              >
                <span className="mt-1 w-6 h-6 rounded-md border border-primary/40 bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-semibold text-base md:text-lg leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HerkenbareSection;