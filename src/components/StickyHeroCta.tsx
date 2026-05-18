import { forwardRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { trackCTA } from "@/lib/tracking";

/**
 * Mobile-only sticky bottom CTA bar.
 * Appears once the user scrolls past the hero (~300px) and remains
 * visible during the rest of the page so the 78% who never reach
 * the next section still see a primary conversion path.
 *
 * Dismissible per-session via sessionStorage.
 */
const STORAGE_KEY = "sticky_hero_cta_dismissed";

const StickyHeroCta = forwardRef<HTMLDivElement>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setDismissed(true);
      return;
    }

    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
    trackCTA("Sticky Hero CTA — Dismissed", window.location.pathname);
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-md flex items-stretch gap-2 rounded-xl border border-primary/30 bg-background/90 backdrop-blur-xl shadow-2xl p-2">
            <a
              href="https://app.usemotion.com/meet/Rebel-Force/meeting"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackCTA(
                  "Sticky Hero CTA — Plan de nulmeting",
                  "https://app.usemotion.com/meet/Rebel-Force/meeting"
                )
              }
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-3 font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Calendar className="w-4 h-4" />
              Plan de nulmeting
            </a>
            <button
              onClick={handleDismiss}
              aria-label="Sluiten"
              className="flex-shrink-0 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
StickyHeroCta.displayName = "StickyHeroCta";

export default StickyHeroCta;
