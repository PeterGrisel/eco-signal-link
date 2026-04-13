import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Brain, LayoutDashboard, ChevronRight, X } from "lucide-react";

interface JourneyOnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: LayoutDashboard,
    title: "Blueprint",
    subtitle: "Links",
    description: "Je blueprint groeit mee terwijl je lagen invult. Elke configuratie verschijnt direct in je persoonlijke systeemdocument.",
    color: "#E8FF47",
  },
  {
    icon: FileText,
    title: "Journey Engine",
    subtitle: "Midden",
    description: "Per laag doorloop je drie stappen: Waarom (de theorie), Configuratie (jouw keuzes) en Tools (de executie). 7 lagen, 1 systeem.",
    color: "#60A5FA",
  },
  {
    icon: Brain,
    title: "Systeem Agent",
    subtitle: "Rechts",
    description: "Je AI-sparringpartner. Stelt scherpe vragen als je input vaag is, signaleert inconsistenties tussen lagen, en bevestigt sterke keuzes.",
    color: "#2DD4BF",
  },
];

const JourneyOnboarding = ({ onComplete }: JourneyOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0A0A0B]/95 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 text-[#6B6B72] hover:text-[#F0F0EE] transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-md w-full">
        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-[#E8FF47]' : i < currentStep ? 'w-4 bg-[#E8FF47]/40' : 'w-4 bg-[#1E1E22]'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border"
              style={{ borderColor: step.color + '30', backgroundColor: step.color + '08' }}
            >
              <Icon className="w-7 h-7" style={{ color: step.color }} />
            </div>

            {/* Subtitle */}
            <span className="font-mono text-[10px] tracking-widest uppercase mb-2 block" style={{ color: step.color }}>
              {step.subtitle}
            </span>

            {/* Title */}
            <h2 className="font-['DM_Serif_Display'] text-3xl text-[#F0F0EE] mb-4">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-[#6B6B72] leading-relaxed font-['DM_Sans'] mb-10 max-w-sm mx-auto">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Action button */}
        <button
          onClick={handleNext}
          className="w-full group flex items-center justify-center gap-2 py-3.5 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(232,255,71,0.2)] transition-all font-['DM_Sans']"
        >
          {currentStep < steps.length - 1 ? 'Volgende' : 'Start de journey'}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Skip */}
        {currentStep < steps.length - 1 && (
          <button
            onClick={onComplete}
            className="w-full mt-3 py-2 text-xs text-[#6B6B72] hover:text-[#F0F0EE] transition-colors font-['DM_Sans']"
          >
            Overslaan
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default JourneyOnboarding;