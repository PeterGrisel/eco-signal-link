
-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION public.auto_index_on_publish()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  full_url text;
BEGIN
  IF NEW.status = 'published' AND (OLD IS NULL OR OLD.status IS DISTINCT FROM 'published') THEN
    full_url := 'https://b2bgroeimachine.io/blog/' || NEW.slug;
    INSERT INTO public.indexing_requests (url, status, requested_at)
    VALUES (full_url, 'pending', now())
    ON CONFLICT (url) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Step 2: Create trigger
CREATE TRIGGER trg_auto_index_on_publish
  AFTER INSERT OR UPDATE OF status ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_index_on_publish();
