import { useState, useEffect, useCallback } from "react";

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

  const toggle = useCallback(() => {
    if (!window.Weglot) return;
    const next = lang === "nl" ? "en" : "nl";
    window.Weglot.switchTo(next);
  }, [lang]);

  if (!ready) return <div className="w-[58px] h-[28px]" aria-hidden />;

  const current = FLAGS[lang] || FLAGS.nl;
  const other = lang === "nl" ? FLAGS.en : FLAGS.nl;

  return (
    <button
      type="button"
      onClick={toggle}
      onTouchEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-foreground/10 hover:bg-foreground/15 active:bg-foreground/20 transition-colors text-foreground text-xs font-medium touch-manipulation select-none cursor-pointer"
      style={{ WebkitTapHighlightColor: "transparent" }}
      title={`Switch to ${other.label}`}
      aria-label={`Switch language to ${other.label}`}
    >
      <span className="text-sm leading-none">{current.emoji}</span>
      <span className="font-display">{current.label}</span>
    </button>
  );
}