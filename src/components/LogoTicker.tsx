const partners = [
  { name: "HubSpot", src: "https://framerusercontent.com/images/OQRHjNMVSZUOIYMM7LiQBxY.png" },
  { name: "Salesforce", src: "https://framerusercontent.com/images/6bIbNMaWePYZuIVcJKHiSfOVUE.png" },
  { name: "LinkedIn", src: "https://framerusercontent.com/images/lMGNFLOscvlDPBuCpFfqPkxA.png" },
  { name: "Lemlist", src: "https://framerusercontent.com/images/cFgvWjviTpBOF1OOjOKi3kOcs.png" },
  { name: "Clay", src: "https://framerusercontent.com/images/lNZtFKJlIVbGzwSFj8HyPh0D1qs.png" },
  { name: "Make", src: "https://framerusercontent.com/images/LQzYEKXQKLO6e36cxFfuaAJhqQ.png" },
  { name: "Apollo", src: "https://framerusercontent.com/images/j7jFbPRjL0P9VDOlsPEj2bYNw.png" },
  { name: "Zapier", src: "https://framerusercontent.com/images/gNqEeHehW5HrDJd6v0Ks1ElqPjE.png" },
];

const LogoTicker = () => {
  return (
    <section className="border-t border-border/30 bg-background py-8">
      <div className="container mx-auto px-4 mb-4">
        <p className="text-xs font-display uppercase tracking-[0.25em] text-muted-foreground text-center">
          Proud Partners OF:
        </p>
      </div>
      <div className="overflow-hidden">
        <div className="flex animate-marquee w-max">
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-8 md:mx-12 shrink-0"
            >
              <img
                src={partner.src}
                alt={partner.name}
                className="h-8 md:h-10 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoTicker;
