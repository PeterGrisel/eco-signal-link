import { useEffect } from "react";

interface BreadcrumbItem {
  name: string;
  url: string;
}

const BreadcrumbJsonLd = ({ items }: { items: BreadcrumbItem[] }) => {
  useEffect(() => {
    const id = "breadcrumb-jsonld";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    });

    return () => {
      script?.remove();
    };
  }, [items]);

  return null;
};

export default BreadcrumbJsonLd;
