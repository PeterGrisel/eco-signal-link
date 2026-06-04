
CREATE POLICY "Public read abm-assets"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'abm-assets');

CREATE POLICY "Admins write abm-assets"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'abm-assets' AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'abm-assets' AND has_role(auth.uid(), 'admin'::app_role));
