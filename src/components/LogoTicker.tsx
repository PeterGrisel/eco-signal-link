const partners = [
  "HubSpot",
  "Salesforce",
  "LinkedIn",
  "Lemlist",
  "Clay",
  "Make",
  "Apollo",
  "Zapier",
  "Instantly",
  "SmartLead",
];

const LogoTicker = () => {
  return (
    <section className="border-t border-border/30 bg-background py-10">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-xs font-display uppercase tracking-[0.25em] text-muted-foreground text-center">
          Proud Partners OF:
        </p>
      </div>
      <div className="overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {[...partners, ...partners].map((name, i) => (
            <span
              key={i}
              className="mx-8 md:mx-14 shrink-0 text-lg md:text-xl font-display font-bold text-muted-foreground/40 hover:text-primary transition-colors duration-300 select-none whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoTicker;
