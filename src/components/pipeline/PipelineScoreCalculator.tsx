import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pipelineVariables, pipelinePhases } from "@/data/pipelineVariables";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackCTA } from "@/lib/tracking";
import ReactMarkdown from "react-markdown";
import {
  Magnet, Crosshair, MessageSquare, RefreshCw, TrendingUp,
  Database, Radio, Clock, Gem, PenLine, UserCheck, Share2,
  IterationCw, Flag, AlertTriangle, Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Magnet, Crosshair, MessageSquare, RefreshCw, TrendingUp,
  Database, Radio, Clock, Gem, PenLine, UserCheck, Share2,
  IterationCw, Flag,
};

const industries = [
  "SaaS / Software",
  "IT-dienstverlening",
  "Marketing / Reclame",
  "Financiële diensten",
  "Productie / Maakindustrie",
  "Logistiek / Transport",
  "Bouw / Techniek",
  "Consultancy",
  "Recruitment / HR",
  "Anders",
];

const teamSizes = [
  "1 tot 3 mensen",
  "4 tot 10 mensen",
  "11 tot 25 mensen",
  "26 tot 50 mensen",
  "Meer dan 50 mensen",
];

const deepDiveQuestions = [
  { id: "q1", question: "Heeft u een duidelijk omschreven ideale klantprofiel?", phase: "attract" },
  { id: "q2", question: "Wordt uw contactdata regelmatig opgeschoond en verrijkt?", phase: "attract" },
  { id: "q3", question: "Gebruikt u koopsignalen om het juiste moment te kiezen?", phase: "reach" },
  { id: "q4", question: "Weet u binnen 24 uur wanneer een prospect actief is?", phase: "reach" },
  { id: "q5", question: "Begrijpt een prospect in 5 seconden wat u doet?", phase: "resonate" },
  { id: "q6", question: "Stuurt u gepersonaliseerde berichten per prospect?", phase: "resonate" },
  { id: "q7", question: "Combineert u minstens 2 kanalen (email, LinkedIn, telefoon)?", phase: "execute" },
  { id: "q8", question: "Heeft u een vast opvolgschema met meerdere contactmomenten?", phase: "execute" },
  { id: "q9", question: "Wordt elke reactie binnen 4 uur opgepakt?", phase: "convert" },
  { id: "q10", question: "Heeft u een duidelijk kwalificatieproces voor leads?", phase: "convert" },
];

