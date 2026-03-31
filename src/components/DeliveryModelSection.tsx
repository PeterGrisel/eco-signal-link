import { motion } from "framer-motion";
import { Send, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { solutions } from "@/data/solutions";

const DeliveryModelSection = () => {
  return (
    <section className="py-16 md:py-32 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Uw keuze
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Wij beheren, of
            <br />
            <span className="text-gradient">u doet het zelf.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Geen verplichtingen. Geen eigen platform. Het systeem draait op onze tools. Wij passen in wat werkt voor u.
          </p>
        </motion.div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Done-for-you */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="card-gradient border border-glow rounded-xl p-8 md:p-10 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-1">Done-for-you</h3>
            <p className="text-primary font-display text-sm font-semibold mb-4">Wij doen het voor u</p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              U focust op gesprekken voeren. Wij runnen het systeem, elke dag. Alsof u een heel team heeft, zonder de kosten.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {["Dagelijks beheer", "Elke maand beter", "Wij kwalificeren voor u"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Build & Transfer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-gradient border border-glow rounded-xl p-8 md:p-10 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
              <RefreshCw className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-1">Build &amp; Transfer</h3>
            <p className="text-primary font-display text-sm font-semibold mb-4">Wij bouwen, u neemt over</p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Wij zetten alles op, trainen uw team en dragen het over. U houdt alle tools en data zelf in handen.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {["Volledige overdracht", "Training voor uw team", "Handleiding en draaiboek"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Solution links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-10"
        >
          {solutions.slice(0, 3).map((sol) => (
            <Link
              key={sol.slug}
              to={`/solutions/${sol.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
            >
              {sol.title}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DeliveryModelSection;
