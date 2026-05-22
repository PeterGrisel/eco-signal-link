'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Code2, Copy, Rocket, Zap, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  icon?: LucideIcon;
  featureIcons?: LucideIcon[];
  className?: string;
}

export default function CardFlip({
  title = 'Build MVPs Fast',
  subtitle = 'Launch your idea in record time',
  description = 'Copy, paste, customize—and launch your MVP faster than ever.',
  features = ['Copy & Paste Ready', 'Developer-First', 'MVP Optimized', 'Zero Setup'],
  icon: Icon = Rocket,
  featureIcons,
  className,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const icons = featureIcons ?? [Copy, Code2, Rocket, Zap];
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return (
    <div
      className={cn(
        'relative h-[360px] w-full [perspective:1600px] group outline-none focus:outline-none focus-visible:outline-none',
        className,
      )}
      onMouseEnter={canHover ? () => setIsFlipped(true) : undefined}
      onMouseLeave={canHover ? () => setIsFlipped(false) : undefined}
      onClick={!canHover ? () => setIsFlipped((v) => !v) : undefined}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div
        className={cn(
          'relative h-full w-full rounded-2xl transition-transform duration-700 ease-out [transform-style:preserve-3d]',
          isFlipped && '[transform:rotateY(180deg)]',
        )}
      >
        {/* FRONT */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-foreground/10 bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

          {/* Animated streaks */}
          <div className="absolute inset-x-0 top-6 bottom-28 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                style={{
                  top: `${15 + i * 14}%`,
                  animation: `flipcard-slide ${3 + (i % 3)}s linear ${i * 0.35}s infinite`,
                }}
              />
            ))}

            {/* Central icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold leading-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {subtitle}
                </p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4 text-primary" strokeWidth={1.75} />
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-primary/30 bg-card/90 backdrop-blur-sm overflow-hidden shadow-lg p-6 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>

          <ul className="relative mt-5 space-y-2.5">
            {features.map((feature, index) => {
              const IconComponent = icons[index % icons.length];
              return (
                <li key={index} className="flex items-center gap-3 text-sm text-foreground/85">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-foreground/10 bg-foreground/5">
                    <IconComponent className="h-3 w-3 text-primary" strokeWidth={1.75} />
                  </span>
                  {feature}
                </li>
              );
            })}
          </ul>

          <div className="relative mt-auto pt-5 flex items-center justify-between text-sm text-primary">
            <span className="font-medium">Bekijk meer</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flipcard-slide {
          0% { transform: translateX(-120px); opacity: 0; }
          50% { opacity: 0.9; }
          100% { transform: translateX(360px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}