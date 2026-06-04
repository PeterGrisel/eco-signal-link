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
    onClick?: () => void;
}

interface BentoGridProps {
    items: BentoItem[];
    accent?: string;
}

function BentoGrid({ items, accent }: BentoGridProps) {
    const accentStyle = accent ? { color: accent } : undefined;
    const accentBorder = accent ? { borderColor: `${accent}33` } : undefined;
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 max-w-7xl mx-auto">
            {items.map((item, index) => (
                <div
                    key={index}
                    style={accentBorder}
                    onClick={item.onClick}
                    role={item.onClick ? "button" : undefined}
                    tabIndex={item.onClick ? 0 : undefined}
                    onKeyDown={(e) => {
                        if (item.onClick && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            item.onClick();
                        }
                    }}
                    className={cn(
                        "group relative p-5 rounded-2xl overflow-hidden transition-all duration-300",
                        "border border-border bg-card",
                        "hover:shadow-[0_2px_24px_rgba(0,0,0,0.25)]",
                        "hover:-translate-y-0.5 will-change-transform",
                        item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
                        item.onClick && "cursor-pointer",
                        {
                            "shadow-[0_2px_24px_rgba(0,0,0,0.25)] -translate-y-0.5":
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
                                className="w-10 h-10 rounded-xl flex items-center justify-center bg-foreground/5 border border-border"
                                style={accentBorder}
                            >
                                <span style={accentStyle}>{item.icon}</span>
                            </div>
                            {item.status && (
                                <span
                                    className={cn(
                                        "text-[10px] font-display font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-md",
                                        item.featured
                                            ? "text-white border-0"
                                            : "bg-foreground/5 border border-border text-muted-foreground"
                                    )}
                                    style={item.featured ? { backgroundColor: accent } : accentBorder}
                                >
                                    {item.status}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-display font-bold text-foreground tracking-tight text-lg leading-tight">
                                {item.title}
                                {item.meta && (
                                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                                        {item.meta}
                                    </span>
                                )}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>

                        {(item.tags || item.cta) && (
                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                                    {item.tags?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 rounded-md bg-foreground/5 border border-border"
                                            style={accentBorder}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                {item.cta && (
                                    <span
                                        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={accentStyle}
                                    >
                                        {item.cta}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export { BentoGrid };