-- ============================================================================
-- CLEANUP: demo-organisaties verwijderen
-- Deze drie organisaties zijn handmatig aangemaakte demo-tenants met verzonnen
-- accounts/signalen/campagnes; ze stonden nooit in een migration. Verwijderen
-- cascadeert naar alle gp_*- en rt_*-kindtabellen (memberships, accounts,
-- signals, campaigns, sales_actions, runs, approvals, credentials, ...).
-- Idempotent: draait ook schoon als ze al weg zijn.
-- LET OP: raakt uitsluitend deze exacte namen — echte tenants (zoals
-- 'Core-Vision B.V.', slug core-vision) blijven onaangeroerd.
-- ============================================================================

DELETE FROM public.gp_organizations
WHERE name IN ('CoreVision Systems', 'Delta Industrial Supply', 'Northbridge Digital');
