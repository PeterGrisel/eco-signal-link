import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

// ── Admin detection ──
let _isAdmin: boolean | null = null;

const isAdminUser = async (): Promise<boolean> => {
  if (_isAdmin !== null) return _isAdmin;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { _isAdmin = false; return false; }
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    _isAdmin = !!data;
  } catch { _isAdmin = false; }
  return _isAdmin;
};

// Reset cache on auth state change
supabase.auth.onAuthStateChange(() => { _isAdmin = null; });

// ── IP blocklist ──
let _blockedResult: boolean | null = null;
const isBlockedIP = async (): Promise<boolean> => {
  if (_blockedResult !== null) return _blockedResult;
  try {
    const { data } = await supabase.functions.invoke("check-ip-blocked");
    _blockedResult = !!(data && (data as { blocked?: boolean }).blocked);
  } catch {
    _blockedResult = false;
  }
  setTimeout(() => { _blockedResult = null; }, 5 * 60 * 1000);
  return _blockedResult;
};

const shouldSkipTracking = async (): Promise<boolean> => {
  const [admin, blocked] = await Promise.all([isAdminUser(), isBlockedIP()]);
  return admin || blocked;
};

// ── Session ID (persists per browser session) ──
const getSessionId = (): string => {
  let sid = sessionStorage.getItem("b2b_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("b2b_session_id", sid);
  }
  return sid;
};

// ── UTM capture (persist first-touch attribution per session) ──
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
type UtmKey = typeof UTM_KEYS[number];
type UtmData = Partial<Record<UtmKey | "landing_page" | "referrer" | "captured_at", string>>;

const UTM_STORAGE_KEY = "b2b_utm_attribution";
const UTM_COOKIE_NAME = "b2b_utm_attribution";
const UTM_COOKIE_MAX_AGE_DAYS = 90;

const readUtmCookie = (): UtmData | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${UTM_COOKIE_NAME}=`));
  if (!match) return null;
  try {
    const raw = decodeURIComponent(match.split("=").slice(1).join("="));
    return JSON.parse(raw) as UtmData;
  } catch {
    return null;
  }
};

const writeUtmCookie = (data: UtmData) => {
  if (typeof document === "undefined") return;
  const maxAge = UTM_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  const value = encodeURIComponent(JSON.stringify(data));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const domain = window.location.hostname;
  // Set on root path; rely on host-only cookie (no Domain attr) to avoid leaking to unrelated subdomains.
  document.cookie = `${UTM_COOKIE_NAME}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
  void domain;
};

/** Normaliseer en valideer UTM-waarden. Alleen alfanumeriek, streepje, underscore en punt toegestaan. */
const normalizeUtmValue = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Max 100 tekens per UTM-waarde (Google Analytics limiet is ruimer, dit is conservatief)
  const clamped = trimmed.slice(0, 100);

  // Alleen toegestane tekens: a-z, A-Z, 0-9, -, _, ., spatie
  // Whitespace wordt getrimmed, overige ongeldige tekens worden verwijderd
  const cleaned = clamped
    .replace(/[^\w\s\-.]/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;

  // lowercase voor consistentie
  return cleaned.toLowerCase();
};

const captureUtmParams = (): UtmData => {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  // Read fresh UTM from current URL (if any)
  const fromUrl: UtmData = {};
  let hasUrlUtm = false;
  for (const key of UTM_KEYS) {
    const raw = params.get(key);
    if (!raw) continue;
    const normalized = normalizeUtmValue(raw);
    if (normalized) {
      fromUrl[key] = normalized;
      hasUrlUtm = true;
    }
  }

  // First-touch attribution: prefer cookie (persists ~90 days across sessions),
  // fall back to sessionStorage (legacy), then capture fresh.
  const cookieData = readUtmCookie();
  const sessionRaw = sessionStorage.getItem(UTM_STORAGE_KEY);
  const sessionData: UtmData | null = sessionRaw
    ? (() => { try { return JSON.parse(sessionRaw) as UtmData; } catch { return null; } })()
    : null;

  // If we already have first-touch UTM stored, keep it (first-touch wins).
  const stored = cookieData ?? sessionData;
  const storedHasUtm = stored && UTM_KEYS.some((k) => stored[k]);

  if (storedHasUtm) {
    // Make sure cookie mirrors stored data (e.g. migrated from sessionStorage).
    if (!cookieData) writeUtmCookie(stored!);
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(stored));
    return stored!;
  }

  // No prior first-touch UTM → record current visit (with or without UTM)
  const captured: UtmData = hasUrlUtm ? fromUrl : {};
  captured.landing_page = window.location.pathname;
  captured.referrer = document.referrer || "";
  captured.captured_at = new Date().toISOString();

  sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
  // Only persist to cookie when we actually captured UTM params (avoid locking in an empty record).
  if (hasUrlUtm) writeUtmCookie(captured);
  return captured;
};

