import InfiniteSlider from "../ui/InfiniteSlider";

const CLIENTS = [
  "norva",
  "SOLVENTIS",
  "ClearPeak",
  "datavanta",
  "Northbyte",
  "terranova",
  "FintechOS",
  "axento",
];

const ExactLogoWall = () => (
  <section className="py-10 md:py-14 border-y border-primary/10 bg-card/20">
    <div className="container mx-auto px-4 md:px-6">
      <p className="text-center text-[11px] font-display font-semibold tracking-[0.28em] uppercase text-muted-foreground mb-7">
        Vertrouwd door ambitieuze B2B teams
      </p>
      <InfiniteSlider
        speed={45}
        items={CLIENTS.map((name) => (
          <span
            key={name}
            className="inline-flex items-center px-6 font-display font-semibold text-xl md:text-2xl tracking-tight text-foreground/55 hover:text-foreground transition-colors"
            style={{ letterSpacing: name === name.toUpperCase() ? "0.2em" : undefined }}
          >
            {name}
          </span>
        ))}
      />
    </div>
  </section>
);

export default ExactLogoWall;