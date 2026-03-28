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

const clients = [
  { name: "Krak de Rijder", url: "https://www.krakderijder.nl/" },
  { name: "Excelsior Rotterdam", url: "https://excelsiorrotterdam.nl/" },
  { name: "Core Vision", url: "https://www.core-vision.nl/" },
  { name: "GoBytes", url: "https://gobytes.nl/" },
  { name: "Nexer", url: "https://nexer.nl/" },
  { name: "Rebel Force", url: "https://www.rebelforce.nl/" },
  { name: "Exes Engineering", url: "https://exesengineering.nl/" },
  { name: "Datahub", url: "https://datahub.nl/" },
  { name: "Drivewise Lease", url: "https://www.drivewiselease.nl/" },
  { name: "Sascha del Sal", url: "https://saschadelsal.com/" },
];

const LogoTicker = () => {
  // Repeat enough times to fill ultra-wide screens
  const repeated = [...partners, ...partners, ...partners, ...partners];
  const repeatedClients = [...clients, ...clients, ...clients, ...clients, ...clients, ...clients];

  return (
    <section className="border-t border-border/30 bg-background py-10">
      {/* Clients ticker */}
      <div className="container mx-auto px-4 mb-6">
        <p className="text-xs font-display uppercase tracking-[0.25em] text-muted-foreground text-center">
          Werkt voor:
        </p>
      </div>
      <div className="overflow-hidden relative mb-10">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {repeatedClients.map((client, i) => (
            <a
              key={i}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-8 md:mx-14 shrink-0 text-lg md:text-xl font-display font-bold text-foreground/60 hover:text-primary transition-colors duration-300 select-none whitespace-nowrap"
            >
              {client.name}
            </a>
          ))}
        </div>
      </div>

      {/* Partners ticker */}
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
          {repeated.map((name, i) => (
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
