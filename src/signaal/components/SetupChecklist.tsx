import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ExternalLink, Clock, Wrench, ChevronDown, ChevronUp } from "lucide-react";
import { ToolSetupGuide } from "../data/toolSetupGuides";

interface SetupChecklistProps {
  guides: ToolSetupGuide[];
}

const categoryLabels: Record<string, string> = {
  data: 'Databronnen',
  automation: 'Automatisering',
  outreach: 'Outreach',
};

const categoryOrder = ['data', 'automation', 'outreach'];

const SetupChecklist = ({ guides }: SetupChecklistProps) => {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());
  const [expandedTools, setExpandedTools] = useState<Set<string>>(() => new Set(guides.map(g => g.name)));

  const toggleStep = (key: string) => {
    setCheckedSteps(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleTool = (name: string) => {
    setExpandedTools(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const totalSteps = guides.reduce((sum, g) => sum + g.steps.length, 0);
  const completedSteps = checkedSteps.size;
  const totalMinutes = guides.reduce((sum, g) => sum + g.estimatedMinutes, 0);

  // Group by category
  const grouped = categoryOrder
    .map(cat => ({
      category: cat,
      label: categoryLabels[cat],
      tools: guides.filter(g => g.category === cat),
    }))
    .filter(g => g.tools.length > 0);

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
        <Wrench className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-body text-xs font-medium text-muted-foreground">Installatie voortgang</span>
            <span className="font-mono text-xs font-bold text-primary">{completedSteps}/{totalSteps}</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5 pl-3 border-l border-border shrink-0">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground">~{totalMinutes} min totaal</span>
        </div>
      </div>

      {/* Tool groups */}
      {grouped.map((group) => (
        <div key={group.category} className="space-y-3">
          <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider">
            {group.label}
          </h3>

          {group.tools.map((guide, toolIndex) => {
            const isExpanded = expandedTools.has(guide.name);
            const toolStepsCompleted = guide.steps.filter((_, i) => checkedSteps.has(`${guide.name}-${i}`)).length;
            const allDone = toolStepsCompleted === guide.steps.length;

            return (
              <motion.div
                key={guide.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: toolIndex * 0.05 }}
                className={`rounded-xl border transition-colors ${
                  allDone ? 'border-[#34D399]/30 bg-[#34D399]/[0.03]' : 'border-border bg-card'
                }`}
              >
                {/* Tool header */}
                <button
                  onClick={() => toggleTool(guide.name)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    allDone ? 'bg-[#34D399]/20' : 'bg-primary/10'
                  }`}>
                    {allDone ? (
                      <Check className="w-3.5 h-3.5 text-[#34D399]" />
                    ) : (
                      <span className="font-mono text-[9px] text-primary">{toolStepsCompleted}/{guide.steps.length}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-body text-sm font-medium text-foreground">{guide.name}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-muted-foreground">~{guide.estimatedMinutes} min</span>
                      <a
                        href={guide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-0.5 text-[10px] text-primary hover:text-primary/80 font-body transition-colors"
                      >
                        Website <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {/* Steps */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-1">
                    {guide.steps.map((step, stepIndex) => {
                      const stepKey = `${guide.name}-${stepIndex}`;
                      const isChecked = checkedSteps.has(stepKey);

                      return (
                        <button
                          key={stepIndex}
                          onClick={() => toggleStep(stepKey)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors ${
                            isChecked ? 'bg-[#34D399]/[0.04]' : 'hover:bg-secondary/50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-[#34D399] border-[#34D399]'
                              : 'border-border'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`font-body text-xs font-medium transition-colors ${
                              isChecked ? 'text-muted-foreground line-through' : 'text-foreground'
                            }`}>
                              {step.action}
                            </span>
                            {step.detail && (
                              <p className="text-[10px] text-muted-foreground/70 mt-0.5 font-body leading-relaxed">
                                {step.detail}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SetupChecklist;
