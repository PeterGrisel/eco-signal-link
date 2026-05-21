'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Battery,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

export type ProductId = string;

export interface FeatureMetric {
  label: string;
  value: number; // 0-100
  icon: LucideIcon;
}

export interface ProductData {
  id: ProductId;
  label: string;
  eyebrow?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: 'muted' | 'primary';
  stats: {
    connectionStatus: string;
    batteryLevel: number; // 0-100
  };
  features: FeatureMetric[];
  cta?: { label: string };
}

export interface SpatialShowcaseProps {
  products: [ProductData, ProductData];
  defaultActiveId?: ProductId;
}

const ITEM: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 110, damping: 20 },
  },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)' },
};

const CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const VISUAL = (isLeft: boolean): Variants => ({
  initial: {
    opacity: 0,
    scale: 1.3,
    filter: 'blur(15px)',
    rotate: isLeft ? -20 : 20,
    x: isLeft ? -60 : 60,
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    rotate: 0,
    x: 0,
    transition: { type: 'spring', stiffness: 220, damping: 22 },
  },
  exit: {
    opacity: 0,
    scale: 0.7,
    filter: 'blur(16px)',
    transition: { duration: 0.25 },
  },
});

function ProductVisual({ data, isLeft }: { data: ProductData; isLeft: boolean }) {
  const Icon = data.icon;
  const accent = data.accent === 'primary' ? 'text-primary' : 'text-muted-foreground';
  const ring = data.accent === 'primary' ? 'border-primary/40' : 'border-foreground/15';
  const glow = data.accent === 'primary' ? 'bg-primary/30' : 'bg-foreground/10';

  return (
    <div className="relative h-[320px] md:h-[420px] w-full flex items-center justify-center">
      {/* Rings */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.6, 1.15, 0.6], opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute inset-0 m-auto h-[220px] w-[220px] md:h-[300px] md:w-[300px] rounded-full border ${ring}`}
      />
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.35, 0.05, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className={`absolute inset-0 m-auto h-[260px] w-[260px] md:h-[380px] md:w-[380px] rounded-full border ${ring} opacity-60`}
      />

      {/* Glow */}
      <div className={`absolute inset-0 m-auto h-40 w-40 md:h-56 md:w-56 rounded-full ${glow} blur-3xl opacity-70`} />

      {/* Icon plate */}
      <motion.div
        variants={VISUAL(isLeft)}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`relative z-10 flex h-32 w-32 md:h-44 md:w-44 items-center justify-center rounded-3xl border ${ring} bg-card/95 shadow-[0_1.5rem_3rem_-1rem_rgba(0,0,0,0.6)]`}
      >
        <Icon className={`h-12 w-12 md:h-16 md:w-16 ${accent}`} strokeWidth={1.5} />
      </motion.div>

      {/* Status chip */}
      <motion.div
        variants={ITEM}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-foreground/10 bg-card/95 px-3 py-1.5 backdrop-blur-sm"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${data.accent === 'primary' ? 'bg-primary' : 'bg-muted-foreground'} animate-pulse`} />
        <span className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-foreground/70">
          {data.stats.connectionStatus}
        </span>
      </motion.div>
    </div>
  );
}

function ProductDetails({ data, isLeft }: { data: ProductData; isLeft: boolean }) {
  const alignClass = isLeft ? 'items-start text-left' : 'md:items-end md:text-right items-start text-left';
  const accentText = data.accent === 'primary' ? 'text-primary' : 'text-muted-foreground';
  const accentBar = data.accent === 'primary' ? 'bg-primary' : 'bg-foreground/40';

  return (
    <motion.div
      variants={CONTAINER}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col gap-5 ${alignClass}`}
    >
      {data.eyebrow && (
        <motion.span
          variants={ITEM}
          className={`text-[11px] font-display font-bold tracking-[0.28em] uppercase ${accentText}`}
        >
          {data.eyebrow}
        </motion.span>
      )}
      <motion.h3
        variants={ITEM}
        className="font-display text-3xl md:text-4xl font-semibold leading-[1.05] tracking-tight text-foreground [text-wrap:balance]"
      >
        {data.title}
      </motion.h3>
      <motion.p
        variants={ITEM}
        className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md"
      >
        {data.description}
      </motion.p>

      {/* Feature metrics */}
      <motion.div variants={ITEM} className="grid grid-cols-2 gap-3 w-full max-w-md pt-2">
        {data.features.map((f) => {
          const FIcon = f.icon;
          return (
            <div
              key={f.label}
              className="rounded-xl border border-foreground/10 bg-card/95 p-3 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FIcon className={`h-3.5 w-3.5 ${accentText}`} strokeWidth={1.75} />
                  <span className="text-xs text-foreground/80">{f.label}</span>
                </div>
                <span className="text-xs font-display font-semibold text-foreground tabular-nums">
                  {f.value}%
                </span>
              </div>
              <div className="relative h-1 rounded-full bg-foreground/10 overflow-hidden">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${f.value}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`absolute left-0 top-0 h-full rounded-full ${accentBar}`}
                />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Battery + CTA */}
      <motion.div
        variants={ITEM}
        className={`flex flex-wrap items-center gap-4 pt-1 ${isLeft ? '' : 'md:justify-end'}`}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Battery className={`h-4 w-4 ${accentText}`} strokeWidth={1.75} />
          <span>{data.stats.batteryLevel}% capaciteit</span>
        </div>
        {data.cta && (
          <button
            type="button"
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              data.accent === 'primary'
                ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15'
                : 'border-foreground/15 bg-foreground/5 text-foreground/80 hover:bg-foreground/10'
            }`}
          >
            {data.cta.label}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function Switcher({
  products,
  activeId,
  onToggle,
}: {
  products: [ProductData, ProductData];
  activeId: ProductId;
  onToggle: (id: ProductId) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-card/95 p-1 shadow-lg">
      {products.map((p) => {
        const active = activeId === p.id;
        return (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => onToggle(p.id)}
            whileTap={{ scale: 0.96 }}
            className="relative px-5 py-2 rounded-full text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {active && (
              <motion.span
                layoutId="spatial-switcher-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className={`relative ${active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {p.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function SpatialProductShowcase({
  products,
  defaultActiveId,
}: SpatialShowcaseProps) {
  const [activeId, setActiveId] = useState<ProductId>(defaultActiveId ?? products[0].id);
  const current = products.find((p) => p.id === activeId) ?? products[0];
  const isLeft = current.id === products[0].id;

  return (
    <div className="relative w-full">
      <div className="flex justify-center mb-10">
        <Switcher products={products} activeId={activeId} onToggle={setActiveId} />
      </div>

      <div className="relative grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className={isLeft ? 'order-1' : 'order-1 md:order-2'}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + '-visual'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ProductVisual data={current} isLeft={isLeft} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={isLeft ? 'order-2' : 'order-2 md:order-1'}>
          <AnimatePresence mode="wait">
            <ProductDetails key={current.id + '-details'} data={current} isLeft={isLeft} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}