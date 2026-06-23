
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cta_variant text;

ALTER TABLE public.blog_categories
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS description text;

INSERT INTO public.blog_categories (name, slug, sort_order, description) VALUES
  ('Signal-Based Prospecting', 'signal-based-prospecting', 10, 'Intent signals, account scoring, market maps, buying committees en triggers.'),
  ('Outbound & Engagement', 'outbound-engagement', 20, 'E-mail, LinkedIn, calling, sequencing, personalisatie en deliverability.'),
  ('Sales Operations & Follow-up', 'sales-operations', 30, 'SQL-definitie, routing, CRM, opvolging, dashboards en conversie.'),
  ('Growth Systems MKB & Groothandel', 'growth-systems-mkb', 40, 'Sectorcases, processen, cross-sell en slapende accounts.'),
  ('Recruitment & Talent', 'recruitment-talent', 90, 'Signaalgebaseerde recruitment en talent acquisitie.')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      sort_order = EXCLUDED.sort_order,
      description = EXCLUDED.description;
