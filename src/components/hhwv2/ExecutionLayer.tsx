import { motion } from "framer-motion";
import { Workflow, Megaphone, FileText, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    eyebrow: "Vanuit geprioriteerde accounts",
    title: "GTM-engineering",
    icon: Workflow,
    pitch: "Outbound. Veel signalen in, wij benaderen veel.",
    desc: "Signaal-getriggerde outbound in jouw stack. Wij maken van een live signaal een onderzocht account, sequence en belwachtrij.",
    steps: ["LinkedIn-engagement", "Account + contact", "Fit + intent", "Sequence + calls", "Owner notified"],
  },
  {
    eyebrow: "Vanuit ads-audience",
    title: "Ads-engineering",
    icon: Megaphone,
    pitch: "Overal. Zij zien je ads voor je belt.",
    desc: "Betaalde ads die spiegelen wat outbound doet. Dezelfde gescoorde accounts zien je ads op LinkedIn en Google.",
    steps: ["Bedrijven op site", "Match aan target", "Audience sync", "Retarget in sync", "Loop terug naar CRM"],
  },
  {
    eyebrow: "Vanuit content-hoek",
    title: "Content-engineering",
    icon: FileText,
    pitch: "Inbound. Wij publiceren, zij komen naar je toe.",
    desc: "Content als pipelinekanaal. Founder-posts gescoord tegen een kwaliteitslat. Engagers gaan in outbound.",
    steps: ["Salescalls + bezwaren", "Founder-stem", "Tegen kwaliteitslat", "Founder-posts", "Engagers naar outbound"],
  },
];

const ExecutionLayer = () => {
  return (
    <section id="uitvoering" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            07 / De uitvoeringslaag
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Al een fundament?
            <br />
            <span className="text-gradient">Start bij uitvoering.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-5">
            Drie diensten, vanuit dezelfde engine-output. Neem er één of alle drie.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-gradient border-glow rounded-2xl p-6 md:p-7 flex flex-col"
            >
              <p className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-3">
                {s.eyebrow}
              </p>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-lg border border-primary/30 bg-card flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                </span>
                <h3 className="font-display font-bold text-xl">{s.title}</h3>
              </div>
              <p className="text-primary font-semibold text-sm mb-3">{s.pitch}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.desc}</p>
              <ol className="space-y-2 mt-auto">
                {s.steps.map((step, idx) => (
                  <li key={step} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 rounded-md border border-primary/30 bg-primary/5 flex items-center justify-center text-[10px] font-display font-bold text-primary shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-foreground/85">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 max-w-3xl mx-auto text-center text-muted-foreground leading-relaxed">
          <p>
            <ArrowRight className="inline w-4 h-4 text-primary mr-2" />
            Draai er één en het werkt. Draai alle drie en ze versterken elkaar.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExecutionLayer;