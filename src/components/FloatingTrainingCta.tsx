import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Signal, X, Check, ArrowRight } from "lucide-react";
import { trackCTA } from "@/lib/tracking";

const FloatingTrainingCta = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Hide on signaal routes and admin routes
  if (location.pathname.startsWith("/signaal") || location.pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Popup card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 z-[95] w-[90vw] max-w-sm"
          >
            <div className="relative rounded-xl border border-primary/30 bg-card p-6 shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Signal className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">Signaal Detectiesysteem</h3>
                  <p className="text-xs text-muted-foreground">90 min · 7 lagen · AI-gestuurd</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Bouw uw eigen geautomatiseerde prospecting-machine. Van signaal tot pipeline in 7 lagen met AI-agent, blueprint en installatie-checklists.
              </p>
              <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Direct toegang</span>
                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Geen abonnement</span>
                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Partner badge</span>
              </div>
              <Link
                to="/signaal"
        onClick={() => {
          trackCTA("Floating Training CTA — Bekijk training", "/signaal");
          setOpen(false);
        }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors group"
              >
                Bekijk training — €97
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button — positioned left of WhatsApp button */}
      <motion.button
        onClick={() => {
          if (!open) trackCTA("Floating Training CTA — Open popup", location.pathname);
          setOpen(prev => !prev);
        }}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, type: "spring", damping: 20 }}
        className={`fixed bottom-6 right-[5.5rem] z-[95] flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all font-display font-semibold text-sm ${
          open
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] animate-pulse hover:animate-none"
        }`}
      >
        <Signal className="w-4 h-4" />
        {open ? "Sluiten" : "Training"}
      </motion.button>
    </>
  );
};

export default FloatingTrainingCta;
