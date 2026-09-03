import { useEffect } from "react";

const APOLLO_APP_ID = "69c6494c8acf330015c85815";
const SCRIPT_ID = "apollo-inbound-script";

/**
 * Apollo Form Enrichment — veilige variant.
 * - Geen pre-hide CSS: de UI wordt nooit verborgen of geblokkeerd.
 * - Draait alleen op productie (niet in preview/localhost).
 * - Safety guard verwijdert eventuele pre-hide styles van Apollo zelf.
 */
const ApolloFormEnrichment = () => {
  useEffect(() => {
    const host = window.location.hostname;
    const isProduction =
      host === "www.b2bgroeimachine.io" || host === "b2bgroeimachine.io";
    if (!isProduction) return;

    const guard = () => {
      document.getElementById("apollo-form-prehide-css")?.remove();
      document.documentElement.style.visibility = "visible";
      document.documentElement.style.opacity = "1";
      if (document.body) {
        document.body.style.visibility = "visible";
        document.body.style.opacity = "1";
      }
    };

    const interval = window.setInterval(guard, 1000);

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://assets.apollo.io/js/apollo-inbound.js";
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error("[Apollo] Kon form enrichment script niet laden");
        guard();
      };
      script.onload = () => {
        guard();
        try {
          (window as any).ApolloInbound?.formEnrichment?.init({
            appId: APOLLO_APP_ID,
            onReady: guard,
            onError: (err: unknown) => {
              console.error("[Apollo] Form enrichment fout:", err);
              guard();
            },
          });
        } catch (err) {
          console.error("[Apollo] Init fout:", err);
          guard();
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      window.clearInterval(interval);
      guard();
    };
  }, []);

  return null;
};

export default ApolloFormEnrichment;
