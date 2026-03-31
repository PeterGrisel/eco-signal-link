import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { getConsent, setConsent } from "@/lib/cookieConsent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    // Small delay so it doesn't flash on load
    const timer = setTimeout(() => {
      if (!getConsent()) setVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const save = (analyticsVal: boolean, marketingVal: boolean) => {
    setConsent({ analytics: analyticsVal, marketing: marketingVal });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-5 md:p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-base">
                Wij respecteren uw privacy
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Wij gebruiken cookies om onze website te verbeteren en uw ervaring te personaliseren. 
                Lees meer in ons{" "}
                <Link to="/cookies" className="underline text-primary hover:text-primary/80 transition-colors">
                  cookiebeleid
                </Link>.
              </p>
            </div>
          </div>

          {/* Expandable categories */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            Voorkeuren aanpassen
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-4"
              >
                <div className="space-y-3 pb-1">
                  {/* Necessary */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                    <div>
                      <span className="text-sm font-medium text-foreground">Noodzakelijk</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Essentieel voor het functioneren van de website. Altijd actief.
                      </p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" checked disabled className="sr-only peer" />
                      <div className="w-9 h-5 rounded-full bg-primary/60 cursor-not-allowed" />
                      <div className="absolute top-0.5 left-[18px] w-4 h-4 rounded-full bg-primary-foreground shadow-sm" />
                    </div>
                  </label>

                  {/* Analytics */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border cursor-pointer hover:bg-secondary/80 transition-colors">
                    <div>
                      <span className="text-sm font-medium text-foreground">Analytisch</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Helpt ons inzicht krijgen in websitegebruik (bijv. Google Analytics).
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={analytics}
                      onClick={() => setAnalytics(!analytics)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${analytics ? "bg-primary" : "bg-muted-foreground/30"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary-foreground shadow-sm transition-transform ${analytics ? "left-[18px]" : "left-0.5"}`} />
                    </button>
                  </label>

                  {/* Marketing */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border cursor-pointer hover:bg-secondary/80 transition-colors">
                    <div>
                      <span className="text-sm font-medium text-foreground">Marketing</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Wordt gebruikt om advertenties relevanter te maken (bijv. Meta Pixel).
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={marketing}
                      onClick={() => setMarketing(!marketing)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${marketing ? "bg-primary" : "bg-muted-foreground/30"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary-foreground shadow-sm transition-transform ${marketing ? "left-[18px]" : "left-0.5"}`} />
                    </button>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => save(false, false)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:bg-secondary/80 transition-colors"
            >
              Alleen noodzakelijk
            </button>
            {expanded && (
              <button
                onClick={() => save(analytics, marketing)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-primary/30 text-foreground bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                Voorkeuren opslaan
              </button>
            )}
            <button
              onClick={() => save(true, true)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Alles accepteren
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
