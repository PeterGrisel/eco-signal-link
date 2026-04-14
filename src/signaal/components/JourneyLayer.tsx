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
}

const JourneyLayer = ({ layer, inputs, completedLayers, onInputChange, onComplete, onAskAgent }: JourneyLayerProps) => {
  const [section, setSection] = useState<Section>('waarom');
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());

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
        <h1 className="font-['DM_Serif_Display'] text-xl text-[#F0F0EE]">{layer.title}</h1>
        {layer.scoreContribution > 0 && (
          <span className="ml-auto font-mono text-[10px] text-[#6B6B72]">+{layer.scoreContribution}pts</span>
        )}
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-[#111113] rounded-lg border border-[#1E1E22]">
        {(['waarom', 'wat', ...(layer.hoe ? ['hoe'] : [])] as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-['DM_Sans'] font-medium transition-all ${
              section === s
                ? 'bg-[#1E1E22] text-[#E8FF47]'
                : 'text-[#6B6B72] hover:text-[#F0F0EE]'
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
              <h2 className="font-['DM_Serif_Display'] text-[28px] leading-tight text-[#F0F0EE]">
                {layer.waarom.headline}
              </h2>
              <div className="space-y-4 text-sm text-[#6B6B72] leading-relaxed font-['DM_Sans']">
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
                  className="rounded-xl border border-[#1E1E22] bg-[#111113] overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1E1E22] bg-[#0E0E10]">
                    <div className="w-7 h-7 rounded-lg bg-[#E8FF47]/10 flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-[#E8FF47]" />
                    </div>
                    <span className="font-['DM_Sans'] text-xs font-semibold text-[#F0F0EE]">Velox Solutions</span>
                    <span className="ml-auto font-mono text-[9px] text-[#6B6B72] uppercase tracking-wider">Case Study</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm text-[#9B9BA0] leading-relaxed font-['DM_Sans']">
                      {layer.waarom.caseStudy.situation}
                    </p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[#E8FF47]/[0.04] border border-[#E8FF47]/10">
                      <Lightbulb className="w-4 h-4 text-[#E8FF47] mt-0.5 shrink-0" />
                      <p className="text-sm text-[#E8FF47]/90 font-['DM_Sans']">
                        {layer.waarom.caseStudy.result}
                      </p>
                    </div>
                    <p className="text-xs text-[#6B6B72] italic font-['DM_Sans']">
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
                    <p className="mt-1.5 text-[10px] text-[#6B6B72] font-['DM_Sans'] uppercase tracking-wider">{layer.waarom.stats.before.label}</p>
                  </div>
                  <div className="rounded-xl border border-[#34D399]/20 bg-[#34D399]/[0.04] p-4 text-center relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#1E1E22] flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-[#34D399]" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-[#34D399]">{layer.waarom.stats.after.value}</span>
                    <p className="mt-1.5 text-[10px] text-[#6B6B72] font-['DM_Sans'] uppercase tracking-wider">{layer.waarom.stats.after.label}</p>
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
                    <span className="font-['DM_Sans'] text-xs font-semibold text-[#F97316]">{layer.waarom.mistake.title}</span>
                  </div>
                  <p className="text-sm text-[#9B9BA0] leading-relaxed font-['DM_Sans']">
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
                  className="flex items-start gap-3 p-4 rounded-xl border border-[#E8FF47]/20 bg-[#E8FF47]/[0.03]"
                >
                  <Quote className="w-5 h-5 text-[#E8FF47] shrink-0 mt-0.5" />
                  <p className="font-['DM_Serif_Display'] text-base text-[#E8FF47] leading-snug">
                    "{layer.waarom.principle}"
                  </p>
                </motion.div>
              )}

              <button
                onClick={() => setSection('wat')}
                className="mt-6 group flex items-center gap-2 px-6 py-3 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(232,255,71,0.2)] transition-all font-['DM_Sans']"
              >
                Begrepen
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {section === 'wat' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B6B72] font-['DM_Sans']">{layer.wat.instruction}</p>
                <span className="font-mono text-[10px] text-[#6B6B72]">
                  {filledCount}/{totalFields}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-[#1E1E22] rounded-full overflow-hidden">
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
                        ? 'border-[#E8FF47]/20 bg-[#E8FF47]/[0.02]'
                        : 'border-transparent'
                    }`}
                    layout
                  >
                    <label className="flex items-center gap-2 text-xs font-medium text-[#F0F0EE] font-['DM_Sans']">
                      {field.label}
                      {field.required && <span className="text-[#E8FF47] ml-1">*</span>}
                      {completedFields.has(field.key) && (
                        <Check className="w-3 h-3 text-[#E8FF47] ml-auto" />
                      )}
                    </label>

                    {field.type === 'checkbox' && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange(field.key, !inputs[field.key])}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-['DM_Sans'] transition-all ${
                          inputs[field.key]
                            ? 'bg-[#E8FF47]/10 border-[#E8FF47]/40 text-[#E8FF47]'
                            : 'bg-[#111113] border-[#1E1E22] text-[#6B6B72] hover:border-[#E8FF47]/20'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          inputs[field.key] ? 'bg-[#E8FF47] border-[#E8FF47]' : 'border-[#6B6B72]'
                        }`}>
                          {inputs[field.key] && <Check className="w-3 h-3 text-[#0A0A0B]" />}
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
                        className="w-full bg-[#111113] border border-[#1E1E22] rounded-lg px-3 py-2.5 text-sm text-[#F0F0EE] placeholder:text-[#6B6B72]/50 focus:outline-none focus:border-[#E8FF47]/40 font-['DM_Sans'] transition-colors"
                      />
                    )}

                    {field.type === 'textarea' && (
                      <textarea
                        value={inputs[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        onBlur={() => handleFieldBlur(field.key)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full bg-[#111113] border border-[#1E1E22] rounded-lg px-3 py-2.5 text-sm text-[#F0F0EE] placeholder:text-[#6B6B72]/50 focus:outline-none focus:border-[#E8FF47]/40 font-['DM_Sans'] transition-colors resize-none"
                      />
                    )}

                    {field.type === 'dropdown' && (
                      <select
                        value={inputs[field.key] || ''}
                        onChange={(e) => { handleFieldChange(field.key, e.target.value); handleFieldBlur(field.key); }}
                        className="w-full bg-[#111113] border border-[#1E1E22] rounded-lg px-3 py-2.5 text-sm text-[#F0F0EE] focus:outline-none focus:border-[#E8FF47]/40 font-['DM_Sans'] transition-colors"
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
                              className={`px-3 py-1.5 rounded-lg text-xs font-['DM_Sans'] transition-all border ${
                                selected
                                  ? 'bg-[#E8FF47]/10 border-[#E8FF47]/40 text-[#E8FF47]'
                                  : 'bg-[#111113] border-[#1E1E22] text-[#6B6B72] hover:border-[#E8FF47]/20'
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
                        className="w-full bg-[#111113] border border-[#1E1E22] rounded-lg px-3 py-2.5 text-sm text-[#F0F0EE] focus:outline-none focus:border-[#E8FF47]/40 font-mono transition-colors"
                      />
                    )}

                    {/* Velox Tip — shows when field is filled */}
                    {completedFields.has(field.key) && layer.wat.veloxTips?.find(t => t.fieldKey === field.key) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-[#E8FF47]/[0.04] border border-[#E8FF47]/10"
                      >
                        <Building2 className="w-3.5 h-3.5 text-[#E8FF47] mt-0.5 shrink-0" />
                        <p className="text-[11px] text-[#E8FF47]/80 leading-relaxed font-['DM_Sans']">
                          <span className="font-semibold text-[#E8FF47]">Velox Tip:</span>{' '}
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
                  className="rounded-xl border border-[#1E1E22] bg-[#111113] overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#1E1E22] bg-[#0E0E10]">
                    <Building2 className="w-3.5 h-3.5 text-[#E8FF47]" />
                    <span className="font-['DM_Sans'] text-[10px] font-semibold text-[#9B9BA0] uppercase tracking-wider">Velox's reis tot nu toe</span>
                  </div>
                  <div className="p-3 space-y-0">
                    {LAYERS.filter(l => completedLayers.includes(l.id)).map((l, i, arr) => (
                      <div key={l.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: l.themeColor + '20', borderColor: l.themeColor + '60', borderWidth: 1 }}>
                            <Check className="w-2.5 h-2.5" style={{ color: l.themeColor }} />
                          </div>
                          {i < arr.length - 1 && <div className="w-px h-5 bg-[#1E1E22]" />}
                        </div>
                        <div className="pb-3">
                          <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: l.themeColor }}>{String(l.id).padStart(2, '0')} {l.title}</span>
                          <p className="text-[11px] text-[#6B6B72] leading-relaxed font-['DM_Sans'] mt-0.5">{l.veloxMilestone}</p>
                        </div>
                      </div>
                    ))}
                    {/* Current layer indicator */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-[#E8FF47]/40 bg-[#E8FF47]/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E8FF47] animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#E8FF47]">{String(layer.id).padStart(2, '0')} {layer.title}</span>
                        <p className="text-[11px] text-[#E8FF47]/60 font-['DM_Sans'] mt-0.5">Jouw beurt...</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => layer.hoe ? setSection('hoe') : onComplete()}
                disabled={!requiredFilled}
                className="mt-4 group flex items-center gap-2 px-6 py-3 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-sm font-medium disabled:opacity-30 hover:shadow-[0_0_20px_rgba(232,255,71,0.2)] transition-all font-['DM_Sans']"
              >
                {layer.hoe ? 'Volgende' : 'Laag afronden'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {section === 'hoe' && layer.hoe && (
            <div className="space-y-6">
              <p className="text-sm text-[#6B6B72] font-['DM_Sans']">{layer.hoe.instruction}</p>

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
                          ? 'bg-[#E8FF47]/5 border-[#E8FF47]/40'
                          : 'bg-[#111113] border-[#1E1E22] hover:border-[#E8FF47]/20'
                      }`}
                    >
                      <span className="text-xs font-medium text-[#F0F0EE] font-['DM_Sans']">{tool.name}</span>
                      <p className="text-[10px] text-[#6B6B72] mt-1 font-['DM_Sans']">{tool.purpose}</p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onComplete}
                className="mt-4 group flex items-center gap-2 px-6 py-3 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(232,255,71,0.2)] transition-all font-['DM_Sans']"
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
