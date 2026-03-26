import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import Footer from "@/components/Footer";
import LogoTicker from "@/components/LogoTicker";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/ui/button";

import teamMember1 from "@/assets/team-member-1.jpg";
import teamMember2 from "@/assets/team-member-2.jpg";
import teamMember3 from "@/assets/team-member-3.jpg";
import teamMember4 from "@/assets/team-member-4.jpg";
import teamMember5 from "@/assets/team-member-5.jpg";
import teamMember6 from "@/assets/team-member-6.jpg";
import teamMember7 from "@/assets/team-member-7.jpg";
import teamMember8 from "@/assets/team-member-8.jpg";
import teamMember9 from "@/assets/team-member-9.jpg";
import teamMember10 from "@/assets/team-member-10.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

/* ─── HERO floating photos ─── */
const heroPhotos = [
  { src: teamMember8, label: "Copywriter", top: "10%", left: "6%", rotate: -5, size: "lg" },
  { src: teamMember2, label: "Data Analist", top: "6%", left: "24%", rotate: 3, size: "md" },
  { src: teamMember4, label: "AI Engineer", top: "4%", right: "22%", rotate: -2, size: "lg" },
  { src: teamMember1, label: "Outbound Lead", top: "8%", right: "4%", rotate: 4, size: "md" },
  { src: teamMember3, label: "Strateeg", top: "52%", left: "3%", rotate: 2, size: "md" },
  { src: teamMember5, label: "Growth Hacker", top: "48%", left: "20%", rotate: -3, size: "sm" },
  { src: teamMember6, label: "Account Manager", top: "46%", right: "18%", rotate: 3, size: "sm" },
  { src: teamMember7, label: "Sales Dev", top: "50%", right: "2%", rotate: -4, size: "md" },
];

const sizeClasses: Record<string, string> = {
  sm: "w-20 h-24 xl:w-24 xl:h-28",
  md: "w-28 h-32 xl:w-32 xl:h-36",
  lg: "w-32 h-36 xl:w-40 xl:h-44",
};

/* ─── Orbit labels for "Rebel" section ─── */
const orbitRoles = [
  { label: "Data Specialist", color: "text-primary", angle: -30 },
  { label: "AI Engineer", color: "text-blue-400", angle: 30 },
  { label: "Outbound Lead", color: "text-purple-400", angle: 150 },
  { label: "Strateeg", color: "text-emerald-400", angle: 210 },
  { label: "Growth Hacker", color: "text-amber-400", angle: 330 },
];

/* ─── Map orbit labels ─── */
const mapRoles = [
  { label: "Web Designer", color: "text-rose-400", x: "30%", y: "8%" },
  { label: "Data Analist", color: "text-primary", x: "8%", y: "42%" },
  { label: "Strateeg", color: "text-purple-400", x: "52%", y: "78%" },
  { label: "Account Manager", color: "text-blue-400", x: "72%", y: "22%" },
];

/* ─── Grid items: photos + stat blocks ─── */
const allPhotos = [
  teamMember1, teamMember2, teamMember3, teamMember4,
  teamMember5, teamMember6, teamMember7, teamMember8, teamMember9, teamMember10,
];

type GridItem =
  | { type: "photo"; src: string }
  | { type: "stat"; value: string; label: string };

const gridItems: GridItem[] = [
  { type: "photo", src: allPhotos[0] },
  { type: "stat", value: "15+", label: "jaar\nervaring" },
  { type: "photo", src: allPhotos[1] },
  { type: "photo", src: allPhotos[2] },
  { type: "photo", src: allPhotos[3] },
  { type: "photo", src: allPhotos[4] },
  { type: "photo", src: allPhotos[5] },
  { type: "photo", src: allPhotos[6] },
  { type: "stat", value: "4", label: "merken in\nhet ecosysteem" },
  { type: "photo", src: allPhotos[7] },
  { type: "photo", src: allPhotos[8] },
  { type: "stat", value: "50+", label: "klanten\nbediend" },
  { type: "photo", src: allPhotos[9] },
  { type: "photo", src: allPhotos[8] },
  { type: "stat", value: "3", label: "landen\nactief" },
];

