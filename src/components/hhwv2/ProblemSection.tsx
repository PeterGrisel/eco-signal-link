import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const STATS = [
  { value: "€12M", label: "Gemiddelde kosten per jaar van slechte data", source: "Gartner" },
  { value: "28%", label: "Van de week die een sales daadwerkelijk verkoopt", source: "Salesforce State of Sales" },
  { value: "€2B", label: "Verspild per jaar aan verouderde sales en marketing", source: "BCG" },
];

const DEPARTMENTS = [
  { name: "Marketing", status: "draait campagnes", issue: "geen eigenaar" },
  { name: "Sales", status: "belt zelf lijsten", issue: "uit sync" },
  { name: "RevOps", status: "rapporteert handmatig", issue: "geen handoff" },
  { name: "Service", status: "weet niets van deal", issue: "geen historie" },
];

const ProblemSection = () => {
  return (
    <section className="py-16 md:py-28 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            03 / Het probleem
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Je stack moest hefboom geven.
            <br />
            <span className="text-gradient">Het werd meer werk.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-5">Dit is geen aanname. Het onderzoek:</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-16">
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-gradient border-glow rounded-2xl p-7 md:p-8"
            >
              <p className="font-display font-bold text-5xl md:text-6xl text-gradient mb-3">{s.value}</p>
              <p className="text-foreground/85 leading-relaxed mb-4">{s.label}</p>
              <p className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                Bron: {s.source}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Out-of-sync diagram */}
        <div className="card-gradient border-glow rounded-2xl p-7 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary">
              Dezelfde klant, vier antwoorden
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DEPARTMENTS.map((d) => (
              <div key={d.name} className="rounded-xl border border-primary/20 bg-background/40 p-5">
                <p className="font-display font-semibold text-lg mb-2">{d.name}</p>
                <p className="text-sm text-muted-foreground mb-3">{d.status}</p>
                <span className="inline-block text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-destructive border border-destructive/40 px-2 py-1 rounded-md">
                  {d.issue}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 italic">
            Vier afdelingen, vier waarheden. Het systeem onder de tools ontbreekt.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;