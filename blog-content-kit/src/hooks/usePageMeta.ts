import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  themeColor?: string;
  ogSiteName?: string;
  ogLocale?: string;
  twitterSite?: string;
}

export const usePageMeta = ({ title, description, canonical, ogType, ogImage, themeColor, ogSiteName, ogLocale, twitterSite }: PageMeta) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
    }

    setMeta("og:title", title, "property");
    setMeta("og:type", ogType || "website", "property");
    setMeta("og:url", canonical || window.location.href, "property");
    if (ogSiteName) setMeta("og:site_name", ogSiteName, "property");
    if (ogLocale) setMeta("og:locale", ogLocale, "property");
    if (ogImage) {
      setMeta("og:image", ogImage, "property");
      setMeta("og:image:secure_url", ogImage, "property");
      setMeta("og:image:width", "1200", "property");
      setMeta("og:image:height", "630", "property");
      setMeta("og:image:type", "image/png", "property");
      setMeta("og:image:alt", title, "property");
      setMeta("twitter:image", ogImage);
      setMeta("twitter:image:alt", title);
    }
    setMeta("twitter:card", ogImage ? "summary_large_image" : "summary");
    setMeta("twitter:title", title);
    if (description) setMeta("twitter:description", description);
    if (twitterSite) {
      setMeta("twitter:site", twitterSite);
      setMeta("twitter:creator", twitterSite);
    }
    if (themeColor) {
      setMeta("theme-color", themeColor);
      setMeta("msapplication-TileColor", themeColor);
    }

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, canonical, ogType, ogImage, themeColor, ogSiteName, ogLocale, twitterSite]);
};