
-- Signal profiles (extends auth.users)
CREATE TABLE public.signal_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text,
  company text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.signal_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own signal profile"
  ON public.signal_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own signal profile"
  ON public.signal_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own signal profile"
  ON public.signal_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Journeys
CREATE TABLE public.journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.signal_profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL DEFAULT 'prospecting-v1',
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  current_layer int NOT NULL DEFAULT 1,
  score_total int NOT NULL DEFAULT 0
);

ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journeys"
  ON public.journeys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journeys"
  ON public.journeys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journeys"
  ON public.journeys FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Journey inputs
CREATE TABLE public.journey_inputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id uuid NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  layer_id int NOT NULL,
  section_type text NOT NULL,
  field_key text NOT NULL,
  value_json jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.journey_inputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journey inputs"
  ON public.journey_inputs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.journeys
      WHERE journeys.id = journey_inputs.journey_id
      AND journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own journey inputs"
  ON public.journey_inputs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.journeys
      WHERE journeys.id = journey_inputs.journey_id
      AND journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own journey inputs"
  ON public.journey_inputs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.journeys
      WHERE journeys.id = journey_inputs.journey_id
      AND journeys.user_id = auth.uid()
    )
  );

-- Blueprints
CREATE TABLE public.blueprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id uuid NOT NULL UNIQUE REFERENCES public.journeys(id) ON DELETE CASCADE,
  doc_json jsonb DEFAULT '{}'::jsonb,
  paid boolean NOT NULL DEFAULT false,
  pdf_url text,
  stripe_session_id text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blueprints"
  ON public.blueprints FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.journeys
      WHERE journeys.id = blueprints.journey_id
      AND journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own blueprints"
  ON public.blueprints FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.journeys
      WHERE journeys.id = blueprints.journey_id
      AND journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own blueprints"
  ON public.blueprints FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.journeys
      WHERE journeys.id = blueprints.journey_id
      AND journeys.user_id = auth.uid()
    )
  );

-- Agent messages
CREATE TABLE public.agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id uuid NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  layer_id int,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agent messages"
  ON public.agent_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.journeys
      WHERE journeys.id = agent_messages.journey_id
      AND journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own agent messages"
  ON public.agent_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.journeys
      WHERE journeys.id = agent_messages.journey_id
      AND journeys.user_id = auth.uid()
    )
  );

-- Add updated_at triggers
CREATE TRIGGER update_journey_inputs_updated_at
  BEFORE UPDATE ON public.journey_inputs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blueprints_updated_at
  BEFORE UPDATE ON public.blueprints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Unique constraint for journey inputs (one value per field per layer per section)
CREATE UNIQUE INDEX idx_journey_inputs_unique
  ON public.journey_inputs (journey_id, layer_id, section_type, field_key);
