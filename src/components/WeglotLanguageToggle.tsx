import { useState, useEffect, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

declare global {
  interface Window {
    Weglot?: {
      getCurrentLang: () => string;
      switchTo: (lang: string) => void;
      on: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

const FLAGS: Record<string, { emoji: string; label: string }> = {
  nl: { emoji: "🇳🇱", label: "NL" },
  en: { emoji: "🇬🇧", label: "EN" },
};

const ORDER: Array<"nl" | "en"> = ["nl", "en"];

export function WeglotLanguageToggle() {
  const [lang, setLang] = useState("nl");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.Weglot) {
        setLang(window.Weglot.getCurrentLang());
        setReady(true);
        window.Weglot.on("languageChanged", (newLang: string) => {
          setLang(newLang);
        });
      }
    };
    if (window.Weglot) {
      check();
    } else {
      const interval = setInterval(() => {
        if (window.Weglot) {
          check();
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  const switchTo = useCallback((next: "nl" | "en") => {
    if (next === lang) return;
    const path = window.location.pathname;
    const stripped = path.replace(/^\/en(\/|$)/, "/");
    const target = next === "en"
      ? `/en${stripped === "/" ? "" : stripped}`
      : stripped;
    window.location.assign(target + window.location.search + window.location.hash);
  }, [lang]);

  if (!ready) return <div className="w-[58px] h-[28px]" aria-hidden />;

  const current = FLAGS[lang] || FLAGS.nl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-foreground/10 hover:bg-foreground/15 active:bg-foreground/20 transition-colors text-foreground text-xs font-medium touch-manipulation select-none cursor-pointer outline-none"
        aria-label={`Language: ${current.label}`}
        data-no-translate
      >
        <span className="text-sm leading-none">{current.emoji}</span>
        <span className="font-display">{current.label}</span>
        <ChevronDown className="w-3 h-3 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {ORDER.map((code) => {
          const m = FLAGS[code];
          const active = code === lang;
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => switchTo(code)}
              className="flex items-center justify-between gap-2 cursor-pointer"
              data-no-translate
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{m.emoji}</span>
                <span className="font-medium">{m.label}</span>
              </span>
              {active && <Check className="w-3.5 h-3.5 opacity-80" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}