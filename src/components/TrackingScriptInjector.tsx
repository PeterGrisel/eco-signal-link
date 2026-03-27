import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const BLOCKED_SCRIPT_NAMES = new Set<string>();

const removeInjectedTrackingArtifacts = () => {
  document.querySelectorAll("[data-tracking]").forEach((node) => node.remove());
  document.getElementById("apollo-form-prehide-css")?.remove();
};

const TrackingScriptInjector = () => {
  useEffect(() => {
    const injectScripts = async () => {
      removeInjectedTrackingArtifacts();

      const { hostname, pathname } = window.location;
      const isPreviewHost = hostname.endsWith(".lovableproject.com") || hostname.includes("id-preview--");
      const isAdminRoute = pathname.startsWith("/admin");

      if (isPreviewHost || isAdminRoute) {
        return;
      }

      const { data: scripts } = await supabase
        .from("tracking_scripts")
        .select("script_content, location, name")
        .eq("is_active", true)
        .order("sort_order");

      if (!scripts?.length) return;

      scripts
        .filter((script) => !BLOCKED_SCRIPT_NAMES.has(script.name))
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

    return () => {
      removeInjectedTrackingArtifacts();
    };
  }, []);

  return null;
};

export default TrackingScriptInjector;
