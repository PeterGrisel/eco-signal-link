import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { groeistackSeed, faviconFor } from "@/data/groeistack";

const ToolLogo = ({ name, website }: { name: string; website: string }) => {
  const [err, setErr] = useState(false);
  const src = faviconFor(website);
  return (
    <span className="mx-6 md:mx-9 shrink-0 inline-flex items-center gap-2.5 whitespace-nowrap select-none">
      <span className="w-7 h-7 rounded-full bg-white border border-foreground/10 flex items-center justify-center overflow-hidden shrink-0">
        {err || !src ? (
          <span className="text-[10px] font-display font-bold text-neutral-700">
            {name[0]}
          </span>
        ) : (
          <img
            src={src}
            alt={name}
            className="w-4 h-4 object-contain"
            loading="lazy"
            onError={() => setErr(true)}
          />
        )}
      </span>
      <span className="text-base md:text-lg font-display font-semibold text-foreground/55">
        {name}
      </span>
    </span>
  );
};

const LogoTicker = () => {
  // Twee kopieën zodat de marquee naadloos loopt (-50%).
  const repeated = [...groeistackSeed, ...groeistackSeed];

  return (
    <section className="border-y border-border/30 bg-background py-10">
      <div className="container mx-auto px-4 mb-6 flex items-center justify-center">
        <Link
          to="/groeistack"
          className="group inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors"
        >
          Gebouwd met de beste tools
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
      <div className="overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {repeated.map((tool, i) => (
            <ToolLogo key={i} name={tool.name} website={tool.website} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoTicker;