const OnsTeam = () => {
  usePageMeta({
    title: "Ons Team — B2BGroeiMachine",
    description:
      "Maak kennis met de experts achter B2BGroeiMachine. Van strategie tot AI — ons team bouwt systemen die structureel B2B groei opleveren.",
    canonical: "https://b2bgroeimachine.io/ons-team",
  });

  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://b2bgroeimachine.io/" },
            { name: "Ons Team", url: "https://b2bgroeimachine.io/ons-team" },
          ]}
        />
        <Navbar />

        {/* ════════ 1. HERO — floating photos ════════ */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16 overflow-hidden">
          {/* subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,hsl(var(--primary)/0.10),transparent_70%)] pointer-events-none" />

          {/* floating photos — desktop only */}
          <div className="absolute inset-0 hidden lg:block">
            {heroPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                className="absolute"
                style={{
                  top: photo.top,
                  left: (photo as any).left,
                  right: (photo as any).right,
                }}
              >
                <div style={{ transform: `rotate(${photo.rotate}deg)` }}>
                  <div
                    className={`${sizeClasses[photo.size]} rounded-xl overflow-hidden border border-border/40 bg-card shadow-lg`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.label}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  {/* label badge */}
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 border border-border bg-card/90 backdrop-blur-sm text-foreground text-[11px] font-display font-semibold px-3 py-1 rounded-md whitespace-nowrap flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: `hsl(${(i * 47 + 24) % 360} 70% 60%)`,
                      }}
                    />
                    {photo.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* center text */}
          <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6"
            >
              <span className="text-primary">Experts</span> die
              <br />
              groei bouwen
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-8"
            >
              Een compact team van specialisten in data, AI en outbound. Samen
              bouwen we systemen die structureel groeien.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button variant="hero" size="lg" asChild>
                <a
                  href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plan een kennismaking →
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* logo ticker */}
        <LogoTicker />

        {/* ════════ 2. WHAT MAKES A REBEL — orbit visual ════════ */}
        <section className="py-28 border-t border-border overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* text */}
              <motion.div {...fadeUp}>
                <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-8">
                  Wat een <span className="text-primary">Rebel</span> maakt
                </h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed text-[15px]">
                  <p>
                    We werken niet met stagiaires of freelancers die toevallig
                    beschikbaar zijn. Elk teamlid is geselecteerd op diepgaande
                    kennis, bewezen resultaat en een onvermoeibare drive om
                    klanten écht vooruit te helpen.
                  </p>
                  <p>
                    Onze aanpak is niet passief. We zoeken actief de beste
                    specialisten in data, AI, sales en marketing. Vervolgens
                    zetten we ze door een streng selectieproces. Alleen de beste
                    komen door de deur.
                  </p>
                  <p>
                    Dat betekent dat u toegang krijgt tot top-talent dat normaal
                    voorbehouden is aan grote corporates — maar dan met de
                    wendbaarheid en betrokkenheid van een klein team.
                  </p>
                </div>
              </motion.div>

              {/* orbit visual */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative flex items-center justify-center"
              >
                <div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px]">
                  {/* outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-muted-foreground/40" />
                  {/* inner ring */}
                  <div className="absolute inset-10 rounded-full border border-muted-foreground/25" />

                  {/* center stat */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-bold text-5xl md:text-6xl text-foreground">
                      15+
                    </span>
                    <span className="text-muted-foreground text-sm mt-1">
                      experts
                    </span>
                  </div>

                  {/* orbiting avatars */}
                  {[teamMember1, teamMember3, teamMember5, teamMember7, teamMember9].map(
                    (src, i) => {
                      const angle = (i * 72 - 90) * (Math.PI / 180);
                      const radius = 48;
                      const x = 50 + radius * Math.cos(angle);
                      const y = 50 + radius * Math.sin(angle);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                          className="absolute w-12 h-12 rounded-full overflow-hidden border-2 border-border/50 shadow-lg"
                          style={{
                            top: `${y}%`,
                            left: `${x}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <img
                            src={src}
                            alt="Team member"
                            className="w-full h-full object-cover grayscale"
                            loading="lazy"
                          />
                        </motion.div>
                      );
                    }
                  )}

                  {/* role labels */}
                  {orbitRoles.map((role, i) => {
                    const angle = role.angle * (Math.PI / 180);
                    const radius = 55;
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    return (
                      <motion.span
                        key={role.label}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                        className={`absolute text-[11px] font-display font-semibold border border-border/40 bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-md whitespace-nowrap ${role.color}`}
                        style={{
                          top: `${y}%`,
                          left: `${x}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {role.label}
                      </motion.span>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════ 3. MAP / GLOBE — atom-style ════════ */}
        <section className="py-28 border-t border-border overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* atom visual */}
              <motion.div
                {...fadeUp}
                className="relative flex items-center justify-center order-2 md:order-1"
              >
                <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px]">
                  {/* elliptical orbits */}
                  <svg
                    viewBox="0 0 400 400"
                    className="absolute inset-0 w-full h-full"
                    fill="none"
                  >
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="180"
                      ry="100"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="1.5"
                      opacity="0.35"
                      transform="rotate(-30 200 200)"
                    />
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="170"
                      ry="90"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="1.2"
                      opacity="0.25"
                      transform="rotate(30 200 200)"
                    />
                    <ellipse
                      cx="200"
                      cy="200"
                      rx="160"
                      ry="80"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="1"
                      opacity="0.2"
                      transform="rotate(90 200 200)"
                    />
                  </svg>

                  {/* center logo mark */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display font-black text-4xl text-primary tracking-tighter">
                      RF<span className="text-foreground text-lg font-medium align-super ml-0.5">×AI</span>
                    </span>
                  </div>

                  {/* floating role labels */}
                  {mapRoles.map((role, i) => (
                    <motion.span
                      key={role.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                      className={`absolute text-[11px] font-display font-semibold border border-border/40 bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-md whitespace-nowrap ${role.color} flex items-center gap-1.5`}
                      style={{ top: role.y, left: role.x }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: "currentColor",
                        }}
                      />
                      {role.label}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* text */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 md:order-2"
              >
                <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-8">
                  Talent vanuit{" "}
                  <span className="text-primary">elke hoek</span>
                  <br />
                  van de markt
                </h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed text-[15px]">
                  <p>
                    Rebel Force is geboren als remote-first organisatie. Terwijl
                    andere bureaus worstelden met thuiswerken, hadden wij onze
                    processen al lang geoptimaliseerd.
                  </p>
                  <p>
                    Dat betekent dat we niet gebonden zijn aan één locatie. We
                    werken met de beste specialisten — ongeacht waar ze zitten.
                    Van Nederland tot Amerika, van data-experts tot AI-engineers.
                  </p>
                  <p>
                    Het resultaat: een team dat de wendbaarheid heeft van
                    freelancers, maar de structuur en betrouwbaarheid van een
                    vast bureau.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════ 4. SMOELENBOEK — photo grid + stats ════════ */}
        <section className="py-28 border-t border-border">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="text-center mb-16">
              <h2 className="font-display font-bold text-3xl md:text-5xl">
                De <span className="italic">(AI)</span> experts achter
                <br />
                <span className="text-primary">uw groei</span> 😉
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 max-w-6xl mx-auto">
              {gridItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="aspect-[4/5] rounded-2xl overflow-hidden"
                >
                  {item.type === "photo" ? (
                    <div className="relative w-full h-full group/photo">
                      <img
                        src={item.src}
                        alt="Team member"
                        loading="lazy"
                        width={512}
                        height={640}
                        className="w-full h-full object-cover grayscale group-hover/photo:grayscale-0 transition-all duration-500"
                      />
                      {/* Hover overlay with RF × AI branding */}
                      <div className="absolute inset-0 bg-primary/0 group-hover/photo:bg-primary/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover/photo:opacity-100">
                        <span className="font-display font-black text-2xl text-white/90 tracking-tight drop-shadow-lg">
                          RF<span className="text-xs font-medium align-super ml-0.5 opacity-80">×AI</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-card border border-border flex flex-col justify-center px-5 rounded-2xl">
                      <span className="font-display font-bold text-3xl md:text-4xl text-foreground">
                        {item.value}
                      </span>
                      <span className="text-primary text-sm font-medium mt-2 whitespace-pre-line leading-snug">
                        {item.label}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ CTA ════════ */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
                Wil je met ons{" "}
                <span className="text-primary">samenwerken</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Plan een vrijblijvend gesprek en ontdek hoe ons team uw groei
                kan versnellen.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a
                  href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plan een Gesprek →
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageLoader>
  );
};

export default OnsTeam;