const PipelineScoreCalculator = () => {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(pipelineVariables.map((v) => [v.id, 5]))
  );
  const [calculated, setCalculated] = useState(false);

  // Lead capture + qualifying
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Deep dive step
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [deepAnswers, setDeepAnswers] = useState<Record<string, "ja" | "nee" | "deels" | null>>(
    Object.fromEntries(deepDiveQuestions.map((q) => [q.id, null]))
  );

  // AI report
  const [reportMarkdown, setReportMarkdown] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportDone, setReportDone] = useState(false);

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

  const streamReport = async () => {
    setReportLoading(true);
    setReportMarkdown("");

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pipeline-report`;

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          scores,
          phaseScores,
          percentage,
          bottleneck: bottleneck.label,
          industry,
          teamSize,
          deepDiveAnswers: Object.entries(deepAnswers)
            .filter(([, v]) => v !== null)
            .map(([id, answer]) => {
              const q = deepDiveQuestions.find((dq) => dq.id === id);
              return { question: q?.question || id, answer };
            }),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Onbekende fout" }));
        toast.error(err.error || "Rapport kon niet worden gegenereerd.");
        setReportLoading(false);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              full += content;
              setReportMarkdown(full);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      setReportDone(true);
    } catch (e) {
      console.error("Stream error:", e);
      toast.error("Er ging iets mis bij het genereren van uw rapport.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!email.trim() || !name.trim()) {
      toast.error("Vul uw naam en e-mail in.");
      return;
    }
    if (!industry) {
      toast.error("Kies uw branche.");
      return;
    }
    if (!teamSize) {
      toast.error("Kies uw teamgrootte.");
      return;
    }
    setShowDeepDive(true);
  };

  const handleGenerateReport = async () => {
    setSubmitting(true);
    try {
      await supabase.from("contact_submissions").insert({
        name: name.trim(),
        email: email.trim(),
        message: `Pipeline Score™ rapport — Score: ${percentage}/100`,
        selected_package: {
          pipeline_score: percentage,
          scores,
          phase_scores: phaseScores,
          industry,
          team_size: teamSize,
          deep_dive_answers: deepAnswers,
        } as any,
      });
      trackCTA("Pipeline Score — Rapport aangevraagd", "/pipeline-equation");

      // Start AI report generation
      await streamReport();
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

              {/* Report gate or AI report */}
              {!reportDone && !reportLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card border border-primary/30 rounded-xl p-6 md:p-8"
                >
                  {!showDeepDive ? (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="font-display text-xl font-bold text-foreground mb-2">
                          Ontvang uw persoonlijke rapport
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                          Onze AI analyseert uw scores en geeft concrete tips per factor. Vul onderstaande gegevens in.
                        </p>
                      </div>

                      <div className="max-w-lg mx-auto space-y-4">
                        <div className="grid sm:grid-cols-2 gap-3">
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

                        <div>
                          <label className="text-sm text-muted-foreground mb-1.5 block">In welke branche zit u?</label>
                          <div className="flex flex-wrap gap-2">
                            {industries.map((ind) => (
                              <button
                                key={ind}
                                type="button"
                                onClick={() => setIndustry(ind)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                  industry === ind
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary text-muted-foreground border-border hover:border-primary/40"
                                }`}
                              >
                                {ind}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-muted-foreground mb-1.5 block">Hoe groot is uw salesteam?</label>
                          <div className="flex flex-wrap gap-2">
                            {teamSizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setTeamSize(size)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                  teamSize === size
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary text-muted-foreground border-border hover:border-primary/40"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="text-center pt-2">
                          <Button
                            variant="hero"
                            size="lg"
                            onClick={handleNextStep}
                          >
                            Volgende stap →
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="font-display text-xl font-bold text-foreground mb-2">
                          Maak uw rapport nog specifieker
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                          Beantwoord deze 10 vragen zodat de AI precies weet waar u staat. U kunt ook meteen het rapport genereren.
                        </p>
                      </div>

                      <div className="max-w-2xl mx-auto space-y-3 mb-6">
                        {deepDiveQuestions.map((q, qi) => (
                          <div key={q.id} className="bg-secondary/50 border border-border rounded-lg p-4 flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3 min-w-0">
                              <span className="text-xs font-mono text-primary font-bold mt-0.5 shrink-0">{String(qi + 1).padStart(2, "0")}</span>
                              <p className="text-sm text-foreground">{q.question}</p>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              {(["ja", "deels", "nee"] as const).map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setDeepAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                                    deepAnswers[q.id] === opt
                                      ? opt === "ja"
                                        ? "bg-green-500/20 text-green-400 border-green-500/40"
                                        : opt === "deels"
                                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                                        : "bg-red-500/20 text-red-400 border-red-500/40"
                                      : "bg-secondary text-muted-foreground border-border hover:border-primary/40"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          variant="hero"
                          size="lg"
                          onClick={handleGenerateReport}
                          disabled={submitting}
                        >
                          {submitting ? "Bezig..." : "Genereer mijn rapport →"}
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setShowDeepDive(false)}
                          disabled={submitting}
                        >
                          ← Terug
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-primary/30 rounded-xl p-6 md:p-8"
                >
                  {reportLoading && !reportMarkdown && (
                    <div className="flex items-center justify-center gap-3 py-8">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      <p className="text-muted-foreground">Uw rapport wordt gegenereerd...</p>
                    </div>
                  )}

                  {reportMarkdown && (
                    <div className="prose prose-invert prose-sm max-w-none
                      prose-headings:font-display prose-headings:text-foreground
                      prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-0
                      prose-h3:text-lg prose-h3:text-primary prose-h3:mt-6 prose-h3:mb-2
                      prose-p:text-muted-foreground prose-p:leading-relaxed
                      prose-strong:text-foreground
                      prose-li:text-muted-foreground"
                    >
                      <ReactMarkdown>{reportMarkdown}</ReactMarkdown>
                    </div>
                  )}

                  {reportLoading && reportMarkdown && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground">Wordt geschreven...</span>
                    </div>
                  )}

                  {reportDone && (
                    <div className="text-center mt-8 pt-6 border-t border-border">
                      <p className="text-muted-foreground text-sm mb-4">
                        Wilt u dit rapport bespreken met een specialist?
                      </p>
                      <Button variant="hero" size="lg" asChild>
                        <a
                          href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackCTA("Pipeline Score — Plan een gesprek na rapport", "/pipeline-equation")}
                        >
                          Plan een gesprek →
                        </a>
                      </Button>
                    </div>
                  )}
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
