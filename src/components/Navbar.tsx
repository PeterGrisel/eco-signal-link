import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/#doelgroepen", label: "Doelgroepen" },
  { href: "/#hoe-het-werkt", label: "Hoe het Werkt" },
  { href: "/#systeem", label: "Het Systeem" },
  { href: "/#datahub", label: "Datahub" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#resultaten", label: "Resultaten" },
  { href: "/over-ons", label: "Over Ons" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
        <a href="/" className="font-display font-bold text-lg md:text-xl tracking-tight">
          <span className="text-foreground">B2B</span>
          <span className="text-primary">GroeiMachine</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-foreground">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-primary transition-colors whitespace-nowrap">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="hero" size="sm" asChild className="hidden sm:inline-flex">
            <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
              Plan een Demo →
            </a>
          </Button>

          {/* Mobile/tablet toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Menu openen"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 px-3 rounded-md text-foreground font-medium text-sm hover:bg-secondary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-border mt-2">
                <Button variant="hero" size="sm" asChild className="w-full">
                  <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                    Plan een Demo →
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
