"use client";
import { cn } from "@/lib/utils";
import { motion, MotionValue } from "framer-motion";
import React from "react";

const transition = { duration: 0, ease: "linear" } as const;

export const GoogleGeminiEffect = ({
  pathLengths,
  title,
  description,
  className,
  colors = ["#1E6FBF", "#4FABFF", "#8FB8FE", "#B8C2CC", "#003E7E"],
  ctaLabel,
  ctaHref,
}: {
  pathLengths: MotionValue<number>[];
  title?: string;
  description?: string;
  className?: string;
  colors?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}) => {
  return (
    <div className={cn("sticky top-40 md:top-60", className)}>
      <p className="text-3xl md:text-6xl lg:text-7xl font-display font-bold pb-2 text-foreground text-center tracking-tight leading-[1.05]">
        {title || `Build with Aceternity UI`}
      </p>
      <p className="text-sm md:text-lg font-normal text-center text-muted-foreground mt-4 max-w-2xl mx-auto px-4">
        {description ||
          `Scroll this component and see the bottom SVG come to life wow this works!`}
      </p>
      {ctaLabel && (
        <div className="flex items-center justify-center mt-8">
          <a
            href={ctaHref || "#"}
            className="font-semibold text-sm md:text-base rounded-full px-5 py-2.5 z-30 text-white"
            style={{ backgroundColor: colors[0] }}
          >
            {ctaLabel}
          </a>
        </div>
      )}
      <svg
        width="1440"
        height="890"
        viewBox="0 0 1440 890"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -top-40 md:-top-20 w-full pointer-events-none"
      >
        <motion.path
          d="M0 663C145.5 663 191 666.5 269 626C347 585.5 408.5 562.5 506.5 542.5C604.5 522.5 658 540 716 547C774 554 803.5 543.5 859 522.5C914.5 501.5 943 490.5 1024.5 490.5C1106 490.5 1168 535 1232.5 543C1297 551 1361 547 1440 547"
          stroke={colors[0]}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          style={{ pathLength: pathLengths[0] }}
          transition={transition}
        />
        <motion.path
          d="M0 587C147.5 587 145.5 587 224 587C302.5 587 351 591 419 571C487 551 543 521 615 521C687 521 729 543 791 561C853 579 893 593 977 575C1061 557 1099 511 1170 491C1241 471 1301 503 1440 503"
          stroke={colors[1]}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          style={{ pathLength: pathLengths[1] }}
          transition={transition}
        />
        <motion.path
          d="M0 514C147.5 514 195.5 514 274 514C352.5 514 395 514 478 514C561 514 593 528 671 528C749 528 802 510 880 510C958 510 1011 528 1089 528C1167 528 1212 514 1290 514C1368 514 1364.5 514 1440 514"
          stroke={colors[2]}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          style={{ pathLength: pathLengths[2] }}
          transition={transition}
        />
        <motion.path
          d="M0 438C147.5 438 145.5 438 224 438C302.5 438 351 438 419 458C487 478 543 508 615 508C687 508 729 486 791 468C853 450 893 436 977 454C1061 472 1099 518 1170 538C1241 558 1301 526 1440 526"
          stroke={colors[3]}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          style={{ pathLength: pathLengths[3] }}
          transition={transition}
        />
        <motion.path
          d="M0 364C145.5 364 191 360.5 269 401C347 441.5 408.5 464.5 506.5 484.5C604.5 504.5 658 487 716 480C774 473 803.5 483.5 859 504.5C914.5 525.5 943 536.5 1024.5 536.5C1106 536.5 1168 492 1232.5 484C1297 476 1361 480 1440 480"
          stroke={colors[4]}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          style={{ pathLength: pathLengths[4] }}
          transition={transition}
        />
      </svg>
    </div>
  );
};