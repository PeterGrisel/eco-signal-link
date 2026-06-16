import { motion } from "framer-motion";
import { Send } from "lucide-react";

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
            Onze werkwijze
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Wij draaien het systeem,
            <br />
            <span className="text-gradient">punt.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Geen verplichtingen. Geen eigen platform. Het systeem draait op onze tools. Wij beheren alles, u focust op gesprekken.
          </p>
        </motion.div>

        {/* Single card */}
        <div className="max-w-xl mx-auto">
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
            <p className="text-primary font-display text-sm font-semibold mb-4">Uw MSP voor groei</p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              U focust op gesprekken voeren. Wij runnen het systeem, elke dag. U hoeft niets te beheren. Wij zijn uw Managed Service Provider voor voorspelbare pipeline.
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
        </div>
      </div>
    </section>
  );
};

export default DeliveryModelSection;
