import { motion } from "framer-motion";

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
            Waarom RebelForce
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Geen bulk.
            <br />
            <span className="text-gradient">Geen gokken.</span>
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
                title: "Signaal-gedreven, niet volume-gedreven",
                text: "We benaderen mensen op basis van echte signalen — functiewijzigingen, groeisignalen, websitebezoek. Geen koude spray-and-pray.",
              },
              {
                title: "Uw domein blijft veilig",
                text: "Subdomein-architectuur en opwarmprotocollen beschermen uw reputatie. Geen verbrande namen, geen blacklists.",
              },
              {
                title: "Schaalbaar zonder extra headcount",
                text: "Het systeem draait 5 dagen per week op de achtergrond. Uw team focust op gesprekken, niet op outreach.",
              },
            ].map((item, i) => (
              <div key={i} className="border-l-2 border-primary/30 pl-6">
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
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
                "CRM-integratie met uw bestaande tools",
                "Domeinbescherming & compliance",
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
