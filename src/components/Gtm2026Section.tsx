import { motion } from "framer-motion";
import { Check, X, ChevronDown } from "lucide-react";
import { useState } from "react";
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
  { feature: "Lost het gebrek aan commercieel ritme op", values: [true, false, "Soms", false, false] },
  { feature: "Combineert strategie, data en uitvoering", values: [true, false, "Soms", "Soms", "Alleen advies"] },
  { feature: "Signaleert nieuwe kansen proactief", values: [true, "Soms", false, false, false] },
  { feature: "Maakt opvolging concreet voor sales", values: [true, false, true, "Soms", false] },
  { feature: "Werkt op uw bestaande tools en CRM", values: [true, "Soms", true, false, true] },
  { feature: "Binnen 30 dagen operationeel", values: [true, "Setup varieert", "Inwerktijd", "Soms", true] },
  { feature: "Uit te breiden met telefonische opvolging", values: [true, false, true, "Soms", false] },
  { feature: "Geen vendor lock-in", values: [true, false, "—", false, true] },
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
  const [showCompare, setShowCompare] = useState(false);
  return (
    <section id="diensten" className="py-14 md:py-28 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-14 max-w-3xl"
        >
          <p className="text-primary font-display font-semibold text-xs tracking-[0.2em] uppercase mb-3">
            De echte groeiblokkade
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            Uw team wil wel groeien.{" "}
            <span className="text-gradient">Maar het systeem ontbreekt.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-5">
            Het team is ingericht op klanten bedienen, niet op markt ontwikkelen. Leads en signalen worden te laat opgevolgd. Daardoor blijft groei afhankelijk van toeval.
          </p>
        </motion.div>

        {/* Vergelijking */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Mobile: compacte checklist-card */}
          <div className="md:hidden rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/[0.08] to-card/40 p-5 shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.3)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-display font-bold uppercase tracking-[0.18em] text-primary">
                B2BGroeiMachine
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                Wat u krijgt
              </span>
            </div>
            <ul className="space-y-2.5">
              {rows.map((r) => (
                <li key={r.feature} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-foreground/90 leading-snug">
                    {r.feature}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowCompare((v) => !v)}
              className="mt-5 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors border-t border-border/40 pt-4"
            >
              {showCompare ? "Verberg vergelijking" : "Vergelijk met alternatieven"}
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  showCompare && "rotate-180",
                )}
              />
            </button>
            {showCompare && (
              <div className="mt-4 overflow-x-auto -mx-5 px-5">
                <div className="min-w-[560px] rounded-xl border border-border/50 bg-card/40 overflow-hidden text-xs">
                  <div className="grid grid-cols-[1.4fr_repeat(5,1fr)]">
                    <div className="p-2.5" />
                    {columns.map((c, i) => (
                      <div
                        key={c}
                        className={cn(
                          "p-2.5 text-center font-display font-bold text-[11px]",
                          i === 0
                            ? "text-primary bg-primary/10"
                            : "text-foreground/70",
                        )}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                  {rows.map((row) => (
                    <div
                      key={row.feature}
                      className="grid grid-cols-[1.4fr_repeat(5,1fr)] border-t border-border/40"
                    >
                      <div className="p-2.5 text-[11px] text-foreground/80 flex items-center">
                        {row.feature}
                      </div>
                      {row.values.map((v, ci) => (
                        <div
                          key={ci}
                          className={cn(
                            "p-2.5 flex items-center justify-center",
                            ci === 0 && "bg-primary/[0.07]",
                          )}
                        >
                          <CompareCell value={v} highlight={ci === 0} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop: elegante tabel */}
          <div className="hidden md:block">
            <p className="text-center text-muted-foreground mb-5 max-w-2xl mx-auto text-sm">
              Software, een losse campagne of een extra hire lost dit niet op. U heeft een systeem nodig dat strategie, data en opvolging knoopt.
            </p>
            <div className="rounded-2xl border border-border/50 bg-card/40 overflow-hidden shadow-[0_10px_40px_-20px_rgba(0,0,0,0.4)]">
              {/* Header row */}
              <div className="grid grid-cols-[1.6fr_repeat(5,1fr)]">
                <div className="p-3" />
                {columns.map((c, i) => (
                  <div
                    key={c}
                    className={cn(
                      "p-3 text-center text-xs lg:text-sm font-display font-bold",
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
                  className="grid grid-cols-[1.6fr_repeat(5,1fr)] border-t border-border/40"
                >
                  <div className="p-3 text-xs lg:text-sm font-medium text-foreground/90 flex items-center">
                    {row.feature}
                  </div>
                  {row.values.map((v, ci) => (
                    <div
                      key={ci}
                      className={cn(
                        "p-3 flex items-center justify-center",
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
