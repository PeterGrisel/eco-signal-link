import { motion } from "framer-motion";
import { useState } from "react";
import { 
  ArrowRight, 
  ArrowDown, 
  TrendingUp, 
  Users, 
  Globe, 
  Search, 
  MousePointerClick, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";

// Interactive avatars for "Operators & Logic"
const operators = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120"
];

const ExactHero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openBookingModal();
  };

  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-28 overflow-hidden bg-transparent">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Copywriting & Action */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col items-start text-left"
          >
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-display font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="h-3 w-3 animate-pulse" />
              AI-Native Revenue Systems
            </div>

            {/* Heading */}
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-6">
              Laat omzet groeien zonder <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-amber-400">
                extra headcount.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              B2B Groeimachine bouwt de revenue machine achter sales, marketing en RevOps. 
              Breng signalen, content en outreach samen tot meetings, pipeline en schaalbare groei.
            </p>

            {/* Email + CTA Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex-1 relative">
                <input
                  type="email"
                  required
                  placeholder="Jouw werk e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-card/60 border border-primary/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all text-sm font-display font-medium"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="h-12 px-6 font-display font-semibold">
                Plan een demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>

            {/* Alternative Button */}
            <a
              href="#aanpak"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("aanpak")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 text-sm font-display font-semibold text-muted-foreground hover:text-foreground transition-colors mb-12"
            >
              Bekijk hoe het werkt
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>

            {/* Highlights Bar */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 w-full pt-6 border-t border-primary/10">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="font-display font-bold text-xs md:text-sm text-foreground">AI-native</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="font-display font-bold text-xs md:text-sm text-foreground">In 90 dagen live</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-primary">
                  <Users className="h-3.5 w-3.5" />
                  <span className="font-display font-bold text-xs md:text-sm text-foreground">Zonder extra headcount</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Revenue Engine Diagram (matches reference) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 relative w-full select-none"
          >
            <div className="relative w-full mx-auto" style={{ maxWidth: "680px", aspectRatio: "680 / 715" }}>
              {/* Grid background */}
              <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

              {/* SVG glowing neon connectors */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 680 715"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Connectors from 6 signal tiles converging at engine top (340, 285) */}
                {[
                  "M 60 130 C 60 220, 240 250, 340 285",
                  "M 180 130 C 180 220, 280 255, 340 285",
                  "M 300 130 C 300 215, 325 260, 340 285",
                  "M 380 130 C 380 215, 355 260, 340 285",
                  "M 500 130 C 500 220, 400 255, 340 285",
                  "M 620 130 C 620 220, 440 250, 340 285",
                ].map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    stroke="#E8945A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#neonGlow)"
                    opacity="0.9"
                  />
                ))}
                {/* Engine → Operators (right) */}
                <path
                  d="M 425 360 H 465"
                  stroke="#E8945A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  filter="url(#neonGlow)"
                  opacity="0.9"
                />
                <circle cx="467" cy="360" r="4" fill="#E8945A" filter="url(#neonGlow)" />
                {/* Engine → High-fit account (bottom) */}
                <path
                  d="M 340 435 V 480"
                  stroke="#E8945A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  filter="url(#neonGlow)"
                />
                <circle cx="340" cy="482" r="4" fill="#E8945A" filter="url(#neonGlow)" />
              </svg>

              {/* Signal Logo Tiles at top */}
              {[
                { label: "FUNDING", letters: "cb", color: "#1d6df0", bg: "#fff" },
                { label: "HIRING", letters: "in", color: "#fff", bg: "#0a66c2" },
                { label: "WEB VISIT", letters: "▦", color: "#3b82f6", bg: "#fff" },
                { label: "COMPETITOR", letters: "G2", color: "#ff492c", bg: "#fff" },
                { label: "ADS", letters: "∞", color: "#0668e1", bg: "#fff" },
                { label: "TOOL STACK", letters: "bw", color: "#2d9d3f", bg: "#fff" },
              ].map((item, i) => {
                const positions = ["6%", "22.5%", "39%", "55.5%", "72%", "88.5%"];
                return (
                  <div
                    key={item.label}
                    className="absolute flex flex-col items-center gap-2"
                    style={{ top: "2%", left: positions[i], transform: "translateX(-50%)" }}
                  >
                    <span className="text-[9px] md:text-[10px] font-display font-bold text-primary uppercase tracking-[0.18em] whitespace-nowrap">
                      {item.label}
                    </span>
                    <div
                      className="w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center font-display font-bold text-base shadow-lg shadow-black/40"
                      style={{ background: item.bg, color: item.color }}
                    >
                      {item.letters}
                    </div>
                  </div>
                );
              })}

              {/* B2BGM Engine™ central card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="absolute flex flex-col items-center justify-center gap-3 rounded-xl border border-primary/40 bg-card/60 backdrop-blur-sm shadow-[0_0_50px_rgba(232,148,90,0.25)]"
                style={{ left: "37.5%", top: "39%", width: "25%", aspectRatio: "1 / 1" }}
              >
                <div className="grid grid-cols-3 gap-1">
                  <span className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span className="w-3 h-3 md:w-3.5 md:h-3.5 bg-primary rounded-sm" />
                  <span className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span className="w-3 h-3 md:w-3.5 md:h-3.5 bg-primary rounded-sm" />
                  <span className="w-3 h-3 md:w-3.5 md:h-3.5 bg-primary rounded-sm" />
                  <span className="w-3 h-3 md:w-3.5 md:h-3.5 bg-primary rounded-sm" />
                  <span className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span className="w-3 h-3 md:w-3.5 md:h-3.5 bg-primary rounded-sm" />
                  <span className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </div>
                <span className="text-[9px] md:text-[10px] font-display font-semibold uppercase tracking-[0.22em] text-primary text-center px-2">
                  B2BGM Engine™
                </span>
              </motion.div>

              {/* Frontal Operators card – right of engine */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="absolute p-4 md:p-5 rounded-xl border border-primary/30 bg-card/40 backdrop-blur-sm shadow-[0_0_40px_rgba(232,148,90,0.12)]"
                style={{ left: "68.5%", top: "37%", width: "30%" }}
              >
                <h4 className="font-display font-bold text-foreground text-sm md:text-base mb-1">
                  Frontal operators
                </h4>
                <p className="text-[10px] font-display font-bold text-primary uppercase tracking-[0.18em] mb-3">
                  Human judgment
                </p>
                <div className="flex items-center -space-x-2 mb-3">
                  {operators.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="operator"
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border-2 border-background ring-1 ring-primary/30"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Bouw het systeem, zet de logica en draai de plays{" "}
                  <span className="text-primary">voor je.</span>
                </p>
              </motion.div>

              {/* High-fit account card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="absolute p-4 md:p-5 rounded-xl border border-primary/25 bg-card/40 backdrop-blur-sm shadow-[0_0_40px_rgba(232,148,90,0.1)]"
                style={{ left: "5%", bottom: 0, width: "90%" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-display font-bold text-foreground text-base md:text-lg mb-0.5">
                      High-fit account
                    </h4>
                    <p className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-[0.18em]">
                      Series B · 240 employees
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-display font-black text-3xl md:text-4xl leading-none">94</div>
                    <span className="text-[10px] font-display font-bold text-primary uppercase tracking-[0.18em]">
                      Fit
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {[
                    { letters: "cb", color: "#1d6df0", bg: "#fff", text: "Series B funding closed" },
                    { letters: "in", color: "#fff", bg: "#0a66c2", text: "Hiring 6 sales reps" },
                    { letters: "▦", color: "#3b82f6", bg: "#fff", text: "Visited pricing 3 times" },
                  ].map((row) => (
                    <div
                      key={row.text}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-background/40 border border-primary/10"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center font-display font-bold text-[11px] shrink-0"
                          style={{ background: row.bg, color: row.color }}
                        >
                          {row.letters}
                        </div>
                        <span className="text-xs md:text-sm text-foreground/90 font-display font-medium">
                          {row.text}
                        </span>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-[0.18em]">
                    Next action
                  </span>
                  <button
                    onClick={openBookingModal}
                    className="px-4 py-1.5 rounded-md border border-primary/50 text-primary font-display font-semibold text-xs hover:bg-primary/10 transition-colors"
                  >
                    Call today
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                  <span className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-[0.18em]">
                    In your stack
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { l: "sf", c: "#00a1e0" },
                      { l: "hs", c: "#ff7a59" },
                      { l: "ap", c: "#000" },
                      { l: "sl", c: "#611f69" },
                    ].map((t) => (
                      <div
                        key={t.l}
                        className="w-7 h-7 rounded-md bg-white flex items-center justify-center font-display font-bold text-[10px]"
                        style={{ color: t.c }}
                      >
                        {t.l}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </section>
  );
};

export default ExactHero;