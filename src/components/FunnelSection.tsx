import { motion } from "framer-motion";
import { Bot, Zap, Users, CalendarCheck, ArrowDown } from "lucide-react";

const funnelStages = [
  {
    label: "TOF",
    title: "Top of Funnel",
    subtitle: "Geautomatiseerd",
    icon: Bot,
    width: "w-full",
    items: [
      "Signaaldetectie: functiewijzigingen, groei, websitebezoek",
      "Automatische verrijking & ICP-matching",
      "Subdomein-mailing & LinkedIn-connecties",
    ],
    badge: "Automatisering",
    badgeDesc: "Geen handmatig werk; het systeem draait 24/7",
  },
  {
    label: "MOF",
    title: "Middle of Funnel",
    subtitle: "Geautomatiseerd + Personalisatie",
    icon: Zap,
    width: "w-[92%]",
    items: [
      "Multi-touch sequenties: 6 tot 8 contactmomenten",
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
    width: "w-[80%]",
    items: [
      "Handmatige kwalificatie van warme leads",
      "Persoonlijk gesprek & behoefteanalyse",
      "Directe overdracht naar uw agenda",
    ],
    badge: "Engagement",
    badgeDesc: "Hier focust uw team, of wij doen het voor u",
  },
];

const integrationTools = [
  { name: "HubSpot", side: "left", top: "8%" },
  { name: "Salesforce", side: "left", top: "28%" },
  { name: "Pipedrive", side: "left", top: "48%" },
  { name: "Apollo.io", side: "left", top: "68%" },
  { name: "Lemlist", side: "left", top: "88%" },
  { name: "LinkedIn", side: "right", top: "8%" },
  { name: "Clay", side: "right", top: "28%" },
  { name: "Instantly", side: "right", top: "48%" },
  { name: "Smartlead", side: "right", top: "68%" },
  { name: "Zapier", side: "right", top: "88%" },
];

const FunnelSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
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
            De bottleneck in B2B-groei is niet het vinden van prospects, het is de tijd 
            van uw team. Wij automatiseren elke stap tot aan het moment dat het er écht 
            toe doet: het persoonlijke gesprek.
          </p>
        </motion.div>

        {/* Funnel with floating integration tools */}
        <div className="mt-16 relative">
          {/* Floating tool badges - left */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-32">
            {integrationTools
              .filter((t) => t.side === "left")
              .map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                  className="absolute left-0"
                  style={{ top: tool.top }}
                >
                  <div className="px-3 py-2 rounded-md bg-secondary/80 border border-border text-xs font-medium text-muted-foreground whitespace-nowrap backdrop-blur-sm">
                    {tool.name}
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-full w-8 h-px bg-gradient-to-r from-border to-transparent" />
                </motion.div>
              ))}
          </div>

          {/* Floating tool badges - right */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-32">
            {integrationTools
              .filter((t) => t.side === "right")
              .map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                  className="absolute right-0"
                  style={{ top: tool.top }}
                >
                  <div className="px-3 py-2 rounded-md bg-secondary/80 border border-border text-xs font-medium text-muted-foreground whitespace-nowrap backdrop-blur-sm">
                    {tool.name}
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-full w-8 h-px bg-gradient-to-l from-border to-transparent" />
                </motion.div>
              ))}
          </div>

          {/* Center funnel */}
          <div className="flex flex-col items-center gap-4 lg:px-40">
            {funnelStages.map((stage, i) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`${stage.width} max-w-4xl transition-all duration-300`}
              >
                <div className="card-gradient border border-glow rounded-lg p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="md:w-1/3 shrink-0">
                      <div className="flex items-center gap-3 mb-2">
                        <stage.icon className="w-6 h-6 text-primary" />
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

                {i < funnelStages.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-5 h-5 text-primary/40" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Result block */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-[65%] max-w-2xl mt-2"
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

          {/* Mobile tool badges */}
          <div className="lg:hidden mt-10">
            <p className="text-xs font-display font-semibold text-primary tracking-[0.15em] uppercase mb-4 text-center">
              Integreert met uw bestaande tools
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {integrationTools.map((tool) => (
                <span
                  key={tool.name}
                  className="px-3 py-1.5 rounded-md bg-secondary/80 border border-border text-xs font-medium text-muted-foreground"
                >
                  {tool.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FunnelSection;
