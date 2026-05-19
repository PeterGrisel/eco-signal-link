import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, Target } from "lucide-react";
import { sectors } from "@/data/sectors";
import { solutions } from "@/data/solutions";
import { trackCTA } from "@/lib/tracking";

const clients = [
  { name: "Krak de Rijder", url: "https://www.krakderijder.nl/", domain: "krakderijder.nl" },
  { name: "Excelsior Rotterdam", url: "https://excelsiorrotterdam.nl/", domain: "excelsiorrotterdam.nl" },
  { name: "Core Vision", url: "https://www.core-vision.nl/", domain: "core-vision.nl" },
  { name: "GoBytes", url: "https://gobytes.nl/", domain: "gobytes.nl" },
  { name: "Nexer", url: "https://nexer.nl/", domain: "nexer.nl" },
  { name: "Rebel Force", url: "https://www.rebelforce.nl/", domain: "rebelforce.nl" },
  { name: "Exes Engineering", url: "https://exesengineering.nl/", domain: "exesengineering.nl" },
  { name: "Datahub", url: "https://datahub.nl/", domain: "datahub.nl" },
  { name: "Drivewise Lease", url: "https://www.drivewiselease.nl/", domain: "drivewiselease.nl" },
  { name: "Sascha del Sal", url: "https://saschadelsal.com/", domain: "saschadelsal.com" },
  { name: "HappyBase", url: "https://www.happybase.me/", domain: "happybase.me" },
  { name: "RTC Group", url: "https://www.rtc-group.nl/", domain: "rtc-group.nl" },
  { name: "Yaskawa", url: "https://www.yaskawa.nl/", domain: "yaskawa.nl" },
  { name: "ThriveOS", url: "https://thriveos.nl/", domain: "thriveos.nl" },
  { name: "Eurofast", url: "https://eurofastgroup.nl/", domain: "eurofastgroup.nl" },
  { name: "Leister Benelux", url: "https://www.leister.com/", domain: "leister.com" },
];

const StreamsSection = () => {
  return (
    <section id="doelgroepen" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Eén systeem. Elke sector.
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Werkt in
            <br />
            <span className="text-gradient">elke branche.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Dezelfde aanpak, afgestemd op uw markt. Van profvoetbal tot engineering:
            wij weten hoe we uw doelgroep bereiken.
          </p>
        </motion.div>

        {/* Marketing-driven vs Sales-driven */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
            <p className="text-xs font-display uppercase tracking-[0.25em] text-muted-foreground">
              Twee routes, één systeem
            </p>
            <p className="text-sm text-muted-foreground/80 max-w-md text-right">
              Elk bedrijf kiest de route die past bij product, dealgrootte en doelgroep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
            {/* Marketing-driven */}
            <div className="bg-card p-7 md:p-9 group hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-muted-foreground/70 tracking-widest">
                  ROUTE A
                </span>
                <Megaphone className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-primary/80 mb-2">
                Marketing-driven
              </p>
              <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-4 leading-tight">
                Klanten komen naar u toe.
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Inbound: content, SEO en advertenties trekken vraag aan. Past bij een breed
                aanbod, kortere salescycli en producten die mensen actief zoeken.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground/85">Vraag is aanwezig en zoekbaar</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground/85">Brede doelgroep, meerdere beslissers</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground/85">Schaal via aandacht en autoriteit</span>
                </li>
              </ul>
            </div>

            {/* Sales-driven */}
            <div className="bg-card p-7 md:p-9 group hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-muted-foreground/70 tracking-widest">
                  ROUTE B
                </span>
                <Target className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-primary/80 mb-2">
                Sales-driven
              </p>
              <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-4 leading-tight">
                U gaat naar de klant toe.
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Outbound: signalen, lijsten en gerichte gesprekken. Past bij niche-aanbod,
                hogere dealwaarde en doelgroepen die niet actief zoeken.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground/85">Beperkte, scherp af te bakenen markt</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground/85">Hogere dealwaarde, langere cyclus</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground/85">Schaal via signalen en timing</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-muted-foreground/80 mt-5 text-center">
            Veel klanten combineren beide. Wij helpen u kiezen wat past — en bouwen het proces eronder.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {sectors.map((sector, i) => (
            <motion.a
              key={sector.slug}
              href={`/sectoren/${sector.slug}`}
              onClick={() => trackCTA(`Streams — Sector: ${sector.title}`, `/sectoren/${sector.slug}`)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border border-glow rounded-lg p-6 md:p-8 hover:border-primary/30 transition-colors group"
            >
              <sector.icon className="w-8 h-8 text-primary mb-5" />
              <h3 className="font-display font-bold text-xl mb-3 group-hover:text-primary transition-colors">{sector.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{sector.description}</p>
            </motion.a>
          ))}
        </div>

        {/* Client squares */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 mb-6"
        >
          <p className="text-xs font-display uppercase tracking-[0.25em] text-muted-foreground mb-5">
            Werkt voor:
          </p>
          <div className="flex flex-wrap gap-3">
            {clients.map((client, i) => (
              <motion.a
                key={client.name}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA(`Streams — Client: ${client.name}`, client.url)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex items-center gap-3 px-5 py-3.5 rounded-lg border border-glow bg-secondary/40 hover:border-primary/40 hover:bg-secondary/70 transition-all group"
                title={client.name}
              >
                <img
                  src={`https://www.google.com/s2/favicons?domain=${client.domain}&sz=64`}
                  alt={client.name}
                  className="w-7 h-7 rounded-sm object-contain"
                  loading="lazy"
                />
                <span className="text-base font-display font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  {client.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 md:p-8 rounded-xl border border-border bg-secondary/30"
        >
          <p className="text-muted-foreground mb-4">
            Dezelfde uitdagingen, ongeacht uw branche? Bekijk onze oplossingen:
          </p>
          <div className="flex flex-wrap gap-3">
            {solutions.slice(0, 5).map((sol) => (
              <Link
                key={sol.slug}
                to={`/solutions/${sol.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
              >
                {sol.title}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StreamsSection;
