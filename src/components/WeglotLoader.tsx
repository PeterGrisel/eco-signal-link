import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const WEGLOT_API_KEY = "wg_3da90dbc1a8d5951ec0ddba41250ae4e3";
const WEGLOT_SCRIPT_ID = "weglot-client";
const TRANSLATION_DELAYS = [0, 250, 700, 1300, 2400, 4000];

type SupportedLang = "nl" | "en";

const getUrlLanguage = (): SupportedLang => {
  if (typeof window === "undefined") return "nl";
  return /^\/en(\/|$)/.test(window.location.pathname) ? "en" : "nl";
};

const getWeglot = () => (typeof window === "undefined" ? undefined : (window as any).Weglot);

const loadWeglotScript = () =>
  new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(WEGLOT_SCRIPT_ID) as HTMLScriptElement | null;
    if (getWeglot()?.initialize || getWeglot()?.initialized) {
      resolve();
      return;
    }
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = WEGLOT_SCRIPT_ID;
    script.src = "https://cdn.weglot.com/weglot.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });

const switchWeglotTo = (target: SupportedLang, force = false) => {
  const Weglot = getWeglot();
  if (!Weglot?.switchTo || !Weglot.initialized) return;

  try {
    const current = Weglot.getCurrentLang?.();
    if (force && target === "en" && current === "en") {
      Weglot.switchTo("nl");
      window.setTimeout(() => Weglot.switchTo("en"), 80);
      return;
    }
    if (current !== target || force) Weglot.switchTo(target);
  } catch {
    // Weglot can throw during early initialization. Later retries handle it.
  }
};

const initializeOrSyncWeglot = (target: SupportedLang) => {
  const Weglot = getWeglot();
  if (!Weglot) return;

  document.documentElement.lang = target;
  (window as any).__WG_LANG = target;

  if (!Weglot.initialized && Weglot.initialize) {
    Weglot.on?.("initialized", () => switchWeglotTo(target, target === "en"));
    Weglot.initialize({
      api_key: WEGLOT_API_KEY,
      auto_switch: false,
      cache: true,
      hide_switcher: true,
      wait_transition: true,
    });
  }

  TRANSLATION_DELAYS.forEach((delay, index) => {
    window.setTimeout(() => switchWeglotTo(target, target === "en" && index === 2), delay);
  });
};

const WeglotLoader = () => {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    const target = getUrlLanguage();
    document.documentElement.lang = target;
    (window as any).__WG_LANG = target;

    loadWeglotScript()
      .then(() => {
        if (!cancelled) initializeOrSyncWeglot(target);
      })
      .catch(() => {
        document.documentElement.lang = target;
      });

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search]);

  return null;
};

export default WeglotLoader;