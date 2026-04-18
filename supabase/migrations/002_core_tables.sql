-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Fundraisers
CREATE TABLE public.fundraisers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  story TEXT NOT NULL,
  goal_amount BIGINT NOT NULL,
  raised_amount BIGINT DEFAULT 0,
  donor_count INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  cover_image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'active', 'paused', 'completed', 'rejected')),
  is_featured BOOLEAN DEFAULT false,
  beneficiary_name TEXT,
  beneficiary_relation TEXT,
  location TEXT,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.fundraisers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active fundraisers" ON public.fundraisers FOR SELECT
  USING (status = 'active' OR organizer_id = auth.uid());
CREATE POLICY "Organizers can create fundraisers" ON public.fundraisers FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own fundraisers" ON public.fundraisers FOR UPDATE
  USING (auth.uid() = organizer_id);

-- Donations
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fundraiser_id UUID NOT NULL REFERENCES public.fundraisers(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES public.profiles(id),
  amount BIGINT NOT NULL,
  tip_amount BIGINT DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  donor_name TEXT NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  stripe_payment_intent_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Donations are viewable by public if succeeded" ON public.donations FOR SELECT
  USING (status = 'succeeded');
CREATE POLICY "Allow public inserts for donations" ON public.donations FOR INSERT
  WITH CHECK (true);
