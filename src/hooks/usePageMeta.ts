import { useEffect } from "react";

/**
 * De site-brede social preview. Gegenereerd met `npm run og`, exact 1200x630.
 * Pagina's die geen eigen `ogImage` meegeven vallen hierop terug, zodat er
 * nooit een pagina zonder afbeelding — of met een gedegradeerde Twitter-card —
 * de deur uit gaat.
 */
const STANDAARD_OG = {
  url: "https://www.b2bgroeimachine.io/og/default.png",
  breedte: 1200,
  hoogte: 630,
} as const;

interface PageMeta {
  title: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  /** Alleen nodig bij een eigen `ogImage` met andere afmetingen dan 1200x630. */
  ogImageWidth?: number;
  ogImageHeight?: number;
  themeColor?: string;
  ogSiteName?: string;
  ogLocale?: string;
  twitterSite?: string;
}

/** Het MIME-type uit de extensie, zodat we niet altijd "image/png" beweren. */
const mimeVoor = (url: string): string =>
  /\.jpe?g($|\?)/i.test(url) ? "image/jpeg" : /\.webp($|\?)/i.test(url) ? "image/webp" : "image/png";

export const usePageMeta = ({ title, description, canonical, ogType, ogImage, ogImageWidth, ogImageHeight, themeColor, ogSiteName, ogLocale, twitterSite }: PageMeta) => {
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

    /** Bij client-side navigatie mogen de tags van de vorige pagina niet blijven staan. */
    const removeMeta = (name: string, attr = "name") => {
      document.querySelector(`meta[${attr}="${name}"]`)?.remove();
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

    const afbeelding = ogImage || STANDAARD_OG.url;
    // Alleen afmetingen claimen als we ze echt kennen: de standaardkaart, of een
    // eigen afbeelding waarvan de maten zijn meegegeven. Een blogafbeelding uit
    // de CMS meten de scrapers zelf wel op — liever niets dan een verkeerde crop.
    const breedte = ogImage ? ogImageWidth : STANDAARD_OG.breedte;
    const hoogte = ogImage ? ogImageHeight : STANDAARD_OG.hoogte;
    setMeta("og:image", afbeelding, "property");
    setMeta("og:image:secure_url", afbeelding, "property");
    if (breedte && hoogte) {
      setMeta("og:image:width", String(breedte), "property");
      setMeta("og:image:height", String(hoogte), "property");
    } else {
      removeMeta("og:image:width", "property");
      removeMeta("og:image:height", "property");
    }
    setMeta("og:image:type", mimeVoor(afbeelding), "property");
    setMeta("og:image:alt", title, "property");
    setMeta("twitter:image", afbeelding);
    setMeta("twitter:image:alt", title);
    setMeta("twitter:card", "summary_large_image");

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
  }, [title, description, canonical, ogType, ogImage, ogImageWidth, ogImageHeight, themeColor, ogSiteName, ogLocale, twitterSite]);
};
