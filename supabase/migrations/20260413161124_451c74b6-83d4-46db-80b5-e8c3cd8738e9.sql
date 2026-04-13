
CREATE POLICY "Admins can view all journeys"
ON public.journeys FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all agent messages"
ON public.agent_messages FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all signal profiles"
ON public.signal_profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
