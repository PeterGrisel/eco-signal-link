import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/#doelgroepen", label: "Doelgroepen" },
  { href: "/#hoe-het-werkt", label: "Hoe het Werkt" },
  { href: "/#systeem", label: "Het Systeem" },
  { href: "/#datahub", label: "Datahub" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#resultaten", label: "Resultaten" },
];

const kennisLinks = [
  { href: "/blog", label: "Blog", description: "Artikelen & inzichten" },
  { href: "/over-ons", label: "Over Ons", description: "Het team achter B2BGroeiMachine" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [kennisOpen, setKennisOpen] = useState(false);
  const [mobileKennisOpen, setMobileKennisOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setKennisOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

          {/* Kennis dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setKennisOpen(!kennisOpen)}
              className="flex items-center gap-1 hover:text-primary transition-colors whitespace-nowrap"
            >
              Kennis
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${kennisOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {kennisOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
                >
                  {kennisLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setKennisOpen(false)}
                      className="block px-4 py-3 hover:bg-secondary transition-colors"
                    >
                      <span className="text-sm font-medium text-foreground">{link.label}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{link.description}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

              {/* Kennis section */}
              <button
                onClick={() => setMobileKennisOpen(!mobileKennisOpen)}
                className="flex items-center justify-between py-2.5 px-3 rounded-md text-foreground font-medium text-sm hover:bg-secondary transition-colors"
              >
                Kennis
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileKennisOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileKennisOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    {kennisLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => { setMobileOpen(false); setMobileKennisOpen(false); }}
                        className="block py-2 px-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

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
