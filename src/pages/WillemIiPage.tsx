import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import peterPhoto from "@/assets/peter-grisel.png";
import crest from "@/assets/willem-ii-logo.svg.asset.json";
import stadium from "@/assets/willem-ii-stadion.webp.asset.json";

const opportunities = [
  { number: "01", title: "Nieuwe partners", copy: "Breng bedrijven in Midden-Brabant in beeld. Benader de juiste beslissers op het juiste moment." },
  { number: "02", title: "Bestaande relaties", copy: "Herken groeisignalen bij bestaande partners. Maak hospitality en zichtbaarheid bespreekbaar wanneer het past." },
  { number: "03", title: "Businessclub", copy: "Houd nieuwe contacten warm. Zet interesse om in een gesprek met het commerciële team." },
];

const steps = [
  { label: "Markt", detail: "We brengen passende bedrijven rond Tilburg in kaart." },
  { label: "Signaal", detail: "We volgen groei, nieuwe mensen en nieuwe plannen." },
  { label: "Activatie", detail: "We bereiken beslissers via e-mail en LinkedIn." },
  { label: "Gesprek", detail: "Het team van Willem II neemt warme kansen over." },
];

const metrics = [
  { value: "5K+", label: "Bedrijven in kaart", note: "TAM / SAM / SOM" },
  { value: "50%", label: "Open rate", note: "op outbound" },
  { value: "25%", label: "Reply rate", note: "op outbound" },
  { value: "Live", label: "Vrouwenvoetbal-track", note: "actief" },
];

function WillemCurtain() {
  const [opening, setOpening] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFinished(true);
      return;
    }
    const start = window.setTimeout(() => setOpening(true), 600);
    const end = window.setTimeout(() => setFinished(true), 3300);
    return () => { window.clearTimeout(start); window.clearTimeout(end); };
  }, []);

  if (finished) return null;
  return (
    <div aria-hidden="true" className="willem-curtain fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {(["left", "right"] as const).map(side => (
        <div
          key={side}
          className={`absolute inset-y-0 w-[51%] ${side === "left" ? "left-0" : "right-0"} willem-curtain-panel`}
          style={{ transform: opening ? `translateX(${side === "left" ? "-103%" : "103%"})` : "translateX(0)" }}
        />
      ))}
    </div>
  );
}

