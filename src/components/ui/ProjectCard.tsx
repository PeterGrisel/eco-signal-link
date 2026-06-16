import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imgSrc?: string;
  title: string;
  description: string;
  link: string;
  linkText?: string;
  icon?: React.ComponentType<any>;
  number?: string;
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ className, imgSrc, title, description, link, linkText = "Ontdek meer", icon: Icon, number, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card/90 shadow-xl transition-all duration-300 hover:border-primary/40 hover:bg-background/40 hover:shadow-primary/5 hover:shadow-2xl",
          className
        )}
        {...props}
      >
        {/* Card Image Section */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-foreground/5 bg-neutral-950">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            // Premium dark-tech animated gradient & grid fallback when no image is loaded
            <div className="absolute inset-0 flex items-center justify-center bg-grid-pattern overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              <div className="absolute -inset-[10px] bg-radial-glow opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              {Icon && (
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/[0.03] text-primary shadow-inner transition-transform duration-500 ease-out group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/[0.08]">
                  <Icon className="h-6 w-6 stroke-[1.5]" />
                </div>
              )}
            </div>
          )}
          
          {/* Top-aligned Metadata overlay */}
          {number && (
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="text-[11px] font-display font-bold tabular-nums text-primary/70 tracking-wider bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-foreground/10">
                {number}
              </span>
            </div>
          )}
        </div>

        {/* Card Content Section */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary mb-2.5">
              {title}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground line-clamp-3 mb-6">
              {description}
            </p>
          </div>

          {/* Card Link/CTA */}
          <div className="mt-auto pt-4 border-t border-foreground/5">
            <a
              href={link}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-semibold text-primary/90 hover:text-primary transition-colors group/link"
              onClick={(e) => e.stopPropagation()}
            >
              <span>{linkText}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export { ProjectCard };
