import React from "react";
import { cn } from "@/lib/utils";

interface GLogoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GLogoIcon: React.FC<GLogoIconProps> = ({
  size = 40,
  className,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      {...props}
    >
      <defs>
        <mask id="bgm-rings-mask">
          {/* Entire mask area is visible */}
          <rect x="0" y="0" width="100" height="100" fill="white" />
          {/* Vertical gap (stencil) */}
          <rect x="47.5" y="0" width="5" height="100" fill="black" />
          {/* Horizontal gap (stencil) */}
          <rect x="0" y="47.5" width="100" height="5" fill="black" />
        </mask>
      </defs>

      {/* Rings with mask applied */}
      <g mask="url(#bgm-rings-mask)">
        {/* Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r="41"
          stroke="currentColor"
          strokeWidth="6.5"
          fill="none"
        />
        {/* Inner Ring */}
        <circle
          cx="50"
          cy="50"
          r="29"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
        />
      </g>

      {/* Bold Geometric G in the center (unmasked for solid look) */}
      <path
        d="M 68 33 
           C 63.5 24.5 54.5 21 45 23 
           C 33 26 26.5 37 26.5 50 
           C 26.5 63 33 74 45 77 
           C 54.5 79 63.5 75.5 68 67 
           C 69.5 64 69.5 60 69.5 50 
           L 47 50 
           L 47 56 
           L 62 56 
           L 62 59 
           C 59 66 52 69.5 45 67.5 
           C 37 65.5 32.5 58 32.5 50 
           C 32.5 42 37 34.5 45 32.5 
           C 52 30.5 59 34 62 41 
           L 68 33 Z"
        fill="currentColor"
      />
    </svg>
  );
};
