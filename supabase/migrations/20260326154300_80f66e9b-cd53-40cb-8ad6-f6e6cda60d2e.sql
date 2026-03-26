
-- Enable pg_net for HTTP calls from database
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Update the trigger function to also call the edge function
CREATE OR REPLACE FUNCTION public.auto_index_on_publish()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  full_url text;
  supabase_url text;
  anon_key text;
BEGIN
  IF NEW.status = 'published' AND (OLD IS NULL OR OLD.status IS DISTINCT FROM 'published') THEN
    full_url := 'https://b2bgroeimachine.io/blog/' || NEW.slug;
    
    -- Insert indexing request if URL doesn't already exist
    INSERT INTO public.indexing_requests (url, status, requested_at)
    VALUES (full_url, 'pending', now())
    ON CONFLICT (url) DO UPDATE SET status = 'pending', requested_at = now();

    -- Call the request-indexing edge function via pg_net
    PERFORM extensions.http_post(
      url := 'https://snymrcialncxkcsibkjv.supabase.co/functions/v1/request-indexing',
      body := json_build_object('url', full_url)::jsonb,
      headers := json_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNueW1yY2lhbG5jeGtjc2lia2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTY0MzcsImV4cCI6MjA5MDAzMjQzN30.LzxYO14G5rs7P2ZnkbEzvuBTjx3gGJdy_GFwD2g8nFA'
      )::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$;
