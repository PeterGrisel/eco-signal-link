import { motion } from "framer-motion";
import { Settings, Search, Mail, Linkedin, Target, LayoutDashboard, Zap } from "lucide-react";
import ApolloMockup from "./mockups/ApolloMockup";
import InstantlyMockup from "./mockups/InstantlyMockup";
import LinkedInMockup from "./mockups/LinkedInMockup";
import SignalDashboardMockup from "./SignalDashboardMockup";
import HubSpotMockup from "./mockups/HubSpotMockup";

const steps = [
  {
    number: "01",
    icon: Settings,
    title: "Infrastructuur opzetten",
    description:
      "Subdomeinen, mailboxen, LinkedIn-profielen en CRM-koppelingen. Alles wordt technisch ingericht zodat uw domeinreputatie beschermd blijft.",
    mockup: null,
  },
  {
    number: "02",
    icon: Search,
    title: "ICP-targeting & lead database",
    description:
      "We brengen uw ideale klantprofiel in kaart en bouwen een database van duizenden matches. Continu aangevuld met verse data.",
    mockup: "apollo",
  },
  {
    number: "03",
    icon: Zap,
    title: "Signaaldetectie & scoring",
    description:
      "Functiewijzigingen, funding rounds, hiring signalen, websitebezoek — we monitoren alles en scoren elke prospect op koopintentie.",
    mockup: "signals",
  },
  {
    number: "04",
    icon: Mail,
    title: "Multi-channel outreach",
    description:
      "Geautomatiseerde e-mail sequenties over meerdere subdomeinen. A/B testing op messaging, timing en onderwerpregels voor maximale respons.",
    mockup: "instantly",
  },
  {
    number: "05",
    icon: Linkedin,
    title: "LinkedIn engagement",
    description:
      "Connectieverzoeken, profielbezoeken en berichten — allemaal geautomatiseerd binnen veilige limieten. Social selling op schaal.",
    mockup: "linkedin",
  },
  {
    number: "06",
    icon: Target,
    title: "Kwalificatie & overdracht",
    description:
      "Warme leads worden handmatig gekwalificeerd. Alleen prospects met echte intent en ICP-match komen in uw agenda.",
    mockup: null,
  },
  {
    number: "07",
    icon: LayoutDashboard,
    title: "Pipeline & rapportage",
    description:
      "Alles synct naar uw CRM. Volledige pipeline-visibility, van eerste touchpoint tot gesloten deal. Data-gedreven optimalisatie elke 4 weken.",
    mockup: "hubspot",
  },
];

const getMockup = (type: string | null) => {
  switch (type) {
    case "apollo": return <ApolloMockup />;
    case "signals": return <SignalDashboardMockup />;
    case "instantly": return <InstantlyMockup />;
    case "linkedin": return <LinkedInMockup />;
    case "hubspot": return <HubSpotMockup />;
    default: return null;
  }
};

const FunnelSection = () => {
  return (
    <section className="py-16 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 max-w-3xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Het volledige proces
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Van ICP tot gesprek,
            <br />
            <span className="text-gradient">stap voor stap.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Elke stap is geautomatiseerd, geoptimaliseerd en meetbaar. 
            Hieronder ziet u precies hoe het systeem werkt — met voorbeelden 
            uit de tools die wij dagelijks voor u inzetten.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, i) => (
            <div key={step.number}>
              {/* Step header */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="flex items-start gap-5 mb-6"
              >
                {/* Step number + line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-display font-bold text-sm">{step.number}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-8 bg-gradient-to-b from-primary/30 to-transparent mt-2 hidden md:block" />
                  )}
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-bold text-2xl text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">{step.description}</p>
                </div>
              </motion.div>

              {/* Mockup */}
              {step.mockup && (
                <div className="md:ml-[4.25rem]">
                  {getMockup(step.mockup)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FunnelSection;
