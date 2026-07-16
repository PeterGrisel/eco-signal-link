import { motion } from "framer-motion";
import {
  ArrowRight, Check, Heart, Users, Euro, Calendar, Target, ListChecks,
  Mail, UserCheck, TrendingUp, Cpu, Search, Handshake, Rocket, ShieldCheck, MapPin, Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

const HCM = {
  primary: "#E8945A", // BGM orange (brand accent)
  glow: "#F5B67E",
  navy: "#0B1220",
};

const whatYouGet = [
  { icon: Target, title: "Scherp klantprofiel", desc: "We stellen samen uw ideale klantprofiel en doelgroep scherp." },
  { icon: ListChecks, title: "Relevante leadlijsten", desc: "We vinden en verrijken bedrijven en contactpersonen met data." },
  { icon: Mail, title: "Outreach op maat", desc: "Slimme campagnes via e-mail, LinkedIn en opvolging." },
  { icon: UserCheck, title: "Warme overdracht", desc: "Gekwalificeerde kansen gaan naar uw salesteam." },
  { icon: TrendingUp, title: "Maandelijkse optimalisatie", desc: "We sturen bij op basis van campagnes, data en opvolging." },
  { icon: Cpu, title: "AI in sales", desc: "Praktische inzet van AI in uw commerciële proces." },
];

const steps = [
  { n: "01", title: "U neemt een dienst af", desc: "We starten met uw commerciële doelen, doelgroep en huidige salesaanpak." },
  { n: "02", title: "Wij bouwen de funnel", desc: "Data, campagnes, AI-workflows en opvolging worden ingericht en beheerd." },
  { n: "03", title: "Sales krijgt warme kansen", desc: "Interesse en gekwalificeerde leads gaan direct naar uw salesteam." },
  { n: "04", title: "20% naar HCM Arnhem", desc: "Van uw maandelijkse investering gaat 20% rechtstreeks naar de club." },
  { n: "05", title: "Zichtbaarheid op de club", desc: "Uw logo staat op partneruitingen, schermen en doeken bij HCM Arnhem." },
];

const sectors = [
  "Zakelijke dienstverlening", "Techniek en installatie", "Bouw en vastgoed",
  "IT en software", "Consultancy", "Recruitment en detachering",
  "Groothandel", "Logistiek", "Industrie",
  "Marketing en communicatie", "Financiële dienstverlening", "Professionele dienstverlening",
];

const wins = [
  { icon: Rocket, title: "Uw bedrijf groeit", desc: "Een beheerde digitale salesfunnel met AI. Meer relevante leads, betere opvolging en warme kansen." },
  { icon: Heart, title: "HCM Arnhem groeit", desc: "20% van uw maandelijkse investering gaat naar HCM Arnhem als structurele sponsorbijdrage." },
  { icon: Search, title: "Uw zichtbaarheid groeit", desc: "Uw logo verschijnt op partneruitingen, schermen en doeken bij de club." },
  { icon: MapPin, title: "De regio groeit", desc: "Lokale ondernemers, sport en jong talent worden met elkaar verbonden." },
];

const faqs = [
  {
    q: "Is dit sponsoring of een dienst?",
    a: "U neemt een dienst af bij B2B Groeimachine. Wij leveren een beheerde B2B-salesfunnel met AI. Komt uw bedrijf uit regio Arnhem? Dan dragen wij 20% van uw maandelijkse investering af aan HCM Arnhem. Daarnaast wordt uw bedrijf zichtbaar als partner van de club.",
  },
  {
    q: "Krijgt mijn bedrijf zichtbaarheid bij HCM Arnhem?",
    a: "Ja. Uw logo wordt meegenomen in partnerzichtbaarheid, zoals schermen en doeken bij HCM Arnhem. Dit zorgt voor extra impressies bij leden, ouders, bezoekers, ondernemers en het lokale netwerk.",
  },
  {
    q: "Moet ik een jaarcontract afsluiten?",
    a: "Nee. De samenwerking start met een minimale periode van 90 dagen. Daarna is deze maandelijks opzegbaar.",
  },
  {
    q: "Wat is de minimale investering?",
    a: "De dienst is beschikbaar vanaf € 1.500 per maand.",
  },
  {
    q: "Wat krijgt HCM Arnhem?",
    a: "HCM Arnhem ontvangt 20% van uw maandelijkse investering als structurele sponsorbijdrage. Bij € 1.500 per maand betekent dit € 300 per maand voor de club.",
  },
];

const HcmArnhemPage = () => {
  usePageMeta({
    title: "HCM Arnhem × B2B Groeimachine — Groei met AI, versterk de club",
    description: "Neem een B2B Sales AI-dienst af bij B2B Groeimachine. Komt uw bedrijf uit regio Arnhem? Dan sponsoren wij 20% van uw maandelijkse investering aan HCM Arnhem.",
    canonical: "https://www.b2bgroeimachine.io/hcm-arnhem",
    themeColor: HCM.primary,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute -top-40 -right-32 w-[640px] h-[640px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${HCM.primary} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${HCM.glow} 0%, transparent 70%)` }}
        />

        <div className="container mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-20 md:pb-28 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-6"
            >
              HCM Arnhem × B2B Groeimachine
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-6"
            >
              Groei met AI.<br />
              <span style={{ color: HCM.primary }}>Versterk HCM Arnhem.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8"
            >
              Word partner van HCM Arnhem en bouw tegelijk aan een moderne B2B-salesmachine.
              Komt uw bedrijf uit regio Arnhem? Dan sponsoren wij 20% van uw maandelijkse
              investering rechtstreeks aan de club.
            </motion.p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                Plan een kennismaking <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#hoe"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted/40 transition"
              >
                Zo werkt het
              </a>
            </div>

            {/* Deal card */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur p-6 md:p-8 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
                Vanaf
              </p>
              <p className="font-display text-3xl md:text-4xl font-bold mb-4">
                € 1.500 <span className="text-base font-normal text-muted-foreground">per maand</span>
              </p>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-3">
                  <Heart className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>20% naar HCM Arnhem</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>Vanaf € 300 per maand naar de club</span>
                </li>
                <li className="flex items-start gap-3">
                  <Euro className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>Vanaf € 3.600 per jaar clubbijdrage per partner</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>Minimaal 90 dagen, daarna maandelijks opzegbaar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NIEUWE VORM VAN PARTNERSCHAP */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
            Een nieuwe vorm van lokaal partnerschap
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-6">
            Traditionele sponsoring is vaak alleen een kostenpost.
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-10">
            Een logo op een bord, een bijdrage aan de club en daarna hopen dat het iets oplevert.
            Wij doen het anders. U neemt een concrete commerciële groeidienst af. Tegelijk dragen wij
            20% van uw maandelijkse investering af aan HCM Arnhem.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Commerciële groei", desc: "Meer structuur, meer commerciële activiteit en meer relevante kansen voor sales." },
              { title: "Structurele steun", desc: "Een vast percentage van uw investering gaat rechtstreeks naar HCM Arnhem." },
              { title: "Lokale zichtbaarheid", desc: "Uw bedrijf wordt zichtbaar als betrokken partner in het netwerk van de club." },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card/50 p-6"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WAT KRIJGT U */}
      <section className="py-20 md:py-28 border-b border-border bg-card/20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
              Wat krijgt u concreet?
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              Een beheerde B2B-salesfunnel met AI.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Als partner krijgt u toegang tot B2B Groeimachine én wordt uw bedrijf meegenomen in
              de partnerzichtbaarheid van HCM Arnhem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whatYouGet.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-background p-6 hover:border-primary/40 transition"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Zichtbaarheid */}
          <div className="mt-14 rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-10">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl md:text-2xl mb-2">
                  Zichtbaarheid als partner van HCM Arnhem
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Uw deelname maakt u automatisch onderdeel van het HCM-partnernetwerk. Uw bedrijf
                  krijgt zichtbaarheid via:
                </p>
                <ul className="grid md:grid-cols-2 gap-2 text-sm">
                  {[
                    "Logovermelding als deelnemende partner",
                    "Zichtbaarheid op schermen bij HCM Arnhem",
                    "Zichtbaarheid op doeken en partneruitingen",
                    "Impressies bij leden, ouders, bezoekers en ondernemers",
                    "Koppeling aan een sterk lokaal sportnetwerk",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZO WERKT HET */}
      <section id="hoe" className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
              Zo werkt het
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              Vijf stappen. Eén werkende samenwerking.
            </h2>
          </div>

          <div className="space-y-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex gap-5 items-start rounded-2xl border border-border bg-card/40 p-5 md:p-6 hover:border-primary/40 transition"
              >
                <div
                  className="font-display font-bold text-2xl md:text-3xl shrink-0 w-14 text-right"
                  style={{ color: HCM.primary }}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg md:text-xl mb-1">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VOOR WIE */}
      <section className="py-20 md:py-28 border-b border-border bg-card/20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="max-w-3xl mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
              Voor wie is dit interessant?
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              B2B-bedrijven in regio Arnhem met commerciële ambitie.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Vooral bedrijven met een duidelijke doelgroep, salesproces en groeiwens halen veel
              waarde uit deze aanpak.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {sectors.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full border border-border bg-background px-3.5 py-1.5 text-sm text-foreground/80"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WIN-WIN-WIN */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
              Win-win-win
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              Uw bedrijf groeit. De club groeit. De regio groeit.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wins.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card/40 p-6"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <w.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 border-b border-border bg-card/20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
            Veelgestelde vragen
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-10">
            Alles wat u wilt weten.
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-background p-5 md:p-6 open:border-primary/40 transition"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-display font-semibold text-lg">
                  <span>{f.q}</span>
                  <span className="text-primary transition group-open:rotate-45 text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section id="contact" className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div
            className="rounded-3xl border border-primary/40 p-8 md:p-14 relative overflow-hidden"
            style={{
              background: `radial-gradient(120% 120% at 0% 0%, ${HCM.primary}22 0%, transparent 60%), radial-gradient(120% 120% at 100% 100%, ${HCM.glow}18 0%, transparent 60%)`,
            }}
          >
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
                Groei slimmer. Word zichtbaar.
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-5">
                Versterk HCM Arnhem. Groei uw bedrijf.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Neem een dienst af bij B2B Groeimachine. Wij dragen 20% af aan HCM Arnhem, en uw
                merk krijgt extra zichtbaarheid bij de tophockeyclub van Arnhem.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="rounded-xl border border-border bg-background/70 p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Contact</p>
                  <p className="font-display font-bold text-lg">Roderick Roelofs</p>
                  <a
                    href="mailto:roderick.roelofs@rebelforce.nl"
                    className="inline-flex items-center gap-2 mt-2 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" /> roderick.roelofs@rebelforce.nl
                  </a>
                  <a
                    href="tel:+31620516731"
                    className="inline-flex items-center gap-2 mt-1 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" /> 06-20516731
                  </a>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">De deal</p>
                  <p className="font-display font-bold text-lg">Vanaf € 1.500 per maand</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    20% naar HCM Arnhem. Minimaal 90 dagen, daarna maandelijks opzegbaar. Geen jaarcommitment.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:roderick.roelofs@rebelforce.nl?subject=HCM%20Arnhem%20x%20B2B%20Groeimachine"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                >
                  Plan een kennismaking <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted/40 transition"
                >
                  Stel een vraag
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HcmArnhemPage;