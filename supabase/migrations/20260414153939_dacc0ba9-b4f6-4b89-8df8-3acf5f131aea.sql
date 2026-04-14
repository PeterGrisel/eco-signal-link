
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  journey_id UUID REFERENCES public.journeys(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  sector TEXT,
  expertise TEXT[] DEFAULT '{}'::TEXT[],
  tagline TEXT,
  website TEXT,
  linkedin_url TEXT,
  avatar_url TEXT,
  referral_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved & visible partners
CREATE POLICY "Anyone can view approved partners"
  ON public.partners FOR SELECT
  TO public
  USING (is_visible = true AND is_approved = true);

-- Users can view their own partner profile
CREATE POLICY "Users can view own partner profile"
  ON public.partners FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own partner profile
CREATE POLICY "Users can insert own partner profile"
  ON public.partners FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own partner profile
CREATE POLICY "Users can update own partner profile"
  ON public.partners FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all partners
CREATE POLICY "Admins can manage all partners"
  ON public.partners FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
