import { FlowButton } from "@/components/ui/flow-button";

/**
 * De knop van de v2-site. Sinds de flow-knop is dit alleen nog de vertrouwde
 * naam eromheen: alle bestaande aanroepen blijven werken en krijgen de nieuwe
 * beweging vanzelf.
 *
 * De magnetische aantrekking die hier eerst in zat is vervallen. Twee
 * hover-effecten op één element vechten om aandacht, en de pijlen die door de
 * knop schuiven zijn het duidelijkere signaal.
 */
export function Button({
  variant = "primary",
  href,
  onClick,
  type,
  children,
}: {
  variant?: "primary" | "outline" | "invert";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  children: React.ReactNode;
}) {
  return (
    <FlowButton variant={variant} href={href} onClick={onClick} type={type}>
      {children}
    </FlowButton>
  );
}
