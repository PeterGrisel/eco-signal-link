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
let _blockedIPs: Set<string> | null = null;
let _myIP: string | null = null;

const fetchBlockedIPs = async (): Promise<Set<string>> => {
  if (_blockedIPs) return _blockedIPs;
  const { data } = await supabase.from("blocked_tracking_ips").select("ip_address");
  _blockedIPs = new Set((data || []).map(r => r.ip_address));
  // Refresh every 5 minutes
  setTimeout(() => { _blockedIPs = null; }, 5 * 60 * 1000);
  return _blockedIPs;
};

const getMyIP = async (): Promise<string> => {
  if (_myIP) return _myIP;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const json = await res.json();
    _myIP = json.ip;
    return _myIP!;
  } catch { return ""; }
};

const isBlockedIP = async (): Promise<boolean> => {
  const [blocked, ip] = await Promise.all([fetchBlockedIPs(), getMyIP()]);
  return ip ? blocked.has(ip) : false;
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
};

// ── Internal tracking (fire & forget) ──
const sendInternalEvent = async (
  eventName: string,
  category: string,
  label?: string,
  metadata?: Record<string, unknown>
) => {
  if (await shouldSkipTracking()) return;

  supabase
    .from("site_events")
    .insert([{
      event_name: eventName,
      event_category: category,
      event_label: label || null,
      page_path: window.location.pathname,
      referrer: document.referrer || null,
      session_id: getSessionId(),
      metadata: (metadata || {}) as Json,
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
