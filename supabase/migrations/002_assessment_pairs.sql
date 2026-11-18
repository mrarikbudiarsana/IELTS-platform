ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS pre_assignment_id TEXT REFERENCES public.assignments(id);
