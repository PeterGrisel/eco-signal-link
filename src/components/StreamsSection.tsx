import { motion } from "framer-motion";
import { Users, Briefcase, Handshake, Globe } from "lucide-react";

const streams = [
  {
    icon: Briefcase,
    title: "Nieuwe Klanten",
    description: "MKB-ondernemers en beslissers die zoeken naar financiering, advies of diensten. Bereik op basis van groeisignalen, niet koude lijsten.",
    signals: ["Nieuwe vacatures", "Bedrijfsregistraties", "Websitebezoek", "LinkedIn-interactie"],
  },
  {
    icon: Users,
    title: "Recruitment",
    description: "Adviseurs, specialisten en talent dat bij u past. Van actieve kandidaten tot professionals die over 1 tot 2 jaar de perfecte fit zijn.",
    signals: ["Functiewijzigingen", "Opleiding afgerond", "Gedeelde connecties", "Profielactiviteit"],
  },
  {
    icon: Handshake,
    title: "Partners",
    description: "Strategische samenwerkingen identificeren op basis van complementaire diensten, gedeelde doelgroepen en marktbewegingen.",
    signals: ["Marktexpansie", "Nieuwe diensten", "Branche-events", "Publicaties"],
  },
  {
    icon: Globe,
    title: "Internationaal",
    description: "Hetzelfde systeem, nieuwe markten. Dezelfde signaalstructuur werkt in elk land; alleen de targeting wordt aangepast.",
    signals: ["Marktentry signalen", "Regulatory changes", "Partnernetwerken", "Lokale events"],
  },
];

const StreamsSection = () => {
  return (
    <section id="doelgroepen" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Eén funnel. Vier doelgroepen.
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Dezelfde motor.
            <br />
            <span className="text-gradient">Ander doel.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Onze infrastructuur is generiek, de targeting en boodschap zijn specifiek. 
            Eén systeem dat parallel draait voor elke stroom die u nodig heeft.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {streams.map((stream, i) => (
            <motion.div
              key={stream.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border border-glow rounded-lg p-8 hover:border-primary/30 transition-colors"
            >
              <stream.icon className="w-8 h-8 text-primary mb-5" />
              <h3 className="font-display font-bold text-xl mb-3">{stream.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{stream.description}</p>
              
              <div>
                <p className="text-xs font-display font-semibold text-primary tracking-[0.15em] uppercase mb-3">
                  Signalen
                </p>
                <div className="flex flex-wrap gap-2">
                  {stream.signals.map((signal) => (
                    <span
                      key={signal}
                      className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StreamsSection;
