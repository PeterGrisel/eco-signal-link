
# B2Bgroeimachine.io Portal — bouwplan

De uploads beschrijven een multi-tenant portal met drie omgevingen (klant, Rebel Force ops, platform admin), 8 rollen, ~25 database-entiteiten en een publieke configurator. Dat is te groot voor één iteratie. We volgen de bijgeleverde build checklist: **Fase 1 = demo-klaar**, daarna Fase 2 en 3.

Alles komt naast de bestaande marketing-site te leven onder nieuwe routes. De huidige homepage, blog, admin en pricing blijven ongewijzigd.

## Fase 1 — Demo-klare klantomgeving (deze sprint)

**Routes**
- `/app/login` — auth
- `/app` — Mijn Groeimachine (dashboard)
- `/app/onboarding`, `/app/signalen`, `/app/sales-acties`, `/app/campagnes`, `/app/resultaten`, `/app/service`, `/app/instellingen`

**Backend (één migratie, Lovable Cloud)**
- Enum `user_role` (8 waarden uit spec)
- Tabellen: `organizations`, `profiles`, `organization_members`, `markets`, `icps`, `accounts`, `contacts`, `signals`, `campaigns`, `sales_actions`, `onboarding_projects`, `onboarding_tasks`, `service_requests`
- Alle rijen scoped op `organization_id`
- Security-definer functies: `has_role(user_id, role)`, `is_org_member(user_id, org_id)`, `current_org_ids(user_id)`
- RLS: klant ziet alleen rijen waar `organization_id` in `current_org_ids(auth.uid())`. Rebel Force rollen zien alles.
- GRANT SELECT/INSERT/UPDATE/DELETE aan `authenticated`, GRANT ALL aan `service_role`, geen `anon`.
- Trigger `handle_new_user` op `auth.users` → maakt `profiles` rij.

**Seed-data** (edge function `seed-demo` of SQL insert)
- 3 demo-organisaties uit `04_demo_data.md`: Delta Industrial Supply, Northbridge Digital, CoreVision Systems, met accounts/contacten/signalen/salesacties/campagnes volgens de opgegeven aantallen.

**UI-shell**
- Nieuwe `AppLayout` met linker sidebar (nav uit spec), topbar met org-switcher als user in meerdere orgs zit.
- shadcn kaarten, tabellen, badges. Dark theme + brand accent #E8945A blijft consistent met bestaande site.
- Copy in NL, B1, "u/uw".

**Views per pagina** — exact volgens `05_ux_informatiearchitectuur.md`:
- Dashboard: statuskaart + 6 KPI's + "Deze week" narratief + prioriteit-tabel + funnel + top-signalen
- Onboarding: 7 mijlpalen met status/eigenaar/deadline
- Signalen: tabel + detail-drawer, knop "Zet om naar salesactie"
- Sales acties: tabel met statussen en uitkomsten uit spec
- Campagnes: kaartweergave per campagne met doel/kanalen/resultaat
- Resultaten: 4 blokken (marktdekking, engagement, salesactivatie, commerciële impact)
- Service: aanvraagformulier met 8 request-types + eigen ticketlijst

## Fase 2 — Rebel Force Operations Console

- Routes onder `/ops` met eigen layout, alleen toegankelijk voor rollen `rebel_force_admin`, `growth_manager`, `growth_operator`, `super_admin`
- Klantenlijst, Provisioning Kanban (10 kolommen uit prompt 2), Signal management, Sales Handover, Taken, Service desk, Costs & Margin, Product Catalog
- Extra tabellen: `subscriptions`, `products`, `product_modules`, `cost_items`, `monthly_metrics`, `activity_logs`

## Fase 3 — Publieke configurator + eerste echte workflow

- `/configureer` — 6-staps wizard uit prompt 4 (doel, markt, coverage, kanalen, servicemodel, samenvatting) → creëert `service_request` van type "Nieuwe klantaanvraag"
- Eén echte klant, één ICP, één markt, één signaalbron, één CRM-koppeling live
- Documenten, integrations, opportunities, notifications tabellen erbij

## Wat we bewust NIET bouwen (uit checklist)

Geen checkout, geen facturatie, geen custom campagne-builder voor klanten, geen live inbox provisioning, geen CRM-vervanging, geen attribution.

## Technische details

- Auth: Lovable Cloud email/password + Google. Signup laat gebruiker geen org kiezen — Rebel Force koppelt via `organization_members` (of via invite-link fase 2).
- Rollen in `organization_members.role`, niet op profiles. `has_role` security-definer voorkomt RLS-recursie.
- Bestaande `src/pages/admin/*` (marketing/CMS admin) blijft gescheiden van `/ops` (growth operations). Kunnen we later samenvoegen.
- Copy centraal per view (geen `copy.ts` uitbreiden — dat is marketing-only).
- Alle mutaties via supabase-js direct vanuit componenten; edge functions alleen voor seed en later voor integraties.

## Wat ik als eerste build-actie doe na goedkeuring

**Alleen Fase 1 tot en met "signalen + salesacties werkend met demo-data"**. Concreet:
1. Database-migratie met alle Fase 1 tabellen + RLS + GRANTs
2. Auth-config + `AppLayout` + login/route-guard
3. Seed-functie met de 3 demo-klanten
4. Dashboard, Signalen, Sales acties, Onboarding pagina's werkend
5. Campagnes, Resultaten, Service als lees-alleen shells (invulling in vervolgsprint)

Daarna terug voor review en Fase 2.

## Open vraag die ik met defaults invul, tenzij u anders zegt

- **Inloggen**: standaard email/password + Google. Klanten worden handmatig aangemaakt door Rebel Force (geen self-signup in Fase 1).
- **Org-switcher**: alleen tonen als user in meerdere orgs zit. Uw eigen account krijgt `super_admin` en toegang tot alle 3 demo-orgs.
