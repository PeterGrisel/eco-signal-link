import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Layers, Tag, HelpCircle, Phone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { trackCTA } from "@/lib/tracking";

/**
 * Mobile-only macOS-style bottom dock.
 * Replaces the dismissible sticky CTA bar.
 * Appears once the user scrolls past the hero (~300px).
 * Hides when the footer enters the viewport so it never overlaps.
 */
const MobileDock = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const obs = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(footer);
    return () => obs.disconnect();
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

  return (
    ((location.pathname.startsWith("/voor") && location.pathname !== "/voor/hego") || location.pathname.startsWith("/signaal") || location.pathname.startsWith("/admin")) ? null :
    <AnimatePresence>
      {visible && !footerVisible && (
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
            <a
              href="tel:+493075675721"
              onClick={() => trackCTA("Mobile Dock — Bel AI Assistent", "tel:+493075675721")}
              className="flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Phone className="w-4 h-4" />
              Bel AI Assistent
            </a>
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