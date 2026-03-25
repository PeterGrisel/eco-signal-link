import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a href="/" className="font-display font-bold text-xl tracking-tight">
          <span className="text-foreground">B2B</span>
          <span className="text-primary">GroeiMachine</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-base font-medium text-foreground">
          <a href="/#doelgroepen" className="hover:text-primary transition-colors">Doelgroepen</a>
          <a href="/#hoe-het-werkt" className="hover:text-primary transition-colors">Hoe het Werkt</a>
          <a href="/#systeem" className="hover:text-primary transition-colors">Het Systeem</a>
          <a href="/#datahub" className="hover:text-primary transition-colors">Datahub</a>
          <a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <a href="/#resultaten" className="hover:text-primary transition-colors">Resultaten</a>
          <a href="/over-ons" className="hover:text-primary transition-colors">Over Ons</a>
        </div>

        <Button variant="hero" size="sm" asChild>
          <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
            Plan een Demo →
          </a>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
