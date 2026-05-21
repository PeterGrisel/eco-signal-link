import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COPY } from "@/content/copy";

const MiniFaq = () => {
  useEffect(() => {
    const id = "mini-faq-jsonld";
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
      mainEntity: COPY.miniFaq.items.map((f) => ({
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
    <section className="py-20 md:py-28 border-b border-border/30">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <p className="text-primary font-display font-semibold text-xs tracking-[0.25em] uppercase mb-4">
            {COPY.miniFaq.eyebrow}
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05]">
            {COPY.miniFaq.heading}
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm divide-y divide-border/40">
          {COPY.miniFaq.items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-0 px-5 md:px-7">
              <AccordionTrigger className="text-left font-display text-base md:text-lg font-semibold hover:no-underline py-5">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default MiniFaq;