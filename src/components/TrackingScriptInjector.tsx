import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const BLOCKED_SCRIPT_NAMES: string[] = [];

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

const TrackingScriptInjector = () => {
  useEffect(() => {
    const cleanup = startSafetyGuard();

    if (isPreviewOrAdmin()) return cleanup;

    const injectScripts = async () => {
      const { data: scripts } = await supabase
        .from("tracking_scripts")
        .select("script_content, location, name")
        .eq("is_active", true)
        .order("sort_order");

      if (!scripts?.length) return;

      scripts
        .filter((s) => !BLOCKED_SCRIPT_NAMES.includes(s.name))
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
    };

    injectScripts();
    return cleanup;
  }, []);

  return null;
};

export default TrackingScriptInjector;
