"use client";

import * as React from "react";
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const processCardVariants = cva(
  "flex border backdrop-blur-lg overflow-hidden",
  {
    variants: {
      variant: {
        brand:
          "card-gradient border-glow text-foreground shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.45)]",
        light: "bg-card border-border text-foreground shadow",
      },
      size: {
        sm: "min-w-[25%] max-w-[25%]",
        md: "min-w-[50%] max-w-[50%]",
        lg: "min-w-[75%] max-w-[75%]",
        xl: "min-w-full max-w-full",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "md",
    },
  }
);

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined);

function useContainerScrollContext() {
  const ctx = React.useContext(ContainerScrollContext);
  if (!ctx)
    throw new Error("useContainerScrollContext must be used within ContainerScroll");
  return ctx;
}

export const ContainerScroll = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-[120vh] w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};

export const ContainerSticky = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "sticky top-0 left-0 w-full overflow-hidden h-[80vh] flex items-center",
      className
    )}
    {...props}
  />
));
ContainerSticky.displayName = "ContainerSticky";

export const ProcessCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "shrink-0 w-[28%] min-w-[180px] border-r border-border/40 p-6 md:p-8 flex items-end",
      className
    )}
    {...props}
  />
));
ProcessCardTitle.displayName = "ProcessCardTitle";

export const ProcessCardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 p-6 md:p-10 flex flex-col justify-center", className)}
    {...props}
  />
));
ProcessCardBody.displayName = "ProcessCardBody";

interface ProcessCardProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof processCardVariants> {
  itemsLength: number;
  index: number;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({
  className,
  style,
  variant,
  size,
  itemsLength,
  index,
  ...props
}) => {
  const { scrollYProgress } = useContainerScrollContext();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(0);
  const [vw, setVw] = React.useState(0);

  React.useEffect(() => {
    const update = () => {
      setVw(window.innerWidth);
      if (ref.current) setWidth(ref.current.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const start = index / itemsLength;
  const end = start + 1 / itemsLength;

  const x = useTransform(
    scrollYProgress,
    [start, end],
    [vw, -width * index + 64 * index]
  );

  return (
    <motion.div
      ref={ref}
      // @ts-expect-error – framer-motion style accepts MotionValue
      style={{ x: index > 0 ? x : 0, ...style }}
      className={cn(processCardVariants({ variant, size }), className)}
      {...props}
    />
  );
};
ProcessCard.displayName = "ProcessCard";

export { processCardVariants };