const WillemIiPage = () => {
  usePageMeta({
    title: "Willem II × B2BGroeiMachine | Meer zakelijke kansen in Midden-Brabant",
    description: "Een voorstel voor Willem II: partners vinden, relaties laten groeien en warme kansen doorgeven. Bekijk de aanpak, de Excelsior-case en de prijzen.",
    canonical: "https://www.b2bgroeimachine.io/voor/willem-ii",
    themeColor: "#1D2851",
  });

  return (
    <div className="willem-page min-h-screen bg-background text-foreground">
      <WillemCurtain />
      <Navbar />
      <main>
        <section className="willem-hero relative isolate min-h-[min(780px,92svh)] flex flex-col justify-end overflow-hidden pt-32 pb-14 md:pb-20">
          <img src={stadium.url} alt="Koning Willem II Stadion vanuit de lucht" className="absolute inset-0 -z-20 h-full w-full object-cover" loading="eager" />
          <div className="willem-hero-shade absolute inset-0 -z-10" />
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-6 mb-8 md:mb-12">
              <img src="/favicon.svg" alt="B2BGroeiMachine" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              <span className="w-px h-12 bg-foreground/40" aria-hidden="true" />
              <img src={crest.url} alt="Willem II" className="w-12 h-20 md:w-16 md:h-24 object-contain" loading="eager" />
            </div>
            <p className="willem-kicker uppercase text-xs md:text-sm font-semibold mb-5">Voor Willem II commercie · Tilburg</p>
            <h1 className="font-display uppercase font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.96] max-w-5xl">
              Willem II.<br /><span className="text-primary">Meer partners.</span><br />Meer bereik.
            </h1>
            <p className="mt-7 max-w-2xl text-base md:text-xl text-foreground/90 leading-relaxed">
              Wij bouwen een groeimachine voor zakelijke kansen in Midden-Brabant.
              Willem II voert de gesprekken. Wij zorgen voor het juiste moment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="willem-cta rounded-sm font-bold uppercase tracking-wide">
                <a href="#contact">Plan een gesprek <ArrowRight className="ml-2 size-4" /></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-sm font-bold uppercase tracking-wide bg-background/20 backdrop-blur-sm">
                <a href="#pricing">Bekijk de prijzen</a>
              </Button>
            </div>
          </div>
        </section>
        <div className="willem-tricolor h-2" aria-hidden="true" />

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <p className="willem-kicker uppercase text-xs font-bold mb-4">01 / De kans</p>
            <h2 className="font-display uppercase font-bold text-3xl md:text-5xl max-w-4xl leading-tight mb-12">De volgende partner zit misschien al om de hoek.</h2>
            <div className="grid md:grid-cols-3 gap-0 border-t border-border">
              {opportunities.map(item => (
                <motion.article key={item.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="py-8 md:pr-10 md:pl-8 first:pl-0 border-b md:border-b-0 md:border-r last:border-r-0 border-border">
                  <span className="font-mono text-primary text-sm">{item.number}</span>
                  <h3 className="font-display uppercase font-bold text-xl md:text-2xl mt-5 mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="willem-deep py-16 md:py-24 text-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <p className="willem-kicker uppercase text-xs font-bold mb-4">02 / De aanpak</p>
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
              <div>
                <h2 className="font-display uppercase font-bold text-3xl md:text-5xl leading-tight mb-6">Met leeuwenmoed. En met data.</h2>
                <p className="text-foreground/75 text-lg leading-relaxed">Geen losse lijst met namen. Een doorlopend systeem dat kansen vindt, activeert en aan het team overdraagt.</p>
              </div>
              <ol className="border-t border-foreground/20">
                {steps.map((step, index) => (
                  <li key={step.label} className="grid grid-cols-[3rem_1fr] sm:grid-cols-[3rem_8rem_1fr] gap-3 py-5 border-b border-foreground/20 items-start">
                    <span className="font-mono text-primary text-sm">0{index + 1}</span>
                    <strong className="font-display uppercase text-lg">{step.label}</strong>
                    <span className="col-start-2 sm:col-start-3 text-foreground/70 text-sm md:text-base">{step.detail}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <p className="willem-kicker uppercase text-xs font-bold mb-4">03 / Bewezen in het voetbal</p>
            <div className="flex flex-wrap items-center gap-5 mb-8">
              <h2 className="font-display uppercase font-bold text-3xl md:text-5xl">De Excelsior-case.</h2>
              <img src="/logos/klanten/excelsior.svg" alt="Excelsior Rotterdam" className="h-14 w-14 object-contain bg-foreground p-2 rounded-full" loading="lazy" />
            </div>
            <p className="max-w-2xl text-muted-foreground text-lg mb-10">Voor Excelsior brengen wij de zakelijke markt in kaart. De cijfers hieronder zijn een case, geen belofte voor Willem II.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
              {metrics.map(metric => (
                <div key={metric.label} className="bg-background px-6 py-8 min-h-40">
                  <p className="font-display font-bold text-4xl md:text-5xl text-primary mb-4">{metric.value}</p>
                  <p className="font-display font-bold uppercase">{metric.label}</p>
                  <p className="text-muted-foreground text-xs mt-1">{metric.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="willem-pricing-brand border-t border-border">
          <PricingSection showPerformancePartnership={false} />
        </div>

        <section id="contact" className="willem-contact scroll-mt-24 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-[1fr_auto] gap-12 items-end">
            <div>
              <p className="uppercase text-xs font-bold mb-4">05 / Aftrap</p>
              <h2 className="font-display uppercase font-bold text-4xl md:text-6xl leading-tight max-w-3xl">Laat zien waar Willem II kan groeien.</h2>
              <p className="text-lg mt-5 max-w-xl">In één gesprek kiezen wij samen de eerste doelgroep en een passende aanpak.</p>
              <div className="flex items-center gap-4 mt-9 mb-6">
                <img src={peterPhoto} alt="Peter Grisel" className="w-14 h-14 rounded-full object-cover" loading="lazy" />
                <div><strong className="block">Peter Grisel</strong><span className="text-sm">B2BGroeiMachine · Rebel Force</span></div>
              </div>
              <Button asChild size="lg" variant="secondary" className="rounded-sm font-bold uppercase">
                <a href="mailto:peter.grisel@rebelforce.nl?subject=Willem%20II%20x%20B2BGroeiMachine">Plan een gesprek <ArrowUpRight className="ml-2 size-4" /></a>
              </Button>
              <a href="mailto:peter.grisel@rebelforce.nl" className="flex items-center gap-2 mt-5 text-sm underline break-all"><Mail className="size-4 shrink-0" />peter.grisel@rebelforce.nl</a>
            </div>
            <img src={crest.url} alt="" aria-hidden="true" className="hidden lg:block h-52 w-32 object-contain" loading="lazy" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WillemIiPage;
