import { motion } from "framer-motion";
import { Users, Briefcase, Handshake, Globe } from "lucide-react";

import { Trophy, Package, Car, Wrench, Building2, Stethoscope } from "lucide-react";

const streams = [
  {
    icon: Trophy,
    title: "Profvoetbal",
    description: "Sponsorwerving, partnerschappen en seizoensgebonden campagnes voor clubs en organisaties. Bereik beslissers bij merken die investeren in sport.",
    signals: ["Sponsorbudget signalen", "Merkactivaties", "Evenementplanning", "Mediaexposure"],
  },
  {
    icon: Package,
    title: "Groothandel",
    description: "Nieuwe afnemers en retailers identificeren op basis van inkooppatronen, assortimentsuitbreiding en marktbewegingen.",
    signals: ["Nieuwe vestigingen", "Assortimentswijzigingen", "Inkoopvolume", "Seizoenspieken"],
  },
  {
    icon: Car,
    title: "Leasemaatschappijen",
    description: "Bedrijven met groeiend wagenpark, contractverlengingen en fleet managers die actief vergelijken. Timing is alles.",
    signals: ["Wagenparkgroei", "Contractverloop", "Nieuwe vestigingen", "FTE-groei"],
  },
  {
    icon: Wrench,
    title: "Engineering",
    description: "Technische beslissers en projectmanagers bij industriële bedrijven. Van bouwprojecten tot productie-innovatie.",
    signals: ["Projectaankondigingen", "Investeringsrondes", "Capaciteitsuitbreiding", "Vacatures"],
  },
  {
    icon: Building2,
    title: "Zakelijke Dienstverlening",
    description: "Accountants, juristen en consultants die groeien. Bereik partners en directies op het juiste moment met de juiste boodschap.",
    signals: ["Partnerwijzigingen", "Kantooruitbreiding", "Nieuwe diensten", "Thought leadership"],
  },
  {
    icon: Stethoscope,
    title: "Gezondheidszorg",
    description: "Zorginstellingen, klinieken en healthtech-bedrijven die investeren in groei, digitalisering of specialisatie.",
    signals: ["Subsidietoekenning", "Uitbreiding locaties", "Digitaliseringsprojecten", "Leiderschapswissels"],
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
