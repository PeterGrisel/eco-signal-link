const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
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