/** Get the stored UTM attribution for the current session (captures on first call). */
export const getUtmAttribution = (): UtmData => captureUtmParams();

// Capture immediately on module load so first-visit URL params are saved
// even if the user navigates away before any event fires.
if (typeof window !== "undefined") {
  captureUtmParams();
}

// ── GA4 helper ──
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const sendGA4Event = (
  eventName: string,
  params: Record<string, string | number | boolean | undefined>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
  // Also push to GTM dataLayer so any downstream tag (Leadinfo, Ads, LinkedIn, etc.) can listen.
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });
  }
};

// ── Internal tracking (fire & forget) ──
const sendInternalEvent = async (
  eventName: string,
  category: string,
  label?: string,
  metadata?: Record<string, unknown>
) => {
  if (await shouldSkipTracking()) return;

  const utm = captureUtmParams();
  const enrichedMetadata = { ...(metadata || {}), utm };

  supabase
    .from("site_events")
    .insert([{
      event_name: eventName,
      event_category: category,
      event_label: label || null,
      page_path: window.location.pathname,
      referrer: document.referrer || null,
      session_id: getSessionId(),
      metadata: enrichedMetadata as Json,
    }])
    .then(({ error }) => {
      if (error) console.warn("[tracking] insert error:", error.message);
    });
};

// ── Public API ──

/** Track a CTA button click */
export const trackCTA = (label: string, destination?: string) => {
  sendInternalEvent("cta_click", "cta", label, { destination });
  sendGA4Event("cta_click", {
    event_category: "cta",
    event_label: label,
    destination,
  });
};

/** Track a form submission */
export const trackFormSubmit = (formName: string, metadata?: Record<string, unknown>) => {
  sendInternalEvent("form_submit", "form", formName, metadata);
  sendGA4Event("form_submit", {
    event_category: "form",
    event_label: formName,
  });
};

/** Track navigation clicks */
export const trackNavClick = (label: string, to: string) => {
  sendInternalEvent("nav_click", "navigation", label, { to });
  sendGA4Event("nav_click", {
    event_category: "navigation",
    event_label: label,
    link_url: to,
  });
};

/** Track page views (called from router) */
export const trackPageView = (path: string) => {
  sendInternalEvent("page_view", "navigation", path);
  sendGA4Event("page_view", {
    page_path: path,
  });
};

/** Generic event */
export const trackEvent = (
  name: string,
  category: string,
  label?: string,
  metadata?: Record<string, unknown>
) => {
  sendInternalEvent(name, category, label, metadata);
  sendGA4Event(name, {
    event_category: category,
    event_label: label,
  });
};

// ── Scroll depth tracking ──
let _scrollTracked = new Set<number>();
let _scrollListenerActive = false;

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return;
  const pct = Math.round((scrollTop / docHeight) * 100);

  for (const threshold of [25, 50, 75, 90, 100]) {
    if (pct >= threshold && !_scrollTracked.has(threshold)) {
      _scrollTracked.add(threshold);
      sendInternalEvent("scroll_depth", "engagement", `${threshold}%`, {
        depth_percent: threshold,
      });
      sendGA4Event("scroll_depth", {
        event_category: "engagement",
        event_label: `${threshold}%`,
        depth_percent: threshold,
      });
    }
  }
};

/** Start tracking scroll depth on current page. Call once per page. */
export const trackScrollDepth = () => {
  if (_scrollListenerActive) {
    window.removeEventListener("scroll", handleScroll);
  }
  _scrollTracked = new Set<number>();
  _scrollListenerActive = true;
  window.addEventListener("scroll", handleScroll, { passive: true });
};

/** Stop scroll tracking (call on page leave). */
export const stopScrollDepth = () => {
  window.removeEventListener("scroll", handleScroll);
  _scrollListenerActive = false;
};

// ── Time on page tracking ──
let _pageEnteredAt: number | null = null;
let _currentPath: string | null = null;

/** Start time-on-page timer for a path. */
export const startTimeOnPage = (path: string) => {
  // Flush previous page time
  flushTimeOnPage();
  _pageEnteredAt = Date.now();
  _currentPath = path;
};

/** Send time-on-page event for the current page. */
export const flushTimeOnPage = () => {
  if (_pageEnteredAt && _currentPath) {
    const seconds = Math.round((Date.now() - _pageEnteredAt) / 1000);
    if (seconds >= 3) {
      sendInternalEvent("time_on_page", "engagement", _currentPath, {
        seconds,
        path: _currentPath,
      });
      sendGA4Event("time_on_page", {
        event_category: "engagement",
        event_label: _currentPath,
        seconds,
      });
    }
  }
  _pageEnteredAt = null;
  _currentPath = null;
};

// Flush on tab close / navigate away
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", flushTimeOnPage);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushTimeOnPage();
  });
}
