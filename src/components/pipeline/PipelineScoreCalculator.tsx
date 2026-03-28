import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pipelineVariables, pipelinePhases } from "@/data/pipelineVariables";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackCTA } from "@/lib/tracking";
import { Magnet, Crosshair, MessageSquare, RefreshCw, TrendingUp, Database, Radio, Clock, Gem, PenLine, UserCheck, Share2, IterationCw, Flag, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Magnet, Crosshair, MessageSquare, RefreshCw, TrendingUp, Database, Radio, Clock, Gem, PenLine, UserCheck, Share2, IterationCw, Flag,
};

const PipelineScoreCalculator = () => {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(pipelineVariables.map((v) => [v.id, 5]))
  );
  const [calculated, setCalculated] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportUnlocked, setReportUnlocked] = useState(false);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = pipelineVariables.length * 10;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const phaseScores = pipelinePhases.map((phase) => {
    const vars = pipelineVariables.filter((v) => v.phase === phase.key);
    const sum = vars.reduce((a, v) => a + (scores[v.id] || 5), 0);
    const max = vars.length * 10;
    return { ...phase, score: sum, max, pct: Math.round((sum / max) * 100) };
  });

  const weakest = [...phaseScores].sort((a, b) => a.pct - b.pct);
  const bottleneck = weakest[0];

  const getScoreLabel = (pct: number) => {
    if (pct >= 80) return { label: "Sterk", color: "text-green-400" };
    if (pct >= 60) return { label: "Redelijk", color: "text-blue-400" };
    if (pct >= 40) return { label: "Matig", color: "text-yellow-400" };
    return { label: "Zwak", color: "text-red-400" };
  };

  const scoreInfo = getScoreLabel(percentage);

  const handleUnlockReport = async () => {
    if (!email.trim() || !name.trim()) {
      toast.error("Vul uw naam en e-mail in.");
      return;
    }
    setSubmitting(true);
    try {
      await supabase.from("contact_submissions").insert({
        name: name.trim(),
        email: email.trim(),
        message: `Pipeline Score™ rapport — Score: ${percentage}/100`,
        selected_package: { pipeline_score: percentage, scores, phase_scores: phaseScores } as any,
      });
      trackCTA("Pipeline Score — Rapport aangevraagd", "/pipeline-equation");
      setReportUnlocked(true);
      toast.success("Rapport is klaar!");
    } catch {
      toast.error("Dat lukte niet. Probeer het nog eens.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="calculator" className="py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Wat is uw <span className="text-primary">Pipeline Score™</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Geef elke factor een cijfer van 1 tot 10. U ziet direct waar het misgaat.
          </p>
        </motion.div>

        {/* Scoring grid */}
        <div className="space-y-6 mb-12">
          {pipelinePhases.map((phase) => {
            const vars = pipelineVariables.filter((v) => v.phase === phase.key);
            return (
              <motion.div
                key={phase.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-xl border border-border bg-gradient-to-br ${phase.color} p-5 md:p-6`}
              >
                <div className="flex items-center gap-2 mb-4">
                  {(() => { const Icon = iconMap[phase.icon]; return Icon ? <Icon className="w-5 h-5 text-primary" /> : null; })()}
                  <h3 className="font-display font-semibold text-foreground text-lg">{phase.label}</h3>
                  <span className="text-sm text-muted-foreground">— {phase.subtitle}</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {vars.map((v) => (
                    <div key={v.id} className="bg-card/60 backdrop-blur rounded-lg p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs font-mono text-primary font-bold">{v.code}</span>
                          <h4 className="font-display font-medium text-foreground text-sm">{v.name}</h4>
                        </div>
                        <span className="text-2xl font-display font-bold text-foreground">{scores[v.id]}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{v.description}</p>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={scores[v.id]}
                        onChange={(e) =>
                          setScores((prev) => ({ ...prev, [v.id]: Number(e.target.value) }))
                        }
                        className="w-full accent-primary h-2 rounded-full cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>1</span>
                        <span>10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Calculate button */}
        {!calculated && (
          <div className="text-center">
            <Button variant="hero" size="lg" onClick={() => setCalculated(true)}>
              Toon mijn score →
            </Button>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {calculated && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              {/* Score hero */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-36 h-36 rounded-full border-4 border-primary/30 bg-card relative mb-4">
                  <div className="text-center">
                    <span className="text-5xl font-display font-bold text-foreground">{percentage}</span>
                    <span className="text-lg text-muted-foreground">/100</span>
                  </div>
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 144 144">
                    <circle cx="72" cy="72" r="66" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
                    <circle
                      cx="72" cy="72" r="66" fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(percentage / 100) * 415} 415`}
                    />
                  </svg>
                </div>
                <p className={`text-xl font-display font-semibold ${scoreInfo.color}`}>{scoreInfo.label}</p>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                  Uw pipeline scoort <span className="text-foreground font-semibold">{percentage} van de 100</span>. 
                  Het grootste probleem zit bij <span className="text-primary font-semibold">{bottleneck.label}</span>.
                </p>
              </div>

              {/* Phase breakdown */}
              <div className="grid gap-3 md:grid-cols-5 mb-10">
                {phaseScores.map((p) => (
                    <div key={p.key} className="bg-card border border-border rounded-lg p-4 text-center">
                      {(() => { const Icon = iconMap[p.icon]; return Icon ? <Icon className="w-5 h-5 text-primary mx-auto" /> : null; })()}
                    <p className="font-display font-medium text-foreground text-sm mt-1">{p.label}</p>
                    <p className={`text-2xl font-bold font-display mt-1 ${getScoreLabel(p.pct).color}`}>{p.pct}%</p>
                  </div>
                ))}
              </div>

              {/* Report gate */}
              {!reportUnlocked ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card border border-primary/30 rounded-xl p-6 md:p-8 text-center"
                >
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    Wilt u het volledige rapport?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                    U krijgt een analyse per factor, concrete tips en een plan van aanpak.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                      placeholder="Uw naam"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary border-border"
                    />
                    <Input
                      type="email"
                      placeholder="Uw e-mailadres"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button
                    variant="hero"
                    className="mt-4"
                    onClick={handleUnlockReport}
                    disabled={submitting}
                  >
                    {submitting ? "Bezig..." : "Bekijk het rapport →"}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-display text-xl font-bold text-foreground text-center mb-6">
                    Uw resultaat per factor
                  </h3>
                  {pipelineVariables.map((v) => {
                    const score = scores[v.id];
                    const info = getScoreLabel(score * 10);
                    return (
                      <div key={v.id} className="bg-card border border-border rounded-lg p-4 flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                          {(() => { const Icon = iconMap[v.icon]; return Icon ? <Icon className="w-5 h-5 text-primary" /> : null; })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-primary font-bold">{v.code}</span>
                            <span className="font-display font-medium text-foreground text-sm">{v.name}</span>
                            <span className={`ml-auto text-sm font-bold ${info.color}`}>{score}/10</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{v.description}</p>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-primary transition-all"
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>
                          {score <= 5 && (
                            <p className="text-xs text-primary mt-2 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Aandachtspunt: {v.details.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-center pt-6">
                    <Button variant="hero" size="lg" asChild>
                      <a
                        href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackCTA("Pipeline Score — Plan een gesprek", "/pipeline-equation")}
                      >
                        Bespreek uw score →
                      </a>
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PipelineScoreCalculator;
