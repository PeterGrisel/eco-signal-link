import { useState, useCallback, useMemo } from "react";
import { LayerConfig, LAYERS, QuizQuestion } from "../data/layers";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Sparkles, Lightbulb, AlertTriangle, Quote, Building2, ArrowRight, Brain, X, Trophy } from "lucide-react";

type Section = 'waarom' | 'wat' | 'hoe';

interface JourneyLayerProps {
  layer: LayerConfig;
  inputs: Record<string, any>;
  completedLayers: number[];
  onInputChange: (fieldKey: string, value: any) => void;
  onComplete: () => void;
  onAskAgent: (fieldKey: string, value: any) => void;
  onQuizScoreUpdate?: (correct: number, total: number) => void;
}

const JourneyLayer = ({ layer, inputs, completedLayers, onInputChange, onComplete, onAskAgent, onQuizScoreUpdate }: JourneyLayerProps) => {
  const [section, setSection] = useState<Section>('waarom');
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const { requiredFilled, filledCount, totalFields } = useMemo(() => {
    const required = layer.wat.fields.filter(f => f.required);
    const allFields = layer.wat.fields;
    const filled = allFields.filter(f => {
      const val = inputs[f.key];
      if (f.type === 'checkbox') return val === true;
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== '' && val !== null;
    });
    const reqFilled = required.every(f => {
      const val = inputs[f.key];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== '' && val !== null;
    });
    return { requiredFilled: reqFilled, filledCount: filled.length, totalFields: allFields.length };
  }, [layer.wat.fields, inputs]);

  const handleFieldChange = useCallback((key: string, value: any) => {
    onInputChange(key, value);
  }, [onInputChange]);

  const handleFieldBlur = useCallback((key: string) => {
    const value = inputs[key];
    if (value && String(value).trim()) {
      setCompletedFields(prev => new Set(prev).add(key));
      onAskAgent(key, value);
    }
  }, [inputs, onAskAgent]);

  return (
    <div className="max-w-[600px] mx-auto">
      {/* Layer header */}
      <div className="flex items-center gap-3 mb-6">
        <span
          className="font-mono text-xs px-2.5 py-1 rounded-md border"
          style={{ borderColor: layer.themeColor + '40', color: layer.themeColor }}
        >
          {String(layer.id).padStart(2, '0')}
        </span>
        <h1 className="font-display text-xl text-foreground">{layer.title}</h1>
        {layer.scoreContribution > 0 && (
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">+{layer.scoreContribution}pts</span>
        )}
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-card rounded-lg border border-border">
        {(['waarom', 'wat', ...(layer.hoe ? ['hoe'] : [])] as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-body font-medium transition-all ${
              section === s
                ? 'bg-secondary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {s === 'waarom' ? 'Waarom' : s === 'wat' ? 'Configuratie' : 'Tools'}
          </button>
        ))}
      </div>

      {/* Section content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {section === 'waarom' && (
            <div className="space-y-6">
              <h2 className="font-display text-[28px] leading-tight text-foreground">
                {layer.waarom.headline}
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-body">
                {layer.waarom.body.split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Case Study Card — Velox Solutions */}
              {layer.waarom.caseStudy && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-card">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="font-body text-xs font-semibold text-foreground">Velox Solutions</span>
                    <span className="ml-auto font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Case Study</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed font-body">
                      {layer.waarom.caseStudy.situation}
                    </p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/[0.04] border border-primary/10">
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm text-primary/90 font-body">
                        {layer.waarom.caseStudy.result}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground italic font-body">
                      → {layer.waarom.caseStudy.lesson}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Before / After Stats */}
              {layer.waarom.stats && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="rounded-xl border border-[#F87171]/20 bg-[#F87171]/[0.04] p-4 text-center">
                    <span className="font-mono text-2xl font-bold text-[#F87171]">{layer.waarom.stats.before.value}</span>
                    <p className="mt-1.5 text-[10px] text-muted-foreground font-body uppercase tracking-wider">{layer.waarom.stats.before.label}</p>
                  </div>
                  <div className="rounded-xl border border-[#34D399]/20 bg-[#34D399]/[0.04] p-4 text-center relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-[#34D399]" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-[#34D399]">{layer.waarom.stats.after.value}</span>
                    <p className="mt-1.5 text-[10px] text-muted-foreground font-body uppercase tracking-wider">{layer.waarom.stats.after.label}</p>
                  </div>
                </motion.div>
              )}

              {/* Veelgemaakte Fout */}
              {layer.waarom.mistake && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="rounded-xl border border-[#F97316]/20 bg-[#F97316]/[0.03] p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-[#F97316]" />
                    <span className="font-body text-xs font-semibold text-[#F97316]">{layer.waarom.mistake.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-body">
                    {layer.waarom.mistake.body}
                  </p>
                </motion.div>
              )}

              {/* Kernprincipe */}
              {layer.waarom.principle && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/[0.03]"
                >
                  <Quote className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="font-display text-base text-primary leading-snug">
                    "{layer.waarom.principle}"
                  </p>
                </motion.div>
              )}

              {/* Quiz Section */}
              {layer.waarom.quiz && layer.waarom.quiz.length > 0 && !quizComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="rounded-xl border border-[hsl(24, 75%, 63%)]/20 bg-card overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-card">
                    <div className="w-7 h-7 rounded-lg bg-[hsl(24, 75%, 63%)]/10 flex items-center justify-center">
                      <Brain className="w-3.5 h-3.5 text-[hsl(24, 75%, 63%)]" />
                    </div>
                    <span className="font-body text-xs font-semibold text-foreground">Quick Check</span>
                    <span className="ml-auto font-mono text-[9px] text-muted-foreground">
                      {quizIndex + 1}/{layer.waarom.quiz.length}
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-foreground font-body font-medium leading-relaxed">
                      {layer.waarom.quiz[quizIndex].question}
                    </p>
                    <div className="space-y-2">
                      {layer.waarom.quiz[quizIndex].options.map((opt, i) => {
                        const isSelected = selectedAnswer === i;
                        const isCorrectOption = i === layer.waarom.quiz![quizIndex].correctIndex;
                        let borderColor = 'border-border';
                        let bgColor = 'bg-card';
                        let textColor = 'text-muted-foreground';

                        if (quizAnswered) {
                          if (isCorrectOption) {
                            borderColor = 'border-[#34D399]/40';
                            bgColor = 'bg-[#34D399]/[0.06]';
                            textColor = 'text-[#34D399]';
                          } else if (isSelected && !isCorrectOption) {
                            borderColor = 'border-[#F87171]/40';
                            bgColor = 'bg-[#F87171]/[0.06]';
                            textColor = 'text-[#F87171]';
                          }
                        } else if (isSelected) {
                          borderColor = 'border-[hsl(24, 75%, 63%)]/40';
                          bgColor = 'bg-[hsl(24, 75%, 63%)]/[0.06]';
                          textColor = 'text-[hsl(24, 75%, 63%)]';
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => { if (!quizAnswered) setSelectedAnswer(i); }}
                            disabled={quizAnswered}
                            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${borderColor} ${bgColor} ${
                              !quizAnswered ? 'hover:border-[hsl(24, 75%, 63%)]/30 cursor-pointer' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[10px] text-muted-foreground w-4 shrink-0">{String.fromCharCode(65 + i)}</span>
                              <span className={`text-xs font-body ${textColor}`}>{opt}</span>
                              {quizAnswered && isCorrectOption && <Check className="w-3.5 h-3.5 text-[#34D399] ml-auto shrink-0" />}
                              {quizAnswered && isSelected && !isCorrectOption && <X className="w-3.5 h-3.5 text-[#F87171] ml-auto shrink-0" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit / feedback */}
                    {!quizAnswered && selectedAnswer !== null && (
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                          const correct = selectedAnswer === layer.waarom.quiz![quizIndex].correctIndex;
                          setQuizAnswered(true);
                          setQuizCorrect(correct);
                          if (correct) setQuizScore(prev => prev + 1);
                        }}
                        className="w-full py-2.5 rounded-lg bg-[hsl(24, 75%, 63%)] text-primary-foreground text-xs font-semibold font-body hover:bg-[hsl(24, 75%, 63%)]/90 transition-colors"
                      >
                        Controleer antwoord
                      </motion.button>
                    )}

                    {quizAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className={`flex items-start gap-2 p-3 rounded-lg border ${
                          quizCorrect
                            ? 'bg-[#34D399]/[0.04] border-[#34D399]/20'
                            : 'bg-[#F87171]/[0.04] border-[#F87171]/20'
                        }`}>
                          <Lightbulb className={`w-4 h-4 mt-0.5 shrink-0 ${quizCorrect ? 'text-[#34D399]' : 'text-[#F87171]'}`} />
                          <div>
                            <span className={`text-xs font-semibold font-body ${quizCorrect ? 'text-[#34D399]' : 'text-[#F87171]'}`}>
                              {quizCorrect ? 'Correct!' : 'Niet helemaal'}
                            </span>
                            <p className="text-[11px] text-muted-foreground leading-relaxed font-body mt-1">
                              {layer.waarom.quiz![quizIndex].explanation}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const nextIdx = quizIndex + 1;
                            if (nextIdx < layer.waarom.quiz!.length) {
                              setQuizIndex(nextIdx);
                              setSelectedAnswer(null);
                              setQuizAnswered(false);
                              setQuizCorrect(false);
                            } else {
                              setQuizComplete(true);
                              onQuizScoreUpdate?.(quizScore + (quizCorrect ? 0 : 0), layer.waarom.quiz!.length);
                            }
                          }}
                          className="w-full py-2.5 rounded-lg bg-secondary text-foreground text-xs font-medium font-body hover:bg-[#2A2A2E] transition-colors"
                        >
                          {quizIndex + 1 < (layer.waarom.quiz?.length || 0) ? 'Volgende vraag →' : 'Afronden'}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Quiz complete — success card + proceed */}
              {quizComplete && layer.waarom.quiz && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-[#34D399]/20 bg-[#34D399]/[0.04] p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#34D399]/10 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-[#34D399]" />
                    </div>
                    <div>
                      <span className="font-body text-sm font-semibold text-[#34D399]">
                        {quizScore}/{layer.waarom.quiz.length} correct
                      </span>
                      <p className="text-[10px] text-muted-foreground font-body">
                        {quizScore === layer.waarom.quiz.length ? 'Perfect! Je beheerst de kernconcepten.' : 'Goed gedaan. De uitleg helpt je bij de configuratie.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Global Quiz Score Indicator */}
              {onQuizScoreUpdate && quizComplete && layer.waarom.quiz && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg border border-primary/20 bg-primary/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-xs text-primary font-body font-medium">Quiz Score</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-primary">{quizScore}/{layer.waarom.quiz.length}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(quizScore / (layer.waarom.quiz?.length || 1)) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Proceed button — only show when quiz is done (or no quiz) */}
              {(!layer.waarom.quiz || layer.waarom.quiz.length === 0 || quizComplete) && (
                <button
                  onClick={() => setSection('wat')}
                  className="mt-6 group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(232,148,90,0.2)] transition-all font-body"
                >
                  Begrepen — door naar configuratie
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          )}

          {section === 'wat' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-body">{layer.wat.instruction}</p>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {filledCount}/{totalFields}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: layer.themeColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${totalFields > 0 ? (filledCount / totalFields) * 100 : 0}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="space-y-4">
                {layer.wat.fields.map((field) => (
                  <motion.div
                    key={field.key}
                    className={`space-y-1.5 p-3 rounded-lg border transition-colors ${
                      completedFields.has(field.key)
                        ? 'border-primary/20 bg-primary/[0.02]'
                        : 'border-transparent'
                    }`}
                    layout
                  >
                    <label className="flex items-center gap-2 text-xs font-medium text-foreground font-body">
                      {field.label}
                      {field.required && <span className="text-primary ml-1">*</span>}
                      {completedFields.has(field.key) && (
                        <Check className="w-3 h-3 text-primary ml-auto" />
                      )}
                    </label>

                    {field.type === 'checkbox' && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange(field.key, !inputs[field.key])}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-body transition-all ${
                          inputs[field.key]
                            ? 'bg-primary/10 border-primary/40 text-primary'
                            : 'bg-card border-border text-muted-foreground hover:border-primary/20'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          inputs[field.key] ? 'bg-primary border-primary' : 'border-[hsl(30, 10%, 55%)]'
                        }`}>
                          {inputs[field.key] && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        {inputs[field.key] ? 'Actief' : 'Niet actief'}
                      </button>
                    )}

                    {field.type === 'text' && (
                      <input
                        value={inputs[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        onBlur={() => handleFieldBlur(field.key)}
                        placeholder={field.placeholder}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 font-body transition-colors"
                      />
                    )}

                    {field.type === 'textarea' && (
                      <textarea
                        value={inputs[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        onBlur={() => handleFieldBlur(field.key)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 font-body transition-colors resize-none"
                      />
                    )}

                    {field.type === 'dropdown' && (
                      <select
                        value={inputs[field.key] || ''}
                        onChange={(e) => { handleFieldChange(field.key, e.target.value); handleFieldBlur(field.key); }}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 font-body transition-colors"
                      >
                        <option value="">Selecteer...</option>
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}

                    {field.type === 'multiselect' && (
                      <div className="flex flex-wrap gap-2">
                        {field.options?.map(opt => {
                          const selected = (inputs[field.key] || []).includes(opt.value);
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                const current = inputs[field.key] || [];
                                const next = selected
                                  ? current.filter((v: string) => v !== opt.value)
                                  : [...current, opt.value];
                                handleFieldChange(field.key, next);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all border ${
                                selected
                                  ? 'bg-primary/10 border-primary/40 text-primary'
                                  : 'bg-card border-border text-muted-foreground hover:border-primary/20'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {field.type === 'number' && (
                      <input
                        type="number"
                        value={inputs[field.key] ?? field.defaultValue ?? ''}
                        onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                        onBlur={() => handleFieldBlur(field.key)}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40 font-mono transition-colors"
                      />
                    )}

                    {/* Velox Tip — shows when field is filled */}
                    {completedFields.has(field.key) && layer.wat.veloxTips?.find(t => t.fieldKey === field.key) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-primary/[0.04] border border-primary/10"
                      >
                        <Building2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <p className="text-[11px] text-primary/80 leading-relaxed font-body">
                          <span className="font-semibold text-primary">Velox Tip:</span>{' '}
                          {layer.wat.veloxTips!.find(t => t.fieldKey === field.key)!.tip}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Velox Timeline — shows completed milestones */}
              {completedLayers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border bg-card">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    <span className="font-body text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Velox's reis tot nu toe</span>
                  </div>
                  <div className="p-3 space-y-0">
                    {LAYERS.filter(l => completedLayers.includes(l.id)).map((l, i, arr) => (
                      <div key={l.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: l.themeColor + '20', borderColor: l.themeColor + '60', borderWidth: 1 }}>
                            <Check className="w-2.5 h-2.5" style={{ color: l.themeColor }} />
                          </div>
                          {i < arr.length - 1 && <div className="w-px h-5 bg-secondary" />}
                        </div>
                        <div className="pb-3">
                          <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: l.themeColor }}>{String(l.id).padStart(2, '0')} {l.title}</span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed font-body mt-0.5">{l.veloxMilestone}</p>
                        </div>
                      </div>
                    ))}
                    {/* Current layer indicator */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-primary/40 bg-primary/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-primary">{String(layer.id).padStart(2, '0')} {layer.title}</span>
                        <p className="text-[11px] text-primary/60 font-body mt-0.5">Jouw beurt...</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => layer.hoe ? setSection('hoe') : onComplete()}
                disabled={!requiredFilled}
                className="mt-4 group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-30 hover:shadow-[0_0_20px_rgba(232,148,90,0.2)] transition-all font-body"
              >
                {layer.hoe ? 'Volgende' : 'Laag afronden'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {section === 'hoe' && layer.hoe && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground font-body">{layer.hoe.instruction}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {layer.hoe.tools.map((tool) => {
                  const selectedTools = inputs._selectedTools || [];
                  const isSelected = selectedTools.includes(tool.name);
                  return (
                    <button
                      key={tool.name}
                      onClick={() => {
                        const current = inputs._selectedTools || [];
                        const next = isSelected
                          ? current.filter((t: string) => t !== tool.name)
                          : [...current, tool.name];
                        handleFieldChange('_selectedTools', next);
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-primary/5 border-primary/40'
                          : 'bg-card border-border hover:border-primary/20'
                      }`}
                    >
                      <span className="text-xs font-medium text-foreground font-body">{tool.name}</span>
                      <p className="text-[10px] text-muted-foreground mt-1 font-body">{tool.purpose}</p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onComplete}
                className="mt-4 group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(232,148,90,0.2)] transition-all font-body"
              >
                <Sparkles className="w-4 h-4" />
                Laag afronden
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default JourneyLayer;
