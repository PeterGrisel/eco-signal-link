import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const APOLLO_TRACKER_NAME = "Apollo Tracker";
const BLOCKED_SCRIPT_NAMES = new Set<string>([APOLLO_TRACKER_NAME]);
const APOLLO_FORM_ENRICHMENT_NAME = "Apollo Form Enrichment";
const APOLLO_PREHIDE_ID = "apollo-form-prehide-css";
const APOLLO_SAFETY_WINDOW_MS = 15_000;

declare global {
  interface Window {
    ApolloInbound?: {
      formEnrichment?: {
        init: (config: { appId: string }) => void;
      };
    };
  }
}

const removeApolloPrehideArtifacts = () => {
  document.getElementById(APOLLO_PREHIDE_ID)?.remove();
  document.querySelectorAll("style[data-apollo-prehide='true'], [data-apollo-overlay='true']").forEach((node) => node.remove());

  [document.documentElement, document.body].forEach((element) => {
    element.classList.forEach((className) => {
      const normalized = className.toLowerCase();
      if (normalized.includes("apollo") || normalized.includes("prehide")) {
        element.classList.remove(className);
      }
    });

    const computed = window.getComputedStyle(element);
    if (computed.visibility === "hidden") element.style.visibility = "visible";
    if (computed.opacity === "0") element.style.opacity = "1";
    if (computed.pointerEvents === "none") element.style.pointerEvents = "auto";
  });
};

const removeInjectedTrackingArtifacts = () => {
  document.querySelectorAll("[data-tracking]").forEach((node) => node.remove());
  removeApolloPrehideArtifacts();
};

const containsUnsafeApolloCode = (content: string) => {
  const normalized = content.toLowerCase();

  return (
    normalized.includes("apollo.io/micro/website-tracker") ||
    normalized.includes("tracker.iife.js") ||
    normalized.includes("apollo-form-prehide-css") ||
    (normalized.includes("apollo") && normalized.includes("visibility:hidden")) ||
    (normalized.includes("apollo") && normalized.includes("visibility: hidden")) ||
    (normalized.includes("apollo") && normalized.includes("opacity:0")) ||
    (normalized.includes("apollo") && normalized.includes("opacity: 0"))
  );
};

const shouldBlockTrackingScript = (scriptName: string, scriptContent: string) => {
  if (BLOCKED_SCRIPT_NAMES.has(scriptName)) return true;

  if (scriptName !== APOLLO_FORM_ENRICHMENT_NAME && containsUnsafeApolloCode(scriptContent)) {
    return true;
  }

  return false;
};

const shouldBlockScriptTag = (tag: HTMLScriptElement, scriptName: string) => {
  const src = (tag.getAttribute("src") || "").toLowerCase();
  const content = (tag.textContent || "").toLowerCase();

  if (BLOCKED_SCRIPT_NAMES.has(scriptName)) return true;
  if (scriptName === APOLLO_FORM_ENRICHMENT_NAME) return false;

  return (
    src.includes("apollo.io") ||
    src.includes("tracker.iife.js") ||
    containsUnsafeApolloCode(content)
  );
};

const isFullscreenOverlay = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);
  const coversViewport =
    style.position === "fixed" &&
    style.top === "0px" &&
    style.left === "0px" &&
    style.width === `${window.innerWidth}px` &&
    style.height === `${window.innerHeight}px`;

  return coversViewport && (Number.parseInt(style.zIndex || "0", 10) >= 999 || style.backgroundColor === "rgb(0, 0, 0)");
};

const removeApolloMutationIfUnsafe = (node: Node) => {
  if (node instanceof HTMLStyleElement) {
    const content = (node.textContent || "").toLowerCase();
    if (
      node.id === APOLLO_PREHIDE_ID ||
      (content.includes("apollo") &&
        (content.includes("opacity:0") ||
          content.includes("opacity: 0") ||
          content.includes("visibility:hidden") ||
          content.includes("visibility: hidden")))
    ) {
      node.setAttribute("data-apollo-prehide", "true");
      node.remove();
    }
    return;
  }

  if (!(node instanceof HTMLElement) || node === document.body || node === document.documentElement) {
    return;
  }

  if (node.id === APOLLO_PREHIDE_ID) {
    node.setAttribute("data-apollo-overlay", "true");
    node.remove();
    return;
  }

  const identity = `${node.id} ${node.className}`.toLowerCase();
  if ((identity.includes("apollo") || identity.includes("prehide")) && isFullscreenOverlay(node)) {
    node.setAttribute("data-apollo-overlay", "true");
    node.remove();
  }
};

