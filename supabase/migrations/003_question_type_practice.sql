ALTER TABLE public.reading_attempts ADD COLUMN IF NOT EXISTS question_type_filter TEXT, ADD COLUMN IF NOT EXISTS answered_count INTEGER;
ALTER TABLE public.listening_attempts ADD COLUMN IF NOT EXISTS question_type_filter TEXT, ADD COLUMN IF NOT EXISTS answered_count INTEGER;
