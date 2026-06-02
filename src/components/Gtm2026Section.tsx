import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Cell = boolean | string;

const columns = [
  "B2BGroeiMachine",
  "SaaS-tool",
  "Eigen hire",
  "Bureau",
  "Adviseur",
];

const rows: { feature: string; values: Cell[] }[] = [
  { feature: "AI-workflows + menselijke expertise", values: [true, false, false, false, false] },
  { feature: "Gebouwd op uw eigen tools", values: [true, true, true, false, true] },
  { feature: "Signaal-gedreven en proactief", values: [true, "Soms", false, false, false] },
  { feature: "Strategie, uitvoering én data", values: [true, false, true, "Mist strategie", "Alleen advies"] },
  { feature: "Snel live (binnen 30 dagen)", values: [true, "Setup varieert", "Inwerktijd", true, true] },
  { feature: "Geen lock-in", values: [true, false, "—", false, true] },
  { feature: "Betaald op resultaat", values: ["Bij Performance Partnership", false, false, false, false] },
];

const CompareCell = ({ value, highlight }: { value: Cell; highlight: boolean }) => {
  if (typeof value === "string") {
    return (
      <span className="text-xs text-muted-foreground text-center leading-tight">
        {value}
      </span>
    );
  }
  if (value) {
    return (
      <span
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center",
          highlight
            ? "bg-primary text-primary-foreground"
            : "bg-primary/15 text-primary",
        )}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-foreground/5 text-muted-foreground/50">
      <X className="w-3.5 h-3.5" strokeWidth={2.5} />
    </span>
  );
};

const Gtm2026Section = () => {
  return (
    <section id="probleem-2026" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Even stilstaan
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            Het probleem met
            <br />
            <span className="text-gradient">B2B-groei in 2026.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Uw account managers hebben geen tijd voor acquisitie. Leads sturen
            signalen die niemand opvolgt. De founder doet alles erbij. Kanalen
            draaien los. Niemand heeft één overzicht. Tools staan vol, maar het
            team werkt eromheen. U heeft geen extra software nodig. U heeft
            slimme automatisering nodig die alles aan elkaar knoopt.
          </p>
        </motion.div>

        {/* Vergelijkingstabel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
            Geen tool, geen losse hire, geen klassiek bureau. Een AI-first
            groeipartner die strategie, uitvoering en data combineert.
          </p>

          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div className="min-w-[760px] rounded-2xl border border-border/50 bg-card/40 overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-[1.5fr_repeat(5,1fr)]">
                <div className="p-4" />
                {columns.map((c, i) => (
                  <div
                    key={c}
                    className={cn(
                      "p-4 text-center text-sm font-display font-bold",
                      i === 0
                        ? "text-primary bg-primary/10 border-x border-primary/30"
                        : "text-foreground/80",
                    )}
                  >
                    {c}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {rows.map((row, ri) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-[1.5fr_repeat(5,1fr)] border-t border-border/40"
                >
                  <div className="p-4 text-sm font-medium text-foreground/90 flex items-center">
                    {row.feature}
                  </div>
                  {row.values.map((v, ci) => (
                    <div
                      key={ci}
                      className={cn(
                        "p-4 flex items-center justify-center",
                        ci === 0 && "bg-primary/[0.07] border-x border-primary/30",
                        ci === 0 && ri === rows.length - 1 && "rounded-b-xl",
                      )}
                    >
                      <CompareCell value={v} highlight={ci === 0} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Gtm2026Section;
