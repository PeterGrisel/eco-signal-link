import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CurrencyCode = "EUR" | "USD" | "GBP";

export const CURRENCIES: Record<CurrencyCode, { symbol: string; locale: string; flag: string; label: string }> = {
  EUR: { symbol: "€", locale: "nl-NL", flag: "🇪🇺", label: "EUR" },
  USD: { symbol: "$", locale: "en-US", flag: "🇺🇸", label: "USD" },
  GBP: { symbol: "£", locale: "en-GB", flag: "🇬🇧", label: "GBP" },
};

const FALLBACK_RATES: Record<CurrencyCode, number> = { EUR: 1, USD: 1.08, GBP: 0.85 };
const STORAGE_KEY = "bgm-currency";
const RATES_KEY = "bgm-fx-rates";
const RATES_TTL_MS = 24 * 60 * 60 * 1000;

function detectCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "EUR";
  const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
  if (stored && stored in CURRENCIES) return stored;
  const langs = navigator.languages || [navigator.language];
  for (const l of langs) {
    const lower = l.toLowerCase();
    if (lower.includes("gb") || lower === "en-uk") return "GBP";
    if (lower.includes("us") || lower === "en-ca") return "USD";
  }
  return "EUR";
}

type Ctx = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  rates: Record<CurrencyCode, number>;
  symbol: string;
  locale: string;
  /** Convert an amount in EUR to the active currency and format with symbol. */
  format: (eurAmount: number, opts?: Intl.NumberFormatOptions) => string;
  /** Convert EUR base to active currency (number only). */
  convert: (eurAmount: number) => number;
  /** Format a number already in the active currency (no conversion). Useful for calculators where inputs are user-entered in the chosen currency. */
  formatLocal: (amount: number, opts?: Intl.NumberFormatOptions) => string;
  ready: boolean;
};

const CurrencyCtx = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [ready, setReady] = useState(false);

  // Init currency from localStorage / browser
  useEffect(() => {
    setCurrencyState(detectCurrency());
  }, []);

  // Load rates (cached in localStorage, refreshed via edge function)
  useEffect(() => {
    let cancelled = false;
    try {
      const raw = localStorage.getItem(RATES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.rates && Date.now() - parsed.ts < RATES_TTL_MS) {
          setRates({ ...FALLBACK_RATES, ...parsed.rates });
          setReady(true);
        }
      }
    } catch {}

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("fx-rates");
        if (error) throw error;
        if (cancelled) return;
        const r = data?.rates as Record<string, number> | undefined;
        if (r) {
          const next: Record<CurrencyCode, number> = {
            EUR: 1,
            USD: Number(r.USD) || FALLBACK_RATES.USD,
            GBP: Number(r.GBP) || FALLBACK_RATES.GBP,
          };
          setRates(next);
          localStorage.setItem(RATES_KEY, JSON.stringify({ ts: Date.now(), rates: next }));
        }
      } catch (e) {
        console.warn("fx-rates load failed, using fallback", e);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch {}
  }, []);

  const value = useMemo<Ctx>(() => {
    const meta = CURRENCIES[currency];
    const rate = rates[currency] ?? 1;
    const convert = (eur: number) => eur * rate;
    const formatLocal = (amount: number, opts?: Intl.NumberFormatOptions) => {
      const n = new Intl.NumberFormat(meta.locale, opts).format(amount);
      return `${meta.symbol}${n}`;
    };
    const format = (eur: number, opts?: Intl.NumberFormatOptions) => formatLocal(convert(eur), opts);
    return {
      currency,
      setCurrency,
      rates,
      symbol: meta.symbol,
      locale: meta.locale,
      format,
      convert,
      formatLocal,
      ready,
    };
  }, [currency, rates, setCurrency, ready]);

  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>;
}

export function useCurrency(): Ctx {
  const ctx = useContext(CurrencyCtx);
  if (!ctx) {
    // Graceful fallback if provider missing (e.g. isolated previews)
    const meta = CURRENCIES.EUR;
    return {
      currency: "EUR",
      setCurrency: () => {},
      rates: FALLBACK_RATES,
      symbol: meta.symbol,
      locale: meta.locale,
      format: (n) => `${meta.symbol}${new Intl.NumberFormat(meta.locale).format(n)}`,
      convert: (n) => n,
      formatLocal: (n) => `${meta.symbol}${new Intl.NumberFormat(meta.locale).format(n)}`,
      ready: true,
    };
  }
  return ctx;
}