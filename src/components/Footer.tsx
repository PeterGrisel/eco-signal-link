import { sectors } from "@/data/sectors";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Sector links grid */}
        <div className="mb-10">
          <p className="text-xs font-display font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">
            Sectoren
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sectors.map((s) => (
              <a
                key={s.slug}
                href={`/sectoren/${s.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display font-bold text-lg">
              <span className="text-foreground">B2B</span>
              <span className="text-primary">GroeiMachine</span>
            </span>
            <p className="text-muted-foreground text-sm mt-1">Signal-Based Prospecting Systems</p>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="https://rebelforce.nl" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              rebelforce.nl
            </a>
            <a href="https://ai-fctry.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              AI-FCTRY
            </a>
            <a href="https://rebelforce-hubs.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              RebelHub
            </a>
          </div>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} B2BGroeiMachine · powered by Rebel Force™
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
