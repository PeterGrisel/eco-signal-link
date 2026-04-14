import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import BlueprintPanel from "./BlueprintPanel";

interface MobileBlueprintDrawerProps {
  inputs: Record<number, Record<string, any>>;
  currentLayer: number;
  score: number;
}

const MobileBlueprintDrawer = ({ inputs, currentLayer, score }: MobileBlueprintDrawerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-background"
      >
        <div className="flex items-center gap-3">
          <span className="font-display text-sm text-foreground">Blueprint</span>
          <span className="font-mono text-xs text-primary">{score}/100</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="max-h-[50vh] overflow-y-auto">
              <BlueprintPanel inputs={inputs} currentLayer={currentLayer} score={score} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileBlueprintDrawer;
