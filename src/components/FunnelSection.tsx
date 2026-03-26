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
      "Wij maken alles klaar: e-mailadressen, LinkedIn en CRM. Uw hoofddomein blijft beschermd.",
    mockup: null,
  },
  {
    number: "02",
    icon: Search,
    title: "Uw ideale klant vinden",
    description:
      "Wij bepalen wie uw beste klanten zijn. Daarna bouwen we een lijst met duizenden matches. Elke week komen er nieuwe bij.",
    mockup: "apollo",
  },
  {
    number: "03",
    icon: Zap,
    title: "Signalen herkennen",
    description:
      "Iemand wisselt van baan, een bedrijf groeit, of bezoekt uw website. Wij zien het en scoren elke prospect op interesse.",
    mockup: "signals",
  },
  {
    number: "04",
    icon: Mail,
    title: "E-mail outreach",
    description:
      "We sturen persoonlijke e-mails via meerdere adressen. We testen welke tekst, timing en onderwerpregel het beste werkt.",
    mockup: "instantly",
  },
  {
    number: "05",
    icon: Linkedin,
    title: "LinkedIn contact",
    description:
      "Connectieverzoeken, profielbezoeken en berichten. Alles binnen veilige limieten. Zo bereikt u meer mensen zonder risico.",
    mockup: "linkedin",
  },
  {
    number: "06",
    icon: Target,
    title: "Kwalificatie",
    description:
      "Wij beoordelen elke reactie. Alleen gesprekken met echte interesse en de juiste match komen in uw agenda.",
    mockup: null,
  },
  {
    number: "07",
    icon: LayoutDashboard,
    title: "Resultaten in uw CRM",
    description:
      "Alles staat in uw eigen CRM. U ziet precies wat er speelt: van eerste contact tot getekende deal.",
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
            Van onbekend tot gesprek,
            <br />
            <span className="text-gradient">stap voor stap.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Elke stap is meetbaar. Hieronder ziet u precies hoe het werkt,
            met voorbeelden uit de tools die wij voor u gebruiken.
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
