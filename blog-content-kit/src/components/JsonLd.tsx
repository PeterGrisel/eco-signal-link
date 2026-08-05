import { useEffect } from "react";

interface JsonLdProps {
  id: string;
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Injects (and cleans up) a <script type="application/ld+json"> tag in <head>.
 * Use a stable `id` per schema type per page (e.g. "service-jsonld").
 */
const JsonLd = ({ id, data }: JsonLdProps) => {
  useEffect(() => {
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      script?.remove();
    };
  }, [id, data]);

  return null;
};

export default JsonLd;