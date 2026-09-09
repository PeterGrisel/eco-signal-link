import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import { PerformancePartnership } from "@/components/PricingSection";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCurrency } from "@/contexts/CurrencyContext";
import { motion } from "framer-motion";
import { Handshake, TrendingUp, ShieldCheck } from "lucide-react";

type Curr = "EUR" | "USD" | "GBP";

const PerformancePartnershipPage = () => {
  usePageMeta({
    title: "Performance Partnership | B2BGroeiMachine",
    description:
      "Lage techkosten en gedeelde upside. Voor B2B-bedrijven met een bewezen propositie die hun commerciële machine willen bouwen zonder hoge vaste lasten.",
    canonical: "https://www.b2bgroeimachine.io/performance-partnership",
  });

  const { currency, rates } = useCurrency();
  const cur = (currency || "EUR") as Curr;
  const rate = rates[cur] ?? 1;

  return (
    <PageLoader>
      <div className="min-h-screen relative">
        <AmbientBackdrop />
        <div className="relative z-10">
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: "https://www.b2bgroeimachine.io/" },
              { name: "Performance Partnership", url: "https://www.b2bgroeimachine.io/performance-partnership" },
            ]}
          />
          <Navbar />
          <main className="pt-24">
            <header className="mx-auto max-w-4xl px-5 pt-10 pb-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
                <Handshake className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary/90">
                  Voor gekwalificeerde klanten
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Performance Partnership.
                <br />
                <span className="text-gradient">Lage techkosten. Gedeelde upside.</span>
              </h1>
              <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                U heeft al klanten en omzet, maar mist het systeem dat nieuwe kansen structureel signaleert en opvolgt. Wij bouwen en draaien de groeimachine. U deelt mee in de upside die het oplevert.
              </p>
            </header>

            <section className="py-8 md:py-14">
              <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                <PerformancePartnership lang="nl" currency={cur} rate={rate} />
              </div>
            </section>

            <section className="py-10 md:py-20 border-t border-border/40">
              <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                  {[
                    {
                      icon: ShieldCheck,
                      title: "Gedeeld risico",
                      body: "Wij investeren tijd en techniek. U betaalt minimale techkosten. Pas als het systeem omzet genereert, delen we de upside.",
                    },
                    {
                      icon: TrendingUp,
                      title: "Schaalbare opbrengst",
                      body: "De groeimachine blijft van u. Naarmate het systeem meer signalen omzet in gesprekken, groeit de opbrengst voor beide partijen.",
                    },
                    {
                      icon: Handshake,
                      title: "Transparante afspraken",
                      body: "Attributie leggen we vooraf vast. Geen discussie achteraf over welke omzet door het systeem is beïnvloed.",
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.45, delay: i * 0.08 }}
                        className="rounded-2xl border border-border bg-card/40 p-6"
                      >
                        <span className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4">
                          <Icon className="w-5 h-5" />
                        </span>
                        <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </PageLoader>
  );
};

export default PerformancePartnershipPage;
