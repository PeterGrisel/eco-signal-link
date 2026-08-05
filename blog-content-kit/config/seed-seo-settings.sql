-- ============================================================================
-- Seed the single seo_settings row for a NEW site.
-- ----------------------------------------------------------------------------
-- Run this once after 0001_schema.sql + 0002_rls_policies.sql. Fill in the
-- values for your site. Everything the AI generator uses for identity lives
-- here; you can also edit it later in the admin Settings screen.
--
-- Only the keys that actually steer generation are included below. Any key from
-- SeoConfig (src/types/seoSettings.ts) that you omit falls back to its default.
-- ============================================================================

insert into public.seo_settings (config)
values (jsonb_build_object(
  'name',                    'Your Site',
  'site_url',                'https://example.com',
  'type',                    'Blog',
  'summary',                 'One-paragraph description of what this site does.',
  'blog_theme',              'What the blog covers and for whom. This steers every generated article.',
  'primary_language',        'Nederlands',
  'target_country',          'Nederland',
  'target_audience_summary', 'Describe your ideal reader / customer.',
  'competitor_prompt',       '',
  'glossary_focus',          'Topics the glossary should cover.',
  'brand_terms',             jsonb_build_array(),
  'tool_library_enabled',    false,
  'fixed_pages',             jsonb_build_array(
                                jsonb_build_object('title', 'Home', 'path', '/'),
                                jsonb_build_object('title', 'Blog', 'path', '/blog')
                             ),
  'cta_title',               'Ready to get started?',
  'cta_description',         'Short call-to-action shown at the end of each article.',
  'cta_button_text',         'Get in touch',
  'cta_button_url',          'https://example.com/contact'
));

-- Optional: a couple of starter categories and a content pillar so the admin
-- and blog list aren't empty on first boot.
insert into public.blog_categories (name, slug, description, sort_order) values
  ('Guides',   'guides',   'How-to guides and playbooks.', 0),
  ('Insights', 'insights', 'Opinion and analysis.',        1)
on conflict (slug) do nothing;

insert into public.content_topics (name, slug, description, sort_order) values
  ('Getting started', 'getting-started', 'Foundational topics for new readers.', 0)
on conflict (slug) do nothing;
