import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePageMeta } from "./usePageMeta";

const inhoud = (naam: string, attr = "property") =>
  document.head
    .querySelector(`meta[${attr}="${naam}"]`)
    ?.getAttribute("content") ?? null;

describe("usePageMeta", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("valt terug op de standaardkaart als een pagina geen eigen ogImage meegeeft", () => {
    renderHook(() => usePageMeta({ title: "Pricing", description: "Pakketten" }));

    expect(inhoud("og:image")).toBe(
      "https://www.b2bgroeimachine.io/og/default.png",
    );
    expect(inhoud("og:image:width")).toBe("1200");
    expect(inhoud("og:image:height")).toBe("630");
    expect(inhoud("og:image:type")).toBe("image/png");
    expect(inhoud("og:image:alt")).toBe("Pricing");
  });

  it("houdt de grote Twitter-card aan, ook zonder eigen ogImage", () => {
    renderHook(() => usePageMeta({ title: "Pricing" }));

    expect(inhoud("twitter:card", "name")).toBe("summary_large_image");
  });

  it("leidt het MIME-type af uit de afbeelding zelf", () => {
    renderHook(() =>
      usePageMeta({
        title: "HEGO",
        ogImage: "https://www.b2bgroeimachine.io/og/hego.jpg",
        ogImageWidth: 1536,
        ogImageHeight: 1024,
      }),
    );

    expect(inhoud("og:image:type")).toBe("image/jpeg");
    expect(inhoud("og:image:width")).toBe("1536");
    expect(inhoud("og:image:height")).toBe("1024");
  });

  it("claimt geen afmetingen bij een eigen afbeelding waarvan we de maten niet kennen", () => {
    const { rerender } = renderHook(
      ({ ogImage }: { ogImage?: string }) =>
        usePageMeta({ title: "Blog", ogImage }),
      { initialProps: {} as { ogImage?: string } },
    );
    expect(inhoud("og:image:width")).toBe("1200");

    // Client-side doorklikken naar een blogpost met een eigen CMS-afbeelding:
    // de 1200x630 van de vorige pagina mag niet blijven staan.
    rerender({ ogImage: "https://cdn.example.com/post.jpg" });

    expect(inhoud("og:image")).toBe("https://cdn.example.com/post.jpg");
    expect(inhoud("og:image:width")).toBeNull();
    expect(inhoud("og:image:height")).toBeNull();
  });
});
