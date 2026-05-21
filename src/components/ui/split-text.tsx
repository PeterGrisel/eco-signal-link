"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextSplitProps {
  children: string;
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
  maxMove?: number;
  falloff?: number;
}

export const TextSplit = ({
  children,
  className,
  topClassName,
  bottomClassName,
  maxMove = 50,
  falloff = 0.3,
}: TextSplitProps) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const getOffset = (index: number) => {
    if (hoverIndex === null) return 0;
    const distance = Math.abs(index - hoverIndex);
    return Math.max(0, maxMove * (1 - distance * falloff));
  };

  return (
    <div className={cn("flex justify-center", className)}>
      {children.split("").map((char, index) => {
        const offset = getOffset(index);
        const displayChar = char === " " ? "\u00A0" : char;

        return (
          <motion.div
            key={index}
            className="relative inline-block cursor-default"
            style={{ lineHeight: 0.9 }}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <motion.span
              className={cn("block overflow-hidden", topClassName)}
              style={{ height: "0.5em" }}
              animate={{ y: -offset }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              {displayChar}
            </motion.span>
            <motion.span
              className={cn("block overflow-hidden", bottomClassName)}
              style={{ height: "0.5em", lineHeight: 1 }}
              animate={{ y: offset }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <span style={{ display: "block", transform: "translateY(-0.5em)" }}>
                {displayChar}
              </span>
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
};