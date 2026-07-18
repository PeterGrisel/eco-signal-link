-- ============================================================================
-- REBEL FORCE GTM RUNTIME — telemetrie (opdracht v3, deel I1-I3)
--   I1: providers stairoids + planable
--   I2: vijf telemetrie-skills (categorie 'telemetry', tenant_callable,
--       persist_snapshot, TTL 26 uur) -> Edge Function rt-telemetry-pull
--   I3: dagelijkse sync-cron -> Edge Function rt-telemetry-sync
-- Credential-conventie: vault://tenants/{slug}/stairoids en .../planable.
-- ============================================================================

-- ============ I1. PROVIDERS ============

INSERT INTO public.rt_providers (provider_key, name, capabilities) VALUES
  ('stairoids', 'Stairoids', ARRAY['signal_scoring']),
  ('planable',  'Planable',  ARRAY['content_stats'])
ON CONFLICT (provider_key) DO NOTHING;

-- ============ I2. TELEMETRIE-SKILLS ============

INSERT INTO public.rt_skills (skill_key, name, description, category, tenant_callable, persist_snapshot, snapshot_ttl_hours) VALUES
  ('pull_pipedrive_stats',      'Pull Pipedrive stats',      'Pipeline-, salescycle-, win/loss-, herkomst- en maandstatistieken uit Pipedrive', 'telemetry', true, true, 26),
  ('pull_heyreach_stats',       'Pull HeyReach stats',       'LinkedIn outreach-statistieken uit HeyReach', 'telemetry', true, true, 26),
  ('pull_apollo_sequence_stats','Pull Apollo sequence stats','E-mail sequence-statistieken uit Apollo', 'telemetry', true, true, 26),
  ('pull_planable_stats',       'Pull Planable stats',       'Content-statistieken uit Planable', 'telemetry', true, true, 26),
  ('pull_stairoids_scores',     'Pull Stairoids scores',     'Signal-scores uit Stairoids', 'telemetry', true, true, 26)
ON CONFLICT (skill_key) DO NOTHING;

