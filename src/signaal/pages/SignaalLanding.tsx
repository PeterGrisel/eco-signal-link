import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Target, BarChart3, Clock, Brain, Layers, Shield, ChevronRight, FileText, Bot, RefreshCw, Wrench, CalendarCheck, LayoutDashboard } from "lucide-react";
import SignaalLayout from "../components/SignaalLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TOOLS = ["Apollo", "HubSpot", "LinkedIn", "Clay", "Instantly", "40+ andere tools"];

const CLIENTS = [
  { name: "Excelsior Rotterdam", domain: "excelsiorrotterdam.nl" },
  { name: "Core Vision", domain: "core-vision.nl" },
  { name: "GoBytes", domain: "gobytes.nl" },
  { name: "Nexer", domain: "nexer.nl" },
  { name: "Exes Engineering", domain: "exesengineering.nl" },
  { name: "Drivewise Lease", domain: "drivewiselease.nl" },
  { name: "HappyBase", domain: "happybase.me" },
  { name: "RTC Group", domain: "rtc-group.nl" },
  { name: "Yaskawa", domain: "yaskawa.nl" },
  { name: "ThriveOS", domain: "thriveos.nl" },
  { name: "Krak de Rijder", domain: "krakderijder.nl" },
];

const PAIN_POINTS = [
  { icon: Clock, title: "Uren verspild aan koud bellen", desc: "U belt prospects die niet klaar zijn. Uw team raakt gedemotiveerd." },
  { icon: Target, title: "Geen idee wie klaar is om te kopen", desc: "U mist koopsignalen. Uw concurrent pikt ze op." },
  { icon: BarChart3, title: "Pipeline onvoorspelbaar", desc: "De ene maand vol, de andere leeg. Geen systeem, geen controle." },
];

const STEPS = [
  { num: "01", title: "Definieer uw ICP", desc: "Bepaal precies wie uw ideale klant is. Geen vage persona's, maar concrete criteria." },
  { num: "02", title: "Stel signaalgewichten in", desc: "Welke koopsignalen zijn het belangrijkst? Functiewissel, groei, websitebezoek?" },
  { num: "03", title: "Kies uw bronnen", desc: "LinkedIn, CRM, intent data. U kiest wat past bij uw markt." },
  { num: "04", title: "Bouw detectieregels", desc: "Automatische scoring die prospects rangschikt op koopbereidheid." },
  { num: "05", title: "Stel drempelwaarden in", desc: "Bepaal wanneer een prospect 'heet' genoeg is voor actie." },
  { num: "06", title: "Ontwerp uw respons", desc: "Multichannel outreach die aansluit bij het signaal. Persoonlijk, relevant, op tijd." },
  { num: "07", title: "Activeer het systeem", desc: "Uw blueprint is compleet. Het systeem draait. U plukt de vruchten." },
];

const RESULTS = [
  { metric: "3×", label: "hogere response rate dan koud outreach" },
  { metric: "70%", label: "minder tijd kwijt aan onkwalificeerde prospects" },
  { metric: "4 weken", label: "van start tot operationeel systeem" },
];

const FAQS = [
  { q: "Heb ik technische kennis nodig?", a: "Nee. De journey leidt u stap voor stap door het proces. Elke laag bevat uitleg, voorbeelden en een quiz om te controleren of u het begrijpt." },
  { q: "Hoe lang duurt het om mijn blueprint te bouwen?", a: "Gemiddeld 90 minuten. U kunt pauzeren en later verdergaan. Uw voortgang wordt opgeslagen." },
  { q: "Welke tools heb ik nodig?", a: "Geen. Het systeem is tool-agnostisch. U leert de principes en past ze toe op uw bestaande stack, of u kiest nieuwe tools." },
  { q: "Wat krijg ik aan het einde?", a: "Een compleet blueprint met ICP-definitie, signaalgewichten, detectieregels, drempelwaarden en responsstrategieën. Plus: een AI-strategieagent, PDF-export, installatie-checklist per tool, een 90-daagse review checklist en onbeperkt hergebruik via Fork & Edit." },
  { q: "Wat kost het?", a: "€97 eenmalig. Geen abonnement, geen verborgen kosten. U krijgt direct toegang tot alle 7 lagen, de AI-assistent, uw persoonlijke blueprint, installatie-checklists en onbeperkt nieuwe signalen." },
  { q: "Kan ik een terugbetaling krijgen?", a: "Ja. Bent u niet tevreden? Dan krijgt u uw geld terug. Zonder vragen." },
];

