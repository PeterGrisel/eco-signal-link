import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CtaLink from "@/components/CtaLink";
import { trackCTA } from "@/lib/tracking";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Hoe het werkt", href: "/hoe-het-werkt" },
  { label: "Groeistack", href: "/groeistack" },
  { label: "Pricing", href: "/pipeline-equation" },
  { label: "Trainingen", href: "/trainingen" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const ctaClasses =
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-primary/40 bg-gradient-to-r from-primary via-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)] transition-all hover:shadow-[0_0_32px_-4px_hsl(var(--primary)/0.9)] hover:-translate-y-0.5";

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
        <Link
          to="/"
          className="font-display font-bold text-lg md:text-xl tracking-tight shrink-0"
        >
          <span className="text-foreground">B2B</span>
          <span className="text-primary">GroeiMachine</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => trackCTA(`Navbar — ${link.label}`, link.href)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                isActive(link.href)
                  ? "text-foreground"
                  : "text-foreground/65 hover:text-foreground"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-primary" />
              )}
            </Link>
          ))}
        </div>

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
            className="md:hidden p-2 text-foreground"
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
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => {
                    trackCTA(`Navbar (mobile) — ${link.label}`, link.href);
                    setMobileOpen(false);
                  }}
                  className={`px-3 py-2.5 text-sm font-medium rounded-md ${
                    isActive(link.href)
                      ? "text-foreground bg-muted"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <CtaLink
                intent="gratisScan"
                location="Navbar (mobile)"
                className={`mt-3 w-full justify-center ${ctaClasses}`}
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
