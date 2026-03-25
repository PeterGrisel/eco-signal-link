import { motion } from "framer-motion";
import { Puzzle, ShieldCheck, Repeat, BarChart3, Clock, Users } from "lucide-react";

const ResultsSection = () => {
  return (
    <section id="resultaten" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Waarom Rebel Force
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Geen platform.
            <br />
            <span className="text-gradient">Geen lock-in.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {[
              {
                icon: Puzzle,
                title: "100% toolagnostisch",
                text: "Wij werken met uw bestaande CRM, mailtools en LinkedIn. Geen duur platform dat u moet afnemen; wij integreren wat werkt voor uw situatie.",
              },
              {
                icon: Repeat,
                title: "Opzetten of overnemen, uw keuze",
                text: "Wij bouwen het systeem en beheren het volledig, óf we zetten alles op, trainen uw team en dragen het over. Geen afhankelijkheid.",
              },
              {
                icon: ShieldCheck,
                title: "Uw domein blijft veilig",
                text: "Subdomein-architectuur, toegewezen IP-adressen en opwarmprotocollen. Maximaal 10 tot 15 mails per dag per adres. Uitsluitend geverifieerde e-mailadressen.",
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
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="card-gradient border border-glow rounded-lg p-10"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-8">
              Wat u krijgt
            </p>
            <div className="space-y-6">
              {[
                "Volledige funnel-infrastructuur",
                "Parallelle stromen (klant + recruitment)",
                "Signaalmonitoring & intent-scoring",
                "Persoonlijke omnichannel outreach",
                "3 tot 5 gekwalificeerde meetings per maand",
                "Tweewekelijkse rapportage & pipeline-inzicht",
                "Integratie met uw bestaande tools",
                "Domeinbescherming & compliance",
                "Heractivering van warme contacten",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* KPI & Commitment section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Kwaliteit boven volume
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
            Meetbaar.
            <br />
            <span className="text-gradient">Gecontroleerd.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: "KPI-Gedreven",
              description: "Primaire KPI: gekwalificeerde gesprekken. Secundair: antwoordpercentages, engagement-scores, conversie per doelgroep en kanaal.",
            },
            {
              icon: ShieldCheck,
              title: "Merkbescherming",
              description: "Wij gebruiken nooit uw hoofddomein voor outbound. Geen hoog-volume spam, geen herhaalde benaderingen, geen aangekochte lijsten. Alles traceerbaar.",
            },
            {
              icon: Clock,
              title: "Lange Termijn Waarde",
              description: "Contacten die nu 'nog niet' zeggen worden automatisch warm gehouden. Zo groeit uw pipeline gestaag zonder namen te verbranden in uw markt.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border border-glow rounded-lg p-8 hover:border-primary/30 transition-colors"
            >
              <item.icon className="w-8 h-8 text-primary mb-5" />
              <h3 className="font-display font-bold text-xl mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