const startApolloSafetyGuard = () => {
  removeApolloPrehideArtifacts();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(removeApolloMutationIfUnsafe);
    });
    removeApolloPrehideArtifacts();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  const interval = window.setInterval(removeApolloPrehideArtifacts, 250);
  const timeout = window.setTimeout(() => {
    observer.disconnect();
    window.clearInterval(interval);
    removeApolloPrehideArtifacts();
  }, APOLLO_SAFETY_WINDOW_MS);

  return () => {
    observer.disconnect();
    window.clearInterval(interval);
    window.clearTimeout(timeout);
    removeApolloPrehideArtifacts();
  };
};

const extractApolloAppId = (scriptContent: string) => scriptContent.match(/appId\s*:\s*["']([^"']+)["']/i)?.[1] ?? null;

const injectApolloFormEnrichment = (scriptContent: string, scriptName: string) => {
  const appId = extractApolloAppId(scriptContent);
  if (!appId) {
    console.warn("[Apollo] Missing appId for form enrichment script");
    return null;
  }

  const stopApolloSafetyGuard = startApolloSafetyGuard();
  const nocache = Math.random().toString(36).substring(7);
  const script = document.createElement("script");

  script.src = `https://assets.apollo.io/js/apollo-inbound.js?nocache=${nocache}`;
  script.async = true;
  script.defer = true;
  script.setAttribute("data-tracking", scriptName);
  script.onerror = () => {
    console.error("[Apollo] Failed to load form enrichment script");
    stopApolloSafetyGuard();
  };
  script.onload = () => {
    try {
      window.ApolloInbound?.formEnrichment?.init({ appId });
    } catch (error) {
      console.error("[Apollo] Error initializing form enrichment:", error);
    } finally {
      window.setTimeout(stopApolloSafetyGuard, 2000);
    }
  };

  document.head.appendChild(script);
  return stopApolloSafetyGuard;
};

const TrackingScriptInjector = () => {
  useEffect(() => {
    const cleanupCallbacks: Array<() => void> = [];

    const injectScripts = async () => {
      removeInjectedTrackingArtifacts();

      const { hostname, pathname } = window.location;
      const isPreviewHost = hostname.endsWith(".lovableproject.com") || hostname.includes("id-preview--");
      const isAdminRoute = pathname.startsWith("/admin");

      if (isPreviewHost || isAdminRoute) {
        removeApolloPrehideArtifacts();
        return;
      }

      const { data: scripts } = await supabase
        .from("tracking_scripts")
        .select("script_content, location, name")
        .eq("is_active", true)
        .order("sort_order");

      if (!scripts?.length) return;

      scripts
        .forEach((script) => {
          if (shouldBlockTrackingScript(script.name, script.script_content)) {
            console.warn(`[Tracking] Blocked unsafe script: ${script.name}`);
            return;
          }

          if (script.name === APOLLO_FORM_ENRICHMENT_NAME) {
            const cleanup = injectApolloFormEnrichment(script.script_content, script.name);
            if (cleanup) cleanupCallbacks.push(cleanup);
            return;
          }

          const wrapper = document.createElement("div");
          wrapper.innerHTML = script.script_content;

          const scriptTags = wrapper.querySelectorAll("script");
          scriptTags.forEach((tag) => {
            if (shouldBlockScriptTag(tag, script.name)) {
              console.warn(`[Tracking] Skipped blocked script tag from: ${script.name}`);
              return;
            }

            const newScript = document.createElement("script");

            Array.from(tag.attributes).forEach((attr) => {
              newScript.setAttribute(attr.name, attr.value);
            });

            newScript.textContent = tag.textContent;
            newScript.setAttribute("data-tracking", script.name);

            if (script.location === "head") {
              document.head.appendChild(newScript);
            } else {
              document.body.appendChild(newScript);
            }
          });

          const nonScriptNodes = Array.from(wrapper.childNodes).filter(
            (node) => !(node instanceof HTMLScriptElement)
          );

          nonScriptNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              node.setAttribute("data-tracking", script.name);
              document.body.appendChild(node);
            }
          });
        });

      removeApolloPrehideArtifacts();
    };

    injectScripts();

    return () => {
      cleanupCallbacks.forEach((cleanup) => cleanup());
      removeInjectedTrackingArtifacts();
    };
  }, []);

  return null;
};

export default TrackingScriptInjector;
