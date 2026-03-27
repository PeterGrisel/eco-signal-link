DELETE FROM public.indexing_requests a USING public.indexing_requests b WHERE a.id > b.id AND a.url = b.url;

ALTER TABLE public.indexing_requests ADD CONSTRAINT indexing_requests_url_key UNIQUE (url);