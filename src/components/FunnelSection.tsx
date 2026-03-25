import { motion } from "framer-motion";
import { Bot, Zap, Users, CalendarCheck, ArrowDown } from "lucide-react";

const funnelStages = [
  {
    label: "TOF",
    title: "Top of Funnel",
    subtitle: "Geautomatiseerd",
    icon: Bot,
    color: "bg-primary/10 border-primary/20",
    iconColor: "text-primary",
    width: "w-full",
    items: [
      "Signaal-detectie: functiewijzigingen, groei, websitebezoek",
      "Automatische verrijking & ICP-matching",
      "Subdomein-mailing & LinkedIn-connecties",
    ],
    badge: "Automatisering",
    badgeDesc: "Geen handmatig werk — het systeem draait 24/7",
  },
  {
    label: "MOF",
    title: "Middle of Funnel",
    subtitle: "Geautomatiseerd + Personalisatie",
    icon: Zap,
    color: "bg-primary/15 border-primary/25",
    iconColor: "text-primary",
    width: "w-[90%]",
    items: [
      "Multi-touch sequenties: 6-8 contactmomenten",
      "A/B testing op messaging & timing",
      "Intent-scoring & engagement-tracking",
    ],
    badge: "Nurturing",
    badgeDesc: "Automatische opvolging tot het signaal er is",
  },
  {
    label: "BOF",
    title: "Bottom of Funnel",
    subtitle: "Menselijk contact",
    icon: Users,
    color: "bg-primary/20 border-primary/30",
    iconColor: "text-primary",
    width: "w-[75%]",
    items: [
      "Handmatige kwalificatie van warme leads",
      "Persoonlijk gesprek & behoefte-analyse",
      "Directe overdracht naar uw agenda",
    ],
    badge: "Engagement",
    badgeDesc: "Hier focust uw team — of wij doen het voor u",
  },
];

const FunnelSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 max-w-3xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Theory of Constraints
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Automatiseer alles
            <br />
            <span className="text-gradient">behalve het gesprek.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            De bottleneck in B2B-groei is niet het vinden van prospects — het is de tijd 
            van uw team. Wij automatiseren elke stap tot aan het moment dat het er écht 
            toe doet: het persoonlijke gesprek.
          </p>
        </motion.div>

        {/* Funnel visualization */}
        <div className="mt-16 flex flex-col items-center gap-4">
          {funnelStages.map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`${stage.width} max-w-4xl transition-all duration-300`}
            >
              <div className={`card-gradient border ${stage.color} rounded-lg p-6 md:p-8`}>
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Left: Stage info */}
                  <div className="md:w-1/3 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <stage.icon className={`w-6 h-6 ${stage.iconColor}`} />
                      <span className="text-xs font-display font-bold tracking-[0.2em] uppercase text-primary">
                        {stage.label}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-xl mb-1">{stage.title}</h3>
                    <p className="text-muted-foreground text-sm">{stage.subtitle}</p>
                    
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-medium text-primary">{stage.badge}</span>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="md:w-2/3">
                    <ul className="space-y-3 mb-4">
                      {stage.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground/70 italic">{stage.badgeDesc}</p>
                  </div>
                </div>
              </div>

              {/* Arrow between stages */}
              {i < funnelStages.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="w-5 h-5 text-primary/40" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Result block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="w-[60%] max-w-2xl mt-2"
          >
            <div className="border border-primary/40 bg-primary/5 rounded-lg p-6 text-center">
              <CalendarCheck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg mb-1">
                Gekwalificeerde gesprekken in uw agenda
              </h3>
              <p className="text-muted-foreground text-sm">
                Alleen prospects die intent tonen en matchen met uw ICP
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FunnelSection;
