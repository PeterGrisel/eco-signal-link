Hervatten van de eerder onderbroken build. Eén actie nodig:

**Genereer en sla ABM_PUBLISH_KEY op**
- Maak een sterke random key aan (32 bytes, hex — 64 chars).
- Plaats deze als secret `ABM_PUBLISH_KEY` zodat de edge function `abm-page-publish` requests kan authenticeren.
- Toon u de key éénmalig in chat zodat u 'm in uw ChatGPT/n8n workflow kunt plakken.

Daarna hervat ik direct de rest van de build (edge functions, frontend route `/voor/:slug`, admin UI).