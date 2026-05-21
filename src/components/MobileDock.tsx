import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Layers, Tag, HelpCircle, Calendar } from "lucide-react";
import { trackCTA } from "@/lib/tracking";

/**
 * Mobile-only macOS-style bottom dock.
 * Replaces the dismissible sticky CTA bar.
 * Appears once the user scrolls past the hero (~300px).
 */
const MobileDock = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id: string, label: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      trackCTA(`Mobile Dock — ${label}`, `#${id}`);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackCTA("Mobile Dock — Top", "/");
  };

  const openBooking = () => {
    import("@/components/booking/GlobalBookingModal").then((m) =>
      m.openBookingModal()
    );
    trackCTA("Mobile Dock — Boek gratis scan", "#boek-gratis-scan");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          aria-label="Mobiele navigatie"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-sm flex items-center justify-around gap-1 rounded-2xl border border-primary/30 bg-background/85 backdrop-blur-xl shadow-2xl px-2 py-2">
            <DockButton onClick={scrollTop} label="Top">
              <ArrowUp className="w-5 h-5" />
            </DockButton>
            <DockButton onClick={() => goTo("chapter-04", "Methode")} label="Methode">
              <Layers className="w-5 h-5" />
            </DockButton>
            <DockButton onClick={() => goTo("pricing", "Pricing")} label="Prijzen">
              <Tag className="w-5 h-5" />
            </DockButton>
            <DockButton onClick={() => goTo("faq", "FAQ")} label="FAQ">
              <HelpCircle className="w-5 h-5" />
            </DockButton>
            <button
              onClick={openBooking}
              className="flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Calendar className="w-4 h-4" />
              Boek scan
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

const DockButton = ({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
  >
    {children}
    <span className="text-[10px] leading-none">{label}</span>
  </button>
);

export default MobileDock;