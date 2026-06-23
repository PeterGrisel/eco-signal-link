import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const ITEMS = [
  {
    quote:
      "De B2BGroeimachine gaf ons structuur, focus en vooral: meetings. In 3 weken zagen we al duidelijke stijging.",
    name: "Jochem van den Berg",
    role: "CEO",
    company: "ClearPeak",
  },
  {
    quote:
      "Slimme signalen, sterke content en consistente outreach. Dit is de eerste machine die echt voorspelbare pipeline levert.",
    name: "Sanne de Wit",
    role: "Head of Growth",
    company: "SOLVENTIS",
  },
  {
    quote:
      "We gingen van losse initiatieven naar één schaalbaar systeem. De ROI was direct zichtbaar.",
    name: "Thomas Klaassen",
    role: "RevOps Director",
    company: "FintechOS",
  },
];

const ExactTestimonials = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6">
      <h2 className="text-center font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-10 md:mb-14">
        Wat klanten <span className="font-serif italic text-gradient-animate">zeggen</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-4 md:gap-5">
        {ITEMS.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-xl border border-primary/20 card-gradient p-6 flex flex-col"
          >
            <Quote className="h-5 w-5 text-primary/70 mb-3" strokeWidth={1.6} />
            <blockquote className="text-sm text-foreground/85 leading-relaxed mb-6 flex-1">
              "{t.quote}"
            </blockquote>
            <figcaption className="flex items-center justify-between gap-3 pt-4 border-t border-primary/10">
              <div className="flex items-center gap-3 min-w-0">
                <span className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center font-display font-bold text-xs text-primary shrink-0">
                  {t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-sm text-foreground truncate">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{t.role}</p>
                </div>
              </div>
              <span className="font-display font-semibold text-xs tracking-wide text-foreground/60 shrink-0">
                {t.company}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

export default ExactTestimonials;