const SignaalLanding = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex items-center pt-14 md:pt-20 overflow-hidden">
        <div className="absolute inset-0 glow-bg pointer-events-none" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left */}
            <div className="flex-1 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono tracking-wider mb-6">
                  SIGNAAL DETECTIESYSTEEM
                </span>
                <h1 className="font-display font-bold text-[2.75rem] md:text-[4.5rem] lg:text-[5rem] leading-[1.05] tracking-tighter mb-6">
                  Stop met zoeken.
                  <br />
                  <span className="text-gradient">Begin met detecteren.</span>
                </h1>
                <p className="text-muted-foreground text-base md:text-xl max-w-xl mb-8 leading-relaxed">
                  Bouw het systeem dat prospects vindt op het moment dat ze klaar zijn.
                  Niet wanneer u tijd heeft. In 90 minuten, voor €97.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <Link
                    to="/signaal/start"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg text-base font-medium hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all font-body group relative"
                  >
                    <span className="absolute inset-0 rounded-lg bg-primary/20 animate-pulse group-hover:animate-none" />
                    Start voor €97
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-xs text-muted-foreground font-mono">
                    7 lagen · 90 min · Eenmalig €97
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  {["Tool-agnostisch", "Direct toepasbaar", "Bewezen methode"].map((item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Layer preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full max-w-sm lg:max-w-md"
            >
              <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl p-5 shadow-2xl">
                <p className="font-mono text-[10px] tracking-widest text-primary/60 uppercase mb-4">
                  Uw Blueprint · 7 Lagen
                </p>
                {STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-3 py-2.5 px-3 mb-1 rounded-lg bg-background/50 border border-border/40"
                  >
                    <span className="font-mono text-xs text-primary w-6 shrink-0">{step.num}</span>
                    <span className="text-xs text-foreground/80 font-body">{step.title}</span>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${[100, 85, 70, 55, 40, 25, 10][i]}%` }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
                      className="ml-auto h-1 rounded-full bg-primary/30 max-w-[60px]"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ── Client logos ── */}
      <section className="py-10 border-b border-border">
        <div className="container mx-auto px-4 mb-6">
          <p className="text-xs font-display uppercase tracking-[0.25em] text-muted-foreground text-center">
            Dit passen wij ook toe bij
          </p>
        </div>
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex animate-marquee" style={{ width: "max-content" }}>
            {[...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
              <div key={i} className="mx-6 md:mx-10 shrink-0 flex items-center gap-2.5 select-none whitespace-nowrap">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${client.domain}&sz=64`}
                  alt={client.name}
                  className="w-6 h-6 rounded-sm"
                  loading="lazy"
                />
                <span className="text-sm font-display font-semibold text-foreground/50">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pain points ── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
              Het probleem
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              Herkenbaar?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              De meeste B2B-teams jagen op leads zonder systeem. Het resultaat: frustratie, verspilde tijd en een lege pipeline.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <point.icon className="w-8 h-8 text-primary/70 mb-4" />
                <h3 className="font-display font-semibold text-base mb-2 text-foreground">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution: How it works ── */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
              De oplossing
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              7 lagen. 1 systeem.{" "}
              <span className="text-gradient">Uw blueprint.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              U leert waarom elk onderdeel cruciaal is, configureert het voor uw markt en bouwt een compleet detectiesysteem.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-4 mb-2"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="font-mono text-sm font-bold text-primary">{step.num}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-border my-1" />
                  )}
                </div>
                <div className="pb-6">
                  <h3 className="font-display font-semibold text-base text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/signaal/start"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg text-base font-medium hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all font-body"
            >
              Start voor €97
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Signal pyramid ── */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Het principe
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">
                De Signaal Piramide
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Niet elke prospect is gelijk. Het systeem scoort elk bedrijf op basis van koopsignalen en prioriteert automatisch wie het eerst benaderd wordt.
              </p>
              <div className="space-y-3">
                {[
                  { label: "Heet", range: "≥40 punten", desc: "Direct actie. Hoge koopintentie gedetecteerd." },
                  { label: "Warm", range: "20–39 punten", desc: "Nurture-track. Interesse, maar nog niet klaar." },
                  { label: "Koud", range: "<20 punten", desc: "Monitoren. Wacht op het juiste moment." },
                ].map((tier) => (
                  <div key={tier.label} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <span className="font-mono text-sm font-semibold text-foreground">{tier.label}</span>
                      <span className="text-muted-foreground text-sm ml-2">({tier.range})</span>
                      <p className="text-sm text-muted-foreground">{tier.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full max-w-xs">
              <div className="space-y-2">
                {[
                  { zone: "HEET", width: "w-1/3", opacity: "" },
                  { zone: "WARM", width: "w-2/3", opacity: "opacity-60" },
                  { zone: "KOUD", width: "w-full", opacity: "opacity-25" },
                ].map((tier) => (
                  <div
                    key={tier.zone}
                    className={`${tier.width} mx-auto py-4 rounded-lg border border-primary/20 flex items-center justify-center bg-primary/10 ${tier.opacity}`}
                  >
                    <span className="font-mono text-sm font-bold text-primary">{tier.zone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
              Resultaten
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              Signalen werken.{" "}
              <span className="text-gradient">De cijfers bewijzen het.</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6">
            {RESULTS.map((r, i) => (
              <motion.div
                key={r.metric}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-xl bg-card border border-border"
              >
                <p className="font-display font-bold text-4xl md:text-5xl text-primary mb-2">{r.metric}</p>
                <p className="text-sm text-muted-foreground">{r.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three pillars ── */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
              De methode
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              Leer. Configureer. Activeer.
            </h2>
          </motion.div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "Leer waarom", desc: "Universele principes die onder elk succesvol prospecting systeem liggen. Onafhankelijk van tooling." },
              { icon: Layers, title: "Bepaal wat", desc: "Uw markt, uw ICP, uw signalen. Elke keuze wordt onderdeel van uw persoonlijke blueprint." },
              { icon: Zap, title: "Kies hoe", desc: "Tool-agnostische executie. Van Apollo tot Clay. U kiest wat past bij uw stack." },
            ].map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <col.icon className="w-8 h-8 text-primary/70 mb-4" />
                <h3 className="font-display font-semibold text-lg text-foreground mb-3">{col.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{col.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4 text-center">
              Veelgestelde vragen
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-center mb-12">
              Alles wat u wilt <span className="text-gradient">weten</span>
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-display font-semibold text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 md:py-32 relative">
        <div className="absolute inset-0 glow-bg pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
              Klaar om uw
              <br />
              prospecting te
              <br />
              <span className="text-gradient">automatiseren?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Eenmalig €97. Bouw uw blueprint in 90 minuten.
              Geen abonnement. Geen verborgen kosten.
            </p>
            <Link
              to="/signaal/start"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg text-base font-medium hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all font-body group relative"
            >
              <span className="absolute inset-0 rounded-lg bg-primary/20 animate-pulse group-hover:animate-none" />
              Start voor €97
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-muted-foreground text-sm mt-6">
              Eenmalig €97 · Geen abonnement · Direct toegang
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SignaalLanding;
