

# Admin Restructuring Plan

## Problem
The admin has 15 top-level nav items. For a reusable backend terminal, this is too fragmented. Several pages overlap in purpose (KPI + Analytics, Listings + Indexing + Competitors, Calendar + Autopilot + Taxonomy + Blog).

## New Structure: 6 Nav Items

```text
Current (15 items)              →  New (6 items)
─────────────────────────────      ─────────────────────────────
Command Center                 →  Dashboard (tabs: Overview, KPI)
KPI Dashboard                  ↗

Event Analytics                →  Analytics (tabs: Events, Leads)
Leads                          ↗

Blog CMS                       →  Content (tabs: Articles, Kalender, Autopilot, Strategie)
Autopilot                      ↗
Content Kalender               ↗
Content Strategie              ↗

Concurrenten                   →  SEO (tabs: Concurrenten, Listings, Indexing)
Listings                       ↗
Index Rusher                   ↗

Signaal                        →  Signaal (unchanged)

Tracking Scripts               →  System (tabs: Scripts, MCP, Settings)
MCP Server                     ↗
Settings                       ↗
```

Blog editor/generate routes stay separate (they're full-page editors).

## Technical Steps

1. **Create 6 new container pages** with tab navigation:
   - `AdminDashboard.tsx` — merges Overview + KPI as tabs
   - `AdminAnalyticsHub.tsx` — merges Analytics + Leads as tabs
   - `AdminContent.tsx` — merges Blog + Calendar + Autopilot + Taxonomy as tabs
   - `AdminSeo.tsx` — merges Competitors + Listings + Indexing as tabs
   - `AdminSignaal.tsx` — stays as-is
   - `AdminSystem.tsx` — merges Scripts + MCP + Settings as tabs

2. **Extract current page content into tab components** — move each page's inner content (everything inside `<AdminLayout>`) into standalone components (e.g., `components/admin/tabs/OverviewTab.tsx`, `KpiTab.tsx`, etc.) so each tab is clean and self-contained.

3. **Update AdminLayout sidebar** — reduce navItems from 15 to 6 with cleaner icons.

4. **Update App.tsx routes** — replace 15 routes with 6 base routes + keep blog editor routes. Old routes redirect or are removed.

5. **Update all internal `<Link>` references** — e.g. Command Center links to analytics → now tab switch within same page.

## UI Improvements
- Tabs use `Tabs`/`TabsList`/`TabsTrigger` from shadcn, consistent with existing Settings page pattern
- Each container page has a clear page title + description
- Mobile: tabs become horizontally scrollable
- Active tab persisted in URL search params (e.g. `/admin/content?tab=autopilot`) for deep linking

## What Stays Unchanged
- `AdminLayout` shell (sidebar + mobile drawer pattern)
- `AdminBlogEditor` and `AdminBlogGenerate` as standalone pages
- All data fetching logic per section
- Authentication via `useAdminAuth`

