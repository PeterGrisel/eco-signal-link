import { forwardRef, SVGProps } from "react";
import { cn } from "@/lib/utils";

export interface BgmIconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number | string;
  strokeWidth?: number;
  /** Show the brand accent dot in --accent color. Defaults to true. */
  accent?: boolean;
}

/**
 * Base wrapper for B2BGroeiMachine custom icons.
 * - 24x24 viewBox, currentColor stroke, no fill
 * - Children render the icon path; a separate accent slot is colored via text-accent
 */
interface InternalProps extends BgmIconProps {
  children: React.ReactNode;
  accentNode?: React.ReactNode;
  title?: string;
}

export const BgmIcon = forwardRef<SVGSVGElement, InternalProps>(
  (
    {
      size = 24,
      strokeWidth = 1.5,
      accent = true,
      className,
      children,
      accentNode,
      title,
      ...rest
    },
    ref
  ) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("bgm-icon", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
      {accent && accentNode ? (
        <g className="text-accent" stroke="currentColor" fill="currentColor">
          {accentNode}
        </g>
      ) : null}
    </svg>
  )
);
BgmIcon.displayName = "BgmIcon";