import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const COLUMNS = ["B2BGroeiMachine", "SDR's inhuren", "AI-tool", "Ander bureau", "Zelf bouwen"];

const ROWS = [
  {
    label: "Gebouwd in jouw stack",
    cells: [true, "handmatig", "andere login", "draait buiten je stack", "als je het team hebt"],
  },
  {
    label: "Fixt data, signalen en routering",
    cells: [true, "raakt het niet", "één onderdeel", "campagnes, geen plumbing", "6 tot 12 maanden project"],
  },
  {
    label: "Draait GTM, ads en content",
    cells: [true, "alleen outbound", "jij bedient het", "vaak één kanaal", "per kanaal aannemen"],
  },
  {
    label: "AI-workflows + menselijk oordeel",
    cells: [true, "mens, geen systeem", "systeem, geen mens", "verschilt per team", "je bouwt allebei"],
  },
  {
    label: "Laat een systeem achter dat je bezit",
    cells: [true, "vertrekt met ze mee", "gehuurd", "vastgeplakt aan hen", "van jou, als het lukt"],
  },
  {
    label: "Verlaagt afhankelijkheid van koppen",
    cells: [true, "voegt koppen toe", "blijft operators nodig", "voegt vendor toe", "voegt team toe"],
  },
];

const Cell = ({ v, primary }: { v: string | boolean; primary?: boolean }) => {
  if (v === true)
    return (
      <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
        <Check className="w-4 h-4" /> Ja
      </span>
    );
  return (
    <span className={`inline-flex items-center gap-2 text-sm ${primary ? "text-foreground/90" : "text-muted-foreground"}`}>
      <X className="w-3.5 h-3.5 text-muted-foreground/60" />
      <span className="italic">{v}</span>
    </span>
  );
};

const ComparisonTable = () => {
  return (
    <section className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            08 / Waarom wij
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Meer tools, meer koppen, meer bureaus.
            <br />
            <span className="text-gradient">Geen fixt het systeem eronder.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-5">
            Elk van die opties voegt een laag toe om te managen. Wij bouwen het systeem onder je revenue. Eerlijke vergelijking.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="card-gradient border-glow rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left p-5 text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-muted-foreground w-1/4">
                    Vergelijking
                  </th>
                  {COLUMNS.map((c, idx) => (
                    <th
                      key={c}
                      className={`text-left p-5 text-sm font-display font-bold ${
                        idx === 0 ? "text-primary bg-primary/5" : "text-foreground/80"
                      }`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, ri) => (
                  <tr key={row.label} className={ri % 2 === 0 ? "bg-background/30" : ""}>
                    <td className="p-5 text-sm font-medium text-foreground/90 border-t border-primary/10">
                      {row.label}
                    </td>
                    {row.cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`p-5 border-t border-primary/10 ${ci === 0 ? "bg-primary/5" : ""}`}
                      >
                        <Cell v={cell} primary={ci === 0} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;