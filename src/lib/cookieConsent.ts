export type ConsentCategory = "necessary" | "analytics" | "marketing";

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = "cookie_consent";

export const getConsent = (): ConsentPreferences | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ConsentPreferences;
  } catch {
    return null;
  }
};

export const setConsent = (prefs: Omit<ConsentPreferences, "necessary" | "timestamp">) => {
  const consent: ConsentPreferences = {
    necessary: true, // always on
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent("consent-updated", { detail: consent }));
  return consent;
};

export const hasConsent = (): boolean => getConsent() !== null;

export const hasCategory = (cat: ConsentCategory): boolean => {
  const c = getConsent();
  if (!c) return false;
  return c[cat] ?? false;
};
