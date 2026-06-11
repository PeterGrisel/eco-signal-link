import { useCurrency, CURRENCIES, CurrencyCode } from "@/contexts/CurrencyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

type Props = {
  variant?: "navbar" | "inline";
  className?: string;
};

export function CurrencySwitcher({ variant = "navbar", className = "" }: Props) {
  const { currency, setCurrency } = useCurrency();
  const meta = CURRENCIES[currency];

  const triggerBase =
    variant === "navbar"
      ? "flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-foreground/10 hover:bg-foreground/15 active:bg-foreground/20 text-foreground text-xs font-medium"
      : "flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-foreground/20 bg-background/40 hover:bg-foreground/10 text-foreground text-xs font-medium";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`${triggerBase} transition-colors touch-manipulation select-none cursor-pointer outline-none ${className}`}
        aria-label={`Currency: ${meta.label}`}
        data-no-translate
      >
        <span className="font-display">{meta.symbol}</span>
        <span className="font-display">{meta.label}</span>
        <ChevronDown className="w-3 h-3 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
          const m = CURRENCIES[code];
          const active = code === currency;
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => setCurrency(code)}
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{m.flag}</span>
                <span className="font-medium">{m.label}</span>
                <span className="text-muted-foreground text-xs">{m.symbol}</span>
              </span>
              {active && <Check className="w-3.5 h-3.5 opacity-80" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}