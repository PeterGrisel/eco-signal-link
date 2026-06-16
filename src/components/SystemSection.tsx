import { motion } from "framer-motion";
import { Settings, Brain, MessageSquare, Target, RefreshCw, Database, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SignalDashboardMockup from "./SignalDashboardMockup";

const layers = [
  {
    icon: Settings,
    number: "01",
    title: "Scan & infrastructuur",
    description: "Wij brengen uw sales- en serviceproces in kaart. Daarna richten we de infrastructuur in die bij uw ICP en data past.",
  },
  {
    icon: Brain,
    number: "02",
    title: "Intelligence",
    description: "Wij brengen uw ideale klant in kaart en volgen signalen: nieuwe functies, groei, websitebezoek en intentie.",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "Betrokkenheid",
    description: "Wij activeren signalen via het kanaal waar uw ICP zit. Rustig, relevant en op het juiste moment.",
  },
  {
    icon: Target,
    number: "04",
    title: "Kwalificatie",
    description: "Wij beoordelen elk signaal en elke reactie. Samen bepalen we welke terecht moet komen.",
  },
];

const principles = [
  {
    icon: RefreshCw,
    title: "Proces levert data",
    description: "Ons systeem draait elke dag. De data die het oplevert, gebruiken we om steeds beter te worden.",
  },
  {
    icon: Database,
    title: "Alles in uw eigen tools",
    description: "Alle contacten en resultaten staan in uw eigen CRM. Die data is en blijft van u.",
  },
  {
    icon: Zap,
    title: "Elke 4 weken bijsturen",
    description: "Wat werkt, schalen we op. Wat niet werkt, passen we aan. Zo wordt het resultaat elke maand beter.",
  },
];

const SystemSection = () => {
  return (
    <section id="hoe-het-werkt" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Zo werkt het
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Eerst in kaart.
            <br />
            <span className="text-gradient">Dan automatiseren.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6 max-w-2xl">
            Wij beginnen met een scan van uw sales- en serviceproces.
            Daarna automatiseren we wat handmatig loopt en zetten we
            signalen om in afspraken.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-16 md:mb-24">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border border-glow rounded-lg p-6 md:p-8 group hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-primary font-display font-bold text-sm">{layer.number}</span>
                <layer.icon className="w-5 h-5 text-primary mt-0.5" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{layer.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{layer.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Signal Dashboard Mockup */}
        <div className="mb-16 md:mb-24">
          <SignalDashboardMockup />
        </div>


        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Data als basis
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
            Het proces levert data.
            <br />
            <span className="text-gradient">Data geeft richting.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {principles.map((item, i) => (
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

export default SystemSection;
