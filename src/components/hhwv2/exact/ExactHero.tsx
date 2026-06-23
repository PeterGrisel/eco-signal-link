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
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-28 overflow-hidden bg-background">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px]" />
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

          {/* Right Column - Interactive Visual Diagram */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 relative w-full h-[450px] md:h-[600px] flex items-center justify-center select-none overflow-hidden lg:overflow-visible"
          >
            <div className="relative w-[700px] h-[550px] scale-[0.55] xs:scale-[0.65] sm:scale-[0.8] lg:scale-100 origin-center shrink-0">
              {/* SVG Interactive Flowing Connectors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--primary-glow)" stopOpacity="0.2" />
                  </linearGradient>
                  <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="var(--primary)" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Curves connecting Signal Pills to Revenue Engine (Central Element) */}
                {/* 1. Funding signals (Left-top) -> Engine */}
                <path d="M 120 70 Q 200 120, 350 215" fill="none" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_10s_linear_infinite]" />
                
                {/* 2. Hiring signals (Center-left-top) -> Engine */}
                <path d="M 210 70 Q 240 130, 350 215" fill="none" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_8s_linear_infinite]" />
                
                {/* 3. Website bezoeken (Center-top) -> Engine */}
                <path d="M 305 70 Q 330 140, 350 215" fill="none" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_12s_linear_infinite]" />
                
                {/* 4. Concurrent research (Center-right-top) -> Engine */}
                <path d="M 400 70 Q 370 140, 350 215" fill="none" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_7s_linear_infinite]" />
                
                {/* 5. Ad engagement (Right-top) -> Engine */}
                <path d="M 495 70 Q 460 130, 350 215" fill="none" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_9s_linear_infinite]" />
                
                {/* 6. Tool stack (Far-right-top) -> Engine */}
                <path d="M 580 70 Q 500 120, 350 215" fill="none" stroke="url(#glowGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_11s_linear_infinite]" />

                {/* Connections from Engine */}
                {/* Engine -> Operators */}
                <path d="M 405 240 H 510" fill="none" stroke="url(#glowGrad)" strokeWidth="2" strokeDasharray="4 4" />
                
                {/* Engine -> High-fit Account */}
                <path d="M 350 265 V 340" fill="none" stroke="url(#glowGrad)" strokeWidth="2.5" />
                <circle cx="350" cy="340" r="4" fill="var(--primary)" />
              </svg>

              {/* --- Absolute positioned UI Cards --- */}

              {/* 1. Signal Cards at the top */}
              <div className="absolute top-4 left-[2%] md:left-[5%] flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground/80 font-display font-semibold text-center leading-none">Funding<br/>signals</span>
                <div className="w-10 h-10 rounded-lg bg-card/80 border border-primary/15 flex items-center justify-center text-primary shadow-lg shadow-black/40 hover:scale-105 transition-transform">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute top-4 left-[18%] md:left-[21%] flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground/80 font-display font-semibold text-center leading-none">Hiring<br/>signals</span>
                <div className="w-10 h-10 rounded-lg bg-card/80 border border-primary/15 flex items-center justify-center text-primary shadow-lg shadow-black/40 hover:scale-105 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute top-4 left-[34%] md:left-[36%] flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground/80 font-display font-semibold text-center leading-none">Website<br/>bezoeken</span>
                <div className="w-10 h-10 rounded-lg bg-card/80 border border-primary/15 flex items-center justify-center text-primary shadow-lg shadow-black/40 hover:scale-105 transition-transform">
                  <Globe className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute top-4 left-[50%] md:left-[51%] flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground/80 font-display font-semibold text-center leading-none">Concurrent<br/>research</span>
                <div className="w-10 h-10 rounded-lg bg-card/80 border border-primary/15 flex items-center justify-center text-primary shadow-lg shadow-black/40 hover:scale-105 transition-transform">
                  <Search className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute top-4 left-[66%] md:left-[67%] flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground/80 font-display font-semibold text-center leading-none">Ad<br/>engagement</span>
                <div className="w-10 h-10 rounded-lg bg-card/80 border border-primary/15 flex items-center justify-center text-primary shadow-lg shadow-black/40 hover:scale-105 transition-transform">
                  <MousePointerClick className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute top-4 left-[81%] md:left-[82%] flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground/80 font-display font-semibold text-center leading-none">Tool<br/>stack</span>
                <div className="w-10 h-10 rounded-lg bg-card/80 border border-primary/15 flex items-center justify-center text-primary shadow-lg shadow-black/40 hover:scale-105 transition-transform">
                  <Layers className="h-5 w-5" />
                </div>
              </div>

              {/* 2. REVENUE ENGINE (Central Node) */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="absolute top-[205px] left-1/2 -translate-x-1/2 w-48 py-4 px-6 rounded-xl border border-primary bg-card shadow-[0_0_30px_rgba(232,148,90,0.15)] flex flex-col items-center gap-2 z-10"
              >
                {/* Mini Custom logo for engine */}
                <div className="flex items-end gap-1 h-7">
                  <span className="w-1 h-3 rounded-full bg-primary/40" />
                  <span className="w-1 h-5 rounded-full bg-primary/60" />
                  <span className="w-1 h-6 rounded-full bg-primary" />
                  <span className="w-1 h-4 rounded-full bg-primary/80" />
                  <span className="w-1 h-2 rounded-full bg-primary/30" />
                </div>
                <span className="text-[11px] font-display font-extrabold uppercase tracking-[0.18em] text-foreground text-center">
                  Revenue Engine
                </span>
              </motion.div>

              {/* 3. Operators & Logic (Right Side Element) */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-[180px] right-[2%] md:right-[5%] w-52 p-4 rounded-xl border border-primary/10 bg-card/90 shadow-2xl shadow-black/50 z-10"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-display font-bold text-foreground">Operators & Logic</span>
                  <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">Human judgment</span>
                </div>
                
                {/* Avatars Pile */}
                <div className="flex items-center -space-x-2 my-2.5">
                  {operators.map((src, i) => (
                    <img 
                      key={i} 
                      src={src} 
                      alt="operator" 
                      className="w-6 h-6 rounded-full object-cover border-2 border-card ring-1 ring-primary/20" 
                    />
                  ))}
                </div>

                <p className="text-[9px] text-muted-foreground leading-snug">
                  We bouwen de logica die ertoe doet, en operators die het verschil maken.
                </p>
              </motion.div>

              {/* 4. High-fit Account (Detailed Bottom Card) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -2 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[340px] md:w-[380px] p-4 rounded-xl border border-primary/15 bg-card/95 shadow-2xl shadow-black/60 z-10"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-primary/10">
                  <div>
                    <h4 className="text-xs font-display font-bold text-foreground">High-fit account</h4>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Serie B · 240 employees</p>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-display font-black text-2xl leading-none">94</div>
                    <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-bold">Fit Score</span>
                  </div>
                </div>

                {/* Signals checklist */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-foreground/90">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span>Series B funding afgerond</span>
                    </div>
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-foreground/90">
                      <Users className="h-3 w-3 text-primary" />
                      <span>6 nieuwe sales hires</span>
                    </div>
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-foreground/90">
                      <Globe className="h-3 w-3 text-primary" />
                      <span>3x website pricing bezoeken</span>
                    </div>
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-foreground/90">
                      <MousePointerClick className="h-3 w-3 text-primary" />
                      <span>Sterke engagement met ads</span>
                    </div>
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                </div>

                {/* Next Action Trigger */}
                <div className="mb-4">
                  <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-bold block mb-1">Next Action</span>
                  <button 
                    onClick={openBookingModal}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <PhoneCall className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-display font-semibold text-foreground">Bel vandaag</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  </button>
                </div>

                {/* Tool Stack at bottom */}
                <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                  <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-bold">In jouw stack</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-blue-600/10 border border-blue-600/20 text-blue-400 text-[9px] flex items-center justify-center font-bold">sf</span>
                    <span className="w-5 h-5 rounded bg-orange-600/10 border border-orange-600/20 text-orange-400 text-[9px] flex items-center justify-center font-bold">hs</span>
                    <span className="w-5 h-5 rounded bg-green-600/10 border border-green-600/20 text-green-400 text-[9px] flex items-center justify-center font-bold">sl</span>
                    <span className="w-5 h-5 rounded bg-purple-600/10 border border-purple-600/20 text-purple-400 text-[9px] flex items-center justify-center font-bold">as</span>
                    <span className="w-5 h-5 rounded border border-dashed border-primary/30 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                      <Plus className="h-3 w-3" />
                    </span>
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