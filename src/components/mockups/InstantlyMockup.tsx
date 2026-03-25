import { motion } from "framer-motion";
import { Mail, Clock, BarChart3, CheckCircle, Circle, ArrowRight, Pause } from "lucide-react";

const campaigns = [
  { name: "Q1 — SaaS Decision Makers NL", status: "active", sent: 2847, opened: 1423, replied: 186, meetings: 24, rate: "50%" },
  { name: "Hiring Signal — Scale-Ups", status: "active", sent: 1256, opened: 714, replied: 98, meetings: 14, rate: "57%" },
  { name: "Job Change — VP/Director", status: "active", sent: 892, opened: 498, replied: 73, meetings: 11, rate: "56%" },
  { name: "Website Visitors — Retarget", status: "paused", sent: 634, opened: 289, replied: 31, meetings: 4, rate: "46%" },
];

const sequenceSteps = [
  { day: "Dag 1", type: "Email", subject: "Intro + waardepropositie", status: "sent" },
  { day: "Dag 3", type: "LinkedIn", subject: "Connectieverzoek", status: "sent" },
  { day: "Dag 5", type: "Email", subject: "Case study + social proof", status: "sent" },
  { day: "Dag 8", type: "Email", subject: "Follow-up + vraag", status: "pending" },
  { day: "Dag 12", type: "LinkedIn", subject: "Bericht met inzicht", status: "pending" },
  { day: "Dag 15", type: "Email", subject: "Break-up email", status: "pending" },
];

const InstantlyMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="rounded-xl border border-glow overflow-hidden shadow-2xl shadow-primary/5 bg-background"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm text-foreground">Outreach Campaigns</span>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">4 actief</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-primary" /> Avg. open rate: <span className="text-foreground font-semibold">52%</span></span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> Avg. reply rate: <span className="text-foreground font-semibold">7.2%</span></span>
        </div>
      </div>

      {/* Campaign rows */}
      <div className="hidden md:grid grid-cols-[2fr_0.6fr_0.8fr_0.8fr_0.8fr_0.8fr_0.6fr] px-5 py-2 border-b border-border bg-secondary/30 text-[10px] font-display font-semibold text-muted-foreground tracking-[0.1em] uppercase">
        <span>Campaign</span>
        <span>Status</span>
        <span>Verzonden</span>
        <span>Geopend</span>
        <span>Replies</span>
        <span>Meetings</span>
        <span className="text-right">Open %</span>
      </div>

      <div className="divide-y divide-border">
        {campaigns.map((c, i) => (
          <div key={c.name} className={`grid grid-cols-[1fr] md:grid-cols-[2fr_0.6fr_0.8fr_0.8fr_0.8fr_0.8fr_0.6fr] px-5 py-2.5 items-center transition-colors ${i === 0 ? "bg-primary/5" : "hover:bg-secondary/30"}`}>
            <span className="font-display font-semibold text-sm text-foreground truncate">{c.name}</span>
            <div className="hidden md:flex">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${c.status === "active" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                {c.status === "active" ? <Circle className="w-2 h-2 fill-primary" /> : <Pause className="w-2 h-2" />}
                {c.status === "active" ? "Actief" : "Gepauzeerd"}
              </span>
            </div>
            <span className="hidden md:block text-sm text-muted-foreground">{c.sent.toLocaleString()}</span>
            <span className="hidden md:block text-sm text-muted-foreground">{c.opened.toLocaleString()}</span>
            <span className="hidden md:block text-sm text-primary font-semibold">{c.replied}</span>
            <span className="hidden md:block text-sm text-primary font-semibold">{c.meetings}</span>
            <span className="hidden md:block text-sm text-right text-muted-foreground">{c.rate}</span>
          </div>
        ))}
      </div>

      {/* Sequence preview */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[10px] font-display font-semibold text-muted-foreground tracking-[0.1em] uppercase mb-3">Sequentie voorbeeld</p>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {sequenceSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <div className={`px-3 py-2 rounded-md border text-xs ${step.status === "sent" ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-secondary/50 text-muted-foreground"}`}>
                <p className="font-bold text-[10px]">{step.day}</p>
                <p className="text-[9px] flex items-center gap-1">
                  {step.status === "sent" ? <CheckCircle className="w-2.5 h-2.5" /> : <Circle className="w-2.5 h-2.5" />}
                  {step.type}
                </p>
              </div>
              {i < sequenceSteps.length - 1 && <ArrowRight className="w-3 h-3 text-border shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-border bg-secondary/20 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">53 meetings</span> geboekt deze maand
        </span>
        <span className="text-[10px] text-muted-foreground">Multi-Channel Sequencing</span>
      </div>
    </motion.div>
  );
};

export default InstantlyMockup;
