GRANT SELECT, DELETE ON public.groeiplan_submissions TO authenticated;

CREATE POLICY "Admins can view groeiplan submissions"
  ON public.groeiplan_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete groeiplan submissions"
  ON public.groeiplan_submissions
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));