ALTER TABLE public.link_targets ADD COLUMN IF NOT EXISTS pillar_slugs text[] NOT NULL DEFAULT '{}'::text[];

-- Map existing solution/sector targets to relevant pillars
UPDATE public.link_targets SET pillar_slugs = ARRAY['signal-based-prospecting'] WHERE target_url IN ('/oplossingen/signaalgebaseerde-prospecting','/oplossingen/icp-ai');
UPDATE public.link_targets SET pillar_slugs = ARRAY['outbound-engagement'] WHERE target_url IN ('/oplossingen/multichannel-sequencing','/oplossingen/linkedin-outreach');
UPDATE public.link_targets SET pillar_slugs = ARRAY['sales-operations'] WHERE target_url IN ('/oplossingen/hubspot-pipeline','/oplossingen/full-sales-management');
UPDATE public.link_targets SET pillar_slugs = ARRAY['recruitment-talent'] WHERE target_url = '/oplossingen/full-service-recruitment';
-- Sector pages are relevant to growth-systems-mkb pillar primarily, plus signal-based prospecting
UPDATE public.link_targets SET pillar_slugs = ARRAY['growth-systems-mkb','signal-based-prospecting'] WHERE target_type = 'sector';