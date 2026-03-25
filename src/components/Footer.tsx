import { sectors } from "@/data/sectors";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Sector links */}
        <div className="py-10 border-b border-border">
          <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-5">
            Sectoren
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-2.5">
            {sectors.map((s) => (
              <Link
                key={s.slug}
                to={`/sectoren/${s.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="font-display font-bold text-lg inline-block">
              <span className="text-foreground">B2B</span>
              <span className="text-primary">GroeiMachine</span>
            </Link>
            <p className="text-muted-foreground/60 text-xs mt-0.5">Signal-Based Prospecting Systems</p>
          </div>

          {/* Ecosystem links */}
          <nav className="flex items-center gap-6 text-sm">
            <a
              href="https://rebelforce.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              rebelforce.nl
            </a>
            <span className="w-px h-3.5 bg-border" />
            <a
              href="https://ai-fctry.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              AI-FCTRY
            </a>
            <span className="w-px h-3.5 bg-border" />
            <a
              href="https://rebelforce-hubs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              RebelHub
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-muted-foreground/50 text-xs flex-shrink-0">
            © {new Date().getFullYear()} B2BGroeiMachine · powered by Rebel Force™
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
