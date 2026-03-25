import { supabase } from "@/integrations/supabase/client";

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
const sendInternalEvent = (
  eventName: string,
  category: string,
  label?: string,
  metadata?: Record<string, unknown>
) => {
  supabase
    .from("site_events")
    .insert({
      event_name: eventName,
      event_category: category,
      event_label: label || null,
      page_path: window.location.pathname,
      referrer: document.referrer || null,
      session_id: getSessionId(),
      metadata: metadata || {},
    })
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
