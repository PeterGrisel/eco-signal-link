import { motion } from "framer-motion";
import { Users, Inbox, Crown, Split, MapPinned, Database } from "lucide-react";

const pijnen = [
  {
    icon: Users,
    title: "Sales is druk, maar niet met nieuwe groei",
    body: "Accountmanagers beheren bestaande klanten, lossen problemen op en reageren op aanvragen. Structurele acquisitie schiet er steeds bij in.",
  },
  {
    icon: Inbox,
    title: "Leads en signalen verdwijnen tussen wal en schip",
    body: "Websitebezoek, LinkedIn-interactie, oude relaties, offertes en CRM-data bevatten commerciële signalen. Alleen worden ze niet consequent opgevolgd.",
  },
  {
    icon: Crown,
    title: "De founder of directie blijft trekken",
    body: "Nieuwe kansen ontstaan vooral via netwerk, toeval of directie-inzet. Daardoor wordt groei moeilijk schaalbaar.",
  },
  {
    icon: Split,
    title: "Marketing en sales werken naast elkaar",
    body: "Campagnes, content, data en opvolging zijn niet verbonden in één ritme. Er is activiteit, maar te weinig commerciële conversie.",
  },
  {
    icon: MapPinned,
    title: "Nieuwe markten blijven ideeën op papier",
    body: "Iedereen ziet kansen in nieuwe segmenten, regio's of klantgroepen. Maar niemand bouwt er wekelijks lijsten, campagnes en opvolgacties voor.",
  },
  {
    icon: Database,
    title: "CRM is geen groeisysteem",
    body: "Het CRM laat vooral zien wat al gebeurd is. Niet welke accounts nu aandacht verdienen, welke signalen warm zijn en welke actie vandaag nodig is.",
  },
];

const HerkenbareSection = () => {
  return (
    <section id="herkenbaar" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Herkenbaar?
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Dit is waar groei
            <br />
            <span className="text-gradient">vaak vastloopt.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Niet omdat de markt er niet is. Maar omdat niemand structureel eigenaar is van het vinden, activeren en opvolgen van nieuwe kansen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {pijnen.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group card-gradient border-glow rounded-2xl p-6 md:p-7 flex flex-col transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="w-11 h-11 rounded-xl border border-primary/30 bg-card flex items-center justify-center mb-5">
                <p.icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
              </span>
              <h3 className="font-display font-bold text-lg md:text-xl leading-tight mb-3">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HerkenbareSection;