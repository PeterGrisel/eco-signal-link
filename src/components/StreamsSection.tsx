import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { sectors } from "@/data/sectors";
import { solutions } from "@/data/solutions";


const StreamsSection = () => {
  return (
    <section id="doelgroepen" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Eén systeem. Elke sector.
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Werkt in
            <br />
            <span className="text-gradient">elke branche.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Dezelfde aanpak, afgestemd op uw markt. Van profvoetbal tot engineering:
            wij weten hoe we uw doelgroep bereiken.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {sectors.map((sector, i) => (
            <motion.a
              key={sector.slug}
              href={`/sectoren/${sector.slug}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border border-glow rounded-lg p-6 md:p-8 hover:border-primary/30 transition-colors group"
            >
              <sector.icon className="w-8 h-8 text-primary mb-5" />
              <h3 className="font-display font-bold text-xl mb-3 group-hover:text-primary transition-colors">{sector.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{sector.description}</p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 p-6 md:p-8 rounded-xl border border-border bg-secondary/30"
        >
          <p className="text-muted-foreground mb-4">
            Dezelfde uitdagingen, ongeacht uw branche? Bekijk onze oplossingen:
          </p>
          <div className="flex flex-wrap gap-3">
            {solutions.slice(0, 5).map((sol) => (
              <Link
                key={sol.slug}
                to={`/solutions/${sol.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
              >
                {sol.title}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StreamsSection;
