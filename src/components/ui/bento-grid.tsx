"use client";

import { cn } from "@/lib/utils";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
  featured?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
  accent?: string;
}

function BentoGrid({ items, accent }: BentoGridProps) {
  const accentBorder = accent ? { borderColor: `${accent}66` } : undefined;
  const iconBg = accent ? { backgroundColor: `${accent}26`, color: accent } : undefined;
  const tagStyle = accent ? { backgroundColor: `${accent}1f`, color: accent, borderColor: `${accent}55` } : undefined;
  const statusStyle = accent ? { backgroundColor: `${accent}1f`, color: accent, borderColor: `${accent}55` } : undefined;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 max-w-7xl mx-auto">
      {items.map((item, index) => (
        <div
          key={index}
          style={item.featured ? accentBorder : undefined}
          className={cn(
            "group relative p-4 rounded-xl overflow-hidden transition-all duration-300",
            "border border-border bg-card/60 backdrop-blur-sm",
            "hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] hover:border-foreground/25",
            "hover:-translate-y-0.5 will-change-transform",
            item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
            {
              "shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] -translate-y-0.5":
                item.hasPersistentHover,
            }
          )}
        >
          <div
            className={`absolute inset-0 ${
              item.hasPersistentHover
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-300`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--foreground)/0.04)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

          <div className="relative flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div
                style={iconBg}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-foreground/10 text-foreground border border-foreground/15 transition-all duration-300"
              >
                {item.icon}
              </div>
              <span
                style={statusStyle}
                className={cn(
                  "text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full border",
                  "bg-foreground/10 text-foreground border-foreground/20",
                  "transition-colors duration-300"
                )}
              >
                {item.status || "Active"}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground tracking-tight text-[15px] md:text-base">
                {item.title}
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  {item.meta}
                </span>
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    style={tagStyle}
                    className="px-2 py-1 rounded-md bg-foreground/10 text-foreground/85 border border-foreground/15 backdrop-blur-sm transition-all duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {item.cta || "Explore →"}
              </span>
            </div>
          </div>

          <div
            className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-foreground/10 to-transparent ${
              item.hasPersistentHover
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-300`}
          />
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };