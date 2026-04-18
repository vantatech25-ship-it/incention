-- Updates
CREATE TABLE public.fundraiser_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fundraiser_id UUID NOT NULL REFERENCES public.fundraisers(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Withdrawals
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fundraiser_id UUID NOT NULL REFERENCES public.fundraisers(id),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id),
  amount BIGINT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  stripe_transfer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Social Shares
CREATE TABLE public.social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fundraiser_id UUID NOT NULL REFERENCES public.fundraisers(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  sharer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_fundraisers_status ON public.fundraisers(status);
CREATE INDEX idx_fundraisers_slug ON public.fundraisers(slug);
CREATE INDEX idx_donations_fundraiser ON public.donations(fundraiser_id);
CREATE INDEX idx_donations_status ON public.donations(status);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.fundraisers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;
