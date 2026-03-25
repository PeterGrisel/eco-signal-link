import { motion } from "framer-motion";
import { Puzzle, ShieldCheck, Repeat } from "lucide-react";

const ResultsSection = () => {
  return (
    <section id="resultaten" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Waarom B2BGroeiMachine
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Geen platform.
            <br />
            <span className="text-gradient">Geen lock-in.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {[
              {
                icon: Puzzle,
                title: "100% toolagnostisch",
                text: "Wij werken met uw bestaande CRM, mailtools en LinkedIn. Geen duur platform dat u moet afnemen — wij integreren wat werkt voor uw situatie.",
              },
              {
                icon: Repeat,
                title: "Opzetten of overnemen — uw keuze",
                text: "Wij bouwen het systeem en beheren het volledig, óf we zetten alles op, trainen uw team en dragen het over. Geen afhankelijkheid.",
              },
              {
                icon: ShieldCheck,
                title: "Uw domein blijft veilig",
                text: "Subdomein-architectuur en opwarmprotocollen beschermen uw reputatie. Geen verbrande namen, geen blacklists.",
              },
            ].map((item, i) => (
              <div key={i} className="border-l-2 border-primary/30 pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-lg">{item.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-gradient border border-glow rounded-lg p-10"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-8">
              Wat u krijgt
            </p>
            <div className="space-y-6">
              {[
                "Volledige funnel-infrastructuur",
                "Parallelle stromen (klant + recruit + meer)",
                "Signaalmonitoring & intent-scoring",
                "Persoonlijke omnichannel outreach",
                "Gekwalificeerde gesprekken in uw agenda",
                "Dashboards & real-time inzicht",
                "Integratie met uw bestaande tools",
                "Domeinbescherming & compliance",
                "Overdracht óf volledig beheer",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
