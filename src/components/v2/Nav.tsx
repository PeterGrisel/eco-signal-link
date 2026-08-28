import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./Button";
import { Container } from "./Container";
import { ScrollProgress } from "./ScrollProgress";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { trackCTA } from "@/lib/tracking";

const links = [
  ["De engine", "/#engine"],
  ["Architectuur", "/#architectuur"],
  ["Diensten", "/#diensten"],
  ["Prijzen", "/pricing"],
  ["Playbooks", "/playbooks"],
  ["Blog", "/blog"],
] as const;

const linkClass =
  "relative py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-2 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brand-accent after:transition-transform after:duration-200 hover:text-brand-ink hover:after:scale-x-100";

export function Nav() {
  const [open, setOpen] = useState(false);

  function book() {
    trackCTA("nav_plan_gesprek", "navbar");
    openBookingModal();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-line bg-brand-ground/90 backdrop-blur-[10px]">
      <Container className="flex items-center justify-between gap-7 py-4">
        <Link to="/" aria-label="B2B Groeimachine, home" className="shrink-0">
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-brand-ink">B2B</span>
            <span className="text-brand-accent">GroeiMachine</span>
          </span>
        </Link>

        <div className="hidden gap-7 lg:flex">
          {links.map(([label, href]) =>
            href.startsWith("/#") ? (
              <a key={label} href={href} className={linkClass}>
                {label}
              </a>
            ) : (
              <Link key={label} to={href} className={linkClass}>
                {label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:block">
            <Button onClick={book}>Plan een kennismaking</Button>
          </span>
          <button
            type="button"
            aria-label={open ? "Sluit menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-brand-line p-2 text-brand-ink lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-brand-line bg-brand-ground lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map(([label, href]) =>
              href.startsWith("/#") ? (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 font-display text-sm font-semibold text-brand-ink"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 font-display text-sm font-semibold text-brand-ink"
                >
                  {label}
                </Link>
              ),
            )}
            <span className="pt-3 md:hidden">
              <Button onClick={book}>Plan een kennismaking</Button>
            </span>
          </Container>
        </div>
      )}

      <ScrollProgress />
    </nav>
  );
}
