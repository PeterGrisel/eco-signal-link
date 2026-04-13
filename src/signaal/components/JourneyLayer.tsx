import { useState, useCallback, useMemo } from "react";
import { LayerConfig } from "../data/layers";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Sparkles } from "lucide-react";

type Section = 'waarom' | 'wat' | 'hoe';

interface JourneyLayerProps {
  layer: LayerConfig;
  inputs: Record<string, any>;
  onInputChange: (fieldKey: string, value: any) => void;
  onComplete: () => void;
  onAskAgent: (fieldKey: string, value: any) => void;
}

const JourneyLayer = ({ layer, inputs, onInputChange, onComplete, onAskAgent }: JourneyLayerProps) => {
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
                  </motion.div>
                ))}
              </div>

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
