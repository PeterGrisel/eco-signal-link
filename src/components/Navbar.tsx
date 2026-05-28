import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CtaLink from "@/components/CtaLink";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const ctaClasses =
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-primary/40 bg-gradient-to-r from-primary via-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)] transition-all hover:shadow-[0_0_32px_-4px_hsl(var(--primary)/0.9)] hover:-translate-y-0.5";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
        <a href="/" className="font-display font-bold text-lg md:text-xl tracking-tight">
          <span className="text-foreground">B2B</span>
          <span className="text-primary">GroeiMachine</span>
        </a>

        <div className="flex items-center gap-2">
          <CtaLink
            intent="gratisScan"
            location="Navbar"
            className={`hidden sm:inline-flex ${ctaClasses}`}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Rocket className="w-4 h-4 relative" />
            <span className="relative">Start gratis scan</span>
            <ArrowRight className="w-4 h-4 relative transition-transform group-hover:translate-x-0.5" />
          </CtaLink>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 text-foreground"
            aria-label="Menu openen"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <CtaLink
                intent="gratisScan"
                location="Navbar (mobile)"
                className={`w-full justify-center ${ctaClasses}`}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Rocket className="w-4 h-4 relative" />
                <span className="relative">Start gratis scan</span>
                <ArrowRight className="w-4 h-4 relative" />
              </CtaLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
