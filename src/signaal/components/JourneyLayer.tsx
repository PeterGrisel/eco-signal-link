import { useState, useCallback } from "react";
import { LayerConfig } from "../data/layers";
import { motion, AnimatePresence } from "framer-motion";

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

  const requiredFilled = layer.wat.fields
    .filter(f => f.required)
    .every(f => {
      const val = inputs[f.key];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== '' && val !== null;
    });

  const handleFieldChange = useCallback((key: string, value: any) => {
    onInputChange(key, value);
  }, [onInputChange]);

  const handleFieldBlur = useCallback((key: string) => {
    const value = inputs[key];
    if (value && String(value).trim()) {
      onAskAgent(key, value);
    }
  }, [inputs, onAskAgent]);

  return (
    <div className="max-w-[600px] mx-auto">
      {/* Section label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Section badge */}
          <span className="inline-block font-mono text-xs tracking-widest text-[#E8FF47] mb-4 uppercase">
            {section}
          </span>

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
                className="mt-6 px-6 py-3 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-sm font-medium hover:bg-[#E8FF47]/90 transition-all font-['DM_Sans']"
              >
                Begrepen →
              </button>
            </div>
          )}

          {section === 'wat' && (
            <div className="space-y-6">
              <p className="text-sm text-[#6B6B72] font-['DM_Sans']">{layer.wat.instruction}</p>

              <div className="space-y-4">
                {layer.wat.fields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-medium text-[#F0F0EE] font-['DM_Sans']">
                      {field.label}
                      {field.required && <span className="text-[#E8FF47] ml-1">*</span>}
                    </label>

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
                  </div>
                ))}
              </div>

              <button
                onClick={() => layer.hoe ? setSection('hoe') : onComplete()}
                disabled={!requiredFilled}
                className="mt-4 px-6 py-3 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-sm font-medium disabled:opacity-30 hover:bg-[#E8FF47]/90 transition-all font-['DM_Sans']"
              >
                {layer.hoe ? 'Volgende →' : 'Laag afronden →'}
              </button>
            </div>
          )}

          {section === 'hoe' && layer.hoe && (
            <div className="space-y-6">
              <p className="text-sm text-[#6B6B72] font-['DM_Sans']">{layer.hoe.instruction}</p>

              <div className="grid grid-cols-2 gap-3">
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
                className="mt-4 px-6 py-3 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-sm font-medium hover:bg-[#E8FF47]/90 transition-all font-['DM_Sans']"
              >
                Laag afronden →
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default JourneyLayer;
