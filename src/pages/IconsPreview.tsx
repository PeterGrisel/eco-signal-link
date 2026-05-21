import { bgmIcons } from "@/components/icons";

const IconsPreview = () => {
  const entries = Object.entries(bgmIcons);
  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">
            Brand Icons
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-3">
            B2BGroeiMachine icon set
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Dunne lijnen, geometrisch, met één signaal-accent in oranje.
            24 iconen die de meest merk-bepalende plekken op de site dekken.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">
            Met accent
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border/40 border border-border/40 rounded-lg overflow-hidden">
            {entries.map(([name, Icon]) => (
              <div
                key={name}
                className="bg-background flex flex-col items-center justify-center p-6 aspect-square"
              >
                <Icon size={36} strokeWidth={1.5} />
                <span className="mt-3 text-[11px] text-muted-foreground tracking-wide">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">
            Monochroom (accent uit)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border/40 border border-border/40 rounded-lg overflow-hidden">
            {entries.map(([name, Icon]) => (
              <div
                key={name}
                className="bg-background flex flex-col items-center justify-center p-6 aspect-square text-foreground/70"
              >
                <Icon size={36} strokeWidth={1.5} accent={false} />
                <span className="mt-3 text-[11px] text-muted-foreground tracking-wide">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-6">
            Schaal-test
          </h2>
          <div className="flex items-end gap-10 p-8 border border-border/40 rounded-lg">
            {[16, 20, 24, 32, 48, 72].map((s) => {
              const Icon = bgmIcons.Signal;
              return (
                <div key={s} className="flex flex-col items-center gap-2">
                  <Icon size={s} />
                  <span className="text-[10px] text-muted-foreground">
                    {s}px
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default IconsPreview;