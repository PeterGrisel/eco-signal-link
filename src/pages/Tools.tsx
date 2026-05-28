import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calculator, Sigma, Compass, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const tools = [
  {
    title: "Funnel Calculator",
    description: "Reken terug vanaf uw omzetdoel. Zie hoeveel traffic, leads en gesprekken u nodig heeft.",
    href: "/tools/funnel-calculator",
    tag: "Reverse funnel",
    icon: Calculator,
  },
  {
    title: "Pipeline Score Calculator",
    description: "Scoor uw pipeline op 10 factoren. Krijg een score van 0 tot 100 met advies per onderdeel.",
    href: "/pipeline-equation#calculator",
    tag: "Pipeline Equation™",
    icon: Sigma,
  },
  {
    title: "Signaal Blueprint",
    description: "Bouw uw eigen signaal-blueprint. Output is een persoonlijk PDF-rapport met uw groeiplan.",
    href: "/signaal/blueprint",
    tag: "Learning journey",
    icon: Compass,
  },
];

const Tools = () => {
  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://b2bgroeimachine.io/" },
            { name: "Tools", url: "https://b2bgroeimachine.io/tools" },
          ]}
        />
        <Navbar />

        <section className="pt-28 pb-12 md:pt-36 md:pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-primary mb-4 border border-primary/30 rounded-full px-4 py-1.5">
                Gratis tools
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Reken uw <span className="text-primary">groeimachine</span> door
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Drie tools om uw pipeline, funnel en blueprint te onderbouwen. Geen account nodig.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {tools.map((t, i) => {
                const Icon = t.icon;
                const external = t.href.startsWith("/signaal");
                const content = (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group h-full border border-border rounded-2xl p-6 bg-card/30 hover:bg-card/50 hover:border-primary/40 transition-all flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2.5 py-1">
                        {t.tag}
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-2">{t.title}</h2>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">{t.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                      Open tool <ArrowRight className="h-4 w-4" />
                    </span>
                  </motion.div>
                );
                return external || t.href.includes("#") ? (
                  <a key={t.href} href={t.href}>{content}</a>
                ) : (
                  <Link key={t.href} to={t.href}>{content}</Link>
                );
              })}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageLoader>
  );
};

export default Tools;