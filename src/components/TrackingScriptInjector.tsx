import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getConsent, hasCategory, type ConsentPreferences } from "@/lib/cookieConsent";

const BLOCKED_SCRIPT_NAMES: string[] = [];

/** Map tracking_scripts.name → consent category. Default = marketing */
const SCRIPT_CATEGORY_MAP: Record<string, "analytics" | "marketing"> = {
  "Google Tag Manager": "analytics",
  "GA4": "analytics",
  "Google Analytics": "analytics",
  // everything else defaults to "marketing"
};

const getScriptCategory = (name: string): "analytics" | "marketing" =>
  SCRIPT_CATEGORY_MAP[name] ?? "marketing";

const isPreviewOrAdmin = () => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  return (
    hostname.includes("lovableproject.com") ||
    hostname.includes("id-preview--") ||
    pathname.startsWith("/admin")
  );
};

const startSafetyGuard = () => {
  const fix = () => {
    const prehide = document.getElementById("apollo-form-prehide-css");
    if (prehide) prehide.remove();
    document.documentElement.style.setProperty("visibility", "visible", "important");
    document.documentElement.style.setProperty("opacity", "1", "important");
    document.body.style.setProperty("visibility", "visible", "important");
    document.body.style.setProperty("opacity", "1", "important");
  };

  fix();
  const observer = new MutationObserver(fix);
  observer.observe(document.head, { childList: true, subtree: true });
  observer.observe(document.body, { childList: true, subtree: true });
  const interval = setInterval(fix, 15000);

  return () => {
    observer.disconnect();
    clearInterval(interval);
  };
};

const removeInjectedScripts = () => {
  document.querySelectorAll("[data-tracking]").forEach((el) => el.remove());
};

const TrackingScriptInjector = () => {
  const injectScripts = useCallback(async () => {
    if (isPreviewOrAdmin()) return;

    const consent = getConsent();
    if (!consent) return; // no consent yet — inject nothing

    // Remove previously injected scripts before re-injecting
    removeInjectedScripts();

    const { data } = await supabase.functions.invoke("get-tracking-scripts");
    const scripts = (data as { scripts?: Array<{ script_content: string; location: string; name: string }> } | null)?.scripts;

    if (!scripts?.length) return;

    scripts
      .filter((s) => !BLOCKED_SCRIPT_NAMES.includes(s.name))
      .filter((s) => hasCategory(getScriptCategory(s.name)))
      .forEach((script) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = script.script_content;

        const scriptTags = wrapper.querySelectorAll("script");
        scriptTags.forEach((tag) => {
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
  }, []);

  useEffect(() => {
    const cleanup = startSafetyGuard();

    // Inject on mount if consent already given
    injectScripts();

    // Re-inject when consent changes
    const handleConsent = () => injectScripts();
    window.addEventListener("consent-updated", handleConsent);

    return () => {
      cleanup();
      window.removeEventListener("consent-updated", handleConsent);
    };
  }, [injectScripts]);

  return null;
};

export default TrackingScriptInjector;