-- Alle vijf: input {tenant_config} (source_context uit rt_tenant_playbooks),
-- implementatie via één Edge Function die op skillKey dispatcht.
-- Output-schemas volgen de DATA-blokken van het dashboard-contract; het
-- pipedrive-schema heeft geen required-keys zodat een deelfout (status
-- 'partial') de gelukte blokken kan retourneren.
INSERT INTO public.rt_skill_versions (skill_id, version, input_schema, output_schema, implementation, requires_approval, timeout_seconds)
SELECT s.id, '1.0.0', v.input_schema::jsonb, v.output_schema::jsonb, v.implementation::jsonb, false, v.timeout_seconds
FROM (VALUES
  ('pull_pipedrive_stats',
   '{"type":"object","required":["tenant_config"],"properties":{"tenant_config":{"type":"object"}},"additionalProperties":false}',
   '{"type":"object","properties":{"pipedrive":{"type":"object"},"salescycle":{"type":"object"},"winloss":{"type":"object"},"herkomst":{"type":"object"},"monthly":{"type":"array","items":{"type":"object"}},"partial":{"type":"boolean"},"errors":{"type":"array","items":{"type":"string"}}}}',
   '{"type":"supabase_edge_function","function":"rt-telemetry-pull"}', 120),
  ('pull_heyreach_stats',
   '{"type":"object","required":["tenant_config"],"properties":{"tenant_config":{"type":"object"}},"additionalProperties":false}',
   '{"type":"object","required":["uniqueLeads","connectionsSent","connectionsAccepted","acceptRate","messagesStarted","messageReplies","replyRate","interested","since"],"properties":{"uniqueLeads":{"type":"integer"},"connectionsSent":{"type":"integer"},"connectionsAccepted":{"type":"integer"},"acceptRate":{"type":"number"},"messagesStarted":{"type":"integer"},"messageReplies":{"type":"integer"},"replyRate":{"type":"number"},"inmailStarted":{"type":"integer"},"inmailReplies":{"type":"integer"},"inmailReplyRate":{"type":"number"},"interested":{"type":"integer"},"tagged":{"type":"integer"},"interestedRate":{"type":"number"},"profileViews":{"type":"integer"},"postLikes":{"type":"integer"},"since":{"type":"string"}}}',
   '{"type":"supabase_edge_function","function":"rt-telemetry-pull"}', 90),
  ('pull_apollo_sequence_stats',
   '{"type":"object","required":["tenant_config"],"properties":{"tenant_config":{"type":"object"}},"additionalProperties":false}',
   '{"type":"object","required":["contactsInSequence","emailsSent","delivered","opened","openRate","replied","replyRate","meetings"],"properties":{"contactsInSequence":{"type":"integer"},"emailsSent":{"type":"integer"},"delivered":{"type":"integer"},"opened":{"type":"integer"},"openRate":{"type":"number"},"replied":{"type":"integer"},"replyRate":{"type":"number"},"meetings":{"type":"integer"}}}',
   '{"type":"supabase_edge_function","function":"rt-telemetry-pull"}', 90),
  ('pull_planable_stats',
   '{"type":"object","required":["tenant_config"],"properties":{"tenant_config":{"type":"object"}},"additionalProperties":false}',
   '{"type":"object","required":["posts","impressions","engagement","engagementRate","since"],"properties":{"posts":{"type":"integer"},"impressions":{"type":"integer"},"engagement":{"type":"integer"},"likes":{"type":"integer"},"comments":{"type":"integer"},"shares":{"type":"integer"},"engagementRate":{"type":"number"},"pages":{"type":"array","items":{"type":"object"}},"since":{"type":"string"}}}',
   '{"type":"supabase_edge_function","function":"rt-telemetry-pull"}', 90),
  ('pull_stairoids_scores',
   '{"type":"object","required":["tenant_config"],"properties":{"tenant_config":{"type":"object"}},"additionalProperties":false}',
   '{"type":"object","required":["scored","stages","top"],"properties":{"scored":{"type":"integer"},"stages":{"type":"array","items":{"type":"object","required":["naam","min"],"properties":{"naam":{"type":"string"},"min":{"type":"integer"}}}},"top":{"type":"array","items":{"type":"object","required":["company","score"],"properties":{"company":{"type":"string"},"score":{"type":"integer"},"segment":{"type":["string","null"]},"person":{"type":["string","null"]},"role":{"type":["string","null"]},"stage":{"type":["string","null"]},"employees":{"type":["string","integer","null"]},"fit":{"type":["string","null"]}}}}}}',
   '{"type":"supabase_edge_function","function":"rt-telemetry-pull"}', 90)
) AS v(skill_key, input_schema, output_schema, implementation, timeout_seconds)
JOIN public.rt_skills s ON s.skill_key = v.skill_key
ON CONFLICT (skill_id, version) DO NOTHING;

-- Provider-routes: elke telemetrie-skill hoort bij precies één provider.
INSERT INTO public.rt_provider_routes (skill_id, provider_id, priority, quality_score, coverage_score, relative_cost)
SELECT s.id, p.id, 10, 0.9, 1.0, 0.1
FROM (VALUES
  ('pull_pipedrive_stats',       'pipedrive'),
  ('pull_heyreach_stats',        'heyreach'),
  ('pull_apollo_sequence_stats', 'apollo'),
  ('pull_planable_stats',        'planable'),
  ('pull_stairoids_scores',      'stairoids')
) AS r(skill_key, provider_key)
JOIN public.rt_skills s ON s.skill_key = r.skill_key
JOIN public.rt_providers p ON p.provider_key = r.provider_key
ON CONFLICT (skill_id, provider_id) DO NOTHING;

-- ============ I3. DAGELIJKSE SYNC-CRON ============
-- 04:30 UTC = 06:30 Europe/Amsterdam in de zomer (05:30 in de winter —
-- pg_cron kent geen tijdzones; pas desgewenst per seizoen aan).

DO $$
BEGIN
  PERFORM cron.unschedule('rt-telemetry-sync-daily');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'rt-telemetry-sync-daily',
  '30 4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://sdhsblejnzfacqafzbuc.supabase.co/functions/v1/rt-telemetry-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-rt-internal-token',
      coalesce((SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'rt/internal-token'), '')
    ),
    body := '{}'::jsonb
  );
  $$
);
